# Find out more about this configuration in the following Fargate/Terraform tutorial: https://section411.com/2019/07/hello-world/

locals {
  appOwner   = "api-freshman-yr"
  categoryId = "services.core.app"
  team       = "platform"
  vpcSlug    = "platform-vpc"
}

variable "access_key" {
  type        = string
  description = "AWS Access Key ID"
}

variable "secret_key" {
  type        = string
  description = "AWS Secret Access Key" 
}

variable "account_id" {
  type        = string
  description = "AWS Account ID"
  default     = ""
}

provider "aws" {
  access_key                  = var.access_key
  secret_key                  = var.secret_key 
  profile                     = "default"
  region                      = "us-east-1"
  version                     = "~> 2.0"
}

provider "environment" {
  #Custom "utility provider REQUIRED for including local environment variables automatically #injected in Terraform Cloud workers as part of a Terraform configuration.
  # You MUST include the terraform plugin file in `/tf/terraform.d/plugins/linux_amd64`
  # folder for this utility provider to work 
}

data "environment_variable" "git_branch_name" {
  name = "TFC_CONFIGURATION_VERSION_GIT_BRANCH"
  fail_if_empty = true
  normalize_file_path = true
}

data "environment_variable" "git_commit_sha" {
  name = "TFC_CONFIGURATION_VERSION_GIT_COMMIT_SHA"
  fail_if_empty = true
  normalize_file_path = true
}

data "aws_ssm_parameter" "stripe_secret_key" {
  name = "/dev/api-freshman-yr/vendor/stripe/secret-key"
}

data "aws_ssm_parameter" "plaid_client_id" {
  name = "/dev/api-freshman-yr/vendor/plaid/client-id"
}

data "aws_ssm_parameter" "plaid_secret" {
  name = "/dev/api-freshman-yr/vendor/plaid/secret"
}

data "aws_ssm_parameter" "muenster_datasource_username" {
  name = "/dev/api-freshman-yr/datasources/muenster/username"
}

data "aws_ssm_parameter" "muenster_datasource_password" {
  name = "/dev/api-freshman-yr/datasources/muenster/password"
}

data "aws_ssm_parameter" "muenster_datasource_hostname" {
  name = "/dev/api-freshman-yr/datasources/muenster/hostname"
}

data "aws_ssm_parameter" "data_service_host" {
  name = "/dev/api-freshman-yr/services/core-data/hostname"
}

output "git_branch_name" {
  value = data.environment_variable.git_branch_name.value
}

output "git_commit_sha" {
  value = data.environment_variable.git_commit_sha.value
}

resource "aws_ecs_cluster" "api-freshman-yr" {
  name = "api-freshman-yr"
}

# Configuration for Cloudwatch Logs
resource "aws_cloudwatch_log_group" "api-freshman-yr" {
  name = "/ecs/api-freshman-yr"
}

resource "aws_cloudwatch_log_group" "api-freshman-yr-core-data-service" {
  name = "/ecs/api-freshman-yr/data-service"
}


# ecs.tf
resource "aws_ecs_service" "api-freshman-yr" {
  name            = "api-freshman-yr"
  task_definition = "${aws_ecs_task_definition.api-freshman-yr.family}:${aws_ecs_task_definition.api-freshman-yr.revision}"
  cluster         = "${aws_ecs_cluster.api-freshman-yr.id}"
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
     assign_public_ip = false

    security_groups = [
      "${aws_security_group.egress-all.id}",
      "${aws_security_group.api-ingress.id}",
    ]

    subnets = [
      "${aws_subnet.subnet_us_east_1b_priv.id}"
    ]
  }

  load_balancer {
    target_group_arn = "${aws_lb_target_group.api-freshman-yr.arn}"
    container_name   = "api-freshman-yr"
    container_port   = "3001"
  }
}

# Defines the task that will be running to provide our service. 
# If the service decides it needs more capacity,
# this task definition provides a blueprint for building an identical container.
#
resource "aws_ecs_task_definition" "api-freshman-yr" {
  family = "api-freshman-yr"
  execution_role_arn = "${aws_iam_role.api-freshman-yr-task-execution-role.arn}"

  container_definitions = <<EOF
  [
    {
      "name": "api-freshman-yr",
      "image": "${var.account_id}.dkr.ecr.us-east-1.amazonaws.com/api-freshman-yr:${substr(data.environment_variable.git_commit_sha.value, 0, 7)}",
      "portMappings": [
        {
          "containerPort": 3001
        }
      ],
      "environment": [{
        "name": "NODE_ENV",
        "value": "dev"
      },
      {
        "name": "MUENSTER_DATASOURCE_USERNAME",
        "value": "${data.aws_ssm_parameter.muenster_datasource_username.value}"
      },
      {
        "name": "MUENSTER_DATASOURCE_PASSWORD",
        "value": "${data.aws_ssm_parameter.muenster_datasource_password.value}"
      },
      {
        "name": "MUENSTER_DATASOURCE_HOST",
        "value": "${data.aws_ssm_parameter.muenster_datasource_hostname.value}"
      },
      {
        "name": "DATA_SERVICE_HOST",
        "value": "${data.aws_ssm_parameter.data_service_host.value}"
      },
      {
        "name": "PLAID_CLIENT_ID",
        "value": "${data.aws_ssm_parameter.plaid_client_id.value}"
      },
      {
        "name": "PLAID_SECRET",
        "value": "${data.aws_ssm_parameter.plaid_secret.value}"
      },
      {
        "name": "STRIPE_SECRET_KEY",
        "value": "${data.aws_ssm_parameter.stripe_secret_key.value}"
      }],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-region": "us-east-1",
          "awslogs-group": "/ecs/api-freshman-yr",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
  EOF

  # These are the minimum values for Fargate containers.
  cpu = 256
  memory = 512
  requires_compatibilities = ["FARGATE"]

  # This is required for Fargate containers.
  network_mode = "awsvpc"

  tags = {
    categoryId = "${local.categoryId}"
  }
}

resource "aws_ecs_service" "api-freshman-yr-core-data-serivce" {
  name            = "api-freshman-yr-core-data-service"
  task_definition = "${aws_ecs_task_definition.api-freshman-yr-core-data-service.family}:${aws_ecs_task_definition.api-freshman-yr-core-data-service.revision}"
  cluster         = "${aws_ecs_cluster.api-freshman-yr.id}"
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
     assign_public_ip = false

    security_groups = [
      "${aws_security_group.egress-all.id}",
      "${aws_security_group.api-ingress.id}",
    ]

    subnets = [
      "${aws_subnet.subnet_us_east_1b_priv.id}"
    ]
  }

  load_balancer {
    target_group_arn = "${aws_lb_target_group.api-freshman-yr.arn}"
    container_name   = "api-freshman-yr-core-data-service"
    container_port   = "3000"
  }
}

resource "aws_ecs_task_definition" "api-freshman-yr-core-data-service" {
  family = "api-freshman-yr-core-data-service"
  execution_role_arn = "${aws_iam_role.api-freshman-yr-task-execution-role.arn}"

  container_definitions = <<EOF
  [
    {
      "name": "api-freshman-yr-core-data-service",
      "image": "${var.account_id}.dkr.ecr.us-east-1.amazonaws.com/api-freshman-yr-core-data-service:${substr(data.environment_variable.git_commit_sha.value, 0, 7)}",
      "portMappings": [
        {
          "containerPort": 3000
        }
      ],
      "environment": [{
        "name": "DATABASE_HOST",
        "value": "${data.aws_ssm_parameter.muenster_datasource_hostname.value}"
      },
      {
        "name": "DATABASE_USER",
        "value": "${data.aws_ssm_parameter.muenster_datasource_username.value}"
      },
      {
        "name": "DATABASE_PASSWORD",
        "value": "${data.aws_ssm_parameter.muenster_datasource_password.value}"
      },
      {
        "name": "DATABASE_NAME",
        "value": "muenster"
      }],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-region": "us-east-1",
          "awslogs-group": "/ecs/api-freshman-yr-core-data-service",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
  EOF

  # These are the minimum values for Fargate containers.
  cpu = 256
  memory = 512
  requires_compatibilities = ["FARGATE"]

  # This is required for Fargate containers.
  network_mode = "awsvpc"
}

resource "aws_lb_target_group" "api-freshman-yr" {
  name = "api-freshman-yr"
  port = 3001
  protocol = "HTTP"
  target_type = "ip"
  vpc_id = "${aws_vpc.app_vpc.id}"

  health_check {
    enabled = true
    path = "/status"
  }

  depends_on = [
    aws_alb.api-freshman-yr
  ]
}

resource "aws_lb_target_group" "api-freshman-yr-core-data-service" {
  name = "api-freshman-yr-core-data-service"
  port = 3000
  protocol = "HTTP"
  target_type = "ip"
  vpc_id = "${aws_vpc.app_vpc.id}"

  health_check {
    enabled = true
    path = "/_health"
  }

  depends_on = [
    aws_alb.api-freshman-yr
  ]
}

resource "aws_alb" "api-freshman-yr" {
  name = "api-freshman-yr-lb"
  internal = false
  load_balancer_type = "application"

  subnets = [
    "${aws_subnet.subnet_us_east_1a_pub.id}",
    "${aws_subnet.subnet_us_east_1b_priv.id}",
  ]

  security_groups = [
    "${aws_security_group.http.id}",
    "${aws_security_group.https.id}",
    "${aws_security_group.egress-all.id}",
  ]

  depends_on = ["aws_internet_gateway.igw"]

  tags = {
    categoryId = "${local.categoryId}"
  }
}

resource "aws_alb_listener" "api-freshman-yr-http" {
  load_balancer_arn = "${aws_alb.api-freshman-yr.arn}"
  port = "80"
  protocol = "HTTP"

  default_action {
    type = "forward"
    target_group_arn = "${aws_lb_target_group.api-freshman-yr.arn}"
  }
}

output "alb_url" {
  value = "http://${aws_alb.api-freshman-yr.dns_name}"
}

# This is the role under which ECS will execute our task. This role becomes more important
# as we add integrations with other AWS services later on.

# The assume_role_policy field works with the following aws_iam_policy_document to allow
# ECS tasks to assume this role we're creating.
resource "aws_iam_role" "api-freshman-yr-task-execution-role" {
  name = "api-freshman-yr-task-execution-role"
  assume_role_policy = "${data.aws_iam_policy_document.ecs-task-assume-role.json}"
}

data "aws_iam_policy_document" "ecs-task-assume-role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

# Normally we'd prefer not to hardcode an ARN in our Terraform, but since this is an AWS-managed
# policy, it's okay.
data "aws_iam_policy" "ecs-task-execution-role" {
  arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Attach the above policy to the execution role.
resource "aws_iam_role_policy_attachment" "ecs-task-execution-role" {
  role = "${aws_iam_role.api-freshman-yr-task-execution-role.name}"
  policy_arn = "${data.aws_iam_policy.ecs-task-execution-role.arn}"
}

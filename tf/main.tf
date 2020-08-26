# Find out more about this configuration in the following Fargate/Terraform tutorial: https://section411.com/2019/07/hello-world/

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
  depends_on = [aws_ssm_parameter.muenster_datasource_username]
  name       = "/dev/api-freshman-yr/datasources/muenster/username"
}

data "aws_ssm_parameter" "muenster_datasource_password" {
  depends_on = [aws_ssm_parameter.muenster_datasource_password]
  name       = "/dev/api-freshman-yr/datasources/muenster/password"
}

data "aws_ssm_parameter" "muenster_datasource_hostname" {
  depends_on = [aws_ssm_parameter.muenster_datasource_hostname]
  name       = "/dev/api-freshman-yr/datasources/muenster/hostname"
}

data "aws_ssm_parameter" "data_service_hostname" {
  depends_on = [aws_ssm_parameter.data_service_hostname]
  name = "/dev/api-freshman-yr/services/data/hostname"
}

resource "aws_ecs_cluster" "freshman-yr" {
  name = "freshman-yr"
}

# Configuration for Cloudwatch Logs
resource "aws_cloudwatch_log_group" "freshman-yr" {
  name = "/ecs/freshman-yr/edge-proxy"
}

# ecs.tf
resource "aws_ecs_service" "freshman-yr" {
  name            = "edge-proxy"
  task_definition = "${aws_ecs_task_definition.edge-proxy.family}:${aws_ecs_task_definition.edge-proxy.revision}"
  cluster         = aws_ecs_cluster.freshman-yr.id
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
    target_group_arn = aws_lb_target_group.edge_proxy.arn
    container_name   = "edge-proxy"
    container_port   = "3001"
  }
}

# Defines the task that will be running to provide our service. 
# If the service decides it needs more capacity,
# this task definition provides a blueprint for building an identical container.
#
resource "aws_ecs_task_definition" "edge-proxy" {
  family = "edge-proxy"
  execution_role_arn = aws_iam_role.default-task-execution-role.arn

  container_definitions = <<EOF
  [
    {
      "name": "edge-proxy",
      "image": "${var.account_id}.dkr.ecr.us-east-1.amazonaws.com/freshman-yr/edge-proxy:${substr(data.environment_variable.git_commit_sha.value, 0, 7)}",
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
        "value": "${data.aws_ssm_parameter.data_service_hostname.value}"
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
          "awslogs-group": "/ecs/freshman-yr/edge-proxy",
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
    categoryId = local.categoryId
  }
}

resource "aws_lb_target_group" "edge_proxy" {
  name = "edge-proxy"
  port = 3001
  protocol = "HTTP"
  target_type = "ip"
  vpc_id = aws_vpc.app_vpc.id

  health_check {
    enabled = true
    path = "/_health"
  }

  depends_on = [
    aws_alb.edge_proxy
  ]
}

resource "aws_alb" "edge_proxy" {
  name = "edge-proxy-lb"
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
    "${aws_security_group.api-ingress.id}"
  ]

  depends_on = [aws_internet_gateway.igw]

  tags = {
    appOwner   = local.appOwner
    categoryId = local.categoryId
  }
}

resource "aws_alb_listener" "edge-proxy-http" {
  load_balancer_arn = aws_alb.edge_proxy.arn
  port = "80"
  protocol = "HTTP"

  default_action {
    type = "forward"
    target_group_arn = aws_lb_target_group.edge_proxy.arn
  }
}

# This is the role under which ECS will execute our task. This role becomes more important
# as we add integrations with other AWS services later on.

# The assume_role_policy field works with the following aws_iam_policy_document to allow
# ECS tasks to assume this role we're creating.
resource "aws_iam_role" "default-task-execution-role" {
  name = "default-task-execution-role"
  assume_role_policy = data.aws_iam_policy_document.ecs-task-assume-role.json
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
  role = aws_iam_role.default-task-execution-role.name
  policy_arn = data.aws_iam_policy.ecs-task-execution-role.arn
}

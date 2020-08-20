

# Configuration for Cloudwatch Logs
resource "aws_cloudwatch_log_group" "api-freshman-yr-core-data-service" {
  name = "/ecs/api-freshman-yr-core-data-service"
}

# ecs.tf
resource "aws_ecs_service" "api-freshman-yr-core-data-serivce" {
  name            = "api-freshman-yr"
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

# Defines the task that will be running to provide our service. 
# If the service decides it needs more capacity,
# this task definition provides a blueprint for building an identical container.
#
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
        "value": "${data.aws_ssm_parameter.datasource_muenster_hostname.value}"
      },
      {
        "name": "DATABASE_USER",
        "value": "${data.aws_ssm_parameter.datasource_muenster_username.value}"
      },
      {
        "name": "DATABASE_PASSWORD",
        "value": "${data.aws_ssm_parameter.datasource_muenster_password.value}"
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
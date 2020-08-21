resource "aws_cloudwatch_log_group" "data_service" {
  name = "/ecs/api-freshman-yr-data-service"
}

resource "aws_ecs_service" "data_serivce" {
  name            = "data-service"
  task_definition = "${aws_ecs_task_definition.data_service.family}:${aws_ecs_task_definition.data_service.revision}"
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
    container_name   = "data-service"
    container_port   = "3000"
  }
}

resource "aws_ecs_task_definition" "data_service" {
  family = "data-service"
  execution_role_arn = "${aws_iam_role.api-freshman-yr-task-execution-role.arn}"

  container_definitions = <<EOF
  [
    {
      "name": "data-service",
      "image": "${var.account_id}.dkr.ecr.us-east-1.amazonaws.com/api-freshman-yr-data-service:${substr(data.environment_variable.git_commit_sha.value, 0, 7)}",
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
          "awslogs-group": "/ecs/api-freshman-yr-data-service",
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
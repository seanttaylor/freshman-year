##############################################################
# Data sources to get VPC, subnets and security group details
##############################################################
#data "aws_vpc" "default" {
#  default = true
#}

data "aws_subnet_ids" "all" {
  vpc_id = "${aws_vpc.app-vpc.id}"
}

data "aws_security_group" "default" {
  vpc_id = "${aws_vpc.app-vpc.id}"
  name   = "default"
}

#####
# DB
#####
module "db" {
  source = "terraform-aws-modules/rds/aws"
  version = "~> 2.0"

  identifier = "api-freshman-yr-db"

  # All available versions: http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_MySQL.html#MySQL.Concepts.VersionMgmt
  engine            = "mysql"
  engine_version    = "5.7.19"
  instance_class    = "db.t2.large"
  allocated_storage = 5
  storage_encrypted = false

  # kms_key_id        = "arm:aws:kms:<region>:<accound id>:key/<kms key id>"
  name     = "muenster"
  username = "user"
  password = "YourPwdShouldBeLongAndSecure!"
  port     = "3306"

  vpc_security_group_ids = [data.aws_security_group.default.id]

  maintenance_window = "Mon:00:00-Mon:03:00"
  backup_window      = "03:00-06:00"

  multi_az = true

  # disable backups to create DB faster
  backup_retention_period = 0

  tags = {
    Owner       = "user"
    Environment = "dev"
  }

  enabled_cloudwatch_logs_exports = ["audit", "general"]

  # DB subnet group
  subnet_ids = data.aws_subnet_ids.all.ids

  # DB parameter group
  family = "mysql5.7"

  # DB option group
  major_engine_version = "5.7"

  # Snapshot name upon DB deletion
  final_snapshot_identifier = "muenster"

  # Database Deletion Protection
  deletion_protection = false

  parameters = [
    {
      name  = "character_set_client"
      value = "utf8"
    },
    {
      name  = "character_set_server"
      value = "utf8"
    }
  ]

  options = [
    {
      option_name = "MARIADB_AUDIT_PLUGIN"

      option_settings = [
        {
          name  = "SERVER_AUDIT_EVENTS"
          value = "CONNECT"
        },
        {
          name  = "SERVER_AUDIT_FILE_ROTATIONS"
          value = "37"
        },
      ]
    },
  ]
}

#####
# SSM
#####

resource "aws_ssm_parameter" "datasource_muenster_connection_uri" {
  name         = "/dev/api-freshman-yr/datasources/muenster/connection-uri"
  type         = "String"
  description  = "Datasource connection URI (e.g. MySQL connection string)"
  value        = "${module.db.this_db_instance_endpoint}"
}

resource "aws_ssm_parameter" "datasource_muenster_username" {
  name         = "/dev/api-freshman-yr/datasources/muenster/username"
  type         = "String"
  description  = "Datasource username"
  value        = "${module.db.this_db_instance_username}"
}

resource "aws_ssm_parameter" "datasource_muenster_password" {
  name         = "/dev/api-freshman-yr/datasources/muenster/password"
  type         = "String"
  description  = "Datasource password"
  value        = "${module.db.this_db_instance_password}"
}

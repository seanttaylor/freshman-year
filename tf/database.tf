locals {
    databaseName = "muenster"
}

resource "aws_db_instance" "muenster" {
    depends_on             = [aws_db_subnet_group.muenster]
    vpc_security_group_ids = [aws_security_group.sg_mysql_aurora.id]
    db_subnet_group_name   = "${local.databaseName}"
    allocated_storage      = 20
    publicly_accessible    = true
    storage_type           = "gp2"
    engine                 = "mysql"
    engine_version         = "5.7"
    instance_class         = "db.t2.micro"
    identifier             = "api-freshman-yr-db"
    name                   = "${local.databaseName}"
    username               = "user"
    password               = "YourPwdShouldBeLongAndSecure!"
    parameter_group_name   = "default.mysql5.7"
    multi_az               = true
    tags =  {
        appOwner = "${local.appOwner}"
    }
}

resource "aws_security_group" "sg_mysql_aurora" {
    name        = "sg_mysql_aurora"
    description = "MySQL/Aurora Security Group definition"
    vpc_id      = "${aws_vpc.app_vpc.id}"

    ingress {
        from_port   = 3306
        to_port     = 3306
        protocol    = "TCP"
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags =  {
        appOwner = "${local.appOwner}"
    } 
}

resource "aws_db_subnet_group" "muenster" {
    name        = "${local.databaseName}"
    subnet_ids  = [
      "${aws_subnet.subnet_us_east_1a_pub.id}", 
      "${aws_subnet.subnet_us_east_1a_pub.id}"
    ]
    description = "Muenster database subnet group"
}
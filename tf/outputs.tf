output "git_branch_name" {
  value = data.environment_variable.git_branch_name.value
}

output "git_commit_sha" {
  value = data.environment_variable.git_commit_sha.value
}

output "vpc_id" {
  value = "${aws_vpc.app_vpc.id}"
}

output "public_subnet_id" {
  value = "${aws_subnet.subnet_us_east_1a_pub.id}"
}

output "private_subnet_id" {
  value = "${aws_subnet.subnet_us_east_1b_priv.id}"
}

output "edge_proxy_public_alb_url" {
  value = "http://${aws_alb.edge_proxy.dns_name}"
}

output "data_service_internal_alb_url" {
  value = "http://${aws_alb.data_service.dns_name}"
}
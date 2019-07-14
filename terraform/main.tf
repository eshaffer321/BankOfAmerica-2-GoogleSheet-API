# Create a new instance of the latest Ubuntu 14.04 on an
# t2.micro node with an AWS Tag naming it "HelloWorld"
provider "aws" {
  region = "us-west-2"
}

data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-trusty-14.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical

}

resource "aws_instance" "web" {
  ami           = "${data.aws_ami.ubuntu.id}"
  instance_type = "t2.micro"

  tags = {
    Name = "HelloWorld"
  }

  key_name = "erick-key"

  provisioner "file" {

    connection {
      type     = "ssh"
      user     = "ubuntu"
      private_key = "${file("key.pem")}"
    }

    source      = "setup.sh"
    destination = "/tmp/setup.sh"
  }

  provisioner "remote-exec" {

    connection {
      type     = "ssh"
      user     = "ubuntu"
      private_key = "${file("key.pem")}"
    }

    inline = [
      "chmod +x /tmp/setup.sh",
      "/tmp/setup.sh",
    ]
  }

}

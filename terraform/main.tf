provider "aws" {
  region = "us-west-2"
}

resource "aws_instance" "web" {
  ami           = "ami-07b4f3c02c7f83d59"
  instance_type = "t2.micro"

  tags = {
    Name = "boa-project"
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

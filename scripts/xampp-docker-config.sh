#! /usr/bin/bash

export XAMPP_DOCKER_CONTAINER_NAME="xampp"
export XAMPP_DOCKER_IMAGE_REF="tomsik68/xampp:8"
export XAMPP_DOCKER_CONTAINER_HOST="xampp_host"
export WORKSPACE_NAME=`basename "$(realpath .)"`

echo_configuration(){
	echo Current Configuration:
	echo "WORKSPACE_NAME: $WORKSPACE_NAME"
}

if [ "$0" = "${BASH_SOURCE[0]}" ]; then
	echo_configuration
fi

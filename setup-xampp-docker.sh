#! /usr/bin/bash

set -e


source ./scripts/xampp-docker-config.sh
source ./scripts/xampp-docker-utils.sh


if xampp_docker_container_check_running; then
	:	
else
	if xampp_docker_container_check_created; then
		xampp_docker_start
	else
		xampp_docker_run
	fi
fi
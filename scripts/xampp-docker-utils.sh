
xampp_docker_get_image_id() {
	docker images -q -f "reference=$XAMPP_DOCKER_IMAGE_REF"
}

xampp_docker_check_image_exists() {
	[ ! -z $(frvt_docker_get_image_id) ]
}

xampp_docker_container_get_created_id() {
	docker ps -q -a --filter name=$XAMPP_DOCKER_CONTAINER_NAME
}

xampp_docker_container_check_created() {
	[ ! -z $(xampp_docker_container_get_created_id) ]
}

xampp_docker_container_get_running_id() {
	docker ps -q -a --filter name=$XAMPP_DOCKER_CONTAINER_NAME --filter status=running
}

xampp_docker_container_check_running() {
	[ ! -z $(xampp_docker_container_get_running_id) ]
}

xampp_docker_run() {
	echo 'run container and name it as "'"$XAMPP_DOCKER_CONTAINER_NAME"'"'
	docker run -itd \
		--name "$XAMPP_DOCKER_CONTAINER_NAME" \
		-h "$XAMPP_DOCKER_CONTAINER_HOST" \
		-v $(pwd):/workspace/$WORKSPACE_NAME \
		-p 8081:80 \
		-p 41036:3306 \
		-w /workspace/$WORKSPACE_NAME \
		"$XAMPP_DOCKER_IMAGE_REF"
}

xampp_docker_start() {
	echo start container
	docker start "$XAMPP_DOCKER_CONTAINER_NAME"
}

xampp_docker_exec() {
	echo exec container
	docker exec -it "$XAMPP_DOCKER_CONTAINER_NAME" bash
}

xampp_docker_stop() {
	echo stop container
	docker stop "$XAMPP_DOCKER_CONTAINER_NAME"
}

xampp_docker_rm() {
	echo rm container
	docker rm "$XAMPP_DOCKER_CONTAINER_NAME"
}

xampp_ask_stop_remove_container() {
	read -r -p "It will stop and remove running container, are you sure? [y/N] " response
	case "$response" in
	[yY][eE][sS] | [yY])
		return 0
		;;
	*)
		return 1
		;;
	esac
}

prompt_force() {
	[ ! "-f" == $1 ]
}

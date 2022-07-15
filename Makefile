build:
	docker build . -t green
run:
	docker container run \
		--rm \
		--detach \
		--publish 3000:3000 \
		--name test_webdev \
		webdev:latest
dev:
	docker-compose -f ./docker-compose.dev.yml up

prod:
	docker-compose -f ./docker-compose.prod.yml up -d

stop:
	-docker ps -a -q | xargs docker stop

.PHONY: stop
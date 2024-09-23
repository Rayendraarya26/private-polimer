run:
	@make install-composer
	@docker pull docker.io/dolkode/bbkkp-polimer:base
	@docker compose up -d --build
	@make set-storage-permission
	@make set-storage-link
	@echo "Server is started"

update-base-multiarch:
	echo "Build Parallel base image..."
	make -j 2 build-base
	docker manifest rm dolkode/bbkkp-polimer:base || true
	docker manifest create dolkode/bbkkp-polimer:base \
            --amend dolkode/bbkkp-polimer:base-amd64 \
            --amend dolkode/bbkkp-polimer:base-arm64
	docker manifest push dolkode/bbkkp-polimer:base

build-base: build-base-amd64 build-base-arm64

build-base-amd64:
	@docker buildx build \
		  --tag dolkode/bbkkp-polimer:base-amd64 \
		  --platform linux/amd64 \
		  --load \
		  -f ./docker/dockerfile/base.Dockerfile \
		  .
	@docker push dolkode/bbkkp-polimer:base-amd64

build-base-arm64:
	@docker buildx build \
		  --tag dolkode/bbkkp-polimer:base-arm64 \
		  --platform linux/arm64 \
		  --load \
		  -f ./docker/dockerfile/base.Dockerfile \
		  .
	docker push dolkode/bbkkp-polimer:base-arm64

update-repo:
	echo  "Updating git repo..."
	@git pull origin main
	echo "re-optimize php"
	@make php-re-optimize

start:
	@docker compose up -d --build

restart:
	@docker compose restart

stop:
	@docker compose down --remove-orphans

enter-php:
	@echo "Entering php container"
	@docker exec -w /var/www -it $(shell docker compose ps -q bbkkp_polimer) bash

php-re-optimize:
	@echo "Re-Optimizing php"
	@docker exec -w /var/www -t $(shell docker compose ps -q bbkkp_polimer) php artisan optimize:clear
	@docker exec -w /var/www -t $(shell docker compose ps -q bbkkp_polimer) php artisan optimize

set-storage-permission:
	@echo "Set storage permission"
	@docker exec -w /var/www -t $(shell docker compose ps -q bbkkp_polimer) chmod -R 777 storage

set-storage-link:
	@echo "Link storage"
	@docker exec -w /var/www -t $(shell docker compose ps -q bbkkp_polimer) php artisan storage:link

install-composer:
	@echo "Installing composer in host via docker"
	@docker run --rm -u "$(shell id -u):$(shell id -g)" -v "$(shell pwd):/var/www" -w /var/www laravelsail/php82-composer:latest composer install --ignore-platform-reqs

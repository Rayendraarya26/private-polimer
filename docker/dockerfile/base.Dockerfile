FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    build-essential \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libonig-dev \
    libzip-dev \
    libxml2-dev \
    libssl-dev \
    libcurl4-openssl-dev \
    libjpeg-dev \
    libpng-dev \
    zip \
    unzip \
    supervisor \
    nginx \
    libmagickwand-dev \
    libmagickcore-dev \
    imagemagick \
    imagemagick-doc \
    pdftk \
    iputils-ping \
    git

ENV TZ=Asia/Jakarta
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

RUN install-php-extensions pdo_mysql exif pcntl bcmath gd imagick excimer zip

# Install nodejs and npm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
ENV NVM_DIR="/root/.nvm"
RUN . "$NVM_DIR/nvm.sh" && nvm install --lts
ENV PATH="/root/.nvm/versions/node/$(node -v)/bin:${PATH}"

# Install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy Imagick Policy
COPY /docker/imagick/policy.xml /etc/ImageMagick-6/policy.xml

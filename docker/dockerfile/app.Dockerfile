FROM dolkode/bbkkp-polimer:base

WORKDIR /var/www/

# Setup Nginx
RUN rm /etc/nginx/sites-enabled/default
COPY /docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy Logrotate Configuration
COPY /docker/logrotate/* /etc/logrotate.d/
RUN chmod 600 /etc/logrotate.d/laravel-*

# Copy Imagick Policy
COPY /docker/imagick/policy.xml /etc/ImageMagick-6/policy.xml

# Set PHP ini
COPY /docker/php/php.ini "$PHP_INI_DIR/php.ini"

COPY /docker/php/opcache.ini "$PHP_INI_DIR/conf.d/opcache.ini"

COPY /docker/supervisor /etc/

# RUN Cron Service
RUN service cron start

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]

USER root

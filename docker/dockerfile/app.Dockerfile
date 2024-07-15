FROM dolkode/bbkkp-polimer:base

WORKDIR /var/www/

# Setup Nginx
RUN rm /etc/nginx/sites-enabled/default
COPY /docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Set PHP ini
COPY /docker/php/php.ini "$PHP_INI_DIR/php.ini"

COPY /docker/supervisor /etc/

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]

USER root

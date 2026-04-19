#!/bin/sh
set -e

# Rebuild config cache from the mounted .env on every startup.
php /var/www/artisan config:clear
php /var/www/artisan config:cache

exec "$@"

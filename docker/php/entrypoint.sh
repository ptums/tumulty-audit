#!/bin/sh
set -e

# Cache config from the mounted .env so all processes pick up runtime values.
php /var/www/artisan config:cache

exec "$@"

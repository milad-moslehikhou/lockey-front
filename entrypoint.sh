#!/bin/sh
echo "window.API_BASE_URL = '${API_BASE_URL}';" > /usr/share/nginx/html/config.js
echo "window.USER_INACTIVITY_TIME = '${USER_INACTIVITY_TIME}';" >> /usr/share/nginx/html/config.js
exec nginx -g 'daemon off;'

#!/bin/sh -e
if [ "$SENTRY_URL" != "" ]; then
  sed -i "s#{{SENTRY_URL}}#${SENTRY_URL}#" /usr/share/nginx/html/js/app.*.js
fi
nginx -g "daemon off;"

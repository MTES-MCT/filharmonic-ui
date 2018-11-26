FROM nginx:stable-alpine

COPY docker/nginx-mp.conf /etc/nginx/conf.d/default.conf
COPY docker/init.sh /init.sh
COPY dist/. /usr/share/nginx/html/

EXPOSE 5000
CMD ["/init.sh"]

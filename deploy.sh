#!/bin/bash

nginx -c /usr/local/nginx/conf/nginx.conf
cd /root/test/dict/
./main &
cd /root/test/dict/web
npm run build
serve -s build &

#!/bin/bash

docker run --rm -v "$PWD":/app -w /app golang go build -v -o dict-main

sed -i 's/http:\/\/localhost/https:\/\/d.woohsi.top/g' ./web/src/card/Wordcard.js \
&& sed -i 's/http:\/\/localhost/https:\/\/d.woohsi.top/g' ./web/src/search/Searchbar.js \
&& sed -i 's/export NODE_OPTIONS=--openssl-legacy-provider && //g' ./web/package.json
cd web && yarn build

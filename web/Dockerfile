FROM node:18 AS builder

WORKDIR /web
COPY ./package.json .
RUN yarn install
COPY . .
RUN sed -i 's/localhost/d.woohsi.top/g' ./src/card/Wordcard.js \
&& sed -i 's/localhost/d.woohsi.top/g' ./src/search/Searchbar.js \
&& sed -i 's/export NODE_OPTIONS=--openssl-legacy-provider && //g' ./package.json
RUN yarn build

FROM node:18
WORKDIR /run
COPY --from=builder /web/build ./build
RUN npm install -g serve
RUN ls -la
EXPOSE 5000
CMD ["serve", "-s", "build", "-l", "5000"]

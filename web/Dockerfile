FROM node:12 AS builder

WORKDIR /web
COPY ./package.json .
RUN npm install
COPY . .
RUN sed -i 's/localhost/d.woohsi.top/g' ./src/wordcard.js \
&& sed -i 's/export NODE_OPTIONS=--openssl-legacy-provider && //g' ./package.json
RUN npm run build

FROM node:12
WORKDIR /run
COPY --from=builder /web/build ./build
RUN npm install -g serve
RUN ls -la
EXPOSE 5000
CMD ["serve", "-s", "build", "-l", "5000"]

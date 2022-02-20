FROM golang:1.17

WORKDIR /usr/src/app
COPY go.mod ./
COPY go.sum ./
RUN go mod download
COPY . .
RUN go build -v -o /usr/local/bin/dict-main 

FROM ubuntu
WORKDIR /app
COPY --from=0 /usr/local/bin/dict-main .
COPY ./index.csv .
COPY ./.env .
RUN mkdir logs
RUN ls -la /app
EXPOSE 8080
ENTRYPOINT  ["./dict-main"]


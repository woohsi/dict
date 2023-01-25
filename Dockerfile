FROM ubuntu

WORKDIR /app
COPY ./dict-main ./.env ./index.csv ./
RUN mkdir logs
RUN ls -la /app
EXPOSE 8080
ENTRYPOINT  ["./dict-main"]


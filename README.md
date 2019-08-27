# yield-curve 💵

[![Actions Status](https://github.com/freddieb/yield-curve/workflows/Publish%20Docker%20Image/badge.svg)](https://github.com/freddieb/yield-curve/actions)

Calculates the 5-3 year yield curve and displays it in a user friendly web page.


## Setup
1. Copy the example .env file and edit it per your requirements
```
$ cp .env.example .env
```

## Running the server
Note: Requires Node and NPM to be installed.
A Redis server must also be available. Thep URL of the Redis server is given in the env variable `REDIS_URL`. If you do not have this installed, running the project with Docker Compose will create a Redis server automatically.

To run the server, execute:
```
$ npm install
$ npm run sass:compile
$ node index.js
```

## Running with Docker Compose
1. Build the yield-curve image
2. Replace `image: index.docker.io/foresightorg/yield-curve:latest` of the `docker-compose.yml` file with your own image location, 
```
image: <your_image>:<your_image_tag>
```
3. To run the server and Redis, execute 
```
$ docker-compose up -d
```
4. To see the logs, run 
```
$ docker-compose logs -f --tail=1000
``` 

</br>
---

&copy; Foresight App Development Ltd.
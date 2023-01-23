# IoT Parking Lot

Parking system with real time monitoring of parking spots, entrance and departures.

![demo app](/assets/parking_lot_example.png)

## Architecture
![architecture](/assets/architecture.png)

## Database Schema
![database schema](/assets/database.png)

## Presequites

- [Docker](https://docs.docker.com/get-docker/)
- [NodeJs](https://nodejs.org/en/download/)
- [Arduino](https://www.arduino.cc/en/software)

## How to setup

```
cd front-end && npm install
cd ..
cd server && npm install
```

Create a file .env and configure it referencing .env.example

```
docker compose up
npx prisma migrate reset
```

## Run server

```
cd server && npm start
```

## Run front end

```
cd front-end && npm run dev
```
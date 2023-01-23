# IoT Parking Lot

Parking system with real time monitoring of parking spots, entries and departures.

![demo app](/assets/parking_lot_example.png)

## Architecture
![architecture](/assets/architecture.png)

## Database Schema
![database schema](/assets/database.png)

## Presequites

- [Docker](https://docs.docker.com/get-docker/)
- [NodeJs](https://nodejs.org/en/download/)
- [Arduino](https://www.arduino.cc/en/software)
- [PubSubClient](https://pubsubclient.knolleary.net/)

## How to setup

Install dependencies
```
cd front-end && npm install
cd ..
cd server && npm install
```

Create .env and update environment variables:

```
cp .env.example .env
```

Run postgresql and mosquitto broker:

```
docker compose up
```

Run migrations and seed database

```
npx prisma migrate reset
```

Run development server

```
cd server && npm start
```

Run development front-end

```
cd front-end && npm run dev
```
# IoT Parking Lot

Parking system with real-time monitoring of parking spots, entries, and departures. Designed and implemented for a university lab project.

https://user-images.githubusercontent.com/23614722/215331065-c6ae5a37-53e5-4936-bc37-f3189c5702ea.mp4

## Architecture
![architecture](/assets/architecture.png)

- [__ESP32__](https://www.espressif.com/en/products/socs/esp32) was chosen for this project as it has a WLAN module
- [__Eclipse Mosquitto__](https://mosquitto.org/) as the mqtt broker
- [__Node.js__](https://nodejs.org/en/) was used for subscribing to the mqtt broker, exposing an API to the client and communicating with the database
- [__React__](https://reactjs.org/) as the client
- [__PostgreSQL__](https://www.postgresql.org/) as the database

## Database Schema
![Database Schema](/assets/database.png)

This database schema design allows you to store each ParkingLot, *ENTRY* and *DEPARTURE* event in chronological order. The same applies to the Parking space *FREE* and *OCCUPIED* events.

## MQTT Topics

The message format for the `parking_spot_state` is `ParkingLotId|ParkingSpotId|ParkingSpotState`
The ParkingSpotState is either `FREE` or `OCCUPIED`. Here is an example message:
```
1|8|FREE
```

The message format for the `parking_lot` is `ParkingLotId|EntranceEvent`
The EntranceEvent is either `ENTRY` or `DEPARTURE`. Here is an example message:
```
1|DEPARTURE
```

## Node.js server
The server subscribes to the `parking_spot_state` and `parking_lot` topics of the MQTT broker.

### API Endpoints
 - /health 
    - health check of the server
 - /parking-lots
    - List of parking lots
 - /parking-lots/:id
    - Get parking lot with the unique id, including the current parking spots state and a count of all entry and departure events.
 - /events
    - [ServerSentEvents](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) endpoint in JSON format for real-time events e.g.:
    ```
    {
        "parkingLotId":1,
        "event":"ENTRY",
        "id":1675008556177,
        "created_at":"2023-01-29T16:09:16.177Z"
    }
    ```

## React client
### Route paths
 - /
    - Calls `/parking-lots` from the server and lists parking lots.
 - /parking-lots/:id
    - Calls `/parking-lots/:id` from the server and subscribes to `/events` EventSource.

## ESP32
The ESP32 publishes the `parking_spot_state` and `parking_lot` topics of the MQTT broker.
### Circuit
![Circuit](/assets/circuit.png)

Circuit for the Fake Parking Model IoT Parking Lot, 2 IR proximity sensors for the entrance and exit. 2 IR proximity sensors for the parking spots.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [NodeJs](https://nodejs.org/en/download/)
- [Arduino](https://www.arduino.cc/en/software)
- [PubSubClient](https://pubsubclient.knolleary.net/)

## How to setup client and server

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

Run PostgreSQL and mosquitto broker:

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
## How to setup esp32

Install the [PubSubClient](https://pubsubclient.knolleary.net/) into the arduino IDE.

Compile and flash the board.

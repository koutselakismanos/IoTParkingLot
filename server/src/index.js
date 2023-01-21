import express from 'express';

const app = express();
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import prisma from './prisma.js';
import { ParkingSpaceState, EntranceEvent } from '@prisma/client';
import bodyParser from 'body-parser';
import mqtt from 'mqtt';

dotenv.config();
const port = 5000;

let clients = [];

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));

const PARKING_SPOT_STATE = 'parking_spot_state';
const PARKING_LOT = 'parking_lot';

const mqttClient = mqtt.connect('mqtt://127.0.0.1', { port: 1883 });
mqttClient.on('connect', function () {
  mqttClient.subscribe(PARKING_SPOT_STATE);
  mqttClient.subscribe(PARKING_LOT);
});

mqttClient.on('message', async function (topic, message) {
  console.log(`Message: ${topic}/${message.toString()}`);

  if (topic === PARKING_SPOT_STATE) {
    const [parkingLotId, parkingSpotName, parkingSpotState] = message
      .toString()
      .split('|');
    console.log(parkingLotId, parkingSpotName, parkingSpotState);
    await prisma.$transaction(async (tx) => {
      const parkingSpace = await tx.parkingSpace.findFirst({
        where: {
          parkingLotId: parseInt(parkingLotId),
          name: parkingSpotName,
        },
      });

      const newParkingSpotHistory = await tx.parkingSpaceHistory.create({
        data: {
          parkingSpaceId: parkingSpace.id,
          state: parkingSpotState,
        },
      });

      sendEventsToAll(`parking-spot/${parkingLotId}`, newParkingSpotHistory);
    });
  } else if (topic === PARKING_LOT) {
    const [parkingLotId, entranceEvent] = message.toString().split('|');
    console.log(parkingLotId, entranceEvent);
    await prisma.$transaction(async (tx) => {
      const parkingLotEvent = await tx.parkingLotEvent.create({
        data: {
          parkingLotId: parseInt(parkingLotId),
          event: entranceEvent,
        },
      });

      sendEventsToAll(`parking-lot/${parkingLotId}`, parkingLotEvent);
    });
  } else {
  }
});

app.get('/health', (req, res) => {
  res.status(StatusCodes.OK).send(ReasonPhrases.OK);
});

app.get('/parking-lots', async (req, res) => {
  res.json(await prisma.parkingLot.findMany());
});

app.get('/parking-lots/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const parkingLot = await prisma.parkingLot.findUnique({
    select: {
      id: true,
      name: true,
      location: true,
      parkingSpaces: {
        include: {
          history: {
            take: 1,
            orderBy: {
              created_at: 'desc',
            },
          },
        },
      },
    },
    where: {
      id: id,
    },
  });

  const entries = await prisma.parkingLotEvent.count({
    where: {
      event: EntranceEvent.ENTRY,
      parkingLotId: id,
    },
  });

  const departures = await prisma.parkingLotEvent.count({
    where: {
      event: EntranceEvent.DEPARTURE,
      parkingLotId: id,
    },
  });

  res.json({ entries, departures, ...parkingLot });
});

app.get('/events', eventsHandler);

function eventsHandler(req, res, next) {
  const headers = {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
  };

  res.set(headers);

  res.flushHeaders();

  const clientId = Date.now();

  const newClient = {
    id: clientId,
    response: res,
  };

  clients.push(newClient);

  req.on('close', () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter((client) => client.id !== clientId);
  });
}

function sendEventsToAll(eventType, data) {
  clients.forEach((client) => {
    client.response.write(`id: ${client.id}\n`);
    client.response.write(`event: ${eventType}\n`);
    client.response.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

setInterval(() => {
  const newParkPositionHistory = {
    parkingSpaceId: Math.floor(Math.random() * 12 + 1),
    state:
      Math.round(Math.random()) === 0
        ? ParkingSpaceState.OCCUPIED
        : ParkingSpaceState.FREE,
    id: new Date().getTime(),
    created_at: '2023-01-18T11:53:56.025Z',
  };
  return sendEventsToAll('parking-spot/2', newParkPositionHistory);
}, 500);

setInterval(() => {
  const newParkingLotEvent = {
    parkingLotId: Math.floor(Math.random() * 2 + 1),
    event:
      Math.round(Math.random()) === 0
        ? EntranceEvent.ENTRY
        : EntranceEvent.DEPARTURE,
    id: new Date().getTime(),
    created_at: new Date(),
  };
  return sendEventsToAll('parking-lot/2', newParkingLotEvent);
}, 2000);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

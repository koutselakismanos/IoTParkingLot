import express from 'express';

const app = express();
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import prisma from './prisma.js';
import { ParkingSpaceState } from '@prisma/client';
import bodyParser from 'body-parser';

dotenv.config();
const port = 5000;

let clients = [];
let facts = [];

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));

app.get('/health', (req, res) => {
  res.status(StatusCodes.OK).send(ReasonPhrases.OK);
});

app.get('/parking-lots', async (req, res) => {
  res.json(await prisma.parkingLot.findMany());
});

app.get('/parking-lots/:id', async (req, res) => {
  res.json(
    await prisma.parkingLot.findUnique({
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
        id: parseInt(req.params.id),
      },
    })
  );
});

app.post('/parking-space/:id', async (req, res) => {
  let state;
  switch (req.body.state.toUpperCase()) {
    case ParkingSpaceState.FREE:
      state = ParkingSpaceState.FREE;
      break;

    case ParkingSpaceState.OCCUPIED:
      state = ParkingSpaceState.OCCUPIED;
      break;
    default:
  }

  if (!state || req.params.id === undefined) {
    await res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ error: ReasonPhrases.UNPROCESSABLE_ENTITY });
  }

  await res.status(StatusCodes.CREATED).json(
    await prisma.parkingSpaceHistory.create({
      data: {
        parkingSpaceId: parseInt(req.params.id),
        state: state,
      },
    })
  );
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

async function sendNewParkPositionState(request, response, next) {
  const newParkPositionHistory = {
    parkingSpaceId: 6,
    state: ParkingSpaceState.OCCUPIED,
    id: new Date().getTime(),
    created_at: '2023-01-18T11:53:56.025Z',
  };
  response.json(newParkPositionHistory);
  return sendEventsToAll('parking-spot', newParkPositionHistory);
}

app.post('/pepe', sendNewParkPositionState);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

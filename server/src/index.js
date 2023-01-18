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
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        ParkingSpaces: true,
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

  if (!state) {
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

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

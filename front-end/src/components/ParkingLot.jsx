import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Badge, Box, Button, Center, Flex, Grid, Text, useMantineTheme } from '@mantine/core';
import ParkingSpot from './ParkingSpot.jsx';
import { motion, useAnimationControls } from 'framer-motion';
import Mercedes from '../assets/mercedes.svg';

function ParkingLot() {
  let params = useParams();

  const [parkingLotData, setParkingLotData] = useState({});
  const [listening, setListening] = useState(false);
  const controlsEntry = useAnimationControls();
  const controlsDeparture = useAnimationControls();
  const [animate, setAnimate] = useState(false);

  const theme = useMantineTheme();

  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const result = await fetch(`/api/parking-lots/${params.id}`);
      return result.json();
    },
    queryKey: [`parking-lots/${params.id}`],
  });

  useEffect(() => {
    if (data) {
      setParkingLotData(data);
    }

    if (!listening) {
      const eventSource = new EventSource('http://localhost:5000/events');

      eventSource.addEventListener(`parking-spot/${params.id}`, (e) => {
        const parkingSpotStateEvent = JSON.parse(e.data);

        setParkingLotData((parkingLot) => {
          let parkingSpaces = parkingLot?.parkingSpaces?.map((parkingSpace) => {
            if (parkingSpace.id === parkingSpotStateEvent.parkingSpaceId) {
              if (parkingSpace.history[0]) {
                parkingSpace.history[0].state = parkingSpotStateEvent.state;
              } else {
                parkingSpace.history.push({ state: parkingSpotStateEvent.state });
              }
            }
            return parkingSpace;
          });

          return {
            ...parkingLot,
            parkingSpaces: parkingSpaces,
          };
        });
      });

      eventSource.addEventListener(`parking-lot/${params.id}`, async (e) => {
        const parkingLotEvent = JSON.parse(e.data);

        switch (parkingLotEvent?.event) {
          case 'ENTRY':
            setParkingLotData((state) => {
              return { ...state, entries: state.entries + 1 };
            });
            await controlsEntry.start((i) => ({ y: [150, 0], opacity: [0, 1, 0] }));
            break;
          case 'DEPARTURE':
            setParkingLotData((state) => {
              return { ...state, departures: state.departures + 1 };
            });
            await controlsDeparture.start((i) => ({ y: [0, 150], opacity: [0, 1, 0] }));
            break;
        }
      });

      setListening(true);
    }
  }, [listening, data]);

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Flex justify={'center'} gap={'sm'}>
        <Text>{data?.name}</Text>
        <Badge variant={'dot'} color={'blue'}>
          Entries: {parkingLotData?.entries}
        </Badge>
        <Badge variant={'dot'} color={'red'}>
          Departures: {parkingLotData?.departures}
        </Badge>
      </Flex>
      <Flex>
        <Flex direction={'column'}>
          {parkingLotData?.parkingSpaces?.map((parkingSpace, i) => {
            if (parkingLotData?.parkingSpaces?.length / 2 > i) {
              return (
                <ParkingSpot
                  key={parkingSpace.id}
                  leftAligned={true}
                  occupied={parkingSpace.history[0] && parkingSpace.history[0].state === 'OCCUPIED'}
                  name={parkingSpace.name}
                />
              );
            }
          })}
        </Flex>
        <Box style={{ width: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={{
              transform: 'translateY(calc(50% + 50px)) rotate(-90deg)',
              color: theme.colors.gray[3],
              fontSize: theme.fontSizes.xl,
            }}
          >
            {'<----- Entrance'}
          </Text>
        </Box>
        <Flex direction={'column'}>
          {parkingLotData?.parkingSpaces?.map((parkingSpace, i) => {
            if (parkingLotData?.parkingSpaces?.length / 2 <= i) {
              return (
                <ParkingSpot
                  key={parkingSpace.id}
                  leftAligned={false}
                  occupied={parkingSpace.history[0] && parkingSpace.history[0].state === 'OCCUPIED'}
                  name={parkingSpace.name}
                />
              );
            }
          })}
        </Flex>
      </Flex>

      <motion.div
        key={`entry-motion`}
        animate={controlsEntry}
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        style={{
          position: 'absolute',
          bottom: 0,
          alignItems: 'center',
        }}
      >
        <img
          src={Mercedes}
          height={60}
          alt="mercedes car top view"
          style={{
            transform: 'rotate(90deg) translateY(-80px)',
            filter: `drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4)`,
          }}
        />
      </motion.div>
      <motion.div
        key={`departure-motion`}
        initial={{ opacity: 0 }}
        animate={controlsDeparture}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        style={{
          position: 'absolute',
          bottom: 0,
          alignItems: 'center',
        }}
      >
        <img
          src={Mercedes}
          height={60}
          alt="mercedes car top view"
          style={{
            transform: 'rotate(-90deg) translateY(-80px)',
            filter: `drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4)`,
          }}
        />
      </motion.div>
    </Box>
  );
}

export default ParkingLot;

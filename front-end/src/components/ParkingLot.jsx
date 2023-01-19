import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Mercedes from '../assets/mercedes.svg';
import { Box, Grid } from '@mantine/core';
import ParkingSpot from './ParkingSpot.jsx';

function ParkingLot() {
  const [parkingLot, setParkingLot] = useState({});
  const [listening, setListening] = useState(false);
  let params = useParams();
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const result = await fetch(`/api/parking-lots/${params.id}`);
      return result.json();
    },
    queryKey: [`parking-lots/${params.id}`],
  });

  useEffect(() => {
    if (data) {
      setParkingLot(data);
    }

    if (!listening) {
      const eventSource = new EventSource('http://localhost:5000/events');

      eventSource.addEventListener('parking-spot', (e) => {
        const parkingSpotStateEvent = JSON.parse(e.data);

        setParkingLot((parkingLot) => {
          let parkingSpaces = parkingLot.parkingSpaces.map((parkingSpace) => {
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

      setListening(true);
    }
  }, [listening, data]);

  return (
    <Box
      component="section"
      style={{
        height: 700,
        backgroundImage: `linear-gradient(90deg, rgba(255,255,255,1) 10%, rgba(255,255,255,0) 50%, rgba(255,255,255,1) 90%), url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='69.141' height='40' patternTransform='scale(2) rotate(30)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0, 0%, 0%, 1)'/><path d='M69.212 40H46.118L34.57 20 46.118 0h23.094l11.547 20zM57.665 60H34.57L23.023 40 34.57 20h23.095l11.547 20zm0-40H34.57L23.023 0 34.57-20h23.095L69.212 0zM34.57 60H11.476L-.07 40l11.547-20h23.095l11.547 20zm0-40H11.476L-.07 0l11.547-20h23.095L46.118 0zM23.023 40H-.07l-11.547-20L-.07 0h23.094L34.57 20z'  stroke-width='1' stroke='hsla(259, 0%, 0%, 0.03)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>")`,
        width: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      {parkingLot?.parkingSpaces?.map((parkingSpace, i) => {
        const leftAligned = parkingLot?.parkingSpaces.length / 2 > i;
        return (
          <ParkingSpot
            leftAligned={leftAligned}
            occupied={parkingSpace.history[0] && parkingSpace.history[0].state === 'OCCUPIED'}
            name={parkingSpace.name}
          />
        );
      })}
    </Box>
  );
}

export default ParkingLot;

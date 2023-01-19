import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import _ from 'lodash';

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
      console.log('listening');
  
      eventSource.addEventListener('parking-spot', (e) => {
        const parkingSpotStateEvent = JSON.parse(e.data);
        console.log('event', e);

        setParkingLot((parkingLot) => {

          let parkingSpaces = parkingLot.parkingSpaces.map((parkingSpace) => {
            if( parkingSpace.id === parkingSpotStateEvent.parkingSpaceId ) {
              parkingSpace.history[0].state = parkingSpotStateEvent.state;
            }
            return parkingSpace;
          });

          return {
            ...parkingLot,
            parkingSpaces: parkingSpaces
          }
        })
      });
  
      setListening(true);
    }
    
  }, [listening, data]);

  return (
    <>
      {parkingLot?.parkingSpaces?.map((parkingSpace) => {
        return (
          <div key={parkingSpace.id}>
            {parkingSpace.name} {parkingSpace.history[0] ? parkingSpace.history[0].state : 'FREE'}
          </div>
        );
      })}
    </>
  );
}

export default ParkingLot;

import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {Text } from '@mantine/core';

function ParkingLots({ children }) {
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const result = await fetch('/api/parking-lots');
      return result.json();
    },
    queryKey: ['parking-lots'],
  });

  return (
    <>
      <Text>Parking Lots</Text>
      {data?.map((parkingLot) => {
        return <Link to={`/parking-lots/${parkingLot.id}`}>{parkingLot.name}</Link>;
      })}
    </>
  );
}

export default ParkingLots;

import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

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
      <div>test</div>
      {data?.map((parkingLot) => {
        return <Link to={`/parking-lots/${parkingLot.id}`}>{parkingLot.name}</Link>;
      })}
    </>
  );
}

export default ParkingLots;

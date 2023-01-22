import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Badge, Button, Flex, Text, useMantineTheme } from '@mantine/core';

function ParkingLots({ children }) {
  const theme = useMantineTheme();
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const result = await fetch('/api/parking-lots');
      return result.json();
    },
    queryKey: ['parking-lots'],
  });

  return (
    <>
      <Text style={{ marginBottom: theme.spacing.md }}>Parking Lots</Text>
      <Flex direction={'column'} gap={'sm'}>
        {data?.map((parkingLot) => {
          return (
            <Link
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: theme.spacing,
                cursor: 'pointer',
                paddingBlock: 2,
              }}
              to={`/parking-lots/${parkingLot.id}`}
            >
              <Button fullWidth color={'dark'}>
                {parkingLot.name}
              </Button>
            </Link>
          );
        })}
      </Flex>
    </>
  );
}

export default ParkingLots;

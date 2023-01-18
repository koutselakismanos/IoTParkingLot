import { AppShell, Burger, Header, MediaQuery, Navbar, Text, useMantineTheme } from '@mantine/core';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

function App() {
  const theme = useMantineTheme();

  const [opened, setOpened] = useState(false);
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const result = await fetch('/api/parking-lots');
      return result.json();
    },
    queryKey: ['parking-lots'],
  });
  return (
    <AppShell
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
          <Text>Application navbar</Text>
        </Navbar>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Text>Parking Lot</Text>
          </div>
        </Header>
      }
    >
      {data?.map((parkingLot) => {
        return <Text>{parkingLot.name}</Text>;
      })}
      {/*<Text>{da}</Text>*/}
    </AppShell>
  );
}

export default App;

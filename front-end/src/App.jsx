import { Button, Text } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';

function App() {
  const { mutate, isLoading, data } = useMutation({
    mutationFn: async () => {
      const result = await fetch('/api/meow');
      return result.json();
    },
    mutationKey: 'meow',
  });
  return (
    <main>
      <Button
        loading={isLoading}
        onClick={() => {
          mutate();
        }}
      >
        GetData
      </Button>
    </main>
  );
}

export default App;

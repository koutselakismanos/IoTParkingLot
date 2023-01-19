import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Box, Center, MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import ParkingLots from './components/ParkingLots.jsx';
import ParkingLot from './components/ParkingLot.jsx';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Box
        component="main"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Outlet />
      </Box>
    ),
    children: [
      {
        path: 'parking-lots',
        element: <ParkingLots />,
      },
      {
        path: 'parking-lots/:id',
        element: <ParkingLot />,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <MantineProvider
        theme={{
          fontFamily: 'Monaco, Courier, monospace',
        }}
      >
        <RouterProvider router={router} />
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

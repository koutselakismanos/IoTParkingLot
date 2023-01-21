import React from 'react';
import ReactDOM from 'react-dom/client';
import { Box, MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserRouter, Link, Outlet, RouterProvider } from 'react-router-dom';
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
        path: '/',
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
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} />
    <MantineProvider
      theme={{
        fontFamily: 'Monaco, Courier, monospace',
        globalStyles: (theme) => ({
          body: {
            backgroundImage: `linear-gradient(90deg, rgba(255,255,255,1) 10%, rgba(255,255,255,0) 50%, rgba(255,255,255,1) 90%), url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='69.141' height='40' patternTransform='scale(2) rotate(30)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0,0%,100%,1)'/><path d='M69.212 40H46.118L34.57 20 46.118 0h23.094l11.547 20zM57.665 60H34.57L23.023 40 34.57 20h23.095l11.547 20zm0-40H34.57L23.023 0 34.57-20h23.095L69.212 0zM34.57 60H11.476L-.07 40l11.547-20h23.095l11.547 20zm0-40H11.476L-.07 0l11.547-20h23.095L46.118 0zM23.023 40H-.07l-11.547-20L-.07 0h23.094L34.57 20z'  stroke-width='0.5' stroke='hsla(210, 0%, 96%, 1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(-276,-160)' fill='url(%23a)'/></svg>")`,
          },
        }),
      }}
    >
      <RouterProvider router={router} />
    </MantineProvider>
  </QueryClientProvider>
);

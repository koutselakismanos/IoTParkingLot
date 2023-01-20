import { Box, useMantineTheme, Text } from '@mantine/core';
import Mercedes from '../assets/mercedes.svg';
import { motion, AnimatePresence } from 'framer-motion';

function ParkingSpot(props) {
  const theme = useMantineTheme();

  return (
    <Box
      component="div"
      style={{
        borderBottom: '1px solid',
        borderColor: theme.colors.gray[1],
        width: 140,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: props.leftAligned ? 'flex-end' : 'flex-start',
        height: 100,
        position: 'relative',
      }}
    >
      <AnimatePresence>
        {props.occupied && (
          <motion.div
            key={`${props.name}-motion`}
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: props.leftAligned ? -20 : 20, opacity: 1 }}
            exit={{ x: 0, opacity: 0 }}
            transition={{ duration: 1, type: 'spring', damping: '10' }}
            style={{
              position: 'relative',
              left: props.leftAligned ? undefined : -40,
              right: props.leftAligned ? -40 : undefined,
              alignItems: 'center',
            }}
          >
            <img
              src={Mercedes}
              height={60}
              alt="mercedes car top view"
              style={{ transform: props.leftAligned ? undefined : 'rotate(180deg)',
                filter: `drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4)` }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {!props.occupied && (
        <Text style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: theme.colors.gray[9] }}>
          Available
        </Text>
      )}
      <Text
        fz="sm"
        style={{
          position: 'absolute',
          bottom: -5,
          left: props.leftAligned ? undefined : 0,
          right: props.leftAligned ? 0 : undefined,
          color: theme.colors.gray[6],
        }}
      >
        {props.name}
      </Text>
    </Box>
  );
}

export default ParkingSpot;

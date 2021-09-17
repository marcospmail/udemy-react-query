import { Box, HStack, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { ReactElement, useEffect } from 'react';

import { Appointment as AppointmentType, User } from '../../../../shared/types';
import { useUser } from '../user/hooks/useUser';
import { useReserveAppointment } from './hooks/useReserveAppointment';
import { appointmentInPast, getAppointmentColor } from './utils';

// determine whether this appointment can be reserved / un-reserved by logged-in user
function isClickable(
  user: User | null,
  appointmentData: AppointmentType,
): boolean {
  return !!(
    user?.id &&
    (!appointmentData.userId || appointmentData.userId === user?.id) &&
    !appointmentInPast(appointmentData)
  );
}

interface AppointmentProps {
  appointmentData: AppointmentType;
}

let count = 1;

export function Appointment({
  appointmentData,
}: AppointmentProps): ReactElement {
  const { user } = useUser();

  useEffect(() => {
    count += 1;
    console.log(count);
  }, []);

  const reserveAppointment = useReserveAppointment();
  const [textColor, bgColor] = getAppointmentColor(appointmentData, user?.id);

  const clickable = isClickable(user, appointmentData);
  let onAppointmentClick: undefined | (() => void);
  let hoverCss = {};

  // turn the lozenge into a button if it's clickable
  if (clickable) {
    onAppointmentClick = user
      ? () => reserveAppointment(appointmentData)
      : undefined;
    hoverCss = {
      transform: 'translateY(-1px)',
      boxShadow: 'md',
      cursor: 'pointer',
    };
  }

  const appointmentHour = dayjs(appointmentData.dateTime).format('h a');
  return (
    <Box
      borderRadius="lg"
      px={2}
      bgColor={bgColor}
      color={textColor}
      as={clickable ? 'button' : 'div'}
      onClick={onAppointmentClick}
      _hover={hoverCss}
      data-testid="seila_appointment"
    >
      <HStack justify="space-between">
        <Text as="span" fontSize="xs">
          {appointmentHour}
        </Text>
        <Text as="span" fontSize="xs">
          {appointmentData.treatmentName}
        </Text>
      </HStack>
    </Box>
  );
}

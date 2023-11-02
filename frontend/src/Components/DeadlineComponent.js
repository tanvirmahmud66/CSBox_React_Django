import React from 'react';
import { format, isBefore, parseISO } from 'date-fns';

function parseISOAlternative(dateTimeString) {
  const formattedString = dateTimeString.replace('Z', '');
  return new Date(formattedString);
}

function DeadlineComponent({ dateTimeString }) {
  const parsedDate = parseISOAlternative(dateTimeString);
  const currentDate = new Date();
  const isDeadlineExpired = isBefore(parsedDate, currentDate);

  const formattedDate = format(parsedDate, 'dd-MM-yy');
  const formattedTime = format(parsedDate, 'hh:mm a');

  return (
    <div>
      {isDeadlineExpired ? (
        <div className='text-primary'>Expired: {formattedDate} ({formattedTime})</div>
      ) : (
        <div className='text-danger'>
          Deadline: {formattedDate} ({formattedTime})
        </div>
      )}
    </div>
  );
}

export default DeadlineComponent;







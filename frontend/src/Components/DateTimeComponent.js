import React from 'react';
import { format } from 'date-fns';

function DateTimeComponent({ dateTimeString }) {
  const parsedDate = new Date(dateTimeString);
  const formattedDate = format(parsedDate, 'dd-MM-yy');
  const formattedTime = format(parsedDate, 'hh:mm a');

  return (
    <div>
      <div className='text-danger'>Deadline: {formattedDate} ({formattedTime})</div>
    </div>
  );
}

export default DateTimeComponent;

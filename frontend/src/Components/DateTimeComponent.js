import React from 'react';
import { format } from 'date-fns';

function DateTimeComponent({ dateTimeString }) {
  const parsedDate = new Date(dateTimeString);
  const formattedDate = format(parsedDate, 'do MMM yyyy');
  const formattedTime = format(parsedDate, 'h:mm a'); // 'h:mm a' represents Hour:Minute AM/PM

  return (
    <div className='d-flex'>
      <div className='text-success'>{formattedDate}</div>
      <div className=' ms-2 text-primary'>{formattedTime}</div>
    </div>
  );
}

export default DateTimeComponent;


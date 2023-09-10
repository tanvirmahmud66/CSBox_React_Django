import React from 'react';
import { format, isBefore } from 'date-fns';

function DeadlineComponent({ dateTimeString }) {
  const parsedDate = new Date(dateTimeString);
  const currentDate = new Date();
  
  // Compare the deadline with the current date and time
  const isDeadlineExpired = isBefore(parsedDate, currentDate);

  // Format the date and time
  const formattedDate = format(parsedDate, 'dd-MM-yy');
  const formattedTime = format(parsedDate, 'hh:mm a');
  
  // Conditionally render based on whether the deadline is expired
  return (
    <div>
      {isDeadlineExpired ? (
        <div className='text-primary'>Expired: {formattedDate} ({formattedTime}) </div>
      ) : (
        <div className='text-danger'>
          Deadline: {formattedDate} ({formattedTime})
        </div>
      )}
    </div>
  );
}

export default DeadlineComponent;

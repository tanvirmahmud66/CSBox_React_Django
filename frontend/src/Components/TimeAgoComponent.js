import React, { useEffect, useState } from 'react';

const TimeAgoComponent = ({ dateString }) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const calculateTimeAgo = () => {
      const postDate = new Date(dateString);
      const now = new Date();
      const timeDifference = now - postDate;

      const seconds = Math.floor(timeDifference / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30);
      const years = Math.floor(months / 12);

      let result = '';
      if (years > 0) {
        result = `${years} year${years > 1 ? 's' : ''}`;
      } else if (months > 0) {
        result = `${months} month${months > 1 ? 's' : ''}`;
      } else if (days > 0) {
        result = `${days} day${days > 1 ? 's' : ''}`;
      } else if (hours > 0) {
        result = `${hours} hour${hours > 1 ? 's' : ''}`;
      } else if (minutes > 0) {
        result = `${minutes} minute${minutes > 1 ? 's' : ''}`;
      } else {
        result = `${seconds} second${seconds !== 1 ? 's' : ''}`;
      }

      setTimeAgo(result + ' ago');
    };

    calculateTimeAgo();

    // Recalculate time ago every minute to keep it updated
    const intervalId = setInterval(calculateTimeAgo, 60000);

    return () => clearInterval(intervalId);
  }, [dateString]);

  return <span>{timeAgo}</span>;
};

export default TimeAgoComponent;

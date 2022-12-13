import React from 'react';
import { useCountdown } from './useCountdown';
import DateTimeDisplay from './DateTimeDisplay';
import styles from './index.module.scss'

const ExpiredNotice = () => {
    return (
      <div>
        <span>Quote Expired</span>
      </div>
    );
};

const ShowCounter = ({ days, hours, minutes, seconds }) => {
    return (
      <div className={styles["show-counter"]}>
        <a
          target="_blank"
          rel="noopener noreferrer"
          className={styles["countdown-link"]}
        >
            {
              !!days && 
                  <DateTimeDisplay value={days} type={'d,'} isDanger={false} />
            }
            {
              !!hours && 
                  <DateTimeDisplay value={hours} type={'h,'} isDanger={false} />
            }
            <DateTimeDisplay value={minutes} type={'m,'} isDanger={false} />
            <DateTimeDisplay value={seconds} type={'s'} isDanger={false} />
        </a>
      </div>
    );
  };

const CountdownTimer = ({ targetDate }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice />;
  } else {
    return (
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};

export default CountdownTimer;
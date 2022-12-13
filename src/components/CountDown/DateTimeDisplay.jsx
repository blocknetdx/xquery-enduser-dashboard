import React from 'react';
import styles from './index.module.scss';

const DateTimeDisplay = ({ value, type = '', isDanger }) => {
  return (
    <div className={isDanger ? styles['countdown-danger'] : styles['countdown']}>
      <p>{value}</p>
      <span>{type.toLowerCase()}</span>
    </div>
  );
};

export default DateTimeDisplay;
import { useState, useEffect } from 'react';

export default function Countdown(props) {
  const { onTimerComplete, seconds } = props
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    let interval = setInterval(() => {
      setTime(prevTime => {
        if (prevTime === 0) {
          if (typeof onTimerComplete === 'function') {
            onTimerComplete();
          }
          return 10;
        } else {
          return prevTime - 1;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimerComplete]);

  const timeRemaining = (time === 10 || time === 0) ? time.toString() : time.toString().replace(/^0/, '');
  const word = (time === 1) ? 'second' : 'seconds';
  const combined = timeRemaining + ' ' + word;

  return combined
}

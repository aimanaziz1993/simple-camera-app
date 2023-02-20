import { useEffect, useState } from 'react';

const useTimer = () => {
    const [time, setTime] = useState(0);
    let count = 0;

    useEffect(() => {
        setInterval(() => {
            count++
            setTime(count);
        }, 1000)
    }, [count])
  
    return time;
}

export { useTimer };
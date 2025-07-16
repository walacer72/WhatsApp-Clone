import { useEffect, useState } from 'react';
import './msgItem.css';

export const MsgItem = ({ data, user }) => {

    const [time, setTime] = useState('');
    
      useEffect(() => {
        if (data.date > 0) {
          let d = new Date(data.date.seconds * 1000);
          let hours = d.getHours();
          let minutes = d.getMinutes();
          hours = hours < 10 ? '0' + hours : hours;
          minutes = minutes < 10 ? '0' + minutes : minutes;
          setTime(`${hours}:${minutes}`);
    
        }
    
      }, [data]);

    return (
        <div
            style={{ justifyContent: user.id === data.author ? 'flex-end' : 'flex-start' }}
            class="messageLine">

            <div 
            style={{backgroundColor: user.id === data.author ? '#DCF8C6': '#FFF'}}
            class="messageItem">
                <div class="messageText">{data.body}</div>
                <div class="messageData">{time}</div>
            </div>
        </div>
    )
}
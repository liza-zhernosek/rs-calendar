import React from 'react';
import './App.css';

const Cell = (props) => {
  let customClass = props.customClass ? `cell ${props.customClass}` : 'cell';
  customClass = props.cellNumber === props.currentDayNumber ? `${customClass} active` : customClass;

  return (
    <div
      className={customClass}
      onClick={() => props.onClick(props.eventsData, props.deadlinesData)}
    >
      {props.children}
      {props.eventsData.map((event, i) => <p key={i}>{event.start.substr(11, 5)} {event.title}</p>)}
      {props.deadlinesData.map((event, i) => <p className="deadline" key={i}>{event.endEvent.substr(11, 5)} {event.title}</p>)}
    </div>
  );
}

export default Cell;

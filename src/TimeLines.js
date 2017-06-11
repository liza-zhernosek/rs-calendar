import React from 'react';

const TimeLines = (props) => {
  const timeArr = [];

  for (let i = 0; i < 24; i++) {
    timeArr.push(`${i}:00`);
  }

  const events = props.currentWeekEvents ?
    props.currentWeekEvents.map((event, i) => {
      const eventStart = event.start;
      const dayNumber = new Date(eventStart).getDay();
      return (
        <div
          className="time-event"
          key={i}
          style={{top: `${eventStart.substr(11, 2) * 25 + 5}px`, left: `${(dayNumber ? dayNumber - 1 : 6) * 100}px`}}>
            {event.title}
        </div>
      );
    })
    : null;

  const deadlines = props.currentWeekDeadlines ?
    props.currentWeekDeadlines.map((event, i) => {
      const eventEnd = event.endEvent;
      const dayNumber = new Date(eventEnd).getDay();
      return (
        <div
          className="time-event time-event-deadline"
          key={i}
          style={{top: `${eventEnd.substr(11, 2) * 25 + 5}px`, left: `${(dayNumber ? dayNumber - 1 : 6) * 100}px`}}>
            {event.title}
        </div>
      );
    })
    : null;

  return (
    <div className="time-lines-container">
      {timeArr.map((time, i) => <div className="time-line" key={i}>{time}</div>)}
      {events}
      {deadlines}
    </div>
  );
}

export default TimeLines;

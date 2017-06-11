import React from 'react';
import './App.css';

const CalendarHeader = () => {
  return (
    <div className="calendar-header">
      <div className="cell">Monday</div>
      <div className="cell">Tueday</div>
      <div className="cell">Wednesday</div>
      <div className="cell">Thursday</div>
      <div className="cell">Friday</div>
      <div className="cell">Saturday</div>
      <div className="cell">Sunday</div>
    </div>
  )
}

export default CalendarHeader;

import React from 'react';
import './App.css';

const Details = (props) => {
  return (
    <div className={props.isShowedDetails ? "details-container" : "details-container-hidden"}>
      <h1>{`${props.monthString} ${props.dayNumber}`}</h1>
      {props.deadlinesData ? props.deadlinesData.map((event, i) => 
        <div key={i} className="deadline-event">
          DEADLINE: {event.title} {event.endEvent.substr(11, 8)}
        </div>
      ) : null}
      {props.showedCellData.length ? props.showedCellData.map((event, i) =>
        <div className="details-content" key={i}>
          <h2>{event.title} {event.start.substr(11, 8)} - {event.endEvent.substr(11, 8)}</h2>
          <h6>{event.location}</h6>
          <p>{event.description}</p>
          <div className="avatars-container">
            {event.speakersData ? event.speakersData.map((speaker, i) => 
              <div key={i}>
                <img src={speaker.avatar} alt="avatar" />
                <p>{speaker.name}</p>
              </div>
            ) : ''}
          </div>
          <div className="resources-container">
            <h2>Resources</h2>
            {event.resources.map((resource, i) => 
              <div className="resources-item" key={i}>
                <p>{resource.description}</p>
                <a href={resource.resource}>{resource.type}</a>
              </div>
            )}
          </div>
        </div>
      ) : <h2>Nothing in this day! Just relax!</h2>}
    </div>
  );
}

export default Details;

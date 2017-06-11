import React, { Component } from 'react';
import './App.css';
import Cell from './Cell';
import CalendarHeader from './CalendarHeader';
import Details from './Details';
import TimeLines from './TimeLines';

const AMOUNT_DAYS_IN_YEAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

class Calendar extends Component {
  constructor() {
    super();

    this.state = {
      isShowedDetails: false,
      showedCellData: [],
      deadlinesData: [],
      monthNum: 5,
      monthString: 'Jun',
      responseData: [],
      dayNumber: null,
      weekNumber: null,
      currentMonthEvents: [],
      currentMonthDeadlines: [],
      currentWeekEvents: [],
      currentWeekDeadlines: []
    };

    this.isLastWeek = false;
  }

  toggleDetails(isShowedDetails, showedCellData, deadlinesData, dayNumber) {
    this.setState({
      isShowedDetails,
      showedCellData,
      deadlinesData,
      dayNumber
    });

    this.setSpeakers(showedCellData);
  }

  setSpeakers(showedCellDataEvents) {
    if (showedCellDataEvents[0] && !showedCellDataEvents[0].gotSpeakersData) {
      showedCellDataEvents.forEach((event, eventNumber) => {
        event.speakers.forEach((speaker) => {
          fetch(`http://128.199.53.150/trainers/${speaker}`)
          .then((data) => data.json())
          .then((newSpeakerData) => {
            let currentEvent = showedCellDataEvents[eventNumber];

            if (currentEvent.speakersData) {
              currentEvent.speakersData.push(newSpeakerData);
            } else {
              currentEvent.speakersData = [newSpeakerData];
              currentEvent.gotSpeakersData = true;
            }

            this.setState({showedCellDataEvents});
          });
        });
      });
    }
  }

  doCurrentMonthDeadlines(currentMonthEvents) {
    let currentMonthDeadlines = currentMonthEvents.filter((event) => event.type === 'deadline');

    return currentMonthDeadlines.map((event) => {
      let startDate = new Date(event.start);
      let endDate = new Date(+startDate + event.duration);

      event.end = endDate.toISOString();
      return event;
    });
  }

  renderCells() {
    let cellsArr = [];
    let monthNum = this.state.monthNum;
    let currentDate = new Date(2017, monthNum, 1);
    let currentMonthEvents = this.state.currentMonthEvents;
    let currentMonthDeadlines = this.state.currentMonthDeadlines;
    let currentWeek = this.state.weekNumber;
    let currentDay = currentDate.getDay();
    let currentDayEvents;
    let currentDayDeadlines;
    let currentAmountOfDays;
    let counter;

    if (!currentWeek) {
      currentAmountOfDays = AMOUNT_DAYS_IN_YEAR[monthNum];
      counter = 1;
    } else if (currentWeek * 7 - currentDay >= AMOUNT_DAYS_IN_YEAR[monthNum]) { //last week of month
      currentAmountOfDays = AMOUNT_DAYS_IN_YEAR[monthNum];
      counter = 7 * (currentWeek - 1) - currentDay + 2;
      this.isLastWeek = true;
    } else if (currentWeek === 1) {
      currentAmountOfDays = 8 - currentDay;
      counter = 1;
    } else {
      currentAmountOfDays = 7 * currentWeek - currentDay + 1;
      counter = currentAmountOfDays - 6;
    }

    const calculateEndDate = (events) => {
      return events.map((event) => {
        const startEvent = +new Date(event.start);
        const endEvent = new Date(startEvent + event.duration).toISOString();

        event.endEvent = endEvent;
        return event;
      });
    };

    for (let i = counter; i <= currentAmountOfDays; i++) {
      currentDayEvents = currentMonthEvents.filter((event) => event.start.substr(8, 2) == i);
      currentDayEvents = calculateEndDate(currentDayEvents);
      currentDayDeadlines = currentMonthDeadlines.filter((event) => event.end.substr(8, 2) == i);
      currentDayDeadlines = calculateEndDate(currentDayDeadlines);

      if (i === 1) {
        cellsArr.push(
          <Cell
            key={i}
            onClick={(showedCellData, deadlinesData) => this.toggleDetails(true, showedCellData, deadlinesData, i)}
            customClass={'margin-' + (currentDay - 1) * 100}
            eventsData={currentDayEvents}
            deadlinesData={currentDayDeadlines}
            currentDayNumber={this.state.dayNumber}
            cellNumber={i}>
              {i}
          </Cell>
        );
        continue;
      }

      cellsArr.push(
        <Cell
          key={i}
          onClick={(showedCellData, deadlinesData) => this.toggleDetails(true, showedCellData, deadlinesData, i)}
          eventsData={currentDayEvents}
          deadlinesData={currentDayDeadlines}
          currentDayNumber={this.state.dayNumber}
          cellNumber={i}>
            {i}
        </Cell>
      );
    }

    return cellsArr;
  }

  goNext() {
    const newMonthNum = this.state.monthNum + 1;
    let newWeekNumber = this.state.weekNumber + 1;

    if (this.state.weekNumber && !this.isLastWeek) {
      this.setState({weekNumber: newWeekNumber});
      this.setCurrentWeekEvents(newWeekNumber);
    } else if (this.isLastWeek) {
      this.setState({
        weekNumber: 1,
        monthNum: newMonthNum
      });

      this.isLastWeek = false;
      this.setMonthString(newMonthNum);
      this.setCurrentMonthEvents(newMonthNum);
    } else {
      this.setState({monthNum: newMonthNum});
      this.setMonthString(newMonthNum);
      this.setCurrentMonthEvents(newMonthNum);
    }
  }

  goPrev() {
    const newMonthNum = this.state.monthNum - 1;
    const weekNumber = this.state.weekNumber;

    if (this.isLastWeek) {
      this.isLastWeek = false;
    }
    
    if (weekNumber && weekNumber !== 1) {
      this.setState({weekNumber: weekNumber - 1});
      this.setCurrentWeekEvents(weekNumber - 1);
    } else if (weekNumber === 1) {
      const currentDay = new Date(2017, newMonthNum, 1).getDay();
      let counter = 1;
      let weekCounter = 0;

      while (counter <= AMOUNT_DAYS_IN_YEAR[newMonthNum]) {
        if (counter === 1) {
          counter += 7 - currentDay + 1;
        } else {
          counter += 7;
        }

        weekCounter++;
      }

      this.setState({
        monthNum: newMonthNum,
        weekNumber: weekCounter
      });

      this.setCurrentMonthEvents(newMonthNum, weekCounter);
      this.setMonthString(newMonthNum);
      this.isLastWeek = true;
    } else {
      this.setState({monthNum: newMonthNum});
      this.setMonthString(newMonthNum);
      this.setCurrentMonthEvents(newMonthNum);
    }
  }

  setMonthString(newMonthNum) {
    let month = new Date(2017, newMonthNum).toString().split(' ')[1];
    this.setState({monthString: month});
  }

  componentWillMount() {
    fetch('http://128.199.53.150/events')
      .then((response) => response.json())
      .then((responseData) => {

        this.setState({responseData});
        this.setCurrentMonthEvents(this.state.monthNum);
      });
  }

  setCurrentMonthEvents(monthNum, weekNum = 1) {
    let currentMonthEvents = this.state.responseData.filter((event) => event.start.substr(5, 2) == monthNum + 1);
    let currentMonthDeadlines = this.doCurrentMonthDeadlines(currentMonthEvents);

    this.setCurrentWeekEvents(weekNum, monthNum, currentMonthEvents, currentMonthDeadlines);
    this.setState({currentMonthEvents, currentMonthDeadlines});
  }

  setCurrentWeekEvents(weekNumber, monthNum = this.state.monthNum, currentMonthEvents = this.state.currentMonthEvents, currentMonthDeadlines = this.state.currentMonthDeadlines) {
    let currentDate = new Date(2017, monthNum, 1);
    let currentWeekEvents;
    let currentWeekDeadlines;
    let currentDay = currentDate.getDay();
    let startCount = 1;
    let currentMonthMaxDays = AMOUNT_DAYS_IN_YEAR[monthNum];
    let endCount;

    endCount = 7 * weekNumber - currentDay + 1;

    if (weekNumber !== 1) {
      startCount = 7 * (weekNumber - 1) - currentDay + 2;
    }

    endCount = endCount < currentMonthMaxDays ? endCount : currentMonthMaxDays;

    currentWeekEvents = currentMonthEvents.filter((event) => {
      let start = event.start.substr(8, 2);
      return start >= startCount && start <= endCount;
    });

    currentWeekDeadlines = currentMonthDeadlines.filter((event) => {
      let start = event.start.substr(8, 2);
      return start >= startCount && start <= endCount;
    });

    this.setState({currentWeekEvents, currentWeekDeadlines});
  }

  switchView(weekNumber) {
    this.setCurrentWeekEvents(1);
    this.setState({weekNumber});
  }

  render() {
    return (
      <div>
        <header>
          <h1 className="current-month">{this.state.monthString}</h1>
          <div className="switch-menu">
            {this.state.weekNumber ? 
              <button className="btn" onClick={() => this.switchView(null)}>MONTH</button> :
              <button className="btn" onClick={() => this.switchView(1)}>WEEK</button>
            }
          </div>
          <div className="navigation">
            <button className="btn" onClick={() => this.goPrev()}>PREV</button>
            <button className="btn" onClick={() => this.goNext()}>NEXT</button>
          </div>
        </header>
        <div className="calendar-container">
          <div className="cells-container">
            <CalendarHeader
              weekNumber={this.state.weekNumber}
            />
            {this.renderCells()}
            {this.state.weekNumber ?
              <TimeLines
                currentWeekEvents={this.state.currentWeekEvents}
                currentWeekDeadlines={this.state.currentWeekDeadlines} />
              : null
            }
          </div>
          <Details
            isShowedDetails={this.state.isShowedDetails}
            showedCellData={this.state.showedCellData}
            deadlinesData={this.state.deadlinesData}
            monthString={this.state.monthString}
            dayNumber={this.state.dayNumber}
          />
        </div>
      </div>
    );
  }
}

export default Calendar;

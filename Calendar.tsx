"use client"
import React, { useState } from 'react';
import { Calendar,  momentLocalizer} from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/fr';
import moment from "moment"
import { AvailablityEvent } from '@/consts/types';
import "@/app/styles/customBigCalendar.scss"

const DnDCalendar = withDragAndDrop(Calendar);

type Props = {
    availableEvents : AvailablityEvent[];
    setAvailableEvents : React.Dispatch<React.SetStateAction<AvailablityEvent[]>>;
    onClose : () => void
}
const Availability = ({onClose,availableEvents,setAvailableEvents}:Props) => {
  const [rangeType, setRangeType] = useState("work_week") // the main view of our calendar
  const [CalendarDate, setCalendarDate] = useState(new Date()) // to handle date changes onNaviagation of the calendar
  const [events, setEvents] = useState<AvailablityEvent[]>(availableEvents); // our events , either an empty array or pass down a prop array as i did

  /**
   * handling saving data to store all user events in a parent state + closing modal because i wrapped my calndar with a modal
   */
  const handleSaveAndClose = () =>{
    setAvailableEvents(events) 
    onClose()
  }

/**
 * eventDrop
 * @param data : data gotten from bigCalendar function : onEventDrop
 */
  const eventDrop = (data:any) => {
    const indexOfEvent = events.findIndex((event) => event.id === data.event.id); // finding the event among my events thats being droped
    console.log(data)
    if(indexOfEvent!==-1){ // if exists
      const updatedEvents = [...events]
      updatedEvents[indexOfEvent].start = data.start; // updating with the new start and end dates
      updatedEvents[indexOfEvent].end = data.end // updating with the new start and end dates
      //@ts-ignore
      updatedEvents[indexOfEvent].allDay = data.isAllDay || false // if all day then --> allDay = true
     // console.log(updatedEvents[indexOfEvent])
      setEvents(updatedEvents)
  }
  };

  /**
   * handleSelect
   * @param {Start,end} : starting date and end of the selected AREA in the calendar
   */
  const handleSelect = ({ start, end }:any) => {
    const title = window.prompt("Title :");
    if (title){
    const newEvent = {
      id : Math.floor(Math.random() * 101), // random between 0 et 100 pour éviter les conflits des ID
      title: title,
      start : start,
      end : end,
      allDay : false
    };
     //@ts-ignore
    setEvents([...events, newEvent]);}
  };
  /**
 * eventResize
 * @param data : data gotten from bigCalendar function : onEventResize
 */
  const eventResize = (data:any) => {
    console.log(data)
    const indexOfEvent = events.findIndex((event) => event.id === data.event.id);// finding the event among my events thats being resized
   // console.log(data.start,data.end)
    if(indexOfEvent!==-1){
        const updatedEvents = [...events]
        updatedEvents[indexOfEvent].start = data.start;// updating with the new start and end dates
        updatedEvents[indexOfEvent].end = data.end// updating with the new start and end dates
        updatedEvents[indexOfEvent].allDay = data.isAllDay || false // if all day then --> allDay = true
        setEvents(updatedEvents)
    }
   // console.log(data);
  };

  /**
   * handleEventClick
   * @param clickedEvent : either the selected event or the double clicked event
   * @description : am using this to ask the user if he wanna delete the event or not ...
   */
  const handleEventClick = (clickedEvent: any) => {
    const answer = window.confirm(`Delete ${clickedEvent.title}?`);
    if (answer) {
      // Finding the index of the event to delete
      const indexOfEvent = events.findIndex((event) => event.id === clickedEvent.id);
      if (indexOfEvent !== -1) {
        // Creating a copy of the events array with the event removed
        const updatedEvents = [...events];
        updatedEvents.splice(indexOfEvent, 1);
        setEvents(updatedEvents);
      }
    }
  };
  const today = new Date()
  let formats = {
    timeGutterFormat: 'HH:mm',
  }
  const localizer = momentLocalizer(moment)
  return (
    <div className='flex flex-col gap-4  items-center justify-center md:w-full py-4'>
      <DnDCalendar
        selectable   
        onNavigate={(newDate: Date)=> setCalendarDate(newDate)}
        min={
          new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9)
        }
        max={
          new Date(today.getFullYear(), today.getMonth(), today.getDate(), 19)
        }
        messages={{
          month: 'mois',
          work_week: 'semaine',
          day: 'jour',
          today: "aujourd'hui",
          next: 'suiv.',
          previous: 'préc.',
          date: 'Le',
          time: 'Horaire',
          event: 'évenement',
        }}
        localizer={localizer}
        formats={formats}
        onSelectSlot={handleSelect}
        //@ts-ignore
        onSelectEvent={(event) => handleEventClick(event)}
        onView={(view)=>{setRangeType(view)}}
        //@ts-ignore
        view={rangeType}
        date={CalendarDate}
        enableAutoScroll={true}
        toolbar={true}
        //@ts-ignore
        defaultView={rangeType}
        views={['month', 'work_week', 'day']}
        events={events}
        onDoubleClickEvent={handleEventClick}
        onEventDrop={eventDrop}
        onEventResize={eventResize}
        resizable
        style={{ height: '70vh' }}
        // eventPropGetter={(event) => ({ ***************************** On peut utiliser ça aprés pour le style du RDV si c'est accepté ou non 
        //   style: {
        //     backgroundColor: event.state === true ? '#ad4ca4' : '#3174ad',
        //   },
        // })}
      />
      <button className='px-4 py-2 bg-blue-500 font-bold' onClick={handleSaveAndClose}>Sauvgarder</button>
    </div>
  );
};
export default Availability

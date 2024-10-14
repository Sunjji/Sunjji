"use client";

import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";

function HomePage() {
  return (
    <>
      <div className="mt-[30px] ml-[50px] rounded-[8px] w-[600px] h-[400px] border bg-point">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          height="400px"
          headerToolbar={{
            start: "prev next",
            center: "title",
            end: "dayGridMonth dayGridWeek",
          }}
          locale={"ko"}
          events={[
            { title: "Event 1", date: "2024-06-01" },
            { title: "Event 2", date: "2024-06-07" },
          ]}
        />
      </div>
    </>
  );
}

export default HomePage;

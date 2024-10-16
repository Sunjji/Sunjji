"use client";

import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";

function HomePage() {
  return (
    <>
      <div className="mt-[30px] ml-[50px] rounded-[8px] w-[600px] h-[400px] border bg-point absolute z-0">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="400px"
          headerToolbar={{
            start: "prev",
            center: "title",
            end: "next",
          }}
          editable={true}
          droppable={true}
          locale={"ko"}
          eventBackgroundColor="pink"
          eventBorderColor="pink"
          events={[
            { title: "Event 1", date: "2024-10-14" },
            { title: "Event 1", date: "2024-10-14" },
          ]}
        />
      </div>
    </>
  );
}

export default HomePage;

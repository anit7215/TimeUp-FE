import React from "react";
import ScheduleContext from "@/src/context/ScheduleContext";

export const useSchedule = () => React.useContext(ScheduleContext);
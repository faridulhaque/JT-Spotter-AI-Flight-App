import { FlightUI } from "@/services/types";
import React from "react";
import { FlightCard } from "./FlightCard";
type PropsFlightList = {
  flights: FlightUI[];
};

function FlightList({ flights }: PropsFlightList) {
  return (
    <div className="w-full px-2 sm:px-4 md:px-0 md:w-11/12 max-w-6xl mx-auto py-10">
      {flights.map((f) => (
        <FlightCard key={f.id} flight={f} />
      ))}
    </div>
  );
}

export default FlightList;

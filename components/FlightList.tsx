"use client";
import { FlightUI } from "@/services/types";
import React, { useState } from "react";
import { FlightCard } from "./FlightCard";
import { Box, Button } from "@mui/material";
type PropsFlightList = {
  flights: FlightUI[];
  carriers: Record<string, string>;
  data: { starting: number; ending: number };
  setData: (value: { starting: number; ending: number }) => void;
};

function FlightList({ flights, carriers, data, setData }: PropsFlightList) {
  return (
    <div className="w-full px-2 sm:px-4 md:px-0 md:w-11/12 max-w-5xl mx-auto py-10">
      {[...flights].slice(data.starting, data.ending).map((f) => (
        <FlightCard
          key={f.id}
          flight={f}
          airline={carriers[f.airlineCode] ?? f.airlineCode}
        />
      ))}

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button
          onClick={() =>
            setData({
              starting: data.starting - 10,
              ending: data.ending - 10,
            })
          }
          disabled={data.starting <= 0}
          variant="contained"
          sx={{
            backgroundColor: "#fff",
            color: "#000",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          Previous
        </Button>
        <Button
          onClick={() =>
            setData({
              starting: data.starting + 10,
              ending: data.ending + 10,
            })
          }
          disabled={data.ending >= flights?.length}
          variant="contained"
          sx={{
            backgroundColor: "#fff",
            color: "#000",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          Next
        </Button>
      </Box>
    </div>
  );
}

export default FlightList;

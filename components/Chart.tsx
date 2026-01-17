"use client";
import { FlightUI } from "@/services/types";
import dayjs from "dayjs";
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
type PropsChart = {
  flights: FlightUI[];
  // carriers: Record<string, string>;
};

function Chart({ flights }: PropsChart) {
  const chartData = flights.map((f) => ({
    time: dayjs(f.departureAt).format("HH:mm"),
    price: f.price,
  }));

  return (
    <div className="w-full px-2 sm:px-4 md:px-0 md:w-11/12 max-w-5xl mx-auto p-10 flex justify-center bg-white mt-10 mb-10 shadow-md rounded-md">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#1e3a8a"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;

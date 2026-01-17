"use client";
import { Airports } from "@/services/types";
import React, { useEffect, useState } from "react";

function Layout() {
  const [departureOptions, setDepartureOptions] = useState<Airports[]>([]);
  const [destinationOptions, setDestinationOptions] = useState<Airports[]>([]);

  const [departureInput, setDepartureInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");

  const [allData, setAllData] = useState([]);

  useEffect(() => {
    async function getSearchData() {
      const res = await fetch(`/api/airports?query=${departureInput}`);
      const { data } = await res.json();
      setDepartureOptions(data);
    }

    getSearchData();
  }, [departureInput]);

  useEffect(() => {
    async function getSearchData() {
      const res = await fetch(`/api/airports?query=${destinationInput}`);
      const { data } = await res.json();
      setDestinationOptions(data);
    }

    getSearchData();
  }, [destinationInput]);

  const handleSearch = async () => {
    const tokenRes = await fetch("/api/token", { method: "POST" });
    const tokenData = await tokenRes.json();
    const token = tokenData?.data?.access_token;
    console.log("token", token);

    // const flightsRes = await fetch(
    //   `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=JFK&destinationLocationCode=LHR&departureDate=2026-01-20&adults=1`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   },
    // );

    // const flightsData = await flightsRes.json();
    // setAllData(flightsData.data);
  };

  console.log("alldata", allData);

  return (
    <div>
      <input
        onChange={(e) => setDepartureInput(e.target.value)}
        type="text"
        placeholder="Medium"
        className="input input-md"
      />
      <input
        onChange={(e) => setDestinationInput(e.target.value)}
        type="text"
        placeholder="Medium"
        className="input input-md"
      />

      <button onClick={handleSearch} className="btn btn-primary">
        Click
      </button>
    </div>
  );
}

export default Layout;

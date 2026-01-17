"use client";
import { Airports, FlightOffer, FlightUI } from "@/services/types";
import React, { use, useEffect, useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { Box, Button, Slider, Typography } from "@mui/material";
import Chart from "./Chart";
import FlightList from "./FlightList";

function HomePage() {
  const [showChart, setShowChart] = useState(false);
  const [dataCount, setDataCount] = useState({ starting: 0, ending: 10 });

  const [departureValue, setDepartureValue] = useState<Airports | null>(null);
  const [departureInput, setDepartureInput] = useState("");
  const [departureOptions, setDepartureOptions] = useState<Airports[]>([]);

  const [destinationValue, setDestinationValue] = useState<Airports | null>(
    null,
  );
  const [destinationInput, setDestinationInput] = useState("");
  const [destinationOptions, setDestinationOptions] = useState<Airports[]>([]);

  const [date, setDate] = useState<Dayjs | null>(null);

  const [allData, setAllData] = useState<FlightOffer[] | null>(null);
  const [carriers, setCarriers] = useState<Record<string, string>>({});

  const [selectedAirline, setSelectedAirline] = useState<string | null>(null);
  const [selectedStops, setSelectedStops] = useState<number | null>(null);

  const [priceRangeValue, setPriceRangeValue] = useState<[number, number]>([
    0, 0,
  ]);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(false);

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
    setLoading(true);
    setSearch(true);
    const tokenRes = await fetch("/api/token", { method: "POST" });
    const tokenData = await tokenRes.json();
    const token = tokenData?.data?.access_token;

    const dateString = date?.format("YYYY-MM-DD");
    const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${departureValue?.iata}&destinationLocationCode=${destinationValue?.iata}&departureDate=${dateString}&adults=1`;

    const flightsRes = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const flightsData = await flightsRes.json();

    setAllData(flightsData.data);
    setCarriers(flightsData.dictionaries?.carriers ?? {});

    const prices = flightsData.data.map((o: FlightOffer) =>
      Number(o.price.total),
    );

    if (prices.length) {
      setPriceRangeValue([Math.min(...prices), Math.max(...prices)]);
    }

    setSelectedAirline(null);
    setSelectedStops(null);
    setLoading(false);
  };

  const sameValueError =
    departureValue &&
    destinationValue &&
    departureValue.iata === destinationValue.iata
      ? "Departure value and destination value can't be the same"
      : null;

  const buttonDisable = Boolean(
    sameValueError || !departureValue?.iata || !destinationValue?.iata || !date,
  );

  const airlineOptions = Object.entries(carriers).map(([code, name]) => ({
    code,
    name,
  }));

  const prices = (allData ?? []).map((o) => Number(o.price.total));

  const availablePriceRange = prices.length
    ? { min: Math.min(...prices), max: Math.max(...prices) }
    : { min: 0, max: 0 };

  const stops = Array.from(
    new Set((allData ?? []).map((o) => o.itineraries[0].segments.length - 1)),
  ).sort((a, b) => a - b);

  const filteredFlights: FlightUI[] = useMemo(() => {
    if (!allData) return [];

    return allData
      .map((offer) => {
        const segments = offer.itineraries[0].segments;
        const first = segments[0];
        const last = segments[segments.length - 1];

        return {
          id: offer.id,
          airlineCode: first.carrierCode,
          flightNumber: `${first.carrierCode}${first.number}`,
          from: first.departure.iataCode,
          to: last.arrival.iataCode,
          departureAt: first.departure.at,
          arrivalAt: last.arrival.at,
          price: Number(offer.price.total),
          currency: offer.price.currency,
          stops: segments.length - 1,
        };
      })
      .filter(
        (f) =>
          (!selectedAirline || f.airlineCode === selectedAirline) &&
          (selectedStops === null || f.stops === selectedStops) &&
          f.price >= priceRangeValue[0] &&
          f.price <= priceRangeValue[1],
      );
  }, [allData, selectedAirline, selectedStops, priceRangeValue]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-blue-300">
      <div className="shadow-2xl bg-white w-11/12 max-w-5xl rounded-md p-8 mt-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Autocomplete<Airports>
            options={departureOptions}
            value={departureValue}
            inputValue={departureInput}
            getOptionLabel={(o) => `${o.city} (${o.iata})`}
            onChange={(_, value) => setDepartureValue(value)}
            onInputChange={(_, value) => setDepartureInput(value)}
            renderInput={(params) => (
              <TextField {...params} label="Departure" fullWidth />
            )}
          />

          <Autocomplete<Airports>
            options={destinationOptions}
            value={destinationValue}
            inputValue={destinationInput}
            getOptionLabel={(o) => `${o.city} (${o.iata})`}
            onChange={(_, value) => setDestinationValue(value)}
            onInputChange={(_, value) => setDestinationInput(value)}
            renderInput={(params) => (
              <TextField {...params} label="Destination" fullWidth />
            )}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              value={date}
              minDate={dayjs().add(1, "day")}
              onChange={(v) => setDate(v)}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider>
        </div>

        {sameValueError && (
          <div className="text-center text-red-500 mt-6">{sameValueError}</div>
        )}

        <div className="w-full flex items-center justify-center h-20">
          <Button
            disabled={buttonDisable}
            onClick={handleSearch}
            variant="contained"
            fullWidth
            sx={{
              maxWidth: { sm: "auto" },
              backgroundColor: "rgb(147 197 253)",
              "&:hover": {
                backgroundColor: "rgb(96 165 250)",
              },
            }}
          >
            Search
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="text-center text-4xl text-white mt-10">Loading...</div>
      ) : (
        <>
          {allData?.length ? (
            <>
              <div className="mt-20">
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    onClick={() => setShowChart(false)}
                    variant={showChart ? "outlined" : "contained"}
                    sx={{
                      backgroundColor: showChart ? "transparent" : "#fff",
                      color: showChart ? "#fff" : "#1e3a8a",
                      borderColor: "#fff",
                      "&:hover": {
                        backgroundColor: showChart
                          ? "rgba(255,255,255,0.1)"
                          : "#fff",
                      },
                    }}
                  >
                    Flights
                  </Button>

                  <Button
                    onClick={() => setShowChart(true)}
                    variant={showChart ? "contained" : "outlined"}
                    sx={{
                      backgroundColor: showChart ? "#fff" : "transparent",
                      color: showChart ? "#1e3a8a" : "#fff",
                      borderColor: "#fff",
                      "&:hover": {
                        backgroundColor: showChart
                          ? "#fff"
                          : "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    Chart
                  </Button>
                </Box>
              </div>
              <div className=" w-full">
                <div className="shadow-2xl bg-white w-11/12 max-w-5xl rounded-md p-8 mt-20 mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Autocomplete<number>
                      options={stops}
                      getOptionLabel={(o) => `${o} stop${o === 1 ? "" : "s"}`}
                      onChange={(_, v) => {
                        setSelectedStops(v);
                        setDataCount({ starting: 0, ending: 10 });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Stops" fullWidth />
                      )}
                    />
                    <Autocomplete<{ code: string; name: string }>
                      options={airlineOptions}
                      getOptionLabel={(o) => o.name}
                      onChange={(_, v) => {
                        setSelectedAirline(v?.code ?? null);
                        setDataCount({ starting: 0, ending: 10 });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Airline" fullWidth />
                      )}
                    />

                    <Box
                      sx={{
                        px: 1,
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                      }}
                    >
                      <Typography
                        sx={{
                          position: "absolute",
                          top: -10,
                          left: 0,
                          fontSize: 12,
                          color: "#000",
                        }}
                      >
                        Price range
                      </Typography>

                      <Slider
                        value={priceRangeValue}
                        min={availablePriceRange.min}
                        max={availablePriceRange.max}
                        onChange={(_, v) => {
                          setPriceRangeValue(v as [number, number]);
                          setDataCount({ starting: 0, ending: 10 });
                        }}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </div>
                </div>

                {filteredFlights?.length > 1 ? (
                  <>
                    {showChart ? (
                      <Chart flights={filteredFlights}></Chart>
                    ) : (
                      <FlightList
                        data={dataCount}
                        setData={setDataCount}
                        carriers={carriers}
                        flights={filteredFlights}
                      ></FlightList>
                    )}
                  </>
                ) : (
                  <div className="text-white text-2xl text-center mt-5">
                    No flights found
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-white text-2xl text-center mt-5">
              {" "}
              {search && "No flights available"}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HomePage;

export type Airports = {
  city: string;
  airport: string;
  iata: string;
  country: string;
};

type Segment = {
  carrierCode: string;
  number: string;
  departure: { iataCode: string; at: string };
  arrival: { iataCode: string; at: string };
};

type Itinerary = {
  duration: string;
  segments: Segment[];
};

export type FlightOffer = {
  id: string;
  itineraries: Itinerary[];
  price: { total: string; currency: string };
};


export type FlightUI = {
  id: string
  airlineCode: string
  flightNumber: string
  from: string
  to: string
  departureAt: string
  arrivalAt: string
  price: number
  currency: string
  stops: number
}

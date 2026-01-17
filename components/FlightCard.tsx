import { Box, Typography } from "@mui/material";
import { FlightUI } from "@/services/types";
import dayjs from "dayjs";

type PropsFlightCard = {
  flight: FlightUI;
  airline: string;
};

export function FlightCard({ flight, airline }: PropsFlightCard) {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: 2,
        p: { xs: 2, md: 3 },
        boxShadow: 2,
        border: "1px solid #e5e7eb",
        color: "#000",
        width: "100%",
        my: 1,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "2fr 3fr 3fr 1.5fr",
          },
          gap: 2,
          alignItems: "center",
        }}
      >
        <Box>
          <Typography sx={{ color: "#1e3a8a", fontWeight: 600 }}>
            {airline}
          </Typography>
          <Typography variant="body2">{flight.flightNumber}</Typography>
        </Box>

        <Box>
          <Typography fontWeight={600}>
            {flight.from} → {flight.to}
          </Typography>
          <Typography variant="body2">Stops: {flight.stops}</Typography>
        </Box>

        <Box>
          <Typography variant="body2">
            Dep: {dayjs(flight.departureAt).format("DD MMM YYYY, HH:mm")}
          </Typography>
          Arr: {dayjs(flight.arrivalAt).format("DD MMM YYYY, HH:mm")}
          <Typography variant="body2"></Typography>
        </Box>

        <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
          <Typography sx={{ fontWeight: 700, color: "#1e3a8a" }}>
            {flight.price} {flight.currency}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

"use client";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TableLandingPage from "@/components/table-landing-page";

export default function Home() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TableLandingPage />{" "}
    </LocalizationProvider>
  );
}

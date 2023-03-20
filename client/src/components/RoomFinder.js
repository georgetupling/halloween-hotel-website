import React, { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormLabel from "@mui/material/FormLabel";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";

function RoomFinder() {
  const [guests, setGuests] = useState(1);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  const handleClick = (event) => {
    event.preventDefault();
    console.log("guests: " + guests);
    console.log("checkIn: " + checkIn);
    console.log("checkOut: " + checkOut);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Paper
        elevation={3}
        sx={{
          display: "inline",
          height: "auto",
          width: "800px",
          margin: "10px",
          padding: "10px",
          textAlign: "left",
        }}
      >
        <FormControl fullWidth>
          <Grid container spacing={3}>
            <Grid item sm={2}>
              <FormLabel component="label">No. of Guests</FormLabel>
              <Select
                onChange={(event) => setGuests(event.target.value)}
                value={guests}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
              </Select>
            </Grid>
            <Grid item sm={4}>
              <FormLabel component="label">Check in</FormLabel>
              <DatePicker
                onChange={(selectedDate) => setCheckIn(selectedDate)}
                value={checkIn}
              />
            </Grid>
            <Grid item sm={4}>
              <FormLabel component="label">Check out</FormLabel>
              <DatePicker
                onChange={(selectedDate) => setCheckOut(selectedDate)}
                value={checkOut}
              />
            </Grid>
            <Grid
              item
              sm={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Button variant="contained" type="submit" onClick={handleClick}>
                Find a Room
              </Button>
            </Grid>
          </Grid>
        </FormControl>
      </Paper>
    </Box>
  );
}

export default RoomFinder;

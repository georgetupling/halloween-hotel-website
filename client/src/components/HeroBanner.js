import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import heroImage from "../images/hero-image.jpg";
import RoomFinder from "./RoomFinder";

const styles = {
  backgroundImage: `url(${heroImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "auto",
  width: "100%",
  textAlign: "center",
  color: "white",
  padding: "30px 0",
};

function HeroBanner() {
  return (
    <Box sx={styles}>
      <Typography variant="h4" component="h1">
        STAY AT SPOOKINGHAM MANOR
      </Typography>
      <Typography variant="h5" component="h2">
        Birmingham's Spookiest Hotel
      </Typography>
      <RoomFinder />
    </Box>
  );
}

export default HeroBanner;

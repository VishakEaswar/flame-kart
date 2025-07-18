import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        textAlign: "center",
        py: 2,
        mt: 4,
        backgroundColor: "#f5f5f5",
        borderTop: "1px solid #ddd",
        height:'100px'
      }}
    >
      <Typography variant="h6" color="text.secondary">
        Made with <span style={{ color: "red" }}>❤️</span> by Vishak KV
      </Typography>
    </Box>
  );
};

export default Footer;

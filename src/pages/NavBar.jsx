//NavBar.jsx
import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"; // optional icon
import { useNavigate } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
} from "@mui/material";

const NavBar = () => {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();
  // on mount
  useEffect(() => {
    const w = JSON.parse(localStorage.getItem("wishlist")) || [];
    const c = JSON.parse(localStorage.getItem("cart")) || [];
    setWishlistCount(w.length);
    setCartCount(c.length);
  }, []);

  // live update
  useEffect(() => {
    const updateCounts = () => {
      setWishlistCount(
        (JSON.parse(localStorage.getItem("wishlist")) || []).length
      );
      setCartCount((JSON.parse(localStorage.getItem("cart")) || []).length);
    };
    window.addEventListener("wishlistUpdated", updateCounts);
    window.addEventListener("cartUpdated", updateCounts);

    return () => {
      window.removeEventListener("wishlistUpdated", updateCounts);
      window.removeEventListener("cartUpdated", updateCounts);
    };
  }, []);

  return (
    <Box>
      {/* Top Navbar */}
      <Box
        sx={{
          height: "120px",
          width: "100%",
          // bgcolor: "navy",
          background: 'linear-gradient(90deg,rgba(0, 0, 84, 1) 0%, rgba(0, 0, 161, 1) 69%)',
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, sm: 4 },
          py: { xs: 1, sm: 0 },
          gap: { xs: 0, sm: 0 },
        }}
      >
        {/* Brand Name */}
        <Typography
          variant="overline"
          sx={{
            fontSize: { xs: "24px", sm: "32px", md: "36px" },
            fontFamily: "sans-serif",
            color: "white",
            letterSpacing: 2,
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          BLUE SHADE
        </Typography>
        {/* Hamburger Icon (mobile only) */}
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{
            display: { xs: "block", sm: "none" },
            color: "white",
            position: "absolute",
            top: 16,
            right: 16,
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Drawer Component */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={() => setDrawerOpen(false)}
            onKeyDown={() => setDrawerOpen(false)}
          >
            <List>
              <ListItem button onClick={() => navigate("/", { state: { fromCart: true } })}>
                <ListItemIcon>
                  <HomeOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
              <Divider />
              <ListItem button onClick={() => navigate("/wishlist")}>
                <ListItemIcon>
                  <FavoriteBorderIcon />
                </ListItemIcon>
                <ListItemText primary={`Wishlist (${wishlistCount})`} />
              </ListItem>
              <Divider />
              <ListItem button onClick={() => navigate("/cartpage")}>
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary={`Cart (${cartCount})`} />
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            gap: 4,
            alignItems: "center",
            color: "white",
          }}
        >
          <Box
            sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            onClick={() => navigate("/")}
          >
            <HomeOutlinedIcon sx={{ mr: 1 }} />
            <Typography
              variant="overline"
              sx={{ fontSize: { xs: 14, sm: 18 } }}
            >
              Home
            </Typography>
          </Box>
          <Box
            sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            onClick={() => navigate("/wishlist")}
          >
            <FavoriteBorderIcon sx={{ mr: 1 }} />
            <Typography
              variant="overline"
              sx={{ fontSize: { xs: 14, sm: 18 } }}
            >
              Wishlist ({wishlistCount})
            </Typography>
          </Box>

          <Box
            sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            onClick={() => navigate("/cartpage")}
          >
            <ShoppingCartIcon sx={{ mr: 1 }} />
            <Typography
              variant="overline"
              sx={{ fontSize: { xs: 14, sm: 18 } }}
            >
              Cart ({cartCount})
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NavBar;

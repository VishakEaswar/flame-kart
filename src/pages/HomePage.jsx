import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
} from "@mui/material";
import ProductPage from "./ProductPage";
import { useNavigate, useLocation } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";

export const HomePage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const productRef = useRef(null);

  // Fetch unique categories
  useEffect(() => {
    fetch("/products.json")
      .then((res) => res.json())
      .then((data) => {
        const unique = Array.from(new Set(data.map((item) => item.category)));
        setCategories(["all", ...unique]);
      });
  }, []);

  // Load wishlist/cart count from localStorage on mount
  useEffect(() => {
    const w = JSON.parse(localStorage.getItem("wishlist")) || [];
    const c = JSON.parse(localStorage.getItem("cart")) || [];
    setWishlistCount(w.length);
    setCartCount(c.length);
  }, []);

  // Update count on storage events
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

  const handleSearch = () => {
    navigate(location.pathname, {
      state: { searchQuery: search, category },
    });

    setTimeout(() => {
      if (productRef.current) {
        productRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <Box>
      {/* HEADER */}
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          backgroundImage: `url('/bg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* TOP NAV */}
        <Box
          sx={{
            height: { xs: "80px", sm: "100px", md: "100px", lg: "100px" },
            width: "100%",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 2, sm: 4 },
            py: 2,

            background:
              "linear-gradient(90deg,rgba(0, 0, 84, 1) 0%, rgba(0, 0, 161, 1) 69%)",
          }}
        >
          {/* Brand */}
          <Typography
            variant="overline"
            sx={{
              fontSize: { xs: "1rem", sm: "1.5rem", md: "2rem", lg: "2.5rem" },
              fontFamily: "sans-serif",
              letterSpacing: 2,
              textAlign: { xs: "center", sm: "left" },
              color: "whitesmoke",
            }}
          >
            BLUE SHADE
          </Typography>

          {/* Hamburger - Mobile */}
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{
              display: { xs: "block", sm: "none" },
              position: "absolute",
              top: 16,
              right: 16,
              color: "white",
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Icons - Desktop */}
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
              <Typography variant="overline" fontSize={{ sm: 16 }}>
                Home
              </Typography>
            </Box>
            <Box
              sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
              onClick={() => navigate("/wishlist")}
            >
              <FavoriteBorderIcon sx={{ mr: 1 }} />
              <Typography variant="body2" fontSize={{ sm: 16 }}>
                Wishlist ({wishlistCount})
              </Typography>
            </Box>
            <Box
              sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
              onClick={() => navigate("/cartpage")}
            >
              <ShoppingCartIcon sx={{ mr: 1 }} />
              <Typography variant="body2" fontSize={{ sm: 16 }}>
                Cart ({cartCount})
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* DRAWER (Mobile Nav) */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box sx={{ width: 250 }} role="presentation">
            <List>
              <ListItem button onClick={() => navigate("/")}>
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

        {/* SEARCH AREA */}
        <Box
          sx={{
            minHeight: "calc(100vh - 160px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              alignItems: "center",
              width: "100%",
              maxWidth: "1000px",
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search products..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ bgcolor: "white", borderRadius: 1 }}
            />

            <TextField
              fullWidth
              select
              label="Category"
              value={category}
              onChange={(e) => {
                const newCategory = e.target.value;
                setCategory(newCategory);
                navigate(location.pathname, {
                  state: { searchQuery: search, category: newCategory },
                });
                setTimeout(() => {
                  if (productRef.current) {
                    productRef.current.scrollIntoView({ behavior: "smooth" });
                  }
                }, 500);
              }}
              sx={{ bgcolor: "white", borderRadius: 1 }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </MenuItem>
              ))}
            </TextField>

            <Button
              onClick={handleSearch}
              variant="contained"
              sx={{
                bgcolor: "navy",
                height: "56px",
                width: { xs: "100%", md: "200px" },
                fontSize: "16px",
              }}
            >
              Search
            </Button>
          </Box>
        </Box>
      </Box>

      <ProductPage ref={productRef} />
    </Box>
  );
};

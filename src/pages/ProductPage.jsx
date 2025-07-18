import React, { useEffect, useState, forwardRef } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { Slider } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";

const ProductPage = forwardRef((props, ref) => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = location.state?.searchQuery?.toLowerCase() || "";
  const initialCategory = location.state?.category || "all";
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [rating, setRating] = useState(5); // 0 to 5 stars

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sort, setSort] = useState("");
  const [currentCategory, setCurrentCategory] = useState(initialCategory);
  useEffect(() => {
    if (location.state?.fromCart) {
      // reload products or reset filters if needed

      setCurrentCategory("all");
      const filtered = getFilteredProducts();
      setFilteredProducts(filtered);
    }
  }, [location]);
  useEffect(() => {
    if (!location.state || location.state?.fromCart) {
      // User came from cart or directly to homepage
      setCurrentCategory("all");
      setSort("");
    }
  }, [location]);

  useEffect(() => {
    if (location.state?.category) {
      setCurrentCategory(location.state.category);
    }
  }, [location.state?.category]);

  useEffect(() => {
    fetch("/products.json")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        localStorage.setItem("products", JSON.stringify(data));

        // ⏫ Get max price and round to nearest 100
        const prices = data.map((p) => p.price || 0);
        const max = Math.ceil(Math.max(...prices) / 100) * 100;

        setPriceRange([0, max]); // 👈 Set initial price range
        setMaxPrice(max); // 👈 Store max price if you use it elsewhere
      });

    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const toggleCart = (product) => {
    const updated = cart.find((item) => item.id === product.id)
      ? cart.filter((item) => item.id !== product.id)
      : [...cart, product];

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const toggleWishlist = (product) => {
    const updated = wishlist.find((item) => item.id === product.id)
      ? wishlist.filter((item) => item.id !== product.id)
      : [...wishlist, product];

    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const getFilteredProducts = () =>
    products.filter((p) => {
      const matchesQuery = query ? p.name.toLowerCase().includes(query) : true;
      const matchesCategory =
        currentCategory === "all" ? true : p.category === currentCategory;
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchesRating = p.rating <= rating;
      return matchesQuery && matchesCategory && matchesPrice && matchesRating;
    });

  useEffect(() => {
    if (products.length === 0) return;
    const filtered = getFilteredProducts();
    setFilteredProducts(filtered);
  }, [products, query, currentCategory, priceRange, rating]);

  const getSortedProducts = () => {
    const filtered = [...filteredProducts];
    switch (sort) {
      case "price-asc":
        return filtered.sort((a, b) => a.price - b.price);
      case "price-desc":
        return filtered.sort((a, b) => b.price - a.price);
      case "rating":
        return filtered.sort((a, b) => b.rating - a.rating);
      case "name-asc":
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return filtered.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return filtered;
    }
  };

  return (
    <Box ref={ref} sx={{ p: 4, bgcolor: "whitesmoke" }}>
      <Grid container spacing={3}>
        {/* Filter / Sort Section */}
        <Grid size={{ xs: 12, sm: 3, md: 3, lg: 2 }}>
          <Box sx={{ position: "sticky", top: 20 }}>
            <TextField
              select
              label="Sort By"
              fullWidth
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              sx={{ mb: 2 }}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="price-asc">Price: Low to High</MenuItem>
              <MenuItem value="price-desc">Price: High to Low</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
              <MenuItem value="name-asc">Name: A-Z</MenuItem>
              <MenuItem value="name-desc">Name: Z-A</MenuItem>
            </TextField>
            <Typography variant="subtitle1" gutterBottom>
              Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
            </Typography>
            <Slider
              value={priceRange}
              min={0}
              max={maxPrice}
              step={100}
              onChange={(e, newValue) => setPriceRange(newValue)}
              valueLabelDisplay="auto"
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle1" gutterBottom>
              Maximum Rating: ⭐ {rating}
            </Typography>
            <Slider
              value={rating}
              min={0}
              max={5}
              step={0.1}
              marks={[
                { value: 0, label: "0" },
                { value: 1, label: "1" },
                { value: 2, label: "2" },
                { value: 3, label: "3" },
                { value: 4, label: "4" },
                { value: 5, label: "5" },
              ]}
              onChange={(e, newValue) => setRating(newValue)}
              valueLabelDisplay="auto"
              sx={{ mb: 2 }}
            />
          </Box>
        </Grid>

        {/* Product Cards Section */}
        <Grid size={{ xs: 12, sm: 9, md: 9, lg: 10 }}>
          <Grid
            container
            spacing={3}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {getSortedProducts().map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 5, lg: 3 }} key={product.id}>
                <Card
                  onClick={() =>
                    navigate("/productview", {
                      state: { productId: product.id },
                    })
                  }
                  sx={{
                    cursor: "pointer",
                    height: 600,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.name}
                    sx={{
                      height: 400,
                      width: "100%",
                      objectFit: "contain",
                      p: 2,
                    }}
                  />
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: {
                          xs: "1rem",
                          sm: "1.1rem",
                          md: "1.0rem",
                          lg: "1.0rem",
                        },
                      }}
                    >
                      {product.name}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                    >
                      ₹{product.price}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: "0.8rem", sm: "0.9rem" },
                        color: "text.secondary",
                      }}
                    >
                      Rating: ⭐ {product.rating}
                    </Typography>

                    <Box
                      display="flex"
                      gap={1}
                      mt={2}
                      justifyContent="center"
                      flexWrap="wrap"
                    >
                      <Button
                        variant="outlined"
                        size="large"
                        color={
                          wishlist.find((item) => item.id === product.id)
                            ? "error"
                            : "success"
                        }
                        startIcon={
                          wishlist.find((item) => item.id === product.id) ? (
                            <DeleteIcon />
                          ) : null
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        sx={{
                          fontSize: {
                            xs: "0.7rem",
                            sm: "0.8rem",
                            md: "0.9rem",
                          },
                          px: { xs: 1, sm: 2 },
                          py: { xs: 0.5, sm: 1 },
                          minWidth: { xs: 120, sm: 150 },
                        }}
                      >
                        {wishlist.find((item) => item.id === product.id)
                          ? "Wishlist"
                          : "Add to Wishlist"}
                      </Button>

                      <Button
                        variant="contained"
                        color={
                          cart.find((item) => item.id === product.id)
                            ? "error"
                            : "primary"
                        }
                        startIcon={
                          cart.find((item) => item.id === product.id) ? (
                            <DeleteIcon />
                          ) : (
                            <ShoppingCartIcon />
                          )
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCart(product);
                        }}
                        sx={{
                          fontSize: {
                            xs: "0.7rem",
                            sm: "0.8rem",
                            md: "0.9rem",
                          },
                          px: { xs: 1, sm: 2 },
                          py: { xs: 0.5, sm: 1 },
                          minWidth: { xs: 100, sm: 130 },
                        }}
                      >
                        {cart.find((item) => item.id === product.id)
                          ? "Cart"
                          : "Add to Cart"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
});

export default ProductPage;

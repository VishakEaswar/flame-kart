import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Stack,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import NavBar from "./NavBar";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);

  const updateWishlist = (updatedList) => {
    setWishlist(updatedList);
    localStorage.setItem("wishlist", JSON.stringify(updatedList));
  };

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== id);
    updateWishlist(updatedWishlist);
  };

 const addToCart = (product) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingIndex = cart.findIndex((item) => item.id === product.id);

  if (existingIndex !== -1) {
    // Product already exists: increase quantity
    cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
  } else {
    // Product doesn't exist: add with quantity 1
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  // Notify navbar to update cart count
  window.dispatchEvent(new Event("cartUpdated"));

  // Remove from wishlist
  const updatedWishlist = wishlist.filter((item) => item.id !== product.id);
  updateWishlist(updatedWishlist);
};


  return (
    <Box>
      <NavBar />
      <Box sx={{ p: 4, bgcolor: "whitesmoke", minHeight: "80vh" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", textAlign: "center", mb: 4 }}
        >
          Your Wishlist
        </Typography>

        {wishlist.length === 0 ? (
          <Typography textAlign="center">No items in wishlist.</Typography>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {wishlist.map((product) => (
              <Grid item xs={12} sm={6} md={5} lg={5} key={product.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    width: "350px",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.name}
                    sx={{
                      height: 180,
                      width: "100%",
                      objectFit: "contain",
                      mb: 2,
                    }}
                  />
                  <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {product.name}
                    </Typography>
                    <Typography variant="body1">
                      Price: ₹{product.price}
                    </Typography>
                  </CardContent>

                  <Stack spacing={1} width="100%">
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ShoppingCartIcon />}
                      fullWidth
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      fullWidth
                      onClick={() => removeFromWishlist(product.id)}
                    >
                      Remove
                    </Button>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default WishlistPage;

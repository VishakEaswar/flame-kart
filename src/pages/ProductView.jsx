import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Rating,
  Snackbar,
  Alert,
} from "@mui/material";
import NavBar from "./NavBar";

const ProductView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { productId } = location.state || {};

  const [product, setProduct] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showAlert = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    if (productId) {
      axios.get("/products.json").then((res) => {
        const found = res.data.find((p) => p.id === productId);
        setProduct(found);
      });
    } else {
      navigate("/");
    }
  }, [productId, navigate]);

  if (!product) return <Typography>Loading product...</Typography>;

  const gst = (product.price * 0.18).toFixed(2);
  const totalPrice = (product.price + parseFloat(gst)).toFixed(2);
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    showAlert("Product added to Cart!", "success");

    // 🔔 Dispatch custom event
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleAddToWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const exists = wishlist.find((item) => item.id === product.id);

    if (exists) {
      showAlert("Product already in Wishlist.", "warning");
      return;
    }

    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    showAlert("Product added to Wishlist!", "success");

    // 🔔 Dispatch custom event
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  return (
    <Box>
      <NavBar />

      <Box sx={{ p: 4, maxWidth: "100%", mx: "auto" }}>
        <Paper elevation={4} sx={{ p: [2, 4], maxWidth: "100%", mx: "auto" }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            alignItems="center"
            justifyContent="center"
          >
            {/* Image */}
            <Box
              component="img"
              src={product.image}
              alt={product.name}
              sx={{
                width: { xs: "100%", md: "50%" },
                maxHeight: 500,
                objectFit: "contain",
                borderRadius: 2,
                border: "1px solid #ccc",
              }}
            />

            {/* Details */}
            <Box
              sx={{
                flex: 1,
                textAlign: { xs: "center", md: "left" },
                mt: { xs: 3, md: 0 },
              }}
            >
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Base Price: ₹{product.price}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Tax (18% GST): ₹{gst}
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                Total: ₹{totalPrice}
              </Typography>

              <Rating
                value={product.rating}
                precision={0.5}
                readOnly
                sx={{ mb: 1 }}
              />

              <Typography variant="body1" sx={{ mb: 1 }}>
                Category: {product.category}
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                {product.description || "No description available."}
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent={{ xs: "center", md: "flex-start" }}
              >
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={handleAddToWishlist}
                >
                  Add to Wishlist
                </Button>
                <Button
                  variant="outlined"
                  sx={{ color: "red" }}
                  size="large"
                  onClick={() => navigate(-1)}
                >
                  Go Back
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Box>

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductView;

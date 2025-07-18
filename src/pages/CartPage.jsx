import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Divider,
  Stack,
} from "@mui/material";
import NavBar from "./NavBar";

const TAX_RATE = 0.18;

const CartPage = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    // Add quantity property if not present
    const cartWithQuantity = storedCart.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
    }));
    setCart(cartWithQuantity);
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const incrementQuantity = (id) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updated);
  };

  const decrementQuantity = (id) => {
    const updated = cart
      .map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);
    updateCart(updated);
  };
  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    updateCart(updated);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + item.price * item.quantity; // ✅ no extra GST added
    }, 0);
  };

  return (
    <Box>
      <NavBar />
      <Box
        sx={{
          p: 4,
          bgcolor: "whitesmoke",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          // height:'80vh'
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          Your Cart
        </Typography>

        {cart.length === 0 ? (
          <Typography>No items in cart.</Typography>
        ) : (
          <>
            <Grid
              container
              spacing={3}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {cart.map((product) => {
                const subtotal = product.price * product.quantity;
                const gstAmount = subtotal * (TAX_RATE / (1 + TAX_RATE));
                const total = subtotal;

                return (
                  <Grid xs={12} md={3} lg={4} key={product.id}>
                    <Card
                      sx={{
                        width: "300px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="300"
                        image={product.image}
                        alt={product.name}
                        sx={{ objectFit: "contain" }}
                      />
                      <CardContent
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="h6">{product.name}</Typography>
                        <Typography>
                          Price (incl. GST): ₹{product.price}
                        </Typography>
                        <Typography>Quantity: {product.quantity}</Typography>

                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          <Button
                            variant="outlined"
                            size="large"
                            onClick={() => decrementQuantity(product.id)}
                          >
                            -
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => incrementQuantity(product.id)}
                          >
                            +
                          </Button>
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        <Typography>
                          Subtotal (incl. GST): ₹{subtotal.toFixed(2)}
                        </Typography>
                        <Typography>
                          GST (18%): ₹{gstAmount.toFixed(2)}
                        </Typography>
                        <Typography fontWeight="bold">
                          Total: ₹{total.toFixed(2)}
                        </Typography>

                        <Button
                          variant="outlined"
                          color="error"
                          size="large"
                          sx={{ mt: 2 }}
                          onClick={() => removeItem(product.id)}
                        >
                          Remove
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            <Divider sx={{ my: 4 }} />
            <Box textAlign="right">
              <Typography variant="h5" gutterBottom>
                Grand Total: ₹{calculateTotal().toFixed(2)}
              </Typography>
              <Button variant="contained" size="large" color="success">
                Proceed to Checkout
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default CartPage;

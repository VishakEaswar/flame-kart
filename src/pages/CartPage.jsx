import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import NavBar from './NavBar';

const TAX_RATE = 0.18;

const CartPage = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    // Add quantity property if not present
    const cartWithQuantity = storedCart.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
    }));
    setCart(cartWithQuantity);
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
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
    const updated = cart.filter(item => item.id !== id);
    updateCart(updated);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const subtotal = item.price * item.quantity;
      const tax = subtotal * TAX_RATE;
      return total + subtotal + tax;
    }, 0);
  };

  return (
    <Box>
      <NavBar />
      <Box sx={{ p: 4 ,
      bgcolor: "whitesmoke",
      display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",}}>
        <Typography variant="h4"   gutterBottom
          sx={{ fontWeight: "bold", mb: 3 }}>
          Your Cart
        </Typography>

        {cart.length === 0 ? (
          <Typography>No items in cart.</Typography>
        ) : (
          <>
            <Grid container spacing={3} sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
              {cart.map((product) => {
                const subtotal = product.price * product.quantity;
                const tax = subtotal * TAX_RATE;
                const total = subtotal + tax;

                return (
                  <Grid  xs={12} md={3} lg={4} key={product.id}>
                    <Card sx={{width:'300px' ,display:'flex',flexDirection:'column',justifyContent:"center",alignItems:'center'}} >
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
                        <Typography>Price: ₹{product.price}</Typography>
                        <Typography>Quantity: {product.quantity}</Typography>

                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          <Button
                            variant="outlined"
                            size="large"
                            onClick={() => decrementQuantity(product.id)}
                          >
                            -
                          </Button>
                          <Button variant="outlined" onClick={() => incrementQuantity(product.id)}>
                            +
                          </Button>
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        <Typography>Subtotal: ₹{subtotal.toFixed(2)}</Typography>
                        <Typography>Tax (18%): ₹{tax.toFixed(2)}</Typography>
                        <Typography fontWeight="bold">
                          Total: ₹{total.toFixed(2)}
                        </Typography>

                        {/* ✅ Remove Button */}
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




// // CartPage.jsx
// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   CardMedia,
//   Typography,
//   Button,
//   Grid,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import NavBar from "./NavBar";

// const CartPage = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

//   useEffect(() => {
//     const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
//     setCartItems(storedCart);
//   }, []);

//   const removeFromCart = (productId) => {
//     const updated = cartItems.filter((item) => item.id !== productId);
//     setCartItems(updated);
//     localStorage.setItem("cart", JSON.stringify(updated));
//   };

//   return (
//     <Box>
//       <NavBar />
//       <Box
//         sx={{
//           mt: 10,
//           px: isSmallScreen ? 2 : 4,
//           py: 3,
//           bgcolor: "whitesmoke",
//           // minHeight: "100vh",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "flex-start",
//           alignItems: "center",
//         }}
//       >
//         <Typography
//           variant={isSmallScreen ? "h6" : "h5"}
//           gutterBottom
//           sx={{ fontWeight: "bold", mb: 3 }}
//         >
//           Your Cart
//         </Typography>

//         {cartItems.length === 0 ? (
//           <Typography variant="body1">No products in cart.</Typography>
//         ) : (
//           <Grid container spacing={3}>
//             {cartItems.map((product) => (
//               <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
//                 <Card
//                   sx={{
//                     height: "100%",
//                     display: "flex",
//                     flexDirection: "column",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   <CardMedia
//                     component="img"
//                     height="180"
//                     image={product.image}
//                     alt={product.name || "Product image"}
//                     sx={{ objectFit: "cover" }}
//                   />
//                   <CardContent
//                     sx={{
//                       display: "flex",
//                       flexDirection: "column",
//                       justifyContent: "center",
//                       alignItems: "center",
//                     }}
//                   >
//                     <Typography
//                       variant="subtitle1"
//                       fontWeight="bold"
//                       gutterBottom
//                     >
//                       {product.name}
//                     </Typography>
//                     <Typography variant="body2">₹{product.price}</Typography>
//                     {/* <Typography variant="body2">Category: {product.category}</Typography> */}
//                     <Typography variant="body2">⭐ {product.rating}</Typography>
//                     <Button
//                       variant="outlined"
//                       color="error"
//                       fullWidth
//                       onClick={() => removeFromCart(product.id)}
//                       sx={{ mt: 2 }}
//                     >
//                       Remove from Cart
//                     </Button>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default CartPage;

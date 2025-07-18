import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import NavBar from './NavBar';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(storedWishlist);
  }, []);

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter(item => item.id !== id);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  return (
    <Box>
      <NavBar />
      <Box sx={{ p: 4, bgcolor: "whitesmoke", minHeight: "100vh" }}>
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
          <Grid container spacing={3}>
            {wishlist.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
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

                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    REMOVE
                  </Button>
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

// const WishlistPage = () => {
//   const [wishlist, setWishlist] = useState([]);
//   const [cart, setCart] = useState([]);

//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

//   useEffect(() => {
//     const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
//     const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
//     setWishlist(storedWishlist);
//     setCart(storedCart);
//   }, []);

//  const addToCart = (product) => {
//   if (!cart.find((item) => item.id === product.id)) {
//     const updated = [...cart, { ...product, quantity: 1 }];
//     setCart(updated);
//     localStorage.setItem("cart", JSON.stringify(updated));
//     window.dispatchEvent(new Event("cartUpdated"));
//   }

//   // Remove the item from wishlist after adding to cart
//   removeFromWishlist(product.id);
// };


//   const removeFromWishlist = (productId) => {
//     const updated = wishlist.filter((item) => item.id !== productId);
//     setWishlist(updated);
//     localStorage.setItem("wishlist", JSON.stringify(updated));
//     window.dispatchEvent(new Event("wishlistUpdated"));
//   };

//   return (
//     <Box>
//       <NavBar />
//       <Box
//         sx={{
//           // mt: 10,
//           px: isSmallScreen ? 2 : 4,
//           py: 3,
//           bgcolor: "whitesmoke",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "flex-start",
//           alignItems: "center",
//         }}
//       >
//         <Typography
//           variant={isSmallScreen ? "h6" : "h4"}
//           gutterBottom
//           sx={{ fontWeight: "bold", mb: 3 }}
//         >
//           Your Wishlist
//         </Typography>

//         {wishlist.length === 0 ? (
//           <Typography
//             variant="body1"
//             sx={{ textAlign: "center", mt: 4, color: "gray" }}
//           >
//             No items in your wishlist.
//           </Typography>
//         ) : (
//           <Grid container  spacing={6} sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
//             {wishlist.map((product) => (
//               <Grid  xs={12} md={4} lg={4}   key={product.id} >
//                 <Card sx={{width:'500px' ,display:'flex',flexDirection:'column',justifyContent:"center",alignItems:'center'}} >
//                   <CardMedia
//                     component="img"
//                     height="400"
//                     image={product.image}
//                     alt={product.name}
//                     sx={{ objectFit: "contain" }}
//                   />
//                   <CardContent
//                     sx={{
//                       display: "flex",
//                       flexDirection: "column",
//                       justifyContent: "center",
//                       alignItems: "center",
//                     }}
//                   >
//                     <Typography variant="h5" fontWeight="bold" gutterBottom>
//                       {product.name}
//                     </Typography>
//                     <Typography variant="h6" color="text.secondary">
//                       ₹{product.price}
//                     </Typography>
//                     <Typography variant="h6" color="text.secondary">
//                      Rating : ⭐ {product.rating}
//                     </Typography>
//                     <Box sx={{ mt: 2, display: "flex", gap: 1, width: "100%" }}>
//                       <Button
//                         variant="contained"
//                         size="large"
//                         fullWidth
//                         color="primary"
//                         onClick={() => addToCart(product)}
//                         // sx={{width:'300px'}}
//                       >
//                         Add to Cart
//                       </Button>
//                       <Button
//                         variant="outlined"
//                         size="large"
//                         fullWidth
//                         color="error"
//                         onClick={() => removeFromWishlist(product.id)}
//                       >
//                         Remove
//                       </Button>
//                     </Box>
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

// export default WishlistPage;


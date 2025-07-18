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
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

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
        <Paper elevation={4} sx={{ p: 4 }}>
          <Stack direction={["column", "row"]} spacing={6}>
            <Box
              component="img"
              src={product.image}
              alt={product.name}
              sx={{
                width: ["100%", "50%"],
                maxHeight: 600,
                objectFit: "contain",
                borderRadius: 3,
                border: "1px solid #ccc",
              }}
            />
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Base Price: ₹{product.price}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Tax (18% GST): ₹{gst}
              </Typography>
              <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
                Total: ₹{totalPrice}
              </Typography>

              <Rating
                value={product.rating}
                precision={0.5}
                readOnly
                sx={{ mb: 2 }}
              />
              <Typography variant="body1" sx={{ mb: 2 }}>
                Category: {product.category}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {product.description || "No description available."}
              </Typography>

              <Stack direction="row" spacing={2}>
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



// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Box,
//   Typography,
//   Paper,
//   Button,
//   Stack,
//   Rating,
// } from "@mui/material";
// import NavBar from "./NavBar";

// const ProductView = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { productId } = location.state || {};

//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     if (productId) {
//       axios.get("/products.json").then((res) => {
//         const found = res.data.find((p) => p.id === productId);
//         setProduct(found);
//       });
//     } else {
//       navigate("/");
//     }
//   }, [productId, navigate]);

//   if (!product) return <Typography>Loading product...</Typography>;

//   const gst = (product.price * 0.18).toFixed(2);
//   const totalPrice = (product.price + parseFloat(gst)).toFixed(2);

// const handleAddToCart = (product) => {
//   const cart = JSON.parse(localStorage.getItem("cart")) || [];
//   const exists = cart.find((item) => item.id === product.id);

//   if (exists) {
//     if (window.confirm("Product already in Cart. Add again?")) {
//       cart.push(product);
//       localStorage.setItem("cart", JSON.stringify(cart));
//       window.location.reload(); // ✅ refresh to update UI
//     }
//   } else {
//     cart.push(product);
//     localStorage.setItem("cart", JSON.stringify(cart));
//     alert("Added to Cart!");
//     window.location.reload(); // ✅ refresh to update UI
//   }
// };

// const handleAddToWishlist = (product) => {
//   const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
//   const exists = wishlist.find((item) => item.id === product.id);

//   if (exists) {
//     if (window.confirm("Product already in Wishlist. Add again?")) {
//       wishlist.push(product);
//       localStorage.setItem("wishlist", JSON.stringify(wishlist));
//       window.location.reload(); // ✅ refresh to update UI
//     }
//   } else {
//     wishlist.push(product);
//     localStorage.setItem("wishlist", JSON.stringify(wishlist));
//     alert("Added to Wishlist!");
//     window.location.reload(); // ✅ refresh to update UI
//   }
// };



//   return (
//     <Box>
//       <NavBar />
//       <Box sx={{ p: 4, maxWidth: "100%", mx: "auto" }}>
//         <Paper  elevation={4} sx={{ p: 4 }}>
//           <Stack direction={["column", "row"]} spacing={6}>
//             <Box
//               component="img"
//               src={product.image}
//               alt={product.name}
//               sx={{
//                 width: ["100%", "50%"],
//                 maxHeight: 600,
//                 objectFit: "contain",
//                 borderRadius: 3,
//                 border: "1px solid #ccc",
                
//               }}
//             />
//             <Box sx={{ flex: 1, display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
//               <Typography variant="h4" fontWeight="bold" gutterBottom>
//                 {product.name}
//               </Typography>

//               <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
//                 Base Price: ₹{product.price}
//               </Typography>
//               <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
//                 Tax (18% GST): ₹{gst}
//               </Typography>
//               <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
//                 Total: ₹{totalPrice}
//               </Typography>

//               <Rating
//                 value={product.rating}
//                 precision={0.5}
//                 readOnly
//                 sx={{ mb: 2 }}
//               />
//               <Typography variant="body1" sx={{ mb: 2 }}>
//                 Category: {product.category}
//               </Typography>
//               <Typography variant="body1" sx={{ mb: 3 }}>
//                 {product.description || "No description available."}
//               </Typography>

//               <Stack direction="row" spacing={2}>
//                 <Button
//                   variant="contained"
//                   color="success"
//                   size="large"
//                  onClick={() => handleAddToCart(product)}
//                 >
//                   Add to Cart
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="primary"
//                   size="large"
//                   onClick={() => handleAddToWishlist(product)}
//                 >
//                   Add to Wishlist
//                 </Button>
//                 <Button variant="outlined" sx={{color:'red'}} size="large"  onClick={() => navigate(-1)}>
//                   Go Back
//                 </Button>
//               </Stack>
//             </Box>
//           </Stack>
//         </Paper>
//       </Box>
//     </Box>
//   );
// };

// export default ProductView;

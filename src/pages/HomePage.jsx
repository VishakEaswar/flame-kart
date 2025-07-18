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
            height: { xs: "auto", sm: "120px" },
            width: "100%",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 2, sm: 4 },
            py: 2,
            // bgcolor:'navy'
            // bgcolor: "rgba(0,0,128,0.2)",
background: 'linear-gradient(90deg,rgba(0, 0, 84, 1) 0%, rgba(0, 0, 161, 1) 69%)'

          }}
        >
          {/* Brand */}
          <Typography
            variant="overline"
            sx={{
              fontSize: { xs: "24px", sm: "32px", md: "36px" },
              fontFamily: "sans-serif",
              letterSpacing: 2,
              textAlign: { xs: "center", sm: "left" },
              color:'whitesmoke',
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
              color: "navy",
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
            <Box sx={{ cursor: "pointer", display: "flex", alignItems: "center" }} onClick={() => navigate("/")}>
              <HomeOutlinedIcon sx={{ mr: 1 }} />
              <Typography variant="overline" fontSize={{ sm: 16 }}>
                Home
              </Typography>
            </Box>
            <Box sx={{ cursor: "pointer", display: "flex", alignItems: "center" }} onClick={() => navigate("/wishlist")}>
              <FavoriteBorderIcon sx={{ mr: 1 }} />
              <Typography variant="overline" fontSize={{ sm: 16 }}>
                Wishlist ({wishlistCount})
              </Typography>
            </Box>
            <Box sx={{ cursor: "pointer", display: "flex", alignItems: "center" }} onClick={() => navigate("/cartpage")}>
              <ShoppingCartIcon sx={{ mr: 1 }} />
              <Typography variant="overline" fontSize={{ sm: 16 }}>
                Cart ({cartCount})
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* DRAWER (Mobile Nav) */}
        <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: 250 }} role="presentation">
            <List>
              <ListItem button onClick={() => navigate("/")}>
                <ListItemIcon><HomeOutlinedIcon /></ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
              <Divider />
              <ListItem button onClick={() => navigate("/wishlist")}>
                <ListItemIcon><FavoriteBorderIcon /></ListItemIcon>
                <ListItemText primary={`Wishlist (${wishlistCount})`} />
              </ListItem>
              <Divider />
              <ListItem button onClick={() => navigate("/cartpage")}>
                <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
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
              sx={{ bgcolor: "white", borderRadius: 1,}}
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

      {/* DOWN ARROW BUTTON */}
      {/* <Button
        onClick={() =>
          productRef.current?.scrollIntoView({ behavior: "smooth" })
        }
        sx={{
          position: "absolute",
          bottom: 30,
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "white",
          borderRadius: "50%",
          width: 60,
          height: 60,
          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          zIndex: 1000,
          "&:hover": {
            backgroundColor: "#e0e0e0",
          },
        }}
      >
        <KeyboardArrowDownIcon fontSize="large" />
      </Button> */}

      {/* PRODUCT SECTION */}
      <ProductPage ref={productRef} />
    </Box>
  );
};


// import React, { useEffect, useState, useRef } from "react";
// import { Box, Button, TextField, Typography, MenuItem } from "@mui/material";
// import ProductPage from "./ProductPage";
// import { useNavigate, useLocation } from "react-router-dom";
// // import FavoriteIcon from "@mui/icons-material/Favorite";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"; // optional icon
// import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import MenuIcon from "@mui/icons-material/Menu";
// import {
//   Drawer,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   IconButton,
//   Divider,
// } from "@mui/material";

// export const HomePage = () => {
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("all");
//   const [categories, setCategories] = useState([]);
//   const [wishlistCount, setWishlistCount] = useState(0);
//   const [cartCount, setCartCount] = useState(0);
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const productRef = useRef(null);

//   // 🔁 Load categories
//   useEffect(() => {
//     fetch("/products.json")
//       .then((res) => res.json())
//       .then((data) => {
//         const unique = Array.from(new Set(data.map((item) => item.category)));
//         setCategories(["all", ...unique]);
//       });
//   }, []);

//   // on mount
//   useEffect(() => {
//     const w = JSON.parse(localStorage.getItem("wishlist")) || [];
//     const c = JSON.parse(localStorage.getItem("cart")) || [];
//     setWishlistCount(w.length);
//     setCartCount(c.length);
//   }, []);

//   // live update
//   useEffect(() => {
//     const updateCounts = () => {
//       setWishlistCount(
//         (JSON.parse(localStorage.getItem("wishlist")) || []).length
//       );
//       setCartCount((JSON.parse(localStorage.getItem("cart")) || []).length);
//     };
//     window.addEventListener("wishlistUpdated", updateCounts);
//     window.addEventListener("cartUpdated", updateCounts);

//     return () => {
//       window.removeEventListener("wishlistUpdated", updateCounts);
//       window.removeEventListener("cartUpdated", updateCounts);
//     };
//   }, []);

//   const handleSearch = () => {
//     navigate(location.pathname, {
//       state: { searchQuery: search, category },
//     });

//     setTimeout(() => {
//       if (productRef.current) {
//         productRef.current.scrollIntoView({ behavior: "smooth" });
//       }
//     }, 100);
//   };

//   return (
//     <Box>
//       {/* Header */}
//       <Box
//         sx={{
//           minHeight: "100vh",
//           width: "100%",
//           backgroundImage: `url('/bg.jpg')`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//         }}
//       >
//         {/* Top Navbar */}
//         <Box
//           sx={{
//             height: "120px",
//             width: "100%",
//             bgcolor: "linear-gradient(90deg,rgba(2, 2, 54, 1) 0%, rgba(0, 0, 128, 1) 32%, rgba(78, 166, 217, 1) 100%)",
//             display: "flex",
//             flexDirection: { xs: "column", sm: "row" },
//             justifyContent: "space-between",
//             alignItems: "center",
//             px: { xs: 2, sm: 4 },
//             py: { xs: 1, sm: 0 },
//             gap: { xs: 1, sm: 0 },
//           }}
//         >
//           {/* Brand Name */}
//           <Typography
//             variant="overline"
//             sx={{
//               fontSize: { xs: "24px", sm: "32px", md: "36px" },
//               fontFamily: "sans-serif",
//               color: "white",
//               letterSpacing: 2,
//               textAlign: { xs: "center", sm: "left" },
//               color:'navy'
//             }}
//           >
//             BLUE SHADE
//           </Typography>
//           {/* Hamburger Icon (mobile only) */}
//           <IconButton
//             onClick={() => setDrawerOpen(true)}
//             sx={{
//               display: { xs: "block", sm: "none" },
//               color: "navy",
//               position: "absolute",
//               top: 16,
//               right: 16,
//             }}
//           >
//             <MenuIcon />
//           </IconButton>

//           {/* Drawer Component */}
//           <Drawer
//             anchor="left"
//             open={drawerOpen}
//             onClose={() => setDrawerOpen(false)}
//           >
//             <Box
//               sx={{ width: 250 }}
//               role="presentation"
//               onClick={() => setDrawerOpen(false)}
//               onKeyDown={() => setDrawerOpen(false)}
//             >
//               <List>
//                 <ListItem button onClick={() => navigate("/")}>
//                   <ListItemIcon>
//                     <HomeOutlinedIcon />
//                   </ListItemIcon>
//                   <ListItemText primary="Home" />
//                 </ListItem>
//                 <Divider />
//                 <ListItem button onClick={() => navigate("/wishlist")}>
//                   <ListItemIcon>
//                     <FavoriteBorderIcon />
//                   </ListItemIcon>
//                   <ListItemText primary={`Wishlist (${wishlistCount})`} />
//                 </ListItem>
//                 <Divider />
//                 <ListItem button onClick={() => navigate("/cartpage")}>
//                   <ListItemIcon>
//                     <ShoppingCartIcon />
//                   </ListItemIcon>
//                   <ListItemText primary={`Cart (${cartCount})`} />
//                 </ListItem>
//               </List>
//             </Box>
//           </Drawer>

//           {/* Top Right Icons */}
//           <Box
//             sx={{
//               display: { xs: "none", sm: "flex" },
//               gap: 4,
//               alignItems: "center",
//               color: "white",
//             }}
//           >
//             <Box
//               sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
//               onClick={() => navigate("/")}
//             >
//               <HomeOutlinedIcon sx={{ mr: 1 ,color:'navy'}} />
//               <Typography
//                 variant="overline"
//                 sx={{ fontSize: { xs: 14, sm: 18 } ,color:'navy' }}
//               >
//                 Home
//               </Typography>
//             </Box>
//             <Box
//               sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
//               onClick={() => navigate("/wishlist")}
//             >
//               <FavoriteBorderIcon sx={{ mr: 1  ,color:'navy'}} />
//               <Typography
//                 variant="overline"
//                 sx={{ fontSize: { xs: 14, sm: 18 ,color:'navy' } }}
//               >
//                 Wishlist ({wishlistCount})
//               </Typography>
//             </Box>

//             <Box
//               sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
//               onClick={() => navigate("/cartpage")}
//             >
//               <ShoppingCartIcon sx={{ mr: 1 ,color:'navy' }} />
//               <Typography
//                 variant="overline"
//                 sx={{ fontSize: { xs: 14, sm: 18 }  ,color:'navy'}}
//               >
//                 Cart ({cartCount})
//               </Typography>
//             </Box>
//           </Box>
//         </Box>

//         {/* Search Area */}
//         <Box
//           sx={{
//             height: "calc(100vh - 200px)",
//             width: "100%",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             px: 2,
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: { xs: "column", md: "row" },
//               gap: 2,
//               alignItems: "center",
//               justifyContent: "center",
//               width: "100%",
//               maxWidth: "1000px",
//             }}
//           >
           
//             {/* Search Field */}
//             <TextField
//               variant="outlined"
//               fullWidth
//               placeholder="Search products..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               sx={{
//                 bgcolor: "white",
//                 borderRadius: "5px",
//                 input: { padding: { xs: "18px" } },
//               }}
//             />

//             {/* Category Dropdown */}
//             <TextField
//               fullWidth
//               select
//               label="Category"
//               value={category}
//               onChange={(e) => {
//                 const newCategory = e.target.value;
//                 setCategory(newCategory);

//                 navigate(location.pathname, {
//                   state: { searchQuery: search, category: newCategory },
//                 });

//                 setTimeout(() => {
//                   if (productRef.current) {
//                     productRef.current.scrollIntoView({ behavior: "smooth" });
//                   }
//                 }, 500);
//               }}
//               sx={{
//                 bgcolor: "white",
//                 borderRadius: "5px",
//                 width: { md: "400px", lg: "500px" },
//               }}
//             >
//               {categories.map((cat) => (
//                 <MenuItem key={cat} value={cat}>
//                   {cat.charAt(0).toUpperCase() + cat.slice(1)}
//                 </MenuItem>
//               ))}
//             </TextField>

//             {/* Search Button */}
//             <Button
//               onClick={handleSearch}
//               variant="contained"
//               sx={{
//                 bgcolor: "navy",
//                 height: "56px",
//                 width: { xs: "100%", md: "200px" },
//                 fontSize: "16px",
//               }}
//             >
//               Search
//             </Button>
//           </Box>
//         </Box>
//       </Box>
//       <Button
//         onClick={() => {
//           if (productRef.current) {
//             productRef.current.scrollIntoView({ behavior: "smooth" });
//           }
//         }}
//         sx={{
//           position: "absolute",
//           bottom: 30,
//           left: "50%",
//           transform: "translateX(-50%)",
//           minWidth: "auto",
//           backgroundColor: "white",
//           borderRadius: "50%",
//           width: 60,
//           height: 60,
//           boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
//           zIndex: 1000,
//           "&:hover": {
//             backgroundColor: "#e0e0e0",
//           },
//         }}
//       >
//         <KeyboardArrowDownIcon fontSize="large" />
//       </Button>
//       {/* Product Section */}
//       <ProductPage ref={productRef} />
//     </Box>
//   );
// };


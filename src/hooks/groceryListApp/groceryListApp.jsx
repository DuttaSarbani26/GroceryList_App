import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  IconButton,
  Paper,
  CssBaseline,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const initialItems = [
  { id: 1, name: "Milk", price: 35, category: "Dairy" },
  { id: 2, name: "Bread", price: 20, category: "Bakery" },
  { id: 3, name: "Eggs", price: 8, category: "Dairy" },
  { id: 4, name: "Butter", price: 30, category: "Dairy" },
  { id: 5, name: "Cheese", price: 20, category: "Dairy" },
  { id: 6, name: "Yogurt", price: 40, category: "Dairy" },
  { id: 7, name: "Pasta Sauce", price: 95, category: "Canned Goods" },
  { id: 8, name: "Soup", price: 100, category: "Canned Goods" },
  { id: 9, name: "Coffee", price: 250, category: "Beverages" },
  { id: 10, name: "Juice", price: 90, category: "Beverages" },
  { id: 11, name: "Cookies", price: 50, category: "Bakery" },
  { id: 12, name: "Chips", price: 40, category: "Snacks" },
  { id: 13, name: "Crackers", price: 30, category: "Snacks" },
  { id: 14, name: "Nuts", price: 60, category: "Snacks" },
];

const couponCode = {
  SAVE10: 10,
  SAVE20: 20,
  SAVE30: 30,
};

export default function GroceryListApp() {
  const [items] = useState(initialItems);

  const [cart, setCart] = useState(() => {
    const savedItems = localStorage.getItem("groceryItems");
    return savedItems ? JSON.parse(savedItems) : [];
  });

  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc");
  const [category, setCategory] = useState("All");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    localStorage.setItem("groceryItems", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    // Prevent duplicate add
    if (!cart.some((i) => i.id === item.id)) {
      const updated = [...cart, item];
      setCart(updated);
      localStorage.setItem("groceryItems", JSON.stringify(updated));
    }
  };

  const removeFromCart = (id) => {
    setHistory((prev) => [...prev, cart]);
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("groceryItems", JSON.stringify(updated));
  };

  const undo = () => {
    const lastState = history[history.length - 1];
    if (lastState) {
      setCart(lastState);
      setHistory(history.slice(0, -1));
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const finalTotal = () => {
    let totalPrice = total;

    if (appliedCoupon) {
      if (total > 100) {
        totalPrice = totalPrice * 0.9;
      }

      if (couponCode[appliedCoupon]) {
        totalPrice =
          (totalPrice * (100 - couponCode[appliedCoupon])) / 100;
      }
    }

    return totalPrice.toFixed(2);
  };

  const applyCoupon = () => {
    if (couponCode[coupon]) {
      setAppliedCoupon(coupon);
    }
  };

  const filteredItems = items
    .filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((item) =>
      category === "All" ? true : item.category === category
    )
    .sort((a, b) =>
      sort === "asc" ? a.price - b.price : b.price - a.price
    );

  return (
    <>
      <CssBaseline />
      <Container maxWidth="100%" disableGutters sx={{ minHeight: '100vh', px: 0, py: 0, bgcolor: 'background.default', overflowX: 'hidden' }}>
        <Box sx={{ width: '100%', minHeight: '100vh', maxWidth: 1600, mx: 'auto', px: { xs: 1, md: 4 }, py: { xs: 2, md: 4 }, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h3" fontWeight="bold" color="primary.main" gutterBottom align="center" sx={{ letterSpacing: 2, mb: 4 }}>
            🛒 Grocery Store
          </Typography>

          {/* Controls */}
          <Box sx={{ p: { xs: 1, md: 2 }, mb: 3, borderRadius: 3, background: '#fff', display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 900, width: '100%', boxShadow: 2 }}>
            <TextField
              label="Search items"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 180 }}
            />

            <Select
              size="small"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="asc">Price: Low → High</MenuItem>
              <MenuItem value="desc">Price: High → Low</MenuItem>
            </Select>

            <Select
              size="small"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="All">All Categories</MenuItem>
              <MenuItem value="Dairy">Dairy</MenuItem>
              <MenuItem value="Bakery">Bakery</MenuItem>
              <MenuItem value="Canned Goods">Canned Goods</MenuItem>
              <MenuItem value="Beverages">Beverages</MenuItem>
              <MenuItem value="Snacks">Snacks</MenuItem>
            </Select>
          </Box>

          {/* Flex Layout for Main Content */}
          <Box display="flex" gap={4} flexDirection={{ xs: 'column', md: 'row' }} alignItems="flex-start" justifyContent="center" width="100%" maxWidth={1300}>
          {/* LEFT: ITEMS */}
          <Box flex={2} minWidth={0} sx={{ maxWidth: 700, width: '100%' }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 700 }}>
              Items
            </Typography>

            <Paper sx={{ borderRadius: 3, boxShadow: 3, background: '#f8fafc', width: '100%' }}>
              <List>
                {filteredItems.map((item, index) => (
                  <Box key={item.id}>
                    <ListItem
                      sx={{ py: 2 }}
                      secondaryAction={
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                          onClick={() => addToCart(item)}
                        >
                          Add
                        </Button>
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography fontWeight="600" color="text.primary">
                            {item.name}
                          </Typography>
                        }
                        secondary={
                          <Box display="flex" gap={1} mt={0.5}>
                            <Chip
                              label={`₹${item.price}`}
                              size="small"
                              color="primary"
                              sx={{ fontWeight: 600 }}
                            />
                            <Chip
                              label={item.category}
                              size="small"
                              variant="outlined"
                              sx={{ fontWeight: 500 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    {index !== filteredItems.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </Paper>
          </Box>

          {/* RIGHT: CART */}
          <Box flex={1} minWidth={320} sx={{ maxWidth: 450, width: '100%' }} position="sticky" top={20}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 700 }}>
              Cart Summary
            </Typography>

            <Paper sx={{ borderRadius: 3, p: 2, boxShadow: 3, background: '#f8fafc', width: '100%' }}>
              <List>
                {cart.map((item, index) => (
                  <Box key={item.id}>
                    <ListItem
                      secondaryAction={
                        <IconButton
                          color="error"
                          sx={{ background: '#fff', borderRadius: 2, boxShadow: 1, '&:hover': { background: '#ffeaea' } }}
                          onClick={() => removeFromCart(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={<Typography fontWeight={600}>{item.name}</Typography>}
                        secondary={<Typography color="text.secondary">₹{item.price}</Typography>}
                      />
                    </ListItem>
                    {index !== cart.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography>Total: <b>₹{total}</b></Typography>
              <Typography fontWeight="bold" fontSize={18} color="primary.main">
                Final: ₹{finalTotal()}
              </Typography>

              <Box mt={2} display="flex" gap={1} flexWrap="wrap" alignItems="center">
                <TextField
                  label="Coupon"
                  size="small"
                  value={coupon}
                  onChange={(e) =>
                    setCoupon(e.target.value.toUpperCase())
                  }
                  sx={{ minWidth: 120 }}
                />
                <Button variant="contained" color="primary" onClick={applyCoupon} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
                  Apply
                </Button>
                {/* Undo only shown if a delete has happened (history is not empty) */}
                {history.length > 0 && (
                  <Button variant="outlined" color="secondary" onClick={undo} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
                    Undo
                  </Button>
                )}
              </Box>
            </Paper>
          </Box>
        </Box>
        </Box>
      </Container>
    </>
  );
}





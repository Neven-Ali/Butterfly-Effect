import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Box,
  AppBar,
  Toolbar,
  Container,
} from "@mui/material";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ0MTIxNzg0LCJpYXQiOjE3NDQwOTI5ODQsImp0aSI6ImI2MDQ4OWJlMDNkZjQ5ZTZhMGYwZjI0OTRhMTMyNDc5IiwidXNlcl9pZCI6Mn0.yUQLgnGqcnYfH00thmbQ71Tpi0AN3Hx7baS6cKiNIg4"; // استبدل هذا بالقيمة الفعلية للـ token
        const response = await axios.get(
          "https://daaboul.nasayimhalab.com/api/manager/products/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === "success") {
          setProducts(response.data.data.results);
        } else {
          setError("Failed to fetch products");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            عرض المنتجات
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          قائمة المنتجات
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="products table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>اسم المنتج</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>السعر</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>الحالة</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow key={product.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {product.translations?.ar?.name || "لا يوجد اسم"}
                    </TableCell>
                    <TableCell>
                      {product.price}{" "}
                      {typeof product.price === "number" ? "ل.س" : ""}
                    </TableCell>
                    <TableCell>
                      {product.active ? (
                        <Typography color="success.main">نشط</Typography>
                      ) : (
                        <Typography color="error.main">غير نشط</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;

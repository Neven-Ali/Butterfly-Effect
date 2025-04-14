import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  DataGrid,
  GridToolbar,
  gridClasses,
  gridPageCountSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import {
  LinearProgress,
  Alert,
  Typography,
  Box,
  Pagination,
  styled,
  Paper,
  Chip,
  Avatar,
  Stack,
  Card,
  CardMedia,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { ArrowForward, Image, LocalOffer, Store } from "@mui/icons-material";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[50],
    "&:hover": {
      backgroundColor: theme.palette.grey[100],
    },
  },
}));

function CustomPagination() {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="primary"
      count={pageCount}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://daaboul.nasayimhalab.com/api/manager/products/",
          {
            headers: {
              Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzODg2MDM5LCJpYXQiOjE3NDM4NTcyMzksImp0aSI6ImZkNjkwMjRjNGU1ZDQ3ZTRhZTY0MDc4MTJmZGIxZTZiIiwidXNlcl9pZCI6Mn0.WWV8wycL9qYY3jrOE1lo8VioVTiZttseLoLj-ZsbTl4"}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.status === "success") {
          // إضافة id لكل منتج لأنه مطلوب لـ DataGrid
          const productsWithIds = response.data.data.results.map(
            (product, index) => ({
              ...product,
              id: product.id || index + 1,
            })
          );
          setProducts(productsWithIds);
        } else {
          setError("Failed to fetch products");
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleRowClick = (params) => {
    setSelectedProduct(params.row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // تعريف أعمدة الجدول
  const columns = [
    {
      field: "photos_list",
      headerName: "صورة المنتج",
      width: 200,
      renderCell: (params) => {
        const firstPhoto = params.value?.[0];
        return firstPhoto ? (
          <Avatar
            src={firstPhoto.datafile}
            alt="Product"
            sx={{ width: 56, height: 56 }}
          />
        ) : (
          <Avatar sx={{ width: 56, height: 56 }}>
            <Image />
          </Avatar>
        );
      },
    },
    {
      field: "name",
      headerName: "اسم المنتج بالعربي",
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.translations?.ar?.name || "لا يوجد اسم"}
        </Typography>
      ),
    },
    {
      field: "price",
      headerName: "السعر",
      width: 120,
      type: "number",
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold">
          {params.value?.toLocaleString() || "0"} SYP
        </Typography>
      ),
    },
    {
      field: "category_model",
      headerName: "الفئة",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value?.name || "غير محدد"}
          size="small"
          color="primary"
        />
      ),
    },
    {
      field: "branch_model",
      headerName: "الفرع",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value?.name || "غير محدد"}
          size="small"
          color="secondary"
          icon={<Store fontSize="small" />}
        />
      ),
    },
    {
      field: "active",
      headerName: "الحالة",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? "نشط" : "غير نشط"}
          color={params.value ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "تفاصيل",
      width: 100,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          endIcon={<ArrowForward />}
          onClick={() => handleRowClick(params)}
        >
          عرض
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        لوحة التحكم - إدارة المنتجات
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        إجمالي المنتجات: {products.length}
      </Typography>

      {loading && <LinearProgress />}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
          <Box sx={{ height: 600, width: "100%" }}>
            <StyledDataGrid
              rows={products}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              components={{
                Toolbar: GridToolbar,
                Pagination: CustomPagination,
              }}
              getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
              }
              localeText={{
                noRowsLabel: "لا توجد منتجات متاحة",
                footerRowSelected: (count) =>
                  count !== 1
                    ? `${count.toLocaleString()} صفوف محددة`
                    : `${count.toLocaleString()} صف محدد`,
              }}
            />
          </Box>
        </Paper>
      )}

      {/* تفاصيل المنتج في Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedProduct && (
          <>
            <DialogTitle>
              تفاصيل المنتج: {selectedProduct.translations?.ar?.name}
            </DialogTitle>
            <DialogContent dividers>
              <Stack direction="row" spacing={3}>
                {/* صور المنتج */}
                <Box sx={{ width: "40%" }}>
                  {selectedProduct.photos_list?.length > 0 ? (
                    <Card>
                      <CardMedia
                        component="img"
                        height="300"
                        image={selectedProduct.photos_list[0].datafile}
                        alt={selectedProduct.translations?.ar?.name}
                      />
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          {selectedProduct.photos_list.length} صورة متاحة
                        </Typography>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card
                      sx={{
                        height: 300,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        لا توجد صور متاحة
                      </Typography>
                    </Card>
                  )}
                </Box>

                {/* معلومات المنتج */}
                <Box sx={{ width: "60%" }}>
                  <Typography variant="h6" gutterBottom>
                    المعلومات الأساسية
                  </Typography>
                  <Stack spacing={2}>
                    <Typography>
                      <strong>الاسم العربي:</strong>{" "}
                      {selectedProduct.translations?.ar?.name || "غير محدد"}
                    </Typography>
                    <Typography>
                      <strong>الاسم الانكليزي:</strong>{" "}
                      {selectedProduct.translations?.en?.name || "غير محدد"}
                    </Typography>
                    <Typography>
                      <strong>الوصف العربي:</strong>{" "}
                      {selectedProduct.translations?.ar?.brief || "غير محدد"}
                    </Typography>
                    <Typography>
                      <strong>السعر:</strong>{" "}
                      {selectedProduct.price?.toLocaleString() || "0"} SYP
                    </Typography>
                    <Typography>
                      <strong>الفئة:</strong>{" "}
                      {selectedProduct.category_model?.name || "غير محدد"}
                    </Typography>
                    <Typography>
                      <strong>الفرع:</strong>{" "}
                      {selectedProduct.branch_model?.name || "غير محدد"}
                    </Typography>
                    <Typography>
                      <strong>الحالة:</strong>{" "}
                      <Chip
                        label={selectedProduct.active ? "نشط" : "غير نشط"}
                        color={selectedProduct.active ? "success" : "error"}
                        size="small"
                      />
                    </Typography>

                    {selectedProduct.offers_list?.length > 0 && (
                      <>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                          العروض المتاحة
                        </Typography>
                        {selectedProduct.offers_list.map((offer) => (
                          <Card key={offer.id} variant="outlined" sx={{ p: 2 }}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <LocalOffer color="secondary" />
                              <Typography>
                                <strong>{offer.translations?.ar?.name}</strong>
                              </Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              السعر بعد العرض: {offer.value?.toLocaleString()}{" "}
                              SYP
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              من {offer.starting_date} إلى {offer.ending_date}
                            </Typography>
                          </Card>
                        ))}
                      </>
                    )}
                  </Stack>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>إغلاق</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Dashboard;

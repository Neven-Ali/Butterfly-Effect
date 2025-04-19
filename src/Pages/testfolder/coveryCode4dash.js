import React, { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import { Avatar, Typography, Chip, Button } from "@mui/material";
import { Image, Store, ArrowForward } from "@mui/icons-material";
////
import axios from "axios";
import {
  CircularProgress,
  Alert,
  Box,
  AppBar,
  Toolbar,
  Container,
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Card,
  CardMedia,
  CardContent,
  Paper,
  LinearProgress,
} from "@mui/material";
import { LocalOffer } from "@mui/icons-material";
const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ0NjU4NjYzLCJpYXQiOjE3NDQ2Mjk4NjMsImp0aSI6ImVkNmIxMDc4ZmVkNjQ5NTA5ZWUyNDhlZTRiYTk4YzAyIiwidXNlcl9pZCI6Mn0.pvtSSyC5kkgh0ffLyPUQXUtyxO4oppe7ziR2XiyI6io";
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

  const handleRowClick = (rowData) => {
    setSelectedProduct(rowData);
    setCurrentImageIndex(0); // نبدأ من الصورة الأولى عند فتح الـ Dialog
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleNextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % selectedProduct.photos_list.length
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + selectedProduct.photos_list.length) %
        selectedProduct.photos_list.length
    );
  };
  // تحضير البيانات للجدول
  const tableData = products.map((product) => ({
    id: product.id,
    photos_list: product.photos_list,
    name: product.translations?.ar?.name || "لا يوجد اسم",
    nameEn: product.translations?.en?.name || "no name",
    price: product.price,
    category_model: product.category_model,
    branch_model: product.branch_model,
    active: product.active,
    translations: product.translations,
    // price: `${product.price}${typeof product.price === "number" ? " ل.س" : ""}`,
    // status: product.active ? "نشط" : "غير نشط",
    // statusColor: product.active ? "success.main" : "error.main",
  }));

  // تعريف الأعمدة مع جميع الميزات المطلوبة
  const columns = [
    {
      title: "ID",
      field: "tableData.id",
      render: (rowData) => rowData.tableData.id,
      cellStyle: { width: 50, minWidth: 50 },
    },
    {
      title: "صورة المنتج",
      field: "photos_list",
      render: (rowData) => {
        const firstPhoto = rowData.photos_list?.[0];
        return (
          <Avatar
            src={firstPhoto?.datafile}
            alt="Product"
            style={{ width: 56, height: 56 }}
          >
            {!firstPhoto && <Image />}
          </Avatar>
        );
      },

      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        minWidth: 100,
      },
    },
    {
      title: "اسم المنتج بالعربي",
      field: "name",
      render: (rowData) => (
        <Typography variant="body2">
          {rowData.translations?.ar?.name || "لا يوجد اسم"}
        </Typography>
      ),
      cellStyle: { width: 150, minWidth: 150 },
    },
    { title: "اسم المنتج بالانجليزي", field: "nameEn" },
    {
      title: "السعر",
      field: "price",
      type: "numeric",
      render: (rowData) => (
        <Typography
          variant="body2"
          style={{
            fontWeight: "bold",
            textAlign: "center",
            width: "100%",
          }}
        >
          {(rowData.price || 0).toLocaleString()} SYP
        </Typography>
      ),
      headerStyle: {
        textAlign: "center", // محاذاة عنوان العمود
        fontWeight: "bold", // سماكة نص العنوان
      },
      cellStyle: {
        width: 100,
        minWidth: 100,
      },
    },
    {
      title: "الفئة",
      field: "category_model.name",
      render: (rowData) => (
        <Chip
          label={rowData.category_model?.name || "غير محدد"}
          size="small"
          color="primary"
          style={{
            fontWeight: "bold",
            textAlign: "center",
            width: "100%",
          }}
        />
      ),
      cellStyle: { width: 150, minWidth: 150 },
    },
    {
      title: "الفرع",
      field: "branch_model.name",
      render: (rowData) => (
        <Chip
          label={rowData.branch_model?.name || "غير محدد"}
          size="small"
          color="secondary"
          icon={<Store fontSize="small" />}
        />
      ),
      cellStyle: { width: 150, minWidth: 150 },
    },
    {
      title: "الحالة",
      field: "active",
      render: (rowData) => (
        <Chip
          label={rowData.active ? "نشط" : "غير نشط"}
          color={rowData.active ? "success" : "error"}
          size="small"
          style={{
            fontWeight: "bold",
            textAlign: "center",
            width: "100%",
          }}
        />
      ),
      cellStyle: { width: 100, minWidth: 100 },
    },
    {
      title: "تفاصيل",
      field: "actions",
      render: (rowData) => (
        <Button
          variant="outlined"
          size="small"
          endIcon={<ArrowForward />}
          onClick={() => handleRowClick(rowData)}
        >
          عرض
        </Button>
      ),
      cellStyle: { width: 100, minWidth: 100 },
    },
  ];

  return (
    <Container>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress size={60} />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <MaterialTable
            title="قائمة المنتجات"
            columns={columns}
            data={tableData}
            options={{
              paging: true,
              pageSize: 2,
              pageSizeOptions: [5, 10, 20],
              headerStyle: {
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
                fontSize: "14px",
              },
              rowStyle: {
                fontSize: "14px",
              },
            }}
            localization={{
              pagination: {
                labelDisplayedRows: "{from}-{to} من {count}",
                labelRowsSelect: "صفوف",
                firstTooltip: "الصفحة الأولى",
                previousTooltip: "الصفحة السابقة",
                nextTooltip: "الصفحة التالية",
                lastTooltip: "الصفحة الأخيرة",
              },
              toolbar: {
                searchPlaceholder: "بحث...",
                exportTitle: "تصدير",
                exportName: "CSV",
              },
              body: {
                emptyDataSourceMessage: "لا توجد بيانات متاحة",
                filterRow: {
                  filterTooltip: "تصفية",
                },
              },
            }}
          />
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
                          {selectedProduct.translations?.ar?.brief ||
                            "غير محدد"}
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
                            <Typography
                              variant="h6"
                              gutterBottom
                              sx={{ mt: 2 }}
                            >
                              العروض المتاحة
                            </Typography>
                            {selectedProduct.offers_list.map((offer) => (
                              <Card
                                key={offer.id}
                                variant="outlined"
                                sx={{ p: 2 }}
                              >
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={1}
                                >
                                  <LocalOffer color="secondary" />
                                  <Typography>
                                    <strong>
                                      {offer.translations?.ar?.name}
                                    </strong>
                                  </Typography>
                                </Stack>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                  السعر بعد العرض:{" "}
                                  {offer.value?.toLocaleString()} SYP
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  من {offer.starting_date} إلى{" "}
                                  {offer.ending_date}
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
        </>
      )}
    </Container>
  );
};

export default Dashboard;

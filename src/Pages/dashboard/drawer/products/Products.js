import React, { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import { Avatar, Typography, Chip, Button } from "@mui/material";
import { Image, Store, ArrowForward, Edit } from "@mui/icons-material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Delete } from "@mui/icons-material";
// في أعلى الملف مع باقي الواردات
import { Add } from "@mui/icons-material";
////
import productsRepository from "../../../../repositories/productsRepository"; // استيراد الوظيفة الجديدة
///
import { Pagination } from "@mui/material";
//
import { useSearchParams } from "react-router-dom";
//
import { CircularProgress, Alert, Box, Container } from "@mui/material";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { LocalOffer } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  //
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 2,
    totalCount: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    // قراءة البارامترات من URL
    const pageParam = searchParams.get("page");
    const pageSizeParam = searchParams.get("page_size");
    const searchParam = searchParams.get("search");
    console.log("URL Parameters:", {
      page: pageParam,
      page_size: pageSizeParam,
      search: searchParam,
    });
    const fetchProducts = async () => {
      try {
        // تحويل البارامترات إلى أرقام (مع القيم الافتراضية)
        const initialPage = pageParam ? parseInt(pageParam) : 1;
        const initialPageSize = pageSizeParam ? parseInt(pageSizeParam) : 2;
        const initialSearch = searchParam || "";
        const {
          products: productsData,
          totalCount,
          pageInfo,
        } = await productsRepository.getProducts(
          initialPage,
          initialPageSize,
          initialSearch
        );
        setProducts(productsData); // لا تنسى تحديث حالة products
        setPagination({
          currentPage: initialPage,
          pageSize: initialPageSize,
          totalPages: pageInfo.totalPages,
          totalCount,
        });
        setSearchQuery(initialSearch);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  //Edit product
  // دالة للتعامل مع التعديل
  const handleEdit = (rowData) => {
    console.log("Edit product:", rowData);
    alert(`The product will be modified: ${rowData.nameEn}`);
    navigate(`/dashboard/products/${rowData.id}`);
  };
  // دالة للتعامل مع اضافة عنصر جديد
  const handleAddNewProduct = () => {
    console.log("Adding new product");
    alert("You will be redirected to add a new product");
    navigate("/dashboard/products/new");
  };
  // دالة للتعامل مع الحذف
  const handleDelete = async (rowData) => {
    if (
      window.confirm(`Are you sure you want to delete "${rowData.nameEn}"?`)
    ) {
      try {
        await productsRepository.deleteProduct(rowData.id);
        // إعادة تحميل البيانات بعد الحذف
        const {
          products: productsData,
          totalCount,
          pageInfo,
        } = await productsRepository.getProducts(
          pagination.currentPage,
          pagination.pageSize,
          searchQuery
        );
        setProducts(productsData);
        setPagination((prev) => ({
          ...prev,
          totalPages: pageInfo.totalPages,
          totalCount,
        }));
        alert("Product deleted successfully!");
      } catch (err) {
        setError(err.message);
        alert("Failed to delete product");
      }
    }
  };
  // pagination
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));

    // تحديث URL مع معاملات البحث الجديدة
    setSearchParams({
      page: newPage,
      page_size: pagination.pageSize,
      search: searchQuery,
    });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));

    // تحديث URL مع معاملات البحث الجديدة
    setSearchParams({
      page: 1,
      page_size: pagination.pageSize,
      search: query,
    });
  };

  ///

  //

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
    photos_list: product.photos_list,
    name: product.translations?.ar?.name || "لا يوجد اسم",
    nameEn: product.translations?.en?.name || "no name",
    price: product.price,
    category_model: product.category_model,
    branch_model: product.branch_model,
    active: product.active,
    translations: product.translations,
    id: product.id, // تأكد من وجود id للمنتج
  }));

  // تعريف الأعمدة مع جميع الميزات المطلوبة
  const columns = [
    {
      title: "Product name in Arabic",
      field: "name",
      render: (rowData) => (
        <Typography variant="body2">
          {rowData.translations?.ar?.name || "لا يوجد اسم"}
        </Typography>
      ),
      cellStyle: { width: 150, minWidth: 150 },
    },
    { title: "Product name in English", field: "nameEn" },
    {
      title: "Price",
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
      title: "Category",
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
      title: "Branch",
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
      title: "Status",
      field: "active",
      render: (rowData) => (
        <Chip
          label={rowData.active ? "Active" : "Inactive"}
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
      title: "Actions",
      field: "actions",
      render: (rowData) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            variant="outlined"
            size="small"
            endIcon={<ArrowForward />}
            onClick={() => handleRowClick(rowData)}
          >
            Show
          </Button>
          <Button
            variant="contained"
            size="small"
            color="primary"
            startIcon={<Edit />}
            onClick={() => handleEdit(rowData)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            startIcon={<Delete />} // تأكد من استيراد أيقونة Delete
            onClick={() => handleDelete(rowData)}
          >
            Delete
          </Button>
        </div>
      ),
      cellStyle: { width: 250, minWidth: 250 },
    },
  ];

  return (
    <Container>
      {loading  ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress size={60} />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <MaterialTable
            title="List of products "
            columns={columns}
            data={tableData}
            options={{
              paging: false,
              pageSize: pagination.pageSize,
              pageSizeOptions: [2, 5, 10, 20], // يمكنك تعديل هذه الأرقام
              initialPage: 0, // يبدأ من الصفر
              filtering: false,
              search: false, // تعطيل البحث الداخلي إذا كنت تستخدم البحث الخاص بك
              headerStyle: {
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
                fontSize: "14px",
              },
              rowStyle: {
                fontSize: "14px",
              },

              searchText: searchQuery,
              debounceInterval: 500,
            }}
            onChangePage={(page) => {
              setPagination((prev) => ({
                ...prev,
                currentPage: page + 1, // التحويل من 0-based إلى 1-based
              }));
            }}
            onChangeRowsPerPage={(pageSize) => {
              const newPagination = {
                pageSize: pageSize,
                currentPage: 1, // العودة للصفحة الأولى عند تغيير الحجم
              };
              setPagination((prev) => ({ ...prev, ...newPagination }));

              // تحديث URL مع حجم الصفحة الجديد
              setSearchParams({
                page: 1,
                page_size: pageSize,
                search: searchQuery,
              });
            }}
            localization={{
              body: {
                emptyDataSourceMessage: "لا توجد بيانات متاحة",
              },
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Pagination
              count={Math.ceil(pagination.totalCount / pagination.pageSize)}
              page={pagination.currentPage}
              onChange={(e, page) => handlePageChange(page)}
              color="primary"
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", m: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={handleAddNewProduct}
              sx={{ mb: 2 }}
            >
              Add New Product
            </Button>
          </Box>
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
                  Product Details : {selectedProduct.translations?.en?.name}
                </DialogTitle>
                <DialogContent dividers>
                  <Stack direction="row" spacing={3}>
                    {/* صور المنتج */}
                    {/* صور المنتج مع أزرار التنقل */}
                    <Box sx={{ width: "40%", position: "relative" }}>
                      {selectedProduct.photos_list?.length > 0 ? (
                        <Card>
                          <CardMedia
                            component="img"
                            height="300"
                            image={
                              selectedProduct.photos_list[currentImageIndex]
                                .datafile
                            }
                            alt={selectedProduct.translations?.ar?.name}
                          />
                          <CardContent>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              align="center"
                            >
                              photo {currentImageIndex + 1} from{" "}
                              {selectedProduct.photos_list.length}
                            </Typography>

                            {/* مؤشر الصور (النقاط) */}
                            {selectedProduct.photos_list.length > 1 && (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  my: 1,
                                }}
                              >
                                {selectedProduct.photos_list.map((_, index) => (
                                  <Box
                                    key={index}
                                    sx={{
                                      width: 8,
                                      height: 8,
                                      borderRadius: "50%",
                                      bgcolor:
                                        currentImageIndex === index
                                          ? "primary.main"
                                          : "grey.400",
                                      mx: 0.5,
                                      cursor: "pointer",
                                      transition: "background-color 0.3s",
                                    }}
                                    onClick={() => setCurrentImageIndex(index)}
                                  />
                                ))}
                              </Box>
                            )}
                            {selectedProduct.photos_list.length > 1 && (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  mt: 2,
                                }}
                              >
                                {/* <Button
                                  variant="contained"
                                  onClick={handlePrevImage}
                                  disabled={currentImageIndex === 0}
                                >
                                  السابقة
                                </Button>
                                <Button
                                  variant="contained"
                                  onClick={handleNextImage}
                                  disabled={
                                    currentImageIndex ===
                                    selectedProduct.photos_list.length - 1
                                  }
                                >
                                  التالية
                                </Button> */}
                                {/* // ثم استبدال الأزرار بـ: */}
                                <Button
                                  onClick={handlePrevImage}
                                  disabled={currentImageIndex === 0}
                                >
                                  <ChevronLeft />
                                </Button>
                                <Button
                                  onClick={handleNextImage}
                                  disabled={
                                    currentImageIndex ===
                                    selectedProduct.photos_list.length - 1
                                  }
                                >
                                  <ChevronRight />
                                </Button>
                              </Box>
                            )}
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
                            There are no pictures available
                          </Typography>
                        </Card>
                      )}
                    </Box>

                    {/* معلومات المنتج */}
                    <Box sx={{ width: "60%" }}>
                      <Typography variant="h6" gutterBottom>
                        Basic Information
                      </Typography>
                      <Stack spacing={2}>
                        <Typography>
                          <strong> ID:</strong>{" "}
                          {selectedProduct.id || "Undefined "}
                        </Typography>
                        <Typography>
                          <strong> Name in Arabic:</strong>{" "}
                          {selectedProduct.translations?.ar?.name ||
                            "Undefined "}
                        </Typography>
                        <Typography>
                          <strong>Name in English :</strong>{" "}
                          {selectedProduct.translations?.en?.name ||
                            "Undefined "}
                        </Typography>
                        <Typography>
                          <strong>Description :</strong>{" "}
                          {selectedProduct.translations?.en?.brief ||
                            "Undefined "}
                        </Typography>
                        <Typography>
                          <strong>Price:</strong>{" "}
                          {selectedProduct.price?.toLocaleString() || "0"} SYP
                        </Typography>
                        <Typography>
                          <strong>Category:</strong>{" "}
                          {selectedProduct.category_model?.name || "Undefined"}
                        </Typography>
                        <Typography>
                          <strong>Branch:</strong>{" "}
                          {selectedProduct.branch_model?.name || "Undefined"}
                        </Typography>
                        <Typography>
                          <strong>Status:</strong>{" "}
                          <Chip
                            label={
                              selectedProduct.active ? "Active" : "Inactive "
                            }
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
                              Available Offers
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

export default Products;

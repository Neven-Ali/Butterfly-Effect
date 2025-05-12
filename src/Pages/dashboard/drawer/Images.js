import photosRepository from "../../../repositories/photosRepository";
import { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Alert,
  styled,
  Button,
  Card,
  CardMedia,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItemText,
  Divider,
  Snackbar,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import { Close, ZoomIn, ZoomOut } from "@mui/icons-material";
import { Add, Info } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import PhotoWidget from "./PhotoWidget";
import ImageGalleryDialog from "./ImageGalleryDialog";
const Images = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const itemsPerPage = 5;
  // ... (الحالات الحالية)
  const [selectedFile, setSelectedFile] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 2,
    totalCount: 0,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  ////// Image Gallery
  const [openGalleryDialog, setOpenGalleryDialog] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [allPhotos, setAllPhotos] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  /////
  // دالة جديدة لجلب كل الصور
  const fetchAllPhotos = async () => {
    try {
      setGalleryLoading(true);
      const response = await photosRepository.getAllPhotos();
      setAllPhotos(response.results || response); // حسب هيكل الاستجابة من الخادم
    } catch (err) {
      console.error("Error fetching all photos:", err);
    } finally {
      setGalleryLoading(false);
    }
  };
  const fetchPhotos = async () => {
    try {
      setLoading(true);
      setError(null);

      const pageParam = searchParams.get("page");
      const pageSizeParam = searchParams.get("page_size");
      const searchParam = searchParams.get("search");
      console.log("URL Parameters:", {
        page: pageParam,
        page_size: pageSizeParam,
        search: searchParam,
      });
      // تحويل البارامترات إلى أرقام (مع القيم الافتراضية)
      const initialPage = pageParam ? parseInt(pageParam) : 1;
      const initialPageSize = pageSizeParam ? parseInt(pageSizeParam) : 5;
      const initialSearch = searchParam || "";

      const response = await photosRepository.getPhotos(
        initialPage,
        initialPageSize,
        initialSearch
      );
      console.log("API Response:", response); // للتأكد من هيكل البيانات

      const photosData = response.results || [];
      const totalCount = response.totalCount || 0;

      const totalPages =
        response.pageInfo?.totalPages ||
        Math.ceil(totalCount / initialPageSize) ||
        1;
      setPhotos(photosData); // لا تنسى تحديث حالة products
      setPagination({
        currentPage: initialPage,
        pageSize: initialPageSize,
        totalPages: totalPages,
        totalCount,
      });
      setSearchQuery(initialSearch);
    } catch (err) {
      console.error("Error fetching photos:", err);
      setError(err.message || "حدث خطأ أثناء جلب الصور");
    } finally {
      setLoading(false);
    }
  };

  // استدعاءها في useEffect
  useEffect(() => {
    fetchPhotos();
  }, [searchParams]);

  const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    maxWidth: 800,
    textAlign: "center",
    margin: "auto",
  }));

  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));

    // تحديث URL مع معاملات البحث الجديدة
    setSearchParams({
      page: newPage.toString(),
      page_size: pagination.pageSize,
      search: searchQuery,
    });
  };

  // وظيفة جديدة لمعالجة اختيار الملف
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setOpenAddDialog(true);
    }
  };

  const handleUploadPhoto = async () => {
    try {
      setUploadLoading(true);
      setUploadError(null);
      setLoading(true); // إضافة هذا السطر لإظهار مؤشر التحميل في الواجهة
      const formData = new FormData();
      formData.append("datafile", selectedFile);

      const response = await photosRepository.createPhoto(formData);

      if (!response?.data?.datafile) {
        throw new Error("استجابة غير صالحة من الخادم");
      }
      // إعادة جلب البيانات بعد الإضافة بنجاح
      await fetchPhotos(); // هذه هي الدالة التي تقوم بجلب البيانات

      setSuccessMessage("تمت إضافة الصورة بنجاح");
      setOpenAddDialog(false);
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadError(
        err.response?.data?.message ||
          err.message ||
          "فشل رفع الصورة. يرجى المحاولة لاحقاً"
      );
    } finally {
      setUploadLoading(false);
    }
  };
  // وظيفة جديدة لإغلاق ديالوج الإضافة
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setSelectedFile(null);
  };
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  // عدل دالة فتح المعرض لتحميل الصور أولاً
  const handleOpenGallery = async () => {
    await fetchAllPhotos();
    setOpenGalleryDialog(true);
  };

  const handleOpenDialog = (photo) => {
    setSelectedPhoto(photo);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDeleteDialog = (photoId) => {
    setPhotoToDelete(photoId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setPhotoToDelete(null);
  };

  const handleDeletePhoto = async () => {
    try {
      setDeleteLoading(true);
      setDeleteError(null);
      setLoading(true); // إضافة هذا السطر لإظهار مؤشر التحميل في الواجهة
      await photosRepository.deletePhoto(photoToDelete);

      // إعادة جلب البيانات بعد الحذف بنجاح
      await fetchPhotos();

      setSuccessMessage("تم حذف الصورة بنجاح");
      setOpenDeleteDialog(false);
    } catch (err) {
      setDeleteError(err.response?.data?.message || "فشل حذف الصورة");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
    setDeleteError(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <div>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
        bgcolor="grey.50"
      >
        <StyledPaper elevation={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            عرض الصور
          </Typography>
          {/* تنبيهات النجاح/الخطأ */}
          {(successMessage || deleteError || uploadError) && (
            <Alert
              severity={successMessage ? "success" : "error"}
              sx={{ mb: 2 }}
              onClose={() => {
                setSuccessMessage(null);
                setDeleteError(null);
                setUploadError(null);
              }}
            >
              {successMessage || deleteError || uploadError}
            </Alert>
          )}
          <Dialog
            open={openAddDialog}
            onClose={handleCloseAddDialog}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>تأكيد إضافة الصورة</DialogTitle>
            <DialogContent>
              {selectedFile && (
                <>
                  <Typography variant="body1" gutterBottom>
                    هل أنت متأكد أنك تريد إضافة هذه الصورة؟
                  </Typography>
                  {uploadError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {uploadError}
                    </Alert>
                  )}
                  <Box mt={2} display="flex" justifyContent="center">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="معاينة الصورة"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "300px",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                  <Typography variant="caption" display="block" mt={1}>
                    اسم الملف: {selectedFile.name}
                  </Typography>
                  <Typography variant="caption" display="block">
                    حجم الملف: {(selectedFile.size / 1024).toFixed(2)} KB
                  </Typography>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCloseAddDialog}
                color="primary"
                disabled={uploadLoading}
              >
                إلغاء
              </Button>
              <Button
                onClick={handleUploadPhoto}
                color="primary"
                variant="contained"
                disabled={uploadLoading}
                endIcon={uploadLoading ? <CircularProgress size={24} /> : null}
              >
                {uploadLoading ? "جاري الرفع..." : "تأكيد الإضافة"}
              </Button>
            </DialogActions>
          </Dialog>
          {photos.length > 0 ? (
            <>
              <ImageList
                sx={{ width: "100%", height: "auto", my: 2 }}
                cols={3}
                rowHeight={200}
              >
                {photos.map((photo) => (
                  <PhotoWidget
                    key={photo.id}
                    photo={photo}
                    onInfoClick={handleOpenDialog}
                    onDeleteClick={handleOpenDeleteDialog}
                    deleteLoading={deleteLoading}
                  />
                ))}
              </ImageList>
              <Box display="flex" justifyContent="center" mt={4}>
                {pagination.totalCount > pagination.pageSize && (
                  <Pagination
                    count={pagination.totalPages}
                    page={pagination.currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                )}
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", m: 2 }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  onClick={() => fileInputRef.current.click()}
                  sx={{ mb: 2 }}
                >
                  إضافة صورة جديدة
                </Button>
                {/* //// زر لفتح المعرض */}
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleOpenGallery}
                  
                  sx={{ mb: 2, mr: 2 }}
                >
                  اختر من المعرض
                </Button>
              </Box>
            </>
          ) : (
            <Typography variant="body1">لا توجد صور متاحة</Typography>
          )}
        </StyledPaper>
      </Box>
      {/* لعرض الصور المحددة */}
      {selectedImages.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            الصور المحددة ({selectedImages.length})
          </Typography>
          <ImageList cols={3} rowHeight={150}>
            {selectedImages.map((image) => (
              <ImageListItem key={image.id}>
                <img
                  src={image.url}
                  alt={image.title || "صورة محددة"}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      )}
      {/* Dialog لعرض التفاصيل */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedPhoto && (
          <>
            <DialogTitle>تفاصيل الصورة</DialogTitle>
            <DialogContent>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mb={2}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={selectedPhoto.url}
                  alt={selectedPhoto.title || "صورة"}
                  style={{ objectFit: "contain" }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <List>
                {Object.entries(selectedPhoto).map(([key, value]) => (
                  <div key={key}>
                    <ListItemText
                      component="div"
                      primary={key}
                      secondary={
                        typeof value === "object"
                          ? JSON.stringify(value)
                          : value
                      }
                    />
                  </div>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                إغلاق
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Dialog لتحذير الحذف */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            هل أنت متأكد أنك تريد حذف هذه الصورة؟
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            إلغاء
          </Button>
          <Button
            onClick={handleDeletePhoto}
            color="error"
            disabled={deleteLoading}
          >
            {deleteLoading ? <CircularProgress size={24} /> : "حذف"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* رسائل التنبيه */}
      <Snackbar
        open={!!successMessage || !!deleteError}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={successMessage ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {successMessage || deleteError}
        </Alert>
      </Snackbar>
      {/* معرض الصور */}
       <ImageGalleryDialog
        open={openGalleryDialog}
        onClose={() => setOpenGalleryDialog(false)}
        images={allPhotos}
        loading={galleryLoading}
        onSelect={(selected) => {
          setSelectedImages(selected);
          console.log("الصور المحددة:", selected);
        }}
      />
    </div>
  );
};

export default Images;

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
  Grid,
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
  Zoom,
} from "@mui/material";
import { Close, ZoomIn, ZoomOut } from "@mui/icons-material";
import { Add } from "@mui/icons-material";

const Images = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef(null);
  const itemsPerPage = 6;
  // ... (الحالات الحالية)
  const [selectedFile, setSelectedFile] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  //////
  const fetchPhotos = async () => {
    try {
      const response = await photosRepository.getPhotos();
      // تأكد من أن البيانات تأتي بالهيكل الصحيح
      const formattedPhotos = response.map((photo) => ({
        id: photo.id,
        url: photo.datafile || photo.url, // استخدم datafile إذا وجد
        title: photo.name,
        // أي حقول أخرى تحتاجها
      }));
      setPhotos(formattedPhotos);
    } catch (err) {
      setError("غير مصرح بالوصول. يرجى تسجيل الدخول.");
      // معالجة الأخطاء
    } finally {
      setLoading(false);
    }
  };

  // استدعاءها في useEffect
  useEffect(() => {
    fetchPhotos();
  }, []);

  ///
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const userData = await photosRepository.getPhotos();
  //       setPhotos(userData);
  //       console.log(userData);
  //     } catch (err) {
  //       if (err.response?.status === 401) {
  //         setError("غير مصرح بالوصول. يرجى تسجيل الدخول.");
  //       } else {
  //         setError("فشل تحميل بيانات الصور");
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    maxWidth: 800,
    textAlign: "center",
    margin: "auto",
  }));

  const paginatedPhotos = photos.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  ///////////////////////
  // وظيفة جديدة لمعالجة اختيار الملف
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setOpenAddDialog(true);
    }
  };

  // وظيفة جديدة لرفع الصورة
  // const handleUploadPhoto = async () => {
  //   try {
  //     setUploadLoading(true);
  //     setUploadError(null);

  //     const formData = new FormData();
  //     formData.append("photo", selectedFile);

  //     // أضف هذا السطر لفحص محتوى FormData (للتأكد من وجود الملف)
  //     for (let [key, value] of formData.entries()) {
  //       console.log(key, value);
  //     }

  //     const newPhoto = await photosRepository.createPhoto(formData);

  //     // تأكد من أن newPhoto تحتوي على رابط الصورة (url)
  //     console.log("الصورة الجديدة:", newPhoto);

  //     // تحديث القائمة بإضافة الصورة الجديدة في البداية
  //     setPhotos([newPhoto, ...photos]);
  //     setSuccessMessage("تمت إضافة الصورة بنجاح");
  //     setOpenAddDialog(false);
  //     setSelectedFile(null);
  //   } catch (err) {
  //     console.error("خطأ في رفع الصورة:", err);
  //     setUploadError(err.message || "فشل رفع الصورة");
  //   } finally {
  //     setUploadLoading(false);
  //   }
  // };
  const handleUploadPhoto = async () => {
    try {
      setUploadLoading(true);

      // حساب أبعاد الصورة
      const img = new Image();
      img.src = URL.createObjectURL(selectedFile);

      await new Promise((resolve) => {
        img.onload = () => resolve();
      });

      const formData = new FormData();
      formData.append("photo", selectedFile);
      formData.append("width", img.width);
      formData.append("height", img.height);

      const response = await photosRepository.createPhoto(formData);

      // تأكد من أن الاستجابة تحتوي على البيانات المطلوبة
      if (!response || !response.datafile) {
        throw new Error("استجابة غير صالحة من الخادم");
      }

      // تحديث الحالة
      setPhotos((prev) => [
        {
          id: response.id,
          url: response.datafile,
          title: response.name,
          width: response.width,
          height: response.height,
          created: response.created,
        },
        ...prev,
      ]);

      setSuccessMessage("تمت إضافة الصورة بنجاح");
      setOpenAddDialog(false);
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
      const errorMsg =
        err.message ||
        err.response?.data?.message ||
        "فشل رفع الصورة. يرجى المحاولة لاحقاً";
      setUploadError(errorMsg);
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
  //////////////////////////
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleOpenDialog = (photo) => {
    setSelectedPhoto(photo);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenPreview = (photo) => {
    setSelectedPhoto(photo);
    setOpenPreview(true);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const handleMouseDown = (e) => {
    if (zoomLevel <= 1) return;

    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoomLevel <= 1) return;

    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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

      await photosRepository.deletePhoto(photoToDelete);

      setPhotos(photos.filter((photo) => photo.id !== photoToDelete));
      setSuccessMessage("تم حذف الصورة بنجاح");
      handleCloseDeleteDialog();
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
              <Grid container spacing={2} mt={2}>
                {paginatedPhotos.map((photo) => (
                  <Grid item xs={12} sm={6} md={4} key={photo.id}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="200"
                        image={photo.url}
                        alt={photo.title || "صورة"}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleOpenPreview(photo)}
                      />
                      <Box p={2}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handleOpenDialog(photo)}
                          sx={{ mb: 1 }}
                        >
                          عرض التفاصيل
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          fullWidth
                          onClick={() => handleOpenDeleteDialog(photo.id)}
                          disabled={deleteLoading}
                        >
                          {deleteLoading ? (
                            <CircularProgress size={24} />
                          ) : (
                            "حذف الصورة"
                          )}
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={Math.ceil(photos.length / itemsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end", m: 2 }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*" // للسماح بالصور فقط
                  style={{ display: "none" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  onClick={handleButtonClick}
                  sx={{ mb: 2 }}
                >
                  Add New Photo
                </Button>
              </Box>
            </>
          ) : (
            <Typography variant="body1">لا توجد صور متاحة</Typography>
          )}
        </StyledPaper>
      </Box>

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

      {/* Dialog لعرض الصورة المكبرة مع ميزات التكبير والتحريك */}
      <Dialog
        open={openPreview}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
            overflow: "visible",
          },
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
          onWheel={handleWheel}
        >
          {/* زر الإغلاق */}
          <IconButton
            onClick={handleClosePreview}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 2,
            }}
          >
            <Close />
          </IconButton>

          {/* أزرار التحكم في التكبير */}
          <Box
            position="absolute"
            bottom={16}
            right={16}
            zIndex={2}
            display="flex"
            flexDirection="column"
            gap={1}
          >
            <IconButton
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
              sx={{
                color: "white",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <ZoomIn />
            </IconButton>
            <IconButton
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.5}
              sx={{
                color: "white",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <ZoomOut />
            </IconButton>
          </Box>

          {/* الصورة مع تأثير التكبير والتحريك */}
          <div
            ref={imageRef}
            style={{
              transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
              transformOrigin: "center center",
              cursor:
                zoomLevel > 1 ? (isDragging ? "grabbing" : "grab") : "default",
              transition: isDragging ? "none" : "transform 0.25s ease",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={selectedPhoto?.url}
              alt={selectedPhoto?.title || "صورة مكبرة"}
              style={{
                maxWidth: "100%",
                maxHeight: "90vh",
                display: "block",
              }}
            />
          </div>
        </div>
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
    </div>
  );
};

export default Images;

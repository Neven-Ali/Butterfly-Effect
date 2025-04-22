import photosRepository from "../../../repositories/photosRepository";
import { useEffect, useState } from "react";
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
  DialogContentText,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const Images = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await photosRepository.getPhotos();
        setPhotos(userData);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("غير مصرح بالوصول. يرجى تسجيل الدخول.");
        } else {
          setError("فشل تحميل بيانات الصور");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
                      />
                      <Box p={2}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handleOpenDialog(photo)}
                        >
                          عرض التفاصيل
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
            </>
          ) : (
            <Typography variant="body1">لا توجد صور متاحة</Typography>
          )}
        </StyledPaper>
      </Box>
      Dialog لعرض التفاصيل
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
    </div>
  );
};

export default Images;

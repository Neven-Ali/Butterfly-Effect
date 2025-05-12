import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  ImageList,
  ImageListItem,
  Checkbox,
  Box,
} from "@mui/material";

const ImageGalleryDialog = ({ open, onClose, images, onSelect }) => {
  const [selectedImages, setSelectedImages] = useState([]);

  const handleToggle = (imageId) => {
    setSelectedImages((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleSubmit = () => {
    const selected = images.filter((img) => selectedImages.includes(img.id));
    onSelect(selected);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>اختر الصور</DialogTitle>
      <DialogContent>
        <ImageList cols={4} rowHeight={150} sx={{ mt: 2 }}>
          {images.map((image) => (
            <ImageListItem key={image.id}>
              <Box position="relative">
                <img
                  src={image.url}
                  alt={image.title || "صورة"}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: selectedImages.includes(image.id) ? 0.7 : 1,
                  }}
                />
                <Checkbox
                  checked={selectedImages.includes(image.id)}
                  onChange={() => handleToggle(image.id)}
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    color: "white",
                    "&.Mui-checked": {
                      color: "primary.main",
                    },
                  }}
                />
              </Box>
            </ImageListItem>
          ))}
        </ImageList>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>إلغاء</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          تأكيد الاختيار ({selectedImages.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageGalleryDialog;

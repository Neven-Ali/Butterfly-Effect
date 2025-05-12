import { useState, useRef } from "react";
import {
  Dialog,
  IconButton,
  Box,
  DialogContent,
  Paper,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  CircularProgress,
} from "@mui/material";
import { Close, ZoomIn, ZoomOut, Info } from "@mui/icons-material";

const PhotoWidget = ({ photo, onInfoClick, onDeleteClick, deleteLoading }) => {
  const [openPreview, setOpenPreview] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef(null);

  const handleOpenPreview = () => setOpenPreview(true);
  const handleClosePreview = () => setOpenPreview(false);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () =>
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) handleZoomIn();
    else handleZoomOut();
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

  const handleMouseUp = () => setIsDragging(false);

  return (
    <>
      <ImageListItem>
        <img
          src={photo.url}
          alt={photo.title || "صورة"}
          loading="lazy"
          style={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
            cursor: "pointer",
          }}
          onClick={handleOpenPreview}
        />
        <ImageListItemBar
          title={photo.title || "بدون عنوان"}
          subtitle={
            photo.created ? new Date(photo.created).toLocaleDateString() : ""
          }
          actionIcon={
            <>
              <IconButton
                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onInfoClick(photo);
                }}
              >
                <Info />
              </IconButton>
              <IconButton
                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick(photo.id);
                }}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <Close />
                )}
              </IconButton>
            </>
          }
        />
      </ImageListItem>
      {/* Dialog لعرض الصورة المكبرة مع ميزات التكبير والتحريك */}
      {/* Preview Dialog */}
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
              src={photo.url}
              alt={photo.title || "صورة مكبرة"}
              style={{
                maxWidth: "100%",
                maxHeight: "90vh",
                display: "block",
              }}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default PhotoWidget;

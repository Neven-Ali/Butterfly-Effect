import photosRepository from "../../../repositories/photosRepository";
//
import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Alert,
  styled,
  Button,
} from "@mui/material";

const Images = () => {
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await photosRepository.getPhotos();
        console.log(userData);
      } catch (err) {
        if (err.response?.status === 401) {
          console.log("error 401");
        } else {
          console.log("Failed to load user data");
        }
      } finally {
        console.log("finally");
      }
    };

    fetchUserData();
  }, []);
  const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    maxWidth: 400,
    textAlign: "center",
    margin: "auto",
  }));
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
            Show Photos
          </Typography>
          <Button
            variant="outlined"
            size="small"
            // endIcon={<ArrowForward />}
            onClick={() => alert("hii")}
          >
            Show
          </Button>
        </StyledPaper>
      </Box>
    </div>
  );
};

export default Images;

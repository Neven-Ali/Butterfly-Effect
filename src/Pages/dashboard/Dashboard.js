// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "../services/apiService";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Alert,
  styled,
} from "@mui/material";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserDetails();
        console.log(userData);
        setUser(userData.data);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Failed to load user data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    maxWidth: 400,
    textAlign: "center",
    margin: "auto",
  }));

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Alert severity="error" sx={{ width: "100%", maxWidth: 400 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
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
          Welcome,
          <Typography variant="h5" component="span" color="primary.main" fontWeight="bold">
            {user?.username}
          </Typography>
          !
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You're now logged in to your dashboard.
        </Typography>
      </StyledPaper>
    </Box>
  );
};

export default Dashboard;

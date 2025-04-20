// UI Components
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress,
  Alert,
  MenuItem,
  Chip,
  Autocomplete,
  Stack,
} from "@mui/material";

export const EditProductFormFields = ({
  formik,
  categories,
  availableTags,
  navigate,
}) => (
  <Stack spacing={3}>
    {/* باقي نموذج التعديل كما هو */}
    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
      <TextField
        sx={{ flex: 1, minWidth: 250 }}
        label="Product name in Arabic"
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
        required
      />

      <TextField
        sx={{ flex: 1, minWidth: 250 }}
        label="Product name in English"
        name="name_en"
        value={formik.values.name_en}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.name_en && Boolean(formik.errors.name_en)}
        helperText={formik.touched.name_en && formik.errors.name_en}
        required
      />
    </Box>

    {/* الصف الثاني - أوصاف المنتج */}
    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
      <TextField
        sx={{ flex: 1, minWidth: 250 }}
        label="Arabic description"
        name="description_ar"
        multiline
        rows={4}
        value={formik.values.description_ar}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.description_ar && Boolean(formik.errors.description_ar)
        }
        helperText={
          formik.touched.description_ar && formik.errors.description_ar
        }
        required
      />

      <TextField
        sx={{ flex: 1, minWidth: 250 }}
        label="English description"
        name="description_en"
        multiline
        rows={4}
        value={formik.values.description_en}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.description_en && Boolean(formik.errors.description_en)
        }
        helperText={
          formik.touched.description_en && formik.errors.description_en
        }
        required
      />
    </Box>

    {/* الصف الثالث - الفئة والسعر والنموذج */}
    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
      <TextField
        select
        sx={{ flex: 1, minWidth: 250 }}
        label="The Category"
        name="category"
        value={formik.values.category}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.category && Boolean(formik.errors.category)}
        helperText={formik.touched.category && formik.errors.category}
        required
      >
        {categories.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        sx={{ flex: 1, minWidth: 250 }}
        label="Price"
        name="price"
        type="number"
        value={formik.values.price}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.price && Boolean(formik.errors.price)}
        helperText={formik.touched.price && formik.errors.price}
        required
        InputProps={{
          endAdornment: "SYP",
        }}
      />
    </Box>

    {/* الصف الرابع - النموذج */}
    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
      <TextField
        sx={{ flex: 1, minWidth: 250 }}
        label="Model"
        name="model"
        type="number"
        value={formik.values.model}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.model && Boolean(formik.errors.model)}
        helperText={formik.touched.model && formik.errors.model}
        required
      />
    </Box>

    {/* الوسوم */}
    <Autocomplete
      multiple
      options={availableTags}
      freeSolo
      value={formik.values.tags}
      onChange={(event, newValue) => {
        formik.setFieldValue("tags", newValue);
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip label={option} {...getTagProps({ index })} key={index} />
        ))
      }
      renderInput={(params) => (
        <TextField {...params} label="Tags" placeholder="Add Tags" />
      )}
    />

    {/* أزرار التحكم */}
    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={formik.isSubmitting}
        sx={{ flex: 1 }}
      >
        {formik.isSubmitting ? <CircularProgress size={24} /> : "Save Changes"}
      </Button>

      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate("/dashboard/products")}
        sx={{ flex: 1 }}
      >
        Cancel
      </Button>
    </Box>
  </Stack>
);

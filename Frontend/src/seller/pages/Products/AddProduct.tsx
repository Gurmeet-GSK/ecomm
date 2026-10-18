import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Alert,
    TextField
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import UploadToCludinary from "../../../Util/UploadToCloudinary";
import { colors } from "../../../data/Filter/color";
import { mainCategory } from "../../../data/category/mainCategory";
import { menLevelTwo } from "../../../data/category/levelTwo/menLevelTwo";
import { womenLevelTwo } from "../../../data/category/levelTwo/womenLevelTwo";
import { electronicsLevelTwo } from "../../../data/category/levelTwo/electronicsLevelTwo";
import { furnitureLevelTwo } from "../../../data/category/levelTwo/furnitureLevelTwo";
import { menLevelThree } from "../../../data/category/levelThree/menLevelThree";
import { womenLevelThree } from "../../../data/category/levelThree/womenLevelThree";
import { electronicsLevelThree } from "../../../data/category/levelThree/electronicsLevelThree";
import { furnitureLevelThree } from "../../../data/category/levelThree/furnitureLevelThree";

const categoryTwoMap: Record<string, any[]> = {
    men: menLevelTwo,
    women: womenLevelTwo,
    electronics: electronicsLevelTwo,
    home_furniture: furnitureLevelTwo,
    home_furnitue: furnitureLevelTwo,
};

const categoryThreeMap: Record<string, any[]> = {
    men: menLevelThree,
    women: womenLevelThree,
    electronics: electronicsLevelThree,
    home_furniture: furnitureLevelThree,
    home_furnitue: furnitureLevelThree,
};

const sizesList = ["FREE", "S", "M", "L", "XL", "XXL"];

const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    mrpPrice: Yup.number()
        .typeError("MRP Price must be a number")
        .positive("MRP Price must be positive")
        .required("MRP Price is required"),
    sellingPrice: Yup.number()
        .typeError("Selling Price must be a number")
        .positive("Selling Price must be positive")
        .required("Selling Price is required")
        .test("is-less-than-mrp", "Selling Price cannot exceed MRP Price", function (value) {
            const { mrpPrice } = this.parent;
            return !mrpPrice || !value || value <= mrpPrice;
        }),
    color: Yup.string().required("Color is required"),
    sizes: Yup.string().required("Sizes is required"),
    category: Yup.string().required("Category is required"),
    category2: Yup.string().required("Second category is required"),
    category3: Yup.string().required("Third category is required"),
});

const AddProduct = () => {
    const [uploadingImage, setUploadingImage] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            mrpPrice: "",
            sellingPrice: "",
            color: "",
            sizes: "",
            images: [] as string[],
            category: "",
            category2: "",
            category3: "",
        },
        validationSchema,
        onSubmit: (values) => {
            console.log("Product Form Submitted:", values);
            setSnackbarSeverity("success");
            setSnackbarMessage("Product created successfully!");
            setSnackbarOpen(true);
        },
    });

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const uploadedUrl = await UploadToCludinary(file);
            if (uploadedUrl) {
                formik.setFieldValue("images", [...formik.values.images, uploadedUrl]);
            }
        } catch (error) {
            console.error("Image upload failed:", error);
            setSnackbarSeverity("error");
            setSnackbarMessage("Failed to upload image.");
            setSnackbarOpen(true);
        } finally {
            setUploadingImage(false);
            event.target.value = "";
        }
    };

    const handleRemoveImage = (index: number) => {
        const updatedImages = [...formik.values.images];
        updatedImages.splice(index, 1);
        formik.setFieldValue("images", updatedImages);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const childCategory = (categories: any[], parentCategoryId: string) => {
        return categories.filter((child) => child.parentCategoryId === parentCategoryId);
    };

    return (
        <div className="p-4 lg:p-10 max-w-7xl mx-auto">
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    {/* Image Upload Gallery */}
                    <Grid size={{ xs: 12 }} className="flex flex-wrap gap-4 items-center">
                        <input
                            type="file"
                            accept="image/*"
                            id="fileInput"
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                        />

                        <label htmlFor="fileInput">
                            <div className="relative">
                                <span className="w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-400 hover:border-teal-600 transition">
                                    <AddPhotoAlternateIcon className="text-gray-500" fontSize="large" />
                                </span>
                                {uploadingImage && (
                                    <div className="absolute top-0 left-0 right-0 bottom-0 w-24 h-24 flex items-center justify-center bg-white/70 rounded-md">
                                        <CircularProgress size={28} />
                                    </div>
                                )}
                            </div>
                        </label>

                        {formik.values.images.map((image, index) => (
                            <div className="relative group" key={index}>
                                <img
                                    className="w-24 h-24 object-cover rounded-md border border-gray-200"
                                    src={image}
                                    alt={`Product ${index + 1}`}
                                />
                                <IconButton
                                    onClick={() => handleRemoveImage(index)}
                                    size="small"
                                    color="error"
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        outline: "none",
                                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                                        "&:hover": { backgroundColor: "#fff" },
                                    }}
                                >
                                    <CloseIcon sx={{ fontSize: "1rem" }} />
                                </IconButton>
                            </div>
                        ))}
                    </Grid>

                    {/* Title */}
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            id="title"
                            name="title"
                            label="Title"
                            required
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />
                    </Grid>

                    {/* Description */}
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            multiline
                            rows={4}
                            fullWidth
                            id="description"
                            name="description"
                            label="Description"
                            required
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                    </Grid>

                    {/* MRP Price */}
                    <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                        <TextField
                            fullWidth
                            id="mrpPrice"
                            name="mrpPrice"
                            label="MRP Price"
                            type="number"
                            required
                            value={formik.values.mrpPrice}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.mrpPrice && Boolean(formik.errors.mrpPrice)}
                            helperText={formik.touched.mrpPrice && formik.errors.mrpPrice}
                        />
                    </Grid>

                    {/* Selling Price */}
                    <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                        <TextField
                            fullWidth
                            id="sellingPrice"
                            name="sellingPrice"
                            label="Selling Price"
                            type="number"
                            required
                            value={formik.values.sellingPrice}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.sellingPrice && Boolean(formik.errors.sellingPrice)}
                            helperText={formik.touched.sellingPrice && formik.errors.sellingPrice}
                        />
                    </Grid>

                    {/* Color */}
                    <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                        <FormControl
                            fullWidth
                            error={formik.touched.color && Boolean(formik.errors.color)}
                            required
                        >
                            <InputLabel id="color-label">Color</InputLabel>
                            <Select
                                labelId="color-label"
                                id="color"
                                name="color"
                                value={formik.values.color}
                                label="Color"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <MenuItem value="">
                                    <em>Select Color</em>
                                </MenuItem>
                                {colors.map((colorItem, index) => (
                                    <MenuItem value={colorItem.name} key={index}>
                                        <div className="flex gap-3 items-center">
                                            <span
                                                style={{ backgroundColor: colorItem.hex }}
                                                className="h-5 w-5 rounded-full border border-gray-300"
                                            />
                                            <p>{colorItem.name}</p>
                                        </div>
                                    </MenuItem>
                                ))}
                            </Select>
                            {formik.touched.color && formik.errors.color && (
                                <FormHelperText>{formik.errors.color}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    {/* Sizes */}
                    <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                        <FormControl
                            fullWidth
                            error={formik.touched.sizes && Boolean(formik.errors.sizes)}
                            required
                        >
                            <InputLabel id="sizes-label">Sizes</InputLabel>
                            <Select
                                labelId="sizes-label"
                                id="sizes"
                                name="sizes"
                                value={formik.values.sizes}
                                label="Sizes"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <MenuItem value="">
                                    <em>Select Size</em>
                                </MenuItem>
                                {sizesList.map((size, index) => (
                                    <MenuItem key={index} value={size}>
                                        {size}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formik.touched.sizes && formik.errors.sizes && (
                                <FormHelperText>{formik.errors.sizes}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    {/* Level 1 Category */}
                    <Grid size={{ xs: 12, md: 4, lg: 4 }}>
                        <FormControl
                            fullWidth
                            error={formik.touched.category && Boolean(formik.errors.category)}
                            required
                        >
                            <InputLabel id="category-label">Category</InputLabel>
                            <Select
                                labelId="category-label"
                                id="category"
                                name="category"
                                value={formik.values.category}
                                label="Category"
                                onChange={(e) => {
                                    formik.setFieldValue("category", e.target.value);
                                    formik.setFieldValue("category2", "");
                                    formik.setFieldValue("category3", "");
                                }}
                                onBlur={formik.handleBlur}
                            >
                                <MenuItem value="">
                                    <em>Select Category</em>
                                </MenuItem>
                                {mainCategory.map((cat, index) => (
                                    <MenuItem key={index} value={cat.categoryId}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formik.touched.category && formik.errors.category && (
                                <FormHelperText>{formik.errors.category}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    {/* Level 2 Category */}
                    <Grid size={{ xs: 12, md: 4, lg: 4 }}>
                        <FormControl
                            fullWidth
                            error={formik.touched.category2 && Boolean(formik.errors.category2)}
                            required
                        >
                            <InputLabel id="category2-label">Second Category</InputLabel>
                            <Select
                                labelId="category2-label"
                                id="category2"
                                name="category2"
                                value={formik.values.category2}
                                label="Second Category"
                                onChange={(e) => {
                                    formik.setFieldValue("category2", e.target.value);
                                    formik.setFieldValue("category3", "");
                                }}
                                onBlur={formik.handleBlur}
                            >
                                <MenuItem value="">
                                    <em>Select Second Category</em>
                                </MenuItem>
                                {(categoryTwoMap[formik.values.category] || []).map((cat, index) => (
                                    <MenuItem key={index} value={cat.categoryId}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formik.touched.category2 && formik.errors.category2 && (
                                <FormHelperText>{formik.errors.category2}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    {/* Level 3 Category */}
                    <Grid size={{ xs: 12, md: 4, lg: 4 }}>
                        <FormControl
                            fullWidth
                            error={formik.touched.category3 && Boolean(formik.errors.category3)}
                            required
                        >
                            <InputLabel id="category3-label">Third Category</InputLabel>
                            <Select
                                labelId="category3-label"
                                id="category3"
                                name="category3"
                                value={formik.values.category3}
                                label="Third Category"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <MenuItem value="">
                                    <em>Select Third Category</em>
                                </MenuItem>
                                {childCategory(
                                    categoryThreeMap[formik.values.category] || [],
                                    formik.values.category2
                                ).map((cat, index) => (
                                    <MenuItem key={index} value={cat.categoryId}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formik.touched.category3 && formik.errors.category3 && (
                                <FormHelperText>{formik.errors.category3}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    {/* Submit Button */}
                    <Grid size={{ xs: 12, md: 4, lg: 4 }}>
                        <Button
                            sx={{ p: "14px" }}
                            color="primary"
                            variant="contained"
                            fullWidth
                            type="submit"
                        >
                            ADD PRODUCT
                        </Button>
                    </Grid>
                </Grid>
            </form>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default AddProduct;
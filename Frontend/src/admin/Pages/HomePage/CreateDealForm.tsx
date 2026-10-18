import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { mainCategory } from "../../../data/category/mainCategory";

interface DealFormValues {
    discount: number;
    category: string;
}

const CreateDealForm = () => {
    const formik = useFormik<DealFormValues>({
        initialValues: {
            discount: 0,
            category: "",
        },
        onSubmit: (values) => {
            console.log("submit ", values);
        },
    });

    return (
        <Box
            component="form"
            onSubmit={formik.handleSubmit}
            className="space-y-6 max-w-xl mx-auto mt-10"
        >
            <Typography variant="h4" className="text-center font-bold text-primary-color">
                Create Deal
            </Typography>

            <TextField
                fullWidth
                name="discount"
                label="Discount"
                type="number"
                value={formik.values.discount}
                onChange={formik.handleChange}
                error={formik.touched.discount && Boolean(formik.errors.discount)}
                helperText={formik.touched.discount && formik.errors.discount}
            />

            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel id="category-select-label">Category</InputLabel>
                    <Select
                        labelId="category-select-label"
                        id="category-select"
                        name="category"
                        value={formik.values.category}
                        label="Category"
                        onChange={formik.handleChange}
                    >
                        {mainCategory.map((item, index) => (
                            <MenuItem key={index} value={item.categoryId}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{ py: "14px" }}
            >
                CREATE DEAL
            </Button>
        </Box>
    );
};

export default CreateDealForm;
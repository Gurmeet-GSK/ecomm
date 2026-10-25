import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { createDeal } from "../../../State/admin/DealSlice";

interface DealFormValues {
    discount: number;
    category: string;
}

const CreateDealForm = () => {
    const dispatch = useAppDispatch();
    const { customer } = useAppSelector((store) => store);

    const formik = useFormik<DealFormValues>({
        initialValues: {
            discount: 0,
            category: "",
        },
        onSubmit: (values) => {
            console.log("submit ", values);
            const reqData = {
                discount: values.discount,
                category: {
                    id: values.category,
                },
            };
            dispatch(createDeal(reqData));
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
                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={formik.values.category}
                        label="Category"
                        onChange={formik.handleChange}
                    >
                        {customer.homePageData?.dealCategories.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Button
                fullWidth
                sx={{ py: ".9rem" }}
                type="submit"
                variant="contained"
            >
                create deal
            </Button>
        </Box>
    );
};

export default CreateDealForm;
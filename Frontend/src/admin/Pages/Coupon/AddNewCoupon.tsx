import { Dayjs } from "dayjs";
import { useFormik } from "formik";
import { Box, Button, Grid, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useAppDispatch } from "../../../State/Store";
import { createCoupon } from "../../../State/customer/couponSlice";
import { useNavigate } from "react-router-dom";

interface CouponFormValues {
    code: string;
    discountPercentage: number;
    validityStartDate: Dayjs | null;
    validityEndDate: Dayjs | null;
    minimumOrderValue: number;
}

const AddNewCoupon = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const formik = useFormik<CouponFormValues>({
        initialValues: {
            code: "",
            discountPercentage: 0,
            validityStartDate: null,
            validityEndDate: null,
            minimumOrderValue: 0,
        },
        onSubmit: async (values) => {
            const formattedValues = {
                code: values.code,
                discountPercentage: values.discountPercentage,
                validityStartDate: values.validityStartDate?.format("YYYY-MM-DD") || "",
                validityEndDate: values.validityEndDate?.format("YYYY-MM-DD") || "",
                minimumOrderValue: values.minimumOrderValue,
                active: true,
            };
            const jwt = localStorage.getItem("jwt") || "";
            if (jwt) {
                await dispatch(createCoupon({ coupon: formattedValues, jwt }));
                navigate("/admin/coupon");
            }
        },
    });

    return (
        <div>
            <h1 className="text-2xl font-bold text-primary-color pb-5 text-center">
                Create New Coupon
            </h1>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        {/* Coupon Code */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                name="code"
                                label="Coupon Code"
                                value={formik.values.code}
                                onChange={formik.handleChange}
                                error={formik.touched.code && Boolean(formik.errors.code)}
                                helperText={formik.touched.code && formik.errors.code}
                            />
                        </Grid>

                        {/* Discount Percentage */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                name="discountPercentage"
                                label="Discount Percentage"
                                type="number"
                                value={formik.values.discountPercentage}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.discountPercentage &&
                                    Boolean(formik.errors.discountPercentage)
                                }
                                helperText={
                                    formik.touched.discountPercentage &&
                                    formik.errors.discountPercentage
                                }
                            />
                        </Grid>

                        {/* Validity Start Date */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <DatePicker
                                sx={{ width: "100%" }}
                                label="Validity Start Date"
                                name="validityStartDate"
                                value={formik.values.validityStartDate}
                                onChange={(value) =>
                                    formik.setFieldValue("validityStartDate", value)
                                }
                            />
                        </Grid>

                        {/* Validity End Date */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <DatePicker
                                sx={{ width: "100%" }}
                                label="Validity End Date"
                                name="validityEndDate"
                                value={formik.values.validityEndDate}
                                onChange={(value) =>
                                    formik.setFieldValue("validityEndDate", value)
                                }
                            />
                        </Grid>

                        {/* Minimum Order Value (full width span: xs:12) */}
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                name="minimumOrderValue"
                                label="Minimum Order Value"
                                type="number"
                                value={formik.values.minimumOrderValue}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.minimumOrderValue &&
                                    Boolean(formik.errors.minimumOrderValue)
                                }
                                helperText={
                                    formik.touched.minimumOrderValue &&
                                    formik.errors.minimumOrderValue
                                }
                            />
                        </Grid>

                        {/* Submit Button (full width: sx={{ p: "14px" }}) */}
                        <Grid size={{ xs: 12 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{ py: "14px" }}
                            >
                                CREATE COUPON
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </LocalizationProvider>
        </div>
    );
};

export default AddNewCoupon;

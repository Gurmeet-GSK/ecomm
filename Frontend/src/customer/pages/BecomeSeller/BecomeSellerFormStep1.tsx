import React from "react";
import { Box, TextField } from "@mui/material";

interface BecomeSellerFormStep1Props {
    formik: any;
}

const BecomeSellerFormStep1: React.FC<BecomeSellerFormStep1Props> = ({ formik }) => {
    return (
        <Box className="space-y-4">
            <TextField
                fullWidth
                name="mobile"
                placeholder="Mobile"
                value={formik.values.mobile}
                onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, "");
                    formik.setFieldValue("mobile", onlyDigits.slice(0, 10));
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                helperText={formik.touched.mobile && formik.errors.mobile}
                slotProps={{
                    htmlInput: { maxLength: 10, inputMode: "numeric" },
                }}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "4px",
                        bgcolor: "#fff",
                    },
                }}
            />

            <TextField
                fullWidth
                name="GSTIN"
                placeholder="GSTIN"
                value={formik.values.GSTIN}
                onChange={(e) => formik.setFieldValue("GSTIN", e.target.value.toUpperCase())}
                onBlur={formik.handleBlur}
                error={formik.touched.GSTIN && Boolean(formik.errors.GSTIN)}
                helperText={formik.touched.GSTIN && formik.errors.GSTIN}
                slotProps={{
                    htmlInput: { maxLength: 15, style: { textTransform: "uppercase" } },
                }}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "4px",
                        bgcolor: "#fff",
                    },
                }}
            />
        </Box>
    );
};

export default BecomeSellerFormStep1;

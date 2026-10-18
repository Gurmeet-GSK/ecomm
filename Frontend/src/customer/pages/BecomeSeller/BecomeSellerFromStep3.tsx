import React from "react";
import { Box, TextField } from "@mui/material";

interface BecomeSellerFromStep3Props {
    formik: any;
}

const inputStyles = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "4px",
        bgcolor: "#fff",
    },
};

const BecomeSellerFromStep3: React.FC<BecomeSellerFromStep3Props> = ({ formik }) => {
    return (
        <Box className="space-y-4">
            <TextField
                fullWidth
                name="accountNumber"
                placeholder="Account Number"
                value={formik.values.accountNumber}
                onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, "");
                    formik.setFieldValue("accountNumber", onlyDigits);
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.accountNumber && Boolean(formik.errors.accountNumber)}
                helperText={formik.touched.accountNumber && formik.errors.accountNumber}
                slotProps={{
                    htmlInput: { inputMode: "numeric" },
                }}
                sx={inputStyles}
            />

            <TextField
                fullWidth
                name="ifsCode"
                placeholder="IFSC Code"
                value={formik.values.ifsCode}
                onChange={(e) => formik.setFieldValue("ifsCode", e.target.value.toUpperCase())}
                onBlur={formik.handleBlur}
                error={formik.touched.ifsCode && Boolean(formik.errors.ifsCode)}
                helperText={formik.touched.ifsCode && formik.errors.ifsCode}
                slotProps={{
                    htmlInput: { maxLength: 11, style: { textTransform: "uppercase" } },
                }}
                sx={inputStyles}
            />

            <TextField
                fullWidth
                name="accountHolderName"
                placeholder="Account Holder Name"
                value={formik.values.accountHolderName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.accountHolderName && Boolean(formik.errors.accountHolderName)}
                helperText={formik.touched.accountHolderName && formik.errors.accountHolderName}
                sx={inputStyles}
            />
        </Box>
    );
};

export default BecomeSellerFromStep3;

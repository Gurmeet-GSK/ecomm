import React from "react";
import { Box, TextField } from "@mui/material";

interface BecomeSellerFormStep4Props {
    formik: any;
}

const inputStyles = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "4px",
        bgcolor: "#fff",
    },
};

const BecomeSellerFormStep4: React.FC<BecomeSellerFormStep4Props> = ({ formik }) => {
    return (
        <Box className="space-y-4">
            <TextField
                fullWidth
                name="businessName"
                placeholder="Business Name"
                value={formik.values.businessName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.businessName && Boolean(formik.errors.businessName)}
                helperText={formik.touched.businessName && formik.errors.businessName}
                sx={inputStyles}
            />

            <TextField
                fullWidth
                name="sellerName"
                placeholder="Seller Name"
                value={formik.values.sellerName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.sellerName && Boolean(formik.errors.sellerName)}
                helperText={formik.touched.sellerName && formik.errors.sellerName}
                sx={inputStyles}
            />

            <TextField
                fullWidth
                name="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                sx={inputStyles}
            />

            <TextField
                fullWidth
                type="password"
                name="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                sx={inputStyles}
            />
        </Box>
    );
};

export default BecomeSellerFormStep4;

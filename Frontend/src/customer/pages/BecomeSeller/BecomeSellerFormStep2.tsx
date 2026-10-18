import React from "react";
import { Box, TextField } from "@mui/material";

interface BecomeSellerFormStep2Props {
    formik: any;
}

const inputStyles = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "4px",
        bgcolor: "#fff",
    },
};

const BecomeSellerFormStep2: React.FC<BecomeSellerFormStep2Props> = ({ formik }) => {
    return (
        <Box className="space-y-4">
            <TextField
                fullWidth
                name="name"
                placeholder="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                sx={inputStyles}
            />

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
                sx={inputStyles}
            />

            <TextField
                fullWidth
                name="pinCode"
                placeholder="Pin Code"
                value={formik.values.pinCode}
                onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, "");
                    formik.setFieldValue("pinCode", onlyDigits.slice(0, 6));
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.pinCode && Boolean(formik.errors.pinCode)}
                helperText={formik.touched.pinCode && formik.errors.pinCode}
                slotProps={{
                    htmlInput: { maxLength: 6, inputMode: "numeric" },
                }}
                sx={inputStyles}
            />

            <TextField
                fullWidth
                name="address"
                placeholder="Address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                sx={inputStyles}
            />

            <TextField
                fullWidth
                name="locality"
                placeholder="Locality"
                value={formik.values.locality}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.locality && Boolean(formik.errors.locality)}
                helperText={formik.touched.locality && formik.errors.locality}
                sx={inputStyles}
            />

            <div className="grid grid-cols-2 gap-4">
                <TextField
                    fullWidth
                    name="city"
                    placeholder="City"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    helperText={formik.touched.city && formik.errors.city}
                    sx={inputStyles}
                />

                <TextField
                    fullWidth
                    name="state"
                    placeholder="State"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.state && Boolean(formik.errors.state)}
                    helperText={formik.touched.state && formik.errors.state}
                    sx={inputStyles}
                />
            </div>
        </Box>
    );
};

export default BecomeSellerFormStep2;

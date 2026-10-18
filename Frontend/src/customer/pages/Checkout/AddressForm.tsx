import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    IconButton,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { teal } from "@mui/material/colors";

export interface Address {
    id: string;
    name: string;
    mobile: string;
    pinCode: string;
    address: string;
    locality: string;
    city: string;
    state: string;
    addressType?: "HOME" | "WORK" | "OTHER";
    isDefault?: boolean;
}

// 4. Address Form Validation Schema (corrected pinCode to 6 digits)
export const AddressFormSchema = Yup.object().shape({
    name: Yup.string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .required("Name is required"),
    mobile: Yup.string()
        .trim()
        .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
        .required("Mobile number is required"),
    pinCode: Yup.string()
        .trim()
        .matches(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit pin code")
        .required("Pin code is required"),
    address: Yup.string()
        .trim()
        .min(5, "Address must be at least 5 characters")
        .required("Address (House No, Building, Street) is required"),
    locality: Yup.string()
        .trim()
        .required("Locality/Town is required"),
    city: Yup.string()
        .trim()
        .required("City is required"),
    state: Yup.string()
        .trim()
        .required("State is required"),
});

interface AddressFormProps {
    open: boolean;
    onClose: () => void;
    onAddAddress: (address: Address) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ open, onClose, onAddAddress }) => {
    const [addressType, setAddressType] = React.useState<"HOME" | "WORK" | "OTHER">("HOME");

    const formik = useFormik({
        initialValues: {
            name: "",
            mobile: "",
            pinCode: "",
            address: "",
            locality: "",
            city: "",
            state: "",
        },
        validationSchema: AddressFormSchema,
        onSubmit: (values, { resetForm }) => {
            const newAddress: Address = {
                id: Date.now().toString(),
                name: values.name.trim(),
                mobile: values.mobile.trim(),
                pinCode: values.pinCode.trim(),
                address: values.address.trim(),
                locality: values.locality.trim(),
                city: values.city.trim(),
                state: values.state.trim(),
                addressType: addressType,
                isDefault: false,
            };

            onAddAddress(newAddress);
            resetForm();
            onClose();
        },
    });

    const handleDialogClose = () => {
        formik.resetForm();
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleDialogClose}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: "16px",
                        p: { xs: 1, sm: 2 },
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    },
                },
            }}
        >
            {/* Header */}
            <DialogTitle sx={{ pb: 1, pt: 2, px: 3, position: "relative" }}>
                <p className="text-xl font-bold text-center text-gray-900 tracking-tight">
                    Contact Details
                </p>
                <IconButton
                    aria-label="close"
                    onClick={handleDialogClose}
                    sx={{
                        position: "absolute",
                        right: 12,
                        top: 12,
                        color: "#9ca3af",
                        "&:hover": { color: "#4b5563" },
                    }}
                >
                    <Close fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ px: 3, py: 2 }}>
                <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
                    {/* Field 1: Name */}
                    <div>
                        <TextField
                            fullWidth
                            size="small"
                            id="name"
                            name="name"
                            label="Name"
                            placeholder="e.g. John Doe"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    "&.Mui-focused fieldset": { borderColor: teal[600] },
                                },
                            }}
                        />
                    </div>

                    {/* Field 2 & 3: Mobile and Pin Code */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TextField
                            fullWidth
                            size="small"
                            id="mobile"
                            name="mobile"
                            label="Mobile"
                            placeholder="10-digit number"
                            value={formik.values.mobile}
                            onChange={(e) => {
                                const onlyDigits = e.target.value.replace(/\D/g, "");
                                formik.setFieldValue("mobile", onlyDigits.slice(0, 10));
                            }}
                            onBlur={formik.handleBlur}
                            error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                            helperText={formik.touched.mobile && formik.errors.mobile}
                            slotProps={{
                                htmlInput: { maxLength: 10, inputMode: "numeric", pattern: "[0-9]*" }
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    "&.Mui-focused fieldset": { borderColor: teal[600] },
                                },
                            }}
                        />

                        <TextField
                            fullWidth
                            size="small"
                            id="pinCode"
                            name="pinCode"
                            label="Pin Code"
                            placeholder="6-digit PIN"
                            value={formik.values.pinCode}
                            onChange={(e) => {
                                const onlyDigits = e.target.value.replace(/\D/g, "");
                                formik.setFieldValue("pinCode", onlyDigits.slice(0, 6));
                            }}
                            onBlur={formik.handleBlur}
                            error={formik.touched.pinCode && Boolean(formik.errors.pinCode)}
                            helperText={formik.touched.pinCode && formik.errors.pinCode}
                            slotProps={{
                                htmlInput: { maxLength: 6, inputMode: "numeric", pattern: "[0-9]*" }
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    "&.Mui-focused fieldset": { borderColor: teal[600] },
                                },
                            }}
                        />
                    </div>

                    {/* Field 4: Address */}
                    <div>
                        <TextField
                            fullWidth
                            size="small"
                            id="address"
                            name="address"
                            label="Address (House No, Building, Street)"
                            placeholder="Flat/House no., Floor, Building, Street"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.address && Boolean(formik.errors.address)}
                            helperText={formik.touched.address && formik.errors.address}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    "&.Mui-focused fieldset": { borderColor: teal[600] },
                                },
                            }}
                        />
                    </div>

                    {/* Field 5: Locality/Town */}
                    <div>
                        <TextField
                            fullWidth
                            size="small"
                            id="locality"
                            name="locality"
                            label="Locality/Town"
                            placeholder="Area, Colony, Sector, or Landmark"
                            value={formik.values.locality}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.locality && Boolean(formik.errors.locality)}
                            helperText={formik.touched.locality && formik.errors.locality}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    "&.Mui-focused fieldset": { borderColor: teal[600] },
                                },
                            }}
                        />
                    </div>

                    {/* Field 6 & 7: City and State */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TextField
                            fullWidth
                            size="small"
                            id="city"
                            name="city"
                            label="City"
                            placeholder="City / District"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.city && Boolean(formik.errors.city)}
                            helperText={formik.touched.city && formik.errors.city}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    "&.Mui-focused fieldset": { borderColor: teal[600] },
                                },
                            }}
                        />

                        <TextField
                            fullWidth
                            size="small"
                            id="state"
                            name="state"
                            label="State"
                            placeholder="State"
                            value={formik.values.state}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.state && Boolean(formik.errors.state)}
                            helperText={formik.touched.state && formik.errors.state}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    "&.Mui-focused fieldset": { borderColor: teal[600] },
                                },
                            }}
                        />
                    </div>

                    {/* Address Type Selection */}
                    <div className="pt-1">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                            Address Type
                        </span>
                        <RadioGroup
                            row
                            value={addressType}
                            onChange={(e) => setAddressType(e.target.value as "HOME" | "WORK" | "OTHER")}
                        >
                            <FormControlLabel
                                value="HOME"
                                control={<Radio size="small" sx={{ color: teal[600], "&.Mui-checked": { color: teal[600] } }} />}
                                label={<span className="text-sm font-medium text-gray-700">Home</span>}
                            />
                            <FormControlLabel
                                value="WORK"
                                control={<Radio size="small" sx={{ color: teal[600], "&.Mui-checked": { color: teal[600] } }} />}
                                label={<span className="text-sm font-medium text-gray-700">Work</span>}
                            />
                            <FormControlLabel
                                value="OTHER"
                                control={<Radio size="small" sx={{ color: teal[600], "&.Mui-checked": { color: teal[600] } }} />}
                                label={<span className="text-sm font-medium text-gray-700">Other</span>}
                            />
                        </RadioGroup>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                bgcolor: teal[600],
                                color: "#fff",
                                py: 1.3,
                                borderRadius: "10px",
                                fontSize: "0.875rem",
                                fontWeight: 700,
                                letterSpacing: "0.05em",
                                textTransform: "uppercase",
                                boxShadow: "0 4px 14px rgba(13, 148, 136, 0.3)",
                                "&:hover": {
                                    bgcolor: teal[800],
                                    boxShadow: "0 6px 20px rgba(13, 148, 136, 0.4)",
                                },
                            }}
                        >
                            Add Address
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddressForm;

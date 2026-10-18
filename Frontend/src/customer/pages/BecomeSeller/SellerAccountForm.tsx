import React, { useState } from "react";
import { Box, Button, Step, StepLabel, Stepper } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import BecomeSellerFormStep1 from "./BecomeSellerFormStep1";
import BecomeSellerFormStep2 from "./BecomeSellerFormStep2";
import BecomeSellerFromStep3 from "./BecomeSellerFromStep3";
import BecomeSellerFormStep4 from "./BecomeSellerFormStep4";

interface SellerAccountFormProps {
    onToggleLogin?: () => void;
}

const steps = [
    "Tax Details & Mobile",
    "Pickup Address",
    "Bank Details",
    "Supplier Details",
];

const validationSchemas = [
    // Step 1 Schema
    Yup.object({
        mobile: Yup.string()
            .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
            .required("Mobile number is required"),
        GSTIN: Yup.string()
            .trim()
            .min(15, "GSTIN must be 15 characters")
            .max(15, "GSTIN must be 15 characters")
            .required("GSTIN is required"),
    }),
    // Step 2 Schema (Pickup Address)
    Yup.object({
        name: Yup.string().trim().required("Name is required"),
        address: Yup.string().trim().min(5, "Address must be at least 5 characters").required("Address is required"),
        locality: Yup.string().trim().required("Locality is required"),
        city: Yup.string().trim().required("City is required"),
        state: Yup.string().trim().required("State is required"),
        pinCode: Yup.string().matches(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit pin code").required("Pin code is required"),
    }),
    // Step 3 Schema (Bank Details)
    Yup.object({
        accountNumber: Yup.string()
            .min(9, "Account number must be at least 9 digits")
            .required("Account number is required"),
        ifsCode: Yup.string()
            .trim()
            .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Enter a valid 11-character IFSC code (e.g. SBIN0001234)")
            .required("IFSC code is required"),
        accountHolderName: Yup.string().trim().required("Account holder name is required"),
    }),
    // Step 4 Schema (Supplier Details)
    Yup.object({
        businessName: Yup.string().trim().required("Business / Store name is required"),
        sellerName: Yup.string().trim().required("Seller name is required"),
        email: Yup.string().email("Enter a valid email").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    }),
];

const SellerAccountForm: React.FC<SellerAccountFormProps> = ({ onToggleLogin }) => {
    const [activeStep, setActiveStep] = useState(0);

    const formik = useFormik({
        initialValues: {
            mobile: "",
            GSTIN: "",
            name: "",
            address: "",
            locality: "",
            city: "",
            state: "",
            pinCode: "",
            accountNumber: "",
            ifsCode: "",
            accountHolderName: "",
            businessName: "",
            sellerName: "",
            email: "",
            password: "",
        },
        validationSchema: validationSchemas[activeStep],
        onSubmit: (values) => {
            if (activeStep < steps.length - 1) {
                setActiveStep((prev) => prev + 1);
            } else {
                alert(`Seller Account Created Successfully for: ${values.businessName} (${values.sellerName})`);
            }
        },
    });

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep((prev) => prev - 1);
        }
    };

    const handleStepSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors = await formik.validateForm();
        formik.setTouched(
            Object.keys(formik.values).reduce((acc: any, key) => {
                acc[key] = true;
                return acc;
            }, {})
        );

        const currentStepKeys = [
            ["mobile", "GSTIN"],
            ["name", "address", "locality", "city", "state", "pinCode"],
            ["accountNumber", "ifsCode", "accountHolderName"],
            ["businessName", "sellerName", "email", "password"],
        ][activeStep];

        const hasStepErrors = currentStepKeys.some((k) => (errors as any)[k]);
        if (!hasStepErrors) {
            if (activeStep < steps.length - 1) {
                setActiveStep((prev) => prev + 1);
            } else {
                formik.handleSubmit();
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Custom Teal Stepper matching Screenshot 2 */}
            <Stepper
                activeStep={activeStep}
                alternativeLabel
                sx={{
                    "& .MuiStepIcon-root": {
                        color: "#e5e7eb",
                        "&.Mui-active": { color: "#00897b" },
                        "&.Mui-completed": { color: "#00897b" },
                    },
                    "& .MuiStepLabel-label": {
                        fontSize: "0.75rem",
                        color: "#6b7280",
                        "&.Mui-active": { color: "#111827", fontWeight: 600 },
                        "&.Mui-completed": { color: "#111827" },
                    },
                    "& .MuiStepConnector-line": {
                        borderColor: "#e5e7eb",
                    },
                    "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
                        borderColor: "#00897b",
                    },
                }}
            >
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <form onSubmit={handleStepSubmit} noValidate className="space-y-6 pt-2">
                {activeStep === 0 && <BecomeSellerFormStep1 formik={formik} />}
                {activeStep === 1 && <BecomeSellerFormStep2 formik={formik} />}
                {activeStep === 2 && <BecomeSellerFromStep3 formik={formik} />}
                {activeStep === 3 && <BecomeSellerFormStep4 formik={formik} />}

                {/* Navigation Buttons: BACK & CONTINUE matching Screenshot 2 */}
                <Box className="flex justify-between items-center gap-4 pt-2">
                    <Button
                        onClick={handleBack}
                        disabled={activeStep === 0}
                        variant="contained"
                        sx={{
                            visibility: activeStep === 0 ? "hidden" : "visible",
                            bgcolor: "#00897b",
                            color: "#fff",
                            textTransform: "uppercase",
                            fontWeight: 700,
                            borderRadius: "4px",
                            px: 3,
                            py: 0.9,
                            boxShadow: "none",
                            "&:hover": { bgcolor: "#00695c", boxShadow: "none" },
                        }}
                    >
                        Back
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            bgcolor: "#00897b",
                            color: "#fff",
                            textTransform: "uppercase",
                            fontWeight: 700,
                            borderRadius: "4px",
                            px: 3,
                            py: 0.9,
                            boxShadow: "none",
                            "&:hover": { bgcolor: "#00695c", boxShadow: "none" },
                        }}
                    >
                        {activeStep === steps.length - 1 ? "Create" : "Continue"}
                    </Button>
                </Box>
            </form>

            {/* Bottom Login Switch matching Screenshot 2 */}
            <div className="pt-4 text-center space-y-2">
                <p className="text-xs text-gray-600">have account ?</p>
                <Button
                    onClick={onToggleLogin}
                    fullWidth
                    variant="outlined"
                    sx={{
                        py: "10px",
                        color: "#00897b",
                        borderColor: "#00897b",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        borderRadius: "4px",
                        "&:hover": {
                            borderColor: "#00695c",
                            bgcolor: "rgba(0, 137, 123, 0.04)",
                        },
                    }}
                >
                    Login
                </Button>
            </div>
        </div>
    );
};

export default SellerAccountForm;

import React from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { sendLoginSignupOtp, signup } from "../../../State/AuthSlice";

interface RegisterFormProps {
    onToggleLogin?: () => void;
    onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleLogin, onSuccess }) => {
    const dispatch = useAppDispatch();
    const authState = useAppSelector((state) => state.auth);

    const formik = useFormik({
        initialValues: {
            email: "",
            fullName: "",
            otp: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Enter a valid email")
                .required("Email is required"),
            fullName: Yup.string()
                .min(2, "Full name must be at least 2 characters")
                .required("Full name is required"),
            otp: Yup.string()
                .length(6, "OTP must be 6 digits")
                .required("OTP is required"),
        }),
        onSubmit: async (values) => {
            console.log("register form data ", values);
            try {
                await dispatch(
                    signup({
                        email: values.email.trim(),
                        fullName: values.fullName.trim(),
                        otp: values.otp.trim(),
                    })
                ).unwrap();
                if (onSuccess) {
                    onSuccess();
                }
            } catch (err) {
                console.error("Signup failed: ", err);
            }
        },
    });

    const handleSendOtp = () => {
        if (!formik.values.email) {
            formik.setFieldTouched("email", true);
            formik.setFieldError("email", "Email is required to send OTP");
            return;
        }
        dispatch(sendLoginSignupOtp({ email: formik.values.email.trim(), role: "ROLE_CUSTOMER" }));
    };

    return (
        <div className="space-y-5">
            <h1 className="text-center text-xl font-bold text-teal-600 pb-2">Register</h1>

            {authState.error && (
                <div className="bg-red-50 text-red-700 p-3 rounded text-sm text-center border border-red-200">
                    {authState.error}
                </div>
            )}

            {authState.otpSent && (
                <div className="bg-teal-50 text-teal-700 p-3 rounded text-sm text-center border border-teal-200">
                    OTP has been sent to your email!
                </div>
            )}

            <div className="space-y-4">
                <TextField
                    fullWidth
                    name="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />

                <TextField
                    fullWidth
                    name="fullName"
                    label="Full Name"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                    helperText={formik.touched.fullName && formik.errors.fullName}
                />

                {authState.otpSent && (
                    <div className="space-y-2">
                        <p className="font-medium text-sm opacity-60">
                            Enter OTP sent to your email
                        </p>
                        <TextField
                            fullWidth
                            name="otp"
                            label="OTP"
                            value={formik.values.otp}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.otp && Boolean(formik.errors.otp)}
                            helperText={formik.touched.otp && formik.errors.otp}
                        />
                    </div>
                )}
            </div>

            <div className="pt-2">
                {!authState.otpSent ? (
                    <Button
                        onClick={handleSendOtp}
                        fullWidth
                        variant="contained"
                        disabled={authState.loading}
                        sx={{ py: "11px", bgcolor: "#00897b", "&:hover": { bgcolor: "#00695c" } }}
                    >
                        {authState.loading ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
                    </Button>
                ) : (
                    <Button
                        onClick={() => formik.handleSubmit()}
                        fullWidth
                        variant="contained"
                        disabled={authState.loading}
                        sx={{ py: "11px", bgcolor: "#00897b", "&:hover": { bgcolor: "#00695c" } }}
                    >
                        {authState.loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
                    </Button>
                )}
            </div>

            {onToggleLogin && (
                <div className="flex items-center justify-center gap-2 pt-2">
                    <p className="text-sm text-gray-600">Already have an account?</p>
                    <Button
                        size="small"
                        onClick={onToggleLogin}
                        sx={{ color: "#00897b", textTransform: "none", fontWeight: 600 }}
                    >
                        Login
                    </Button>
                </div>
            )}
        </div>
    );
};

export default RegisterForm;
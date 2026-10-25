import React from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { sendLoginSignupOtp, signin } from "../../../State/AuthSlice";

interface LoginFormProps {
    onToggleRegister?: () => void;
    onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleRegister, onSuccess }) => {
    const dispatch = useAppDispatch();
    const { auth } = useAppSelector((store) => store);

    const formik = useFormik({
        initialValues: {
            email: "",
            otp: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Enter a valid email")
                .required("Email is required"),
            otp: Yup.string()
                .length(6, "OTP must be 6 digits")
                .required("OTP is required"),
        }),
        onSubmit: async (values) => {
            console.log("form data ", values);
            try {
                await dispatch(
                    signin({
                        email: values.email.trim(),
                        otp: values.otp.trim(),
                    })
                ).unwrap();
                if (onSuccess) {
                    onSuccess();
                }
            } catch (err) {
                console.error("Login failed: ", err);
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
            <h1 className="text-center text-xl font-bold text-teal-600 pb-2">Login</h1>

            {auth.error && (
                <div className="bg-red-50 text-red-700 p-3 rounded text-sm text-center border border-red-200">
                    {auth.error}
                </div>
            )}

            {auth.otpSent && (
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

                {auth.otpSent && (
                    <div className="space-y-2">
                        <p className="font-medium text-sm opacity-60">
                            Enter OTP sent to your email
                        </p>
                        <TextField
                            fullWidth
                            name="otp"
                            label="Otp"
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
                {auth.otpSent ? (
                    <Button
                        onClick={() => formik.handleSubmit()}
                        fullWidth
                        variant="contained"
                        sx={{ py: "11px" }}
                    >
                        Login
                    </Button>
                ) : (
                    <Button
                        onClick={handleSendOtp}
                        fullWidth
                        variant="contained"
                        sx={{ py: "11px" }}
                    >
                        {auth.loading ? <CircularProgress /> : "send otp"}
                    </Button>
                )}
            </div>

            {onToggleRegister && (
                <div className="flex items-center justify-center gap-2 pt-2">
                    <p className="text-sm text-gray-600">Don't have an account?</p>
                    <Button
                        size="small"
                        onClick={onToggleRegister}
                        sx={{ color: "#00897b", textTransform: "none", fontWeight: 600 }}
                    >
                        Register
                    </Button>
                </div>
            )}
        </div>
    );
};

export default LoginForm;
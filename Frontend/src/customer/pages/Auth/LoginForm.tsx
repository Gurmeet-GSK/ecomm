import { Button, CircularProgress, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useAppDispatch } from "../../../State/Store";
import { sendLoginSignupOtp, signing } from "../../../State/AuthSlice";

interface LoginFormProps {
    onToggleRegister?: () => void;
    onSuccess?: () => void;
}

const LoginForm = ({ onToggleRegister, onSuccess }: LoginFormProps) => {
    const dispatch = useAppDispatch();
    const [otpSent, setOtpSent] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
            otp: "",
        },
        onSubmit: async (values) => {
            try {
                await dispatch(signing(values)).unwrap();
                if (onSuccess) onSuccess();
            } catch (e) {
                // error handled in slice
            }
        },
    });

    const handleSendOtp = () => {
        if (!formik.values.email) return;
        dispatch(sendLoginSignupOtp({ email: formik.values.email }));
        setOtpSent(true);
    };

    return (
        <div>
            <h1 className="text-center font-bold text-xl text-primary-color pb-8">Login</h1>
            <form onSubmit={formik.handleSubmit} className="space-y-5">
                <TextField
                    fullWidth
                    name="email"
                    label="Enter Your Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />

                {otpSent && (
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

                {otpSent ? (
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ py: "11px" }}
                        disabled={formik.isSubmitting}
                    >
                        {formik.isSubmitting ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            "Login"
                        )}
                    </Button>
                ) : (
                    <Button
                        onClick={handleSendOtp}
                        fullWidth
                        variant="contained"
                        sx={{ py: "11px" }}
                    >
                        Send OTP
                    </Button>
                )}

                {onToggleRegister && (
                    <div className="text-center pt-2">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <button
                                type="button"
                                onClick={onToggleRegister}
                                className="text-teal-700 font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
                            >
                                Register here
                            </button>
                        </p>
                    </div>
                )}
            </form>
        </div>
    );
};

export default LoginForm;

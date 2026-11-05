import { Button, CircularProgress, IconButton, InputAdornment, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { useAppDispatch } from "../../../State/Store";
import { sellerLogin } from "../../../State/seller/sellerAuthSlice";
import { sendLoginSignupOtp } from "../../../State/AuthSlice";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Alert from "@mui/material/Alert";

interface SellerLoginFormProps {
    onToggleRegister?: () => void;
}

const SellerLoginForm = ({ onToggleRegister }: SellerLoginFormProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [loginWithOtp, setLoginWithOtp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{
        type: "success" | "error" | "info";
        text: string;
    } | null>(null);

    const formik = useFormik({
        initialValues: {
            email: "",
            otp: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Enter a valid email")
                .required("Email is required"),
            password: loginWithOtp
                ? Yup.string()
                : Yup.string().required("Password is required"),
            otp: loginWithOtp
                ? Yup.string()
                      .length(6, "OTP must be 6 digits")
                      .required("OTP is required")
                : Yup.string(),
        }),
        onSubmit: async (values) => {
            setStatusMessage(null);
            try {
                await dispatch(
                    sellerLogin({
                        email: values.email.trim(),
                        otp: values.otp.trim(),
                    })
                ).unwrap();

                setStatusMessage({ type: "success", text: "Login Successful! Redirecting..." });
                setTimeout(() => {
                    navigate("/seller");
                }, 800);
            } catch (err: any) {
                const errorText =
                    typeof err === "string"
                        ? err
                        : err?.message || "Login failed. Please check your credentials and try again.";
                setStatusMessage({ type: "error", text: errorText });
            }
        },
    });

    const handleSendOtp = async () => {
        setStatusMessage(null);
        if (!formik.values.email) {
            formik.setFieldTouched("email", true);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formik.values.email)) {
            setStatusMessage({ type: "error", text: "Please enter a valid email address." });
            return;
        }

        setSendingOtp(true);
        try {
            await dispatch(sendLoginSignupOtp({ email: formik.values.email.trim() })).unwrap();
            setOtpSent(true);
            setStatusMessage({
                type: "success",
                text: "OTP sent successfully to your registered email address.",
            });
        } catch (err: any) {
            const errorMsg =
                typeof err === "string"
                    ? err
                    : err?.message || "Failed to send OTP. Please try again.";
            setStatusMessage({ type: "error", text: errorMsg });
        } finally {
            setSendingOtp(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <h1 className="text-center font-bold text-2xl text-teal-700 pb-2">Seller Login</h1>
            <p className="text-center text-sm text-gray-500 mb-6">
                Access your Black Mason Seller Dashboard
            </p>

            {statusMessage && (
                <Alert
                    severity={statusMessage.type === "info" ? "info" : statusMessage.type}
                    onClose={() => setStatusMessage(null)}
                    className="mb-4"
                >
                    {statusMessage.text}
                </Alert>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <TextField
                    fullWidth
                    name="email"
                    label="Registered Business Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    disabled={formik.isSubmitting}
                />

                {!loginWithOtp && (
                    <TextField
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        disabled={formik.isSubmitting}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                )}

                {loginWithOtp && (
                    <div className="space-y-2">
                        <div className="flex gap-2 items-start">
                            <TextField
                                fullWidth
                                name="otp"
                                label="Enter 6-digit OTP"
                                value={formik.values.otp}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.otp && Boolean(formik.errors.otp)}
                                helperText={formik.touched.otp && formik.errors.otp}
                                disabled={formik.isSubmitting || !otpSent}
                            />
                            <Button
                                variant="outlined"
                                onClick={handleSendOtp}
                                disabled={sendingOtp || formik.isSubmitting}
                                sx={{
                                    height: "56px",
                                    minWidth: "120px",
                                    borderColor: "#00897b",
                                    color: "#00897b",
                                    "&:hover": { borderColor: "#00695c", backgroundColor: "#e0f2f1" },
                                }}
                            >
                                {sendingOtp ? (
                                    <CircularProgress size={20} color="inherit" />
                                ) : otpSent ? (
                                    "Resend OTP"
                                ) : (
                                    "Send OTP"
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center text-sm pt-1">
                    <button
                        type="button"
                        onClick={() => {
                            setLoginWithOtp(!loginWithOtp);
                            setStatusMessage(null);
                        }}
                        className="text-teal-700 hover:text-teal-900 font-medium underline cursor-pointer bg-transparent border-none p-0"
                    >
                        {loginWithOtp ? "Login with Password instead" : "Login with OTP instead"}
                    </button>
                </div>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={formik.isSubmitting || (loginWithOtp && !otpSent)}
                    sx={{
                        py: "12px",
                        backgroundColor: "#00897b",
                        "&:hover": { backgroundColor: "#00695c" },
                        fontSize: "0.95rem",
                        fontWeight: 600,
                    }}
                >
                    {formik.isSubmitting ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        "Login as Seller"
                    )}
                </Button>
            </form>
        </div>
    );
};

export default SellerLoginForm;

import React, { useState } from "react";
import { Alert, Button, CircularProgress, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { sendLoginSignUpOtp } from "../../../State/AuthSlice";
import { sellerLogin } from "../../../State/seller/sellerAuthSlice";

interface SellerLoginFormProps {
    onToggleRegister?: () => void;
}

const SellerLoginForm: React.FC<SellerLoginFormProps> = ({ onToggleRegister }) => {
    const [loginWithOtp, setLoginWithOtp] = useState(true);
    const [localOtpSent, setLocalOtpSent] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const authState = useAppSelector((state) => state.auth);
    const sellerAuthState = useAppSelector((state) => state.sellerAuth);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            otp: "",
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
            console.log("form data SellerLoginForm: ", values);
            try {
                const res = await dispatch(
                    sellerLogin({
                        email: values.email.trim(),
                        otp: values.otp.trim(),
                    })
                ).unwrap();

                console.log("Seller login success: ", res);
                setStatusMessage({ type: "success", text: "Login Successful! Redirecting..." });
                setTimeout(() => {
                    navigate("/seller");
                }, 1000);
            } catch (err: any) {
                console.error("Seller login error: ", err);
                const errorText =
                    typeof err === "string"
                        ? err
                        : err?.message || "Login failed. Please check your OTP and try again.";
                setStatusMessage({ type: "error", text: errorText });
            }
        },
    });

    const handleSendOtp = async () => {
        setStatusMessage(null);
        formik.setFieldTouched("email", true);
        const emailErrors = await formik.validateField("email");

        if (!formik.values.email || emailErrors) {
            return;
        }

        try {
            // For seller sign-in, backend expects signing_ prefix and ROLE_SELLER
            const emailToSend = "signing_" + formik.values.email.trim();
            const res = await dispatch(
                sendLoginSignUpOtp({
                    email: emailToSend,
                    role: "ROLE_SELLER",
                })
            ).unwrap();

            console.log("OTP Sent Result: ", res);
            setLocalOtpSent(true);
            setStatusMessage({
                type: "success",
                text: `OTP sent successfully to ${formik.values.email}! Please check your inbox.`,
            });
        } catch (err: any) {
            console.error("Send OTP Error: ", err);
            const errorText =
                typeof err === "string"
                    ? err
                    : err?.message || "Failed to send OTP. Please make sure your seller account exists.";
            setStatusMessage({ type: "error", text: errorText });
        }
    };

    const isSendingOtp = authState.loading;
    const isLoggingIn = sellerAuthState.loading;

    return (
        <form onSubmit={formik.handleSubmit} noValidate className="space-y-5">
            <h2 className="text-xl font-bold text-center text-[#00897b] tracking-wide">
                Login As Seller
            </h2>

            {statusMessage && (
                <Alert
                    severity={statusMessage.type}
                    onClose={() => setStatusMessage(null)}
                    sx={{ fontSize: "0.85rem" }}
                >
                    {statusMessage.text}
                </Alert>
            )}

            <div className="space-y-4">
                {/* Email Field */}
                <div>
                    <TextField
                        fullWidth
                        name="email"
                        label="Email"
                        placeholder="Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "4px",
                                bgcolor: "#fff",
                            },
                        }}
                    />
                </div>

                {/* OTP Field matching Screenshot 1 */}
                {loginWithOtp ? (
                    <div className="space-y-2">
                        <p className="text-xs text-gray-600">Enter OTP sent to your email</p>
                        <TextField
                            fullWidth
                            name="otp"
                            label="Otp"
                            placeholder="Otp"
                            value={formik.values.otp}
                            onChange={(e) => {
                                const onlyDigits = e.target.value.replace(/\D/g, "");
                                formik.setFieldValue("otp", onlyDigits.slice(0, 6));
                            }}
                            onBlur={formik.handleBlur}
                            error={formik.touched.otp && Boolean(formik.errors.otp)}
                            helperText={formik.touched.otp && formik.errors.otp}
                            slotProps={{
                                htmlInput: { maxLength: 6, inputMode: "numeric" },
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "4px",
                                    bgcolor: "#fff",
                                },
                            }}
                        />
                    </div>
                ) : (
                    <div>
                        <TextField
                            fullWidth
                            type="password"
                            name="password"
                            label="Password"
                            placeholder="Password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "4px",
                                    bgcolor: "#fff",
                                },
                            }}
                        />
                    </div>
                )}
            </div>

            {/* SEND OTP BUTTON matching Screenshot 1 */}
            {loginWithOtp && (
                <Button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp}
                    variant="contained"
                    fullWidth
                    sx={{
                        bgcolor: "#00897b",
                        color: "#fff",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        py: 1.2,
                        borderRadius: "4px",
                        boxShadow: "none",
                        letterSpacing: "0.05em",
                        "&:hover": { bgcolor: "#00695c", boxShadow: "none" },
                    }}
                >
                    {isSendingOtp ? (
                        <div className="flex items-center gap-2">
                            <CircularProgress size={20} color="inherit" />
                            <span>Sending OTP...</span>
                        </div>
                    ) : (
                        "Send OTP"
                    )}
                </Button>
            )}

            {/* LOGIN BUTTON matching Screenshot 1 */}
            <Button
                type="submit"
                disabled={isLoggingIn}
                variant="contained"
                fullWidth
                sx={{
                    bgcolor: "#00897b",
                    color: "#fff",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    py: 1.2,
                    borderRadius: "4px",
                    boxShadow: "none",
                    letterSpacing: "0.05em",
                    "&:hover": { bgcolor: "#00695c", boxShadow: "none" },
                }}
            >
                {isLoggingIn ? (
                    <div className="flex items-center gap-2">
                        <CircularProgress size={20} color="inherit" />
                        <span>Logging In...</span>
                    </div>
                ) : (
                    "Login"
                )}
            </Button>

            {/* Optional Password / OTP toggle */}
            <div className="text-center">
                <button
                    type="button"
                    onClick={() => {
                        setLoginWithOtp(!loginWithOtp);
                        setStatusMessage(null);
                    }}
                    className="text-xs text-[#00897b] hover:underline"
                >
                    {loginWithOtp ? "Login with password instead" : "Login with OTP instead"}
                </button>
            </div>

            {/* Bottom Register Switch matching Screenshot 1 */}
            <div className="pt-2 text-center space-y-2">
                <p className="text-xs text-gray-600">have account</p>
                <Button
                    onClick={onToggleRegister}
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
                    Register
                </Button>
            </div>
        </form>
    );
};

export default SellerLoginForm;

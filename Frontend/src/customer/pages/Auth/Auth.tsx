import React, { useState } from "react";
import { Alert, Box, Button, CircularProgress, Modal, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { sendLoginSignUpOtp, signin, signup } from "../../../State/AuthSlice";

interface AuthProps {
    open?: boolean;
    handleClose?: () => void;
}

const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 420 },
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    outline: "none",
};

const Auth: React.FC<AuthProps> = ({ open = true, handleClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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
            fullName: isLogin
                ? Yup.string()
                : Yup.string().required("Full name is required"),
            otp: Yup.string()
                .length(6, "OTP must be 6 digits")
                .required("OTP is required"),
        }),
        onSubmit: async (values) => {
            setStatusMessage(null);
            try {
                if (isLogin) {
                    await dispatch(
                        signin({
                            email: values.email.trim(),
                            otp: values.otp.trim(),
                        })
                    ).unwrap();
                    setStatusMessage({ type: "success", text: "Login Successful!" });
                } else {
                    await dispatch(
                        signup({
                            email: values.email.trim(),
                            fullName: values.fullName.trim(),
                            otp: values.otp.trim(),
                        })
                    ).unwrap();
                    setStatusMessage({ type: "success", text: "Registration Successful!" });
                }
                if (handleClose) {
                    setTimeout(handleClose, 1200);
                }
            } catch (err: any) {
                console.error("Auth submit error: ", err);
                const msg =
                    typeof err === "string"
                        ? err
                        : err?.message || "Authentication failed. Please check OTP.";
                setStatusMessage({ type: "error", text: msg });
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
            // If logging in, prefix with signing_ for existing customer verification; if registering, plain email
            const emailToSend = isLogin ? "signing_" + formik.values.email.trim() : formik.values.email.trim();
            await dispatch(
                sendLoginSignUpOtp({
                    email: emailToSend,
                    role: "ROLE_CUSTOMER",
                })
            ).unwrap();

            setStatusMessage({
                type: "success",
                text: `OTP sent successfully to ${formik.values.email}!`,
            });
        } catch (err: any) {
            console.error("Auth send OTP error: ", err);
            const msg =
                typeof err === "string"
                    ? err
                    : err?.message || "Failed to send OTP.";
            setStatusMessage({ type: "error", text: msg });
        }
    };

    const content = (
        <Box sx={handleClose ? modalStyle : { maxWidth: 420, mx: "auto", p: 4 }}>
            <h2 className="text-xl font-bold text-center text-[#00897b] mb-4 tracking-wide">
                {isLogin ? "Customer Login" : "Customer Register"}
            </h2>

            {statusMessage && (
                <Alert
                    severity={statusMessage.type}
                    onClose={() => setStatusMessage(null)}
                    sx={{ mb: 2, fontSize: "0.85rem" }}
                >
                    {statusMessage.text}
                </Alert>
            )}

            <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
                {!isLogin && (
                    <TextField
                        fullWidth
                        name="fullName"
                        label="Full Name"
                        placeholder="Full Name"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                        helperText={formik.touched.fullName && formik.errors.fullName}
                    />
                )}

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
                />

                <div className="space-y-1">
                    <TextField
                        fullWidth
                        name="otp"
                        label="Enter OTP"
                        placeholder="6-digit OTP"
                        value={formik.values.otp}
                        onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "");
                            formik.setFieldValue("otp", digits.slice(0, 6));
                        }}
                        onBlur={formik.handleBlur}
                        error={formik.touched.otp && Boolean(formik.errors.otp)}
                        helperText={formik.touched.otp && formik.errors.otp}
                        slotProps={{
                            htmlInput: { maxLength: 6, inputMode: "numeric" },
                        }}
                    />
                </div>

                <Button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={authState.loading}
                    variant="contained"
                    fullWidth
                    sx={{
                        bgcolor: "#00897b",
                        color: "#fff",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        py: 1,
                        "&:hover": { bgcolor: "#00695c" },
                    }}
                >
                    {authState.loading ? (
                        <div className="flex items-center gap-2">
                            <CircularProgress size={18} color="inherit" />
                            <span>Sending OTP...</span>
                        </div>
                    ) : (
                        "Send OTP"
                    )}
                </Button>

                <Button
                    type="submit"
                    disabled={authState.loading}
                    variant="contained"
                    fullWidth
                    sx={{
                        bgcolor: "#00897b",
                        color: "#fff",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        py: 1,
                        "&:hover": { bgcolor: "#00695c" },
                    }}
                >
                    {isLogin ? "Login" : "Register"}
                </Button>

                <div className="text-center pt-2">
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setStatusMessage(null);
                        }}
                        className="text-xs text-[#00897b] font-semibold hover:underline"
                    >
                        {isLogin
                            ? "Don't have an account? Register"
                            : "Already have an account? Login"}
                    </button>
                </div>
            </form>
        </Box>
    );

    if (handleClose) {
        return (
            <Modal open={open} onClose={handleClose}>
                {content}
            </Modal>
        );
    }

    return content;
};

export default Auth;
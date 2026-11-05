import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useAppDispatch } from "../../../State/Store";
import { sendLoginSignupOtp, signup } from "../../../State/AuthSlice";

interface RegisterFormProps {
    onToggleLogin?: () => void;
    onSuccess?: () => void;
}

const RegisterForm = ({ onToggleLogin, onSuccess }: RegisterFormProps) => {
    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: {
            email: "",
            otp: "",
            fullName: "",
        },
        onSubmit: async (values) => {
            try {
                await dispatch(signup(values)).unwrap();
                if (onSuccess) onSuccess();
            } catch (e) {
                // error handled in slice
            }
        },
    });

    const handleSendOtp = () => {
        if (!formik.values.email) return;
        dispatch(sendLoginSignupOtp({ email: formik.values.email }));
    };

    return (
        <div>
            <h1 className="text-center font-bold text-xl text-primary-color pb-8">Signup</h1>
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

                <div className="flex gap-4">
                    <Button
                        onClick={handleSendOtp}
                        fullWidth
                        variant="outlined"
                        sx={{ py: "11px" }}
                    >
                        Send OTP
                    </Button>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ py: "11px" }}
                    >
                        Signup
                    </Button>
                </div>

                {onToggleLogin && (
                    <div className="text-center pt-2">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={onToggleLogin}
                                className="text-teal-700 font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
                            >
                                Login here
                            </button>
                        </p>
                    </div>
                )}
            </form>
        </div>
    );
};

export default RegisterForm;

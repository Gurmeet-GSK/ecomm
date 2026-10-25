import React, { useState } from "react";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthProps {
    open?: boolean;
    handleClose?: () => void;
}

const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 440 },
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    outline: "none",
};

const Auth: React.FC<AuthProps> = ({ open = true, handleClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleModalClose = () => {
        if (handleClose) {
            handleClose();
        } else {
            navigate("/");
        }
    };

    const handleAuthSuccess = () => {
        if (handleClose) {
            handleClose();
        } else {
            navigate("/");
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleModalClose}
            aria-labelledby="auth-modal-title"
        >
            <Box sx={modalStyle}>
                <div className="flex justify-end">
                    <IconButton onClick={handleModalClose} size="small" aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </div>

                {isLogin ? (
                    <LoginForm
                        onToggleRegister={() => setIsLogin(false)}
                        onSuccess={handleAuthSuccess}
                    />
                ) : (
                    <RegisterForm
                        onToggleLogin={() => setIsLogin(true)}
                        onSuccess={handleAuthSuccess}
                    />
                )}
            </Box>
        </Modal>
    );
};

export default Auth;
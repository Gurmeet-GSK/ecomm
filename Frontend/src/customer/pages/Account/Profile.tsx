import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { teal } from "@mui/material/colors";
import { EditOutlined, SaveOutlined } from "@mui/icons-material";

const Profile: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: "Ashok Singh",
        email: "ashok.singh@example.com",
        mobile: "+91 90233 79136",
        gender: "Male",
        dob: "1998-05-15",
    });

    const handleSave = () => {
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                        Profile Information
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Manage your personal details and account settings
                    </p>
                </div>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={isEditing ? <SaveOutlined fontSize="small" /> : <EditOutlined fontSize="small" />}
                    onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                    sx={{
                        color: teal[700],
                        borderColor: teal[600],
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        borderRadius: "8px",
                        textTransform: "uppercase",
                        px: 2,
                        "&:hover": { borderColor: teal[800], bgcolor: "rgba(13, 148, 136, 0.05)" },
                    }}
                >
                    {isEditing ? "Save Details" : "Edit Profile"}
                </Button>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-xs space-y-5">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-teal-50 border-2 border-teal-200 flex items-center justify-center text-teal-700 font-bold text-xl">
                        {profile.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">{profile.name}</h3>
                        <p className="text-xs text-gray-500">{profile.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <TextField
                        label="Full Name"
                        size="small"
                        disabled={!isEditing}
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="Email Address"
                        size="small"
                        disabled={!isEditing}
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="Mobile Number"
                        size="small"
                        disabled={!isEditing}
                        value={profile.mobile}
                        onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="Gender"
                        size="small"
                        disabled={!isEditing}
                        value={profile.gender}
                        onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                        fullWidth
                    />
                </div>
            </div>
        </div>
    );
};

export default Profile;

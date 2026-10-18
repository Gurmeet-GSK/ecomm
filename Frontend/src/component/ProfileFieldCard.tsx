import React from 'react';
import { Divider } from '@mui/material';

interface ProfileFieldCardProps {
    keys: string;
    value: string;
}

const ProfileFieldCard: React.FC<ProfileFieldCardProps> = ({ keys, value }) => {
    return (
        <div className="p-4 bg-white border border-gray-200 rounded-md">
            <div className="flex items-center">
                <p className="w-24 lg:w-36 text-sm text-gray-500 font-medium">
                    {keys}
                </p>
                <Divider orientation="vertical" flexItem className="mx-4" />
                <p className="text-sm font-semibold text-gray-800">
                    {value}
                </p>
            </div>
        </div>
    );
};

export default ProfileFieldCard;
    
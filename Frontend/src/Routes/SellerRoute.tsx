import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../State/Store';

const SellerRoute: React.FC = () => {
    const isSellerLoggedIn = useAppSelector((state) => state.sellerAuth.isSellerLoggedIn);
    const sellerJwt = localStorage.getItem('seller_jwt') || localStorage.getItem('jwt');
    const role = localStorage.getItem('role');

    const isAuthenticatedSeller = Boolean(isSellerLoggedIn || (sellerJwt && role === 'ROLE_SELLER'));

    if (!isAuthenticatedSeller) {
        return <Navigate to="/become-seller" replace />;
    }

    return <Outlet />;
};

export default SellerRoute;


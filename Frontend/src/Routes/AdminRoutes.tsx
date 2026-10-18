
import {Routes, Route} from "react-router-dom";
import SellerTable from "../admin/Pages/Sellers/SellersTable";
import Coupon from "../admin/Pages/Coupon/Coupon";
import AddNewCoupon from "../admin/Pages/Coupon/AddNewCoupon";
import GridTable from "../admin/Pages/HomePage/GridTable";
import Deal from "../admin/Pages/HomePage/Deal";
import ShopByCategory from "../admin/Pages/HomePage/ShopByCategoryTable";
import ElectronicsTable from "../admin/Pages/HomePage/ElectronicsTable";

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<SellerTable/>}/>
            <Route path="/coupon" element={<Coupon/>}/>
            <Route path="/add-coupon" element={<AddNewCoupon/>}/>
            <Route path="/home-grid-table" element={<GridTable/>}/>
            <Route path="/deals" element={<Deal/>}/>
            <Route path="/shop-by-category" element={<ShopByCategory/>}/>
            <Route path="/electronics-category" element={<ElectronicsTable/>}/>
        </Routes>
    )
}   

export default AdminRoutes;
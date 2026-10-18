package com.priyanshu.service;

import com.priyanshu.modal.Cart;
import com.priyanshu.modal.Coupon;
import com.priyanshu.modal.User;

import java.util.List;

public interface CouponService {

    Cart applyCoupon(String code, double orderValue, User user) throws Exception;
    Cart removeCoupon(String code, User user) throws Exception;
    Coupon findCouponById(Long id) throws Exception;
    Coupon createCoupon(Coupon coupon);
    List<Coupon> findAllCoupons();
    void deleteCoupon(long id) throws Exception;
}

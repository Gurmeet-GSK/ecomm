package com.priyanshu.service;

import com.priyanshu.modal.Seller;
import com.priyanshu.modal.SellerReport;

public interface SellerReportService {

    SellerReport getSellerReport(Seller seller);
    SellerReport updateSellerReport(SellerReport sellerReport);
}

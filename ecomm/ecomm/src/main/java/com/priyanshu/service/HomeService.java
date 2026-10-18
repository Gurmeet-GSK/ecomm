package com.priyanshu.service;

import com.priyanshu.modal.Home;
import com.priyanshu.modal.HomeCategory;

import java.util.List;

public interface HomeService {
    public Home createHomePageData(List<HomeCategory> allCategories);
}

package com.priyanshu.service;

import com.priyanshu.modal.Order;
import com.priyanshu.modal.Seller;
import com.priyanshu.modal.Transaction;

import java.util.List;

public interface TransactionService {

    Transaction createTransaction(Order order);
    List<Transaction> getTransactionBySellerId(Seller seller);
    List<Transaction> getAllTransaction();
}

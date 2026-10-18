package com.priyanshu.controller;

import com.priyanshu.domain.AccountStatus;
import com.priyanshu.modal.Seller;
import com.priyanshu.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AdminController {

    private final SellerService sellerService;

    @PatchMapping("/seller/{id}/status/{status}")
    public ResponseEntity<Seller> updatesSellerStatus(
            @PathVariable Long id,
            @PathVariable AccountStatus status) throws Exception {

        Seller updatesSeller = sellerService.updateSellerAccountStatus(id, status);
        return ResponseEntity.ok(updatesSeller);
    }
}

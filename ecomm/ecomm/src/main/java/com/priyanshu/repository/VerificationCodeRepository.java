package com.priyanshu.repository;

import com.priyanshu.modal.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {

    VerificationCode findByEmail(String email);
    VerificationCode findByOtp(String otp);
}

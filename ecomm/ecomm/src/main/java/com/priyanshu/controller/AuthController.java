package com.priyanshu.controller;

import com.priyanshu.domain.USER_ROLE;
import com.priyanshu.modal.VerificationCode;
import com.priyanshu.repository.UserRepository;
import com.priyanshu.request.LoginOtpRequest;
import com.priyanshu.request.LoginRequest;
import com.priyanshu.response.ApiResponse;
import com.priyanshu.response.AuthResponse;
import com.priyanshu.response.SignupRequest;
import com.priyanshu.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createdUserHandler(@RequestBody SignupRequest req) throws Exception {

        String jwt = authService.createUser(req);
        AuthResponse res = new AuthResponse();
        res.setJwt(jwt);
        res.setMessage("register success");
        res.setRole(USER_ROLE.ROLE_CUSTOMER);

        return ResponseEntity.ok(res);
    }

    @PostMapping("/sent/login-signup-otp")
    public ResponseEntity<ApiResponse> sentOtpHandler(@RequestBody LoginOtpRequest req) throws Exception {

        authService.sentLoginOtp(req.getEmail(), req.getRole());
        ApiResponse res = new ApiResponse();

        res.setMessage("OTP sent successfully");

        return ResponseEntity.ok(res);
    }

    @PostMapping({"/signing", "/signin"})
    public ResponseEntity<AuthResponse> loginHandler(@RequestBody LoginRequest req) throws Exception {

        AuthResponse authResponse = authService.signing(req);

        return ResponseEntity.ok(authResponse);
    }

    @PostMapping({"/seller/login", "/seller-login"})
    public ResponseEntity<AuthResponse> sellerLoginHandler(@RequestBody LoginRequest req) throws Exception {
        String email = req.getEmail();
        if (email != null && !email.startsWith("seller_")) {
            req.setEmail("seller_" + email);
        }
        AuthResponse authResponse = authService.signing(req);
        return ResponseEntity.ok(authResponse);
    }
}

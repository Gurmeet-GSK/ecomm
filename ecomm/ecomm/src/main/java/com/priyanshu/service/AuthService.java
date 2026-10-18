package com.priyanshu.service;

import com.priyanshu.domain.USER_ROLE;
import com.priyanshu.request.LoginRequest;
import com.priyanshu.response.AuthResponse;
import com.priyanshu.response.SignupRequest;

public interface AuthService {

    void sentLoginOtp(String email, USER_ROLE role) throws Exception;

    String createUser(SignupRequest req) throws Exception;

    AuthResponse signing(LoginRequest req) throws Exception;
}

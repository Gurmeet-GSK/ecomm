package com.priyanshu.controller;

import com.priyanshu.config.JwtProvider;
import com.priyanshu.modal.User;
import com.priyanshu.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final JwtProvider jwtProvider;

    @GetMapping("/api/users/profile")
    public ResponseEntity<User> getUserProfileHandler(@RequestHeader("Authorization") String jwt) throws Exception {
        System.out.println("user profile handler reached");
        System.out.println("user profile handler jwt: " + jwt);
        User user = userService.findUserByJwtToken(jwt);
        System.out.println("user profile handler user: " + user);
        return ResponseEntity.ok(user);
    }
}

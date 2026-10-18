package com.priyanshu.service.impl;

import com.priyanshu.config.JwtProvider;
import com.priyanshu.domain.USER_ROLE;
import com.priyanshu.modal.Cart;
import com.priyanshu.modal.Seller;
import com.priyanshu.modal.User;
import com.priyanshu.modal.VerificationCode;
import com.priyanshu.repository.CartRepository;
import com.priyanshu.repository.SellerRepository;
import com.priyanshu.repository.UserRepository;
import com.priyanshu.repository.VerificationCodeRepository;
import com.priyanshu.request.LoginRequest;
import com.priyanshu.response.AuthResponse;
import com.priyanshu.response.SignupRequest;
import com.priyanshu.service.AuthService;
import com.priyanshu.service.EmailService;
import com.priyanshu.utils.OtpUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CartRepository cartRepository;
    private final JwtProvider jwtProvider;
    private final VerificationCodeRepository verificationCodeRepository;
    private final EmailService emailService;
    private final CustomUserServiceImpl customUserService;
    private final SellerRepository sellerRepository;

    @Override
    public void sentLoginOtp(String email, USER_ROLE role) throws Exception {
        String SIGNING_PREFIX = "signing_";

        if(email.startsWith(SIGNING_PREFIX)){
            email=email.substring(SIGNING_PREFIX.length());

            if(USER_ROLE.ROLE_SELLER.equals(role)){
                Seller seller = sellerRepository.findByEmail(email);
                if(seller == null){
                    throw new Exception("Seller not found with provided email");
                }
            }
            else if(USER_ROLE.ROLE_CUSTOMER.equals(role)){
                System.out.println("email: "+email);
                User user = userRepository.findByEmail(email);
                if(user==null){
                    throw new Exception("User not exist with provided email");
                }
            }
            else{
                // If role was not explicitly passed, check both seller and user
                Seller seller = sellerRepository.findByEmail(email);
                User user = userRepository.findByEmail(email);
                if(seller == null && user == null){
                    throw new Exception("User or seller does not exist with provided email");
                }
            }
        }

        VerificationCode isExist = verificationCodeRepository.findByEmail(email);

        if(isExist!=null){
            verificationCodeRepository.delete(isExist);
        }

        String otp = OtpUtil.generateOtp();

        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setOtp(otp);
        verificationCode.setEmail(email);
        verificationCodeRepository.save(verificationCode);

        String subject = "ShopZen login/signup OTP";
        String text = "Your login/signup OTP is: "+otp;

        emailService.sendVerificationOtpEmail(email, otp, subject, text);
    }

    @Override
    public String createUser(SignupRequest req) throws Exception {

        VerificationCode verificationCode = verificationCodeRepository.findByEmail(req.getEmail());
        if(verificationCode == null || !verificationCode.getOtp().equals(req.getOtp())){
            throw new Exception("Wrong OTP...");
        }

        User user = userRepository.findByEmail(req.getEmail());

        if(user==null){
            User createdUser = new User();
            createdUser.setEmail(req.getEmail());
            createdUser.setFullName(req.getFullName());
            createdUser.setRole(USER_ROLE.ROLE_CUSTOMER);
            createdUser.setMobile("1234567890");
            createdUser.setPassword(passwordEncoder.encode(req.getOtp()));

            user = userRepository.save(createdUser);

            Cart cart = new Cart();
            cart.setUser(user);
            cartRepository.save(cart);
        }

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(USER_ROLE.ROLE_CUSTOMER.toString()));

        Authentication authentication = new UsernamePasswordAuthenticationToken(req.getEmail(), null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return jwtProvider.generateToken(authentication);
    }

    @Override
    public AuthResponse signing(LoginRequest req) throws Exception {
        String username = req.getEmail();
        String otp = req.getOtp();

        Authentication authentication = authenticate(username, otp);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(token);
        authResponse.setMessage("Login success");

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String roleName = authorities.isEmpty()?null:authorities.iterator().next().getAuthority();

        authResponse.setRole(USER_ROLE.valueOf(roleName));
        return authResponse;
    }

    private Authentication authenticate(String username, String otp) throws Exception {
        UserDetails userDetails = customUserService.loadUserByUsername(username);

        String SELLER_PREFIX="seller_";
        if(username.startsWith(SELLER_PREFIX)){
            username = username.substring(SELLER_PREFIX.length());
        }

        if(userDetails == null){
            throw new BadCredentialsException("Invalid username");
        }

        VerificationCode verificationCode = verificationCodeRepository.findByEmail(username);

        if(verificationCode == null || !verificationCode.getOtp().equals(otp)){
            throw new Exception("Wrong OTP");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}

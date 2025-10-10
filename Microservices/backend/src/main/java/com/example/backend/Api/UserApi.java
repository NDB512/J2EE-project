package com.example.backend.Api;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Dto.AuthResponse;
import com.example.backend.Dto.UserDto;
import com.example.backend.Exception.BeException;
import com.example.backend.Services.UserService;
import com.example.backend.Utilities.JwtUtil;

@RestController
@RequestMapping("/user")
@Validated
public class UserApi {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@RequestBody UserDto userDto) throws BeException {
        // Set default name nếu chưa có (từ email?)
        if (userDto.getName() == null || userDto.getName().trim().isEmpty()) {
            userDto.setName(userDto.getEmail().split("@")[0]);  // Tạo name từ email prefix
        }
        userService.registerUser(userDto);

        UserDetails userDetails = userService.loadUserByUsername(userDto.getEmail());
        String accessToken = jwtUtil.generateAccessToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@RequestBody UserDto userDto) throws BeException {
        AuthResponse loggedInUser = userService.loginUser(userDto);
        return new ResponseEntity<>(loggedInUser, HttpStatus.OK);
    }

    @PostMapping("/login/google")
    public ResponseEntity<AuthResponse> loginGoogle(@RequestBody Map<String, String> request) throws BeException {
        String idToken = request.get("idToken");
        if (idToken == null || idToken.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        AuthResponse auth = userService.googleLogin(idToken);
        return new ResponseEntity<>(auth, HttpStatus.OK);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody Map<String, String> request) {
        try {
            String refreshToken = request.get("refreshToken");
            if (refreshToken == null || refreshToken.isEmpty()) {
                throw new BeException("Refresh token is required");
            }

            String username = jwtUtil.extractUsername(refreshToken);
            if (username == null) {
                throw new BeException("Invalid refresh token");
            }

            // Validate refresh token
            UserDetails userDetails = userService.loadUserByUsername(username);
            if (!jwtUtil.validateToken(refreshToken, userDetails)) {
                throw new BeException("Invalid or expired refresh token");
            }

            // Generate new tokens
            String newAccessToken = jwtUtil.generateAccessToken(userDetails);
            String newRefreshToken = jwtUtil.generateRefreshToken(userDetails);

            return ResponseEntity.ok(new AuthResponse(newAccessToken, newRefreshToken));
        } catch (BeException e) {
            throw e;
        } catch (Exception e) {
            throw new BeException("Refresh failed: " + e.getMessage());
        }
    }
}
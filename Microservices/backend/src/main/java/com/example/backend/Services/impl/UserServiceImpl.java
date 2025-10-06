package com.example.backend.Services.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.example.backend.Dto.AuthResponse;
import com.example.backend.Dto.Roles;
import com.example.backend.Dto.UserDto;
import com.example.backend.Exception.BeException;
import com.example.backend.Models.User;
import com.example.backend.Repositories.UserRepository;
import com.example.backend.Services.UserService;
import com.example.backend.Utilities.JwtUtil;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    @Transactional
    public void registerUser(UserDto userDto) throws BeException {
        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new BeException("User already exists");
        }
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
        userRepository.save(userDto.toEntity());
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse loginUser(UserDto userDto) throws BeException {
        User user = userRepository.findByEmail(userDto.getEmail())
                .orElseThrow(() -> new BeException("User not found"));

        if (!passwordEncoder.matches(userDto.getPassword(), user.getPassword())) {
            throw new BeException("Invalid credentials");
        }

        UserDetails userDetails = loadUserByUsername(user.getEmail()); // Reuse loadUserByUsername
        String accessToken = jwtUtil.generateAccessToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        UserDto dto = new UserDto(user.getId(), user.getName(), user.getEmail(), null, user.getRole());
        return new AuthResponse(accessToken, refreshToken, dto);
    }

    @Override
    @Transactional
    public AuthResponse googleLogin(String idToken) throws BeException {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + idToken;
        Map<String, Object> profile = restTemplate.getForObject(url, Map.class);

        if (profile == null || profile.containsKey("error")) {
            throw new BeException("Invalid Google token");
        }

        String email = (String) profile.get("email");
        String name = (String) profile.get("name");

        if (email == null || name == null) {
            throw new BeException("Invalid user info from Google");
        }

        User user = userRepository.findByEmail(email)
                .map(u -> {
                    u.setName(name);
                    return userRepository.save(u);
                })
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setName(name);
                    newUser.setEmail(email);
                    newUser.setPassword("{noop}dummy-google-pass"); // Dummy cho consistency
                    newUser.setRole(Roles.User);
                    newUser.setProvider(User.AuthProvider.GOOGLE);
                    return userRepository.save(newUser);
                });

        UserDetails userDetails = loadUserByUsername(user.getEmail());
        String accessToken = jwtUtil.generateAccessToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        UserDto dto = new UserDto(user.getId(), user.getName(), user.getEmail(), null, user.getRole());
        return new AuthResponse(accessToken, refreshToken, dto);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        return new org.springframework.security.core.userdetails.User(
            user.getEmail(), 
            user.getPassword() != null ? user.getPassword() : "{noop}dummy", // Handle null
            List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + user.getRole())));
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BeException("User not found"));
        return new UserDto(user.getId(), user.getName(), user.getEmail(), null, user.getRole());
    }

    @Override
    @Transactional
    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BeException("User not found"));
        
        if (userDto.getEmail() != null && !userDto.getEmail().equals(user.getEmail())) {
            if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
                throw new BeException("Email already in use");
            }
            user.setEmail(userDto.getEmail());
        }
        
        if (userDto.getName() != null) user.setName(userDto.getName());
        if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }
        if (userDto.getRole() != null) user.setRole(userDto.getRole());
        
        userRepository.save(user);
        return new UserDto(user.getId(), user.getName(), user.getEmail(), null, user.getRole());
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserByEmail(String email) throws BeException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BeException("User not found"));
        return new UserDto(user.getId(), user.getName(), user.getEmail(), null, user.getRole());
    }
}
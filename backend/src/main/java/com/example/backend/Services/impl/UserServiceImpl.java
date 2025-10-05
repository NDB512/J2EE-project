package com.example.backend.Services.impl;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.backend.Dto.Roles;
import com.example.backend.Dto.UserDto;
import com.example.backend.Exception.BeException;
import com.example.backend.Models.User;
import com.example.backend.Models.User.AuthProvider;
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
    public void registerUser(UserDto userDto) throws BeException {
        Optional<User> opt = userRepository.findByEmail(userDto.getEmail());
        if(opt.isPresent()) {
            throw new BeException("User already exists");
        }
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
        userRepository.save(userDto.toEntity());
    }

    @Override
    public UserDto loginUser(UserDto userDto) throws BeException {
        User user = userRepository.findByEmail(userDto.getEmail())
                .orElseThrow(() -> new BeException("User not found"));
        if (!passwordEncoder.matches(userDto.getPassword(), user.getPassword())) {
            throw new BeException("Invalid credentials");
        }
        String token = jwtUtil.generateToken(new org.springframework.security.core.userdetails.User(
            user.getEmail(), user.getPassword(), List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + user.getRole()))));
        return new UserDto(user.getId(), user.getName(), user.getEmail(), token, user.getRole());
    }
    
    @Override
    public UserDto googleLogin(String idToken) throws BeException {
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

        Optional<User> opt = userRepository.findByEmail(email);
        User user;
        if (opt.isPresent()) {
            user = opt.get();
            // Update name nếu cần
            user.setName(name);
            userRepository.save(user);
        } else {
            // Register new user
            user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(null); // Không cần password cho social
            user.setRole(Roles.User); // Default role
            user.setProvider(AuthProvider.GOOGLE);
            user = userRepository.save(user);
        }

        String token = jwtUtil.generateToken(new org.springframework.security.core.userdetails.User(
            user.getEmail(), "", List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + user.getRole())))); // Password rỗng cho social
        return new UserDto(user.getId(), user.getName(), user.getEmail(), token, user.getRole());
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        return new org.springframework.security.core.userdetails.User(
            user.getEmail(), user.getPassword(), List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + user.getRole())));
    }

    @Override
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BeException("User not found"));
        return new UserDto(user.getId(), user.getName(), user.getEmail(), null, user.getRole());
    }

    @Override
    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BeException("User not found"));
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        if(userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }
        user.setRole(userDto.getRole());
        userRepository.save(user);
        return new UserDto(user.getId(), user.getName(), user.getEmail(), null, user.getRole());
    }
    
}

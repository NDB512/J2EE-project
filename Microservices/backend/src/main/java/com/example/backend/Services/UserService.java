package com.example.backend.Services;

import org.springframework.security.core.userdetails.UserDetails;

import com.example.backend.Dto.AuthResponse;
import com.example.backend.Dto.UserDto;
import com.example.backend.Exception.BeException;

public interface UserService {
    public void registerUser(UserDto userDto);
    public AuthResponse loginUser(UserDto userDto);
    public UserDto getUserById(Long id);
    public UserDto updateUser(Long id, UserDto userDto);
    public AuthResponse googleLogin(String idToken) throws BeException;
    UserDetails loadUserByUsername(String email);
    public UserDto getUserByEmail(String email) throws BeException;
}

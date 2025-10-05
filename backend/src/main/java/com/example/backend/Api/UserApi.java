package com.example.backend.Api;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Dto.ReponseDto;
import com.example.backend.Dto.UserDto;
import com.example.backend.Exception.BeException;
import com.example.backend.Services.UserService;

@RestController
@RequestMapping("/user")
@Validated
@CrossOrigin
public class UserApi {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ReponseDto> registerUser(@RequestBody UserDto userDto) throws BeException {
        userService.registerUser(userDto);
        return new ResponseEntity<>(new ReponseDto("Đăng ký user thành công"), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto> loginUser(@RequestBody UserDto userDto) throws BeException {
        UserDto loggedInUser = userService.loginUser(userDto);
        return new ResponseEntity<>(loggedInUser, HttpStatus.OK);
    }

    @PostMapping("/login/google")
    public ResponseEntity<UserDto> loginGoogle(@RequestBody Map<String, String> request) throws BeException {
        String idToken = request.get("idToken");
        if (idToken == null || idToken.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        UserDto userDto = userService.googleLogin(idToken);
        return new ResponseEntity<>(userDto, HttpStatus.OK);
    }
}

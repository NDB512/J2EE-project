package com.example.backend.Repositories;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.example.backend.Models.User;

public interface UserRepository extends CrudRepository<User, Long> {
    Optional<User> findByEmail(String email);
}

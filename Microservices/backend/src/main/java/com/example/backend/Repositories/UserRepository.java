package com.example.backend.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.example.backend.Dto.MonthRoleCountDto;
import com.example.backend.Dto.Roles;
import com.example.backend.Models.User;

public interface UserRepository extends CrudRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query(value = """
        SELECT 
            MONTHNAME(a.created_at) AS month,
            COUNT(a.id) AS count
        FROM users a
        WHERE a.role = :role
        AND YEAR(a.created_at) = YEAR(CURDATE())
        GROUP BY MONTH(a.created_at), MONTHNAME(a.created_at)
        ORDER BY MONTH(a.created_at)
    """, nativeQuery = true)
    List<MonthRoleCountDto> countRegistrationsByRoleGroupedByMonth(Roles role);
}

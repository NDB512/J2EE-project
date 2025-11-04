package com.example.profile.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.profile.Models.Family;

@Repository
public interface FamilyRepository extends JpaRepository<Family, Long> {

}
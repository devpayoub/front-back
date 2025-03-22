package com.example.thinktrend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.thinktrend.models.AppUser;

public interface AppUserRepository extends JpaRepository<AppUser, Integer> {

	Optional<AppUser> findByEmail(String email); // Corrected method name

	Optional<AppUser> findByusername(String username);

	Boolean existsByemail(String email);

	boolean existsByusername(String username);
}

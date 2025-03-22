package com.example.thinktrend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.thinktrend.models.AppUser;
import com.example.thinktrend.models.PasswordResetToken;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

	Optional<PasswordResetToken> findByToken(String token);

	void deleteByUser(AppUser user);
}
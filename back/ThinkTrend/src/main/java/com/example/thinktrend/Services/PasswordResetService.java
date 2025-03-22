package com.example.thinktrend.Services;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.thinktrend.models.AppUser;
import com.example.thinktrend.models.PasswordResetToken;
import com.example.thinktrend.repositories.AppUserRepository;
import com.example.thinktrend.repositories.PasswordResetTokenRepository;

@Service
public class PasswordResetService {

	@Autowired
	private AppUserRepository appUserRepository;

	@Autowired
	private PasswordResetTokenRepository passwordResetTokenRepository;

	@Autowired
	private JavaMailSender mailSender;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Transactional // Add this annotation
	public void createPasswordResetTokenForUser(AppUser user, String token) {
		// Delete existing token for the user (if any)
		passwordResetTokenRepository.deleteByUser(user);

		// Create new token
		PasswordResetToken resetToken = new PasswordResetToken();
		resetToken.setToken(token);
		resetToken.setUser(user);
		resetToken.setExpiryDate(calculateExpiryDate());
		passwordResetTokenRepository.save(resetToken);
	}

	public void sendPasswordResetEmail(String email, String token) {
		try {
			SimpleMailMessage mailMessage = new SimpleMailMessage();
			mailMessage.setFrom("cab-booking@libinjames.com");
			mailMessage.setTo(email);
			mailMessage.setSubject("Password Reset Request");
			mailMessage.setText("To reset your password, click the link below:\n"
					+ "http://localhost:8080/reset-password?token=" + token);
			mailSender.send(mailMessage);
			System.out.println("Password reset email sent successfully to: " + email);
		} catch (Exception e) {
			System.err.println("Failed to send password reset email: " + e.getMessage());
			throw new RuntimeException("Failed to send password reset email", e);
		}
	}

	public void sendVerificationEmail(String email, String code) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom("cab-booking@libinjames.com");
		message.setTo(email);
		message.setSubject("Email Verification Code");
		message.setText("Your verification code is: " + code);
		mailSender.send(message);
	}

	@Transactional
	public void resetPassword(String token, String newPassword) {
		PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
				.orElseThrow(() -> new RuntimeException("Invalid token"));

		// Check if the token has expired
		if (resetToken.getExpiryDate().before(new Date())) {
			throw new RuntimeException("Token has expired");
		}

		// Update the user's password
		AppUser user = resetToken.getUser();
		user.setPassword(passwordEncoder.encode(newPassword));
		appUserRepository.save(user);

		// Delete the token after use
		passwordResetTokenRepository.delete(resetToken);
	}

	private Date calculateExpiryDate() {
		long generateToken = 60 * 60 * 1000; // 1 hour
		return new Date(System.currentTimeMillis() + generateToken);
	}

}
package com.example.thinktrend.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.thinktrend.jwt.JwtUtils;
import com.example.thinktrend.models.AppUser;
import com.example.thinktrend.models.ERole;
import com.example.thinktrend.models.Role;
import com.example.thinktrend.Payload.JwtResponse;
import com.example.thinktrend.Payload.MessageResponse;
import com.example.thinktrend.Payload.request.LoginRequest;
import com.example.thinktrend.Payload.request.SignupRequest;
import com.example.thinktrend.Services.PasswordResetService;
import com.example.thinktrend.Services.UserDetailsImpl;
import com.example.thinktrend.repositories.AppUserRepository;
import com.example.thinktrend.repositories.RoleRepository;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	AppUserRepository appUserRepository;

	@Autowired
	RoleRepository roleRepository;

	@Autowired
	PasswordEncoder encoder;

	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	JwtUtils jwtUtils;

	@Autowired
	private PasswordResetService passwordResetService;

	@PostMapping("/signin")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtils.generateToken(authentication);

		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
		List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
				.collect(Collectors.toList());

		return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getEmail(), roles));
	}

	@PostMapping("/signup")
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {

		// Check if username exists
		if (appUserRepository.existsByusername(signUpRequest.getUsername())) {
			return ResponseEntity.badRequest().body("Error: Username is already taken!");
		}

		// Check if email exists
		if (appUserRepository.existsByemail(signUpRequest.getEmail())) {
			return ResponseEntity.badRequest().body("Error: Email is already in use!");
		}

		// Create new user account
		AppUser user = new AppUser(signUpRequest.getUsername(), signUpRequest.getEmail(),
				encoder.encode(signUpRequest.getPassword()) // Encrypt password
		);

		// Assign roles
		Set<String> strRoles = signUpRequest.getRole();
		Set<Role> roles = new HashSet<>();

		if (strRoles == null || strRoles.isEmpty()) {
			Role userRole = roleRepository.findByName(ERole.ROLE_USER)
					.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
			roles.add(userRole);
		} else {
			for (String role : signUpRequest.getRole()) {
				switch (role) {
				case "admin":
					Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(adminRole);
					break;
				case "mod":
					Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(modRole);
					break;
				default:
					Role userRole = roleRepository.findByName(ERole.ROLE_USER)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(userRole);
				}
			}
		}

		user.setRoles(roles);
		appUserRepository.save(user);
		return ResponseEntity.ok(new MessageResponse("User registration successful"));
	}

	@PostMapping("/forgot-password")
	public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
		System.out.println("Received request with email: " + request.get("email"));

		String email = request.get("email");
		if (email == null || email.isEmpty()) {
			return ResponseEntity.badRequest().body("Email is required");
		}

		AppUser user = appUserRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User not found with email: " + email));

		String token = UUID.randomUUID().toString();
		passwordResetService.createPasswordResetTokenForUser(user, token);
		passwordResetService.sendPasswordResetEmail(email, token);

		return ResponseEntity.ok("Password reset email sent");
	}

	@PostMapping("/reset-password")
	public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
		String token = request.get("token");
		String newPassword = request.get("newPassword");

		if (newPassword == null || newPassword.length() < 8) {
			return ResponseEntity.badRequest().body("Password must be at least 8 characters long");
		}

		passwordResetService.resetPassword(token, newPassword);
		return ResponseEntity.ok("Password reset successfully");
	}

}
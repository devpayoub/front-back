package com.example.thinktrend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

	@GetMapping("/welcome")
	public String welcome() {
		return "public access";
	}

	@GetMapping("/user")
	@PreAuthorize("hasRole ('USER') or hasRole ('MODERATOR') or hasRole('ADMIN')")
	public String userAccess() {
		return "User Content";
	}

	@GetMapping("/mod")
	@PreAuthorize("hasRole ('MODERATOR') or hasRole('ADMIN')")
	public String moderatorAccess() {
		return "Modrt Board";
	}

	@GetMapping("/admin")
	@PreAuthorize("hasRole('ADMIN')")
	public String adminAccess() {
		return "Admin Content";
	}

	@PostMapping("/test-endpoint")
	public ResponseEntity<?> testEndpoint(@RequestBody Map<String, String> request) {
		return ResponseEntity.ok(request);
	}

}

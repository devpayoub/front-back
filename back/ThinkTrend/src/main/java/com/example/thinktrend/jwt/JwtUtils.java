package com.example.thinktrend.jwt;

import java.security.Key;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.example.thinktrend.Services.UserDetailsImpl;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {

	private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

	@Value("${jwt.secret}")
	private String jwtSecret;

	@Value("${jwt.expiration}")
	private int jwtExpiration;

	// Generate JWT Token from authentication object
	public String generateToken(Authentication authentication) {
		UserDetailsImpl userPrinciple = (UserDetailsImpl) authentication.getPrincipal();

		return Jwts.builder().setSubject(userPrinciple.getEmail())
				.setExpiration(new Date((new Date()).getTime() + jwtExpiration * 1000)) // Convert expiration to
																						// milliseconds
				.signWith(key(), SignatureAlgorithm.HS256).compact();
	}

	// Get email from JWT token
	public String getEmailFromJwtToken(String token) {
		return Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token).getBody().getSubject();
	}

	// Generate signing key from the base64-decoded JWT secret
	private Key key() {
		return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret)); // Use Keys.hmacShaKeyFor to generate the key
	}

	// Validate JWT token
	public boolean validateToken(String authToken) {
		try {
			Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(authToken);
			return true;
		} catch (ExpiredJwtException e) {
			logger.error("JWT Token expired: {}", e.getMessage());
		} catch (UnsupportedJwtException e) {
			logger.error("JWT Token is unsupported: {}", e.getMessage());
		} catch (IllegalArgumentException e) {
			logger.error("JWT claims string is empty: {}", e.getMessage());
		} catch (Exception e) {
			logger.error("JWT token is invalid: {}", e.getMessage());
		}
		return false;
	}
}

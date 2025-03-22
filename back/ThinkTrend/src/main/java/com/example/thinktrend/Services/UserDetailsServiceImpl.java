package com.example.thinktrend.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.thinktrend.models.AppUser;
import com.example.thinktrend.repositories.AppUserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

	@Autowired
	private AppUserRepository userRepository;

	@Override
	@Transactional
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		// Fetch the user from the database using the email
		AppUser user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		// Convert AppUser to UserDetails using UserDetailsImpl
		return UserDetailsImpl.build(user);
	}
}
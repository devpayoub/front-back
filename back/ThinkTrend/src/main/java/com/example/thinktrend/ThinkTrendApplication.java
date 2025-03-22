package com.example.thinktrend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
@EntityScan(basePackages = "com.example.thinktrend.models")
public class ThinkTrendApplication {
	public static void main(String[] args) {
		SpringApplication.run(ThinkTrendApplication.class, args);
	}
}
package com.cms.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

public class PasswordUtil {

    private static final SecureRandom RANDOM = new SecureRandom();

    public static String hashPassword(String password) {
        if (password == null) return null;
        byte[] salt = new byte[16];
        RANDOM.nextBytes(salt);
        String saltBase64 = Base64.getEncoder().encodeToString(salt);
        String hash = sha256(saltBase64 + password);
        return saltBase64 + ":" + hash;
    }

    public static boolean verifyPassword(String password, String storedHash) {
        if (password == null || storedHash == null) return false;

        // Support both modern salted hashes and plain-text fallback (for backward compatibility)
        if (!storedHash.contains(":")) {
            return password.equals(storedHash);
        }

        String[] parts = storedHash.split(":", 2);
        if (parts.length != 2) return false;
        String saltBase64 = parts[0];
        String expectedHash = parts[1];

        String computedHash = sha256(saltBase64 + password);
        return expectedHash.equals(computedHash);
    }

    private static String sha256(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}

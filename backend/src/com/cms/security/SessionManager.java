package com.cms.security;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class SessionManager {

    public static class Session {
        private final String token;
        private final String role;          // "STUDENT" or "ADMIN"
        private final String userId;        // studentId or admin username
        private final String name;          // display name
        private final long createdAt;

        public Session(String token, String role, String userId, String name) {
            this.token = token;
            this.role = role;
            this.userId = userId;
            this.name = name;
            this.createdAt = System.currentTimeMillis();
        }

        public String getToken() { return token; }
        public String getRole() { return role; }
        public String getUserId() { return userId; }
        public String getName() { return name; }
        public long getCreatedAt() { return createdAt; }

        public boolean isAdmin() { return "ADMIN".equalsIgnoreCase(role); }
        public boolean isStudent() { return "STUDENT".equalsIgnoreCase(role); }
    }

    private static final Map<String, Session> sessions = new ConcurrentHashMap<>();

    public static Session createSession(String role, String userId, String name) {
        String token = UUID.randomUUID().toString().replace("-", "");
        Session session = new Session(token, role, userId, name);
        sessions.put(token, session);
        return session;
    }

    public static Session getSession(String token) {
        if (token == null) return null;
        if (token.startsWith("Bearer ")) {
            token = token.substring(7).trim();
        }
        return sessions.get(token);
    }

    public static void removeSession(String token) {
        if (token == null) return;
        if (token.startsWith("Bearer ")) {
            token = token.substring(7).trim();
        }
        sessions.remove(token);
    }
}

package com.cms.service;

import com.cms.dao.AdminDAO;
import com.cms.dao.StudentDAO;
import com.cms.model.Admin;
import com.cms.model.Student;
import com.cms.security.PasswordUtil;
import com.cms.security.SessionManager;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

public class AuthService {

    private final StudentDAO studentDAO = new StudentDAO();
    private final AdminDAO adminDAO = new AdminDAO();
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public Map<String, Object> registerStudent(String studentId, String name, String email, String phone, String password, String confirmPassword) throws SQLException {
        Map<String, Object> result = new HashMap<>();

        if (studentId == null || studentId.trim().isEmpty() ||
            name == null || name.trim().isEmpty() ||
            email == null || email.trim().isEmpty() ||
            phone == null || phone.trim().isEmpty() ||
            password == null || password.trim().isEmpty()) {
            result.put("success", false);
            result.put("message", "All fields are required.");
            return result;
        }

        if (!EMAIL_PATTERN.matcher(email.trim()).matches()) {
            result.put("success", false);
            result.put("message", "Invalid email format.");
            return result;
        }

        if (confirmPassword != null && !password.equals(confirmPassword)) {
            result.put("success", false);
            result.put("message", "Passwords do not match.");
            return result;
        }

        if (password.length() < 6) {
            result.put("success", false);
            result.put("message", "Password must be at least 6 characters.");
            return result;
        }

        Student existing = studentDAO.findByStudentId(studentId.trim());
        if (existing != null) {
            result.put("success", false);
            result.put("message", "Duplicate Student ID or Email already registered.");
            return result;
        }

        String hashedPassword = PasswordUtil.hashPassword(password);
        String now = LocalDateTime.now().format(FORMATTER);
        Student s = new Student(0, studentId.trim(), name.trim(), email.trim(), phone.trim(), hashedPassword, now);

        boolean created = studentDAO.createStudent(s);
        if (created) {
            SessionManager.Session session = SessionManager.createSession("STUDENT", s.getStudentId(), s.getName());
            result.put("success", true);
            result.put("message", "Student account registered successfully.");
            result.put("token", session.getToken());
            result.put("student", Map.of(
                "studentId", s.getStudentId(),
                "name", s.getName(),
                "email", s.getEmail(),
                "phone", s.getPhone()
            ));
        } else {
            result.put("success", false);
            result.put("message", "Registration failed. Please try again.");
        }
        return result;
    }

    public Map<String, Object> loginStudent(String studentId, String password) throws SQLException {
        Map<String, Object> result = new HashMap<>();

        if (studentId == null || studentId.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            result.put("success", false);
            result.put("message", "Student ID and password are required.");
            return result;
        }

        Student s = studentDAO.findByStudentId(studentId.trim());
        if (s == null) {
            result.put("success", false);
            result.put("message", "Invalid Student ID or password.");
            return result;
        }

        if (!PasswordUtil.verifyPassword(password, s.getPassword())) {
            result.put("success", false);
            result.put("message", "Invalid Student ID or password.");
            return result;
        }

        SessionManager.Session session = SessionManager.createSession("STUDENT", s.getStudentId(), s.getName());
        result.put("success", true);
        result.put("message", "Login successful.");
        result.put("token", session.getToken());
        result.put("student", Map.of(
            "studentId", s.getStudentId(),
            "name", s.getName(),
            "email", s.getEmail(),
            "phone", s.getPhone()
        ));
        return result;
    }

    public Map<String, Object> loginAdmin(String username, String password) throws SQLException {
        Map<String, Object> result = new HashMap<>();

        if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            result.put("success", false);
            result.put("message", "Username and password are required.");
            return result;
        }

        Admin a = adminDAO.findByUsername(username.trim());
        if (a == null) {
            // Also check backward-compatible console default credentials if not found
            if ("admin".equals(username) && "admin123".equals(password)) {
                SessionManager.Session session = SessionManager.createSession("ADMIN", "admin", "System Administrator");
                result.put("success", true);
                result.put("message", "Admin login successful.");
                result.put("token", session.getToken());
                result.put("admin", Map.of("username", "admin", "name", "System Administrator"));
                return result;
            }
            result.put("success", false);
            result.put("message", "Invalid admin credentials.");
            return result;
        }

        if (!PasswordUtil.verifyPassword(password, a.getPassword())) {
            result.put("success", false);
            result.put("message", "Invalid admin credentials.");
            return result;
        }

        SessionManager.Session session = SessionManager.createSession("ADMIN", a.getUsername(), "Administrator");
        result.put("success", true);
        result.put("message", "Admin login successful.");
        result.put("token", session.getToken());
        result.put("admin", Map.of("username", a.getUsername(), "name", "Administrator"));
        return result;
    }
}

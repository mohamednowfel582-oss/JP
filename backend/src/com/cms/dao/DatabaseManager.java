package com.cms.dao;

import com.cms.security.PasswordUtil;

import java.io.File;
import java.sql.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DatabaseManager {

    private static String dbUrl = "jdbc:sqlite:../database/cms.db";
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public static synchronized void initialize(String customDbPath) {
        if (customDbPath != null && !customDbPath.isEmpty()) {
            dbUrl = "jdbc:sqlite:" + customDbPath;
        }

        try {
            // Ensure sqlite driver is loaded
            Class.forName("org.sqlite.JDBC");

            // Ensure parent directory exists
            String path = dbUrl.replace("jdbc:sqlite:", "");
            File dbFile = new File(path);
            if (dbFile.getParentFile() != null && !dbFile.getParentFile().exists()) {
                dbFile.getParentFile().mkdirs();
            }

            try (Connection conn = getConnection()) {
                createTables(conn);
                seedData(conn);
            }
            System.out.println("Database initialized successfully at: " + path);
        } catch (Exception e) {
            System.err.println("Error initializing database: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(dbUrl);
    }

    private static void createTables(Connection conn) throws SQLException {
        try (Statement stmt = conn.createStatement()) {
            stmt.execute("PRAGMA foreign_keys = ON;");

            // Students
            stmt.execute("CREATE TABLE IF NOT EXISTS students (" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "student_id TEXT UNIQUE NOT NULL, " +
                    "name TEXT NOT NULL, " +
                    "email TEXT NOT NULL, " +
                    "phone TEXT NOT NULL, " +
                    "password TEXT NOT NULL, " +
                    "created_at TEXT NOT NULL);");

            // Admins
            stmt.execute("CREATE TABLE IF NOT EXISTS admins (" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "username TEXT UNIQUE NOT NULL, " +
                    "password TEXT NOT NULL, " +
                    "created_at TEXT NOT NULL);");

            // Complaints
            stmt.execute("CREATE TABLE IF NOT EXISTS complaints (" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "complaint_code TEXT UNIQUE NOT NULL, " +
                    "student_id TEXT NOT NULL, " +
                    "student_name TEXT NOT NULL, " +
                    "category TEXT NOT NULL, " +
                    "title TEXT NOT NULL, " +
                    "description TEXT NOT NULL, " +
                    "location TEXT NOT NULL, " +
                    "priority TEXT NOT NULL, " +
                    "status TEXT NOT NULL DEFAULT 'Pending', " +
                    "image_url TEXT, " +
                    "created_at TEXT NOT NULL, " +
                    "updated_at TEXT NOT NULL, " +
                    "FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE);");

            // Responses
            stmt.execute("CREATE TABLE IF NOT EXISTS responses (" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "complaint_id INTEGER NOT NULL, " +
                    "admin_id INTEGER, " +
                    "admin_username TEXT NOT NULL, " +
                    "response TEXT NOT NULL, " +
                    "created_at TEXT NOT NULL, " +
                    "FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE);");
        }
    }

    private static void seedData(Connection conn) throws SQLException {
        String now = LocalDateTime.now().format(FORMATTER);

        // 1. Seed Admin if empty
        try (PreparedStatement ps = conn.prepareStatement("SELECT COUNT(*) FROM admins")) {
            ResultSet rs = ps.executeQuery();
            if (rs.next() && rs.getInt(1) == 0) {
                String adminPass = PasswordUtil.hashPassword("admin123");
                try (PreparedStatement insert = conn.prepareStatement(
                        "INSERT INTO admins (username, password, created_at) VALUES (?, ?, ?)")) {
                    insert.setString(1, "admin");
                    insert.setString(2, adminPass);
                    insert.setString(3, now);
                    insert.executeUpdate();
                    System.out.println("Default admin user created: admin / admin123");
                }
            }
        }

        // 2. Seed Student if empty
        try (PreparedStatement ps = conn.prepareStatement("SELECT COUNT(*) FROM students")) {
            ResultSet rs = ps.executeQuery();
            if (rs.next() && rs.getInt(1) == 0) {
                String stuPass = PasswordUtil.hashPassword("student123");
                try (PreparedStatement insert = conn.prepareStatement(
                        "INSERT INTO students (student_id, name, email, phone, password, created_at) VALUES (?, ?, ?, ?, ?, ?)")) {
                    insert.setString(1, "STU1001");
                    insert.setString(2, "Aarav Sharma");
                    insert.setString(3, "aarav@college.edu");
                    insert.setString(4, "+91 9876543210");
                    insert.setString(5, stuPass);
                    insert.setString(6, now);
                    insert.executeUpdate();
                    System.out.println("Default student user created: STU1001 / student123");
                }
            }
        }

        // 3. Seed Sample Complaints if empty
        try (PreparedStatement ps = conn.prepareStatement("SELECT COUNT(*) FROM complaints")) {
            ResultSet rs = ps.executeQuery();
            if (rs.next() && rs.getInt(1) == 0) {
                insertSampleComplaint(conn, "CMP1001", "STU1001", "Aarav Sharma", "Hostel",
                        "Water heater not functioning", "Water heater in 2nd floor bathroom Wing B is tripping the fuse.",
                        "Hostel Block B, 2nd Floor", "Urgent", "Pending", now, now);

                insertSampleComplaint(conn, "CMP1002", "STU1001", "Aarav Sharma", "Electricity",
                        "Flickering lights in Computer Lab 3", "Tube lights flickering constantly causing disturbance during lab sessions.",
                        "Academic Block 2, Room 204", "Medium", "In Progress", now, now);

                insertSampleComplaint(conn, "CMP1003", "STU1001", "Aarav Sharma", "Food",
                        "Breakfast timing delay in Central Mess", "Breakfast was delayed by 30 minutes, causing students to be late for 8:30 AM lecture.",
                        "Central Dining Hall", "Low", "Resolved", now, now);

                insertSampleComplaint(conn, "CMP1004", "STU1001", "Aarav Sharma", "Maintenance",
                        "Broken door handle in Seminar Hall", "Entrance door handle is loose and getting jammed.",
                        "Main Auditorium Wing", "High", "In Progress", now, now);

                // Add sample responses
                insertSampleResponse(conn, 2, 1, "admin", "Electrician team dispatched. Replacement choke ordered.", now);
                insertSampleResponse(conn, 3, 1, "admin", "Discussed with mess contractor. Kitchen shifts rescheduled.", now);

                System.out.println("Sample complaints and admin responses seeded.");
            }
        }
    }

    private static void insertSampleComplaint(Connection conn, String code, String studentId, String name,
                                              String category, String title, String desc, String location,
                                              String priority, String status, String created, String updated) throws SQLException {
        String sql = "INSERT INTO complaints (complaint_code, student_id, student_name, category, title, description, location, priority, status, created_at, updated_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, code);
            ps.setString(2, studentId);
            ps.setString(3, name);
            ps.setString(4, category);
            ps.setString(5, title);
            ps.setString(6, desc);
            ps.setString(7, location);
            ps.setString(8, priority);
            ps.setString(9, status);
            ps.setString(10, created);
            ps.setString(11, updated);
            ps.executeUpdate();
        }
    }

    private static void insertSampleResponse(Connection conn, int complaintId, int adminId, String adminUser,
                                             String text, String created) throws SQLException {
        String sql = "INSERT INTO responses (complaint_id, admin_id, admin_username, response, created_at) VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, complaintId);
            ps.setInt(2, adminId);
            ps.setString(3, adminUser);
            ps.setString(4, text);
            ps.setString(5, created);
            ps.executeUpdate();
        }
    }
}

package com.cms.dao;

import com.cms.model.Complaint;
import com.cms.model.Response;

import java.sql.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class ComplaintDAO {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private final ResponseDAO responseDAO = new ResponseDAO();

    public boolean createComplaint(Complaint c) throws SQLException {
        String now = LocalDateTime.now().format(FORMATTER);
        c.setCreatedAt(now);
        c.setUpdatedAt(now);

        String sql = "INSERT INTO complaints (complaint_code, student_id, student_name, category, title, description, location, priority, status, image_url, created_at, updated_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseManager.getConnection()) {
            // Determine next code
            int nextNumber = 1001;
            try (Statement st = conn.createStatement();
                 ResultSet rs = st.executeQuery("SELECT MAX(id) FROM complaints")) {
                if (rs.next()) {
                    int maxId = rs.getInt(1);
                    if (maxId > 0) {
                        nextNumber = 1000 + maxId + 1;
                    }
                }
            }

            if (c.getComplaintCode() == null || c.getComplaintCode().isEmpty()) {
                c.setComplaintCode("CMP" + nextNumber);
            }

            try (PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                ps.setString(1, c.getComplaintCode());
                ps.setString(2, c.getStudentId());
                ps.setString(3, c.getName());
                ps.setString(4, c.getCategory());
                ps.setString(5, c.getTitle());
                ps.setString(6, c.getDescription());
                ps.setString(7, c.getLocation());
                ps.setString(8, c.getPriority());
                ps.setString(9, c.getStatus() != null ? c.getStatus() : "Pending");
                ps.setString(10, c.getImageUrl());
                ps.setString(11, c.getCreatedAt());
                ps.setString(12, c.getUpdatedAt());

                int affected = ps.executeUpdate();
                if (affected > 0) {
                    try (ResultSet keys = ps.getGeneratedKeys()) {
                        if (keys.next()) {
                            int generatedId = keys.getInt(1);
                            c.setId(generatedId);
                            c.setComplaintId(generatedId);
                        }
                    }
                    return true;
                }
            }
        }
        return false;
    }

    public Complaint getById(int id) throws SQLException {
        String sql = "SELECT * FROM complaints WHERE id = ? LIMIT 1";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Complaint c = mapRow(rs);
                    c.setResponses(responseDAO.getResponsesByComplaintId(c.getId()));
                    return c;
                }
            }
        }
        return null;
    }

    public Complaint getByCode(String code) throws SQLException {
        String sql = "SELECT * FROM complaints WHERE complaint_code = ? OR id = ? LIMIT 1";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, code.trim());
            int parsedId = -1;
            try {
                if (code.startsWith("CMP")) {
                    parsedId = Integer.parseInt(code.substring(3));
                } else {
                    parsedId = Integer.parseInt(code);
                }
            } catch (Exception ignored) {}
            ps.setInt(2, parsedId);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Complaint c = mapRow(rs);
                    c.setResponses(responseDAO.getResponsesByComplaintId(c.getId()));
                    return c;
                }
            }
        }
        return null;
    }

    public List<Complaint> getByStudentId(String studentId, String category, String status, String search) throws SQLException {
        List<Complaint> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT * FROM complaints WHERE student_id = ?");
        List<Object> params = new ArrayList<>();
        params.add(studentId);

        if (status != null && !status.isEmpty() && !status.equalsIgnoreCase("All")) {
            sql.append(" AND status = ?");
            params.add(status);
        }
        if (category != null && !category.isEmpty() && !category.equalsIgnoreCase("All")) {
            sql.append(" AND category = ?");
            params.add(category);
        }
        if (search != null && !search.trim().isEmpty()) {
            sql.append(" AND (complaint_code LIKE ? OR title LIKE ? OR description LIKE ? OR location LIKE ?)");
            String q = "%" + search.trim() + "%";
            params.add(q);
            params.add(q);
            params.add(q);
            params.add(q);
        }
        sql.append(" ORDER BY id DESC");

        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Complaint c = mapRow(rs);
                    c.setResponses(responseDAO.getResponsesByComplaintId(c.getId()));
                    list.add(c);
                }
            }
        }
        return list;
    }

    public List<Complaint> getAll(String status, String category, String search) throws SQLException {
        List<Complaint> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT * FROM complaints WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (status != null && !status.isEmpty() && !status.equalsIgnoreCase("All")) {
            sql.append(" AND status = ?");
            params.add(status);
        }
        if (category != null && !category.isEmpty() && !category.equalsIgnoreCase("All")) {
            sql.append(" AND category = ?");
            params.add(category);
        }
        if (search != null && !search.trim().isEmpty()) {
            sql.append(" AND (complaint_code LIKE ? OR student_name LIKE ? OR student_id LIKE ? OR title LIKE ? OR description LIKE ? OR location LIKE ?)");
            String q = "%" + search.trim() + "%";
            params.add(q);
            params.add(q);
            params.add(q);
            params.add(q);
            params.add(q);
            params.add(q);
        }
        sql.append(" ORDER BY id DESC");

        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Complaint c = mapRow(rs);
                    c.setResponses(responseDAO.getResponsesByComplaintId(c.getId()));
                    list.add(c);
                }
            }
        }
        return list;
    }

    public boolean updateStatus(int id, String status) throws SQLException {
        String now = LocalDateTime.now().format(FORMATTER);
        String sql = "UPDATE complaints SET status = ?, updated_at = ? WHERE id = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, status);
            ps.setString(2, now);
            ps.setInt(3, id);
            return ps.executeUpdate() > 0;
        }
    }

    public boolean delete(int id) throws SQLException {
        String sql = "DELETE FROM complaints WHERE id = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        }
    }

    public Map<String, Integer> getStatusCounts(String studentId) throws SQLException {
        Map<String, Integer> map = new HashMap<>();
        map.put("total", 0);
        map.put("pending", 0);
        map.put("inProgress", 0);
        map.put("resolved", 0);

        StringBuilder sql = new StringBuilder("SELECT status, COUNT(*) FROM complaints");
        if (studentId != null) {
            sql.append(" WHERE student_id = ?");
        }
        sql.append(" GROUP BY status");

        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            if (studentId != null) {
                ps.setString(1, studentId);
            }
            try (ResultSet rs = ps.executeQuery()) {
                int total = 0;
                while (rs.next()) {
                    String st = rs.getString(1);
                    int count = rs.getInt(2);
                    total += count;
                    if ("Pending".equalsIgnoreCase(st)) {
                        map.put("pending", count);
                    } else if ("In Progress".equalsIgnoreCase(st)) {
                        map.put("inProgress", count);
                    } else if ("Resolved".equalsIgnoreCase(st)) {
                        map.put("resolved", count);
                    }
                }
                map.put("total", total);
            }
        }
        return map;
    }

    public Map<String, Integer> getCategoryCounts() throws SQLException {
        Map<String, Integer> map = new LinkedHashMap<>();
        String sql = "SELECT category, COUNT(*) FROM complaints GROUP BY category ORDER BY COUNT(*) DESC";
        try (Connection conn = DatabaseManager.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                map.put(rs.getString(1), rs.getInt(2));
            }
        }
        return map;
    }

    public Map<String, Integer> getPriorityCounts() throws SQLException {
        Map<String, Integer> map = new LinkedHashMap<>();
        String sql = "SELECT priority, COUNT(*) FROM complaints GROUP BY priority";
        try (Connection conn = DatabaseManager.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                map.put(rs.getString(1), rs.getInt(2));
            }
        }
        return map;
    }

    private Complaint mapRow(ResultSet rs) throws SQLException {
        Complaint c = new Complaint();
        c.setId(rs.getInt("id"));
        c.setComplaintId(rs.getInt("id"));
        c.setComplaintCode(rs.getString("complaint_code"));
        c.setStudentId(rs.getString("student_id"));
        c.setName(rs.getString("student_name"));
        c.setCategory(rs.getString("category"));
        c.setTitle(rs.getString("title"));
        c.setDescription(rs.getString("description"));
        c.setLocation(rs.getString("location"));
        c.setPriority(rs.getString("priority"));
        c.setStatus(rs.getString("status"));
        c.setImageUrl(rs.getString("image_url"));
        c.setCreatedAt(rs.getString("created_at"));
        c.setUpdatedAt(rs.getString("updated_at"));
        return c;
    }
}

package com.cms.dao;

import com.cms.model.Response;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ResponseDAO {

    public boolean addResponse(Response r) throws SQLException {
        String sql = "INSERT INTO responses (complaint_id, admin_id, admin_username, response, created_at) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setInt(1, r.getComplaintId());
            if (r.getAdminId() != null) {
                ps.setInt(2, r.getAdminId());
            } else {
                ps.setNull(2, Types.INTEGER);
            }
            ps.setString(3, r.getAdminUsername());
            ps.setString(4, r.getResponse());
            ps.setString(5, r.getCreatedAt());
            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet keys = ps.getGeneratedKeys()) {
                    if (keys.next()) {
                        r.setId(keys.getInt(1));
                    }
                }
                return true;
            }
        }
        return false;
    }

    public List<Response> getResponsesByComplaintId(int complaintId) throws SQLException {
        List<Response> list = new ArrayList<>();
        String sql = "SELECT * FROM responses WHERE complaint_id = ? ORDER BY id ASC";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, complaintId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Response r = new Response();
                    r.setId(rs.getInt("id"));
                    r.setComplaintId(rs.getInt("complaint_id"));
                    int adminId = rs.getInt("admin_id");
                    if (!rs.wasNull()) {
                        r.setAdminId(adminId);
                    }
                    r.setAdminUsername(rs.getString("admin_username"));
                    r.setResponse(rs.getString("response"));
                    r.setCreatedAt(rs.getString("created_at"));
                    list.add(r);
                }
            }
        }
        return list;
    }
}

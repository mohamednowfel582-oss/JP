package com.cms.service;

import com.cms.dao.ComplaintDAO;
import com.cms.dao.ResponseDAO;
import com.cms.model.Complaint;
import com.cms.model.Response;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

/**
 * Service class that preserves and extends the original ComplaintService business logic.
 */
public class ComplaintService {

    private final ComplaintDAO complaintDAO = new ComplaintDAO();
    private final ResponseDAO responseDAO = new ResponseDAO();
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // Preserved method from original ComplaintService
    public void addComplaint(Complaint c) {
        try {
            complaintDAO.createComplaint(c);
            System.out.println("Complaint Registered Successfully.");
        } catch (SQLException e) {
            System.err.println("Failed to register complaint: " + e.getMessage());
        }
    }

    // Preserved method from original ComplaintService
    public void viewComplaints() {
        try {
            List<Complaint> list = complaintDAO.getAll(null, null, null);
            if (list.isEmpty()) {
                System.out.println("No complaints found.");
                return;
            }
            for (Complaint c : list) {
                c.displayComplaint();
            }
        } catch (SQLException e) {
            System.err.println("Error reading complaints: " + e.getMessage());
        }
    }

    // Preserved method from original ComplaintService
    public void searchComplaint(int id) {
        try {
            Complaint c = complaintDAO.getById(id);
            if (c != null) {
                c.displayComplaint();
            } else {
                System.out.println("Complaint Not Found.");
            }
        } catch (SQLException e) {
            System.err.println("Error searching complaint: " + e.getMessage());
        }
    }

    // Preserved method from original ComplaintService
    public void updateStatus(int id, String status) {
        try {
            boolean updated = complaintDAO.updateStatus(id, status);
            if (updated) {
                System.out.println("Complaint Status Updated Successfully.");
            } else {
                System.out.println("Complaint Not Found.");
            }
        } catch (SQLException e) {
            System.err.println("Error updating status: " + e.getMessage());
        }
    }

    // --- Extended Web API Service Methods ---

    public Complaint registerComplaint(Complaint c) throws SQLException {
        boolean created = complaintDAO.createComplaint(c);
        if (created) {
            return c;
        }
        return null;
    }

    public Complaint getComplaint(int id) throws SQLException {
        return complaintDAO.getById(id);
    }

    public Complaint getComplaintByCode(String code) throws SQLException {
        return complaintDAO.getByCode(code);
    }

    public List<Complaint> getStudentComplaints(String studentId, String category, String status, String search) throws SQLException {
        return complaintDAO.getByStudentId(studentId, category, status, search);
    }

    public List<Complaint> getAllComplaints(String status, String category, String search) throws SQLException {
        return complaintDAO.getAll(status, category, search);
    }

    public boolean updateComplaintStatus(int id, String status) throws SQLException {
        return complaintDAO.updateStatus(id, status);
    }

    public boolean deleteComplaint(int id) throws SQLException {
        return complaintDAO.delete(id);
    }

    public boolean addAdminResponse(int complaintId, Integer adminId, String adminUsername, String responseText) throws SQLException {
        String now = LocalDateTime.now().format(FORMATTER);
        Response r = new Response(0, complaintId, adminId, adminUsername, responseText, now);
        return responseDAO.addResponse(r);
    }

    public Map<String, Integer> getStatusMetrics(String studentId) throws SQLException {
        return complaintDAO.getStatusCounts(studentId);
    }

    public Map<String, Integer> getCategoryMetrics() throws SQLException {
        return complaintDAO.getCategoryCounts();
    }

    public Map<String, Integer> getPriorityMetrics() throws SQLException {
        return complaintDAO.getPriorityCounts();
    }
}

package com.cms.service;

import com.cms.dao.ComplaintDAO;
import com.cms.dao.StudentDAO;
import com.cms.model.Complaint;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ReportService {

    private final ComplaintDAO complaintDAO = new ComplaintDAO();
    private final StudentDAO studentDAO = new StudentDAO();

    public Map<String, Object> getAdminReportData() throws SQLException {
        Map<String, Object> report = new HashMap<>();

        Map<String, Integer> statusCounts = complaintDAO.getStatusCounts(null);
        Map<String, Integer> categoryCounts = complaintDAO.getCategoryCounts();
        Map<String, Integer> priorityCounts = complaintDAO.getPriorityCounts();
        int totalStudents = studentDAO.countStudents();

        report.put("statusCounts", statusCounts);
        report.put("categoryCounts", categoryCounts);
        report.put("priorityCounts", priorityCounts);
        report.put("totalStudents", totalStudents);
        report.put("totalComplaints", statusCounts.getOrDefault("total", 0));
        report.put("pendingComplaints", statusCounts.getOrDefault("pending", 0));
        report.put("inProgressComplaints", statusCounts.getOrDefault("inProgress", 0));
        report.put("resolvedComplaints", statusCounts.getOrDefault("resolved", 0));

        return report;
    }

    public String generateCsv() throws SQLException {
        List<Complaint> list = complaintDAO.getAll(null, null, null);
        StringBuilder sb = new StringBuilder();
        sb.append("Complaint ID,Student ID,Student Name,Category,Title,Description,Location,Priority,Status,Created At,Updated At\n");

        for (Complaint c : list) {
            sb.append(escapeCsv(c.getComplaintCode())).append(",");
            sb.append(escapeCsv(c.getStudentId())).append(",");
            sb.append(escapeCsv(c.getName())).append(",");
            sb.append(escapeCsv(c.getCategory())).append(",");
            sb.append(escapeCsv(c.getTitle())).append(",");
            sb.append(escapeCsv(c.getDescription())).append(",");
            sb.append(escapeCsv(c.getLocation())).append(",");
            sb.append(escapeCsv(c.getPriority())).append(",");
            sb.append(escapeCsv(c.getStatus())).append(",");
            sb.append(escapeCsv(c.getCreatedAt())).append(",");
            sb.append(escapeCsv(c.getUpdatedAt())).append("\n");
        }
        return sb.toString();
    }

    private String escapeCsv(String val) {
        if (val == null) return "\"\"";
        String clean = val.replace("\"", "\"\"").replace("\n", " ").replace("\r", "");
        return "\"" + clean + "\"";
    }
}

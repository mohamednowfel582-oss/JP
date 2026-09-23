package com.cms.http.handlers;

import com.cms.dao.StudentDAO;
import com.cms.http.HttpUtil;
import com.cms.model.Complaint;
import com.cms.model.Student;
import com.cms.security.SessionManager;
import com.cms.service.AuthService;
import com.cms.service.ComplaintService;
import com.google.gson.JsonObject;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public class AdminHandler implements HttpHandler {

    private final AuthService authService = new AuthService();
    private final ComplaintService complaintService = new ComplaintService();
    private final StudentDAO studentDAO = new StudentDAO();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (HttpUtil.handlePreflight(exchange)) return;

        String path = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod();

        try {
            // Public admin login
            if ("POST".equalsIgnoreCase(method) && path.endsWith("/login")) {
                handleLogin(exchange);
                return;
            }

            // All other admin routes require valid ADMIN session token
            String token = HttpUtil.getBearerToken(exchange);
            SessionManager.Session session = SessionManager.getSession(token);
            if (session == null || !session.isAdmin()) {
                HttpUtil.sendJsonResponse(exchange, 401, Map.of("error", "Unauthorized: Admin access required"));
                return;
            }

            if ("GET".equalsIgnoreCase(method) && path.equals("/api/admin/complaints")) {
                handleGetComplaints(exchange);
            } else if (path.startsWith("/api/admin/complaints/")) {
                handleComplaintDetailActions(exchange, path, method, session);
            } else if ("GET".equalsIgnoreCase(method) && path.equals("/api/admin/students")) {
                handleGetStudents(exchange);
            } else {
                HttpUtil.sendJsonResponse(exchange, 404, Map.of("error", "Endpoint not found: " + path));
            }
        } catch (Exception e) {
            e.printStackTrace();
            HttpUtil.sendJsonResponse(exchange, 500, Map.of("error", "Internal server error: " + e.getMessage()));
        }
    }

    private void handleLogin(HttpExchange exchange) throws Exception {
        String body = HttpUtil.readRequestBody(exchange);
        JsonObject json = HttpUtil.getGson().fromJson(body, JsonObject.class);

        String username = json.has("username") ? json.get("username").getAsString() : null;
        String password = json.has("password") ? json.get("password").getAsString() : null;

        Map<String, Object> result = authService.loginAdmin(username, password);
        boolean success = Boolean.TRUE.equals(result.get("success"));
        HttpUtil.sendJsonResponse(exchange, success ? 200 : 401, result);
    }

    private void handleGetComplaints(HttpExchange exchange) throws Exception {
        Map<String, String> query = HttpUtil.parseQueryParams(exchange.getRequestURI().getQuery());
        String status = query.get("status");
        String category = query.get("category");
        String search = query.get("search");

        List<Complaint> list = complaintService.getAllComplaints(status, category, search);
        Map<String, Integer> stats = complaintService.getStatusMetrics(null);

        HttpUtil.sendJsonResponse(exchange, 200, Map.of(
                "complaints", list,
                "stats", stats
        ));
    }

    private void handleComplaintDetailActions(HttpExchange exchange, String path, String method, SessionManager.Session session) throws Exception {
        // e.g. /api/admin/complaints/123/status
        // e.g. /api/admin/complaints/123/response
        // e.g. /api/admin/complaints/123
        String sub = path.substring("/api/admin/complaints/".length());
        String[] parts = sub.split("/");

        int complaintId;
        try {
            complaintId = Integer.parseInt(parts[0]);
        } catch (NumberFormatException e) {
            HttpUtil.sendJsonResponse(exchange, 400, Map.of("error", "Invalid complaint ID: " + parts[0]));
            return;
        }

        if (parts.length == 1) {
            if ("DELETE".equalsIgnoreCase(method)) {
                boolean deleted = complaintService.deleteComplaint(complaintId);
                if (deleted) {
                    HttpUtil.sendJsonResponse(exchange, 200, Map.of("success", true, "message", "Complaint deleted successfully."));
                } else {
                    HttpUtil.sendJsonResponse(exchange, 404, Map.of("error", "Complaint not found or already deleted."));
                }
                return;
            } else if ("GET".equalsIgnoreCase(method)) {
                Complaint c = complaintService.getComplaint(complaintId);
                if (c != null) {
                    HttpUtil.sendJsonResponse(exchange, 200, c);
                } else {
                    HttpUtil.sendJsonResponse(exchange, 404, Map.of("error", "Complaint not found"));
                }
                return;
            }
        } else if (parts.length == 2) {
            String action = parts[1];
            if ("status".equalsIgnoreCase(action) && "PUT".equalsIgnoreCase(method)) {
                String body = HttpUtil.readRequestBody(exchange);
                JsonObject json = HttpUtil.getGson().fromJson(body, JsonObject.class);
                String newStatus = json.has("status") ? json.get("status").getAsString() : null;

                if (newStatus == null || (!newStatus.equals("Pending") && !newStatus.equals("In Progress") && !newStatus.equals("Resolved"))) {
                    HttpUtil.sendJsonResponse(exchange, 400, Map.of("error", "Valid status is required: Pending, In Progress, or Resolved"));
                    return;
                }

                boolean updated = complaintService.updateComplaintStatus(complaintId, newStatus);
                if (updated) {
                    HttpUtil.sendJsonResponse(exchange, 200, Map.of(
                            "success", true,
                            "message", "Complaint status updated to " + newStatus,
                            "status", newStatus
                    ));
                } else {
                    HttpUtil.sendJsonResponse(exchange, 404, Map.of("error", "Complaint not found."));
                }
                return;
            } else if ("response".equalsIgnoreCase(action) && "POST".equalsIgnoreCase(method)) {
                String body = HttpUtil.readRequestBody(exchange);
                JsonObject json = HttpUtil.getGson().fromJson(body, JsonObject.class);
                String responseText = json.has("response") ? json.get("response").getAsString() : null;

                if (responseText == null || responseText.trim().isEmpty()) {
                    HttpUtil.sendJsonResponse(exchange, 400, Map.of("error", "Response text cannot be empty"));
                    return;
                }

                boolean added = complaintService.addAdminResponse(complaintId, null, session.getName(), responseText.trim());
                if (added) {
                    HttpUtil.sendJsonResponse(exchange, 201, Map.of(
                            "success", true,
                            "message", "Response added successfully."
                    ));
                } else {
                    HttpUtil.sendJsonResponse(exchange, 400, Map.of("error", "Failed to add response"));
                }
                return;
            }
        }

        HttpUtil.sendJsonResponse(exchange, 404, Map.of("error", "Action not supported: " + path));
    }

    private void handleGetStudents(HttpExchange exchange) throws Exception {
        List<Student> students = studentDAO.getAllStudents();
        HttpUtil.sendJsonResponse(exchange, 200, Map.of(
                "students", students,
                "total", students.size()
        ));
    }
}

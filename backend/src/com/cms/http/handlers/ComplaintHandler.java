package com.cms.http.handlers;

import com.cms.http.HttpUtil;
import com.cms.model.Complaint;
import com.cms.security.SessionManager;
import com.cms.service.ComplaintService;
import com.google.gson.JsonObject;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public class ComplaintHandler implements HttpHandler {

    private final ComplaintService complaintService = new ComplaintService();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (HttpUtil.handlePreflight(exchange)) return;

        String path = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod();

        try {
            if ("POST".equalsIgnoreCase(method) && path.equals("/api/complaints")) {
                handleCreateComplaint(exchange);
            } else if ("GET".equalsIgnoreCase(method) && path.equals("/api/complaints/my")) {
                handleMyComplaints(exchange);
            } else if ("GET".equalsIgnoreCase(method) && path.startsWith("/api/complaints/track/")) {
                handleTrackComplaint(exchange, path);
            } else if ("GET".equalsIgnoreCase(method) && path.startsWith("/api/complaints/")) {
                handleGetComplaintById(exchange, path);
            } else {
                HttpUtil.sendJsonResponse(exchange, 404, Map.of("error", "Endpoint not found: " + path));
            }
        } catch (Exception e) {
            e.printStackTrace();
            HttpUtil.sendJsonResponse(exchange, 500, Map.of("error", "Internal server error: " + e.getMessage()));
        }
    }

    private void handleCreateComplaint(HttpExchange exchange) throws Exception {
        String token = HttpUtil.getBearerToken(exchange);
        SessionManager.Session session = SessionManager.getSession(token);

        String body = HttpUtil.readRequestBody(exchange);
        JsonObject json = HttpUtil.getGson().fromJson(body, JsonObject.class);

        String studentId = (session != null && session.isStudent()) ? session.getUserId() : null;
        String studentName = (session != null && session.isStudent()) ? session.getName() : null;

        if (studentId == null && json.has("studentId")) {
            studentId = json.get("studentId").getAsString();
        }
        if (studentName == null && json.has("studentName")) {
            studentName = json.get("studentName").getAsString();
        }
        if (studentName == null && json.has("name")) {
            studentName = json.get("name").getAsString();
        }

        String category = json.has("category") ? json.get("category").getAsString() : null;
        if (category == null && json.has("complaintType")) {
            category = json.get("complaintType").getAsString();
        }
        String title = json.has("title") ? json.get("title").getAsString() : null;
        String description = json.has("description") ? json.get("description").getAsString() : null;
        String location = json.has("location") ? json.get("location").getAsString() : "Campus";
        String priority = json.has("priority") ? json.get("priority").getAsString() : "Medium";
        String imageUrl = json.has("imageUrl") ? json.get("imageUrl").getAsString() : null;

        if (studentId == null || category == null || description == null || description.trim().isEmpty()) {
            HttpUtil.sendJsonResponse(exchange, 400, Map.of(
                    "error", "Student ID, category, and description are required."
            ));
            return;
        }

        if (title == null || title.trim().isEmpty()) {
            title = category + " Issue";
        }

        Complaint c = new Complaint();
        c.setStudentId(studentId);
        c.setName(studentName != null ? studentName : "Student (" + studentId + ")");
        c.setCategory(category);
        c.setTitle(title.trim());
        c.setDescription(description.trim());
        c.setLocation(location.trim());
        c.setPriority(priority);
        c.setImageUrl(imageUrl);
        c.setStatus("Pending");

        Complaint created = complaintService.registerComplaint(c);
        if (created != null) {
            HttpUtil.sendJsonResponse(exchange, 201, Map.of(
                    "success", true,
                    "message", "Complaint #" + created.getComplaintCode() + " registered successfully.",
                    "complaint", created
            ));
        } else {
            HttpUtil.sendJsonResponse(exchange, 500, Map.of("error", "Failed to register complaint."));
        }
    }

    private void handleMyComplaints(HttpExchange exchange) throws Exception {
        String token = HttpUtil.getBearerToken(exchange);
        SessionManager.Session session = SessionManager.getSession(token);

        if (session == null || !session.isStudent()) {
            HttpUtil.sendJsonResponse(exchange, 401, Map.of("error", "Student login required"));
            return;
        }

        Map<String, String> query = HttpUtil.parseQueryParams(exchange.getRequestURI().getQuery());
        String status = query.get("status");
        String category = query.get("category");
        String search = query.get("search");

        List<Complaint> list = complaintService.getStudentComplaints(session.getUserId(), category, status, search);
        Map<String, Integer> stats = complaintService.getStatusMetrics(session.getUserId());

        HttpUtil.sendJsonResponse(exchange, 200, Map.of(
                "complaints", list,
                "stats", stats
        ));
    }

    private void handleTrackComplaint(HttpExchange exchange, String path) throws Exception {
        String code = path.substring("/api/complaints/track/".length()).trim();
        Complaint c = complaintService.getComplaintByCode(code);
        if (c != null) {
            HttpUtil.sendJsonResponse(exchange, 200, Map.of("found", true, "complaint", c));
        } else {
            HttpUtil.sendJsonResponse(exchange, 404, Map.of("found", false, "error", "Complaint Not Found with ID: " + code));
        }
    }

    private void handleGetComplaintById(HttpExchange exchange, String path) throws Exception {
        String idStr = path.substring("/api/complaints/".length()).trim();
        int id;
        try {
            id = Integer.parseInt(idStr);
        } catch (NumberFormatException e) {
            // Could be a code like CMP1001
            Complaint c = complaintService.getComplaintByCode(idStr);
            if (c != null) {
                HttpUtil.sendJsonResponse(exchange, 200, c);
            } else {
                HttpUtil.sendJsonResponse(exchange, 404, Map.of("error", "Complaint Not Found"));
            }
            return;
        }

        Complaint c = complaintService.getComplaint(id);
        if (c != null) {
            HttpUtil.sendJsonResponse(exchange, 200, c);
        } else {
            HttpUtil.sendJsonResponse(exchange, 404, Map.of("error", "Complaint Not Found"));
        }
    }
}

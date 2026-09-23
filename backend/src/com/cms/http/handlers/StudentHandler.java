package com.cms.http.handlers;

import com.cms.http.HttpUtil;
import com.cms.security.SessionManager;
import com.cms.service.AuthService;
import com.google.gson.JsonObject;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.util.Map;

public class StudentHandler implements HttpHandler {

    private final AuthService authService = new AuthService();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (HttpUtil.handlePreflight(exchange)) return;

        String path = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod();

        try {
            if ("POST".equalsIgnoreCase(method) && path.endsWith("/register")) {
                handleRegister(exchange);
            } else if ("POST".equalsIgnoreCase(method) && path.endsWith("/login")) {
                handleLogin(exchange);
            } else if ("GET".equalsIgnoreCase(method) && path.endsWith("/me")) {
                handleMe(exchange);
            } else {
                HttpUtil.sendJsonResponse(exchange, 404, Map.of("error", "Endpoint not found: " + path));
            }
        } catch (Exception e) {
            e.printStackTrace();
            HttpUtil.sendJsonResponse(exchange, 500, Map.of("error", "Internal server error: " + e.getMessage()));
        }
    }

    private void handleRegister(HttpExchange exchange) throws Exception {
        String body = HttpUtil.readRequestBody(exchange);
        JsonObject json = HttpUtil.getGson().fromJson(body, JsonObject.class);

        String studentId = json.has("studentId") ? json.get("studentId").getAsString() : null;
        String name = json.has("name") ? json.get("name").getAsString() : null;
        String email = json.has("email") ? json.get("email").getAsString() : null;
        String phone = json.has("phone") ? json.get("phone").getAsString() : null;
        String password = json.has("password") ? json.get("password").getAsString() : null;
        String confirmPassword = json.has("confirmPassword") ? json.get("confirmPassword").getAsString() : null;

        Map<String, Object> result = authService.registerStudent(studentId, name, email, phone, password, confirmPassword);
        boolean success = Boolean.TRUE.equals(result.get("success"));
        HttpUtil.sendJsonResponse(exchange, success ? 201 : 400, result);
    }

    private void handleLogin(HttpExchange exchange) throws Exception {
        String body = HttpUtil.readRequestBody(exchange);
        JsonObject json = HttpUtil.getGson().fromJson(body, JsonObject.class);

        String studentId = json.has("studentId") ? json.get("studentId").getAsString() : null;
        if (studentId == null && json.has("username")) {
            studentId = json.get("username").getAsString();
        }
        String password = json.has("password") ? json.get("password").getAsString() : null;

        Map<String, Object> result = authService.loginStudent(studentId, password);
        boolean success = Boolean.TRUE.equals(result.get("success"));
        HttpUtil.sendJsonResponse(exchange, success ? 200 : 401, result);
    }

    private void handleMe(HttpExchange exchange) throws IOException {
        String token = HttpUtil.getBearerToken(exchange);
        SessionManager.Session session = SessionManager.getSession(token);

        if (session == null || !session.isStudent()) {
            HttpUtil.sendJsonResponse(exchange, 401, Map.of("error", "Unauthorized"));
            return;
        }

        HttpUtil.sendJsonResponse(exchange, 200, Map.of(
                "studentId", session.getUserId(),
                "name", session.getName(),
                "role", session.getRole()
        ));
    }
}

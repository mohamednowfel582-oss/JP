package com.cms.http.handlers;

import com.cms.http.HttpUtil;
import com.cms.security.SessionManager;
import com.cms.service.ReportService;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Map;

public class ReportHandler implements HttpHandler {

    private final ReportService reportService = new ReportService();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (HttpUtil.handlePreflight(exchange)) return;

        String path = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod();

        try {
            String token = HttpUtil.getBearerToken(exchange);
            SessionManager.Session session = SessionManager.getSession(token);

            if (session == null || !session.isAdmin()) {
                HttpUtil.sendJsonResponse(exchange, 401, Map.of("error", "Unauthorized: Admin access required"));
                return;
            }

            if ("GET".equalsIgnoreCase(method)) {
                if (path.endsWith("/export-csv")) {
                    String csv = reportService.generateCsv();
                    String filename = "complaints_report_" + LocalDate.now() + ".csv";
                    HttpUtil.sendCsvResponse(exchange, filename, csv);
                } else {
                    Map<String, Object> data = reportService.getAdminReportData();
                    HttpUtil.sendJsonResponse(exchange, 200, data);
                }
            } else {
                HttpUtil.sendJsonResponse(exchange, 405, Map.of("error", "Method not allowed"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            HttpUtil.sendJsonResponse(exchange, 500, Map.of("error", "Internal server error: " + e.getMessage()));
        }
    }
}

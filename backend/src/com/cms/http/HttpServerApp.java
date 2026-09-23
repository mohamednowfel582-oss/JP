package com.cms.http;

import com.cms.dao.DatabaseManager;
import com.cms.http.handlers.AdminHandler;
import com.cms.http.handlers.ComplaintHandler;
import com.cms.http.handlers.ReportHandler;
import com.cms.http.handlers.StudentHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.Executors;

public class HttpServerApp {

    private final int port;
    private HttpServer server;

    public HttpServerApp(int port) {
        this.port = port;
    }

    public void start() throws IOException {
        server = HttpServer.create(new InetSocketAddress(port), 0);

        // Register handlers
        server.createContext("/api/students", new StudentHandler());
        server.createContext("/api/complaints", new ComplaintHandler());
        server.createContext("/api/admin/reports", new ReportHandler());
        server.createContext("/api/admin", new AdminHandler());

        // Health check endpoint
        server.createContext("/api/health", exchange -> {
            if (HttpUtil.handlePreflight(exchange)) return;
            HttpUtil.sendJsonResponse(exchange, 200, Map.of(
                    "status", "UP",
                    "service", "Complaint Management System API",
                    "timestamp", LocalDateTime.now().toString()
            ));
        });

        // Default thread pool for concurrent requests
        server.setExecutor(Executors.newVirtualThreadPerTaskExecutor() != null ?
                Executors.newVirtualThreadPerTaskExecutor() : Executors.newFixedThreadPool(16));

        server.start();
        System.out.println("==================================================");
        System.out.println(" Complaint Management System Backend REST API");
        System.out.println(" Server running on: http://localhost:" + port);
        System.out.println(" Health check:      http://localhost:" + port + "/api/health");
        System.out.println("==================================================");
    }

    public void stop() {
        if (server != null) {
            server.stop(0);
        }
    }
}

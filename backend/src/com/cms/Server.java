package com.cms;

import com.cms.dao.DatabaseManager;
import com.cms.http.HttpServerApp;

import java.io.File;

public class Server {

    public static void main(String[] args) {
        int port = 8080;
        if (args.length > 0) {
            try {
                port = Integer.parseInt(args[0]);
            } catch (NumberFormatException ignored) {}
        }

        // Determine DB location: database/cms.db
        File currentDir = new File(".").getAbsoluteFile();
        File dbFile = new File(currentDir, "../database/cms.db");
        if (!dbFile.getParentFile().exists()) {
            dbFile = new File(currentDir, "database/cms.db");
        }

        try {
            System.out.println("Initializing Complaint Management System...");
            DatabaseManager.initialize(dbFile.getCanonicalPath());

            HttpServerApp server = new HttpServerApp(port);
            server.start();

            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                System.out.println("Shutting down server...");
                server.stop();
            }));
        } catch (Exception e) {
            System.err.println("Fatal error starting server: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
}

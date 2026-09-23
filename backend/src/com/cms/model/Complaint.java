package com.cms.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Extended Complaint entity that preserves original fields (complaintId, name,
 * complaintType, description, status) and provides additional enterprise portal fields.
 */
public class Complaint {
    private int id;
    private int complaintId;           // Preserved from original
    private String complaintCode;      // Formatted ID: e.g. CMP1001
    private String studentId;
    private String name;               // Student name (preserved from original)
    private String complaintType;      // Preserved from original (alias for category)
    private String category;           // Hostel, Water, Electricity, Food, Cleaning, Maintenance, Transport, Other
    private String title;
    private String description;        // Preserved from original
    private String location;
    private String priority;           // Low, Medium, High, Urgent
    private String status;             // Pending, In Progress, Resolved (preserved from original)
    private String imageUrl;
    private String createdAt;
    private String updatedAt;
    private List<Response> responses = new ArrayList<>();

    public Complaint() {
        this.status = "Pending";
    }

    // Constructor compatible with original Complaint class
    public Complaint(int complaintId, String name, String complaintType, String description) {
        this.complaintId = complaintId;
        this.id = complaintId;
        this.complaintCode = "CMP" + String.format("%04d", complaintId);
        this.name = name;
        this.complaintType = complaintType;
        this.category = complaintType;
        this.description = description;
        this.title = complaintType + " Issue";
        this.location = "Campus";
        this.priority = "Medium";
        this.status = "Pending";
    }

    // Display method preserved from original Complaint class
    public void displayComplaint() {
        System.out.println("------------------------------");
        System.out.println("Complaint ID   : " + (complaintCode != null ? complaintCode : complaintId));
        System.out.println("Name           : " + name);
        System.out.println("Type/Category  : " + (category != null ? category : complaintType));
        System.out.println("Title          : " + title);
        System.out.println("Description    : " + description);
        System.out.println("Location       : " + location);
        System.out.println("Priority       : " + priority);
        System.out.println("Status         : " + status);
        System.out.println("Created At     : " + createdAt);
        System.out.println("Last Updated   : " + updatedAt);
    }

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) {
        this.id = id;
        this.complaintId = id;
        if (this.complaintCode == null || this.complaintCode.isEmpty()) {
            this.complaintCode = "CMP" + String.format("%04d", id);
        }
    }

    public int getComplaintId() { return complaintId; }
    public void setComplaintId(int complaintId) {
        this.complaintId = complaintId;
        this.id = complaintId;
    }

    public String getComplaintCode() { return complaintCode; }
    public void setComplaintCode(String complaintCode) { this.complaintCode = complaintCode; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getComplaintType() { return complaintType != null ? complaintType : category; }
    public void setComplaintType(String complaintType) {
        this.complaintType = complaintType;
        if (this.category == null) this.category = complaintType;
    }

    public String getCategory() { return category != null ? category : complaintType; }
    public void setCategory(String category) {
        this.category = category;
        this.complaintType = category;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

    public List<Response> getResponses() { return responses; }
    public void setResponses(List<Response> responses) { this.responses = responses; }
}

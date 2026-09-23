package com.cms.model;

public class Response {
    private int id;
    private int complaintId;
    private Integer adminId;
    private String adminUsername;
    private String response;
    private String createdAt;

    public Response() {}

    public Response(int id, int complaintId, Integer adminId, String adminUsername, String response, String createdAt) {
        this.id = id;
        this.complaintId = complaintId;
        this.adminId = adminId;
        this.adminUsername = adminUsername;
        this.response = response;
        this.createdAt = createdAt;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getComplaintId() { return complaintId; }
    public void setComplaintId(int complaintId) { this.complaintId = complaintId; }

    public Integer getAdminId() { return adminId; }
    public void setAdminId(Integer adminId) { this.adminId = adminId; }

    public String getAdminUsername() { return adminUsername; }
    public void setAdminUsername(String adminUsername) { this.adminUsername = adminUsername; }

    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}

package com.cms.original;

/**
 * Original Complaint model preserved from console application.
 */
public class Complaint {

    int complaintId;
    String name;
    String complaintType;
    String description;
    String status;

    public Complaint(int complaintId, String name, String complaintType, String description) {
        this.complaintId = complaintId;
        this.name = name;
        this.complaintType = complaintType;
        this.description = description;
        this.status = "Pending";
    }

    public void displayComplaint() {
        System.out.println("------------------------------");
        System.out.println("Complaint ID : " + complaintId);
        System.out.println("Name         : " + name);
        System.out.println("Type         : " + complaintType);
        System.out.println("Description  : " + description);
        System.out.println("Status       : " + status);
    }
}

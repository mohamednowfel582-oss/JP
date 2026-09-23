package com.cms.original;

import java.util.ArrayList;

/**
 * Original ComplaintService preserved from console application.
 */
public class ComplaintService {

    ArrayList<Complaint> complaints = new ArrayList<>();

    // Register Complaint
    public void addComplaint(Complaint c) {
        complaints.add(c);
        System.out.println("Complaint Registered Successfully.");
    }

    // View All Complaints
    public void viewComplaints() {

        if (complaints.isEmpty()) {
            System.out.println("No complaints found.");
            return;
        }

        for (Complaint c : complaints) {
            c.displayComplaint();
        }
    }

    // Search Complaint
    public void searchComplaint(int id) {

        for (Complaint c : complaints) {

            if (c.complaintId == id) {

                c.displayComplaint();
                return;

            }

        }

        System.out.println("Complaint Not Found.");

    }

    // Update Complaint Status
    public void updateStatus(int id, String status) {

        for (Complaint c : complaints) {

            if (c.complaintId == id) {

                c.status = status;

                System.out.println("Complaint Status Updated Successfully.");

                return;

            }

        }

        System.out.println("Complaint Not Found.");

    }

}

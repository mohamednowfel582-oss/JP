package com.cms.original;

import java.util.Scanner;

/**
 * Original Main console application preserved intact.
 */
public class Main {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        ComplaintService service = new ComplaintService();

        int mainChoice;

        do {

            System.out.println("\n===================================");
            System.out.println(" Complaint Management System");
            System.out.println("===================================");
            System.out.println("1. Student");
            System.out.println("2. Admin");
            System.out.println("3. Exit");
            System.out.print("Enter Choice : ");

            mainChoice = sc.nextInt();

            switch (mainChoice) {

            case 1:
                studentMenu(sc, service);
                break;

            case 2:
                adminMenu(sc, service);
                break;

            case 3:
                System.out.println("Thank You...");
                break;

            default:
                System.out.println("Invalid Choice");
            }

        } while (mainChoice != 3);

        sc.close();

    }

    // Student Menu
    public static void studentMenu(Scanner sc, ComplaintService service) {

        int choice;

        do {

            System.out.println("\n===== STUDENT MENU =====");
            System.out.println("1. Register Complaint");
            System.out.println("2. Search Complaint Status");
            System.out.println("3. Back");
            System.out.print("Enter Choice : ");

            choice = sc.nextInt();
            sc.nextLine();

            switch (choice) {

            case 1:

                System.out.print("Complaint ID : ");
                int id = sc.nextInt();
                sc.nextLine();

                System.out.print("Enter Name : ");
                String name = sc.nextLine();

                System.out.print("Complaint Type : ");
                String type = sc.nextLine();

                System.out.print("Description : ");
                String desc = sc.nextLine();

                Complaint c = new Complaint(id, name, type, desc);

                service.addComplaint(c);

                break;

            case 2:

                System.out.print("Enter Complaint ID : ");
                int searchId = sc.nextInt();

                service.searchComplaint(searchId);

                break;

            case 3:

                break;

            default:

                System.out.println("Invalid Choice");

            }

        } while (choice != 3);

    }

    // Admin Menu
    public static void adminMenu(Scanner sc, ComplaintService service) {

        sc.nextLine();

        System.out.println("\n===== ADMIN LOGIN =====");

        System.out.print("Username : ");
        String username = sc.nextLine();

        System.out.print("Password : ");
        String password = sc.nextLine();

        if (username.equals("admin") && password.equals("admin123")) {

            int choice;

            do {

                System.out.println("\n===== ADMIN MENU =====");
                System.out.println("1. View Complaints");
                System.out.println("2. Update Complaint Status");
                System.out.println("3. Logout");
                System.out.print("Enter Choice : ");

                choice = sc.nextInt();

                switch (choice) {

                case 1:

                    service.viewComplaints();

                    break;

                case 2:

                    System.out.print("Enter Complaint ID : ");
                    int id = sc.nextInt();

                    System.out.println("\n1. Pending");
                    System.out.println("2. In Progress");
                    System.out.println("3. Resolved");
                    System.out.print("Choose Status : ");

                    int statusChoice = sc.nextInt();

                    String status = "";

                    if (statusChoice == 1)
                        status = "Pending";
                    else if (statusChoice == 2)
                        status = "In Progress";
                    else if (statusChoice == 3)
                        status = "Resolved";
                    else {
                        System.out.println("Invalid Status");
                        break;
                    }

                    service.updateStatus(id, status);

                    break;

                case 3:

                    System.out.println("Logged Out Successfully");

                    break;

                default:

                    System.out.println("Invalid Choice");

                }

            } while (choice != 3);

        } else {

            System.out.println("Invalid Username or Password");

        }

    }

}

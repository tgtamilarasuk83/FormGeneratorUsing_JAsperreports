import net.sf.jasperreports.engine.*;
import java.sql.*;
import java.util.HashMap;

public class generateReport {
    public static void main(String[] args) {

        if (args.length == 0) {
            System.err.println("Error: Fullname not provided");
            System.exit(1);
        }

        String fullname = args[0];

        String dbURL = "jdbc:mysql://localhost:3306/resume_db";
        String dbUser = "root";
        String dbPass = "root";

        Connection conn = null;

        try {
            // Load Driver
            Class.forName("com.mysql.cj.jdbc.Driver");

            // Connect DB
            conn = DriverManager.getConnection(dbURL, dbUser, dbPass);
            System.out.println("✅ Connected to DB");

            // Correct JRXML path (IMPORTANT)
            String jrxmlPath = "reports/Blank_A4_1.jrxml";

            // Compile report
            JasperReport jasperReport = JasperCompileManager.compileReport(jrxmlPath);

            // Parameters map
            HashMap<String, Object> params = new HashMap<>();

            // ✅ Use PreparedStatement (FIXED)
            String query = "SELECT * FROM resume_details WHERE fullname = ? ORDER BY created_at DESC LIMIT 1";
            PreparedStatement pstmt = conn.prepareStatement(query);
            pstmt.setString(1, fullname);

            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                params.put("fullname", rs.getString("fullname"));
                params.put("mobile", rs.getString("mobile"));
                params.put("email", rs.getString("email"));
                params.put("address", rs.getString("address"));
                params.put("linkedin", rs.getString("linkedin"));
                params.put("objective", rs.getString("objective"));
                params.put("degree", rs.getString("degree"));
                params.put("college", rs.getString("college"));
                params.put("cgpa", rs.getString("cgpa"));
                params.put("duration", rs.getString("duration"));
                params.put("hsc", rs.getString("hsc"));
                params.put("sslc", rs.getString("sslc"));
                params.put("projects", rs.getString("projects"));
                params.put("area_of_interest", rs.getString("area_of_interest"));
                params.put("technical_skills", rs.getString("technical_skills"));
                params.put("programming_languages", rs.getString("programming_languages"));
                params.put("software_tools", rs.getString("software_tools"));
                params.put("internships", rs.getString("internships"));
                params.put("certifications", rs.getString("certifications"));
            } else {
                System.out.println("⚠️ No data found, using minimal data");
                params.put("fullname", fullname);
            }

            rs.close();
            pstmt.close();

            // Generate PDF
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, params, conn);

            // Safe filename
            String safeName = fullname.replaceAll("[^a-zA-Z0-9]", "_");
            String outputPath = "reports/" + safeName + "_Resume.pdf";

            JasperExportManager.exportReportToPdfFile(jasperPrint, outputPath);

            System.out.println("✅ Report generated: " + outputPath);

        } catch (ClassNotFoundException e) {
            System.err.println("❌ MySQL Driver not found (Add mysql-connector-j.jar)");
            e.printStackTrace();

        } catch (JRException e) {
            System.err.println("❌ JasperReports error (Check JRXML file path/design)");
            e.printStackTrace();

        } catch (SQLException e) {
            System.err.println("❌ Database error");
            e.printStackTrace();

        } catch (Exception e) {
            System.err.println("❌ Unknown error");
            e.printStackTrace();

        } finally {
            try {
                if (conn != null) conn.close();
            } catch (Exception e) {
                System.err.println("❌ Error closing DB");
            }
        }
    }
}

const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "resume_db"
});

db.connect(err => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL Database");
});

// Reports directory
const reportsDir = path.join(__dirname, "reports");

// Ensure reports folder exists
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir);
}

// API route
app.post("/submit", (req, res) => {
  const {
    fullname,
    mobile,
    email,
    address,
    linkedin,
    objective,
    degree,
    college,
    cgpa,
    duration,
    hsc,
    sslc,
    projects,
    area_of_interest,
    technical_skills,
    programming_languages,
    software_tools,
    internships,
    certifications
  } = req.body;

  // Insert query
  const sql = `INSERT INTO resume_details 
  (fullname, mobile, email, address, linkedin, objective, degree, college, cgpa, duration, hsc, sslc, projects, area_of_interest, technical_skills, programming_languages, software_tools, internships, certifications)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [
    fullname, mobile, email, address, linkedin, objective,
    degree, college, cgpa, duration, hsc, sslc, projects,
    area_of_interest, technical_skills, programming_languages,
    software_tools, internships, certifications
  ], (err, result) => {

    if (err) {
      console.error("❌ Error inserting data:", err);
      return res.status(500).send("Database insertion failed");
    }

    console.log("✅ Data inserted successfully");

    // Safe filename
    const safeName = fullname.replace(/\s+/g, "_");
    const pdfFilename = `${safeName}_Resume.pdf`;
    const pdfPath = path.join(reportsDir, pdfFilename);

    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const stream = fs.createWriteStream(pdfPath);

      doc.pipe(stream);

      // Title
      doc.fontSize(24).font("Helvetica-Bold").text(fullname, { align: "center" });
      doc.moveDown(0.5);

      // Contact
      doc.fontSize(10).font("Helvetica").text(`Email: ${email} | Mobile: ${mobile}`);
      if (address) doc.text(`Address: ${address}`);
      if (linkedin) doc.text(`LinkedIn: ${linkedin}`);
      doc.moveDown();

      // Objective
      if (objective?.trim()) {
        doc.fontSize(12).font("Helvetica-Bold").text("OBJECTIVE");
        doc.fontSize(10).font("Helvetica").text(objective);
        doc.moveDown();
      }

      // Education
      if (degree || college) {
        doc.fontSize(12).font("Helvetica-Bold").text("EDUCATION");
        if (degree && college) doc.fontSize(10).text(`${degree} - ${college}`);
        if (cgpa) doc.text(`CGPA: ${cgpa}`);
        if (duration) doc.text(`Duration: ${duration}`);
        if (hsc) doc.text(`HSC: ${hsc}`);
        if (sslc) doc.text(`SSLC: ${sslc}`);
        doc.moveDown();
      }

      // Skills
      if (technical_skills?.trim()) {
        doc.fontSize(12).font("Helvetica-Bold").text("TECHNICAL SKILLS");
        doc.fontSize(10).text(technical_skills);
        doc.moveDown();
      }

      if (programming_languages?.trim()) {
        doc.fontSize(12).font("Helvetica-Bold").text("PROGRAMMING LANGUAGES");
        doc.fontSize(10).text(programming_languages);
        doc.moveDown();
      }

      if (software_tools?.trim()) {
        doc.fontSize(12).font("Helvetica-Bold").text("SOFTWARE TOOLS");
        doc.fontSize(10).text(software_tools);
        doc.moveDown();
      }

      // Projects
      if (projects?.trim()) {
        doc.fontSize(12).font("Helvetica-Bold").text("PROJECTS");
        doc.fontSize(10).text(projects);
        doc.moveDown();
      }

      // Interests
      if (area_of_interest?.trim()) {
        doc.fontSize(12).font("Helvetica-Bold").text("AREA OF INTEREST");
        doc.fontSize(10).text(area_of_interest);
        doc.moveDown();
      }

      // Internships
      if (internships?.trim()) {
        doc.fontSize(12).font("Helvetica-Bold").text("INTERNSHIPS");
        doc.fontSize(10).text(internships);
        doc.moveDown();
      }

      // Certifications
      if (certifications?.trim()) {
        doc.fontSize(12).font("Helvetica-Bold").text("CERTIFICATIONS");
        doc.fontSize(10).text(certifications);
        doc.moveDown();
      }

      // Footer
      doc.fontSize(8).text("Generated Resume", { align: "center" });

      doc.end();

      // After PDF created
      stream.on("finish", () => {
        console.log("✅ PDF generated:", pdfPath);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=${pdfFilename}`);

        res.download(pdfPath, pdfFilename, (err) => {
          if (err) console.error("❌ Download error:", err);

          // Delete file after download
          fs.unlink(pdfPath, (err) => {
            if (err) console.error("⚠️ File delete error:", err);
          });
        });
      });

      stream.on("error", (err) => {
        console.error("❌ PDF write error:", err);
        res.status(500).json({ error: "PDF generation failed" });
      });

    } catch (error) {
      console.error("❌ Error generating PDF:", error);
      res.status(500).json({ error: error.message });
    }

  }); // db.query
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

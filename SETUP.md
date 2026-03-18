# Resume Form - PDF Download Setup Guide

## 🔧 Changes Made

### ✅ Fixed Issues:
1. **Removed broken `node-jasper` dependency** - Replaced with Java child process for PDF generation
2. **Fixed form field name mismatches** - `languages` → `programming_languages`, `tools` → `software_tools`
3. **Implemented proper PDF download** - Browser will automatically download PDF when form is submitted
4. **Added error handling** - Proper error messages for database and PDF generation failures
5. **Updated package.json** - Added correct dependencies

---

## 📋 Prerequisites

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **JasperReports JARs Setup**
Create a `lib/` folder in the project root and copy the JasperReports JARs:
```
d:\form page\lib\
  ├── jasperreports-7.0.3.jar
  ├── jasperreports-jdt-7.0.3.jar
  ├── jasperreports-fonts-7.0.3.jar
  ├── commons-*.jar
  └── mysql-connector-java-8.x.x.jar (MySQL driver)
```

You can extract these from:
- JasperReports: `jasperreports-7.0.3-project/jasperreports-7.0.3/dist/`
- MySQL driver: Download from maven.org

### 3. **Compile Java File**
```bash
javac -cp "lib/*;." generateReport.java
```

### 4. **MySQL Database Setup**
Make sure the database table exists:
```sql
CREATE TABLE resume_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullname VARCHAR(255),
  mobile VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  linkedin VARCHAR(255),
  objective TEXT,
  degree VARCHAR(255),
  college VARCHAR(255),
  cgpa VARCHAR(10),
  duration VARCHAR(50),
  hsc VARCHAR(255),
  sslc VARCHAR(255),
  projects TEXT,
  area_of_interest TEXT,
  technical_skills TEXT,
  programming_languages TEXT,
  software_tools TEXT,
  internships TEXT,
  certifications TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Running the Application

### Start the Server:
```bash
node app.js
```

You should see:
```
✅ Connected to MySQL Database
🚀 Server running at http://localhost:5000
```

### Access the Form:
Open browser: `http://localhost:5000`

---

## 📝 How It Works

1. **User fills form** → Data submitted to backend
2. **Backend saves to database** → Insert into MySQL
3. **Java program called** → Generates PDF from JRXML template
4. **PDF returned to browser** → Automatically downloads as `{fullname}_Resume.pdf`

---

## ⚠️ Common Issues & Fixes

### Issue: "Failed to generate PDF report"
- **Check**: JARs in `lib/` folder exist
- **Check**: Java is installed and in PATH
- **Check**: `generateReport.class` is compiled
- **Check**: Reports folder exists

### Issue: "Database insertion failed"
- **Check**: MySQL is running on localhost:3306
- **Check**: Database `resume_db` exists
- **Check**: Table `resume_details` exists with correct schema

### Issue: PDF not downloading
- **Check**: Browser console for errors
- **Check**: Server logs for Java errors
- **Check**: `reports/` folder has write permissions

---

## 📦 Project Structure
```
d:\form page\
├── app.js                           (Node.js server)
├── generateReport.java               (Java PDF generator)
├── generateReport.class              (Compiled Java)
├── package.json                      (Dependencies)
├── public/
│   └── index.html                    (Form UI)
├── reports/
│   ├── Blank_A4_1.jrxml             (Report template)
│   └── {fullname}_Resume.pdf         (Generated PDFs)
├── lib/                              (JasperReports JARs)
└── SETUP.md                          (This file)
```

---

## ✨ Testing the Workflow

1. Fill out all form fields
2. Click **Submit Resume**
3. Check:
   - ✅ Data inserted in database
   - ✅ PDF generated in reports/ folder
   - ✅ PDF automatically downloaded to your computer

---

## 🆘 Need Help?

Check the console output:
```bash
node app.js
```

The server logs will show:
- Connection status
- Database insertions
- Java process output
- PDF generation status

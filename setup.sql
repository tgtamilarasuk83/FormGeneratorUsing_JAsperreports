-- Resume Database Setup Script
-- Run this file with: mysql -u root -p < setup.sql

CREATE DATABASE IF NOT EXISTS resume_db;
USE resume_db;

CREATE TABLE IF NOT EXISTS resume_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullname VARCHAR(255) NOT NULL,
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_fullname (fullname)
);

-- Verify table was created
SELECT '✅ Database setup complete!' as status;
SHOW TABLES;

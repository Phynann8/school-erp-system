-- SchoolERP Dummy Data Script
-- Run this script in SSMS against the SchoolERP database

USE SchoolERP;
GO

-- ============================================
-- 1. CAMPUSES (Additional campuses)
-- ============================================
SET IDENTITY_INSERT Campuses ON;
INSERT INTO Campuses (CampusId, CampusCode, Name, IsActive, CreatedAt) VALUES
(2, 'BKK', 'Bangkok Campus', 1, GETUTCDATE()),
(3, 'CNX', 'Chiang Mai Campus', 1, GETUTCDATE()),
(4, 'PKT', 'Phuket Campus', 1, GETUTCDATE());
SET IDENTITY_INSERT Campuses OFF;
GO

-- ============================================
-- 2. ROLES (Additional roles)
-- ============================================
SET IDENTITY_INSERT Roles ON;
INSERT INTO Roles (RoleId, RoleName) VALUES
(2, 'Teacher'),
(3, 'Accountant'),
(4, 'Registrar'),
(5, 'Parent');
SET IDENTITY_INSERT Roles OFF;
GO

-- ============================================
-- 3. PROGRAMS
-- ============================================
SET IDENTITY_INSERT Programs ON;
INSERT INTO Programs (ProgramId, Name) VALUES
(1, 'Primary Education'),
(2, 'Secondary Education'),
(3, 'High School'),
(4, 'International Program');
SET IDENTITY_INSERT Programs OFF;
GO

-- ============================================
-- 4. GRADES
-- ============================================
SET IDENTITY_INSERT Grades ON;
INSERT INTO Grades (GradeId, ProgramId, Name) VALUES
-- Primary (1-6)
(1, 1, 'Grade 1'),
(2, 1, 'Grade 2'),
(3, 1, 'Grade 3'),
(4, 1, 'Grade 4'),
(5, 1, 'Grade 5'),
(6, 1, 'Grade 6'),
-- Secondary (7-9)
(7, 2, 'Grade 7'),
(8, 2, 'Grade 8'),
(9, 2, 'Grade 9'),
-- High School (10-12)
(10, 3, 'Grade 10'),
(11, 3, 'Grade 11'),
(12, 3, 'Grade 12'),
-- International
(13, 4, 'Year 1'),
(14, 4, 'Year 2'),
(15, 4, 'Year 3');
SET IDENTITY_INSERT Grades OFF;
GO

-- ============================================
-- 5. CLASSES
-- ============================================
SET IDENTITY_INSERT Classes ON;
INSERT INTO Classes (ClassId, CampusId, GradeId, Name) VALUES
-- HQ Campus Classes
(1, 1, 1, 'Grade 1A'),
(2, 1, 1, 'Grade 1B'),
(3, 1, 2, 'Grade 2A'),
(4, 1, 2, 'Grade 2B'),
(5, 1, 3, 'Grade 3A'),
(6, 1, 7, 'Grade 7A'),
(7, 1, 7, 'Grade 7B'),
(8, 1, 10, 'Grade 10A'),
-- Bangkok Campus Classes
(9, 2, 1, 'Grade 1A'),
(10, 2, 2, 'Grade 2A'),
(11, 2, 7, 'Grade 7A'),
(12, 2, 10, 'Grade 10A'),
-- Chiang Mai Campus
(13, 3, 13, 'Year 1A'),
(14, 3, 14, 'Year 2A');
SET IDENTITY_INSERT Classes OFF;
GO

-- ============================================
-- 6. GUARDIANS
-- ============================================
SET IDENTITY_INSERT Guardians ON;
INSERT INTO Guardians (GuardianId, FullName, Phone, Email, Address) VALUES
(1, 'John Smith', '089-123-4567', 'john.smith@email.com', '123 Main Street, Bangkok'),
(2, 'Sarah Smith', '089-123-4568', 'sarah.smith@email.com', '123 Main Street, Bangkok'),
(3, 'Michael Johnson', '081-234-5678', 'michael.j@email.com', '456 Oak Avenue, Bangkok'),
(4, 'Emily Johnson', '081-234-5679', 'emily.j@email.com', '456 Oak Avenue, Bangkok'),
(5, 'David Lee', '082-345-6789', 'david.lee@email.com', '789 Pine Road, Chiang Mai'),
(6, 'Jennifer Lee', '082-345-6790', 'jennifer.lee@email.com', '789 Pine Road, Chiang Mai'),
(7, 'Robert Brown', '083-456-7890', 'robert.brown@email.com', '321 Elm Street, Phuket'),
(8, 'Lisa Brown', '083-456-7891', 'lisa.brown@email.com', '321 Elm Street, Phuket'),
(9, 'William Davis', '084-567-8901', 'william.d@email.com', '654 Maple Lane, Bangkok'),
(10, 'Amanda Davis', '084-567-8902', 'amanda.d@email.com', '654 Maple Lane, Bangkok');
SET IDENTITY_INSERT Guardians OFF;
GO

-- ============================================
-- 7. STUDENTS
-- ============================================
SET IDENTITY_INSERT Students ON;
INSERT INTO Students (StudentId, CampusId, StudentCode, KhmerName, EnglishName, DOB, Gender, Status, ProgramId, GradeId, ClassId, CreatedAt) VALUES
-- HQ Campus Students
(1, 1, 'STU-2024-0001', N'សុខ វិចិត្រ', 'Sok Vichit', '2017-03-15', 'Male', 'Active', 1, 1, 1, GETUTCDATE()),
(2, 1, 'STU-2024-0002', N'ចាន់ សុភា', 'Chan Sophy', '2017-05-22', 'Female', 'Active', 1, 1, 1, GETUTCDATE()),
(3, 1, 'STU-2024-0003', N'លី មករា', 'Ly Makara', '2017-01-10', 'Male', 'Active', 1, 1, 2, GETUTCDATE()),
(4, 1, 'STU-2024-0004', N'គឹម ស្រីពេជ្រ', 'Kim Sreypich', '2016-08-28', 'Female', 'Active', 1, 2, 3, GETUTCDATE()),
(5, 1, 'STU-2024-0005', N'ហេង បូរ៉ា', 'Heng Bora', '2016-11-05', 'Male', 'Active', 1, 2, 4, GETUTCDATE()),
(6, 1, 'STU-2024-0006', N'នួន រតនា', 'Noun Ratana', '2015-04-18', 'Female', 'Active', 1, 3, 5, GETUTCDATE()),
(7, 1, 'STU-2024-0007', N'សំ វុទ្ធី', 'Sam Vuthy', '2011-07-12', 'Male', 'Active', 2, 7, 6, GETUTCDATE()),
(8, 1, 'STU-2024-0008', N'អ៊ុក ចន្ថា', 'Ouk Chantha', '2011-02-25', 'Female', 'Active', 2, 7, 7, GETUTCDATE()),
(9, 1, 'STU-2024-0009', N'ផន សុវណ្ណ', 'Phon Sovann', '2008-09-30', 'Male', 'Active', 3, 10, 8, GETUTCDATE()),
(10, 1, 'STU-2024-0010', N'ម៉ន ស្រីណែន', 'Mon Sreynean', '2008-12-14', 'Female', 'Active', 3, 10, 8, GETUTCDATE()),
-- Bangkok Campus Students
(11, 2, 'STU-2024-0011', 'James Wilson', 'James Wilson', '2017-06-20', 'Male', 'Active', 1, 1, 9, GETUTCDATE()),
(12, 2, 'STU-2024-0012', 'Emma Thompson', 'Emma Thompson', '2016-09-15', 'Female', 'Active', 1, 2, 10, GETUTCDATE()),
(13, 2, 'STU-2024-0013', 'Oliver Martinez', 'Oliver Martinez', '2011-04-08', 'Male', 'Active', 2, 7, 11, GETUTCDATE()),
(14, 2, 'STU-2024-0014', 'Sophia Garcia', 'Sophia Garcia', '2008-11-22', 'Female', 'Active', 3, 10, 12, GETUTCDATE()),
-- Chiang Mai Campus (International)
(15, 3, 'STU-2024-0015', 'Alexander Chen', 'Alexander Chen', '2018-01-30', 'Male', 'Active', 4, 13, 13, GETUTCDATE()),
(16, 3, 'STU-2024-0016', 'Isabella Wang', 'Isabella Wang', '2017-07-14', 'Female', 'Active', 4, 14, 14, GETUTCDATE());
SET IDENTITY_INSERT Students OFF;
GO

-- ============================================
-- 8. STUDENT-GUARDIAN RELATIONSHIPS
-- ============================================
INSERT INTO StudentGuardians (StudentId, GuardianId, Relationship, IsPrimary) VALUES
(1, 1, 'Father', 1),
(1, 2, 'Mother', 0),
(2, 3, 'Father', 1),
(2, 4, 'Mother', 0),
(3, 5, 'Father', 1),
(4, 5, 'Father', 1),
(4, 6, 'Mother', 0),
(5, 7, 'Father', 1),
(6, 7, 'Father', 1),
(6, 8, 'Mother', 0),
(7, 9, 'Father', 1),
(7, 10, 'Mother', 0),
(8, 1, 'Father', 1),
(9, 3, 'Father', 1),
(10, 5, 'Father', 1),
(11, 7, 'Father', 1),
(12, 9, 'Father', 1),
(13, 1, 'Guardian', 1),
(14, 3, 'Guardian', 1),
(15, 5, 'Father', 1),
(16, 7, 'Father', 1);
GO

-- ============================================
-- 9. FEE TEMPLATES
-- ============================================
SET IDENTITY_INSERT FeeTemplates ON;
INSERT INTO FeeTemplates (FeeTemplateId, CampusId, Name, Frequency, IsActive) VALUES
(1, 1, 'Primary School - Monthly', 'Monthly', 1),
(2, 1, 'Secondary School - Monthly', 'Monthly', 1),
(3, 1, 'High School - Monthly', 'Monthly', 1),
(4, 2, 'Bangkok Primary - Monthly', 'Monthly', 1),
(5, 2, 'Bangkok Secondary - Monthly', 'Monthly', 1),
(6, 3, 'International Program - Annual', 'Annual', 1);
SET IDENTITY_INSERT FeeTemplates OFF;
GO

-- ============================================
-- 10. FEE TEMPLATE ITEMS
-- ============================================
SET IDENTITY_INSERT FeeTemplateItems ON;
INSERT INTO FeeTemplateItems (FeeTemplateItemId, FeeTemplateId, FeeName, Amount, IsOptional) VALUES
-- Primary School Fees (Template 1)
(1, 1, 'Tuition Fee', 150.00, 0),
(2, 1, 'Library Fee', 10.00, 0),
(3, 1, 'Sports Fee', 15.00, 0),
(4, 1, 'Lunch Program', 50.00, 1),
(5, 1, 'Transportation', 80.00, 1),
-- Secondary School Fees (Template 2)
(6, 2, 'Tuition Fee', 200.00, 0),
(7, 2, 'Library Fee', 15.00, 0),
(8, 2, 'Lab Fee', 25.00, 0),
(9, 2, 'Sports Fee', 20.00, 0),
(10, 2, 'Lunch Program', 50.00, 1),
-- High School Fees (Template 3)
(11, 3, 'Tuition Fee', 250.00, 0),
(12, 3, 'Library Fee', 20.00, 0),
(13, 3, 'Lab Fee', 35.00, 0),
(14, 3, 'Technology Fee', 30.00, 0),
(15, 3, 'Sports Fee', 25.00, 0),
-- Bangkok Primary (Template 4)
(16, 4, 'Tuition Fee', 180.00, 0),
(17, 4, 'Facilities Fee', 20.00, 0),
(18, 4, 'Activities Fee', 25.00, 0),
-- Bangkok Secondary (Template 5)
(19, 5, 'Tuition Fee', 230.00, 0),
(20, 5, 'Facilities Fee', 25.00, 0),
(21, 5, 'Lab Fee', 30.00, 0),
-- International Program (Template 6)
(22, 6, 'Annual Tuition', 5000.00, 0),
(23, 6, 'Registration Fee', 500.00, 0),
(24, 6, 'Technology Package', 300.00, 0),
(25, 6, 'International Activities', 400.00, 1);
SET IDENTITY_INSERT FeeTemplateItems OFF;
GO

-- ============================================
-- 11. STUDENT FEE PLANS
-- ============================================
SET IDENTITY_INSERT StudentFeePlans ON;
INSERT INTO StudentFeePlans (StudentFeePlanId, StudentId, FeeTemplateId, StartDate, EndDate, Status) VALUES
(1, 1, 1, '2024-01-01', '2024-12-31', 'Active'),
(2, 2, 1, '2024-01-01', '2024-12-31', 'Active'),
(3, 3, 1, '2024-01-01', '2024-12-31', 'Active'),
(4, 4, 1, '2024-01-01', '2024-12-31', 'Active'),
(5, 5, 1, '2024-01-01', '2024-12-31', 'Active'),
(6, 6, 1, '2024-01-01', '2024-12-31', 'Active'),
(7, 7, 2, '2024-01-01', '2024-12-31', 'Active'),
(8, 8, 2, '2024-01-01', '2024-12-31', 'Active'),
(9, 9, 3, '2024-01-01', '2024-12-31', 'Active'),
(10, 10, 3, '2024-01-01', '2024-12-31', 'Active'),
(11, 11, 4, '2024-01-01', '2024-12-31', 'Active'),
(12, 12, 4, '2024-01-01', '2024-12-31', 'Active'),
(13, 13, 5, '2024-01-01', '2024-12-31', 'Active'),
(14, 14, 5, '2024-01-01', '2024-12-31', 'Active'),
(15, 15, 6, '2024-01-01', '2024-12-31', 'Active'),
(16, 16, 6, '2024-01-01', '2024-12-31', 'Active');
SET IDENTITY_INSERT StudentFeePlans OFF;
GO

-- ============================================
-- 12. INVOICES
-- ============================================
SET IDENTITY_INSERT Invoices ON;
INSERT INTO Invoices (InvoiceId, StudentId, InvoiceNumber, IssueDate, DueDate, TotalAmount, PaidAmount, Balance, Status) VALUES
-- January 2024 Invoices
(1, 1, 'INV-2024-0001', '2024-01-01', '2024-01-15', 225.00, 225.00, 0.00, 'Paid'),
(2, 2, 'INV-2024-0002', '2024-01-01', '2024-01-15', 175.00, 175.00, 0.00, 'Paid'),
(3, 3, 'INV-2024-0003', '2024-01-01', '2024-01-15', 175.00, 100.00, 75.00, 'Partial'),
(4, 4, 'INV-2024-0004', '2024-01-01', '2024-01-15', 225.00, 225.00, 0.00, 'Paid'),
(5, 7, 'INV-2024-0005', '2024-01-01', '2024-01-15', 310.00, 310.00, 0.00, 'Paid'),
(6, 9, 'INV-2024-0006', '2024-01-01', '2024-01-15', 360.00, 0.00, 360.00, 'Pending'),
-- February 2024 Invoices
(7, 1, 'INV-2024-0007', '2024-02-01', '2024-02-15', 225.00, 225.00, 0.00, 'Paid'),
(8, 2, 'INV-2024-0008', '2024-02-01', '2024-02-15', 175.00, 0.00, 175.00, 'Overdue'),
(9, 5, 'INV-2024-0009', '2024-02-01', '2024-02-15', 175.00, 175.00, 0.00, 'Paid'),
(10, 7, 'INV-2024-0010', '2024-02-01', '2024-02-15', 260.00, 260.00, 0.00, 'Paid'),
-- International Program Annual Invoice
(11, 15, 'INV-2024-0011', '2024-01-01', '2024-02-01', 6200.00, 6200.00, 0.00, 'Paid'),
(12, 16, 'INV-2024-0012', '2024-01-01', '2024-02-01', 5800.00, 3000.00, 2800.00, 'Partial');
SET IDENTITY_INSERT Invoices OFF;
GO

-- ============================================
-- 13. INVOICE ITEMS
-- ============================================
SET IDENTITY_INSERT InvoiceItems ON;
INSERT INTO InvoiceItems (InvoiceItemId, InvoiceId, Description, Amount) VALUES
-- Invoice 1 Items
(1, 1, 'Tuition Fee - January 2024', 150.00),
(2, 1, 'Library Fee', 10.00),
(3, 1, 'Sports Fee', 15.00),
(4, 1, 'Lunch Program', 50.00),
-- Invoice 2 Items
(5, 2, 'Tuition Fee - January 2024', 150.00),
(6, 2, 'Library Fee', 10.00),
(7, 2, 'Sports Fee', 15.00),
-- Invoice 3 Items
(8, 3, 'Tuition Fee - January 2024', 150.00),
(9, 3, 'Library Fee', 10.00),
(10, 3, 'Sports Fee', 15.00),
-- Invoice 5 Items (Secondary)
(11, 5, 'Tuition Fee - January 2024', 200.00),
(12, 5, 'Library Fee', 15.00),
(13, 5, 'Lab Fee', 25.00),
(14, 5, 'Sports Fee', 20.00),
(15, 5, 'Lunch Program', 50.00),
-- Invoice 6 Items (High School)
(16, 6, 'Tuition Fee - January 2024', 250.00),
(17, 6, 'Library Fee', 20.00),
(18, 6, 'Lab Fee', 35.00),
(19, 6, 'Technology Fee', 30.00),
(20, 6, 'Sports Fee', 25.00),
-- Invoice 11 (International)
(21, 11, 'Annual Tuition 2024', 5000.00),
(22, 11, 'Registration Fee', 500.00),
(23, 11, 'Technology Package', 300.00),
(24, 11, 'International Activities', 400.00),
-- Invoice 12 (International)
(25, 12, 'Annual Tuition 2024', 5000.00),
(26, 12, 'Registration Fee', 500.00),
(27, 12, 'Technology Package', 300.00);
SET IDENTITY_INSERT InvoiceItems OFF;
GO

-- ============================================
-- 14. PAYMENTS
-- ============================================
SET IDENTITY_INSERT Payments ON;
INSERT INTO Payments (PaymentId, InvoiceId, ReceiptNumber, PaymentDate, Amount, PaymentMethod, ReferenceNumber, ReceivedBy) VALUES
(1, 1, 'RCP-2024-0001', '2024-01-10', 225.00, 'Cash', NULL, 'admin'),
(2, 2, 'RCP-2024-0002', '2024-01-12', 175.00, 'Bank Transfer', 'TRF-123456', 'admin'),
(3, 3, 'RCP-2024-0003', '2024-01-08', 100.00, 'Cash', NULL, 'admin'),
(4, 4, 'RCP-2024-0004', '2024-01-05', 225.00, 'Credit Card', 'CC-789012', 'admin'),
(5, 5, 'RCP-2024-0005', '2024-01-14', 310.00, 'Bank Transfer', 'TRF-234567', 'admin'),
(6, 7, 'RCP-2024-0006', '2024-02-08', 225.00, 'Cash', NULL, 'admin'),
(7, 9, 'RCP-2024-0007', '2024-02-10', 175.00, 'Bank Transfer', 'TRF-345678', 'admin'),
(8, 10, 'RCP-2024-0008', '2024-02-12', 260.00, 'Cash', NULL, 'admin'),
(9, 11, 'RCP-2024-0009', '2024-01-15', 6200.00, 'Bank Transfer', 'TRF-456789', 'admin'),
(10, 12, 'RCP-2024-0010', '2024-01-20', 3000.00, 'Bank Transfer', 'TRF-567890', 'admin');
SET IDENTITY_INSERT Payments OFF;
GO

-- ============================================
-- 15. ADDITIONAL USER CAMPUS ACCESS
-- ============================================
-- Give admin access to all campuses
INSERT INTO UserCampusAccesses (UserId, CampusId, AccessLevel) VALUES
(1, 2, 'Write'),
(1, 3, 'Write'),
(1, 4, 'Write');
GO

PRINT 'Dummy data import completed successfully!';
PRINT '';
PRINT 'Summary:';
PRINT '- 4 Campuses (HQ, Bangkok, Chiang Mai, Phuket)';
PRINT '- 5 Roles (Admin, Teacher, Accountant, Registrar, Parent)';
PRINT '- 4 Programs (Primary, Secondary, High School, International)';
PRINT '- 15 Grades';
PRINT '- 14 Classes';
PRINT '- 10 Guardians';
PRINT '- 16 Students';
PRINT '- 6 Fee Templates with 25 Fee Items';
PRINT '- 12 Invoices with various statuses';
PRINT '- 10 Payments';
GO

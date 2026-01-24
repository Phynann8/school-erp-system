USE SchoolERP;
GO

/* ----------------------------------------------------
   Phase 1 Schema - Init
   ---------------------------------------------------- */

-- 1. Campuses
CREATE TABLE dbo.Campuses (
    CampusId INT IDENTITY(1,1) PRIMARY KEY,
    CampusCode NVARCHAR(50) NOT NULL UNIQUE,
    Name NVARCHAR(200) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

-- 2. Identity & RBAC
CREATE TABLE dbo.Roles (
    RoleId INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE dbo.Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(500) NOT NULL,
    FullName NVARCHAR(200) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE dbo.UserRoles (
    UserId INT NOT NULL,
    RoleId INT NOT NULL,
    PRIMARY KEY(UserId, RoleId),
    FOREIGN KEY(UserId) REFERENCES dbo.Users(UserId),
    FOREIGN KEY(RoleId) REFERENCES dbo.Roles(RoleId)
);

CREATE TABLE dbo.UserCampusAccess (
    UserId INT NOT NULL,
    CampusId INT NOT NULL,
    AccessLevel NVARCHAR(20) NOT NULL, -- Read, Write, Admin
    PRIMARY KEY(UserId, CampusId),
    FOREIGN KEY(UserId) REFERENCES dbo.Users(UserId),
    FOREIGN KEY(CampusId) REFERENCES dbo.Campuses(CampusId)
);

-- 3. Academic Structure
CREATE TABLE dbo.Programs (
    ProgramId INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE dbo.Grades (
    GradeId INT IDENTITY(1,1) PRIMARY KEY,
    ProgramId INT NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    FOREIGN KEY(ProgramId) REFERENCES dbo.Programs(ProgramId)
);

CREATE TABLE dbo.Classes (
    ClassId INT IDENTITY(1,1) PRIMARY KEY,
    CampusId INT NOT NULL,
    GradeId INT NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    FOREIGN KEY(CampusId) REFERENCES dbo.Campuses(CampusId),
    FOREIGN KEY(GradeId) REFERENCES dbo.Grades(GradeId)
);

-- 4. Students
CREATE TABLE dbo.Students (
    StudentId INT IDENTITY(1,1) PRIMARY KEY,
    CampusId INT NOT NULL,
    StudentCode NVARCHAR(50) NOT NULL UNIQUE,
    KhmerName NVARCHAR(200),
    EnglishName NVARCHAR(200),
    DOB DATE,
    Gender NVARCHAR(20),
    Status NVARCHAR(20) NOT NULL DEFAULT 'Active',
    ProgramId INT,
    GradeId INT,
    ClassId INT,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    FOREIGN KEY(CampusId) REFERENCES dbo.Campuses(CampusId),
    FOREIGN KEY(ProgramId) REFERENCES dbo.Programs(ProgramId),
    FOREIGN KEY(GradeId) REFERENCES dbo.Grades(GradeId),
    FOREIGN KEY(ClassId) REFERENCES dbo.Classes(ClassId)
);

CREATE TABLE dbo.Guardians (
    GuardianId INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(200) NOT NULL,
    Phone NVARCHAR(50),
    Email NVARCHAR(200),
    Address NVARCHAR(500)
);

CREATE TABLE dbo.StudentGuardians (
    StudentId INT NOT NULL,
    GuardianId INT NOT NULL,
    Relationship NVARCHAR(50),
    IsPrimary BIT NOT NULL DEFAULT 0,
    PRIMARY KEY(StudentId, GuardianId),
    FOREIGN KEY(StudentId) REFERENCES dbo.Students(StudentId),
    FOREIGN KEY(GuardianId) REFERENCES dbo.Guardians(GuardianId)
);

-- 5. Fees & Invoicing
CREATE TABLE dbo.FeeTemplates (
    FeeTemplateId INT IDENTITY(1,1) PRIMARY KEY,
    CampusId INT NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    Frequency NVARCHAR(50) NOT NULL, -- Monthly, Term
    IsActive BIT NOT NULL DEFAULT 1,
    FOREIGN KEY(CampusId) REFERENCES dbo.Campuses(CampusId)
);

CREATE TABLE dbo.FeeTemplateItems (
    FeeTemplateItemId INT IDENTITY(1,1) PRIMARY KEY,
    FeeTemplateId INT NOT NULL,
    FeeName NVARCHAR(200) NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    IsOptional BIT NOT NULL DEFAULT 0,
    FOREIGN KEY(FeeTemplateId) REFERENCES dbo.FeeTemplates(FeeTemplateId)
);

CREATE TABLE dbo.StudentFeePlans (
    StudentFeePlanId INT IDENTITY(1,1) PRIMARY KEY,
    StudentId INT NOT NULL,
    FeeTemplateId INT NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Active',
    FOREIGN KEY(StudentId) REFERENCES dbo.Students(StudentId),
    FOREIGN KEY(FeeTemplateId) REFERENCES dbo.FeeTemplates(FeeTemplateId)
);

CREATE TABLE dbo.Invoices (
    InvoiceId INT IDENTITY(1,1) PRIMARY KEY,
    CampusId INT NOT NULL,
    InvoiceNo NVARCHAR(50) NOT NULL UNIQUE,
    StudentId INT NOT NULL,
    IssueDate DATE NOT NULL,
    DueDate DATE NOT NULL,
    TotalAmount DECIMAL(18,2) NOT NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Issued', -- Issued, Paid, Partial, Cancelled
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    FOREIGN KEY(CampusId) REFERENCES dbo.Campuses(CampusId),
    FOREIGN KEY(StudentId) REFERENCES dbo.Students(StudentId)
);

CREATE TABLE dbo.InvoiceLines (
    InvoiceLineId INT IDENTITY(1,1) PRIMARY KEY,
    InvoiceId INT NOT NULL,
    Description NVARCHAR(200),
    Amount DECIMAL(18,2) NOT NULL,
    FOREIGN KEY(InvoiceId) REFERENCES dbo.Invoices(InvoiceId)
);

-- 6. Payments
CREATE TABLE dbo.Payments (
    PaymentId INT IDENTITY(1,1) PRIMARY KEY,
    CampusId INT NOT NULL,
    ReceiptNo NVARCHAR(50) NOT NULL UNIQUE,
    StudentId INT NOT NULL,
    PaymentDate DATETIME2 NOT NULL,
    Method NVARCHAR(50) NOT NULL, -- Cash, QR, Bank
    AmountReceived DECIMAL(18,2) NOT NULL,
    Notes NVARCHAR(500),
    CreatedByUserId INT NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    FOREIGN KEY(CampusId) REFERENCES dbo.Campuses(CampusId),
    FOREIGN KEY(StudentId) REFERENCES dbo.Students(StudentId),
    FOREIGN KEY(CreatedByUserId) REFERENCES dbo.Users(UserId)
);

CREATE TABLE dbo.PaymentAllocations (
    AllocationId INT IDENTITY(1,1) PRIMARY KEY,
    PaymentId INT NOT NULL,
    InvoiceId INT NOT NULL,
    AmountApplied DECIMAL(18,2) NOT NULL,
    FOREIGN KEY(PaymentId) REFERENCES dbo.Payments(PaymentId),
    FOREIGN KEY(InvoiceId) REFERENCES dbo.Invoices(InvoiceId)
);

CREATE TABLE dbo.Refunds (
    RefundId INT IDENTITY(1,1) PRIMARY KEY,
    PaymentId INT NOT NULL,
    RefundDate DATETIME2 NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    Reason NVARCHAR(300),
    Status NVARCHAR(20) NOT NULL,
    FOREIGN KEY(PaymentId) REFERENCES dbo.Payments(PaymentId)
);

-- 7. Approvals
CREATE TABLE dbo.ApprovalRequests (
    RequestId INT IDENTITY(1,1) PRIMARY KEY,
    CampusId INT NOT NULL,
    Type NVARCHAR(50) NOT NULL,
    ReferenceTable NVARCHAR(50),
    ReferenceId INT,
    RequestedBy INT NOT NULL,
    RequestedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    Status NVARCHAR(20) NOT NULL DEFAULT 'Pending',
    FOREIGN KEY(CampusId) REFERENCES dbo.Campuses(CampusId),
    FOREIGN KEY(RequestedBy) REFERENCES dbo.Users(UserId)
);

CREATE TABLE dbo.ApprovalSteps (
    StepId INT IDENTITY(1,1) PRIMARY KEY,
    RequestId INT NOT NULL,
    StepNo INT NOT NULL,
    ApproverRoleId INT,
    ApproverUserId INT,
    Decision NVARCHAR(20), -- Approved, Rejected
    DecisionAt DATETIME2,
    Comment NVARCHAR(500),
    FOREIGN KEY(RequestId) REFERENCES dbo.ApprovalRequests(RequestId)
);

-- 8. NumerSeries & Audit
CREATE TABLE dbo.NumberSeries (
    SeriesId INT IDENTITY(1,1) PRIMARY KEY,
    CampusId INT NOT NULL,
    SeriesType NVARCHAR(50) NOT NULL, -- Student, Invoice, Receipt
    Prefix NVARCHAR(20),
    CurrentNumber BIGINT NOT NULL DEFAULT 0,
    Format NVARCHAR(50),
    UNIQUE(CampusId, SeriesType),
    FOREIGN KEY(CampusId) REFERENCES dbo.Campuses(CampusId)
);

CREATE TABLE dbo.AuditLogs (
    AuditId BIGINT IDENTITY(1,1) PRIMARY KEY,
    CampusId INT,
    UserId INT,
    EntityName NVARCHAR(50),
    EntityId NVARCHAR(50),
    Action NVARCHAR(50),
    BeforeJson NVARCHAR(MAX),
    AfterJson NVARCHAR(MAX),
    Timestamp DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    IP NVARCHAR(50)
);
GO

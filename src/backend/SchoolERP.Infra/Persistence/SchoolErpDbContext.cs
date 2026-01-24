using Microsoft.EntityFrameworkCore;
using SchoolERP.Core.Entities;

namespace SchoolERP.Infra.Persistence
{
    public class SchoolErpDbContext : DbContext
    {
        public SchoolErpDbContext(DbContextOptions<SchoolErpDbContext> options)
            : base(options)
        {
        }

        public DbSet<Campus> Campuses { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<UserCampusAccess> UserCampusAccesses { get; set; }

        public DbSet<Program> Programs { get; set; }
        public DbSet<Grade> Grades { get; set; }
        public DbSet<Class> Classes { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Guardian> Guardians { get; set; }
        public DbSet<StudentGuardian> StudentGuardians { get; set; }

        public DbSet<FeeTemplate> FeeTemplates { get; set; }
        public DbSet<FeeTemplateItem> FeeTemplateItems { get; set; }
        public DbSet<StudentFeePlan> StudentFeePlans { get; set; }

        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<InvoiceItem> InvoiceItems { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<VoidRequest> VoidRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Campus Configuration
            modelBuilder.Entity<Campus>(entity =>
            {
                entity.HasKey(e => e.CampusId);
                entity.HasIndex(e => e.CampusCode).IsUnique();
                entity.Property(e => e.CampusCode).HasMaxLength(50).IsRequired();
                entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
                entity.Property(e => e.IsActive).HasDefaultValue(true);
            });

            // User Configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.UserId);
                entity.HasIndex(e => e.Username).IsUnique();
                entity.Property(e => e.Username).HasMaxLength(100).IsRequired();
                entity.Property(e => e.FullName).HasMaxLength(200).IsRequired();
                entity.Property(e => e.IsActive).HasDefaultValue(true);
            });

            // Role Configuration
            modelBuilder.Entity<Role>(entity =>
            {
                entity.HasKey(e => e.RoleId);
                entity.HasIndex(e => e.RoleName).IsUnique();
                entity.Property(e => e.RoleName).HasMaxLength(50).IsRequired();
            });

            // UserRole Configuration (Many-to-Many)
            modelBuilder.Entity<UserRole>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.RoleId });

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserRoles)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.UserRoles)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // UserCampusAccess Configuration (Many-to-Many with payload)
            modelBuilder.Entity<UserCampusAccess>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.CampusId });

                entity.Property(e => e.AccessLevel).HasMaxLength(20).IsRequired();

                entity.HasOne(d => d.User)
                    .WithMany(p => p.CampusAccesses)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.Campus)
                    .WithMany(p => p.UserAccesses)
                    .HasForeignKey(d => d.CampusId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Academic Structure
            modelBuilder.Entity<Program>(entity =>
            {
                entity.HasKey(e => e.ProgramId);
                entity.HasIndex(e => e.Name).IsUnique();
                entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            });

            modelBuilder.Entity<Grade>(entity =>
            {
                entity.HasKey(e => e.GradeId);
                entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
                entity.HasOne(d => d.Program).WithMany(p => p.Grades).HasForeignKey(d => d.ProgramId);
            });

            modelBuilder.Entity<Class>(entity =>
            {
                entity.HasKey(e => e.ClassId);
                entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
                entity.HasOne(d => d.Campus).WithMany().HasForeignKey(d => d.CampusId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(d => d.Grade).WithMany(p => p.Classes).HasForeignKey(d => d.GradeId).OnDelete(DeleteBehavior.Restrict);
            });

            // Students
            modelBuilder.Entity<Student>(entity =>
            {
                entity.HasKey(e => e.StudentId);
                entity.HasIndex(e => e.StudentCode).IsUnique();
                entity.Property(e => e.StudentCode).HasMaxLength(50).IsRequired();
                entity.Property(e => e.KhmerName).HasMaxLength(200);
                entity.Property(e => e.EnglishName).HasMaxLength(200);
                entity.Property(e => e.Status).HasDefaultValue("Active");

                entity.HasOne(d => d.Campus).WithMany().HasForeignKey(d => d.CampusId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(d => d.Program).WithMany().HasForeignKey(d => d.ProgramId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(d => d.Grade).WithMany().HasForeignKey(d => d.GradeId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(d => d.Class).WithMany().HasForeignKey(d => d.ClassId).OnDelete(DeleteBehavior.Restrict);
            });

            // Guardians
            modelBuilder.Entity<Guardian>(entity =>
            {
                entity.HasKey(e => e.GuardianId);
                entity.Property(e => e.FullName).HasMaxLength(200).IsRequired();
                entity.Property(e => e.Phone).HasMaxLength(50);
            });

            // StudentGuardian (Many-to-Many)
            modelBuilder.Entity<StudentGuardian>(entity =>
            {
                entity.HasKey(e => new { e.StudentId, e.GuardianId });
                entity.Property(e => e.Relationship).HasMaxLength(50);

                entity.HasOne(d => d.Student)
                    .WithMany(p => p.StudentGuardians)
                    .HasForeignKey(d => d.StudentId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.Guardian)
                    .WithMany(p => p.StudentGuardians)
                    .HasForeignKey(d => d.GuardianId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Fees
            modelBuilder.Entity<FeeTemplate>(entity =>
            {
                entity.HasKey(e => e.FeeTemplateId);
                entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
                entity.HasOne(d => d.Campus).WithMany().HasForeignKey(d => d.CampusId).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<FeeTemplateItem>(entity =>
            {
                entity.HasKey(e => e.FeeTemplateItemId);
                entity.Property(e => e.FeeName).HasMaxLength(100).IsRequired();
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
                
                entity.HasOne(d => d.FeeTemplate)
                    .WithMany(p => p.FeeTemplateItems)
                    .HasForeignKey(d => d.FeeTemplateId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<StudentFeePlan>(entity =>
            {
                entity.HasKey(e => e.StudentFeePlanId);
                entity.Property(e => e.Status).HasMaxLength(20);

                entity.HasOne(d => d.Student).WithMany().HasForeignKey(d => d.StudentId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(d => d.FeeTemplate).WithMany().HasForeignKey(d => d.FeeTemplateId).OnDelete(DeleteBehavior.Restrict);
            });

            // Finance
            modelBuilder.Entity<Invoice>(entity =>
            {
                entity.HasKey(e => e.InvoiceId);
                entity.Property(e => e.InvoiceNumber).HasMaxLength(20).IsRequired();
                entity.HasIndex(e => e.InvoiceNumber).IsUnique();
                entity.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.PaidAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Balance).HasColumnType("decimal(18,2)");

                entity.HasOne(d => d.Student)
                    .WithMany()
                    .HasForeignKey(d => d.StudentId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<InvoiceItem>(entity =>
            {
                entity.HasKey(e => e.InvoiceItemId);
                entity.Property(e => e.Description).HasMaxLength(200);
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");

                entity.HasOne(d => d.Invoice)
                    .WithMany(p => p.InvoiceItems)
                    .HasForeignKey(d => d.InvoiceId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasKey(e => e.PaymentId);
                entity.Property(e => e.ReceiptNumber).HasMaxLength(50).IsRequired();
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.PaymentMethod).HasMaxLength(50);

                entity.HasOne(d => d.Invoice)
                    .WithMany(p => p.Payments)
                    .HasForeignKey(d => d.InvoiceId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}

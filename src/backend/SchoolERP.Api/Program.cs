using Microsoft.EntityFrameworkCore;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;
using SchoolERP.Api.Services;
using SchoolERP.Core.Interfaces;
using SchoolERP.Infra.Persistence;
using SchoolERP.Infra.Repositories;
using SchoolERP.Infra.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true; // Accept camelCase input
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

// DB Context
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<SchoolErpDbContext>(options =>
    options.UseSqlServer(connectionString));

// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IStudentRepository, StudentRepository>();
builder.Services.AddScoped<IFeeRepository, FeeRepository>();
builder.Services.AddScoped<IFinanceRepository, FinanceRepository>();

// Services
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["Secret"] ?? "YourSuperSecretKeyHereMustBeAtLeast32CharsLong!";
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"] ?? "SchoolERP",
        ValidAudience = jwtSettings["Audience"] ?? "SchoolERP",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

var app = builder.Build();

// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//    app.UseSwagger();
//    app.UseSwaggerUI();
// }

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Auto-Migration Logic
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {

        var context = services.GetRequiredService<SchoolErpDbContext>();
        var hasher = services.GetRequiredService<IPasswordHasher>();

        // Simple retry logic for container startup
        var retryCount = 0;
        while (retryCount < 5)
        {
            try
            {
                if (context.Database.CanConnect())
                {
                    Console.WriteLine("Database connection established. Applying migrations...");
                    context.Database.Migrate();
                    
                    // SEEDING
                    if (!context.Users.Any(u => u.Username == "admin"))
                    {
                        Console.WriteLine("Seeding Admin User...");
                        
                        // Ensure Campus
                        var campus = context.Campuses.FirstOrDefault(c => c.CampusCode == "HQ");
                        if (campus == null)
                        {
                            campus = new SchoolERP.Core.Entities.Campus { CampusCode = "HQ", Name = "Headquarters", IsActive = true };
                            context.Campuses.Add(campus);
                            context.SaveChanges();
                        }

                        // Ensure Role
                        var role = context.Roles.FirstOrDefault(r => r.RoleName == "Admin");
                        if (role == null)
                        {
                            role = new SchoolERP.Core.Entities.Role { RoleName = "Admin" };
                            context.Roles.Add(role);
                            context.SaveChanges();
                        }

                        // Create User
                        var user = new SchoolERP.Core.Entities.User 
                        { 
                            Username = "admin", 
                            PasswordHash = hasher.Hash("Admin123!"), 
                            FullName = "System Administrator", 
                            IsActive = true 
                        };
                        context.Users.Add(user);
                        context.SaveChanges();

                        // Assign Role
                        context.UserRoles.Add(new SchoolERP.Core.Entities.UserRole { UserId = user.UserId, RoleId = role.RoleId });
                        
                        // Assign Campus Access
                        context.UserCampusAccesses.Add(new SchoolERP.Core.Entities.UserCampusAccess { UserId = user.UserId, CampusId = campus.CampusId, AccessLevel = "Write" });
                        
                        context.SaveChanges();
                        Console.WriteLine("Admin User Seeded: admin / Admin123!");
                    }

                    Console.WriteLine("Migrations and Seeding applied successfully.");
                    break;
                }
            }
            catch
            {
                // Ignored - just retrying
            }
            
            retryCount++;
            Console.WriteLine($"Waiting for Database... (Attempt {retryCount}/5)");
            System.Threading.Thread.Sleep(5000); // Wait 5s
            
            if (retryCount == 5)
            {
                // Last ditch effort - might throw if DB still down
                Console.WriteLine("Force attempting migration...");
                context.Database.Migrate(); 
            }
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred migrating the DB.");
    }
}

app.Run();

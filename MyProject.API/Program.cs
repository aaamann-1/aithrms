using QuestPDF.Infrastructure;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MyProject.API.Data;
using MyProject.API.Services;
using MyProject.API.Settings;
using Microsoft.OpenApi;

QuestPDF.Settings.License = LicenseType.Community;

var builder = WebApplication.CreateBuilder(args);


// =========================================================
// SERVICES
// =========================================================

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();


// =========================================================
// CORS
// =========================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularApp", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


// =========================================================
// SWAGGER
// =========================================================

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "Paste only your JWT token here."
    });

    options.AddSecurityRequirement(document =>
        new OpenApiSecurityRequirement
        {
            [new OpenApiSecuritySchemeReference("Bearer", document)] =
                new List<string>()
        });
});


// =========================================================
// JWT SETTINGS
// =========================================================

builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("Jwt"));


// =========================================================
// DATABASE
// =========================================================

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));


// =========================================================
// APPLICATION SERVICES
// =========================================================

builder.Services.AddScoped<IAttendanceService, AttendanceService>();

builder.Services.AddScoped<IReportService, ReportService>();

builder.Services.AddScoped<IReportExportService, ReportExportService>();


// =========================================================
// JWT CONFIGURATION
// =========================================================

var jwtSettings = builder.Configuration
    .GetSection("Jwt")
    .Get<JwtSettings>()!;

builder.Services.AddAuthentication(
    JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer = jwtSettings.Issuer,

                ValidAudience = jwtSettings.Audience,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            jwtSettings.Key))
            };
    });


// =========================================================
// BUILD APPLICATION
// =========================================================

var app = builder.Build();


// =========================================================
// DATABASE SEEDING
// =========================================================

await DbInitializer.SeedAsync(app.Services);


// =========================================================
// SWAGGER
// =========================================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI();
}


// =========================================================
// HTTP PIPELINE
// =========================================================

app.UseHttpsRedirection();

app.UseCors("AngularApp");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();


// =========================================================
// RUN
// =========================================================

app.Run();
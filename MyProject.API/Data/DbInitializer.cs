using Microsoft.EntityFrameworkCore;
using MyProject.API.Models;

namespace MyProject.API.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();

        var context = scope.ServiceProvider
            .GetRequiredService<ApplicationDbContext>();

        var configuration = scope.ServiceProvider
            .GetRequiredService<IConfiguration>();

        // Apply migrations
        await context.Database.MigrateAsync();

        // Check whether an Admin already exists
        var adminExists = await context.Users
            .AnyAsync(user => user.Role == "Admin");

        if (adminExists)
        {
            return;
        }

        var adminUsername =
            configuration["DefaultAdmin:Username"];

        var adminMobile =
            configuration["DefaultAdmin:ContactNumber"];

        var adminPassword =
            configuration["DefaultAdmin:Password"];

        if (string.IsNullOrWhiteSpace(adminUsername) ||
            string.IsNullOrWhiteSpace(adminMobile) ||
            string.IsNullOrWhiteSpace(adminPassword))
        {
            throw new InvalidOperationException(
                "DefaultAdmin configuration is missing.");
        }

        var admin = new User
        {
            FullName = "System Administrator",
            Username = adminUsername.Trim(),
            ContactNumber = adminMobile.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword),
            Role = "Admin"
        };

        context.Users.Add(admin);

        await context.SaveChangesAsync();
    }
}
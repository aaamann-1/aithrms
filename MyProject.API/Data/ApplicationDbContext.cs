using Microsoft.EntityFrameworkCore;
using MyProject.API.Models;

namespace MyProject.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    // DATABASE TABLES

    public DbSet<User> Users { get; set; }

    public DbSet<Employee> Employees { get; set; }

    // MODEL CONFIGURATION

    protected override void OnModelCreating(
        ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);


        // USER <-> EMPLOYEE
        // One User can have one Employee
        // One Employee belongs to one User

        modelBuilder.Entity<User>()
            .HasOne(user => user.Employee)
            .WithOne(employee => employee.User)
            .HasForeignKey<Employee>(
                employee => employee.UserId)
            .OnDelete(DeleteBehavior.Cascade);


        // USER USERNAME

        modelBuilder.Entity<User>()
            .HasIndex(user => user.Username)
            .IsUnique();


        // USER CONTACT NUMBER

        modelBuilder.Entity<User>()
            .HasIndex(user => user.ContactNumber)
            .IsUnique();


        // EMPLOYEE PERSONAL EMAIL

        modelBuilder.Entity<Employee>()
            .HasIndex(employee => employee.PersonalEmail)
            .IsUnique();


        // EMPLOYEE MOBILE NUMBER

        modelBuilder.Entity<Employee>()
            .HasIndex(employee => employee.MobileNumber)
            .IsUnique();
    }
}
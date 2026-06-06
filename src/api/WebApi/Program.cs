using Application;
using Infrastructure;
using Microsoft.EntityFrameworkCore;
using WebApi.Extensions;
using WebApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddApplicationServices();

builder.Services.AddInfrastructureServices(
    builder.Configuration);

builder.Services.AddOpenApiServices();

builder.Services.AddAuthenticationServices(
    builder.Configuration);

builder.Services.AddSignalRServices();

builder.Services.AddCorsPolicies();

builder.Services.AddHealthCheckServices(builder.Configuration);

builder.Services.AddApiVersioningServices();

builder.Services.AddSerilogServices();

builder.Services.AddHostedService<ArchivalBackgroundService>();

var app = builder.Build();

app.UseGlobalExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.UseOpenApiServices();
}

app.UseHttpsRedirection();

app.UseCors("Frontend");

app.UseRequestLogging();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.UseHealthCheckServices();

app.UseWebSockets();

app.MapSignalRHubs();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<Infrastructure.Context.AppDbContext>();
    dbContext.Database.Migrate();
}

app.Run();

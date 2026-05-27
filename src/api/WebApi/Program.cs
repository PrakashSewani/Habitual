using Application;
using Infrastructure;
using Microsoft.EntityFrameworkCore;
using WebApi.Extensions;

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

var app = builder.Build();

app.UseGlobalExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.UseOpenApiServices();
}

app.UseHttpsRedirection();

app.UseCors("Frontend");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.UseWebSockets();

app.MapSignalRHubs();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<Infrastructure.Context.AppDbContext>();
    dbContext.Database.Migrate();
}

app.Run();
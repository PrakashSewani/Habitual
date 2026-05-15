using Application;
using Infrastructure;
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

app.MapSignalRHubs();

app.Run();
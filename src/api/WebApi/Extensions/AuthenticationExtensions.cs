using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace WebApi.Extensions
{
    public static class AuthenticationExtensions
    {
        public static IServiceCollection AddAuthenticationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services
               .AddAuthentication(options =>
               {
                   options.DefaultAuthenticateScheme =
                       JwtBearerDefaults.AuthenticationScheme;

                   options.DefaultChallengeScheme =
                       JwtBearerDefaults.AuthenticationScheme;
               })
               .AddJwtBearer(options =>
               {
                   options.TokenValidationParameters =
                       new TokenValidationParameters
                       {
                           ValidateIssuer = false,
                           ValidateAudience = false,
                           ValidateLifetime = true,
                           ValidateIssuerSigningKey = true,

                           IssuerSigningKey =
                               new SymmetricSecurityKey(
                                   Encoding.UTF8.GetBytes(
                                       configuration["Jwt:Secret"]
                                       ?? throw new InvalidOperationException(
                                           "JWT Secret Key is not configured")))
                       };

                   options.Events = new JwtBearerEvents
                   {
                       OnMessageReceived = context =>
                       {
                           var accessToken =
                               context.Request.Query["access_token"];

                           var path =
                               context.HttpContext.Request.Path;

                           if (!string.IsNullOrWhiteSpace(accessToken) &&
                               path.StartsWithSegments("/hubs/habits"))
                           {
                               context.Token = accessToken;
                           }

                           return Task.CompletedTask;
                       }
                   };
               });

            return services;
        }
    }
}

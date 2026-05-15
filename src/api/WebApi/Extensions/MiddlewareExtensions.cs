using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using WebApi.Common.Responses;

namespace WebApi.Extensions
{
    public static class MiddlewareExtensions
    {
        public static IApplicationBuilder
            UseGlobalExceptionHandler(
                this IApplicationBuilder app)
        {
            app.UseExceptionHandler(errorApp =>
            {
                errorApp.Run(async context =>
                {
                    var exception = context.Features
                        .Get<IExceptionHandlerFeature>()
                        ?.Error;

                    context.Response.ContentType =
                        "application/json";

                    var errors = new List<string>();

                    switch (exception)
                    {
                        case ValidationException validationException:

                            context.Response.StatusCode = 400;

                            errors = [.. validationException.Errors.Select(e => e.ErrorMessage)];

                            break;

                        case UnauthorizedAccessException:

                            context.Response.StatusCode = 401;

                            errors.Add(exception.Message);

                            break;

                        case KeyNotFoundException:

                            context.Response.StatusCode = 404;

                            errors.Add(exception.Message);

                            break;

                        default:

                            context.Response.StatusCode = 500;

                            errors.Add(
                                exception?.Message
                                ?? "Unknown error");

                            break;
                    }

                    var response =
                        ApiResponseFactory.Failure<object>(
                            "An error occured",
                            errors);

                    await context.Response
                        .WriteAsJsonAsync(response);
                });
            });

            return app;
        }
    }
}
# Build stage: uses local source files
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy local source files into the container
COPY src/api/ ./src/api/

# Restore dependencies
RUN dotnet restore src/api/WebApi/WebApi.csproj

# Publish the WebApi project in Release mode
RUN dotnet publish src/api/WebApi/WebApi.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Copy published output from build stage
COPY --from=build /app/publish .

# Use the HTTP port from launchSettings.json
ENV ASPNETCORE_URLS=http://+:5224

# Expose the port the API listens on
EXPOSE 5224

# Start the application
ENTRYPOINT ["dotnet", "WebApi.dll"]

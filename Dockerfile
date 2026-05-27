# Build stage: clones remote repository and publishes the API
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Install git so we can clone the remote repository
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Clone the specified branch from the remote repository
ARG REPO_URL=https://github.com/PrakashSewani/Habitual.git
ARG REPO_BRANCH=dev
RUN git clone --branch ${REPO_BRANCH} --depth 1 ${REPO_URL} .

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

# Expose the port the API listens on
EXPOSE 8080

# Start the application
ENTRYPOINT ["dotnet", "WebApi.dll"]

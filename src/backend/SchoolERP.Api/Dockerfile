# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy Solution and Project files first for caching
COPY ["src/SchoolERP.sln", "./"]
COPY ["src/backend/SchoolERP.Api/SchoolERP.Api.csproj", "src/backend/SchoolERP.Api/"]
COPY ["src/backend/SchoolERP.Core/SchoolERP.Core.csproj", "src/backend/SchoolERP.Core/"]
COPY ["src/backend/SchoolERP.Infra/SchoolERP.Infra.csproj", "src/backend/SchoolERP.Infra/"]

# Restore dependencies
RUN dotnet restore "src/backend/SchoolERP.Api/SchoolERP.Api.csproj"

# Copy the rest of the source code
COPY . .

# Build and Publish
WORKDIR "/src/src/backend/SchoolERP.Api"
RUN dotnet build "SchoolERP.Api.csproj" -c Release -o /app/build
RUN dotnet publish "SchoolERP.Api.csproj" -c Release -o /app/publish

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
EXPOSE 443

COPY --from=build /app/publish .

# Environment Variables (can be overridden by docker-compose)
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "SchoolERP.Api.dll"]

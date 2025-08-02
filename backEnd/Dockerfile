# Utilise l'image de base ASP.NET Core runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Utilise l'image SDK pour le build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copie les fichiers de projet pour restore
COPY ["EpicMapping.WebApi/EpicMapping.WebApi.csproj", "EpicMapping.WebApi/"]
COPY ["src/Application/Application.csproj", "src/Application/"]
COPY ["src/Domain/Domain.csproj", "src/Domain/"]
COPY ["src/Infrastructure/Infrastructure.csproj", "src/Infrastructure/"]

# Restore des packages NuGet
RUN dotnet restore "EpicMapping.WebApi/EpicMapping.WebApi.csproj"

# Copie tout le code source
COPY . .

# Build de l'application
WORKDIR "/src/EpicMapping.WebApi"
RUN dotnet build "EpicMapping.WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish de l'application
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "EpicMapping.WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Image finale
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EpicMapping.WebApi.dll"]

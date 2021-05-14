#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

#FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
FROM mcr.microsoft.com/dotnet/sdk:5.0.102-alpine3.12-amd64 AS build
WORKDIR /src
COPY ["odh-databrowser-core/odh-databrowser-core.csproj", "odh-databrowser-core/"]
RUN dotnet restore "odh-databrowser-core/odh-databrowser-core.csproj"
COPY . .
WORKDIR "/src/odh-databrowser-core"
RUN dotnet build "odh-databrowser-core.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "odh-databrowser-core.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "odh-databrowser-core.dll"]
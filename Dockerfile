FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build-env
WORKDIR /app

# copy everything and build the project
COPY . ./
RUN dotnet restore TestProjectAPI/*.csproj
RUN dotnet publish TestProjectAPI/TestProjectAPI.csproj -c Release -o /out

# build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
RUN ls
COPY --from=build-env out ./
ENTRYPOINT ["dotnet", "TestProjectAPI.dll"]
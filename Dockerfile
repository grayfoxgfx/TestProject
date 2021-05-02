FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build-env
WORKDIR /app

# copy everything and build the project
COPY . ./
RUN dotnet restore TestProjectAPI/*.csproj
RUN dotnet publish TestProjectAPI/TestProjectAPI.csproj -c Release -o /out

# build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:3.1
WORKDIR /app
RUN ls
COPY --from=build-env out ./
ENTRYPOINT ["dotnet", "TestProjectAPI.dll"]
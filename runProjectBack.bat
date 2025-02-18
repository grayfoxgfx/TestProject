@echo off

:: Ensure we are in the correct directory
cd /d "%~dp0\TestProject"

:: Check if the Dockerfile exists
if not exist Dockerfile (
    echo ERROR: Dockerfile not found in %CD%
    exit /b 1
)

:: Build the Docker image and wait for completion
docker build --rm -t test-project:latest -f Dockerfile .

:: Run the Docker container
docker run --rm -p 5000:5000 -p 5001:5001 ^
  -e ASPNETCORE_URLS="http://+:5000;https://+:5001" ^
  -e ASPNETCORE_Kestrel__Certificates__Default__Path=/https/aspnetapp.pfx ^
  -e ASPNETCORE_Kestrel__Certificates__Default__Password="password" ^
  -v "%USERPROFILE%\.aspnet\https:/https:ro" test-project:latest

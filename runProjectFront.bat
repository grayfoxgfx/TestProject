@echo off
cd "ToysGamesFront\ClientApp"

if not exist Dockerfile (
    echo ERROR: Frontend Dockerfile not found in %CD%
    exit /b 1
)

:: Build the Docker image and wait for completion
docker build -t mi-app-angular .
:: Run the Docker container
docker run --rm -p 8080:80 mi-app-angular:latest
cd "ToysGamesFront\ClientApp"
start ng serve

cd "../../TestProjectAPI"
start docker build --rm -t test-project:latest -f Dockerfile .
start docker run --rm -p 5000:5000 -p 5001:5001 `
  -e ASPNETCORE_URLS="http://+:5000;https://+:5001" `
  -e ASPNETCORE_Kestrel__Certificates__Default__Path=/https/aspnetapp.pfx `
  -e ASPNETCORE_Kestrel__Certificates__Default__Password="password" `
  -v "$env:USERPROFILE\.aspnet\https:/https:ro" test-project:latest
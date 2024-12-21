# Variables
$resourceGroupName = "nameselector-uks-rg"
$appName = "nameselectoruksweb"

# Navigate to React app directory
$reactAppPath = "../frontend"
Set-Location -Path $reactAppPath

# Set environment variable for the build
$env:REACT_APP_API_ENDPOINT = "https://nameselectoruksapi.azurewebsites.net/api/"

# Install dependencies and build the React app
npm install
npm run build

# Zip the build output
$buildOutput = "$reactAppPath\build"
$zipFile = "$reactAppPath\build.zip"
Compress-Archive -Path $buildOutput\* -DestinationPath $zipFile -Force

# Deploy to Azure Web App
az webapp deployment source config-zip --resource-group $resourceGroupName --name $appName --src $zipFile

Write-Host "Deployment complete. Visit: https://$appName.azurewebsites.net"

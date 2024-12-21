# Variables
$resourceGroupName = "nameselector-uks-rg"
$functionAppName = "nameselectoruksapi"
$functionFolder = "../api"
$zipPath = "api.zip"

# Zip the Azure Function folder
if (Test-Path $zipPath) {
    Remove-Item $zipPath
}
Compress-Archive -Path "$functionFolder\*" -DestinationPath $zipPath

# Deploy the zip to the Azure Function App
Write-Host "Deploying Azure Function..."
az functionapp deployment source config-zip `
    --resource-group $resourceGroupName `
    --name $functionAppName `
    --src $zipPath

Write-Host "Deployment completed."
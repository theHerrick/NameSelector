resource "azurerm_mssql_server" "sql" {
  name                         = "nameselectorukssql"
  resource_group_name          = azurerm_resource_group.rg.name
  location                     = azurerm_resource_group.rg.location
  version                      = "12.0"
  minimum_tls_version          = "1.2"


  azuread_administrator {
    azuread_authentication_only = true
    login_username = "AzureAD Admin"
    object_id      = azuread_group.svc-group.object_id
  }

}

resource "azurerm_mssql_database" "sqldb" {
  name         = "nameselector"
  server_id    = azurerm_mssql_server.sql.id
  sku_name     = "Basic"
}
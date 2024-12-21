resource "azurerm_storage_account" "sa" {
  name                     = "nameselectorukssa"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_windows_function_app" "fa" {
  name                = "nameselectoruksapi"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location

  storage_account_name       = azurerm_storage_account.sa.name
  storage_account_access_key = azurerm_storage_account.sa.primary_access_key
  service_plan_id            = azurerm_service_plan.asp.id

    identity {
    type = "SystemAssigned"
  }

  site_config {
    application_insights_connection_string = azurerm_application_insights.ai.connection_string
    always_on = true
    application_stack {
        node_version = "~18"
    }
    cors {
        allowed_origins = ["*"]
  }

  }

  app_settings = {
    sqlConnection = "Server=tcp:nameselectorukssql.database.windows.net,1433;Database=nameselector;Authentication=Active Directory Default;"
  }
}
resource "azurerm_windows_web_app" "webapp" {
  name                = "nameselectoruksweb"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_service_plan.asp.location
  service_plan_id     = azurerm_service_plan.asp.id

  site_config {
    application_stack {
        current_stack = "node"
        node_version = "~18"
    }
  }
}
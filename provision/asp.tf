resource "azurerm_service_plan" "asp" {
  name                = "nameselector-uks-asp"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Windows"
  sku_name            = "B1"
}

resource "azurerm_application_insights" "ai" {
  name                = "nameselector-uks-ai"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  application_type    = "Node.JS"
}
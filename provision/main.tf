terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>4.14.0"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 2.15.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = "a566df0d-ee7e-4e07-b453-cd7f4c9c7574"
}

data "azuread_client_config" "current" {}

resource "azuread_group" "svc-group" {
  display_name     = "NameSelector SVC"
  owners           = [data.azuread_client_config.current.object_id]
  security_enabled = true

    members = [
    data.azuread_client_config.current.object_id
  ]
}

resource "azuread_group_member" "fasvc" {
  group_object_id  = azuread_group.svc-group.id
  member_object_id = azurerm_windows_function_app.fa.identity[0].principal_id
}

resource "azurerm_resource_group" "rg" {
  name     = "nameselector-uks-rg"
  location = "UK South"
}


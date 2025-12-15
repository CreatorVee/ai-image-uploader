resource "random_integer" "suffix" {
  min = 10000
  max = 99999
}

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group
  location = var.location
}

resource "azurerm_storage_account" "sa" {
  name                     = replace(lower(var.storage_account_name), "/[^a-z0-9]/", "")
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "images" {
  name                  = "ai-images"
  storage_account_name  = azurerm_storage_account.sa.name
  container_access_type = "private"
}


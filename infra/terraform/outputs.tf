output "storage_account_name" {
  value = azurerm_storage_account.images.name
}

output "container_name" {
  value = azurerm_storage_container.images.name
}

output "resource_group" {
  value = azurerm_resource_group.main.name
}


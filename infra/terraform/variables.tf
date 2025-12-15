variable "location" {
  type    = string
  default = "UK South"
}

variable "resource_group" {
  type    = string
  default = "rg-ai-image-uploader"
}

variable "storage_account_name" {
  type    = string
  default = "aiimageuploader${random_integer.suffix.result}"
}


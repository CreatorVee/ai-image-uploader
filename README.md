# Cloud Image Uploader– Cloud DevOps Project



## Project Overview

Cloud Image Uploader is a **cloud-native image upload API** built with Node.js and deployed on Azure.

The application allows users to upload image files through a web UI or REST API. Uploaded images are securely stored in **Azure Blob Storage**, using **Managed Identity** for authentication — no secrets or keys stored in code.

The project focuses on **real DevOps practices**, including containerization, infrastructure as code, CI/CD automation, and secure cloud deployments.

---
Tech Stack

CLICK ON THE DIFFERENT TECH BADGES TO SEE HOW I USED THE TOOLS IN THIS PROJECT

## Backend Technologies

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](./app/index.js)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](./app/package.json)


## DevOps & Infrastructure

[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](./app/Dockerfile)
[![Terraform](https://img.shields.io/badge/Terraform-623CE4?style=for-the-badge&logo=terraform&logoColor=white)](./infra/terraform)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](.github/workflows)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI/CD-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/CreatorVee/ai-image-uploader/actions)

---

![afkapa](https://github.com/user-attachments/assets/968a7d35-7f87-47ac-a7fc-ead4ee6afc6a)


---

# Key Features

- Node.js & Express REST API

- Image upload with validation (Multer)

- Rate limiting & API key security

- Azure Blob Storage for file persistence

- Azure Container Apps (serverless containers)

- Dockerized application

- CI/CD with GitHub Actions

- Infrastructure provisioned with Terraform

- Secure authentication using Managed Identity

- Full infrastructure teardown to avoid cloud costs


# Cloud-Image-Uploader-Structure

├── **app**/

│   ├── index.js/

│   ├── package.json/

│   ├── Dockerfile/

│   └── public/

│       └── index.html/

├──  **infra**/

│   └── terraform/

│       ├── main.tf/

│       ├── variables.tf/

│       └── outputs.tf/

├── **github**/

│   └── workflows/

│       └── backend-deploy.yml/

└── README.md

---

 # 🌐 Infrastructure Idea (Simple Explanation)

- You open the application URL → a simple HTML upload UI loads.

- The browser sends an image to the backend API.

- The Node.js API:

- validates the image

- enforces rate limits

- checks API authentication

- uploads the file to Azure Blob Storage

- Everything runs inside a Docker container deployed to Azure Container Apps.

# Terraform creates:

- Resource Group

- Azure Container Registry

- Container App Environment

- Container App

- Log Analytics Workspace

---

# 🏗️ How It Was Built

# 1️⃣ Backend (Node.js API)

- Express server handling /upload and /health

- Multer for image uploads

- Rate limiting for abuse protection

- API key authentication via headers

- Managed Identity for Azure access (no secrets)

 ---

# Run locally:

**Commands**:

- npm install
- node index.js

  ---


# 2️⃣ Docker

- The backend is fully containerized.

**Commands**:

- docker build -t cloud-image-uploader .
- docker run -p 8080:8080 cloud-image-uploader

  # Use of Docker  📸 Evidence:

<img width="1920" height="660" alt="2025-12-17_12h22_07" src="https://github.com/user-attachments/assets/2f1321f6-fa85-4d15-baaa-2ee941bb892b" />

  

 ---

# 3️⃣Azure & Terraform

- Terraform provisions all cloud resources
- terraform init
- terraform plan
- terraform 

 **Public access is controlled via Container App ingress settings**

# 📸 Evidence:

 <img width="1920" height="935" alt="2025-12-17_10h18_19" src="https://github.com/user-attachments/assets/dabe584c-2ebf-4466-9e3c-ad158a2df832" />


---


# 4️⃣ CI/CD with GitHub Actions

**On every push to main**:

- Docker image is built

- Image is pushed to Azure Container Registry

- Azure Container App is updated automatically with new image

 - Existing ingress settings expose the updated API publicly

- This simulates real production CI/CD workflows


---

# 🔐 Security Considerations

- API key required for upload requests

- Rate limiting to prevent abuse

- Managed Identity (no storage keys in code)

- File type & size validation

- Public access restricted to required endpoints only


---

# 🧪 Testing the API

Example upload request:

**Commands**:

- curl -X POST https://<your-app-url>/upload \
  -H "x-api-key: ****" \
  -F "file=@test.png"


- Successful response:

{
  "container": "images",
  "blob": "timestamp-test.png"
}

# 📸 Evidence:

<img width="1920" height="99" alt="2025-12-21_00h18_42" src="https://github.com/user-attachments/assets/0f0fcb0c-f37b-4f5b-b6dd-68784fa54cfe" />

---

# 💸 Cost Control & Cleanup

- All resources can be removed safely:

- Terraform destroy

- This project was intentionally destroyed after completion to avoid unnecessary cloud costs.



<img width="1920" height="1032" alt="2025-12-21_00h38_03" src="https://github.com/user-attachments/assets/48db8438-cc11-4019-8b52-d81c871ed89b" />


<img width="1920" height="1032" alt="2025-12-21_00h38_18" src="https://github.com/user-attachments/assets/25af7b1d-0fb6-45ba-81cd-5879eda352df" />


---

Other Technologies Used:




# 📚 Key Learnings

- Real-world Terraform workflows on Azure

- Containerized backend deployments

- Azure Container Apps vs traditional Kubernetes

- Secure cloud authentication with Managed Identity

- CI/CD pipelines using GitHub Actions

- Importance of cost management in cloud projects

---

# 📝 Final Notes

This project prioritizes clarity, security, and real DevOps workflows over unnecessary complexity.

It is intentionally minimal, production-focused, and fully reproducible.

---

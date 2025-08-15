# Secure File Storage System with AWS S3 Integration

This project is a mini file storage application (like Google Drive basic version) built as a machine task.  
It allows users to sign up, log in, and securely upload, download, preview, and delete their files using AWS S3 for storage.

## Features

- **User Authentication**
  - User registration and login
  - JWT-based authentication (Access & Refresh tokens)
  - All file operations protected by token-based authentication

- **File Upload to AWS S3**
  - Logged-in users can upload files (images, PDFs, docs)
  - Files are uploaded from backend to AWS S3 (not directly from frontend)

- **File Listing and Management**
  - Users can view a list of their uploaded files
  - Preview files (images, PDFs, docs) in a modal
  - Download and delete files securely

## Tech Stack

- **Frontend:** React, Redux Toolkit, Redux Persist, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose, AWS SDK (S3), JWT, Multer
- **Authentication:** JWT (Access & Refresh tokens)
- **Storage:** AWS S3

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/secure-file-storage-s3.git
cd secure-file-storage-s3
```

### 2. Backend Setup

- Go to the `server` folder:
  ```bash
  cd server
  ```
- Install dependencies:
  ```bash
  npm install
  ```

  ```
- Start the backend server:
  ```bash
  npm run dev
  ```

### 3. Frontend Setup

- Go to the `client` folder:
  ```bash
  cd ../client
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Create a `.env.local` file:
  ```
  NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
  ```
- Start the frontend:
  ```bash
  npm run dev
  ```

## Usage

1. Register a new user and log in.
2. Upload files (images, PDFs, docs).
3. View your files as cards, preview them, download, or delete as needed.


## Notes

- All file operations are protected and require authentication.
- Files are securely stored in AWS S3 and managed via backend APIs.
- The UI is responsive and user-friendly, similar to an ecommerce product grid.


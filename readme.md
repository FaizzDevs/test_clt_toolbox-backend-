# CLT Layup Management System - Technical Test

![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Ringkasan Proyek

Aplikasi **CLT Layup Management System** adalah solusi manajemen Cross-Laminated Timber (CLT) yang dibangun sebagai bagian dari technical test. Aplikasi ini memungkinkan pengguna untuk mengelola data supplier, layups, dan layers dengan hierarki yang jelas.

**Fitur Utama yang Berhasil Diimplementasikan:**
- CRUD Suppliers
- CRUD Layups (nested di bawah Supplier)
- CRUD Layers (nested di bawah Layup)
- Import Excel dengan Conflict Resolution
- UI Responsif dengan Tailwind CSS

---

## Screenshot Aplikasi

### Halaman Daftar Suppliers
![Suppliers List](/public/image.png)
*Halaman utama menampilkan daftar supplier dengan fitur search, add, dan delete*

### Halaman Detail Supplier
![Supplier Details](/public/Screenshot%202026-02-26%20101835.png)
*Detail supplier dengan informasi lengkap dan daftar layups*

### Halaman Detail Layup dengan Visualizer
![Layup Details](/public/Screenshot%202026-02-26%20101951.png)
*Halaman layup dengan visualizer 3D layers dan tabel komposisi*

### Modal Import Excel
![Import Modal](/public/Screenshot%202026-02-26%20102014.png)
*Modal import dengan pilihan conflict resolution strategy*

---

## Fitur yang Diimplementasikan

### 1. **CRUD Operations**
- **Suppliers**: Create, Read, Update, Delete
- **Layups**: Create, Read, Update, Delete (nested di bawah supplier)
- **Layers**: Create, Read, Update, Delete (nested di bawah layup)

### 2. **Hierarki Data**
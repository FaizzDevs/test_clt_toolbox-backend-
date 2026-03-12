# CLT Layup Management System - Technical Test

![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Ringkasan Proyek

Aplikasi ini memungkinkan pengguna untuk mengelola data supplier, layups, dan layers dengan hierarki yang jelas.

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

## Setup & Installation

### 1. Clone Repository

```bash
git clone https://github.com/FaizzDevs/test_clt_toolbox-backend-.git
cd project-name
```

### 2. Install Dependencies

Install dependency backend dan frontend.

```bash
composer install
npm install
```

### 3. Setup Environment

Copy file environment:

```bash
cp .env.example .env
```

Generate Laravel app key:

```bash
php artisan key:generate
```

### 4. Configure Database

Edit file `.env` dan isi konfigurasi database (Supabase / PostgreSQL).

Contoh:

```
DB_CONNECTION=pgsql
DB_HOST=your-db-host
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-password
```

### 5. Run Migration

```bash
php artisan migrate
```

### 6. Run Application

Start Laravel server:

```bash
php artisan serve
```

Start frontend development server:

```bash
npm run dev
```

Aplikasi dapat diakses di:

```
http://127.0.0.1:8000
```

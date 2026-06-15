# AutoRevive 🚗

## Modern car marketplace platform built with **Nuxt 3**, **Vue 3**, **Directus CMS**, and **TailwindCSS** featuring advanced filtering, infinite scroll pagination, dynamic car pages, and responsive UI design.

# Live Demo
- https://auto-revive.vercel.app/


# Features

- 🚗 Modern car listing platform
- 🔍 Advanced filtering system
- ♾️ Infinite scroll pagination
- ⚡ Fast and optimized UI
- 📱 Fully responsive design
- 🖼️ Dynamic car detail pages
- 🏷️ Smart sorting options
- 🔎 Real-time search functionality
- 🧩 Reusable Vue components
- 🌐 Directus CMS integration
- 💀 Skeleton loading states
- 🎨 Modern UI/UX experience

---

# Tech Stack

| Feature            | Technology      |
| ------------------ | --------------- |
| Frontend Framework | Nuxt 3 / Vue 3  |
| Styling            | TailwindCSS     |
| UI Components      | Nuxt UI         |
| Backend / CMS      | Directus CMS    |
| State Management   | Vue Composables |
| Image Optimization | Nuxt Image      |
| Deployment         | Vercel          |

---

# Project Structure

```bash
├── assets/
├── components/
│   ├── CarCard.vue
│   ├── CarFilters.vue
│
├── composables/
│   ├── useCarFilters.js
│
├── pages/
│   ├── index.vue
│   ├── cars/
│   │   ├── [slug].vue
│
├── public/
│   ├── nocarfound.png
│
├── app.vue
├── nuxt.config.ts
├── package.json
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/paras-7span/autorevive.git
```

## Move Into Project Directory

```bash
cd autorevive
```

## Install Dependencies

```bash
npm install
```

---

---

# Run Development Server

```bash
npm run dev
```

Runs locally on:

```bash
http://localhost:3000
```

---

# Production Build

## Build Project

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

---

# Core Features

## Car Listings

Displays all available vehicles with detailed information including:

- Brand
- Model
- Variant
- Price
- Mileage
- Fuel Type
- Transmission
- Ownership
- Registration Year

---

## Advanced Filtering

Supports multiple filtering options:

- Brand
- Fuel Type
- Transmission
- Body Type
- Ownership
- Registration Year
- Price Range
- KM Driven

---

## Sorting Options

Users can sort vehicles by:

- Price: Low to High
- Price: High to Low
- Newest First
- Oldest First
- KM: Low to High

---

# Infinite Scroll Pagination

AutoRevive uses frontend-based infinite scrolling for a smooth browsing experience.
This improves user experience by reducing unnecessary page navigation.

---

# Performance Optimizations

- Lazy rendering
- Skeleton loaders
- Infinite scrolling
- Optimized API fetching
- Reusable component structure
- Responsive image handling
- Computed state optimization

---

---

# Development Guidelines

- Create new branch from `main`
- Pull latest changes before starting work
- Maintain reusable component structure
- Follow clean and scalable coding practices
- Keep UI responsive across all devices



---

# Architecture of AutoRevive
<img width="1024" height="1536" alt="Architecture Image" src="https://github.com/user-attachments/assets/6ed4dbe4-337d-467b-9e75-24969b722e9e" />

---

# Developer

Developed by **Paras Bhalala**

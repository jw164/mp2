# MP2: Pokédex Directory

Deployed Site: [https://jw164.github.io/mp2/](https://jw164.github.io/mp2/)

## 🎯 Overview
This project is a **Pokédex directory** built with **React + TypeScript**, developed as part of **CS409 Web Programming (Fall 2025)** at UIUC.  
It allows users to explore Pokémon data via a searchable, sortable, and filterable interface, and view detailed information about each Pokémon.  
The project is deployed automatically via **GitHub Actions** to **GitHub Pages**.

---

## 🧩 Features

| Feature | Description |
|----------|--------------|
| **List View** | Displays Pokémon list fetched from the PokeAPI. |
| **Search Bar** | Filters Pokémon dynamically by name. |
| **Sorting** | Sorts Pokémon by name or ID, in ascending or descending order. |
| **Gallery View** | Displays Pokémon as image cards; clicking opens details. |
| **Detail View** | Shows Pokémon stats (ID, type, base experience, height, weight). Includes **Previous** and **Next** navigation. |
| **404 Page** | Custom “Not Found” page with link back to home. |
| **Routing** | Implemented with React Router (with `basename="/mp2"`). |
| **No Inline Styling** | All styles managed through modular CSS (`layout.module.css`). |
| **Responsive Design** | Layout adapts for both desktop and mobile. |

---

## ⚙️ Tech Stack

- **React (TypeScript)**
- **React Router DOM**
- **CSS Modules**
- **GitHub Actions + GitHub Pages** (for CI/CD deployment)
- **PokeAPI** as the external REST API source

---

## 🗂️ File Structure

src/
├── components/
│ └── NavBar.tsx
├── pages/
│ ├── ListView.tsx
│ ├── GalleryView.tsx
│ ├── DetailView.tsx
│ └── NotFound.tsx
├── styles/
│ └── layout.module.css
├── App.tsx
└── index.tsx
References

PokeAPI: https://pokeapi.co/

(Data source for Pokémon attributes and images)

React Router DOM Docs: https://reactrouter.com/en/main

React Official Docs: https://react.dev/

Create React App Docs: https://create-react-app.dev/

All implementation and styling were written by Jintao Wang (jw164).
No code was copied directly from external sources; references above were used solely for documentation and conceptual clarity.

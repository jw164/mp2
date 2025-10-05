# Pokédex Directory (CS409 MP2)

**Deployed site:** [https://jw164.github.io/mp2/](https://jw164.github.io/mp2/)

This project is a Pokémon directory built with **React + TypeScript** for the **CS409 Web Programming (Fall 2025)** course.  
It allows users to browse Pokémon data from the PokeAPI, search by name, sort by attributes, and view detailed information in both list and gallery views.  
All components, routing, and styling were implemented following React best practices without using inline styles or external templates.

---

## 📁 File Structure



React Official Docs: https://react.dev/

Create React App Docs: https://create-react-app.dev/

All implementation and styling were written by Jintao Wang (jw164).  
No code was copied directly from external sources; references above were used solely for documentation and conceptual clarity.


src/

├── components/

│   └── NavBar.tsx

├── pages/

│   ├── ListView.tsx

│   ├── GalleryView.tsx

│   ├── DetailView.tsx

│   └── NotFound.tsx

├── styles/

│   └── layout.module.css

├── App.tsx

└── index.tsx





## 🔗 References

- **PokeAPI:** [https://pokeapi.co/](https://pokeapi.co/)  
  (Data source for Pokémon attributes and images)

- **React Router DOM Docs:** [https://reactrouter.com/en/main](https://reactrouter.com/en/main)

- **React Official Docs:** [https://react.dev/](https://react.dev/)

- **Create React App Docs:** [https://create-react-app.dev/](https://create-react-app.dev/)

---

## 🧩 Features Implemented

- Displayed Pokémon list with data fetched from PokeAPI  
- Implemented search bar for filtering Pokémon by name  
- Added sorting functionality for multiple properties (Name, ID, etc.)  
- Supported ascending and descending order sorting  
- Created a responsive gallery view using Pokémon sprites  
- Built a detailed Pokémon page with type, stats, and image  
- Implemented React Router navigation (`List`, `Gallery`, and `Details`)  
- Added a clean 404 “Not Found” page for invalid routes  
- All styles written in modular CSS (no inline styling or tables)

---

## 👨‍💻 Author

**Jintao Wang (jw164)**  
Master’s student, University of Illinois Urbana-Champaign (UIUC)  
Course: *CS409 Web Programming (Fall 2025)*  

---

## 📜 Academic Honesty Declaration

This project was completed individually by **Jintao Wang (jw164)** for **CS409 Web Programming**.  
All code and styles were written independently.  
External references were used **only for documentation and conceptual understanding**, not for code copying.  
All third-party sources have been properly cited above.

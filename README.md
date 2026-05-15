# Muhammad Haroon — Developer Portfolio

A modern, dark-theme developer portfolio built with **React + Tailwind CSS**.

---

## 🗂 Folder Structure

```
portfolio/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx          ← All sections + components
│   └── index.jsx        ← React entry point
├── package.json
├── tailwind.config.js
└── README.md
```

---

## ⚡ Quick Start

### 1. Create Vite + React project

```bash
npm create vite@latest portfolio -- --template react
cd portfolio
```

### 2. Install dependencies

```bash
npm install
npm install framer-motion lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Configure Tailwind

In `tailwind.config.js`:
```js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

In `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. Replace App.jsx

Copy the provided `App.jsx` into `src/App.jsx`.

### 5. Run

```bash
npm run dev
```

Open `http://localhost:5173`

---

## 📦 Required Dependencies

| Package | Purpose |
|--------|---------|
| `react` | UI framework |
| `react-dom` | DOM rendering |
| `framer-motion` | Smooth animations |
| `lucide-react` | Icon library |
| `tailwindcss` | Utility-first CSS |
| `vite` | Build tool |

---

## 🏗 Build for Production

```bash
npm run build
```

Output → `dist/` folder. Deploy to Vercel, Netlify, or GitHub Pages.

---

## 🎨 Customization

- **Colors**: Change `#4f46e5` / `#818cf8` / `#38bdf8` to your preferred palette
- **Content**: Edit `SKILLS`, `PROJECTS`, `EDUCATION`, `CERTS` arrays in `App.jsx`
- **Fonts**: Change Google Fonts import URL at the bottom of App.jsx
- **WhatsApp**: Update phone number in Contact section `href="https://wa.me/YOUR_NUMBER"`

---

## ✨ Features

- Dark theme with glass morphism
- Animated typing effect (hero)
- Scroll-reveal animations
- Animated skill progress bars
- Tab-filtered skills section
- Timeline education cards
- Certification cards with glow
- Project cards with tech badges
- Contact form with WhatsApp
- Sticky responsive navbar
- Mobile-first responsive layout
- Loading screen animation
- Custom scrollbar styling

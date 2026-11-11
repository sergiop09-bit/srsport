# SRsport
Plataforma web para organizar partidos de fútbol, baloncesto y voleibol.
**Frontend:** React + Vite (GitHub Pages) · **Backend:** Node + Express · **Base de datos:** MongoDB (Atlas) · **Login:** JWT + bcrypt

## Correr en local
1. Crea un clúster gratis en mongodb.com/atlas y copia tu cadena de conexión.
2. Backend: `cd server`, copia `.env.example` a `.env` y llénalo, luego `npm install` y `npm run dev` (API en http://localhost:4000).
3. Frontend (otra terminal, en la raíz): copia `.env.example` a `.env`, `npm install` y `npm run dev`.
4. Entra a `#/admin` con el ADMIN_EMAIL y ADMIN_PASS de `server/.env`.

## Publicar
- Backend: súbelo a Render (Web Service, carpeta `server`, start `npm start`) con las variables de `server/.env`; en FRONT_URL pon `https://TU-USUARIO.github.io`.
- Frontend: en `.env` pon `VITE_API_URL=https://tu-api.onrender.com` y ejecuta `npm run deploy`. Luego activa Pages (rama `gh-pages`).

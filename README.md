# SRsport

Plataforma web para conectar personas que practican **fútbol, baloncesto y voleibol**: encuentra partidos, completa tu equipo y entrena con rutinas hechas a tu medida.


## Enlaces

- Página publicada: https://sergiop09-bit.github.io/srsport/
- API publicada: https://srsport-api.onrender.com/api/partidos

> La API está en un plan gratuito: si nadie la usa por un rato, la primera respuesta puede tardar hasta un minuto.

## Qué incluye

| Entregable del reto | En SRsport |
|---|---|
| Landing / inicio | Mensaje de marca, deportes, cómo funciona y por qué SRsport |
| Catálogo | Partidos abiertos con filtro por deporte, lugar, fecha y cupos |
| Contacto real | Formulario que guarda cada mensaje en la base de datos |
| Panel admin | Login, y crear, editar y eliminar partidos; ver y borrar mensajes |
| IA aplicada | Generador de rutinas según deporte, nivel, objetivo y días |
| Publicación | Frontend en GitHub Pages y backend en Render |

Además: diseño responsive con menú para celular, animaciones con AOS y validaciones en frontend y backend.

## Tecnologías

| Parte | Herramientas |
|---|---|
| Frontend | React, Vite, React Router, CSS, AOS |
| Backend | Node.js, Express |
| Base de datos | MongoDB Atlas con Mongoose |
| Seguridad | bcrypt para cifrar la contraseña del admin y JWT para la sesión |
| Control de versiones | Git y GitHub |
| Publicación | GitHub Pages y Render |

## Estructura

```
srsport/
├── server/          Backend (Express + MongoDB)
│   └── index.js     Modelos, rutas y login
├── src/
│   ├── App.jsx      Pantallas y componentes
│   ├── api.js       Llamadas al backend
│   ├── main.jsx     Arranque de React
│   └── styles.css   Estilos y paleta
├── public/          Favicon
└── index.html
```

## Cómo ejecutarlo en local

1. Crea un clúster gratuito en MongoDB Atlas y copia su cadena de conexión.
2. Backend: entra a `server`, copia `.env.example` a `.env` y complétalo. Luego `npm install` y `npm run dev` (queda en http://localhost:4000).
3. Frontend: en la carpeta principal, copia `.env.example` a `.env`, ejecuta `npm install` y `npm run dev` (queda en http://localhost:5173).

### Variables de entorno

- Backend (`server/.env`): `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASS`, `FRONT_URL`
- Frontend (`.env` y `.env.production`): `VITE_API_URL`

Los archivos `.env` no se suben al repositorio.

## Seguridad

- La contraseña del administrador se guarda cifrada con bcrypt.
- Las rutas para crear, editar y borrar partidos y para leer mensajes exigen un token JWT.
- Los datos se validan en el frontend y en el backend.

## Mejoras futuras

- Seguimiento de entrenamientos y progreso.
- Desafíos semanales y perfiles de usuario.
- Rutinas generadas con un modelo de IA real.

## Autor

Proyecto desarrollado por Sergio Piamba =).
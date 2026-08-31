# IANCONIA — Plataforma editorial fullstack

Plataforma editorial desarrollada desde cero para publicar artículos, reseñas de libros, documentales y un briefing automatizado de noticias.

El proyecto combina una experiencia de lectura cuidada con administración de contenido, automatización de datos, seguridad y analítica en producción.

## Características principales

- Experiencia de lectura responsive con diseño editorial.
- Panel administrativo para gestionar artículos, libros y documentales.
- Autenticación mediante JWT y protección de datos con Row Level Security.
- Newsletter con correos de bienvenida y notificaciones a suscriptores.
- Generador de imágenes para Instagram Stories.
- Google Analytics 4 con seguimiento de tráfico y comportamiento.
- Despliegue continuo y dominio propio.

## Pipeline automatizado de noticias

IANCONIA incorpora un pipeline ETL serverless que procesa múltiples fuentes RSS cada 12 horas:

`RSS → extracción → limpieza → clasificación → scoring → Supabase → React`

El sistema clasifica noticias en siete categorías, determina su relevancia, evita duplicados y elimina automáticamente el contenido antiguo.

## Stack tecnológico

- **Frontend:** React 19, Vite, Tailwind CSS y React Router
- **Backend y datos:** Supabase, PostgreSQL, Edge Functions y Storage
- **Seguridad:** Supabase Auth, JWT y Row Level Security
- **Automatización:** TypeScript, RSS y Supabase Cron
- **Email:** Resend API, DKIM, SPF y DMARC
- **Analytics:** Google Analytics 4
- **Deploy:** Vercel CI/CD y dominio propio

## Lo que demuestra

Este proyecto refleja experiencia construyendo y desplegando un producto fullstack completo: desde el diseño de interfaz y la arquitectura de datos hasta la seguridad, automatización, analítica y operación en producción.

---

Desarrollado por **Ian Tapia**.

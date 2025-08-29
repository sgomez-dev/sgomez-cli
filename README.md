# 🚀 sgomez CLI

Un **CLI interactivo** para inicializar proyectos de frontend y backend con tus frameworks favoritos.  
Compatible con **React (Vite), Next.js, Angular, Node.js + Express, NestJS, Django y Go**.  
Además soporta herramientas como **Tailwind CSS v4** y **Framer Motion**.

---

## 📦 Instalación

Clona el repositorio e instala las dependencias:

```bash
git clone https://github.com/tuusuario/sgomez-cli.git
cd sgomez-cli
npm install
```

Enlaza el CLI globalmente (para poder usar el comando `sgomez` en cualquier lugar):

```bash
npm link
```

---

## ⚡ Uso

Ejecuta el comando:

```bash
sgomez start
```

Y sigue el asistente interactivo:

```
Hola, estoy para ayudarte inicializando tu nuevo proyecto.
¿Con qué quieres empezar?

- React (Vite)
- Next.js
- Angular
- Node.js (Express)
- NestJS
- Django
- Go
```

El asistente preguntará:

1. **Framework o Lenguaje** (React, Angular, Next.js, Node, etc.)
2. **Herramientas extra** (Tailwind v4, Framer Motion, etc.)
3. **Lenguaje** (JavaScript / TypeScript, si aplica).
4. **Licencia** (MIT, Apache, GPL, etc.)
5. **Nombre del proyecto**.

Luego se crearán automáticamente todos los archivos y se instalarán las dependencias necesarias. 🎉

---

## 🛠️ Frameworks soportados

### Frontend

- **React (Vite)** → con soporte para Tailwind v4 + Framer Motion
- **Next.js** → con Tailwind v4 (según [guía oficial](https://tailwindcss.com/docs/guides/nextjs))
- **Angular** → con Tailwind v4

### Backend

- **Node.js + Express** → servidor básico `server.js` listo para usar
- **NestJS** → usando `@nestjs/cli`
- **Django** (Python) → `django-admin startproject`
- **Go** → con un `main.go` básico

---

## 📖 Ejemplo

```bash
sgomez start
```

➡ Selecciona **React (Vite)**  
➡ Escoge **TypeScript**  
➡ Activa **Tailwind v4** y **Framer Motion**  
➡ Nombre del proyecto: `mi-dashboard`

El CLI ejecutará:

```bash
npm create vite@latest mi-dashboard -- --template react-ts
cd mi-dashboard
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install framer-motion
```

Y tendrás un proyecto React (Vite) listo para comenzar.

---

## ⚠️ Requisitos previos

Asegúrate de tener instalados:

- [Node.js](https://nodejs.org/) ≥ 18
- [npm](https://www.npmjs.com/) ≥ 9
- [Python](https://www.python.org/) ≥ 3.8 (para Django)
- [Go](https://go.dev/dl/) ≥ 1.20 (para Go projects)

---

## 📌 Roadmap

- [ ] Soporte para bases de datos (PostgreSQL, MongoDB, Firebase, Supabase).
- [ ] Generar configuración CI/CD.
- [ ] Integración con Docker.

---

## 📜 Licencia

Este proyecto está bajo la licencia **MIT**.  
¡Eres libre de usarlo, modificarlo y compartirlo!

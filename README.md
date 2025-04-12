# 🧵 Sistema de Foros - Proyecto FullStack Angular (Frontend)

Este proyecto corresponde al desarrollo de un sistema de foros online, como parte de la evaluación final del módulo **Desarrollo Full Stack III**. Fue construido utilizando **Angular 17 en modo standalone** y simula funcionalidades completas de registro, autenticación, roles y gestión de contenido.

---

## 🎯 Objetivo

Construir la interfaz web de un foro utilizando Angular y buenas prácticas empresariales:

- Frontend modular, responsive y mantenible
- Uso de `localStorage` para simular base de datos
- Control de sesión y roles
- Panel de administración exclusivo

---

## 🛠️ Tecnologías y herramientas

- Angular 17 (standalone)
- Bootstrap 5 (diseño responsive)
- TypeScript
- HTML + CSS
- `localStorage` para persistencia simulada
- Git para control de versiones

---

## 👥 Tipos de usuario

| Rol           | Descripción                                                                      | Acceso                                           |
| ------------- | -------------------------------------------------------------------------------- | ------------------------------------------------ |
| Usuario       | Puede registrarse, iniciar sesión, crear temas y comentar                        | Público                                          |
| Administrador | Además de lo anterior, puede ver y gestionar todos los temas (banear o eliminar) | Solo visible si se registra como "Administrador" |

---

## 🔐 Funcionalidades principales

### Autenticación

- Registro de usuario con validación estricta de contraseña
- Roles: usuario y administrador
- Inicio de sesión con persistencia (`localStorage`)
- Modificación de perfil
- Logout y control de sesión
- Recuperar contraseña (pantalla simulada)

### Foro

- Lista de 5 categorías
- Temas por categoría
- Crear nuevo tema
- Ver contenido del tema + comentarios
- Comentar si está logueado
- Ver advertencia si el tema fue baneado

### Panel Administrador

- Acceso exclusivo para usuarios con rol `admin`
- Ver todos los temas
- Banear (marcar como restringido) o eliminar temas

---

## 🚧 Seguridad y control de acceso

- Rutas protegidas con `authGuard` y `adminGuard`
- Navbar dinámico según sesión y rol
- Acciones de foro y navegación condicionadas

---

## ▶️ Instrucciones para ejecutar

1. Clona el repositorio o descomprime el `.zip`
2. Abre la terminal en la carpeta del proyecto
3. Ejecuta:

```bash
npm install
ng serve
```

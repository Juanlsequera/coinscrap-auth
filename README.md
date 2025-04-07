# 🚀 Coinscrap Auth API

Este proyecto es una API de autenticación desarrollada con **NestJS** y **MongoDB**, que se ejecuta en **Docker Compose**.

---

## 📂 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- [Docker y Docker Compose](https://docs.docker.com/get-docker/)
- [Node.js (v18+)](https://nodejs.org/)
- [Postman](https://www.postman.com/)

---

## 🔧 Configuración del entorno

1️⃣ **Clonar el repositorio**

```sh
git clone https://github.com/Juanlsequera/coinscrap-auth.git
cd coinscrap-auth
```

2️⃣ **Crear el archivo `.env`** en la raíz del proyecto y copiar lo siguiente:

```env
MONGO_DB=coinscrap
JWT_SECRET=yourRandomSecretKey12345
JWT_REFRESH_SECRET=yourRandomRefreshSecretKey54321
PORT=3000
```

---

## 🐳 Levantar la base de datos con Docker

Para iniciar **MongoDB** con Docker Compose, ejecuta:

```sh
docker-compose up -d
```

Esto iniciará un contenedor con **MongoDB** en `localhost:27017`.

Para verificar que el contenedor está corriendo:

```sh
docker ps
```

Si quieres ver los logs dentro del contenedor de la BBDD:

```sh
docker logs mongodb
```

Si necesitas eliminar la base de datos y crear una nueva:

```sh
docker-compose down -v
```

---

Opcional, si quieres limpiar todos los volúmenes no usados

```sh
docker volume prune -f
```

---

## ▶️ Ejecutar la API

Para instalar las dependencias y ejecutar la API:

```sh
npm install
npm run start:dev
```

La API se ejecutará en `http://localhost:3000`.

---

## 🔥 Probar la API con Postman

1️⃣ **Importar la colección de Postman**

- En Postman, ve a **File > Import** y selecciona el archivo `API COINSCRAP.postman_collection.json` que esta aqui en el repositorio.

2️⃣ **Enviar las peticiones**

- Abre la colección en Postman y prueba los endpoints.

Si la API requiere autenticación como el /login o /profile, asegúrate de crear un usuario primero con la ruta /api/register que al momento de crear un usuario en el mongo, se genera un token el cual te permite tener acceso a las demas rutas.

---

## 🛠 Comandos útiles

### Ver los volúmenes de Docker

```sh
docker volume ls
```

### Eliminar un volumen específico

```sh
docker volume rm nombre-del-volumen
```

### Eliminar todos los volúmenes

```sh
docker volume prune -f
```

---

✅ Ahora ya puedes probar la API. ¡Feliz coding! 🚀

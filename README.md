# FullStackOpen - Parte 3: Comunicación Frontend-Backend

**Aplicación en Vivo:** [https://part3-fullstackopen-knva.onrender.com/](https://part3-fullstackopen-knva.onrender.com/)

---

## Contexto del Proyecto

Esta sección contiene el desarrollo de la **Parte 3** del curso FullStackOpen. El objetivo principal de este módulo ha sido la creación de una API RESTful real con Node.js y Express, conectándola a una base de datos MongoDB y sirviendo el frontend de React de forma integrada para su despliegue en producción.

---

## Contenido de la Parte 3

En esta etapa, la aplicación **Phonebook (Agenda Telefónica)** evolucionó de ser un proyecto puramente frontend a una aplicación Full Stack completamente funcional:

### Backend Node.js/Express
Se construyó una API REST robusta que maneja las peticiones GET, POST, PUT y DELETE. Se implementó un middleware para el manejo centralizado de errores y `morgan` para el registro (logging) de las peticiones HTTP.

### Integración con MongoDB (Mongoose)
Se sustituyó el almacenamiento local en memoria por una base de datos documental. Se definieron esquemas estrictos (`person.js`) que incluyen validaciones personalizadas:
- Longitud mínima para el nombre
- Formato de expresión regular para el teléfono: `^\d{2,3}-\d+$`

### Sinergia Frontend-Backend
El frontend de React se compiló para producción y se sirve estáticamente desde el backend a través de la carpeta `dist`. El frontend fue modificado para capturar y mostrar los mensajes de error de validación provenientes de la base de datos.

---

## Reflexión y Desafíos Técnicos Superados

La transición hacia una arquitectura Full Stack presentó varios retos importantes relacionados con la asincronía y la gestión de errores:

### 1. Manejo Avanzado de Promesas y Errores (Axios)

**El desafío:** 
El backend ahora lanza errores específicos (como `ValidationError` de Mongoose cuando un número no cumple el formato). El frontend necesitaba capturar estos errores y no solo fallar silenciosamente.

**La solución:** 
Se refinaron los bloques `.catch()` en las peticiones Axios. Ahora, la interfaz es capaz de leer la respuesta del servidor (`error.response.data.error`) y renderizar una notificación roja detallada para el usuario, manteniendo el estado local intacto si la base de datos rechaza la operación.

### 2. Optimización del hook `useEffect`

**El desafío:** 
Sincronizar el estado de React con la base de datos externa previniendo peticiones HTTP redundantes.

**La solución:** 
Se utilizó el hook `useEffect` con un arreglo de dependencias vacío `[]` para la carga inicial de la lista telefónica, asegurando que los datos se obtengan exactamente una sola vez durante el montaje del componente.

### 3. Estado Asíncrono y Renderizado

**El desafío:** 
Al actualizar un contacto existente (PUT request), era crucial que la interfaz no mostrara datos desactualizados antes de que el servidor confirmara la transacción.

**La solución:** 
Las funciones de actualización de estado (`setPersons`) se colocaron estrictamente dentro de las resoluciones `.then()` de las promesas. Esto garantiza que el DOM refleje siempre la "verdad" de la base de datos.

---

## Estructura del Repositorio

Este repositorio contiene exclusivamente el código del backend, el cual sirve los archivos estáticos del frontend ya compilados:

```text
├── dist/          # Build de producción del frontend de React (servido estáticamente)
├── models/        # Esquemas de Mongoose (person.js)
├── index.js       # Punto de entrada de la API Express
├── mongo.js       # Script de prueba de conexión a la BD
├── package.json   # Dependencias y scripts del servidor
└── .env           # Variables de entorno (No subido al repo)
```

---

## Herramientas Utilizadas

- **Backend:** Node.js, Express
- **Base de Datos:** MongoDB, Mongoose
- **Middlewares:** CORS, Morgan (con tokens personalizados para el body)
- **Frontend (En dist/):** React, Vite, Axios
- **Linter:** ESLint (estricto manejo de código limpio y espaciado)

---

## Guía de Ejecución Local

Para levantar el servidor de la API en tu entorno local:

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto y añade el URI de tu base de datos y el puerto:

```env
PORT=3001
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0...
```

### 3. Iniciar el servidor

```bash
# Para desarrollo (con recarga automática de Node)
npm run dev

# Para producción
npm start
```

### 4. Acceso

Abre tu navegador en `http://localhost:3001`. El backend servirá automáticamente la interfaz de usuario contenida en la carpeta `dist`.

---

## Notas

- El archivo `.env` no está incluido en el repositorio por razones de seguridad
- Asegúrate de tener una instancia de MongoDB accesible
- El frontend debe compilarse y copiarse a la carpeta `dist` antes del despliegue

---

**Desarrollado como parte del curso FullStackOpen**
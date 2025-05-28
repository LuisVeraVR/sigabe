# SIGABE Backend - Sistema de Gestión de Biblioteca

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4.2-blue)
![Express](https://img.shields.io/badge/Express-5.1.0-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)
![TypeORM](https://img.shields.io/badge/TypeORM-0.3.22-orange)

Backend REST API para el Sistema de Gestión de Biblioteca (SIGABE) desarrollado con Node.js, TypeScript, Express y MongoDB.

## 📋 Características

- ✅ Gestión completa de libros (CRUD)
- ✅ Sistema de autenticación con JWT
- ✅ Gestión de préstamos de libros
- ✅ Sistema de multas automático
- ✅ Control de usuarios y administradores
- ✅ Validación de datos con class-validator
- ✅ Base de datos MongoDB con TypeORM
- ✅ CORS configurado para frontend
- ✅ Desplegado en Vercel

## 🚀 Tecnologías

- **Runtime:** Node.js 18.x
- **Lenguaje:** TypeScript
- **Framework:** Express.js
- **Base de datos:** MongoDB
- **ORM:** TypeORM
- **Autenticación:** JWT (jsonwebtoken)
- **Validación:** class-validator, express-validator
- **Encriptación:** bcrypt
- **Despliegue:** Vercel

## 📁 Estructura del Proyecto

```
src/
├── controller/          # Controladores de la API
│   ├── authController.ts
│   ├── bookController.ts
│   ├── loanController.ts
│   └── fineController.ts
├── entity/              # Entidades de la base de datos
│   ├── user.ts
│   ├── book.ts
│   ├── loan.ts
│   └── fine.ts
├── interfaces/          # Interfaces TypeScript
│   ├── auth.interface.ts
│   ├── loan.interface.ts
│   └── fine.interface.ts
├── middleware/          # Middlewares
│   ├── auth.middleware.ts
│   └── validation.middleware.ts
├── routes/              # Rutas de la API
│   ├── authRoutes.ts
│   ├── bookRoutes.ts
│   ├── loanRoutes.ts
│   └── fineRoutes.ts
├── validations/         # Validaciones personalizadas
│   ├── loan.validation.ts
│   └── fine.validation.ts
└── data-source.ts       # Configuración de la base de datos
```

## 🛠️ Instalación y Configuración

### Prerrequisitos

- Node.js 18.x o superior
- MongoDB (local o MongoDB Atlas)
- npm o yarn

### Clonar el repositorio

```bash
git clone https://github.com/LuisVeraVR/sigabe.git
cd sigabe
```

### Instalar dependencias

```bash
npm install
```

### Ejecutar en desarrollo

```bash
npm run dev
```

### Compilar para producción

```bash
npm run build
npm start
```

## 📊 API Endpoints

### Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Registrar usuario | No |
| POST | `/login` | Iniciar sesión | No |
| GET | `/profile` | Obtener perfil | Sí |
| GET | `/getUsers` | Listar usuarios | Sí |

### Libros (`/api/books`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/getBooks` | Listar libros | No |
| GET | `/getBooks/:id` | Obtener libro | No |
| POST | `/createBook` | Crear libro | Sí |
| PUT | `/updateBook/:id` | Actualizar libro | Sí |
| DELETE | `/deleteBook/:id` | Eliminar libro | Sí |

### Préstamos (`/api/loans`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar préstamos | Sí |
| POST | `/` | Crear préstamo | Sí |
| GET | `/:id` | Obtener préstamo | Sí |
| GET | `/user/:userId` | Préstamos por usuario | Sí |
| PATCH | `/:id/return` | Devolver libro | Sí |
| GET | `/status/overdue` | Préstamos vencidos | Sí |

### Multas (`/api/fines`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar multas | Sí |
| GET | `/:id` | Obtener multa | Sí |
| GET | `/user/:userId` | Multas por usuario | Sí |
| PATCH | `/:id/pay` | Pagar multa | Sí |
| GET | `/user/:userId/pending-total` | Total pendiente | Sí |
| GET | `/stats/summary` | Estadísticas | Sí |

## 🏗️ Modelos de Datos

### Usuario (User)
```typescript
{
  id: number,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  isAdmin: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Libro (Book)
```typescript
{
  id: number,
  title: string,
  author: string,
  year: number,
  publisher: string,
  type: string,
  photo?: string,
  available: boolean
}
```

### Préstamo (Loan)
```typescript
{
  id: number,
  userId: number,
  bookId: number,
  loanDate: Date,
  dueDate: Date,
  returnDate?: Date,
  status: 'active' | 'returned' | 'overdue'
}
```

### Multa (Fine)
```typescript
{
  id: number,
  loanId: number,
  amount: number,
  createdAt: Date,
  paidAt?: Date,
  status: 'pending' | 'paid'
}
```

## ⚙️ Reglas de Negocio

### Sistema de Multas
- **Período de gracia:** 0 días
- **Tarifa diaria:** $5.00 COP por día de retraso
- **Cálculo automático:** Al devolver un libro con retraso

### Estados de Préstamos
- **Active:** Préstamo activo
- **Returned:** Libro devuelto a tiempo
- **Overdue:** Libro devuelto con retraso (genera multa)

## 🔒 Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. 

### Headers requeridos
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Estructura del token
```typescript
{
  userId: number,
  email: string,
  isAdmin: boolean,
  exp: number,
  iat: number
}
```

## 🌐 CORS y Frontend

El backend está configurado para aceptar requests desde:
- `https://sigabe-frontend.vercel.app` (Producción)
- `http://localhost:3000` (Desarrollo)

### Repositorio Frontend
🔗 **Frontend Repository:** [SIGABE Frontend](https://github.com/LuisVeraVR/sigabe-frontend)

### Demo en vivo
🚀 **API Base URL:** `https://tu-backend.vercel.app/api`
🌐 **Frontend Demo:** `https://sigabe-frontend.vercel.app`

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Ejecutar en modo desarrollo

# Producción
npm run build        # Compilar TypeScript
npm start           # Ejecutar versión compilada

# Vercel
npm run vercel-build # Build para Vercel
```

## 🚀 Despliegue

### Vercel (Recomendado)

1. **Conectar repositorio:**
   - Importa el proyecto desde GitHub en Vercel
   - Vercel detectará automáticamente la configuración

2. **Variables de entorno:**
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=tu_jwt_secret
   NODE_ENV=production
   ```

3. **Configuración automática:**
   - `vercel.json` ya está configurado
   - Build command: `npm run vercel-build`
   - Output directory: `dist`

### Otras plataformas

- **Railway:** Conecta el repo y configura las variables de entorno
- **Heroku:** Usa el Procfile: `web: npm start`
- **DigitalOcean App Platform:** Configuración automática desde GitHub

## 📝 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `MONGODB_URI` | URI de conexión a MongoDB | `mongodb://localhost:27017/sigabe` |
| `JWT_SECRET` | Clave secreta para JWT | `mi_clave_super_secreta_2024` |
| `NODE_ENV` | Entorno de ejecución | `development` / `production` |
| `PORT` | Puerto del servidor | `5000` |

## 🧪 Testing

```bash
# Ejecutar tests (próximamente)
npm test

# Coverage (próximamente)
npm run test:coverage
```


## 👥 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes alguna pregunta o problema:

- 📚 Documentación: [Wiki del proyecto](https://github.com/LuisVeraVR/sigabe/wiki)

---

⭐ **¡No olvides dar una estrella al proyecto si te fue útil!** ⭐
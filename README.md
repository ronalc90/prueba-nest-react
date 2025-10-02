# Sistema de Gestión de Curso - Prueba Técnica Full-Stack

Aplicación completa para gestionar un curso y sus estudiantes, con cálculo dinámico del índice de diversidad basado en los dominios de email.

**Repositorio**: https://github.com/ronalc90/prueba-nest-react

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- Docker y Docker Compose
- npm

### Instalación y Ejecución

1. **Clonar el repositorio**:
```bash
git clone https://github.com/ronalc90/prueba-nest-react.git
cd prueba-nest-react
git checkout prueba-tecnica-Evalua
```

2. **Iniciar PostgreSQL con Docker**:
```bash
docker-compose up -d
```

3. **Backend** (Terminal 1):
```bash
cd backend
npm install
npm run start:dev
```
El backend estará en: `http://localhost:3001`

4. **Frontend** (Terminal 2):
```bash
cd frontend
npm install
npm run dev
```
El frontend estará en: `http://localhost:5173`

## 📁 Estructura del Proyecto

```
prueba-nest-react/
├── backend/              # API REST con NestJS
│   ├── src/
│   │   ├── entities/     # Entidades TypeORM
│   │   ├── dto/          # Data Transfer Objects
│   │   ├── services/     # Lógica de negocio
│   │   ├── controllers/  # Endpoints HTTP
│   │   ├── interceptors/ # Interceptor de errores
│   │   └── modules/      # Módulos de NestJS
│   ├── .env.example
│   └── README.md
├── frontend/             # SPA con React
│   ├── src/
│   │   ├── components/   # Componentes reutilizables
│   │   ├── pages/        # Páginas
│   │   ├── services/     # Servicios API
│   │   ├── types/        # TypeScript types
│   │   └── lib/          # Configuraciones
│   ├── .env.example
│   └── README.md
├── docker-compose.yml    # PostgreSQL container
└── README.md            # Este archivo
```

## 🎯 Características Implementadas

### Backend (NestJS + PostgreSQL)
- ✅ CRUD completo de curso (solo 1 curso permitido)
- ✅ Gestión de estudiantes con validación de cupo
- ✅ Cálculo automático del índice de diversidad
- ✅ Caché en memoria del índice
- ✅ Interceptor global de errores
- ✅ Validación con class-validator
- ✅ Índice en BD para optimización
- ✅ CORS habilitado

### Frontend (React + TypeScript)
- ✅ Interfaz completa para gestión de curso
- ✅ CRUD de estudiantes
- ✅ Gauge personalizado sin librerías
  - Semicírculo con colores dinámicos
  - Tooltip con cálculo detallado
- ✅ React Query para estado y caché
- ✅ useMemo para optimización
- ✅ Spinners en todas las operaciones
- ✅ Manejo de errores con alertas

## 🔧 Stack Tecnológico

### Backend
- NestJS 10
- TypeScript
- PostgreSQL 15
- TypeORM
- class-validator
- Docker Compose

### Frontend
- React 18
- TypeScript
- Vite
- React Query (@tanstack/react-query)
- Axios
- React Router DOM
- Tailwind CSS v3

## 📊 Requisito Especial: Índice de Diversidad

### Cálculo
```
Índice = (Dominios Únicos / Total Estudiantes) × 100
```

**Ejemplo**:
- 5 estudiantes:
  - juan@gmail.com
  - maria@gmail.com
  - pedro@outlook.com
  - ana@yahoo.com
  - luis@hotmail.com
- Dominios únicos: 4 (@gmail.com, @outlook.com, @yahoo.com, @hotmail.com)
- **Índice = (4 / 5) × 100 = 80%**

### Implementación Backend
- Cálculo en `CourseService`
- Caché en memoria (variable privada)
- Invalidación automática al agregar/eliminar estudiantes
- Respuesta incluida en `GET /course`

### Implementación Frontend
- Componente `DiversityGauge` personalizado
- Semicírculo con CSS puro (sin librerías)
- Animación con `transform: rotate()`
- Colores condicionales:
  - 🔴 Rojo: < 50%
  - 🟡 Amarillo: 50-75%
  - 🟢 Verde: > 75%
- Tooltip al hover con:
  - Fórmula de cálculo
  - Dominios únicos
  - Total de estudiantes
  - Porcentaje

## 🌐 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/course` | Crear curso |
| GET | `/course` | Obtener curso con índice |
| PATCH | `/course` | Actualizar curso |
| DELETE | `/course` | Eliminar curso |
| POST | `/course/students` | Agregar estudiante |
| GET | `/course/students` | Listar estudiantes |
| DELETE | `/course/students/:id` | Eliminar estudiante |

## 💡 Decisiones Técnicas

### Backend

#### 1. TypeORM con PostgreSQL
- **Razón**: Excelente integración con NestJS y soporte completo para TypeScript
- **Beneficio**: Entidades type-safe y relaciones automáticas

#### 2. Caché en Memoria
```typescript
private diversityIndexCache: number | null = null;
```
- **Razón**: Simple y suficiente para un solo curso
- **Mejora futura**: Redis para múltiples instancias

#### 3. Interceptor Global
- **Razón**: Formato consistente de errores en toda la API
- **Formato**: `{ statusCode: number, message: string }`

#### 4. Índice en BD
```typescript
@Index(['courseId'])
```
- **Razón**: Optimiza búsquedas de estudiantes por curso
- **Impacto**: Consultas más rápidas con muchos estudiantes

### Frontend

#### 1. React Query
- **Razón**: Gestión de estado asíncrono simplificada
- **Beneficios**:
  - Caché automático
  - Invalidación inteligente
  - Estados de carga/error integrados
  - Retry automático

#### 2. Gauge Personalizado (CSS)
- **Razón**: Requisito de no usar librerías
- **Técnica**:
  - Borders circulares con `border-radius: 50%`
  - Rotación con `transform: rotate(deg)`
  - Colores dinámicos con conditional styling
  - Tooltip con position absolute

#### 3. useMemo
```typescript
const studentItems = useMemo(() => {
  return students.map(...)
}, [students, onDelete, isDeleting]);
```
- **Razón**: Evita re-renders de lista completa
- **Dependencias**: Solo actualiza cuando cambian students, onDelete o isDeleting

#### 4. Tailwind CSS v3
- **Razón**: Versión estable compatible con Vite 7
- **Nota**: v4 requiere Vite 5/6, usamos v3 por compatibilidad

## 🧪 Testing Manual

1. Abrir `http://localhost:5173`
2. Crear un curso (botón "Crear Curso")
3. Agregar 5 estudiantes con diferentes dominios
4. Observar el gauge cambiar de color
5. Hover sobre el gauge para ver tooltip
6. Eliminar un estudiante
7. Ver actualización automática del índice
8. Editar el curso
9. Intentar agregar más estudiantes del cupo
10. Ver mensaje de error

## 📝 Validaciones Implementadas

### Backend
- Email válido (class-validator)
- Cupo máximo respetado
- Solo un curso permitido
- maxStudents >= estudiantes actuales

### Frontend
- Email HTML5 validation
- Campos requeridos
- Números positivos
- Confirmaciones de eliminación

## 🚦 Manejo de Errores

### Backend
```json
{
  "statusCode": 400,
  "message": "El curso ha alcanzado el cupo máximo"
}
```

### Frontend
- Alertas visuales con componente `ErrorAlert`
- Mensajes descriptivos del backend
- Botón para cerrar alerta
- Estados de error en React Query

## 🎨 Optimizaciones

### Backend
1. Índice en `students.courseId`
2. Caché del índice de diversidad
3. Validación con DTOs
4. Estructura modular

### Frontend
1. useMemo en lista de estudiantes
2. React Query cache
3. Code splitting automático (Vite)
4. Tree shaking de Tailwind

## 📄 Variables de Entorno

### Backend (`.env`)
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=gestion_curso
PORT=3001
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:3001
```

## 🐳 Docker

El proyecto incluye `docker-compose.yml` para PostgreSQL:

```bash
# Iniciar
docker-compose up -d

# Detener
docker-compose down

# Ver logs
docker-compose logs -f

# Eliminar datos
docker-compose down -v
```

## 📚 Documentación Adicional

- [Backend README](./backend/README.md) - Detalles de la API
- [Frontend README](./frontend/README.md) - Detalles de la UI

## 👨‍💻 Autor

**Ronald Demian Cipagauta Penagos**
- Email: dirox7@gmail.com
- GitHub: [@ronalc90](https://github.com/ronalc90)

Desarrollado como parte de la prueba técnica para Evalúa.

---

## 📋 Prueba Técnica Original

### Descripción General
Esta prueba técnica evalúa habilidades en desarrollo full-stack con NestJS (backend) y React (frontend). La aplicación gestiona un curso y sus estudiantes, con una funcionalidad personalizada para calcular un índice de diversidad basado en los dominios de emails.

**Duración estimada**: 30 horas

**Entrega**: Repositorio público en GitHub con código fuente, instrucciones de instalación y README actualizado.

### Requisitos Cumplidos

✅ Backend con NestJS + PostgreSQL + TypeORM
✅ Frontend con React + TypeScript + React Query + Tailwind CSS
✅ CRUD completo de curso y estudiantes
✅ Índice de diversidad calculado y cacheado
✅ Gauge personalizado sin librerías
✅ Validaciones y manejo de errores
✅ Optimizaciones (índices BD, caché, useMemo)
✅ Documentación completa
✅ Docker Compose
✅ Variables de entorno

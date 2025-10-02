# Frontend - Sistema de Gestión de Curso

Frontend desarrollado con React, TypeScript, Tailwind CSS, React Query y React Router para gestionar un curso y sus estudiantes.

## Tecnologías Utilizadas

- **Framework**: React 18
- **Lenguaje**: TypeScript
- **Build Tool**: Vite
- **Gestión de Estado**: @tanstack/react-query (React Query)
- **HTTP Client**: Axios
- **Rutas**: React Router DOM
- **Estilos**: Tailwind CSS v3
- **Optimización**: useMemo para listas de estudiantes

## Características Implementadas

### Páginas

- **Página Principal** (`/` y `/course`) - Gestión completa del curso y estudiantes

### Funcionalidades

#### Gestión del Curso
- Crear curso con modal
- Editar curso existente
- Eliminar curso (con confirmación)
- Visualización de nombre, descripción y cupo máximo

#### Gestión de Estudiantes
- Agregar estudiantes con formulario
- Listar estudiantes inscritos
- Eliminar estudiantes (con confirmación)
- Validación de email
- Validación de cupo máximo

#### Requisito Especial: Gauge de Índice de Diversidad

**Componente personalizado sin librerías externas** que muestra:
- Semicírculo que se llena según el porcentaje
- Colores dinámicos:
  - **Rojo** (<50%): Baja diversidad
  - **Amarillo** (50-75%): Diversidad media
  - **Verde** (>75%): Alta diversidad
- **Tooltip interactivo** al pasar el cursor mostrando:
  - Fórmula de cálculo
  - Dominios únicos
  - Total de estudiantes
  - Porcentaje resultante

### Optimizaciones Implementadas

1. **useMemo**: Lista de estudiantes optimizada para evitar renders innecesarios
2. **React Query**:
   - Caché automático de datos
   - Refetch on mutation
   - Retry con límite de 1 intento
   - No refetch on window focus
3. **Spinners**: Feedback visual durante todas las operaciones HTTP
4. **Manejo de Errores**: Alertas personalizadas con mensajes descriptivos
5. **Validación de Formularios**: HTML5 validation + validación de backend

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── AddStudentForm.tsx
│   │   ├── CourseModal.tsx
│   │   ├── DiversityGauge.tsx    # Gauge personalizado ⭐
│   │   ├── ErrorAlert.tsx
│   │   ├── Spinner.tsx
│   │   └── StudentList.tsx
│   ├── lib/                 # Configuraciones
│   │   └── axios.ts
│   ├── pages/               # Páginas
│   │   └── CoursePage.tsx
│   ├── services/            # Servicios API
│   │   └── courseService.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Entry point
│   └── index.css            # Estilos globales (Tailwind)
├── .env                     # Variables de entorno
├── .env.example             # Ejemplo de variables
├── tailwind.config.js       # Configuración de Tailwind
├── tsconfig.json            # Configuración de TypeScript
└── vite.config.ts           # Configuración de Vite
```

## Instalación y Ejecución

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Backend corriendo en `http://localhost:3001`

### Pasos de Instalación

1. **Instalar dependencias**:
```bash
npm install
```

2. **Configurar variables de entorno**:
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env si el backend está en otro puerto
```

3. **Iniciar el servidor de desarrollo**:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

### Comandos Disponibles

```bash
# Desarrollo con hot-reload
npm run dev

# Compilar para producción
npm run build

# Preview de producción
npm run preview

# Linter
npm run lint
```

## Decisiones Técnicas

### 1. React Query (TanStack Query)

Se eligió React Query por:
- **Caché automático**: Reduce peticiones innecesarias al backend
- **Invalidación inteligente**: Actualiza datos relacionados automáticamente
- **Estados integrados**: isLoading, isError, etc.
- **Mutations**: Manejo limpio de operaciones de escritura
- **DevTools**: Facilita debugging (opcional)

### 2. Tailwind CSS

Se usó Tailwind CSS v3 (versión estable) por:
- **Utility-first**: Desarrollo rápido sin escribir CSS custom
- **Responsive**: Diseño adaptable sin media queries manuales
- **Tree-shaking**: Solo incluye clases usadas en producción
- **Consistencia**: Sistema de diseño integrado

### 3. Gauge Personalizado

El gauge se implementó con CSS puro usando:
- **Borders circulares**: `border-radius: 50%`
- **Transform rotate**: Para animar el progreso
- **Conditional styling**: Colores dinámicos según porcentaje
- **Position absolute**: Para overlay de elementos
- **onMouseEnter/Leave**: Para tooltip interactivo

### 4. useMemo para Optimización

Se implementó `useMemo` en la lista de estudiantes para:
- Evitar re-renders innecesarios de cada item
- Dependencias específicas: solo re-renderiza si cambian students, onDelete o isDeleting
- Mejora el performance cuando hay muchos estudiantes

### 5. Axios

Se configuró Axios con:
- Base URL dinámica desde variables de entorno
- Headers por defecto (Content-Type: application/json)
- Cliente reutilizable para todas las peticiones

### 6. TypeScript

TypeScript proporciona:
- Type safety en toda la aplicación
- Autocompletado en IDEs
- Detección temprana de errores
- Mejor documentación del código

## Flujo de Datos

1. **Carga inicial**: React Query fetch el curso desde `/course`
2. **Crear curso**: Mutation → Invalidación de caché → Refetch automático
3. **Agregar estudiante**: Mutation → Invalidación → Recalculo de diversityIndex
4. **Eliminar estudiante**: Mutation → Invalidación → Actualización de lista
5. **Actualizar curso**: Mutation → Invalidación → Refresh de datos

## Manejo de Errores

Todos los errores se manejan de forma consistente:

```typescript
onError: (err: any) => {
  setError(err.response?.data?.message || 'Mensaje por defecto');
}
```

Los errores se muestran con el componente `ErrorAlert` que puede ser cerrado por el usuario.

## Variables de Entorno

```env
VITE_API_URL=http://localhost:3001
```

**Nota**: Vite requiere el prefijo `VITE_` para exponer variables al cliente.

## Integración con Backend

El frontend se conecta al backend a través de:
- **courseService.ts**: Abstracción de todas las llamadas API
- **React Query**: Gestión de estado y caché
- **Axios**: Cliente HTTP configurado

### Endpoints Consumidos

```typescript
GET    /course              → Obtener curso con índice de diversidad
POST   /course              → Crear curso
PATCH  /course              → Actualizar curso
DELETE /course              → Eliminar curso
POST   /course/students     → Agregar estudiante
GET    /course/students     → Listar estudiantes
DELETE /course/students/:id → Eliminar estudiante
```

## Testing Manual

1. **Abrir** `http://localhost:5173`
2. **Crear un curso** con el botón "Crear Curso"
3. **Agregar estudiantes** con diferentes dominios de email
4. **Observar** el gauge actualizar automáticamente
5. **Pasar el cursor** sobre el gauge para ver el tooltip
6. **Eliminar estudiantes** y ver cómo cambia el índice
7. **Editar** el curso para cambiar el cupo máximo
8. **Probar** agregar estudiantes cuando se alcanza el cupo

## Autor

Desarrollado como parte de la prueba técnica para Evalúa.

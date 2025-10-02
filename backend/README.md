# Backend - Sistema de Gestión de Curso

Backend desarrollado con NestJS, TypeScript, PostgreSQL y TypeORM para gestionar un curso y sus estudiantes.

## Tecnologías Utilizadas

- **Framework**: NestJS 10
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL 15 (Alpine)
- **ORM**: TypeORM
- **Validación**: class-validator y class-transformer
- **Containerización**: Docker Compose

## Características Implementadas

### Endpoints

#### Gestión del Curso
- `POST /course` - Crear un curso (solo se permite un curso en el sistema)
- `GET /course` - Obtener el curso con el índice de diversidad calculado
- `PATCH /course` - Actualizar el curso (nombre, descripción o cupo máximo)
- `DELETE /course` - Eliminar el curso y sus estudiantes (CASCADE)

#### Gestión de Estudiantes
- `POST /course/students` - Agregar un estudiante al curso
- `GET /course/students` - Listar todos los estudiantes del curso
- `DELETE /course/students/:id` - Eliminar un estudiante del curso

### Funcionalidad Especial: Índice de Diversidad

El índice de diversidad se calcula basado en los dominios de email de los estudiantes:

```
Índice = (Dominios Únicos / Total de Estudiantes) × 100
```

**Ejemplo**:
- 5 estudiantes con emails:
  - juan@gmail.com
  - maria@gmail.com
  - pedro@outlook.com
  - ana@yahoo.com
  - luis@hotmail.com
- 4 dominios únicos: @gmail.com, @outlook.com, @yahoo.com, @hotmail.com
- Índice de diversidad: (4 / 5) × 100 = **80%**

### Optimizaciones Implementadas

1. **Índice en Base de Datos**: Se agregó un índice en `students.courseId` para optimizar las búsquedas por curso
2. **Caché del Índice de Diversidad**: El índice se calcula una vez y se guarda en memoria. Solo se recalcula cuando:
   - Se agrega un estudiante
   - Se elimina un estudiante
   - Se elimina el curso
3. **Validación de DTOs**: Validación automática con `class-validator` para todos los endpoints
4. **Interceptor Global de Errores**: Formato consistente de errores con `statusCode` y `message`

### Manejo de Errores

Todos los errores siguen el formato:
```json
{
  "statusCode": 400,
  "message": "Descripción del error"
}
```

Códigos HTTP utilizados:
- `200 OK` - Respuesta exitosa
- `201 Created` - Recurso creado exitosamente
- `204 No Content` - Eliminación exitosa
- `400 Bad Request` - Error de validación o lógica de negocio
- `404 Not Found` - Recurso no encontrado

### Validaciones

- Email válido para estudiantes
- Cupo máximo no puede ser menor al número actual de estudiantes
- No se pueden agregar más estudiantes del cupo máximo
- Solo se puede tener un curso en el sistema

## Instalación y Ejecución

### Prerrequisitos

- Node.js 18+
- Docker y Docker Compose
- npm o yarn

### Pasos de Instalación

1. **Instalar dependencias**:
```bash
npm install
```

2. **Configurar variables de entorno**:
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env si es necesario (las configuraciones por defecto funcionan)
```

3. **Iniciar PostgreSQL con Docker**:
```bash
# Desde la raíz del proyecto (un nivel arriba de /backend)
docker-compose up -d
```

4. **Iniciar el servidor en modo desarrollo**:
```bash
npm run start:dev
```

El servidor estará disponible en `http://localhost:3001`

### Comandos Disponibles

```bash
# Desarrollo con hot-reload
npm run start:dev

# Compilar para producción
npm run build

# Ejecutar en producción
npm run start:prod

# Ejecutar tests
npm run test

# Tests end-to-end
npm run test:e2e
```

## Decisiones Técnicas

### 1. TypeORM con PostgreSQL
Se eligió TypeORM por su excelente integración con NestJS y soporte completo para TypeScript. PostgreSQL fue seleccionado por su robustez y características avanzadas.

### 2. Estructura Modular
El código está organizado en:
- `/entities` - Entidades de base de datos
- `/dto` - Data Transfer Objects con validaciones
- `/services` - Lógica de negocio
- `/controllers` - Endpoints HTTP
- `/interceptors` - Interceptores globales (errores)
- `/modules` - Módulos de NestJS

### 3. Caché en Memoria
Para el índice de diversidad, se implementó un caché simple en memoria dentro del servicio. Esto es suficiente para la escala del proyecto (un solo curso). Para producción con múltiples instancias, se recomendaría Redis.

### 4. Synchronize: true
Se usa `synchronize: true` en TypeORM solo para desarrollo, lo que sincroniza automáticamente las entidades con la base de datos. En producción se deberían usar migraciones.

### 5. Validación Global
Se configuró `ValidationPipe` global con:
- `whitelist: true` - Elimina propiedades no definidas en los DTOs
- `forbidNonWhitelisted: true` - Rechaza requests con propiedades extras
- `transform: true` - Transforma payloads al tipo de DTO

### 6. CORS Habilitado
Se habilitó CORS para permitir conexiones desde el frontend React.

## Estructura de la Base de Datos

### Tabla: courses
```sql
id            SERIAL PRIMARY KEY
name          VARCHAR NOT NULL
description   VARCHAR NOT NULL
maxStudents   INTEGER NOT NULL
```

### Tabla: students
```sql
id        SERIAL PRIMARY KEY
name      VARCHAR NOT NULL
email     VARCHAR NOT NULL
courseId  INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE

INDEX idx_students_courseId ON students(courseId)
```

## Testing Manual

Puedes probar los endpoints con curl:

```bash
# Crear curso
curl -X POST http://localhost:3001/course \
  -H "Content-Type: application/json" \
  -d '{"name":"Desarrollo Web","description":"Curso full-stack","maxStudents":10}'

# Agregar estudiante
curl -X POST http://localhost:3001/course/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan Perez","email":"juan@gmail.com"}'

# Obtener curso con índice de diversidad
curl http://localhost:3001/course

# Listar estudiantes
curl http://localhost:3001/course/students

# Actualizar curso
curl -X PATCH http://localhost:3001/course \
  -H "Content-Type: application/json" \
  -d '{"maxStudents":20}'

# Eliminar estudiante
curl -X DELETE http://localhost:3001/course/students/1

# Eliminar curso
curl -X DELETE http://localhost:3001/course
```

## Variables de Entorno

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=gestion_curso
PORT=3001
```

## Autor

Desarrollado como parte de la prueba técnica para Evalúa.

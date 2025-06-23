# Plan de Pruebas - Task Management App

## Alcance de las Pruebas

Este plan de pruebas cubre todas las funcionalidades críticas de la aplicación de gestión de tareas, incluyendo:

- Gestión de tareas (CRUD)
- Categorías de experiencia
- Subida y procesamiento de imágenes
- Visualización de progreso
- Integración con servicios externos (clima)
- Seguridad y validación de datos

## Justificación del Tipo de Prueba

### Pruebas Unitarias
- **Propósito**: Validar componentes individuales
- **Cobertura**: Servicios, controladores, utilidades
- **Herramientas**: Jest, @nestjs/testing

### Pruebas Funcionales
- **Propósito**: Verificar requisitos funcionales
- **Cobertura**: APIs REST, flujos de negocio
- **Herramientas**: Supertest, Jest

### Pruebas de Integración
- **Propósito**: Validar interacción entre componentes
- **Cobertura**: Base de datos, servicios externos
- **Herramientas**: Jest, MongoDB Test Instance

### Pruebas E2E
- **Propósito**: Validar flujos completos de usuario
- **Cobertura**: Interfaz web, APIs
- **Herramientas**: Playwright

### Pruebas de Carga/Estrés
- **Propósito**: Validar rendimiento bajo carga
- **Cobertura**: APIs, base de datos
- **Herramientas**: Artillery

### Pruebas de Seguridad
- **Propósito**: Validar protecciones de seguridad
- **Cobertura**: Validación, autenticación, autorización
- **Herramientas**: Jest, Supertest

## Comandos de Ejecución

\`\`\`bash
# Todas las pruebas
pnpm test:all

# Pruebas unitarias
pnpm test

# Pruebas con cobertura
pnpm test:cov

# Pruebas de integración
pnpm test:integration

# Pruebas E2E
pnpm test:e2e

# Pruebas de humo
pnpm test:smoke

# Pruebas de regresión
pnpm test:regression

# Pruebas de seguridad
pnpm test:security

# Pruebas de carga
pnpm test:load

# Pruebas de estrés
pnpm test:stress

# Playwright E2E
pnpm playwright:test
\`\`\`

## Cobertura de Pruebas

- **Objetivo**: 80% de cobertura mínima
- **Métricas**: Líneas, funciones, ramas, declaraciones
- **Reportes**: HTML, LCOV, texto

## Configuración de Entorno

### Variables de Entorno para Testing
\`\`\`bash
NODE_ENV=test
MONGODB_TEST_URI=mongodb://localhost:27017/test_db
JWT_SECRET=test_secret
UPLOAD_PATH=./test/uploads
\`\`\`

### Base de Datos de Pruebas
- MongoDB separada para testing
- Limpieza automática entre pruebas
- Datos de prueba con Faker.js

## Mantenimiento

- Ejecutar pruebas en cada commit
- Actualizar pruebas con nuevas funcionalidades
- Revisar cobertura mensualmente
- Mantener datos de prueba actualizados

# Frontend -  KYC

Aplicacion web para gestion de solicitudes de verificacion KYC (Know Your Customer) desarrollada con Vue 3, TypeScript y Tailwind CSS.

## Tecnologias Utilizadas

| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| **Vue.js** | 3.2.13 | Framework frontend |
| **TypeScript** | 5.x | Tipado estatico |
| **Tailwind CSS** | 3.x | Framework de estilos |
| **Pinia** | 3.x | Gestion de estado |
| **Vue Router** | 4.x | Enrutamiento SPA |
| **Axios** | 1.x | Cliente HTTP |
| **Vitest** | 4.x | Testing |
| **Vue CLI** | 5.x | Build tool |

## Estructura del Proyecto

```
front-gendra-vue/
├── public/
│   ├── index.html               # HTML principal
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.css         # Estilos globales + Tailwind
│   ├── components/
│   │   ├── StatusBadge.vue      # Badge de estado
│   │   ├── RiskBadge.vue        # Badge de nivel de riesgo
│   │   └── __tests__/
│   │       └── StatusBadge.test.ts
│   ├── router/
│   │   └── index.ts             # Configuracion de rutas
│   ├── services/
│   │   └── api.ts               # Cliente API con Axios
│   ├── stores/
│   │   └── verification.ts      # Store Pinia
│   ├── types/
│   │   └── index.ts             # Tipos TypeScript
│   ├── views/
│   │   ├── VerificationList.vue     # Lista de solicitudes
│   │   ├── VerificationForm.vue     # Formulario de creacion
│   │   └── VerificationDetail.vue   # Detalle de solicitud
│   ├── App.vue                  # Componente raiz
│   ├── main.ts                  # Punto de entrada
│   └── shims-vue.d.ts           # Declaraciones TypeScript
├── .env                         # Variables de entorno
├── .env.example                 # Plantilla de variables
├── tailwind.config.js           # Configuracion Tailwind
├── postcss.config.js            # Configuracion PostCSS
├── tsconfig.json                # Configuracion TypeScript
├── vue.config.js                # Configuracion Vue CLI
└── package.json
```

## Requisitos Previos

- Node.js 18 o superior
- npm o yarn
- Backend corriendo en `http://localhost:3000`

## Instalacion

```bash
# Clonar e instalar dependencias
cd front-gendra-vue
npm install

# Configurar variables de entorno (opcional)
cp .env.example .env
```

## Variables de Entorno

```env
VUE_APP_API_URL=http://localhost:3000/api
```

## Scripts Disponibles

| Comando | Descripcion |
|---------|-------------|
| `npm run serve` | Inicia servidor de desarrollo |
| `npm run build` | Compila para produccion |
| `npm run lint` | Ejecuta linter |
| `npm test` | Ejecuta tests |
| `npm run test:watch` | Ejecuta tests en modo watch |

## Desarrollo

```bash
# Asegurate de que el backend este corriendo primero
# cd ../back-gendra-hono && npm run dev

# Iniciar frontend
npm run serve

# Disponible en http://localhost:8080 (o 8081 si 8080 esta ocupado)
```

## Vistas y Funcionalidades

### 1. Lista de Solicitudes (`/verifications`)

**Ruta:** `/verifications`

**Funcionalidades:**
- Tabla con todas las solicitudes
- Busqueda por nombre o email
- Filtro por estado (Pendiente, Aprobada, Rechazada, Requiere Info)
- Paginacion
- Click en fila para ver detalle

**Columnas mostradas:**
- Nombre
- Email
- Pais
- Estado (con badge de color)
- Nivel de Riesgo (con badge de color)
- Fecha de creacion

### 2. Formulario de Creacion (`/verifications/new`)

**Ruta:** `/verifications/new`

**Campos del formulario:**

| Campo | Tipo | Validacion |
|-------|------|------------|
| Nombre completo | text | Minimo 2 caracteres |
| Email | email | Formato valido |
| Telefono | tel | Minimo 10 digitos |
| Pais | select | Requerido |
| Tipo de documento | select | INE/Pasaporte/Licencia |
| Numero de documento | text | Minimo 5 caracteres |
| URL de imagen | url | Opcional, formato URL (documento o selfie) |

**Validaciones en frontend:**
- Campos requeridos marcados con *
- Email con formato valido
- Telefono con formato numerico
- URLs con formato valido (si se proporcionan)

### 3. Detalle de Solicitud (`/verifications/:id`)

**Ruta:** `/verifications/:id`

**Secciones:**
- **Informacion Personal:** Nombre, email, telefono, pais
- **Informacion del Documento:** Tipo, numero, URLs
- **Fechas:** Creacion y ultima actualizacion
- **Evaluacion de Riesgo:** Score numerico, nivel, factores detectados
- **Cambio de Estado:** Botones para aprobar/rechazar/solicitar info

## Componentes Reutilizables

### StatusBadge

Muestra el estado de una solicitud con colores:

```vue
<StatusBadge status="PENDIENTE" />
<StatusBadge status="APROBADA" size="lg" />
```

| Estado | Color |
|--------|-------|
| PENDIENTE | Amarillo |
| APROBADA | Verde |
| RECHAZADA | Rojo |
| REQUIERE_INFORMACION | Azul |

### RiskBadge

Muestra el nivel de riesgo:

```vue
<RiskBadge level="BAJO" :score="15" />
<RiskBadge level="ALTO" :score="65" size="lg" />
```

| Nivel | Color |
|-------|-------|
| BAJO | Verde |
| MEDIO | Amarillo |
| ALTO | Rojo |

## Store (Pinia)

El store `useVerificationStore` maneja:

### Estado

```typescript
{
  verifications: VerificationRequest[]  // Lista de solicitudes
  currentVerification: VerificationDetail | null  // Detalle actual
  loading: boolean  // Estado de carga
  error: string | null  // Mensaje de error
  pagination: PaginationInfo  // Info de paginacion
  filters: QueryParams  // Filtros actuales
}
```

### Acciones

| Accion | Descripcion |
|--------|-------------|
| `fetchVerifications(params?)` | Carga lista de solicitudes |
| `fetchVerificationById(id)` | Carga detalle de una solicitud |
| `createVerification(data)` | Crea nueva solicitud |
| `updateStatus(id, status)` | Actualiza estado de solicitud |
| `deleteVerification(id)` | Elimina solicitud |
| `setFilters(filters)` | Actualiza filtros |
| `clearFilters()` | Limpia filtros |
| `clearError()` | Limpia mensaje de error |

## Servicio API

El servicio `verificationApi` en `src/services/api.ts` expone:

```typescript
verificationApi.getAll(params)      // GET /verifications
verificationApi.getById(id)         // GET /verifications/:id
verificationApi.create(data)        // POST /verifications
verificationApi.updateStatus(id, status)  // PATCH /verifications/:id/status
verificationApi.delete(id)          // DELETE /verifications/:id
```

## Tests

```bash
# Ejecutar tests
npm test

# Modo watch
npm run test:watch
```

### Tests incluidos

- **StatusBadge.test.ts** (1 test)
  - Renderizado correcto del badge con estado PENDIENTE

## Tipos TypeScript

```typescript
// Tipos principales
type DocumentType = 'INE' | 'PASAPORTE' | 'LICENCIA'
type RequestStatus = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'REQUIERE_INFORMACION'
type RiskLevel = 'BAJO' | 'MEDIO' | 'ALTO'

interface VerificationRequest {
  id: string
  fullName: string
  email: string
  phone: string
  country: string
  documentType: DocumentType
  documentNumber: string
  imageUrl: string | null  // URL de imagen (documento o selfie)
  status: RequestStatus
  riskScore: number
  riskLevel: RiskLevel
  createdAt: string
  updatedAt: string
}

interface RiskAssessment {
  score: number
  level: RiskLevel
  factors: string[]
}
```

## Estilos con Tailwind

### Clases utilitarias personalizadas

Definidas en `src/assets/styles/main.css`:

```css
/* Botones */
.btn              /* Estilos base */
.btn-primary      /* Azul */
.btn-secondary    /* Gris */
.btn-danger       /* Rojo */
.btn-success      /* Verde */

/* Inputs */
.input            /* Estilos base */
.input-error      /* Borde rojo */
.label            /* Etiqueta */

/* Cards */
.card             /* Contenedor con sombra */

/* Badges */
.badge            /* Base */
.badge-pending    /* Amarillo */
.badge-approved   /* Verde */
.badge-rejected   /* Rojo */
.badge-info       /* Azul */
.badge-low        /* Verde (riesgo) */
.badge-medium     /* Amarillo (riesgo) */
.badge-high       /* Rojo (riesgo) */
```

### Colores personalizados

```javascript
// tailwind.config.js
colors: {
  primary: {
    50: '#eff6ff',
    // ... hasta 900
    600: '#2563eb',  // Color principal
  }
}
```

## Rutas

| Ruta | Componente | Descripcion |
|------|------------|-------------|
| `/` | - | Redirige a `/verifications` |
| `/verifications` | VerificationList | Lista de solicitudes |
| `/verifications/new` | VerificationForm | Crear solicitud |
| `/verifications/:id` | VerificationDetail | Ver/editar solicitud |

## Build de Produccion

```bash
# Generar build
npm run build

# Los archivos estaran en /dist
```

### Archivos generados

```
dist/
├── css/
│   └── main.[hash].css    # Estilos minificados
├── js/
│   ├── chunk-vendors.[hash].js  # Dependencias
│   ├── main.[hash].js           # App principal
│   └── [numero].[hash].js       # Chunks por ruta
├── favicon.ico
└── index.html
```

## Proxy de Desarrollo

Configurado en `vue.config.js`:

```javascript
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

## Docker

```dockerfile
# Construir imagen
docker build -t gendra-frontend .

# Ejecutar (expone en puerto 80)
docker run -p 8080:80 gendra-frontend
```

La imagen usa Nginx para servir los archivos estaticos.

## Troubleshooting

### Error de CORS

Si ves errores de CORS, asegurate de que:
1. El backend este corriendo
2. El backend tenga configurado CORS para tu puerto de frontend

### Error "Network Error"

1. Verifica que el backend este en `http://localhost:3000`
2. Verifica que la base de datos este activa
3. Revisa la consola del backend para errores

### Build falla

1. Borra `node_modules` y reinstala: `rm -rf node_modules && npm install`
2. Borra cache: `rm -rf node_modules/.cache`


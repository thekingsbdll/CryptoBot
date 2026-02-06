# ClickWay SalesOS

MVP multi-tenant para gestión de leads, pipeline, propuesta comercial y PPTX para ClickWay Marketing.

## Requisitos
- Node.js 20+
- Docker (opcional para Postgres)

## Instalación rápida
```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

## Demo HTML rápida
Si quieres abrir una versión estática sin instalar nada, abre `index.html` con doble clic o en el navegador.

## Variables de entorno
Crea un `.env` con lo siguiente:
```
DATABASE_URL="postgresql://clickway:clickway@localhost:5432/clickway_salesos"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret"
DEFAULT_TENANT_KEY="clickway"
```

## Base de datos con Docker
```bash
docker compose up -d
```

## Scripts
- `npm run dev` - arranca la app en local.
- `npm run prisma:migrate` - crea las migraciones.
- `npm run prisma:seed` - carga datos demo (1 tenant, 3 leads, 1 formulario).
- `npm run test` - smoke tests.

## Credenciales demo
- Usuario: `owner@clickway.local`
- Password: `password123`

## Webhook de entrada de leads
**Endpoint**: `POST /api/webhooks/leads`

**Headers**
```
X-Webhook-Secret: <secret>
```

**Payload ejemplo**
```json
{
  "tenantKey": "mcmcars",
  "source": "meta_lead_ads",
  "createdAt": "2026-02-06T12:00:00+01:00",
  "lead": {
    "fullName": "Benito Cabrera",
    "phone": "+34XXXXXXXXX",
    "email": "benitocabrerag@gmail.com",
    "company": "MCM Cars",
    "city": "Sabadell",
    "monthlyRevenueRange": "150k+",
    "problem": "Invierto en portales/publicidad pero baja calidad",
    "budgetRange": "1000-3000",
    "notes": "Lead frío"
  }
}
```

**Respuesta esperada**
```json
{
  "ok": true,
  "leadId": "uuid"
}
```

## Conectar automatizaciones
1. Configura un `tenantKey` único para cada cliente.
2. Guarda el `webhookSecret` del tenant y envíalo en `X-Webhook-Secret`.
3. Envía el payload con los campos disponibles. Los campos faltantes quedan como `null` y se muestran como “Pendiente” en la UI.

## PPTX
- Endpoint: `GET /api/leads/:id/pptx` (requiere sesión activa).
- Genera 10 slides estándar con placeholders rellenados y pendientes marcados.

## Tests (smoke)
Los tests verifican generadores de call prep, propuesta, formulario y PPTX.

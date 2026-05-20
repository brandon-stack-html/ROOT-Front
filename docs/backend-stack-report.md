# Reporte de stack tecnológico — Backend Inventario POS

> **Estado:** Propuesta para discusión y aprobación.
> **Audiencia:** Brandon (decisor), futuros devs backend, stakeholders técnicos.
> **Repositorios:** este `front-demo` ya existe; el back vivirá en un repo nuevo `inventario-backend` (o nombre equivalente).
> **Hosting target confirmado:** AWS.
> **Filosofía:** spec-driven development, multi-tenant desde día 1, offline-first donde aplique, integraciones colombianas (DIAN + pasarelas) como ciudadanos de primera clase.

---

## 1. Contexto

Estamos construyendo el backend de **Inventario POS**, un SaaS multi-tenant para restaurantes en Colombia. El front (este repo) replica visualmente todas las pantallas y ya define el dominio funcional. El back debe servir 5 superficies distintas que ya están maquetadas:

| Superficie | Ruta del front | Naturaleza | Conectividad |
|---|---|---|---|
| **Backoffice** | `/backoffice/*` | Web admin, ~20 pantallas | Online |
| **POS de caja** | `/pos/*` | Tablet/desktop, alto volumen | **Offline-first crítico** |
| **App Mesero** | `/mesero/*` | Móvil, alto volumen, multi-usuario por restaurante | **Offline-first crítico** |
| **KDS (cocina)** | `/kds/*` | Pantalla TV/tablet en cocina | Online + **real-time** |
| **Storefront / QR** | `/storefront/*` | Cliente final, pedidos web | Online |
| **Auth** | `/auth/*` | Compartido | Online |

A esto se suman:
- **Facturación electrónica DIAN** (vi `backoffice/facturacion-dian.html`).
- **Pasarelas de pago colombianas** (Wompi, Bold, PayU, MercadoPago — pago en mesa, QR, online).
- **Multi-tenant + multi-sucursal** desde el primer cliente.

---

## 2. Requerimientos no funcionales (RNF)

| RNF | Meta inicial | Meta a 12 meses |
|---|---|---|
| **Disponibilidad** | 99.5% (≈3h down/mes) | 99.9% (≈43min/mes) |
| **Latencia API p95** | < 400ms (Bogotá) | < 200ms |
| **RTO** (recovery time) | < 1h | < 15min |
| **RPO** (recovery point) | < 15min | < 1min (PITR continuo) |
| **Escalabilidad** | 50 tenants × 5 sucursales × 20 usuarios concurrentes | 1.000 tenants × 10 sucursales |
| **Throughput pico** | 20 comandas/s por tenant en hora pico | Mantener con autoscaling |
| **Aislamiento entre tenants** | Lógico (RLS) | Lógico + opción de DB dedicada para enterprise |
| **Auditabilidad** | Log inmutable de pedidos y pagos por requisito DIAN | Idem + replay de cualquier pedido |
| **Cumplimiento** | DIAN (facturación electrónica), Habeas Data (Ley 1581/2012) | + PCI-DSS SAQ-A (delegamos PCI a la pasarela) |

> **Por qué importa:** un restaurante en hora pico no perdona caídas. La diferencia entre "POS solido" y "POS que se cae" define si renuevan o no la suscripción.

---

## 3. Comparación de stacks de backend

Evaluación de las 3 opciones realistas para este caso de uso. Score 1-5.

| Criterio | Node 22 + TypeScript (NestJS) | Python 3.12 + FastAPI | Go 1.22 (Echo/Chi) |
|---|---|---|---|
| Mismo lenguaje que front (vanilla JS hoy) | **5** — TS comparte ergonomía | 2 | 1 |
| Ecosistema integraciones COL (DIAN, Wompi, Bold) | 4 — SDKs JS oficiales | **5** — Wrappers maduros DIAN en Py | 3 — gRPC sí, REST manual |
| Real-time WebSockets en AWS Lambda | **5** — `ws`, `socket.io`, API GW WS first-class | 3 — `websockets` ok pero menos común en Lambda | 4 — gorilla/websocket maduro |
| DDD / Hexagonal idiomático | **5** — NestJS modules | 4 — manual con dependency-injector | 3 — interfaces sí, pero menos azúcar |
| Tipado fuerte y spec-driven | **5** — TS + zod + OpenAPI | **5** — Pydantic + FastAPI auto-OpenAPI | 4 — structs + protobuf |
| Costo de runtime (Lambda/Fargate) | 3 — ~150MB cold start mitigable | 3 — similar | **5** — binarios <20MB, frio <100ms |
| Curva de aprendizaje del equipo | **5** — JS ya conocido | 4 — Python ya común en LATAM | 2 — niche, contratación más cara |
| Madurez de migrations/ORM | 4 — Prisma, Drizzle | 4 — SQLAlchemy, Tortoise | 3 — sqlc, ent (ok pero menos azúcar) |
| **Total ponderado** | **36** | 30 | 25 |

### Recomendación: **Node.js 22 LTS + TypeScript + NestJS**

**Razones principales:**

1. **Continuidad lingüística.** El front es JS vanilla; los devs full-stack del proyecto pueden compartir tipos (vía paquete `@inventario/contracts`) sin context-switch mental.
2. **NestJS encaja con DDD/Hexagonal naturalmente.** Sus *modules* mapean 1:1 a *bounded contexts*; los providers se inyectan vía DI; los pipes/interceptors implementan cross-cutting concerns sin ensuciar el dominio.
3. **Real-time es first-class.** API Gateway WebSockets + Lambda (o ECS) corre WebSockets/Socket.IO sin fricción. Crítico para el KDS.
4. **OpenAPI auto-generado** desde decoradores Nest + `nestjs-zod` para validación. Esto *es* spec-driven por defecto.
5. **Mercado laboral COL.** Encontrar Node devs en Bogotá/Medellín es más barato y rápido que Go. Python es comparable, pero suma menos valor al compartir con el front.

**Cuándo reconsiderar Python:** si el primer cliente exige integración DIAN con un proveedor cuyo único SDK oficial sea Python (verificar). En ese caso, encapsular esa integración en un microservicio Python detrás de la API Node.

**Cuándo reconsiderar Go:** cuando el módulo de KDS real-time supere los 10k clientes simultáneos y los costos de Lambda Node empiecen a doler. Reescribir *solo* ese servicio (estilo strangler).

---

## 4. Stack tecnológico recomendado

Cada elección lleva el **porqué** y un **plan B** explícito.

### 4.1 Capa de aplicación

| Capa | Elección | Por qué | Plan B |
|---|---|---|---|
| Lenguaje | **TypeScript 5.5+ (`strict: true`)** | Tipos en compile-time + runtime con zod = menos bugs en producción | — |
| Runtime | **Node.js 22 LTS** | Soporte LTS hasta 2027, native fetch, perf mejorada | Bun cuando madure su lado de AWS |
| Framework | **NestJS 10** | DI, módulos, decoradores OpenAPI, batería puesta | Fastify directo si NestJS pesa demasiado |
| Validación | **Zod 3 + nestjs-zod** | Mismo schema valida runtime + genera tipos + alimenta OpenAPI | class-validator (más viejo) |
| ORM | **Drizzle ORM** | Cercano a SQL, sin runtime mágico, excelente con RLS de Postgres | Prisma (mejor DX, peor con RLS multi-tenant) |
| Migrations | **Drizzle Kit** + revisión manual de SQL | Control total | — |
| Documentación API | **OpenAPI 3.1** generado + curado a mano | Single source of truth | — |
| Cliente HTTP interno | **undici** | Más rápido que axios en Node 22 | — |

### 4.2 Persistencia y datos

| Servicio | Elección | Por qué |
|---|---|---|
| **DB primaria** | **PostgreSQL 16 en Aurora Serverless v2** | RLS nativo (multi-tenant), JSONB, full-text search aceptable, tipos enums, escala 0.5-128 ACUs según carga |
| **Cache + sesiones + locks distribuidos** | **Redis 7 en ElastiCache Serverless** | TTLs por key, pub/sub para fanout WebSockets, escalado automático |
| **Object storage** | **S3** | Fotos de productos, PDFs de facturas, exports, backups DIAN |
| **Search** (cuando el catálogo crezca) | **Postgres FTS (inicio) → OpenSearch Serverless (fase 2)** | No prematuro |
| **Time-series** (métricas de venta) | **TimescaleDB extension en RDS** | Reportes históricos sin DB separada |
| **Backups** | PITR Aurora + snapshot diario a S3 cross-region | RPO 5 segundos |

### 4.3 Mensajería y eventos

| Servicio | Elección | Caso de uso |
|---|---|---|
| **Cola de trabajos** | **SQS estándar + SQS FIFO** | Workers async (envío DIAN, conciliación pagos) |
| **Event bus** | **EventBridge** | Eventos de dominio (`OrderPlaced`, `PaymentSettled`, `InvoiceIssued`) entre bounded contexts |
| **Pub/sub real-time** | **Redis Pub/Sub** + API GW WebSockets | KDS recibe nuevas comandas en <500ms |
| **Outbox / cambios de schema** | Patrón Outbox custom + worker poller | Garantiza entrega de eventos críticos sin perder consistencia con la transacción de DB |
| **Notificaciones cliente** | **SNS** (push) + **SES** (email) + **Twilio** (SMS COL) | Confirmaciones, alertas DIAN |

### 4.4 Real-time (KDS y mesa)

```
[Mesero envía pedido] → API REST → DB transaccional
                                    ↓ (transactional outbox)
                              EventBridge OrderPlaced
                                    ↓
                         Redis pub/sub canal `tenant:{id}:kds`
                                    ↓
                           API GW WebSocket fanout
                                    ↓
                         [KDS, Mesa cliente, Backoffice]
```

**Decisión:** API Gateway WebSocket API + Lambda + DynamoDB (connection store). Es serverless, escala a cero, paga por mensaje. Alternativa managed: **Ably** o **Pusher** si queremos delegar el problema entero (≈USD 100/mes para arrancar).

### 4.5 Autenticación y autorización

| Concern | Solución |
|---|---|
| **Identidad de usuarios humanos** | AWS Cognito (User Pools por tenant *o* shared con custom attribute `tenantId`) |
| **Login mesero** | PIN de 4-6 dígitos + magic link al admin del tenant |
| **Login backoffice** | Email + password + 2FA opcional (TOTP) |
| **Login storefront** | Email/teléfono passwordless (OTP por SMS/email) |
| **RBAC** | CASL (TS) — definir abilities por rol (`admin`, `cajero`, `mesero`, `cocinero`) |
| **API keys (integraciones)** | Tabla propia con scopes + hash (Argon2id) |
| **Service-to-service** | IAM roles entre Lambdas / mTLS si vamos a Fargate |

> El front actual (`auth/`) usa pantallas de login estándar — eso encaja directo con Cognito + NestJS Guard.

### 4.6 Integraciones colombianas

#### 4.6.1 DIAN (facturación electrónica)

**Decisión:** **NO ser proveedor tecnológico propio.** Delegar a un PT autorizado por DIAN.

Comparación de PTs:

| Proveedor | Pros | Contras | Recomendación |
|---|---|---|---|
| **The Factory HKA** | API REST limpia, sandbox decente, multi-país LATAM | Soporte a veces lento | **Primera opción** |
| **Facture** | Buena doc, equipo COL responsivo | Algo más caro | Segunda opción |
| **Carvajal T&S** | Empresa grande, confiable | API SOAP/legacy, doc pobre | Solo si el cliente lo exige |
| **Alegra / Siigo** | All-in-one contable + factura | Vendor lock-in fuerte | Evitar a menos que sea su nicho |

Encapsular detrás de una interfaz `IInvoicingProvider` (puerto hexagonal) — cambiar de proveedor debe ser cambiar un adapter, no el dominio.

**Cumplimiento:** guardar XML+PDF firmados en S3 con object-lock por mínimo 5 años (requisito DIAN).

#### 4.6.2 Pasarelas de pago

| Pasarela | Cubre | Notas |
|---|---|---|
| **Wompi** | Tarjetas, PSE, Nequi, Bancolombia QR | Mejor DX. **Default storefront.** |
| **Bold** | Datáfono físico + link de pago + QR | Ideal para POS físico en mesa |
| **PayU LATAM** | Tarjetas, efectivo Baloto/Efecty | Backup; doc enredada |
| **MercadoPago** | Cobertura LATAM amplia | Si crecen fuera COL |

Encapsular cada una detrás de `IPaymentGateway` (mismo patrón). Soportar webhooks idempotentes (las pasarelas reintentan).

### 4.7 Observabilidad

| Concern | Herramienta |
|---|---|
| **Tracing** | OpenTelemetry SDK Node → AWS X-Ray (gratis hasta 100k traces/mes) o Grafana Tempo |
| **Métricas** | OpenTelemetry → CloudWatch Metrics + Grafana Cloud Free tier |
| **Logs** | Pino (structured JSON) → CloudWatch Logs → Loki (query) |
| **APM / errores** | Sentry (free tier 5k errors/mes) |
| **Uptime externo** | BetterStack o UptimeRobot |
| **Dashboard de negocio** | Metabase autohosteado en Fargate sobre read-replica |

**Regla de oro:** cada request lleva `traceId` + `tenantId` + `userId` propagados por todos los logs. Sin esto, debuggear multi-tenant es infierno.

### 4.8 Infraestructura (AWS)

| Servicio | Uso |
|---|---|
| **API compute** | **ECS Fargate** detrás de ALB (HTTP/2). Alternativa: Lambda + API GW para servicios "thin" |
| **Workers** | Lambda con triggers SQS/EventBridge |
| **DB** | Aurora PostgreSQL Serverless v2, multi-AZ |
| **Cache** | ElastiCache Serverless Redis |
| **CDN / WAF** | CloudFront + AWS WAF (regla managed OWASP) |
| **DNS** | Route 53 |
| **Secrets** | AWS Secrets Manager (rotación automática) |
| **IaC** | **AWS CDK con TypeScript** (mismo lenguaje que la app, type-checking de la infra) |
| **Container registry** | ECR |
| **Network** | VPC con subnets pública/privada, NAT Gateway, VPC Endpoints para S3/SQS (sin egreso a internet) |

**Por qué Fargate y no Lambda en API:** El API tendrá WebSockets persistentes, conexiones a Redis y pool a Postgres — Lambda obligaría a cold starts y reconexión por request. Fargate con autoscaling por CPU/RPS escala bien hasta cientos de tenants. Lambda queda para workers stateless.

### 4.9 CI/CD y calidad

| Etapa | Herramienta |
|---|---|
| **VCS** | GitHub (mismo proveedor que el front) |
| **CI** | GitHub Actions |
| **Lint** | ESLint + Prettier + commitlint (Conventional Commits) |
| **Tests unitarios** | Vitest |
| **Tests integración** | Vitest + Testcontainers (Postgres real, no mocks) |
| **Tests contrato** | Pact (back ↔ front) |
| **Tests E2E** | Playwright contra entorno preview por PR |
| **Tests carga** | k6, ejecutado pre-release |
| **Security scan** | `npm audit` + Snyk + AWS Inspector en imágenes ECR |
| **CD** | GitHub Actions → CDK deploy a `dev` (auto), `staging` (auto en main), `prod` (aprobación manual) |
| **Migrations** | Job de pre-deploy que corre `drizzle-kit migrate`; rollback documentado por migration |

---

## 5. Patrones de diseño backend

Aplicados *con criterio* — no por moda. Cada patrón resuelve un problema concreto del negocio.

### 5.1 Hexagonal / Ports & Adapters
- **Por qué:** el dominio (Pedido, Mesa, Inventario) NO debe saber que existe Postgres ni Wompi.
- **Cómo en NestJS:** módulos por bounded context. Cada módulo expone interfaces (`IOrderRepository`, `IPaymentGateway`); los adapters (`PostgresOrderRepository`, `WompiAdapter`) viven en `infrastructure/`.

### 5.2 Domain-Driven Design (light)
- **Bounded contexts iniciales:** `Tenancy`, `Catalog`, `Inventory`, `Ordering`, `Payments`, `Invoicing`, `KDS`, `Reporting`, `Identity`.
- **Aggregates clave:** `Order` (root), `Table`, `Product`, `Tenant`, `Invoice`. Reglas de invariantes dentro del aggregate, NO en services.
- Evitar over-engineering: no aplicar DDD táctico completo en módulos CRUD-puros (ej. `Categorías`).

### 5.3 CQRS (selectivo)
- **Comandos** (write): pasan por aggregates y validación estricta.
- **Queries** (read): pueden saltar el dominio y leer vistas materializadas o read-replicas.
- **Dónde aplica:** `Reporting` (dashboards, reportes Z), donde lecturas son orden de magnitud más complejas que escrituras. NO aplicar en CRUD simple.

### 5.4 Event Sourcing (parcial)
- **Solo en `Ordering`:** cada evento de un pedido (`Created`, `ItemAdded`, `Sent`, `Ready`, `Delivered`, `Paid`, `Voided`) se persiste inmutable.
- **Por qué:** auditoría legal (reclamo del cliente, requisito DIAN), replay para debugging, base para analytics.
- **Storage:** tabla `order_events` particionada por tenant + snapshots cada 50 eventos.

### 5.5 Outbox Pattern
- Cualquier escritura que dispara evento externo (DIAN, pasarela, KDS) se commitea junto a un registro en tabla `outbox`.
- Worker poller lee `outbox` y publica al bus. Garantiza *at-least-once delivery* sin distributed transactions.

### 5.6 Saga (orquestación de cobro)

```
1. PaymentInitiated      → reservar mesa
2. PaymentAuthorized     → marcar order paid
3. InvoiceRequested      → llamar PT DIAN
4. InvoiceIssued         → enviar PDF a cliente
5. TableReleased         → liberar mesa
```
Si paso 3 falla → compensación: refund pasarela + alerta a admin.

Implementar con **NestJS Saga** o estado-máquina explícita (XState).

### 5.7 Idempotency Keys (CRÍTICO para offline)
- Cada request mutante (POST/PUT) acepta header `Idempotency-Key`.
- Guardamos `(tenantId, key) → response` con TTL 24h en Redis.
- Mismo key = misma respuesta. Sin esto, las re-sincronizaciones del POS offline crean comandas duplicadas.

### 5.8 Circuit Breaker + Retry con backoff
- Librería: **cockatiel** (TS).
- Aplicar a TODA llamada externa (DIAN, pasarelas, SMS).
- Caer a estado degradado documentado (ej. "factura quedará pendiente").

### 5.9 Soft delete + Audit log
- Nunca DELETE físico en tablas con valor legal (orders, invoices, payments).
- Tabla `audit_log` con `who, what, when, before, after, ip, user_agent`.

### 5.10 Feature Flags
- **Flipt** (OSS, autohosteado) o **GrowthBook**.
- Permite rollout por tenant — probar features con clientes piloto antes de generalizar.

---

## 6. Multi-tenancy

### 6.1 Estrategias evaluadas

| Estrategia | Aislamiento | Costo | Operación | Recomendación |
|---|---|---|---|---|
| **DB compartida + schema compartido + `tenant_id`** | Lógico | $ | Simple, una migración para todos | **DEFAULT** |
| DB compartida + schema-per-tenant | Medio | $$ | Migrations N veces | Solo si un cliente lo exige |
| DB-per-tenant | Físico | $$$ | Complejo, costoso | Solo enterprise (>$5k/mes) |

### 6.2 Implementación recomendada

**Row-Level Security (RLS) de PostgreSQL** + middleware NestJS.

```sql
-- En cada tabla con datos de tenant:
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON orders
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

```typescript
// Middleware NestJS:
@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  async use(req, res, next) {
    const tenantId = extractFromJwt(req);
    await this.db.execute(sql`SET app.tenant_id = ${tenantId}`);
    next();
  }
}
```

**Beneficios:**
- Si un dev olvida un `WHERE tenant_id = ?`, la DB lo bloquea.
- Auditorías de seguridad pasan más fácil.
- Multi-sucursal: agregar `branch_id` a las mismas tablas, RLS aditiva.

### 6.3 Particionado físico (cuando crezca)
- Particionar tablas grandes (`orders`, `order_events`, `audit_log`) por `tenant_id` + rango de fecha.
- Permite mover tenants pesados a tablespace separado sin migrar datos.

---

## 7. Arquitectura offline-first (POS / Mesero)

El cliente seguirá funcionando sin internet y sincronizará al reconectar.

### 7.1 Cliente
- **Storage local:** IndexedDB vía **Dexie.js** (más liviano que PouchDB para este caso).
- **Service Worker:** cachea assets + responde queries de catálogo desde caché.
- **Cola local de mutaciones:** cada acción (crear pedido, agregar item, cobrar) se guarda con un `clientOpId` (UUID v7) y `idempotencyKey`.

### 7.2 Sincronización
- **Endpoint** `POST /v1/sync` recibe lote de mutaciones con `lastServerVersion` + idempotency keys.
- **Conflictos:**
  - Pedidos: append-only (cada mutación es un evento), sin conflictos.
  - Stock: server-authoritative — si el cliente offline "vendió" más de lo que había, se rechaza con `OutOfStockError` y el cliente muestra el reverso al mesero.
  - Mesa abierta: lock por mesa con TTL — si dos meseros abren la misma mesa offline, gana el primer commit.
- **Reloj lógico:** Lamport timestamps por tenant para ordenar eventos.

### 7.3 Tecnologías evaluadas
| Opción | Veredicto |
|---|---|
| **Custom sync sobre Postgres + IndexedDB** | **Elegida.** Control total, sin lock-in. |
| ElectricSQL | Atractivo pero joven; reevaluar 2026 Q4. |
| PouchDB + CouchDB | Maduro pero suma una DB nueva. |
| Realm Sync (MongoDB Atlas) | Costoso y vendor lock-in. |

---

## 8. Spec-Driven Development

Este es el método de trabajo, no solo herramienta.

### 8.1 Flujo

```
Issue de negocio
   ↓
ADR (Architecture Decision Record) si toca arquitectura
   ↓
OpenAPI 3.1 / AsyncAPI 3.0 spec en /specs/
   ↓
Mock server (Prism) para que el front empiece a integrar
   ↓
Tests de contrato (Pact) en CI
   ↓
Implementación back que cumple el spec
   ↓
PR review valida que diff de spec = diff de código
```

### 8.2 Estructura de specs

```
inventario-backend/
└── specs/
    ├── openapi/
    │   ├── 00-root.yaml
    │   ├── tenancy.yaml
    │   ├── ordering.yaml
    │   ├── payments.yaml
    │   └── ...
    ├── asyncapi/
    │   ├── kds-events.yaml          # OrderPlaced, OrderReady, ...
    │   └── domain-events.yaml
    ├── adrs/
    │   ├── 0001-elegir-nestjs.md
    │   ├── 0002-multi-tenant-rls.md
    │   └── ...
    └── examples/
        └── *.json                    # request/response samples
```

### 8.3 Herramientas

| Tarea | Herramienta |
|---|---|
| Editar specs | Stoplight Studio (UI) o VSCode + Spectral |
| Lint specs | **Spectral** con reglas custom (auth obligatoria, errores estandarizados, paginación uniforme) |
| Mock server | **Prism** (`prism mock specs/openapi/00-root.yaml`) |
| Generar tipos TS para front + back | **openapi-typescript** → publicado a `@inventario/contracts` (npm privado en GitHub Packages) |
| Generar SDK clients | **openapi-fetch** o **orval** |
| Validar request/response runtime | nestjs-zod + Spectral en CI |
| ADRs | Convención `ADR-XXXX-titulo.md` + log4brains para visualizar |

### 8.4 Disciplina del equipo
- **Spec-first siempre.** Cambio de API = PR al spec primero, aprobado por front y back.
- **Versionado semántico** del spec. Breaking changes → `/v2/`.
- **Compatibilidad hacia atrás 6 meses mínimo** para clientes POS desplegados.

---

## 9. Estructura del repo backend (propuesta)

Monorepo con **Nx** o **Turborepo** dentro del repo backend (NO confundir con monorepo entre front y back — esos siguen separados).

```
inventario-backend/
├── apps/
│   ├── api/                    # Servidor NestJS principal (REST + WS)
│   ├── workers/                # Workers SQS (DIAN, pagos, sync)
│   ├── jobs/                   # Cron jobs (reportes Z diarios)
│   └── admin-cli/              # CLI interna (provisioning tenants, etc.)
├── packages/
│   ├── domain/                 # Entidades + value objects + reglas — SIN infra
│   ├── application/            # Use cases / command handlers / saga orchestrators
│   ├── infrastructure/         # Adapters: Postgres, Redis, S3, SQS, integrations
│   ├── contracts/              # OpenAPI generated types — publicado a npm
│   ├── shared-kernel/          # Errors, Result type, Logger, IdGen
│   └── testing/                # Test utils, fixtures, builders
├── infra/                      # AWS CDK
│   ├── stacks/
│   ├── constructs/
│   └── bin/
├── specs/                      # Ver sección 8.2
├── docs/
│   ├── adrs/
│   ├── runbooks/               # Qué hacer cuando X se cae
│   └── onboarding.md
├── .github/workflows/
├── package.json
├── nx.json
└── tsconfig.base.json
```

---

## 10. Roadmap por fases

### Fase 0 — Fundación (semanas 1-3)
- Repo creado, CDK base (VPC, ECR, secrets), CI/CD pipeline.
- NestJS skeleton con `Tenancy`, `Identity`, healthcheck.
- Aurora Serverless v2 + RLS funcionando.
- Spec inicial OpenAPI con auth + tenants.

### Fase 1 — Core operativo (semanas 4-9)
- Catálogo, Mesas, Comandas (sin offline aún).
- Real-time KDS via WebSocket.
- Auth completa (Cognito + roles).
- Front se conecta — adiós mocks.

### Fase 2 — Cobro y facturación (semanas 10-14)
- Saga de cobro completa.
- Integración Wompi (sandbox → prod).
- Integración The Factory HKA DIAN (sandbox → prod).
- Reportes Z básicos.

### Fase 3 — Offline (semanas 15-19)
- Sync engine.
- Service Worker + IndexedDB en POS y Mesero.
- Reconciliación de stock.
- Tests de caos (matar wifi, repetir requests, etc.).

### Fase 4 — Escala (semanas 20+)
- Bold + PayU + MercadoPago.
- Storefront QR público.
- Multi-sucursal completo.
- Particionado de tablas grandes.
- Read-replicas + CQRS en Reporting.

---

## 11. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Integración DIAN se complica (cambios DIAN, certificación lenta del PT) | Alta | Alto | Empezar integración en Fase 0 con sandbox; modo "factura pendiente" como degradación graceful |
| Costo AWS se dispara con pocos clientes | Media | Medio | Aurora Serverless escala a 0.5 ACU; ElastiCache serverless paga por uso; WebSocket API GW = pay-per-message |
| Conflictos de sync offline son confusos para el mesero | Alta | Alto | UX de reconciliación clara; tests de caos; logs detallados con `clientOpId` |
| Pérdida de datos por bug multi-tenant | Baja | **Crítico** | RLS en DB; tests E2E que prueban aislamiento explícitamente; PITR de Aurora |
| Vendor lock-in con proveedor DIAN | Media | Medio | Patrón Adapter; nunca usar SDK del PT en código de dominio |
| Rotación del único dev backend | Media | Alto | Specs + ADRs + runbooks documentados; pair programming desde Fase 1 |
| Latencia LATAM a us-east-1 | Media | Medio | Desplegar en `us-east-1` (cercano a COL) o `us-east-2`; CloudFront edge en Bogotá; medir p95 con RUM |

---

## 12. Estimación de costos AWS (orden de magnitud)

Para el escenario "MVP con 5 tenants × 3 sucursales × 10 usuarios concurrentes":

| Servicio | Costo mensual estimado USD |
|---|---|
| Aurora Serverless v2 (0.5-2 ACUs) | 60-180 |
| ElastiCache Serverless Redis | 30-80 |
| ECS Fargate (2 tasks, 0.5 vCPU) | 30-60 |
| Lambda + API GW (workers + WS) | 10-40 |
| S3 + CloudFront | 5-20 |
| Logs + Metrics + Traces | 20-50 |
| Cognito | Gratis hasta 50k MAU |
| DIAN (PT externo) | 30-100 (depende del volumen de facturas) |
| **Total** | **~$200-500 USD/mes** |

A escala de 100 tenants × 5 sucursales: estimado **$2k-4k USD/mes**, sostenible si el ARPU es $50-200 USD/mes.

---

## 13. Decisiones que aún quedan abiertas

1. **Nombre del repo backend** y namespace npm (`@inventario/*` vs `@nombredemarca/*`).
2. **Cuenta AWS:** ¿una cuenta única con OUs (org), o cuentas separadas dev/staging/prod desde día 1? (Recomendado: separadas via AWS Organizations.)
3. **Proveedor DIAN definitivo:** decidir entre The Factory HKA y Facture luego de demo técnico de ambos.
4. **Hosting de Prism mock server** durante desarrollo: ¿lo levantamos en Fargate o un Lambda público?
5. **Política de retención** de eventos en Event Sourcing: ¿5 años (igual que DIAN) o más?
6. **Estrategia de monitoreo** pago vs gratis: empezar con free tiers, evaluar Datadog/NewRelic en Fase 4.

---

## 14. Próximos pasos sugeridos

1. **Validar este reporte** con stakeholders y dejar feedback como comentarios en este `.md`.
2. **Aprobar stack base** (Node + NestJS + Postgres + AWS) o pivotar.
3. Crear el repo `inventario-backend` con scaffold de Fase 0.
4. Escribir el primer ADR: `ADR-0001 — Stack y arquitectura base` (este documento es la materia prima).
5. Levantar reunión técnica con candidatos a PT de DIAN.
6. Definir el SLA al cliente (uptime garantizado, tiempo de respuesta de soporte).

---

*Este documento es vivo. Cuando una decisión se cierre, mover el resumen a un ADR fechado y dejar acá solo el link.*

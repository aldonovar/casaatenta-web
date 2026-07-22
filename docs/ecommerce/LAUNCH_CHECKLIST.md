# Checklist de salida — tienda.casa-atenta.com

Mantener `STORE_MODE=preview` hasta que todos los puntos críticos estén cerrados.

## 1. Empresa y condiciones comerciales

- [ ] Razón social, RUC, domicilio, teléfonos y correo de soporte aprobados.
- [ ] Términos de compra, privacidad, entregas, cambios y garantía revisados por
  asesor legal peruano.
- [ ] Libro de Reclamaciones permanentemente visible y operativo. Indecopi exige
  un canal accesible para comercio electrónico y atención escrita en el plazo
  aplicable: [orientación oficial](https://www.gob.pe/institucion/indecopi/noticias/1286430-comercios-electronicos-tambien-estan-obligados-a-contar-con-libro-de-reclamaciones-activo-y-visible).
- [ ] Canal de reclamos, devoluciones y consultas sin cargas innecesarias,
  considerando el Decreto Legislativo 1729 y su reglamentación vigente:
  [comunicado de Indecopi](https://www.gob.pe/institucion/indecopi/noticias/1352010-por-primera-vez-el-codigo-de-proteccion-del-consumidor-introduce-cambios-para-garantizar-un-comercio-electronico-sin-practicas-abusivas).
- [ ] Banco de datos de clientes/reclamantes inscrito y flujos internacionales
  declarados cuando corresponda: [trámite ANPD](https://www.gob.pe/8060-inscribir-informacion-en-el-registro-nacional-de-proteccion-de-datos-personales).
- [ ] Integración de boleta/factura electrónica y consulta de comprobantes. La
  [SUNAT](https://cpe.sunat.gob.pe/tipos_de_comprobantes/boleta) exige acceso del
  cliente a los comprobantes por el periodo aplicable.

## 2. Catálogo e inventario

- [ ] PDF completo, lista de precios y orden de compra vigentes.
- [ ] Cada SKU con `commercial_status=approved`, precio PEN en centavos, IGV,
  stock, peso, dimensiones y clase de envío.
- [ ] Modelo/sufijo y contenido del kit verificados por lote.
- [ ] Garantía y red de servicio publicadas sin extrapolar condiciones de terceros.
- [ ] Fotografías, manuales y marcas con autorización de uso.
- [ ] Conteo físico y prueba de reserva concurrente sin sobreventa.

## 3. Supabase y cuentas

- [ ] Proyecto productivo único de Casa Atenta identificado y separado de
  VANIA, ALLYX y cuentas personales.
- [ ] Ejecutar migraciones en staging y luego producción; conservar respaldo.
- [ ] Configurar Site URL y allow-list exacta de callbacks.
- [ ] Configurar Google OAuth. Google debe usar el callback de Supabase
  (`https://<project-ref>.supabase.co/auth/v1/callback`); la app usa
  `https://tienda.casa-atenta.com/auth/callback` como redirect permitido:
  [guía oficial](https://supabase.com/docs/guides/auth/social-login/auth-google).
- [ ] SMTP transaccional, confirmación de correo y recuperación probados.
- [ ] Dominio y remitente de Resend verificados; `RESEND_API_KEY`,
  `STORE_RESEND_FROM_EMAIL`, `STORE_NOTIFICATION_REPLY_TO` y `CRON_SECRET` cargados
  como secretos de producción.
- [ ] `STORE_GUEST_TRACKING_SECRET` aleatorio, exclusivo y de al menos 32 bytes;
  recuperación invitada probada sin exponer email, dirección, UUID o proveedor.
- [ ] La cola `store_outbox_events` se procesa cada 5 minutos o menos mediante
  Supabase Cron u otro programador autenticado. El cron diario de Vercel Hobby
  no es suficiente para ventas activas.
- [ ] TOTP habilitado y prueba de AAL2, recuperación y eliminación del factor.
- [ ] RLS, Secret key y rotación de secretos revisados en producción.
- [ ] Turnstile creado para `tienda.casa-atenta.com`; site/secret key separados
  por entorno, acciones `store_checkout` y `store_guest_access`,
  `STORE_TURNSTILE_ALLOWED_HOSTNAMES=tienda.casa-atenta.com` y replay rechazado;
  validar según la [guía oficial de Siteverify](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

## 4. Openpay

- [ ] Migración `20260719054500_commerce_integrity_v1.sql` aplicada y validada
  con backup/rollback y las 74 aserciones pgTAP en verde sobre un reset limpio.
- [ ] Credenciales de producción separadas de sandbox.
- [ ] 3D Secure y device session ID probados con escenarios aprobado, pendiente,
  rechazado y abandonado.
- [ ] Webhook HTTPS configurado con usuario/contraseña aleatorios y prueba de
  verificación.
- [ ] Eventos duplicados, desordenados y reintentos validados.
- [ ] Eventos nuevos o payloads malformados quedan en cuarentena/
  `needs_review` sin mutar pagos ni provocar reintentos infinitos.
- [ ] Importe y UUID coinciden antes de mutar el pedido; moneda informada debe
  ser PEN y, si Openpay la omite, el intento local autoritativo debe ser PEN.
- [ ] Conciliación de reservas cada minuto configurada según
  [ORDER_RECONCILIATION_RUNBOOK.md](./ORDER_RECONCILIATION_RUNBOOK.md), con dos
  ciclos sanos y alertas.
- [ ] Procedimiento manual ensayado para éxito tardío, cargo duplicado,
  `needs_review` o discrepancia.
- [ ] Reembolsos y contracargos probados sin devolver inventario automáticamente.

## 5. DNS, despliegue y observabilidad

- [x] Preview transitorio separado, protegido y fail-closed validado como
  referencia/rollback; no se considera arquitectura final.
- [ ] Web, blog y tienda integrados en un solo build y proyecto Vercel
  `casaatenta-web`, root `.`, según
  [SINGLE_PROJECT_ARCHITECTURE.md](./SINGLE_PROJECT_ARCHITECTURE.md).
- [ ] Routing por host probado también para APIs, Auth, robots, sitemap,
  manifest, errores y activos; prefijos internos no son públicos.
- [ ] `tienda.casa-atenta.com` asociado al proyecto único y el proyecto
  transitorio retirado después de la ventana de rollback.
- [ ] Plan de Vercel apto para uso comercial. Hobby solo se usa para desarrollo
  y Preview; no se habilitan cobros allí.
- [ ] DNS `tienda` conectado, TLS activo y redirección canónica verificada.
- [ ] Variables de entorno cargadas según `.env.example`.
- [ ] La función de conciliación respeta `maxDuration=60` y el plan/configuración
  de Vercel confirma al menos 60 segundos de ejecución (Fluid Compute activo si
  el plan lo requiere).
- [ ] Alertas para errores de checkout/webhook, colas de correo y conciliación.
- [ ] La outbox descarta el correo inicial si el pago ya terminó y conserva el
  correo de resultado; Turnstile y límites persistentes protegen la cuota Resend.
- [ ] Backups, retención de logs sin PAN/CVV/PII innecesaria y plan de incidentes.
- [ ] Lighthouse, accesibilidad por teclado, móvil y navegadores principales.
- [ ] `npm run check:all` en verde antes de publicar.
- [ ] `npm run store:test` y `npx --yes supabase@2.109.1 test db` en verde.
- [ ] Estado final verificado: un único proyecto Vercel para los cuatro hosts.

## 6. Activación controlada

- [ ] Cambiar primero staging a `live` y realizar compra real de bajo importe.
- [ ] Verificar pago, pedido, comprobante, correo, stock y seguimiento.
- [ ] Aprobar formalmente la salida.
- [ ] Cambiar producción a `NEXT_PUBLIC_STORE_MODE=live` y `STORE_MODE=live`.

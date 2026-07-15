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

- [ ] Ejecutar migraciones en staging y luego producción; conservar respaldo.
- [ ] Configurar Site URL y allow-list exacta de callbacks.
- [ ] Configurar Google OAuth. Google debe usar el callback de Supabase
  (`https://<project-ref>.supabase.co/auth/v1/callback`); la app usa
  `https://tienda.casa-atenta.com/auth/callback` como redirect permitido:
  [guía oficial](https://supabase.com/docs/guides/auth/social-login/auth-google).
- [ ] SMTP transaccional, confirmación de correo y recuperación probados.
- [ ] Dominio y remitente de Resend verificados; `RESEND_API_KEY`,
  `RESEND_FROM_EMAIL`, `STORE_NOTIFICATION_REPLY_TO` y `CRON_SECRET` cargados
  como secretos de producción.
- [ ] La cola `store_outbox_events` se procesa cada 5 minutos o menos mediante
  Vercel Pro o un programador externo. El cron diario de Vercel Hobby es solo
  respaldo y no es suficiente para ventas activas.
- [ ] TOTP habilitado y prueba de AAL2, recuperación y eliminación del factor.
- [ ] RLS, Secret key y rotación de secretos revisados en producción.

## 4. Openpay

- [ ] Credenciales de producción separadas de sandbox.
- [ ] 3D Secure y device session ID probados con escenarios aprobado, pendiente,
  rechazado y abandonado.
- [ ] Webhook HTTPS configurado con usuario/contraseña aleatorios y prueba de
  verificación.
- [ ] Eventos duplicados, desordenados y reintentos validados.
- [ ] Importe, moneda y UUID del intento coinciden antes de mutar el pedido.
- [ ] Conciliación diaria y procedimiento manual para éxito tardío o discrepancia.
- [ ] Reembolsos y contracargos probados sin devolver inventario automáticamente.

## 5. DNS, despliegue y observabilidad

- [ ] Proyecto Vercel separado con root `apps/storefront`.
- [ ] DNS `tienda` conectado, TLS activo y redirección canónica verificada.
- [ ] Variables de entorno cargadas según `.env.example`.
- [ ] Alertas para errores de checkout/webhook, colas de correo y conciliación.
- [ ] Backups, retención de logs sin PAN/CVV/PII innecesaria y plan de incidentes.
- [ ] Lighthouse, accesibilidad por teclado, móvil y navegadores principales.
- [ ] `npm run check:all` en verde antes de publicar.

## 6. Activación controlada

- [ ] Cambiar primero staging a `live` y realizar compra real de bajo importe.
- [ ] Verificar pago, pedido, comprobante, correo, stock y seguimiento.
- [ ] Aprobar formalmente la salida.
- [ ] Cambiar producción a `NEXT_PUBLIC_STORE_MODE=live` y `STORE_MODE=live`.

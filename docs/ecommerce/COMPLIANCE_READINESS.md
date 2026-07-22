# Matriz de preparación legal y operativa

Estado al 15 de julio de 2026. Este documento es una matriz técnica; no sustituye
la aprobación de un abogado peruano ni la configuración tributaria de un contador.

| Área | Implementado | Pendiente antes de `live` |
| --- | --- | --- |
| Identidad | Titular, nombre comercial y RUC en políticas/footer | Domicilio, teléfono, WhatsApp, correo y horario verificados |
| Contrato electrónico | Checkbox no premarcado, versión, SHA-256 del documento y proveedor, hora y snapshot en pedido | Revisión legal y entrega de copia inmutable al cliente |
| Privacidad | Política ecommerce, onboarding versionado, solicitudes desde cuenta | Inscribir bancos, documentar transferencias, retención y Documento de Seguridad |
| Cookies | Inventario de Auth, carrito local y antifraude; sin banner ficticio | CMP solo si se agregan cookies opcionales |
| Libro | Ruta visible y reutilización del ledger central | Domicilio, SLA operativo, revisión de límites y prueba de respuesta/entrega |
| Productos | 18 SKUs e imágenes locales con fuentes registradas | Precio, stock, kit, garantía y autorización comercial por imagen |
| Entrega | Tarifa online explícita para Lima/Callao; provincias antes de cobrar | Ventanas reales, transportista y reglas por peso/destino aprobadas |
| Cambios/garantía | Política separa defecto legal de cambio voluntario | Plazos, logística inversa, diagnóstico y SLA aprobados por lote/marca |
| SUNAT | Checkout recoge boleta/factura | PSE/OSE o SEE, XML/PDF/CDR, numeración y notas de crédito |
| Pagos | Tokenización Openpay, idempotencia, Turnstile, webhooks atómicos y reconciliación de reservas implementados en repositorio | Migración hospedada, claves productivas, 3DS, pruebas reales, cron y guardia operativa |
| Cuentas | Contraseña, Magic Link, Google, TOTP, RLS y solicitudes de datos | Proyecto Supabase Casa Atenta, SMTP, CAPTCHA, recuperación MFA y pruebas E2E |
| Infraestructura | App compilable, noindex/no-cobro, headers y Preview transitorio protegido | Integración en un solo proyecto Vercel, CNAME `tienda`, TLS, plan comercial y observabilidad |

## Reglas que no deben degradarse

- El precio mostrado al pagar debe ser total e incluir IGV y cargos obligatorios.
- No cobrar una entrega a provincia antes de informar y aceptar su tarifa.
- No publicar un SKU con precio, stock, contenido o garantía “por confirmar”.
- No presentar siete días de arrepentimiento como regla general inexistente.
- No condicionar un reclamo por defecto a que el producto siga sellado.
- No hacer marketing obligatorio para comprar ni disfrazar el tratamiento
  contractual como consentimiento publicitario.
- No reutilizar imágenes comerciales sin permiso del titular o fabricante.
- No activar cobros sin comprobante electrónico operativo.

## Fuentes oficiales de referencia

- [Código de Protección y Defensa del Consumidor](https://diariooficial.elperuano.pe/Normas/obtenerDocumento?idNorma=17)
- [Ley 29733](https://cdn.www.gob.pe/uploads/document/file/2011398/Ley%20N%C2%BA%2029733%20-%20Ley%20de%20protecci%C3%B3n%20de%20datos%20personales.pdf.pdf)
- [Reglamento DS 016-2024-JUS](https://www.gob.pe/institucion/anpd/normas-legales/6554453-n-016-2024-jus)
- [Libro de Reclamaciones, DS 011-2011-PCM](https://www.gob.pe/institucion/presidencia/normas-legales/541080-011-2011-pcm)
- [Plazo de respuesta, DS 101-2022-PCM](https://www.gob.pe/institucion/indecopi/normas-legales/3346742-101-2022-pcm)
- [SUNAT: obligados a CPE](https://cpe.sunat.gob.pe/informacion_general/obligados_cpe)
- [Indecopi sobre fotografías en uso comercial](https://www.gob.pe/institucion/indecopi/noticias/819836-el-indecopi-exhorta-a-empresas-respetar-derechos-de-autor-de-la-musica-fotos-o-personajes-usados-en-publicaciones-en-redes-sociales)

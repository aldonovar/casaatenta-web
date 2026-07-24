# Operación de cuentas y Supabase Auth

## Estado implementado en el repositorio

- Correo y contraseña con política de 12 caracteres, mayúscula, minúscula,
  número y símbolo.
- Confirmación y recuperación por PKCE.
- Magic Link para cuentas existentes (`shouldCreateUser: false`) mediante un
  endpoint propio que conserva el verificador PKCE en una cookie y devuelve
  siempre el mismo estado y cuerpo al navegador. La llamada directa a Supabase
  no aparece en Network. Limita además a cinco solicitudes por IP cada quince
  minutos.
- Google OAuth.
- TOTP y desafío AAL2.
- Redirects internos validados contra open redirect.
- Cookies SSR por solicitud y cabeceras `private, no-store` propagadas en proxy,
  callback y logout.
- Consentimiento de cuenta versionado, con hora de base de datos, SHA-256 del
  documento junto con los datos mostrados del proveedor y snapshot de esos
  datos.
- RLS adicional: si un usuario inscribe MFA, una sesión AAL1 no puede consultar
  datos privados directamente por la Data API. Las Server Actions consultan la
  misma función autoritativa de base antes de usar privilegios administrativos.
- Cola de solicitudes de acceso, rectificación, eliminación, oposición,
  revocación y portabilidad desde `/cuenta/datos`.

## Migraciones nuevas y orden

1. `20260716004528_store_legal_acceptances.sql`
2. `20260716005947_storefront_mfa_rls_hardening.sql`
3. `20260716010040_storefront_privacy_requests.sql`

Aplicarlas primero en staging. No ejecutar estas migraciones en VANIA ni ALLYX:
la cuenta Supabase conectada durante esta revisión no mostró un proyecto Casa
Atenta verificable.

## Configuración hospedada obligatoria

- Site URL: `https://tienda.casa-atenta.com`
- Redirect permitido: `https://tienda.casa-atenta.com/auth/callback`
- Google callback: `https://<project-ref>.supabase.co/auth/v1/callback`
- Google OAuth habilitado y pantalla de consentimiento publicada.
- SMTP propio y dominio Resend verificado.
- Confirmación de correo y plantillas en español.
- Protección de contraseña filtrada, límites de sesión, reautenticación para
  cambios sensibles y notificaciones de seguridad.
- CAPTCHA/Turnstile en alta, acceso y recuperación cuando se disponga del host y
  claves definitivas.
- Límites estrictos y monitoreo del endpoint público `/auth/v1/otp` de
  Supabase. La URL y la publishable key son públicas por diseño; el proxy de la
  aplicación evita filtrar el resultado en la interfaz, pero no convierte la
  API del proveedor en un endpoint privado.

La guía oficial para Google está en [Supabase Auth con
Google](https://supabase.com/docs/guides/auth/social-login/auth-google).

## Flujo normal

1. El usuario elige Google, contraseña o Magic Link.
2. `/auth/callback` intercambia el código PKCE y nunca permite caché compartida.
3. La base consulta los factores TOTP verificados y el `aal` firmado; si existe
   un factor, se exige AAL2 aunque la sesión se haya creado en otro dispositivo.
4. `/auth/consentimiento` comprueba las versiones vigentes.
5. Una Server Action vuelve a validar usuario y nivel MFA; después, el cliente
   administrativo inserta versiones, hashes y snapshot usando el reloj de la
   base. No existe un RPC de escritura ni permiso `insert` para el rol
   autenticado.
6. El layout de cuenta vuelve a exigir AAL2 y consentimiento antes de exponer
   direcciones, pedidos o solicitudes de privacidad.

## Incidentes y recuperación

- Credencial sospechosa: cerrar sesiones globalmente desde Supabase, revocar la
  identidad comprometida y avisar al titular por canal verificado.
- Pérdida del autenticador: no desactivar MFA solo por correo. Usar un proceso de
  recuperación con verificación reforzada y registro de auditoría.
- Error de callback: revisar allow-list, Site URL, reloj, proveedor y logs sin
  imprimir tokens.
- Fuga o sospecha de Secret key: rotar inmediatamente en Supabase y Vercel,
  invalidar la anterior y revisar uso administrativo.
- Solicitud de eliminación: el borrado no es instantáneo; debe resolverse la
  cola operativa, separar información legalmente retenida y comunicar el cierre.

## Pruebas antes de producción

- Alta, confirmación, login, logout y sesión renovada.
- Correo desconocido sin diferencia observable en UI, respuesta HTTP ni llamada
  directa del navegador a Supabase.
- Magic Link usado, expirado y reutilizado.
- Google nuevo y Google con correo ya existente.
- Recuperación de contraseña y regla completa de fortaleza.
- TOTP: alta, código inválido, AAL1 bloqueado por RLS, AAL2 permitido y baja.
- Consentimiento ausente, vigente y nueva versión.
- RLS con dos usuarios distintos y rol anónimo.
- Solicitud de privacidad visible solo para su titular.
- Headers de callback y cuenta: `Cache-Control: private, no-store`.

Apple, Microsoft u otro OAuth se añade únicamente cuando existan credenciales y
una decisión comercial. Antes hay que actualizar scopes, política de privacidad,
pruebas de enlace de identidades y procedimiento de recuperación.

# MCP local de Casa Atenta

Esta carpeta configura integraciones exclusivas para este repositorio. Codex
solo carga `.codex/config.toml` cuando abre el proyecto como repositorio de
confianza. La cuenta global/personal de Supabase queda deshabilitada aquí para
evitar mezclar organizaciones.

## Identidades y alcance

- Supabase y Resend deben autenticarse con la cuenta operativa de Casa Atenta,
  no con los conectores globales/personales de Codex.
- GitHub y Cloudflare continúan usando las conexiones globales compartidas.
- Los nombres `casaatenta_supabase` y `casaatenta_resend` son deliberadamente
  únicos para no colisionar con servidores configurados en otros proyectos.

La configuración es project-scoped, pero los tokens OAuth se guardan en el
keyring o estado local de Codex. Nunca se escriben en este repositorio. No se
deben añadir PAT, API keys, cookies, contraseñas ni encabezados `Authorization`
a `config.toml`.

## Supabase

`casaatenta_supabase` está restringido al proyecto hospedado
`casa-atenta-production` (`vywtnakijogqoiumnqaa`, región `sa-east-1`). La
referencia se verificó en modo de solo lectura mediante la cuenta de Casa
Atenta el 16 de julio de 2026. `supabase/config.toml` conserva un `project_id`
local distinto y no debe sustituir esa referencia.

1. Conservar obligatoriamente el `project_ref`, `read_only=true` y el conjunto reducido de
   features. `apply_migration` también permanece en `disabled_tools` como
   defensa adicional.
2. Si se revoca el consentimiento, desde la raíz del repositorio iniciar OAuth:

   ```bash
   codex mcp login casaatenta_supabase
   ```

3. En el navegador, iniciar sesión con la cuenta operativa de Casa Atenta,
   seleccionar la organización correcta y revisar el consentimiento antes de
   aceptarlo.

Supabase todavía solicita permisos OAuth amplios. `project_ref`, modo de solo
lectura, aprobación manual y el aislamiento de cuenta son controles
compensatorios. Para escrituras o migraciones se debe usar un entorno de
desarrollo/branch y un flujo explícito, no retirar silenciosamente
`read_only=true` de esta entrada.

## Resend

El servidor remoto oficial usa OAuth y no necesita `RESEND_API_KEY` en Codex.
Se solicita `full_access` porque la operación incluye inspección de dominios,
logs y webhooks, además de envíos. Toda herramienta continúa en modo
`prompt` porque ese scope también permite operaciones destructivas.

```bash
codex mcp login casaatenta_resend --scopes full_access
```

Durante OAuth se debe seleccionar la cuenta y el team de Casa Atenta. El
consentimiento puede revocarse desde Team settings de Resend.

## Verificación

Después del login, reiniciar Codex o abrir una tarea nueva en este repositorio:

1. `codex mcp list` debe mostrar ambas entradas locales.
2. Supabase debe exponer únicamente el proyecto cuyo `project_ref` figura en la
   URL y no debe permitir escrituras SQL.
3. Resend debe corresponder al team de Casa Atenta; antes de enviar, comprobar
   el dominio y el remitente `Casa Atenta <info@casa-atenta.com>`.
4. Abrir otro repositorio y confirmar que estas entradas no aparecen allí.

## MCP no es runtime

OAuth solo autoriza a Codex para labores de desarrollo y operación. La web usa
por separado `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `RESEND_API_KEY` y demás
variables del entorno de despliegue. Esos secretos viven en Vercel/hosting y no
se derivan, copian ni reutilizan desde el MCP.

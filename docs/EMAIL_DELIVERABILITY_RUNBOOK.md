# Runbook de entregabilidad de correo

Este runbook permite comprobar la base pública de autenticación y recepción de
`casa-atenta.com` sin leer secretos, cargar `.env`, cambiar DNS ni enviar un
correo. El control es preventivo y de solo lectura: reduce fallas conocidas,
pero ningún proveedor ni configuración puede garantizar que todos los mensajes
lleguen siempre a Inbox.

Un evento `delivered` de Resend significa que el servidor receptor aceptó el
mensaje. No confirma si después lo colocó en Inbox, Promociones, cuarentena o
spam.

## Ejecución inmediata

Desde la raíz del repositorio:

```bash
npm run email:deliverability:check
```

La configuración predeterminada corresponde al flujo vigente:

- dominio visible: `casa-atenta.com`;
- Return-Path: `send.casa-atenta.com`;
- selector DKIM: `resend`.

Para una auditoría explícita o durante una rotación controlada:

```bash
npm run email:deliverability:check -- \
  --domain casa-atenta.com \
  --return-path send.casa-atenta.com \
  --dkim-selector resend
```

`--dkim-selector` puede repetirse para comprobar en paralelo el selector activo
y uno nuevo. Todos los argumentos son públicos; no se necesita ninguna
variable de entorno.

## Qué comprueba

| Control                | Condición esencial                                                                                                    | Advertencias no bloqueantes                               |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| SPF raíz y Return-Path | un TXT SPF por host, sintaxis válida, `all`/`redirect` efectivo, cadena resoluble sin ciclos y máximo 10 términos DNS | `~all` requiere inventario antes de endurecer             |
| DKIM                   | selector público, clave RSA parseable y módulo de al menos 1024 bits                                                  | clave menor de 2048 bits                                  |
| DMARC                  | un TXT válido con política `p` reconocida                                                                             | `p=none` o `pct` menor de 100                             |
| MX                     | al menos un MX real para recibir respuestas                                                                           | —                                                         |
| NS                     | delegación pública resoluble                                                                                          | un solo nameserver                                        |
| RDAP de Verisign       | consulta informativa para dominios `.com`                                                                             | dominio menor de 90 días o RDAP temporalmente inaccesible |

La comprobación SPF recorre todos los `include:` y `redirect=` literales, valida
el SPF que publican, detecta ciclos y suma de forma conservadora los mecanismos
que consumen el presupuesto SPF (`include`, `a`, `mx`, `ptr`, `exists` y
`redirect`). Si la suma estática excede 10, el control falla aunque algunas
ramas pudieran no ejecutarse para una IP concreta. Los destinos dinámicos con
macros en `include:` o `redirect=` también fallan de forma cerrada porque no se
pueden resolver sin el contexto real de una evaluación.

Las auto-pruebas deterministas del control SPF no consultan la red:

```bash
node --import tsx scripts/check-email-deliverability.ts --self-test
```

Cubren `include` y `redirect` existentes/inexistentes, sintaxis IP inválida,
ciclos, el borde exacto de 10 términos, el exceso del límite y dependencias
dinámicas no verificables.

El comando termina con:

- código `0` si no hay fallas esenciales, aunque existan advertencias;
- código `1` exclusivamente cuando falla autenticación o un componente
  esencial (SPF, DKIM, DMARC, MX o NS);
- código `2` ante argumentos inválidos o un error interno del comprobador.

Una advertencia no es una autorización para cambiar DNS. En particular:

- no cambiar `~all` a `-all` sin inventariar cada emisor legítimo;
- no pasar DMARC directamente de `p=none` a `p=reject`; revisar primero
  reportes y alineación de todos los flujos;
- una clave DKIM de 1024 bits supera el mínimo de este control, pero debe
  planificarse una rotación soportada por el proveedor a 2048 bits o más;
- un dominio de menos de 90 días puede tener poca reputación. Eso requiere
  tiempo, volumen moderado, destinatarios esperados y baja tasa de quejas; no
  existe un registro DNS que elimine por sí solo esa señal.

## Alcance residual del control SPF

El resultado es una auditoría estática preventiva, no una implementación
completa de la evaluación SPF para un mensaje. No recibe la IP emisora, HELO ni
MAIL FROM concretos; por eso no determina qué mecanismo coincidiría ni el
resultado `pass`/`fail` de un correo específico. Valida la sintaxis soportada y
la cadena de políticas, pero no ejecuta las consultas A/AAAA/MX de cada
mecanismo `a`, `mx`, `ptr` o `exists`, no calcula el límite separado de
respuestas DNS vacías y no expande macros dependientes del mensaje fuera de
`include`/`redirect`.

Por ese motivo, un código `0` confirma que no se detectaron las fallas
estructurales cubiertas; no certifica entregabilidad ni sustituye revisar
`Authentication-Results` del `.eml` real.

## Incidente: correo aceptado pero colocado en spam

Para determinar la causa real hace falta el mensaje original en formato
`.eml`. Una captura, un reenvío o el estado `delivered` no conservan toda la
evidencia.

Solicitar al destinatario que descargue **el mensaje original** desde su
proveedor y lo comparta por un canal privado autorizado. El `.eml` puede
contener dirección, IP, identificadores y contenido del cliente:

- no agregarlo a Git;
- no subirlo a un issue público;
- guardarlo con acceso restringido y eliminarlo al cerrar el incidente según
  la política de retención aplicable.

Revisar en ese original:

1. `Authentication-Results`: resultado real de SPF, DKIM y DMARC en destino.
2. `DKIM-Signature`: valores `d=` y `s=` usados por el mensaje concreto.
3. `Return-Path`: dominio evaluado por SPF y su alineación con el From.
4. Cadena `Received`, fecha, `Message-ID` y cabeceras antispam del receptor.
5. Remitente, asunto, enlaces, adjunto y coincidencia con el evento individual
   de Resend.

Sin el `.eml` solo puede confirmarse la postura DNS actual; no se puede probar
por qué ese receptor clasificó aquel mensaje específico como spam.

## Respuesta segura

1. Ejecutar el comprobador y conservar su salida con fecha.
2. Si devuelve código `1`, detener nuevos envíos a clientes hasta corregir y
   volver a verificar el control esencial afectado.
3. Obtener el `.eml` original y correlacionarlo con el ID/evento de Resend
   mediante acceso de solo lectura.
4. Preparar cualquier cambio de proveedor o DNS como una operación separada:
   valor exacto emitido por el proveedor, respaldo de zona, revisión por otra
   persona, TTL/propagación, verificación y rollback.
5. Para DKIM, publicar y verificar un selector nuevo antes de retirar el
   anterior; nunca sobrescribir a ciegas la clave activa.
6. Para DMARC, avanzar por etapas únicamente después de validar las fuentes
   legítimas y revisar reportes.
7. Repetir el control público y realizar pruebas internas autorizadas. Ningún
   paso de este runbook autoriza un envío real, un cambio DNS o una modificación
   de variables de producción.

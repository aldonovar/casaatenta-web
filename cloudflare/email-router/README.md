# Casa Atenta Email Router

Worker de entrada para Cloudflare Email Routing. Solo acepta estos destinatarios:

- `info@casa-atenta.com`
- `notificaciones@casa-atenta.com`
- `febjon@casa-atenta.com`
- `aldonovar@casa-atenta.com`

Cada mensaje aceptado se reenvía a dos destinos internos verificados. Las direcciones reales no se guardan en el código: se configuran como los secretos `DESTINATION_FEBJON` y `DESTINATION_STEAMDUSK`.

## Validación

```powershell
npm run types
npm run types:check
npm run typecheck
npm run deploy:dry
```

## Despliegue

1. Verificar los dos destinos en Cloudflare Email Routing.
2. Crear ambos secretos del Worker.
3. Ejecutar `npm run deploy`.
4. Activar Email Routing y crear cuatro reglas literales que apunten a este Worker.
5. Mantener el catch-all desactivado.

No se debe responder desde las cuentas personales de destino; hacerlo mostraría esa dirección al remitente. Las respuestas profesionales deben salir desde la infraestructura corporativa.

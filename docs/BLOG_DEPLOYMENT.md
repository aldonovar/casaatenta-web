# Publicación de Casa Atenta Editorial

El blog se sirve desde el mismo despliegue de la web. Internamente conserva las rutas `/blog`, pero el proxy presenta URLs públicas limpias bajo `https://blog.casa-atenta.com`.

## Configuración de producción

1. Definir `NEXT_PUBLIC_BLOG_URL=https://blog.casa-atenta.com` en las variables del proyecto.
2. Agregar `blog.casa-atenta.com` como dominio del mismo proyecto que publica la web principal.
3. Crear o actualizar el registro CNAME `blog` con el valor exacto indicado por el proveedor de hosting.
4. Volver a desplegar después de guardar la variable y el dominio.

## Comprobaciones posteriores

- `https://blog.casa-atenta.com`
- `https://blog.casa-atenta.com/robots.txt`
- `https://blog.casa-atenta.com/sitemap.xml`
- `https://blog.casa-atenta.com/feed.xml`
- Una entrada y su imagen social: `/<slug>` y `/<slug>/opengraph-image`
- Una URL antigua bajo `https://www.casa-atenta.com/blog/<slug>` debe redirigir permanentemente a la URL canónica del subdominio.

Finalmente, verificar el subdominio como propiedad en Google Search Console y enviar `https://blog.casa-atenta.com/sitemap.xml`.

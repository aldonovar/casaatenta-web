# Casa Atenta — Plan de recuperación y reconstrucción

## Objetivo

Recuperar una web estable, creíble y visualmente arquitectónica. La prioridad es que cada ruta funcione sin recarga forzada, que el contenido represente servicios reales y que el movimiento acompañe la lectura sin dominarla.

## Problemas confirmados

1. Demasiadas capas globales simultáneas: Lenis, transición de rutas, preloader, cursor personalizado, partículas, navegación lateral y animación global.
2. Navegación lateral con IDs de secciones antiguas que ya no existen.
3. Componentes con scroll horizontal y pinning compitiendo por el mismo documento.
4. Material visual conceptual sin una jerarquía consistente entre referencia, propuesta y obra.
5. Páginas de servicio con simuladores y textos que exceden la oferta real.
6. Exceso de recursos decorativos: grids, partículas, glows, overlays y telemetría ficticia.
7. Cambios grandes publicados sin una matriz de comprobación por ruta.

## Principios de reconstrucción

- Una sola capa de movimiento por sección.
- Scroll nativo como base estable.
- GSAP limitado a componentes concretos y con limpieza al desmontar.
- Sin preloader, cortinas de ruta, partículas globales ni cursor personalizado.
- Imágenes mediante `next/image`.
- Cada render debe estar rotulado como propuesta visual, referencia o composición conceptual.
- Ninguna métrica simulada debe parecer dato real.
- La arquitectura visual parte de proporción, luz, estructura, detalle y material.
- Mobile first: ninguna sección depende de pinning para ser comprensible.

## Fase 0 — Recuperación operativa

### Alcance

- Simplificar `ClientWrapper`.
- Retirar efectos globales conflictivos.
- Corregir navegación entre rutas.
- Eliminar accesos a IDs inexistentes.
- Verificar que cada página abra sin recarga forzada.

### Criterios de aceptación

- Inicio, Servicios, Proyectos, Proceso, Blog, Nosotros y Contacto abren desde el menú.
- Las páginas individuales de servicios abren desde enlaces internos.
- No existe una pantalla negra, cortina bloqueada o scroll congelado.
- Vercel compila y despliega correctamente.

## Fase 1 — Arquitectura de información

### Home definitiva

1. Hero
2. Servicios reales
3. Techo Sol y Sombra corredizo
4. Diseño de terrazas
5. Iluminación y domótica
6. Proceso de trabajo
7. Propuestas y obras clasificadas
8. Contacto

### Acciones

- Eliminar secciones duplicadas o conceptuales sin función comercial.
- Reducir la home a 7–8 bloques claros.
- Unificar CTA principal: enviar foto y medidas.
- Revisar todos los enlaces y anchors.

### Criterios de aceptación

- El usuario entiende en menos de 10 segundos qué hace Casa Atenta.
- La terraza y el techo corredizo son el servicio visual principal.
- Domótica e iluminación aparecen como integración aplicada, no como espectáculo tecnológico.

## Fase 2 — Sistema visual real

### Material visual

- Crear inventario de assets.
- Clasificar: obra terminada, avance, propuesta visual, referencia técnica, logo.
- Retirar imágenes con texto incrustado o escenarios incoherentes.
- Preparar versiones desktop y mobile.

### Dirección visual

- Luz natural o iluminación residencial contenida.
- Estructuras legibles.
- Detalles de perfiles, uniones, policarbonato, madera y metal.
- Menos overlays; mayor contraste material.
- Sin vegetación genérica, barras LED decorativas ni renders excesivamente brillantes.

### Criterios de aceptación

- Cada imagen tiene etiqueta de estado.
- Ninguna propuesta se presenta como obra terminada.
- El hero utiliza una sola escena dominante, no un carrusel automático.

## Fase 3 — Movimiento y scrollytelling

### Reglas

- GSAP solo para entrada, parallax leve y progresión técnica.
- Parallax máximo de 4–10%.
- Un solo bloque horizontal como máximo en toda la home.
- Sin pinning en móviles.
- Respeto completo a `prefers-reduced-motion`.

### Criterios de aceptación

- El contenido sigue siendo legible con JavaScript desactivado o movimiento reducido.
- La navegación no depende de timelines.
- No existen saltos al cambiar tamaño de ventana.

## Fase 4 — Servicios

### Techos Sol y Sombra

- Corredizo manual por polea.
- Corredizo con gancho.
- Corredizo motorizado.
- Cubierta fija.
- Lamas orientables solo como solución especial sujeta a evaluación.

### Terrazas

- Medición, estructura, cubierta, iluminación, acabados y uso.

### Domótica

- Escenas, sensores, iluminación, accesos y control compatible.
- Sin promesas de compatibilidad universal.

### Mantenimiento

- Pintura, metal, madera, correcciones y acabados visibles.

## Fase 5 — QA

### Matriz de rutas

- `/`
- `/servicios`
- `/servicios/techos-sol-y-sombra`
- `/servicios/diseno-terrazas`
- `/servicios/iluminacion-inteligente`
- `/servicios/smart-homes`
- `/servicios/mantenimiento-general`
- `/proyectos`
- `/proceso`
- `/blog`
- `/nosotros`
- `/contacto`

### Verificaciones

- Navegación por clic sin recarga forzada.
- Menú móvil.
- Scroll y anchors.
- Formularios.
- WhatsApp.
- Imágenes sin layout shift.
- Contraste y foco de teclado.
- Vercel verde.

## Orden de implementación

1. Estabilización global.
2. Navegación y menú.
3. Reducción de la home.
4. Hero único y realista.
5. Servicios principales.
6. Proyectos y clasificación visual.
7. Páginas internas.
8. Movimiento final.
9. QA completo.

## Regla de publicación

Cada commit debe modificar un bloque verificable. No se publicará un segundo bloque mientras el despliegue del anterior esté fallando. Los componentes se leerán nuevamente después de cada escritura para comprobar que no quedaron truncados.

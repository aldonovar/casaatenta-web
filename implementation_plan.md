# Casa Atenta — Plan de implementación vigente

## Posicionamiento

Casa Atenta prioriza automatización residencial aplicada. El sistema verbal y visual parte de **Tu hogar responde** y se extiende a iluminación, accesos, sensores, escenas, cubiertas motorizadas, terrazas y mantenimiento.

## Principios de interfaz

- Tipografía editorial y técnica.
- Animaciones GSAP puntuales, cancelables y compatibles con movimiento reducido.
- SVGs y diagramas como apoyo funcional.
- Glassmorphism limitado a paneles concretos.
- Scroll nativo en móvil.
- Sin preloaders ni transiciones de pantalla completa que bloqueen contenido.
- Una sola jerarquía semántica principal por página.

## Arquitectura pública

- Home orientada a automatización, servicios, escenas, proyectos, proceso y contacto.
- Página principal de automatización en `/servicios/smart-homes`.
- Detalles de servicios con estructura compartida.
- Propuestas visuales clasificadas como tales.
- Rutas experimentales redirigidas a páginas vigentes.
- Información de fundadores excluida de páginas y documentación pública.

## Estabilización

1. Navegación y foco.
2. Responsive y overflow.
3. ScrollTrigger y limpieza de efectos.
4. Formularios y mensajes de WhatsApp.
5. Rutas y enlaces.
6. Rendimiento de imágenes y filtros.
7. Accesibilidad y movimiento reducido.
8. Validación mediante deployment disponible.

## Restricciones de contenido

- No afirmar compatibilidad universal.
- No presentar renders como obra ejecutada.
- No prometer integraciones por WhatsApp sin validación del proyecto.
- No atribuir pruebas locales o visuales que no hayan sido ejecutadas y documentadas.
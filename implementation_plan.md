# Plan de Implementación: Reconstrucción e Identidad Honesta (Casa Atenta)

Este plan detalla el rediseño absoluto de **Casa Atenta**. Basándonos en tu guía de estilo (A1 a A9) y en tus respuestas, reconstruiremos la web bajo un enfoque **honesto, técnico y sin pretensiones falsas**, eliminando métricas ficticias y presentando la marca con total transparencia.

---

## User Review Required

### 1. Enfoque de Proyectos ("Casos Conceptuales")
Dado que la firma se encuentra en su fase de lanzamiento y no cuenta aún con portafolio histórico de clientes:
*   **Decisión:** Cambiaremos el enfoque de "Casos de Éxito / Proyectos Realizados" por **"Propuestas de Integración / Escenarios de Concepto"**.
*   Mostraremos los 3 casos (Terraza, Cocina, Acceso) como ejercicios de diseño tridimensional y blueprint técnico que ilustran cómo resolvemos problemas espaciales reales.
*   Esto mantiene la honestidad brutal de la marca (criterio de aceptación clave) a la vez que demuestra dominio técnico y visual.

### 2. Eliminación de Telemetría Falsa (Stats)
*   **Decisión:** Eliminaremos por completo el contador de estadísticas (`StatsCounter.tsx`) que mostraba cifras ficticias de casas automatizadas o metros construidos.
*   En su lugar, crearemos un panel de **"Telemetría del Sistema"** sutil y puramente técnico (latencia de red local, estado de drivers de iluminación y lecturas de sensores de simulación), lo cual encaja perfectamente con el estilo técnico de Aether 1.

---

## Proposed Changes

### [Infraestructura y Configuración]

#### [MODIFY] [globals.css](file:///c:/Users/Alexis/Documents/ALLYX/DevStreams/Casa%20Atenta/src/app/globals.css)
*   **Paleta Blue Night / Gold:**
    *   Fondo Principal: `--ca-night: #07111D` (Azul noche profundo) y `--ca-deep-blue: #0C2742`
    *   Textos: `--ca-warm-white: #F4F0E8` y `--ca-blue-gray: #6F8496`
    *   Acentos: `--ca-gold: #D8B36A` y `--ca-soft-gold: #F2D38D`
    *   Líneas finas: `rgba(255, 255, 255, 0.12)`
*   **Tipografía:** Syne para títulos modernos de displays, Cormorant Garamond para cursivas y citas literarias, e Inter para cuerpo de texto legible y sobrio.

#### [NEW] [.env.example](file:///c:/Users/Alexis/Documents/ALLYX/DevStreams/Casa%20Atenta/.env.example)
*   Variables de entorno:
    ```env
    NEXT_PUBLIC_WHATSAPP_NUMBER=51908550942
    NEXT_PUBLIC_CONTACT_EMAIL=contacto@casa-atenta.com
    RESEND_API_KEY=
    ```

---

### [Reconstrucción de Rutas y Páginas]

#### [MODIFY] [page.tsx](file:///c:/Users/Alexis/Documents/ALLYX/DevStreams/Casa%20Atenta/src/app/page.tsx)
*   Secuencia final del Home (10 Capítulos):
    1.  `Preloader` (Logo y línea de carga fina).
    2.  `Hero` (Claim "LA CASA RESPONDE").
    3.  `CinematicWalk` (Scroll vertical con paneles de Entrada, Luz, Sombra, Escena).
    4.  `CreativeLenses` (Lentes técnicos e interactivos con microdatos).
    5.  `ServicesGallery` (Las 5 especialidades: Atmósferas, Terrazas, Accesos, Superficies, Conectividad).
    6.  `SceneController` (Módulo interactivo de 4 modos: Día, Tarde, Noche, Seguridad).
    7.  `HalfRenderReality` (Desplazamiento horizontal entre blueprint y render).
    8.  `CaseStudies` (Presentado como "Escenarios de Intervención").
    9.  `About` (Presentación de Jhon Febres y Alexis Espíritu).
    10. `FinalCTA` + `Footer` (Registro a API de Resend, sin oficina física listada).

#### [NEW] [api/contact/route.ts](file:///c:/Users/Alexis/Documents/ALLYX/DevStreams/Casa%20Atenta/src/app/api/contact/route.ts)
*   Crear una API Route en Next.js para procesar los leads de `/contacto` enviándolos a `contacto@casa-atenta.com` usando la librería de **Resend**. Si la API key no está configurada localmente, simulará un éxito y registrará en consola para desarrollo seguro.

#### [MODIFY] [contacto/page.tsx](file:///c:/Users/Alexis/Documents/ALLYX/DevStreams/Casa%20Atenta/src/app/contacto/page.tsx)
*   Rediseñar el formulario con campos de calificación de leads. El envío apuntará directamente a nuestra nueva API de Resend y mostrará un modal de éxito estilizado en azul noche y oro.

#### [MODIFY] [nosotros/page.tsx](file:///c:/Users/Alexis/Documents/ALLYX/DevStreams/Casa%20Atenta/src/app/nosotros/page.tsx)
*   Alinear la página a los fundadores reales Jhon Febres y Alexis Espíritu bajo la estética editorial slow-luxury.

#### [MODIFY] [diseno/page.tsx](file:///c:/Users/Alexis/Documents/ALLYX/DevStreams/Casa%20Atenta/src/app/diseno/page.tsx)
*   Reconstruir el visualizador y corregir potenciales problemas de hidratación en Brave removiendo imports estáticos de `split-type` fuera de `useEffect`.

---

## Verification Plan

### Automated Build Checks
*   Ejecutar `npm run build` localmente para garantizar que no existan errores de rutas ni problemas de compilación estática.
*   Ejecutar `npm run lint` para depurar el código.

### Manual Verification
*   Verificar que las imágenes de `public/media/` se rendericen en alta resolución sobre el fondo azul noche profundo.
*   Confirmar que el timeline del proceso y las animaciones de scroll de GSAP funcionen de forma suave (60fps) usando Lenis.

# Reconstrucción de la Experiencia Web: Lista de Tareas

Lista de control de tareas para la renovación integral de Casa Atenta con la paleta Blue Night y scrollytelling.

## Checklist

- [x] **Fase 1: Configurar Colores y Estilos de Marca (Blue Night)**
  - [x] Actualizar `src/app/globals.css` con la paleta de azul noche (`#07111D` y `#0C2742`), gris azulado (`#6F8496`), blanco cálido (`#F4F0E8`), oro cepillado (`#D8B36A` y `#F2D38D`).
  - [x] Alinear tipografías en toda la web utilizando Syne (display) y Cormorant Garamond (serif cursivas).
  - [x] Quitar todos los estilos oscuros planos (`#080807`) o degradados mineral-marrón en favor del azul noche inmersivo.

- [x] **Fase 2: Reconstrucción del Home Page**
  - [x] Actualizar `src/app/page.tsx` para integrar las 10 secciones consecutivas.
  - [x] Reconstruir `HeroSection` con el claim "LA CASA RESPONDE" en mayúsculas y la estética de líneas finas.
  - [x] Reconstruir `CinematicWalk` asignando el ID de scroll en GSAP para corregir el bug técnico de `containerAnimation`.
  - [x] Reconstruir `CreativeLenses` vinculando las imágenes del set tridimensional de la marca.
  - [x] Reconstruir `ServicesGallery` con las 5 especialidades actualizadas y un grid limpio.
  - [x] Reconstruir `SceneController` interactivo, modulando la iluminación con los nuevos fondos de Día/Noche.
  - [x] Reconstruir `HalfRenderReality` con control drag o scroll wipe de Blueprint vs Fotografía.
  - [x] Reconstruir `ProjectsShowcase` / `CaseStudies` renombrado a "Escenarios de Intervención" conceptuales.
  - [x] Reconstruir `AboutSection` alineando los perfiles de Jhon Febres y Alexis Espíritu.

- [x] **Fase 3: API de Contacto y Formulario Leads**
  - [x] Crear la API Route `src/app/api/contact/route.ts` con integración a Resend.
  - [x] Reconstruir el formulario calificado de `contacto/page.tsx` con llamadas a la nueva API.
  - [x] Reconstruir `/nosotros` y `/diseno` para corregir errores de Brave browser y alinearse a la estética Blue Night.

- [x] **Fase 4: Compilación y Despliegue**
  - [x] Ejecutar `npm run build` localmente y verificar sanidad.
  - [x] Fusionar/preparar cambios para despliegue.

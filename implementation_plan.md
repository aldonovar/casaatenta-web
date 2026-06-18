# Plan de Implementación: Optimización y Alineación Completa de Toda la Web (Casa Atenta)

Este plan describe las acciones técnicas y de diseño para optimizar y alinear al 100% todas las páginas de la web de **Casa Atenta** según la especificación de marca y el libro de prompts del usuario.

---

## 1. Breve Auditoría de Gaps en Páginas Secundarias

Tras revisar el estado actual del repositorio, hemos detectado discrepancias menores pero críticas en la consistencia de datos y campos que deben corregirse:

1. **Contacto (`/contacto`)**: El formulario actual es muy simple (5 campos básicos). Falta integrar preguntas específicas solicitadas en el prompt para calificar los leads antes de agendar la visita técnica.
2. **Nosotros (`/nosotros`)**: La sección de equipo muestra perfiles ficticios/provisionales (Alexis Falcon, Carlos Mendoza, Diana Valdivia) en lugar de documentar a los fundadores reales: **Jhon Febres** (Propietario y Gerente General) y **Alexis Espíritu** (Cofundador y Director Técnico/Visual).
3. **Servicios en Home (`ServicesGallery.tsx`)**: Muestra solo 4 servicios importados de un archivo viejo en lugar de las 5 especialidades oficiales declaradas en `src/data/site.ts` (`servicesData`), y el ancho de la sección horizontal está bloqueado a `400vw`.
4. **Método en Home (`ProcessTimeline.tsx`)**: Muestra 4 fases genéricas en lugar de las 6 fases del Método oficial de Casa Atenta (Diagnóstico, Propuesta visual, Integración, Ejecución, Activación, Acompañamiento).
5. **Configurador (`Configurator.tsx`)**: El enlace de redirección final a WhatsApp tiene el número de teléfono quemado directamente en el componente en lugar de importar la constante centralizada `WHATSAPP_NUMBER`.
6. **Ortografía**: Corrección de tildes menores en mensajes por defecto en constantes de contacto (`visita tecnica` -> `visita técnica`).

---

## 2. Cambios Propuestos por Componente

### [Componente: Servicios y Galería Horizontal]

#### [MODIFY] [ServicesGallery.tsx](file:///c:/Users/Alexis/Documents/ALLYX/DevStreams/Casa%20Atenta/src/components/ServicesGallery.tsx)
* Reemplazar la importación de `services` de `constants/services` por `servicesData` de `@/data/site`.
* Modificar el scroll horizontal para adaptarlo a 5 paneles dinámicos en lugar de 4.
* Reemplazar la clase de ancho fijo `lg:w-[400vw]` por una propiedad de estilo en línea dinámica: `style={{ width: `${servicesData.length * 100}vw` }}`.
* Utilizar directamente la propiedad `image` y `includes` de los datos de servicio para renderizar la imagen y los bullets.
* Agregar un quinto SVG lineal de enlucido/rejilla técnica para el servicio de Conectividad Invisible.

---

### [Componente: Proceso y Método]

#### [MODIFY] [ProcessTimeline.tsx](file:///c:/Users/Alexis/Documents/ALLYX/DevStreams/Casa%20Atenta/src/components/ProcessTimeline.tsx)
* Reemplazar la importación de `processSteps` por `methodSteps` de `@/data/site` (que contiene las 6 fases reales).
* Importar e integrar los 6 iconos correspondientes desde `lucide-react` para las 6 fases:
  1. `Eye` (Diagnóstico)
  2. `Layers` (Propuesta visual)
  3. `Cpu` (Integración)
  4. `Ruler` (Ejecución)
  5. `Sliders` (Activación)
  6. `ShieldCheck` (Acompañamiento)
* Ajustar la longitud de la animación vertical del SVG en desktop para cubrir los 6 nodos de forma fluida.

---

### [Página: Nosotros]

#### [MODIFY] [page.tsx](file:///c:/Users/Alexis/Documents/ALLYX/DevStreams/Casa%20Atenta/src/app/nosotros/page.tsx)
* Reemplazar los perfiles de equipo genéricos por perfiles detallados alineaos a los fundadores reales:
  * **Jhon Febres**: Propietario & Gerente General.
  * **Alexis Espíritu**: Cofundador & Director Técnico Visual.
* Mantener la estética premium y sobria sin retratos corporativos ruidosos, usando iconos lineales elegantes de especialidad.

---

### [Página: Contacto]

#### [MODIFY] [page.tsx](file:///c:/Users/Alexis/Documents/ALLYX/DevStreams/Casa%20Atenta/src/app/contacto/page.tsx)
* Reestructurar el formulario interactivo para incluir todos los campos del guiado oficial:
  1. **Nombre completo** (Text)
  2. **WhatsApp / Teléfono** (Tel)
  3. **Correo Electrónico** (Email)
  4. **Distrito / Ciudad** (Text)
  5. **Tipo de Espacio** (Select: Terraza, Casa Completa, Departamento, Oficina, Fachada, Cocina, Otro)
  6. **Servicio de Interés** (Select: Automatización, Iluminación Circadiana, Terraza/Pérgola, Accesos/Seguridad, Acabados/Superficies, Renovación, Diagnóstico Integral)
  7. **Estado de la obra** (Radio/Select: El espacio ya existe / Está en proyecto de planos)
  8. **Alcance deseado** (Radio/Select: Automatización inteligente / Acabados y superficies / Ambos)
  9. **Mensaje / Notas adicionales** (Textarea)
* Estilizar el grid del formulario para que sea limpio, legible y visualmente simétrico.

---

### [Componente: Configurador]

#### [MODIFY] [Configurator.tsx](file:///c:/Users/Alexis/Documents/ALLYX/DevStreams/Casa%20Atenta/src/components/Configurator.tsx)
* Importar la constante `WHATSAPP_NUMBER` desde `@/constants/contact`.
* Reemplazar la URL dura `wa.me/51908550942` por una plantilla de cadena dinámica utilizando la constante centralizada.

---

### [Constantes de Contacto]

#### [MODIFY] [contact.ts](file:///c:/Users/Alexis/Documents/ALLYX/DevStreams/Casa%20Atenta/src/constants/contact.ts)
* Corregir el typo de ortografía en la constante `DEFAULT_WHATSAPP_MESSAGE`: `visita tecnica` -> `visita técnica`.

---

## 3. Plan de Verificación

### Pruebas de Compilación y Calidad de Código
* Ejecutar `npm run build` para asegurar que las modificaciones no rompan el tipado TypeScript ni la compilación de rutas estáticas de Next.js.
* Validar que el servidor de desarrollo (`http://localhost:3000`) responda correctamente.

### Pruebas Visuales y de UX
* Validar que el formulario de contacto muestre y valide todos los campos en mobile y desktop.
* Validar que el slider de servicios horizontales en Home se desplace de forma suave mostrando los 5 paneles.
* Verificar que el timeline de 6 pasos en Home funcione con ScrollTrigger dibujando el trazo en la secuencia correcta.

# Plan maestro de implementación web — Casa Atenta / Zenit Design

## 1. Objetivo

Reconstruir casa-atenta.com como una experiencia editorial y arquitectónica de alto rendimiento. La web debe comunicar trabajo real: terrazas, techos Sol y Sombra fijos y corredizos, estructuras, acabados, iluminación y domótica. El movimiento debe explicar espacio, recorrido, luz, apertura, estructura y control; nunca funcionar como decoración aislada.

Zenit Design es el sistema rector: vista cenital, líneas de dirección, proporción, profundidad controlada, encuentros limpios, ritmo pausado y tecnología integrada a la arquitectura.

## 2. Principios de dirección

1. Material antes que efecto: madera, metal, policarbonato, luz, sombra y uniones visibles.
2. Movimiento con función: revelar recorrido, comparar estados, explicar mecanismos o jerarquizar información.
3. Profundidad moderada: parallax entre 4% y 14%; evitar desplazamientos bruscos.
4. Una escena dominante por sección.
5. Textos específicos: medidas, sistema, material, uso, ubicación, tipo de cubierta y accionamiento.
6. Accesibilidad: `prefers-reduced-motion`, contraste AA, navegación por teclado y contenido legible sin animación.
7. Rendimiento: 60 fps en escritorio, mínimo 45 fps en móvil medio, LCP menor a 2.5 s.

## 3. Arquitectura tecnológica

- Next.js 16 / React 19.
- Tailwind CSS 4 para tokens, composición responsive y utilidades.
- GSAP + ScrollTrigger para timelines, pinning, scrub, SVG y transiciones.
- Lenis para suavizado global sincronizado con GSAP.
- SplitType solo para entradas tipográficas puntuales.
- `next/image` para imágenes rasterizadas.
- WebP/AVIF para fotografía y render.
- MP4 H.264 y WebM para loops breves sin audio.
- SVG inline para mecanismos, cotas, diagramas y overlays.

## 4. Sistema global de movimiento

### Implementado

- `ZenitMotionSystem.tsx` centraliza revelados, parallax, escalado y líneas.
- Lenis se sincroniza con `ScrollTrigger` desde `ClientWrapper`.
- Respeto automático a `prefers-reduced-motion`.
- La página de inicio adopta una secuencia de scrollytelling completa.

### Convenciones

- `data-zenit-reveal="up|left|right"`: aparición editorial.
- `data-zenit-parallax="4..14"`: profundidad de imagen o plano.
- `data-zenit-scale`: reducción progresiva de escala.
- `data-zenit-line`: trazado horizontal de división.
- Cada componente debe usar `gsap.context` y revertir al desmontarse.
- Ningún selector de animación debe operar globalmente fuera del motor central.

## 5. Nueva secuencia del home

1. Hero: una obra dominante, tipografía de gran escala y geometría técnica mínima.
2. Cinematic Walk: cuatro escenas de recorrido espacial en desplazamiento horizontal.
3. Creative Lenses: vista cenital, perspectiva baja, macro de encuentro y comparación propuesta/resultado.
4. Services Gallery: terrazas, techos, iluminación, acabados y domótica con mecanismos específicos.
5. Scene Controller: demostración interactiva de iluminación y automatización.
6. Half Render / Reality: comparación de estado, propuesta y resultado.
7. Projects Showcase: obras reales y propuestas claramente identificadas.
8. Proceso: medición, propuesta, fabricación, montaje, acabado y entrega.
9. Fundadores: responsabilidades reales, criterio técnico y dirección de marca.
10. Formulario y cierre: solicitud de medidas, fotografías y distrito.

## 6. Sustitución total de material visual

### Eliminar o reemplazar

- Vegetación genérica de render.
- Interiores que no corresponden a servicios actuales.
- Imágenes duplicadas entre hero, servicios y proyectos.
- Renders con luces LED exageradas o atmósfera de catálogo.
- Mockups de domótica sin relación con una instalación posible.
- Fotografías o renders presentados como obra terminada cuando son propuestas.
- Geometrías SVG abstractas sin información técnica.

### Biblioteca visual requerida

#### A. Obras reales

- Estado inicial.
- Medición y replanteo.
- Corte y preparación.
- Estructura levantada.
- Detalle de unión.
- Cubierta colocada.
- Iluminación integrada.
- Resultado diurno.
- Resultado al final de la tarde.

#### B. Renders de propuesta

- Vista general 16:9.
- Vista cenital 4:3.
- Perspectiva baja 4:5.
- Macro de estructura 4:5.
- Comparación antes/propuesta con cámara coincidente.

#### C. Motion graphics

- Techo corredizo por polea.
- Techo corredizo con gancho.
- Techo corredizo motorizado.
- Lamas orientables como solución especial.
- Orientación solar y proyección de sombra.
- Distribución de puntos de luz.
- Flujo de control domótico y WhatsApp.

## 7. Especificación de assets

- Hero desktop: 2400 × 1350, AVIF/WebP, máximo 380 KB.
- Hero móvil: 1080 × 1440, AVIF/WebP, máximo 240 KB.
- Proyecto horizontal: 1920 × 1080, máximo 300 KB.
- Tarjeta vertical: 1200 × 1500, máximo 220 KB.
- Detalle: 1200 × 1200, máximo 180 KB.
- Loop ambiental: 6–10 s, 1080p, 24 fps, máximo 3.5 MB.
- SVG técnico: viewBox normalizado y sin filtros pesados.

Nomenclatura: `tipo-proyecto-distrito-vista-estado-v01.ext`.

Ejemplo: `techo-corredizo-la-victoria-perspectiva-resultado-v01.avif`.

## 8. Fases de desarrollo

### Fase 0 — Auditoría y estabilización

- Inventario de rutas, componentes y assets.
- Identificación de contenido falso, duplicado o genérico.
- Build, lint y revisión de hidratación.
- Presupuesto inicial de rendimiento.

Criterio de salida: sitio compila sin errores y existe inventario completo.

### Fase 1 — Núcleo Zenit

- Motor global GSAP/Lenis.
- Tokens de movimiento, profundidad y easing.
- Sistema de secciones, contenedores y overlays técnicos.
- Reducción de movimiento y responsive.

Criterio de salida: comportamiento consistente en todas las rutas.

### Fase 2 — Home cinematográfico

- Reconstrucción de secuencia.
- Hero con asset propio.
- Horizontal scroll controlado.
- Galería de servicios y controlador de escenas.
- Comparadores y proyectos.

Criterio de salida: home completo sin imágenes genéricas.

### Fase 3 — Servicios

- Página individual para cada servicio.
- Diagramas de mecanismos reales.
- Alcance, materiales, variantes y límites técnicos.
- CTA contextual con solicitud de foto y medidas.

Criterio de salida: cada servicio explica una solución verificable.

### Fase 4 — Proyectos y casos

- Separación visible entre obra ejecutada, obra en proceso y propuesta.
- Ficha con ubicación general, área, sistema, materiales, duración y alcance.
- Secuencia antes/proceso/resultado.

Criterio de salida: ningún render se presenta como fotografía real.

### Fase 5 — Domótica

- Simulador de escenas basado en casos reales.
- Explicación de control por WhatsApp.
- Compatibilidad, red local, seguridad y escalabilidad.
- Motion graphics de flujo, no interfaces ficticias.

### Fase 6 — Conversión y SEO

- Formularios por servicio.
- Eventos analíticos para WhatsApp, formularios y proyectos.
- Schema LocalBusiness, Service, FAQ y Project.
- Metadatos, Open Graph y páginas por intención local.

### Fase 7 — QA y lanzamiento

- Chrome, Safari, Firefox y Edge.
- iOS y Android.
- Lighthouse y Web Vitals.
- Revisión de teclado, lector de pantalla y reducción de movimiento.
- Prueba de enlaces, formularios y eventos.

## 9. Backlog prioritario

### P0

- Sustituir hero por material propio.
- Eliminar frases genéricas del archivo `src/data/site.ts`.
- Corregir todos los rótulos de propuesta/obra real.
- Migrar imágenes a `next/image`.
- Ejecutar build y lint en CI.

### P1

- Rediseñar Services Gallery con diagramas específicos.
- Rehacer Scene Controller sin métricas ficticias.
- Crear fichas de proyecto.
- Implementar transiciones de rutas más ligeras.

### P2

- Videos ambientales.
- Shader o WebGL muy limitado para refracción de policarbonato, solo si cumple presupuesto.
- Configurador de cubiertas y accionamiento.

## 10. Métricas de aceptación

- LCP < 2.5 s.
- CLS < 0.1.
- INP < 200 ms.
- JS inicial por ruta dentro del presupuesto acordado.
- Ningún loop infinito fuera del viewport.
- Animaciones desactivables.
- Cero claims o cifras no verificables.
- Cero imágenes genéricas en hero, proyectos y servicios principales.
- Cada CTA solicita una acción concreta: foto, medidas, distrito o evaluación.

## 11. Gobernanza

Toda imagen nueva debe registrarse con origen, estado legal, uso, ruta y versión. Todo nuevo efecto debe justificar qué información comunica. Toda sección debe seguir funcionando sin JavaScript y con reducción de movimiento.

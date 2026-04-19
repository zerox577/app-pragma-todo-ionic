# Changelog

## v1.0.2

Fecha: 2026-04-19

### Nuevas funcionalidades

- Se integró Firebase Remote Config para controlar de forma dinámica la visibilidad de la sección `Categorias`.
- Se agregó `pull-to-refresh` en `Home` para refrescar Remote Config y aplicar cambios del feature flag en caliente.
- Se reemplazó el flujo de creación de tareas por un `ion-modal` propio para mejorar la estabilidad en APK.

### Mejoras de interfaz y móvil

- Se corrigió la interacción del botón `Nueva tarea` en Android.
- Se ajustaron safe areas y espacios visuales en el modal de `Categorias` para evitar solapamientos con la barra del sistema.
- Se regeneraron los íconos nativos de Android e iOS a partir de `resources/icon.png`.

### Rendimiento

- Se aplicó `ChangeDetectionStrategy.OnPush` en componentes principales para reducir trabajo de render.
- Se usó `@defer` para cargar `Completadas` y `Categorias` bajo demanda y mejorar la carga inicial.
- `TodayComponent` ahora precalcula datos derivados para la vista y evita búsquedas repetidas por tarea.
- `TodoStorageService` optimiza el recálculo de conteos y reduce trabajo redundante al persistir en `localStorage`.

### Preparación nativa

- Se agregó la plataforma `android` y quedó lista para generar APK.
- Se agregó la plataforma `ios` y se dejaron preparados los assets nativos para Xcode.
- Se añadió `@capacitor/assets` para generar iconos y splash screens desde el recurso maestro.

### Notas técnicas

- `npm run lint`: OK
- `npm run build`: OK
- `npm audit --omit=dev`: 0 vulnerabilidades de producción
- Las vulnerabilidades reportadas por `npm audit` corresponden a dependencias de desarrollo transitorias

### Siguientes pasos sugeridos

- Generar APK `release` firmado para Android.
- Abrir el proyecto iOS en macOS con Xcode para pruebas o generación de `.ipa`.
- Crear un release en GitHub usando este mismo contenido como base para las release notes.

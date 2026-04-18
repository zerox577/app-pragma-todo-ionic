# app-pragma-todo-ionic

Primera version de una aplicacion To-Do List construida con Ionic, Angular standalone, SCSS y Capacitor.

## Descripcion

Esta version inicial incluye una pantalla `Home` como contenedor principal y una carpeta `shared` con dos componentes standalone:

- `header`: muestra el titulo `Tareas`.
- `footer`: muestra la navegacion inferior con las secciones `Hoy`, `Completadas` y `Categorias`.

La comunicacion entre `Home` y `Footer` se maneja por estado local tipado para cambiar la seccion activa sin crear paginas adicionales.

## Stack

- Ionic 8
- Angular 20 standalone
- SCSS
- Capacitor 8
- TypeScript estricto

## Requisitos previos

- Node.js 20 LTS recomendado
- npm
- Ionic CLI opcional para flujo de desarrollo

## Instalacion

1. Clonar el repositorio.
2. Entrar en la carpeta del proyecto.
3. Instalar dependencias.

```bash
npm install
```

## Levantar el proyecto

```bash
npm start
```

La aplicacion queda disponible en el servidor de desarrollo de Angular.

## Scripts disponibles

```bash
npm start
npm run build
npm run lint
npm test -- --watch=false --browsers=ChromeHeadless
```

## Estructura base

```text
src/
  app/
    home/
    shared/
      header/
      footer/
  theme/
```

## Alcance de la primera version

- Pantalla `Home` como padre.
- `Header` y `Footer` como componentes standalone reutilizables.
- Footer con 3 tabs:
  - `Hoy`
  - `Completadas`
  - `Categorias`
- Cambio de contenido central segun el tab seleccionado.
- Estilos base alineados con `DESIGN.md`.
- Tipado explicito en variables y funciones principales.

## Notas

- El proyecto compila con `npm run build`.
- El lint pasa con `npm run lint`.
- Las pruebas unitarias base pasan con Chrome Headless.

## Publicacion inicial con Git

Ejemplo de flujo para crear el repositorio y subir esta primera version:

```bash
git init -b main
git add .
git commit -m "feat: primera version de app pragma todo ionic"
git remote add origin <URL_DEL_REPOSITORIO>
git push -u origin main
```

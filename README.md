# app-pragma-todo-ionic

Aplicacion To-Do List construida con Ionic, Angular standalone, SCSS y Capacitor.

## Descripcion

La aplicacion usa una sola pantalla principal `Home` y cambia su contenido mediante tabs inferiores:

- `header`: muestra el titulo `Tareas`.
- `footer`: muestra la navegacion inferior con las secciones `Hoy`, `Completadas` y `Categorias`.
- `today`: muestra tareas pendientes, permite crear, filtrar, completar y eliminar.
- `completed`: muestra las tareas terminadas.
- `categories`: permite crear, editar y eliminar categorias.

El estado de la aplicacion se persiste en `localStorage` a traves de un servicio compartido.

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
    services/
      todo-storage.service.ts
    home/
      today/
      completed/
      categories/
    shared/
      header/
      footer/
  theme/
```

## Arquitectura

### Home

`Home` es el componente padre. Su responsabilidad es:

- Mantener el tab activo en `activeTab`.
- Renderizar `Header`.
- Renderizar el componente hijo correcto segun el tab:
  - `TodayComponent`
  - `CompletedComponent`
  - `CategoriesComponent`
- Recibir eventos del `Footer`.

### Shared

#### HeaderComponent

Responsabilidad:

- Renderizar el encabezado superior.
- Recibir el titulo mediante `@Input()`.

Funcion principal:

- `title`: valor recibido desde el padre para mostrar el encabezado.

#### FooterComponent

Responsabilidad:

- Mostrar la navegacion inferior.
- Informar al padre cuando el usuario cambia de tab.

Funciones y propiedades principales:

- `activeTab`: recibe desde `Home` el tab activo.
- `tabs`: arreglo tipado con los tabs disponibles.
- `selectTab(tab)`: emite el cambio al componente padre mediante `tabChange`.

### TodayComponent

Responsabilidad:

- Mostrar las tareas pendientes.
- Filtrar por categoria.
- Crear nuevas tareas.
- Marcar tareas como completadas.
- Eliminar tareas.

Funciones principales:

- `selectFilter(filterId)`: cambia el filtro activo.
- `openCreateTaskAlert()`: abre el flujo de alta de tareas con `ion-alert`.
- `toggleTaskCompletion(taskId, event)`: marca o desmarca una tarea.
- `deleteTask(taskId)`: elimina una tarea.
- `getPendingTaskLabel(taskCount)`: devuelve el texto del contador.
- `getCategoryName(categoryId)`: resuelve el nombre de la categoria de una tarea.
- `getCategoryChipClass(categoryId)`: devuelve la clase visual del chip de categoria.

Estado importante:

- `selectedFilterId`: filtro actual.
- `visibleTasks`: tareas pendientes visibles segun el filtro.
- `pendingTaskCount`: contador reactivo de tareas pendientes.

### CompletedComponent

Responsabilidad:

- Mostrar las tareas ya completadas.
- Permitir limpiar la lista de completadas.

Funciones principales:

- `clearCompletedTasks()`: elimina del almacenamiento las tareas completadas.
- `getCompletedTaskLabel(taskCount)`: genera el texto del resumen.

Estado importante:

- `completedTasks`: tareas marcadas como completadas.

### CategoriesComponent

Responsabilidad:

- Mostrar categorias registradas.
- Crear nuevas categorias.
- Editar categorias existentes.
- Eliminar categorias.

Funciones principales:

- `openCreateCategoryModal()`: abre el modal para nueva categoria.
- `openEditCategoryModal(category)`: abre el modal precargando datos.
- `closeCreateCategoryModal()`: cierra el modal y limpia el formulario.
- `selectColor(color)`: selecciona el color de la categoria.
- `selectIcon(icon)`: selecciona el icono de la categoria.
- `saveCategory()`: crea o actualiza una categoria.
- `deleteCategory(categoryId)`: elimina una categoria.
- `getCategoryTaskLabel(taskCount)`: devuelve el resumen de tareas activas.

Estado importante:

- `isCreateCategoryModalOpen`: controla el modal.
- `editingCategoryId`: indica si se esta editando una categoria.
- `categoryName`: nombre actual del formulario.
- `selectedColor`: color seleccionado.
- `selectedIcon`: icono seleccionado.

### TodoStorageService

Responsabilidad:

- Centralizar el estado local de categorias y tareas.
- Persistir la informacion en `localStorage`.
- Exponer estado reactivo con `signal()`.

Modelos principales:

- `CategoryItem`: categoria persistida.
- `CategoryDraft`: datos para crear o editar categoria.
- `TaskItem`: tarea persistida.
- `TaskDraft`: datos para crear una tarea.

Estado expuesto:

- `categories`: signal con el listado de categorias.
- `tasks`: signal con el listado de tareas.

Funciones de categorias:

- `createCategory(draft)`: crea una categoria.
- `updateCategory(categoryId, draft)`: actualiza una categoria.
- `deleteCategory(categoryId)`: elimina una categoria y desasocia tareas relacionadas.

Funciones de tareas:

- `createTask(draft)`: crea una tarea pendiente.
- `updateTaskCompletion(taskId, completed)`: cambia el estado de completado.
- `deleteTask(taskId)`: elimina una tarea.
- `clearCompletedTasks()`: borra todas las tareas completadas.

Funciones internas:

- `loadState()`: recupera el estado guardado del navegador.
- `createDefaultState()`: inicializa datos por defecto.
- `withTaskCounts(categories, tasks)`: recalcula cuantas tareas activas tiene cada categoria.
- `persist()`: guarda el estado completo en `localStorage`.
- `generateId(prefix)`: genera ids unicos para categorias o tareas.

## Comunicacion entre componentes

### Home y Footer

Flujo:

1. `Home` define `activeTab`.
2. `Home` pasa `activeTab` al `Footer`.
3. El usuario toca un tab.
4. `Footer` ejecuta `selectTab(tab)`.
5. `Footer` emite `tabChange`.
6. `Home` recibe el evento en `onTabChange(tab)` y actualiza `activeTab`.
7. Angular renderiza el hijo correspondiente.

### Home y secciones hijas

Flujo:

- `Home` no administra tareas ni categorias directamente.
- Cada seccion hija encapsula su propia UI.
- `Today`, `Completed` y `Categories` comparten el estado a traves de `TodoStorageService`.

### Today, Completed y Categories con el servicio

Flujo:

1. `Categories` crea o edita categorias en el servicio.
2. `Today` lee esas categorias para:
   - filtrar tareas
   - asociar categoria al crear una tarea
3. `Today` crea tareas en el servicio.
4. Cuando una tarea se marca como completada, `Today` actualiza el estado.
5. `Completed` reacciona a ese cambio y muestra la tarea terminada.
6. El servicio recalcula automaticamente el conteo de tareas activas por categoria.

## Remote Config reactivo

La aplicacion usa `RemoteConfigService` para inicializar Firebase Remote Config, refrescarlo manualmente y exponer el flag `fireCategory` de forma reactiva.

Flujo actual:

1. `main.ts` ejecuta `initialize()` al arrancar la app.
2. `RemoteConfigService` hace `fetchAndActivate()` y sincroniza el valor del flag en una `signal`.
3. `Home` ejecuta `refresh()` cuando el usuario hace pull-to-refresh.
4. `Footer` consume `fireCategoryEnabled` y recalcula `tabs` con `computed`.
5. Si el flag cambia, Angular vuelve a evaluar la UI y muestra u oculta `Categorias` sin recargar la pantalla.

### Que significa que un componente sea reactivo con `signal` y `computed`

- `signal()` guarda estado reactivo. Cuando su valor cambia, Angular sabe que hay que actualizar los consumidores de ese estado.
- `computed()` crea un valor derivado. No guarda estado independiente: recalcula automaticamente su resultado a partir de una o varias `signals`.
- Un componente reactivo no necesita llamar manualmente a funciones para repintar la vista. La template se actualiza sola cuando cambia la `signal` que esta leyendo.
- En este proyecto, `fireCategoryEnabled` es un `computed` derivado del mapa interno de flags y `tabs` en `FooterComponent` es otro `computed` que depende de ese flag.
- El beneficio practico es que, despues de `refresh()`, la UI refleja el nuevo Remote Config inmediatamente y con menos logica imperativa.

## Flujo funcional actual

### Categorias

- Crear categoria desde modal.
- Editar categoria desde la lista.
- Eliminar categoria.
- Persistencia en `localStorage`.

### Hoy

- Crear tarea desde `ion-alert`.
- Asociar categoria al momento de crear.
- Filtrar tareas por categoria.
- Marcar tareas como completadas.
- Eliminar tareas.

### Completadas

- Visualizar tareas finalizadas.
- Limpiar lista de completadas.

## Persistencia local

La aplicacion guarda su estado en `localStorage` usando la clave:

```text
app-pragma-todo-ionic-storage
```

Se persisten:

- categorias
- tareas

## Convenciones del proyecto

- Angular standalone para paginas y componentes.
- SCSS por componente.
- Tipado explicito en propiedades, funciones y modelos.
- `signal()` para estado reactivo simple.
- Componentes hijos por seccion para mantener `Home` limpio.

## Notas

- El proyecto compila con `npm run build`.
- El lint pasa con `npm run lint`.
- Las pruebas unitarias base pasan con Chrome Headless.
- Existen advertencias de presupuesto de estilos en algunos componentes, pero no bloquean el build.

## Publicacion inicial con Git

Ejemplo de flujo para crear el repositorio y subir esta primera version:

```bash
git init -b main
git add .
git commit -m "feat: primera version de app pragma todo ionic"
git remote add origin <URL_DEL_REPOSITORIO>
git push -u origin main
```

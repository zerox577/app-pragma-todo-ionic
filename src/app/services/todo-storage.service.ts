import { Injectable, signal, WritableSignal } from '@angular/core';

export type CategoryColor =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'slate';

export type CategoryIcon =
  | 'briefcase'
  | 'person'
  | 'warning'
  | 'bulb'
  | 'home'
  | 'school'
  | 'heart'
  | 'airplane'
  | 'expand'
  | 'cart';

export interface CategoryItem {
  readonly id: string;
  readonly name: string;
  readonly color: CategoryColor;
  readonly icon: CategoryIcon;
  readonly taskCount: number;
}

export interface CategoryDraft {
  readonly name: string;
  readonly color: CategoryColor;
  readonly icon: CategoryIcon;
}

export interface TaskItem {
  readonly id: string;
  readonly title: string;
  readonly categoryId: string | null;
  readonly completed: boolean;
  readonly createdAt: string;
}

export interface TaskDraft {
  readonly title: string;
  readonly categoryId: string | null;
}

interface TodoStorageState {
  readonly categories: CategoryItem[];
  readonly tasks: TaskItem[];
}

const STORAGE_KEY: string = 'app-pragma-todo-ionic-storage';

const DEFAULT_CATEGORIES: readonly CategoryItem[] = [
  {
    id: 'category-work',
    name: 'Trabajo',
    color: 'blue',
    icon: 'briefcase',
    taskCount: 12,
  },
  {
    id: 'category-personal',
    name: 'Personal',
    color: 'purple',
    icon: 'person',
    taskCount: 5,
  },
  {
    id: 'category-urgent',
    name: 'Urgente',
    color: 'red',
    icon: 'warning',
    taskCount: 3,
  },
  {
    id: 'category-ideas',
    name: 'Ideas',
    color: 'slate',
    icon: 'bulb',
    taskCount: 0,
  },
];

const DEFAULT_TASKS: readonly TaskItem[] = [
  {
    id: 'task-design-review',
    title: 'Revision de diseño',
    categoryId: 'category-work',
    completed: false,
    createdAt: '2026-04-18T08:00:00.000Z',
  },
  {
    id: 'task-team-call',
    title: 'Llamada con el equipo',
    categoryId: 'category-work',
    completed: false,
    createdAt: '2026-04-18T08:30:00.000Z',
  },
  {
    id: 'task-docs-update',
    title: 'Actualizar documentacion',
    categoryId: 'category-personal',
    completed: false,
    createdAt: '2026-04-18T09:00:00.000Z',
  },
  {
    id: 'task-report',
    title: 'Enviar reporte semanal',
    categoryId: 'category-work',
    completed: true,
    createdAt: '2026-04-17T18:00:00.000Z',
  },
  {
    id: 'task-setup',
    title: 'Configurar entorno de desarrollo',
    categoryId: 'category-ideas',
    completed: true,
    createdAt: '2026-04-17T19:00:00.000Z',
  },
];

@Injectable({
  providedIn: 'root',
})
export class TodoStorageService {
  // Carga el estado persistido antes de exponer las signals publicas.
  private readonly initialState: TodoStorageState = this.loadState();

  // Fuente de verdad reactiva para categorias y tareas en toda la app.
  public readonly categories: WritableSignal<CategoryItem[]> = signal<
    CategoryItem[]
  >(this.initialState.categories);
  public readonly tasks: WritableSignal<TaskItem[]> = signal<TaskItem[]>(
    this.initialState.tasks,
  );

  public createCategory(draft: CategoryDraft): void {
    // Crea una categoria nueva y recalcula sus contadores antes de persistir.
    const category: CategoryItem = {
      id: this.generateId(),
      name: draft.name.trim(),
      color: draft.color,
      icon: draft.icon,
      taskCount: 0,
    };

    const nextTasks: TaskItem[] = this.tasks();
    const nextCategories: CategoryItem[] = this.withTaskCounts(
      [...this.categories(), category],
      nextTasks,
    );

    this.categories.set(nextCategories);
    this.persist(nextCategories, nextTasks);
  }

  public updateCategory(categoryId: string, draft: CategoryDraft): void {
    // Actualiza solo la categoria editada y conserva el resto sin cambios.
    const nextTasks: TaskItem[] = this.tasks();
    const nextCategories: CategoryItem[] = this.withTaskCounts(
      this.categories().map(
      (item: CategoryItem): CategoryItem =>
        item.id === categoryId
          ? {
              ...item,
              name: draft.name.trim(),
              color: draft.color,
              icon: draft.icon,
            }
          : item,
      ),
      nextTasks,
    );

    this.categories.set(nextCategories);
    this.persist(nextCategories, nextTasks);
  }

  public deleteCategory(categoryId: string): void {
    // Al borrar una categoria, las tareas asociadas quedan sin categoria.
    const nextTasks: TaskItem[] = this.tasks().map(
      (task: TaskItem): TaskItem =>
        task.categoryId === categoryId ? { ...task, categoryId: null } : task,
    );
    const nextCategories: CategoryItem[] = this.categories().filter(
      (item: CategoryItem): boolean => item.id !== categoryId,
    );

    this.tasks.set(nextTasks);
    this.categories.set(this.withTaskCounts(nextCategories, nextTasks));
    this.persist(this.categories(), nextTasks);
  }

  public createTask(draft: TaskDraft): void {
    // Toda tarea nueva nace pendiente y con fecha de creacion actual.
    const task: TaskItem = {
      id: this.generateId('task'),
      title: draft.title.trim(),
      categoryId: draft.categoryId,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const nextTasks: TaskItem[] = [...this.tasks(), task];
    const nextCategories: CategoryItem[] = this.withTaskCounts(
      this.categories(),
      nextTasks,
    );

    this.tasks.set(nextTasks);
    this.categories.set(nextCategories);
    this.persist(nextCategories, nextTasks);
  }

  public updateTaskCompletion(taskId: string, completed: boolean): void {
    // Cambia el estado de una tarea y refresca el conteo por categoria.
    const nextTasks: TaskItem[] = this.tasks().map(
      (task: TaskItem): TaskItem =>
        task.id === taskId ? { ...task, completed } : task,
    );
    const nextCategories: CategoryItem[] = this.withTaskCounts(
      this.categories(),
      nextTasks,
    );

    this.tasks.set(nextTasks);
    this.categories.set(nextCategories);
    this.persist(nextCategories, nextTasks);
  }

  public deleteTask(taskId: string): void {
    const nextTasks: TaskItem[] = this.tasks().filter(
      (task: TaskItem): boolean => task.id !== taskId,
    );
    const nextCategories: CategoryItem[] = this.withTaskCounts(
      this.categories(),
      nextTasks,
    );

    this.tasks.set(nextTasks);
    this.categories.set(nextCategories);
    this.persist(nextCategories, nextTasks);
  }

  public clearCompletedTasks(): void {
    // Elimina en bloque todas las tareas que ya fueron completadas.
    const nextTasks: TaskItem[] = this.tasks().filter(
      (task: TaskItem): boolean => !task.completed,
    );
    const nextCategories: CategoryItem[] = this.withTaskCounts(
      this.categories(),
      nextTasks,
    );

    this.tasks.set(nextTasks);
    this.categories.set(nextCategories);
    this.persist(nextCategories, nextTasks);
  }

  private loadState(): TodoStorageState {
    const fallbackState: TodoStorageState = this.createDefaultState();

    if (typeof localStorage === 'undefined') {
      return fallbackState;
    }

    const rawState: string | null = localStorage.getItem(STORAGE_KEY);
    if (rawState === null) {
      return fallbackState;
    }

    try {
      // Recupera el estado guardado y recompone los contadores derivados.
      const parsedState: Partial<TodoStorageState> = JSON.parse(
        rawState,
      ) as Partial<TodoStorageState>;

      const categories: CategoryItem[] = Array.isArray(parsedState.categories)
        ? parsedState.categories
        : fallbackState.categories;
      const tasks: TaskItem[] = Array.isArray(parsedState.tasks)
        ? parsedState.tasks
        : fallbackState.tasks;

      return {
        categories: this.withTaskCounts(categories, tasks),
        tasks,
      };
    } catch {
      return fallbackState;
    }
  }

  private createDefaultState(): TodoStorageState {
    return {
      categories: this.withTaskCounts(
        [...DEFAULT_CATEGORIES],
        [...DEFAULT_TASKS],
      ),
      tasks: [...DEFAULT_TASKS],
    };
  }

  private withTaskCounts(
    categories: CategoryItem[],
    tasks: TaskItem[],
  ): CategoryItem[] {
    // Calcula cuantas tareas activas tiene cada categoria para la UI.
    const activeTaskCounts: Map<string, number> = this.getActiveTaskCounts(tasks);

    return categories.map(
      (item: CategoryItem): CategoryItem => ({
        ...item,
        taskCount: activeTaskCounts.get(item.id) ?? 0,
      }),
    );
  }

  private persist(
    categories: CategoryItem[] = this.categories(),
    tasks: TaskItem[] = this.tasks(),
  ): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    // Guarda siempre una version consistente del estado completo.
    const state: TodoStorageState = {
      categories,
      tasks,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  private getActiveTaskCounts(tasks: TaskItem[]): Map<string, number> {
    const activeTaskCounts: Map<string, number> = new Map<string, number>();

    for (const task of tasks) {
      if (task.completed || task.categoryId === null) {
        continue;
      }

      activeTaskCounts.set(
        task.categoryId,
        (activeTaskCounts.get(task.categoryId) ?? 0) + 1,
      );
    }

    return activeTaskCounts;
  }

  private generateId(prefix: 'category' | 'task' = 'category'): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return `${prefix}-${crypto.randomUUID()}`;
    }

    // Fallback para entornos donde randomUUID no esta disponible.
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }
}

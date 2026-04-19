import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonContent,
  IonIcon,
  IonInput,
  IonModal,
  IonRippleEffect,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, checkmarkCircle, trashOutline } from 'ionicons/icons';
import { CategoryItem, TaskItem, TodoStorageService } from '../../services/todo-storage.service';

interface TaskCheckboxChangeEvent {
  readonly detail: {
    readonly checked: boolean;
  };
}

interface VisibleTaskCard {
  readonly id: string;
  readonly title: string;
  readonly completed: boolean;
  readonly categoryLabel: string;
  readonly categoryChipClass: string;
}

type TodayFilterId = 'all' | string;

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    IonCard,
    IonCardContent,
    IonCheckbox,
    IonContent,
    IonIcon,
    IonInput,
    IonModal,
    IonRippleEffect,
  ],
})
export class TodayComponent {
  private readonly todoStorageService: TodoStorageService =
    inject(TodoStorageService);

  // Reutiliza las categorias del servicio para filtros y alta de tareas.
  public readonly categories: WritableSignal<CategoryItem[]> =
    this.todoStorageService.categories;
  // Guarda el filtro actual de la lista de pendientes.
  public readonly selectedFilterId: WritableSignal<TodayFilterId> =
    signal<TodayFilterId>('all');
  // Permite resolver categoria y color con busqueda O(1) durante el render.
  private readonly categoryMap: Signal<Map<string, CategoryItem>> = computed(
    (): Map<string, CategoryItem> =>
      new Map(
        this.categories().map(
          (category: CategoryItem): [string, CategoryItem] => [category.id, category],
        ),
      ),
  );
  // Mantiene una sola lista base de tareas pendientes para derivar el resto del estado.
  private readonly pendingTasks: Signal<TaskItem[]> = computed((): TaskItem[] =>
    this.todoStorageService
      .tasks()
      .filter((task: TaskItem): boolean => !task.completed),
  );
  // Deriva las tareas visibles segun el filtro activo y precalcula datos para la template.
  public readonly visibleTaskCards: Signal<VisibleTaskCard[]> = computed(
    (): VisibleTaskCard[] => {
    const activeFilterId: TodayFilterId = this.selectedFilterId();
      const categoriesById: Map<string, CategoryItem> = this.categoryMap();

      return this.pendingTasks()
        .filter(
          (task: TaskItem): boolean =>
            activeFilterId === 'all' || task.categoryId === activeFilterId,
        )
        .map((task: TaskItem): VisibleTaskCard => {
          const category: CategoryItem | undefined =
            task.categoryId === null
              ? undefined
              : categoriesById.get(task.categoryId);

          return {
            id: task.id,
            title: task.title,
            completed: task.completed,
            categoryLabel: category?.name ?? 'Sin categoria',
            categoryChipClass:
              category === undefined
                ? 'today-chip today-chip--slate'
                : `today-chip today-chip--${category.color}`,
          };
        });
    },
  );
  // Resume cuantas tareas siguen pendientes para el encabezado de la vista.
  public readonly pendingTaskCount: Signal<number> = computed(
    (): number => this.pendingTasks().length,
  );
  // Estado local del modal para crear tareas en Android/iOS sin depender de alerts nativos.
  public isCreateTaskModalOpen: boolean = false;
  public taskTitle: string = '';
  public selectedTaskCategoryId: string | null = null;

  public constructor() {
    addIcons({ arrowBack, checkmarkCircle, trashOutline });
  }

  public selectFilter(filterId: TodayFilterId): void {
    this.selectedFilterId.set(filterId);
  }

  public openCreateTaskAlert(): void {
    // Conserva el nombre del metodo, pero ahora abre un modal propio mas confiable en APK.
    this.resetTaskForm();
    this.isCreateTaskModalOpen = true;
  }

  public closeCreateTaskModal(): void {
    this.isCreateTaskModalOpen = false;
    this.resetTaskForm();
  }

  public selectTaskCategory(categoryId: string | null): void {
    this.selectedTaskCategoryId = categoryId;
  }

  public saveTask(): void {
    const trimmedTitle: string = this.taskTitle.trim();
    if (trimmedTitle.length === 0) {
      return;
    }

    this.todoStorageService.createTask({
      title: trimmedTitle,
      categoryId: this.selectedTaskCategoryId,
    });

    this.closeCreateTaskModal();
  }

  public toggleTaskCompletion(
    taskId: string,
    event: TaskCheckboxChangeEvent,
  ): void {
    // Delega el cambio al servicio para mantener una sola fuente de verdad.
    this.todoStorageService.updateTaskCompletion(taskId, event.detail.checked);
  }

  public deleteTask(taskId: string): void {
    this.todoStorageService.deleteTask(taskId);
  }

  public getPendingTaskLabel(taskCount: number): string {
    return taskCount === 1 ? '1 tarea pendiente' : `${taskCount} tareas pendientes`;
  }

  private resetTaskForm(): void {
    this.taskTitle = '';
    this.selectedTaskCategoryId = this.categories()[0]?.id ?? null;
  }
}

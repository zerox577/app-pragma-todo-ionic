import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
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

type TodayFilterId = 'all' | string;

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.scss'],
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
  // Deriva las tareas visibles segun el filtro activo y el estado de completado.
  public readonly visibleTasks: Signal<TaskItem[]> = computed((): TaskItem[] => {
    const activeFilterId: TodayFilterId = this.selectedFilterId();

    return this.todoStorageService
      .tasks()
      .filter(
        (task: TaskItem): boolean =>
          !task.completed &&
          (activeFilterId === 'all' || task.categoryId === activeFilterId),
      );
  });
  // Resume cuantas tareas siguen pendientes para el encabezado de la vista.
  public readonly pendingTaskCount: Signal<number> = computed(
    (): number =>
      this.todoStorageService
        .tasks()
        .filter((task: TaskItem): boolean => !task.completed).length,
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

  public getCategoryName(categoryId: string | null): string {
    const category: CategoryItem | undefined = this.categories().find(
      (item: CategoryItem): boolean => item.id === categoryId,
    );

    return category?.name ?? 'Sin categoria';
  }

  public getCategoryChipClass(categoryId: string | null): string {
    const category: CategoryItem | undefined = this.categories().find(
      (item: CategoryItem): boolean => item.id === categoryId,
    );

    // Si la tarea no tiene categoria, usa el chip neutro por defecto.
    return category === undefined
      ? 'today-chip today-chip--slate'
      : `today-chip today-chip--${category.color}`;
  }

  private resetTaskForm(): void {
    this.taskTitle = '';
    this.selectedTaskCategoryId = this.categories()[0]?.id ?? null;
  }
}

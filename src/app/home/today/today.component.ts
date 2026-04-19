import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonIcon,
  IonRippleEffect,
} from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
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
  imports: [IonCard, IonCardContent, IonCheckbox, IonIcon, IonRippleEffect],
})
export class TodayComponent {
  private readonly alertController: AlertController = inject(AlertController);
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

  public constructor() {
    addIcons({ trashOutline });
  }

  public selectFilter(filterId: TodayFilterId): void {
    this.selectedFilterId.set(filterId);
  }

  public async openCreateTaskAlert(): Promise<void> {
    // El alta de tareas se divide en dos pasos: titulo y categoria.
    let taskTitle: string = '';

    const titleAlert = await this.alertController.create({
      cssClass: 'today-task-alert today-task-alert--text',
      header: 'Nueva tarea',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Nombre de la tarea',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Siguiente',
          role: 'confirm',
          handler: (value: { title?: string }): boolean => {
            taskTitle = value.title?.trim() ?? '';
            return taskTitle.length > 0;
          },
        },
      ],
    });

    await titleAlert.present();
    const titleResult = await titleAlert.onDidDismiss();
    if (titleResult.role !== 'confirm') {
      return;
    }
    if (taskTitle.length === 0) {
      return;
    }

    const availableCategories: CategoryItem[] = this.categories();
    if (availableCategories.length === 0) {
      this.todoStorageService.createTask({
        title: taskTitle,
        categoryId: null,
      });
      return;
    }

    let selectedCategoryId: string | null = availableCategories[0]?.id ?? null;

    const categoryAlert = await this.alertController.create({
      cssClass: 'today-task-alert today-task-alert--category',
      header: 'Categoria',
      inputs: availableCategories.map((category: CategoryItem, index: number) => ({
        type: 'radio',
        label: category.name,
        value: category.id,
        checked: index === 0,
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          role: 'confirm',
          handler: (value: string): boolean => {
            selectedCategoryId = value;
            return true;
          },
        },
      ],
    });

    await categoryAlert.present();
    const categoryResult = await categoryAlert.onDidDismiss();
    if (categoryResult.role !== 'confirm') {
      return;
    }

    this.todoStorageService.createTask({
      title: taskTitle,
      categoryId: selectedCategoryId,
    });
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
}

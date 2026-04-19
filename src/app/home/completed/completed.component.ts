import { Component, computed, inject, Signal } from '@angular/core';
import { IonCard, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkOutline, trashOutline } from 'ionicons/icons';
import { TaskItem, TodoStorageService } from '../../services/todo-storage.service';

@Component({
  selector: 'app-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.scss'],
  imports: [IonCard, IonCardContent, IonIcon],
})
export class CompletedComponent {
  private readonly todoStorageService: TodoStorageService =
    inject(TodoStorageService);

  // Lista reactiva de tareas terminadas para la vista de historial.
  public readonly completedTasks: Signal<TaskItem[]> = computed((): TaskItem[] =>
    this.todoStorageService
      .tasks()
      .filter((task: TaskItem): boolean => task.completed),
  );

  public constructor() {
    addIcons({ trashOutline, checkmarkOutline });
  }

  public clearCompletedTasks(): void {
    // Limpia del almacenamiento todas las tareas ya finalizadas.
    this.todoStorageService.clearCompletedTasks();
  }

  public getCompletedTaskLabel(taskCount: number): string {
    return taskCount === 1
      ? '1 tarea finalizada hoy'
      : `${taskCount} tareas finalizadas hoy`;
  }
}

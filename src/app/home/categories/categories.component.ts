import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonInput,
  IonModal,
  IonRippleEffect,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  airplane,
  arrowBack,
  briefcase,
  bulb,
  cart,
  checkmarkCircle,
  createOutline,
  expand,
  heart,
  home,
  person,
  school,
  trashOutline,
  warning,
} from 'ionicons/icons';
import {
  CategoryColor,
  CategoryDraft,
  CategoryIcon,
  CategoryItem,
  TodoStorageService,
} from '../../services/todo-storage.service';

interface CategoryColorOption {
  readonly id: CategoryColor;
  readonly label: string;
}

interface CategoryIconOption {
  readonly id: CategoryIcon;
  readonly label: string;
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  imports: [
    FormsModule,
    IonCard,
    IonCardContent,
    IonContent,
    IonIcon,
    IonInput,
    IonModal,
    IonRippleEffect,
  ],
})
export class CategoriesComponent {
  private readonly todoStorageService: TodoStorageService =
    inject(TodoStorageService);

  // Estado local del modal de alta/edicion de categorias.
  public isCreateCategoryModalOpen: boolean = false;
  public editingCategoryId: string | null = null;
  public categoryName: string = '';
  public selectedColor: CategoryColor = 'red';
  public selectedIcon: CategoryIcon = 'briefcase';

  // La lista de categorias viene del servicio y se actualiza de forma reactiva.
  public readonly categories = this.todoStorageService.categories;
  // Opciones fijas para construir la UI del selector visual.
  public readonly colorOptions: readonly CategoryColorOption[] = [
    { id: 'red', label: 'Rojo' },
    { id: 'orange', label: 'Naranja' },
    { id: 'yellow', label: 'Amarillo' },
    { id: 'green', label: 'Verde' },
    { id: 'blue', label: 'Azul' },
    { id: 'purple', label: 'Morado' },
    { id: 'pink', label: 'Rosa' },
    { id: 'slate', label: 'Gris oscuro' },
  ];
  public readonly iconOptions: readonly CategoryIconOption[] = [
    { id: 'briefcase', label: 'Portafolio' },
    { id: 'home', label: 'Casa' },
    { id: 'school', label: 'Estudio' },
    { id: 'heart', label: 'Corazon' },
    { id: 'airplane', label: 'Avion' },
    { id: 'expand', label: 'Expandir' },
    { id: 'cart', label: 'Carrito' },
  ];

  public constructor() {
    addIcons({
      airplane,
      arrowBack,
      briefcase,
      bulb,
      cart,
      checkmarkCircle,
      createOutline,
      expand,
      heart,
      home,
      person,
      school,
      trashOutline,
      warning,
    });
  }

  public openCreateCategoryModal(): void {
    // Abre el modal con el formulario limpio para crear una nueva categoria.
    this.resetCategoryForm();
    this.isCreateCategoryModalOpen = true;
  }

  public openEditCategoryModal(category: CategoryItem): void {
    // Precarga el formulario con los datos existentes para editar.
    this.editingCategoryId = category.id;
    this.categoryName = category.name;
    this.selectedColor = category.color;
    this.selectedIcon = category.icon;
    this.isCreateCategoryModalOpen = true;
  }

  public closeCreateCategoryModal(): void {
    this.isCreateCategoryModalOpen = false;
    this.resetCategoryForm();
  }

  public selectColor(color: CategoryColor): void {
    this.selectedColor = color;
  }

  public selectIcon(icon: CategoryIcon): void {
    this.selectedIcon = icon;
  }

  public saveCategory(): void {
    const trimmedName: string = this.categoryName.trim();
    if (trimmedName.length === 0) {
      return;
    }

    const draft: CategoryDraft = {
      name: trimmedName,
      color: this.selectedColor,
      icon: this.selectedIcon,
    };

    if (this.editingCategoryId === null) {
      this.todoStorageService.createCategory(draft);
    } else {
      this.todoStorageService.updateCategory(this.editingCategoryId, draft);
    }

    // Despues de guardar, cierra el modal y deja el formulario listo para otro uso.
    this.closeCreateCategoryModal();
  }

  public deleteCategory(categoryId: string): void {
    this.todoStorageService.deleteCategory(categoryId);
  }

  public getCategoryTaskLabel(taskCount: number): string {
    return taskCount === 1
      ? '1 tarea activa'
      : taskCount === 0
        ? 'Sin tareas activas'
        : `${taskCount} tareas activas`;
  }

  public get isEditingCategory(): boolean {
    return this.editingCategoryId !== null;
  }

  private resetCategoryForm(): void {
    // Restablece el estado local al modo "crear".
    this.editingCategoryId = null;
    this.categoryName = '';
    this.selectedColor = 'red';
    this.selectedIcon = 'briefcase';
  }
}

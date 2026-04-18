import { Component } from '@angular/core';
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

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  imports: [
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
  public isCreateCategoryModalOpen: boolean = false;

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
    this.isCreateCategoryModalOpen = true;
  }

  public closeCreateCategoryModal(): void {
    this.isCreateCategoryModalOpen = false;
  }
}

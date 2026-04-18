import { Component } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonIcon,
  IonRippleEffect,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.scss'],
  imports: [IonCard, IonCardContent, IonCheckbox, IonIcon, IonRippleEffect],
})
export class TodayComponent {
  public constructor() {
    addIcons({ trashOutline });
  }
}

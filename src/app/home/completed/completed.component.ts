import { Component } from '@angular/core';
import { IonCard, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.scss'],
  imports: [IonCard, IonCardContent, IonIcon],
})
export class CompletedComponent {
  public constructor() {
    addIcons({ trashOutline, checkmarkOutline });
  }
}

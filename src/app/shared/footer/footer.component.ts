import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  IonFooter,
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  checkmarkDoneOutline,
  gridOutline,
} from 'ionicons/icons';

export type HomeTab = 'hoy' | 'completadas' | 'categorias';

interface FooterTabItem {
  readonly id: HomeTab;
  readonly label: string;
  readonly icon: string;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [IonFooter, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class FooterComponent {
  @Input({ required: true }) public activeTab!: HomeTab;
  @Output() public readonly tabChange: EventEmitter<HomeTab> =
    new EventEmitter<HomeTab>();

  public readonly tabs: readonly FooterTabItem[] = [
    { id: 'hoy', label: 'Hoy', icon: 'calendar-outline' },
    {
      id: 'completadas',
      label: 'Completadas',
      icon: 'checkmark-done-outline',
    },
    { id: 'categorias', label: 'Categorias', icon: 'grid-outline' },
  ];

  public constructor() {
    addIcons({ calendarOutline, checkmarkDoneOutline, gridOutline });
  }

  public selectTab(tab: HomeTab): void {
    this.tabChange.emit(tab);
  }
}

import { Component, computed, EventEmitter, inject, Input, Output, Signal } from '@angular/core';
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
import { RemoteConfigService } from 'src/app/services/remote-config.service';

export type HomeTab = 'hoy' | 'completadas' | 'categorias';

interface FooterTabItem {
  readonly id: HomeTab;
  readonly label: string;
  readonly icon: string;
  readonly show: boolean;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [IonFooter, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class FooterComponent {
  // Tab seleccionado actualmente para resaltar la opcion activa.
  @Input({ required: true }) public activeTab!: HomeTab;
  // Notifica al componente padre cuando el usuario toca otra seccion.
  @Output() public readonly tabChange: EventEmitter<HomeTab> =
    new EventEmitter<HomeTab>();
  private readonly remoteConfigService: RemoteConfigService =
    inject(RemoteConfigService);
  // Expone el flag reactivo para construir la navegacion visible.
  public readonly fireCategoryEnabled: Signal<boolean> =
    this.remoteConfigService.fireCategoryEnabled;
  // La lista de tabs se recalcula automaticamente cuando cambia el flag.
  public readonly tabs: Signal<readonly FooterTabItem[]> = computed(
    (): readonly FooterTabItem[] => [
      { id: 'hoy', label: 'Hoy', icon: 'calendar-outline', show: true },
      {
        id: 'completadas',
        label: 'Completadas',
        icon: 'checkmark-done-outline',
        show: true,
      },
      {
        id: 'categorias',
        label: 'Categorias',
        icon: 'grid-outline',
        show: this.fireCategoryEnabled(),
      },
    ],
  );

  constructor() {
    addIcons({ calendarOutline, checkmarkDoneOutline, gridOutline });
  }

  public selectTab(tab: HomeTab): void {
    // Emite el tab pulsado para que Home cambie la seccion mostrada.
    this.tabChange.emit(tab);
  }
}

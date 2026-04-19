import { Component, Input } from '@angular/core';
import { IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonHeader, IonToolbar, IonTitle],
})
export class HeaderComponent {
  // Texto que se muestra como encabezado principal de la pantalla.
  @Input({ required: true }) public title!: string;
}

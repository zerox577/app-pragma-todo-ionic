import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { FooterComponent, HomeTab } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
import { TodayComponent } from './today/today.component';

interface HomeSection {
  readonly label: string;
  readonly greeting: string;
  readonly description: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, HeaderComponent, FooterComponent, TodayComponent],
})
export class HomePage {
  public activeTab: HomeTab = 'hoy';

  public readonly sections: Readonly<Record<HomeTab, HomeSection>> = {
    hoy: {
      label: 'Hoy',
      greeting: 'Hola tab 1',
      description: 'Aqui ves la seccion activa para las tareas del dia.',
    },
    completadas: {
      label: 'Completadas',
      greeting: 'Hola tab 2',
      description: 'Aqui ves la seccion activa para las tareas completadas.',
    },
    categorias: {
      label: 'Categorias',
      greeting: 'Hola tab 3',
      description: 'Aqui ves la seccion activa para las categorias.',
    },
  };

  public get currentSection(): HomeSection {
    return this.sections[this.activeTab];
  }

  public onTabChange(tab: HomeTab): void {
    this.activeTab = tab;
  }
}

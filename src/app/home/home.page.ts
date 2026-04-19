import { Component, inject } from '@angular/core';
import { IonContent, IonRefresherContent, RefresherCustomEvent, IonRefresher } from '@ionic/angular/standalone';
import { FooterComponent, HomeTab } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
import { CategoriesComponent } from './categories/categories.component';
import { CompletedComponent } from './completed/completed.component';
import { TodayComponent } from './today/today.component';
import { RemoteConfigService } from '../services/remote-config.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonContent,
    IonRefresherContent,
    HeaderComponent,
    FooterComponent,
    TodayComponent,
    CompletedComponent,
    CategoriesComponent,
    IonRefresher
],
})
export class HomePage {
  private readonly remoteConfigService: RemoteConfigService =
    inject(RemoteConfigService);

  // Controla que seccion principal se renderiza en el contenido de Home.
  public activeTab: HomeTab = 'hoy';

  public async handleRefresh(event: RefresherCustomEvent): Promise<void> {
    try {
      // Refresca Remote Config y deja que la UI reactiva se actualice sola.
      await this.remoteConfigService.refresh();

      if (
        this.activeTab === 'categorias' &&
        !this.remoteConfigService.fireCategoryEnabled()
      ) {
        // Si el flag se apaga mientras esta abierta la seccion, vuelve a una valida.
        this.activeTab = 'hoy';
      }
    } finally {
      event.target.complete();
    }
  }

  public onTabChange(tab: HomeTab): void {
    // Recibe el tab emitido por el footer y actualiza la vista activa.
    this.activeTab = tab;
  }
}

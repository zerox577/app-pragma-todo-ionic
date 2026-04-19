import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import {
  RemoteConfig,
  fetchAndActivate,
  getBoolean,
  getRemoteConfig,
  isSupported,
} from 'firebase/remote-config';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RemoteConfigService {
  private app: FirebaseApp | null = null;
  private remoteConfig: RemoteConfig | null = null;
  // Estado local reactivo para que la UI pueda escuchar flags sin volver a leer Firebase.
  private readonly booleanFlags: WritableSignal<Record<string, boolean>> =
    signal<Record<string, boolean>>({ fireCategory: false });

  // Valor derivado listo para consumir desde componentes o templates.
  public readonly fireCategoryEnabled: Signal<boolean> = computed(
    (): boolean => this.booleanFlags()['fireCategory'] ?? false,
  );

  public async initialize(): Promise<void> {
    // Inicializa Firebase Remote Config una sola vez al arrancar la app.
    const remoteConfig: RemoteConfig | null = await this.ensureRemoteConfig();
    if (remoteConfig === null) {
      this.syncBooleanFlags();
      return;
    }

    await fetchAndActivate(remoteConfig);
    this.syncBooleanFlags();
  }

  public async refresh(): Promise<boolean> {
    const remoteConfig: RemoteConfig | null = await this.ensureRemoteConfig();
    if (remoteConfig === null) {
      this.syncBooleanFlags();
      return false;
    }

    const minimumFetchIntervalMillis: number =
      remoteConfig.settings.minimumFetchIntervalMillis;

    remoteConfig.settings = {
      ...remoteConfig.settings,
      minimumFetchIntervalMillis: 0,
    };

    try {
      // Fuerza un fetch inmediato para validar cambios al hacer pull-to-refresh.
      const updated: boolean = await fetchAndActivate(remoteConfig);
      this.syncBooleanFlags();

      return updated;
    } finally {
      remoteConfig.settings = {
        ...remoteConfig.settings,
        minimumFetchIntervalMillis,
      };
    }
  }

  public getBooleanValue(key: string): boolean {
    // Expone una lectura simple para cualquier flag booleano ya sincronizado.
    return this.booleanFlags()[key] ?? false;
  }

  private async ensureRemoteConfig(): Promise<RemoteConfig | null> {
    if (this.remoteConfig !== null) {
      return this.remoteConfig;
    }

    // Evita inicializar Remote Config en entornos donde Firebase no lo soporta.
    const supported: boolean = await isSupported();
    if (!supported) {
      return null;
    }

    this.app = initializeApp(environment.firebase);
    this.remoteConfig = getRemoteConfig(this.app);
    // getAnalytics(this.app);

    // Configura los tiempos de fetch definidos para la app.
    this.remoteConfig.settings = {
      fetchTimeoutMillis: environment.remoteConfig.fetchTimeoutMillis,
      minimumFetchIntervalMillis:
        environment.remoteConfig.minimumFetchIntervalMillis,
    };

    return this.remoteConfig;
  }

  private syncBooleanFlags(): void {
    if (this.remoteConfig === null) {
      this.booleanFlags.set({ fireCategory: false });
      return;
    }

    // Centraliza la lectura de Firebase y empuja el nuevo estado a las signals.
    this.booleanFlags.set({
      fireCategory: getBoolean(this.remoteConfig, 'fireCategory'),
    });
  }
}

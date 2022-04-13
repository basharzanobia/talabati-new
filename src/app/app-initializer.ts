import { Injectable, Injector } from '@angular/core';
import { PlatformLocation, registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from '../shared/AppConsts';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppInitializer {
  constructor(
    private _injector: Injector,
    private _platformLocation: PlatformLocation,
    private _httpClient: HttpClient
  ) { }

  init(): () => Promise<boolean> {
    return () => {
      return new Promise<boolean>((resolve, reject) => {
        AppConsts.appBaseHref = this.getBaseHref();
        const appBaseUrl = this.getDocumentOrigin() + AppConsts.appBaseHref;
        this.getApplicationConfig(appBaseUrl, () => {
          resolve(true);
        });
      });
    };
  }

  private getBaseHref(): string {
    const baseUrl = this._platformLocation.getBaseHrefFromDOM();
    if (baseUrl) {
      return baseUrl;
    }

    return '/';
  }

  private getDocumentOrigin(): string {
    if (!document.location.origin) {
      const port = document.location.port ? ':' + document.location.port : '';
      return (
        document.location.protocol + '//' + document.location.hostname + port
      );
    }

    return document.location.origin;
  }

  private getApplicationConfig(appRootUrl: string, callback: () => void) {
    this._httpClient
      .get<any>(`${appRootUrl}assets/${environment.appConfig}`)
      .subscribe((response) => {
        AppConsts.appBaseUrl = response.appBaseUrl;
        AppConsts.remoteServiceBaseUrl = response.remoteServiceBaseUrl;
        AppConsts.localeMappings = response.localeMappings;
        AppConsts.logoAssetBaseUrl = response.logoAssetBaseUrl;

        callback();
      });
  }
}

import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AppInitializer } from './app-initializer';
import { AppConsts } from '../shared/AppConsts';
import { API_BASE_URL } from '../shared/service-proxies/service-proxies';
import { ServiceProxyModule } from '../shared/service-proxies/service-proxy.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, ServiceProxyModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APP_INITIALIZER,
      useFactory: (appInitializer: AppInitializer) => appInitializer.init(),
      deps: [AppInitializer],
      multi: true,
    },
    { provide: API_BASE_URL, useFactory: () => AppConsts.remoteServiceBaseUrl },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

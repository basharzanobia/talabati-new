import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AppInitializer } from './app-initializer';
import { AppConsts } from '../shared/AppConsts';
import { API_BASE_URL } from '../shared/service-proxies/service-proxies';
import { ServiceProxyModule } from '../shared/service-proxies/service-proxy.module';
import { AppHttpInterceptor } from '../shared/auth/app-http.interceptor';
import { AppAuthService } from 'src/shared/auth/app-auth.service';
import { CartStoreService } from 'src/shared/cart/cart-store.service';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { SuborderapiServiceProxy,UserlocationapiServiceProxy } from 'src/shared/service-proxies/service-proxies';
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
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
    CartStoreService,
    AppAuthService,
    AppSessionService,
    SuborderapiServiceProxy,
    UserlocationapiServiceProxy
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

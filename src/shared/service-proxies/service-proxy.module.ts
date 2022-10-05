import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { AbpHttpInterceptor } from 'abp-ng2-module';

import * as ApiServiceProxies from './service-proxies';

@NgModule({
    providers: [
        ApiServiceProxies.UserapiServiceProxy,
        ApiServiceProxies.ProductapiServiceProxy,
        ApiServiceProxies.HomeapiServiceProxy,
        ApiServiceProxies.VendorapiServiceProxy,
        ApiServiceProxies.ServerequestServiceProxy,
        ApiServiceProxies.BuyrequestServiceProxy,
        ApiServiceProxies.OrderapiServiceProxy,
        ApiServiceProxies.AddressapiServiceProxy,
        ApiServiceProxies.NotificationapiServiceProxy,
        ApiServiceProxies.VendorwishlistapiServiceProxy,
        ApiServiceProxies.WishlistapiServiceProxy,
        ApiServiceProxies.EwalletServiceProxy,
        ApiServiceProxies.ChatapiServiceProxy,
        ApiServiceProxies.ReviewproductapiServiceProxy

        // { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true }
    ]
})
export class ServiceProxyModule { }

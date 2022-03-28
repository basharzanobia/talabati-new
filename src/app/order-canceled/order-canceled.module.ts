import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderCanceledPageRoutingModule } from './order-canceled-routing.module';

import { OrderCanceledPage } from './order-canceled.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderCanceledPageRoutingModule
  ],
  declarations: [OrderCanceledPage]
})
export class OrderCanceledPageModule {}

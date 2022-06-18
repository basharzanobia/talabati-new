import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyForMePageRoutingModule } from './buy-for-me-routing.module';

import { BuyForMePage } from './buy-for-me.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuyForMePageRoutingModule
  ],
  declarations: [BuyForMePage]
})
export class BuyForMePageModule {}

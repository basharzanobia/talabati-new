import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResetPassowrdPageRoutingModule } from './reset-passowrd-routing.module';

import { ResetPassowrdPage } from './reset-passowrd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResetPassowrdPageRoutingModule
  ],
  declarations: [ResetPassowrdPage]
})
export class ResetPassowrdPageModule {}

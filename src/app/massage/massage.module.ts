import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MassagePageRoutingModule } from './massage-routing.module';

import { MassagePage } from './massage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MassagePageRoutingModule
  ],
  declarations: [MassagePage]
})
export class MassagePageModule {}

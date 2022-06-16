import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddresPageRoutingModule } from './addres-routing.module';

import { AddresPage } from './addres.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddresPageRoutingModule
  ],
  declarations: [AddresPage]
})
export class AddresPageModule {}

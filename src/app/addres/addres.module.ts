import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddresPageRoutingModule } from './addres-routing.module';

import { AddresPage } from './addres.page';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddresPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddresPage]
})
export class AddresPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditAddresPageRoutingModule } from './edit-addres-routing.module';

import { EditAddresPage } from './edit-addres.page';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditAddresPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditAddresPage]
})
export class EditAddresPageModule {}

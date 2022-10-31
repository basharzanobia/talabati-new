import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditAddresPageRoutingModule } from './edit-addres-routing.module';

import { EditAddresPage } from './edit-addres.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditAddresPageRoutingModule
  ],
  declarations: [EditAddresPage]
})
export class EditAddresPageModule {}

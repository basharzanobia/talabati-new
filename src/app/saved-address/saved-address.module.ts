import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SavedAddressPageRoutingModule } from './saved-address-routing.module';

import { SavedAddressPage } from './saved-address.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SavedAddressPageRoutingModule
  ],
  declarations: [SavedAddressPage]
})
export class SavedAddressPageModule {}

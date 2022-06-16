import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddresPage } from './addres.page';

const routes: Routes = [
  {
    path: '',
    component: AddresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddresPageRoutingModule {}

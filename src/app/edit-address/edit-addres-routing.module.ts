import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditAddresPage } from './edit-addres.page';

const routes: Routes = [
  {
    path: '',
    component: EditAddresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditAddresPageRoutingModule {}

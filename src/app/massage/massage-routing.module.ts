import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MassagePage } from './massage.page';

const routes: Routes = [
  {
    path: '',
    component: MassagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MassagePageRoutingModule {}

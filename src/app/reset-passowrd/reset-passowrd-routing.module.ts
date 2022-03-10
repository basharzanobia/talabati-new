import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResetPassowrdPage } from './reset-passowrd.page';

const routes: Routes = [
  {
    path: '',
    component: ResetPassowrdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResetPassowrdPageRoutingModule {}

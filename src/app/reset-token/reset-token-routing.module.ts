import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResetTokenPage } from './reset-token.page';

const routes: Routes = [
  {
    path: '',
    component: ResetTokenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResetTokenPageRoutingModule {}

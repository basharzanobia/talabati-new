import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IntrotowPage } from './introtow.page';

const routes: Routes = [
  {
    path: '',
    component: IntrotowPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntrotowPageRoutingModule {}

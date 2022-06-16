import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommingsoonPage } from './commingsoon.page';

const routes: Routes = [
  {
    path: '',
    component: CommingsoonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommingsoonPageRoutingModule {}

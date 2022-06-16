import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TchatPage } from './tchat.page';

const routes: Routes = [
  {
    path: '',
    component: TchatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TchatPageRoutingModule {}

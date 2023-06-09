import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestMap3Page } from './test-map3.page';

const routes: Routes = [
  {
    path: '',
    component: TestMap3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestMap3PageRoutingModule {}

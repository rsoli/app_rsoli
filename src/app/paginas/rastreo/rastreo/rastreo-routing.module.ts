import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RastreoPage } from './rastreo.page';

const routes: Routes = [
  {
    path: '',
    component: RastreoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RastreoPageRoutingModule {}

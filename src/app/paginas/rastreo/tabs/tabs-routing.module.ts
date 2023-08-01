import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../../rastreo/rastreo/rastreo.module').then(m => m.RastreoPageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../../rastreo/pago/pago.module').then(m => m.PagoPageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../../rastreo/vehiculo/vehiculo.module').then(m => m.VehiculoPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}

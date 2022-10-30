import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MantenimientoPageRoutingModule } from './mantenimiento-routing.module';

import { MantenimientoPage } from './mantenimiento.page';
import { ComponentesModule } from 'src/app/componentes/componentes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MantenimientoPageRoutingModule,
    ComponentesModule
  ],
  declarations: [MantenimientoPage]
})
export class MantenimientoPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VehiculoPageRoutingModule } from './vehiculo-routing.module';
import { VehiculoPage } from './vehiculo.page';

import { ComponentesModule } from 'src/app/componentes/componentes.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VehiculoPageRoutingModule,
    ComponentesModule
  ],
  declarations: [VehiculoPage]
})
export class VehiculoPageModule {}

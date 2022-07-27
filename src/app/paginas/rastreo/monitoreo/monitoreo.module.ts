import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { MonitoreoPageRoutingModule } from './monitoreo-routing.module';
import { MonitoreoPage } from './monitoreo.page';
import { ComponentesModule } from 'src/app/componentes/componentes.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MonitoreoPageRoutingModule,
    ComponentesModule
  ],
  declarations: [MonitoreoPage]
})
export class MonitoreoPageModule {}

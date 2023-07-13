import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { PagoPageRoutingModule } from './pago-routing.module';
import { PagoPage } from './pago.page';
import { ComponentesModule } from 'src/app/componentes/componentes.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagoPageRoutingModule,
    ComponentesModule,
    HttpClientModule
  ],
  declarations: [PagoPage]
})
export class PagoPageModule {}

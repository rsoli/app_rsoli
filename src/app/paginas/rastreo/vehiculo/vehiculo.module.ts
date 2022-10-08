import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VehiculoPageRoutingModule } from './vehiculo-routing.module';
import { VehiculoPage } from './vehiculo.page';

import { ComponentesModule } from 'src/app/componentes/componentes.module';
import { HttpClientModule } from '@angular/common/http';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { SMS } from '@awesome-cordova-plugins/sms/ngx';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VehiculoPageRoutingModule,
    ComponentesModule,
    HttpClientModule

  ],
  declarations: [VehiculoPage],
  providers: [
    AndroidPermissions,
    SMS
  ]
})
export class VehiculoPageModule {}

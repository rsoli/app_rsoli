import { Component, OnInit } from '@angular/core';
import { MonitoreoService } from '../../../servicios/monitoreo.service';
import { LoadingController } from '@ionic/angular';
import { Platform, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
})
export class PagoPage implements OnInit {

  loading: HTMLIonLoadingElement;
  lista_pagos :Array<String>=[];

  constructor(
    private monitoreo_servicio:MonitoreoService,
    private loadingController:LoadingController,
    public toastController: ToastController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.get_pagos();
  }
  async get_pagos(){
    await this.mostrar_loading();
    this.monitoreo_servicio.get_lista_pago_servicio_usuario().subscribe(data=>{
      this.ocultar_loading();
      this.lista_pagos=JSON.parse(JSON.stringify(data)).pago_servicio;
      console.log("ver res ",this.lista_pagos);
      
    },
    error=>{
      this.ocultar_loading();
			this.alerta("Revise su conexión a internet si el problema persiste vuelve a iniciar sesión");
			this.router.navigate(['/inicio']); 
    })
  }
  async mostrar_loading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Cargando ...',
    });
    await this.loading.present();
  }
  ocultar_loading(){
    try {
      this.loading.dismiss();
    } catch (error) {
      console.log("Error al ocultar loading ",error);
    }
  }
  async alerta(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3400,
      position: 'middle'
    });
    toast.present();
  }

}

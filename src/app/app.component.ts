import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import{UsuarioService} from './servicios/usuario.service';
import { UsuarioModelo } from './modelos/usuario-modelo';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  loading: HTMLIonLoadingElement;
  persona_label:string="";
  correo_label:string="";

  constructor(
    private menu: MenuController,
    private router: Router,
    private usuario_servicio:UsuarioService,
    private loadingController:LoadingController,
    public toastController: ToastController,
  ) {}
  ngOnInit(): void {

  }
  async cerrar_sesion(){

    await this.mostrar_loading();
    this.usuario_servicio.post_cerrar_sesion().subscribe(data=>{

      this.ocultar_loading();
      localStorage.removeItem("accesos");
      this.menu.close('sidebar');
      this.menu.enable(false, 'sidebar');
      this.router.navigate(['/iniciar-sesion']); 
      console.log("cerrar sesion ",data);
      
    },
    error=>{
      this.alerta("Error, Verifique su conexión de Internet");
      console.log("ver error ",error.error.message);  
      this.ocultar_loading();
    })
  }
  cerrar_sidebar(){
    this.menu.close('sidebar');
  }
  cambio_rutas(menu:string){
    this.cerrar_sidebar();
    this.router.navigate(['/'+menu]); 
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

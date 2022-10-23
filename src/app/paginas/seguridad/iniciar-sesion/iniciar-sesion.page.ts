import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioModelo } from '../../../modelos/usuario-modelo';
import{UsuarioService} from '../../../servicios/usuario.service';
import { Router} from '@angular/router';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
// import { Storage } from '@capacitor/storage';
import { AppComponent } from '../../../app.component';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.page.html',
  styleUrls: ['./iniciar-sesion.page.scss'],
})
export class IniciarSesionPage implements OnInit {

  loading: HTMLIonLoadingElement;
  form!: FormGroup;
  usuario:any="";
  password:any="";

  constructor(
    private usuario_servicio:UsuarioService,
    private router: Router,
    public toastController: ToastController,
    private loadingController:LoadingController,
    private AppComponent:AppComponent,
    private menu: MenuController,
    // private storage: Storage
  ) { }

  ngOnInit() {
    this.IniciarFormulario();
    this.DesactivarSideBar();  
  }
  DesactivarSideBar(){
    this.menu.close('sidebar');
    this.menu.enable(false, 'sidebar');
  }
  IniciarFormulario(){

    if(localStorage.getItem('accesos') != undefined){
      this.AppComponent.correo_label=JSON.parse(localStorage.getItem('accesos') || '{}').usuario.correo;
      this.AppComponent.persona_label=JSON.parse(localStorage.getItem('accesos') || '{}').usuario.persona;
      this.router.navigate(['/inicio']); 
    }

    this.form = new FormGroup({
      usuario: new FormControl(this.usuario, [Validators.required,Validators.maxLength(40)]),
      password: new FormControl(this.usuario, [Validators.required, Validators.maxLength(40)]),
    });
   //  console.log("ver log ",this.form.controls.usuario.errors);
  }
  async IniciarSesion(){
    // this.visible_iniciar_sesion=false;
  
    let nuevo_usuario = new UsuarioModelo;
    nuevo_usuario.email=this.form.value.usuario.trim();
    nuevo_usuario.password=this.form.value.password.trim();
    await this.mostrar_loading();
    this.usuario_servicio.post_iniciar_sesion(nuevo_usuario).subscribe(data=>{
      this.ocultar_loading();

       
      localStorage.removeItem("accesos");
      localStorage.setItem('accesos', JSON.stringify(data));
      

      // localStorage.removeItem("accesos");
      // localStorage.setItem('accesos', JSON.stringify(data)); 
      this.AppComponent.correo_label=JSON.parse(localStorage.getItem('accesos') || '{}').usuario.correo;
      this.AppComponent.persona_label=JSON.parse(localStorage.getItem('accesos') || '{}').usuario.persona;
        this.router.navigate(['/inicio']); 
        console.log("ver datos ",data);
        
      },
      error=>{
        console.log("ver err ",error.error.message);
        
        this.ocultar_loading();
          try {
            this.alerta("Usuario o contraseña incorrecto");
          } 
          catch (error) {
            this.alerta("Contactese con el administrador");
          }
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

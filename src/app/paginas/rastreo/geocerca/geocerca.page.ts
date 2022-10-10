import { Component, OnInit } from '@angular/core';
import { GeocercaModelo } from '../../../modelos/geocerca-modelo';
import { MonitoreoService } from '../../../servicios/monitoreo.service';
import { AlertController, LoadingController ,ToastController} from '@ionic/angular';
import { Router } from '@angular/router';
import { ActionSheetController, AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-geocerca',
  templateUrl: './geocerca.page.html',
  styleUrls: ['./geocerca.page.scss'],
})
export class GeocercaPage implements OnInit {

  loading: HTMLIonLoadingElement;

  nombre:String="";
  descripcion:String="";
  tipo_area_seleccionado!: any;
  tipo_area!: any[];

	lista_geocercas :Array<GeocercaModelo>=[];

	geocerca_seleccionado=new GeocercaModelo();

  constructor(
    private monitoreo_servicio:MonitoreoService,
		// private messageService: MessageService,
		// private modalService: BsModalService,
		private router: Router,
		private loadingController:LoadingController,
		public toastController: ToastController,
		public actionSheetController: ActionSheetController,

		// private vehiculo_servicio:VehiculoService,

		private alertController: AlertController,

  ) { }

  ngOnInit() {
    this.GetGeocercas();
  }

	BorrarToast() {
		// this.messageService.clear();
	}
	async GetGeocercas(){
		await this.mostrar_loading(),
		this.monitoreo_servicio.get_geocercas().subscribe(data=>{
			this.ocultar_loading();
			this.lista_geocercas=JSON.parse(JSON.stringify(data)).lista_geocercas;
			console.log("ver res ",this.lista_geocercas);
		  })
	}
	SeleccionarGeocerca(lista_geocercas:GeocercaModelo){
		this.BorrarToast();
		this.geocerca_seleccionado=lista_geocercas;
		//this.messageService.add({severity: 'info', summary: 'Geocerca seleccionado', detail: (this.geocerca_seleccionado.nombre_geocerca).toString() });
	}
	loading_alert(){
		// Swal.fire({
		//   title: 'Verificando datos',
		//   html: 'Cargando',
		//   allowOutsideClick: false,
		//   didOpen: () => {
		// 	  Swal.showLoading()
		//   },
		// });
		
	}
	closeLoading_alert(){
	  // Swal.close();
	}
	mostrar_opciones_geocerca(id,nombre,descripcion,area,tipo_geocerca){
		this.presentActionSheet(id,nombre,descripcion,area,tipo_geocerca);
	}
	formulario_geocerca(id:number,nombre_geocerca,descripcion,area,tipo_geocerca){

		if(id==0){
			this.router.navigate(['/formulario-geocerca/'+id,nombre_geocerca,descripcion,area,tipo_geocerca]);
			// this.router.navigate(['/formulario-geocerca/',id]); 
			let nuevo_geocerca =new GeocercaModelo();
			// this.router.navigate(['/formulario_geocerca'],  
			// { queryParams: 
			// 	{ 
			// 		id: 0 , 
			// 		nombre_geocerca:nuevo_geocerca.nombre_geocerca ,
			// 		area:nuevo_geocerca.area ,
			// 		descripcion:nuevo_geocerca.descripcion ,
			// 		tipo_geocerca:nuevo_geocerca.tipo_geocerca,
			// 		titulo_formulario:'Nuevo geocerca'
			// 	} 
			// } ); 
		}else{
			this.router.navigate(['/formulario-geocerca/'+id,nombre_geocerca,descripcion,area,tipo_geocerca]);
		}
	}

	async presentActionSheet(id,nombre,descripcion,area,tipo_geocerca) {
		const actionSheet = await this.actionSheetController.create({
	
		  header: 'GEOCERCA '+nombre,
		  cssClass: 'action_sheet',
		  buttons: [
		  {
			text: 'Editar geocerca',
			icon: 'layers-outline',
			data: 10,
			handler: () => {
				this.formulario_geocerca(id,nombre,descripcion,area,tipo_geocerca);
				// this.router.navigate(['/formulario-geocerca']); 
			}
		  },
		  {
			text: 'Eliminar geocerca',
			icon: 'trash-outline',
			data: 10,
			handler: () => {
				this.eliminarGeocerca(id,nombre);
				// this.router.navigate(['/formulario-geocerca']); 
			}
		  },
		  {
			text: 'Cancelar',
			icon: 'close',
			role: 'cancel',
			handler: () => {
			  // console.log('Cancel clicked');
			}
		  }]
		});
		await actionSheet.present();
	
		const { role, data } = await actionSheet.onDidDismiss();
		// console.log('onDidDismiss resolved with role and data', role, data);
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
	  async eliminarGeocerca(id,nombre){

		const alert = await this.alertController.create({
			header: 'Alerta',
			subHeader:'¿Esta seguro(a) de eliminar la geocerca '+nombre+'?',
			message: 'No podra revertir esta acción',
			buttons: [        {
			  text: 'Cancelar',
			  role: 'cancel',
			  handler: () => { }
			},
			{
			  text: 'Confirmar',
			  role: 'confirm',
			  handler: () => { 
				
				this.loading_alert();
				this.monitoreo_servicio.eliminar_geocerca(id).subscribe(data=>{
				  this.closeLoading_alert();
				  this.GetGeocercas();
				})
	  
			   }
			}]
		  });
	  
		  await alert.present();
		  
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

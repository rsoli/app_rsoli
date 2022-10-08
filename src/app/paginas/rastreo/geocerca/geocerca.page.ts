import { Component, OnInit } from '@angular/core';
import { GeocercaModelo } from '../../../modelos/geocerca-modelo';
import { MonitoreoService } from '../../../servicios/monitoreo.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-geocerca',
  templateUrl: './geocerca.page.html',
  styleUrls: ['./geocerca.page.scss'],
})
export class GeocercaPage implements OnInit {

  nombre:String="";
  descripcion:String="";
  tipo_area_seleccionado!: any;
  tipo_area!: any[];

	lista_geocercas :Array<GeocercaModelo>=[];
	loading: boolean = true;
	geocerca_seleccionado=new GeocercaModelo();

  constructor(
    private monitoreo_servicio:MonitoreoService,
		// private messageService: MessageService,
		// private modalService: BsModalService,
		private router: Router
  ) { }

  ngOnInit() {
    this.GetGeocercas();
  }

	BorrarToast() {
		// this.messageService.clear();
	}
	GetGeocercas(){
		this.monitoreo_servicio.get_geocercas().subscribe(data=>{
			this.loading = false;
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
	mostrar_opciones_geocerca(){

	}
	formulario_geocerca(){
		this.router.navigate(['/formulario-geocerca']); 
	}

}

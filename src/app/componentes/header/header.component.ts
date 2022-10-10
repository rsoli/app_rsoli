import { Component, Input, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() titulo:string;
  @Input() boton_atras:string='true';
  
  constructor(
    private menu: MenuController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.verificar_sesion();
  }
  verificar_sesion(){
    if(localStorage.getItem('accesos') == undefined){
      this.router.navigate(['/iniciar-sesion']); 
    }
  }
  abrir_sidebar() {
    this.menu.enable(true, 'sidebar');
    this.menu.open('sidebar');
  }


}

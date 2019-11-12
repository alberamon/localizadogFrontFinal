import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LocalizacionesService } from '../../services/localizaciones.service';
import { Usuario } from '../../interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { PostsService } from '../../services/posts.service';
import { UiServiceService } from 'src/app/services/ui-service.service';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss'],
})
export class FiltroComponent implements OnInit {
  comunidades;
  provincias;
  localidades;

  filtro: any = {
    checkTodos: false,
    checkComunidad: false,
    checkProvincia: false,
    checkLocalidad: false,
    checkGeo: false
  };

  opciones: any = {
    localidad: '',
    provincia: '',
    pais: 'España',
    comunidad: '',
    distancia: 50
  };

  usuario: Usuario;

  opcionesSelectComunidades: any = {
    header: 'Seleccione una comunidad autónoma:'
  };

  opcionesSelectProvincias: any = {
    header: 'Seleccione una provincia:'
  };

  opcionesSelectLocalidades: any = {
    header: 'Seleccione una localidad:'
  };

  constructor(private modalController: ModalController,
              private localizacionesService: LocalizacionesService,
              private usuarioService: UsuarioService,
              private postService: PostsService,
              private uiService: UiServiceService) { }

  ngOnInit() {
    /*this.comunidades = this.localizacionesService.getComunidades();
    this.usuario = this.usuarioService.getUsuario();
    this.provincias = this.localizacionesService.getProvincias(this.usuario.pais, this.usuario.comunidad);
    this.localidades = this.localizacionesService.getLocalidades(this.usuario.provincia);
    this.opciones.comunidad = this.usuario.comunidad;
    this.opciones.provincia = this.usuario.provincia;
    this.opciones.localidad = this.usuario.localidad;*/
    this.postService.getFiltros().then( async resp => {
      if (resp !== null) {
        this.filtro = await resp;
      } else {
        this.filtro = {
          checkTodos: false,
          checkComunidad: false,
          checkProvincia: false,
          checkLocalidad: false,
          checkGeo: true
        };
      }
    });
    this.postService.getOpciones().then( async resp => {
      if ( resp !== null) {
        this.opciones = await resp;
      }
    });
  }

  onChangeProvincias() {
    this.opciones.provincia = '';
    this.provincias = this.localizacionesService.getProvincias(this.opciones.pais, this.opciones.comunidad);
    if ( this.provincias.length === 1) {
      this.opciones.provincia = this.provincias[0].nombre;
      this.localidades = this.localizacionesService.getLocalidades(this.opciones.provincia);
    }
    if (this.opciones.provincia === '') {
      this.opciones.localidad = '';
    }
  }

  onChangeLocalidades() {
    if ( this.opciones.provincia !== '') {
      this.localidades = this.localizacionesService.getLocalidades(this.opciones.provincia);
    }
  }

  dismiss() {
    const data = {
      filtro: this.filtro,
      opciones: this.opciones
    };

    /*if (this.opciones.provincia === '' && this.filtro.checkTodos === false
    && this.filtro.checkComunidad === false && this.filtro.checkGeo === false && this.filtro.checkProvincia === true) {
      this.uiService.mensajeToast('Debe de seleccionar una provincia.');
      return;
    }
    if (this.opciones.localidad === '' && this.filtro.checkTodos === false
    && this.filtro.checkComunidad === false && this.filtro.checkGeo === false && this.filtro.checkLocalidad === true) {
      this.uiService.mensajeToast('Debe de seleccionar una localidad.');
      return;
    }*/

    if (this.filtro.checkProvincia === false && this.filtro.checkTodos === false
    && this.filtro.checkComunidad === false && this.filtro.checkGeo === false && this.filtro.checkLocalidad === false) {
      this.uiService.mensajeToast('Debe de seleccionar una opción.');
      return;
    }

    if (this.filtro.checkGeo === true && this.opciones.distancia === '0' || isNaN(this.opciones.distancia)) {
      this.uiService.mensajeToast('Introduzca un valor numérico mayor de 0.');
      return;
    }

    this.modalController.dismiss(data);
  }

  cambiarCheckbox(opcion) {
    switch (opcion) {
      case('todos'):
        this.filtro.checkComunidad = false;
        this.filtro.checkProvincia = false;
        this.filtro.checkLocalidad = false;
        this.filtro.checkGeo = false;
        break;

     /* case('comunidad'):
        this.filtro.checkTodos = false;
        this.filtro.checkProvincia = false;
        this.filtro.checkLocalidad = false;
        this.filtro.checkGeo = false;
        break;

      case('provincia'):
        this.filtro.checkTodos = false;
        this.filtro.checkComunidad = false;
        this.filtro.checkLocalidad = false;
        this.filtro.checkGeo = false;
        break;

      case('localidad'):
        this.filtro.checkTodos = false;
        this.filtro.checkComunidad = false;
        this.filtro.checkProvincia = false;
        this.filtro.checkGeo = false;
        break;*/

      case('geo'):
        this.filtro.checkTodos = false;
        this.filtro.checkComunidad = false;
        this.filtro.checkProvincia = false;
        this.filtro.checkLocalidad = false;
        break;
    }
  }

}

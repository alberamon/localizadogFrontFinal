import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { LocalizacionesService } from '../../services/localizaciones.service';
import { NgForm } from '@angular/forms';
import { UiServiceService } from '../../services/ui-service.service';
import { PostsService } from '../../services/posts.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Platform } from '@ionic/angular';

declare var window: any;

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  usuario: Usuario = {};
  paises;
  comunidades;
  provincias;
  localidades;

  opcionesSelectPaises: any = {
    header: 'Seleccione su país:'
  };

    opcionesSelectComunidades: any = {
    header: 'Seleccione su comunidad autónoma:'
  };

  opcionesSelectProvincias: any = {
    header: 'Seleccione su provincia:'
  };

  opcionesSelectLocalidades: any = {
    header: 'Seleccione su localidad:'
  };

  constructor( private usuarioService: UsuarioService,
               private localizacionesService: LocalizacionesService,
               private uiService: UiServiceService,
               private postService: PostsService,
               private camera: Camera,
               private platform: Platform,
               private crop: Crop) {}

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();
    this.paises = this.localizacionesService.getPaises();
    this.comunidades = this.localizacionesService.getComunidades();
    this.provincias = this.localizacionesService.getProvincias(this.usuario.pais, this.usuario.comunidad);
    this.localidades = this.localizacionesService.getLocalidades(this.usuario.provincia);
  }

  async actualizar( fActualizar: NgForm ) {

    if ( fActualizar.invalid ) { return; }

    const actualizado = await this.usuarioService.actualizarUsuario ( this.usuario );

    if ( actualizado) {
      this.uiService.mensajeToast('Datos del usuario actualizados!');
    } else {
      this.uiService.mensajeToast('No se pudieron actualizar los datos del usuario!');
    }
  }

  onChangeProvincias() {
    this.provincias = this.localizacionesService.getProvincias(this.usuario.pais, this.usuario.comunidad);
    if ( this.provincias.length === 1) {
      this.usuario.provincia = this.provincias[0].nombre;
      this.localidades = this.localizacionesService.getLocalidades(this.usuario.provincia);
    }
    this.usuario.localidad = '';
  }

  onChangeLocalidades() {
    this.localidades = this.localizacionesService.getLocalidades(this.usuario.provincia);
    if (this.localidades.length === 1) {
      this.usuario.localidad = this.localidades[0].nombre;
    }
  }

  logout() {
    this.usuarioService.logout();
    this.postService.paginaPosts = -1;
  }

  abrirCamara() {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true
    };

    this.procesarFoto( options );
  }

  abrirGaleria() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true
    };

    this.procesarFoto( options );
  }

  procesarFoto( options: CameraOptions ) {

    this.camera.getPicture(options).then((imageData) => {
      if (this.platform.is('ios')) {
        return imageData;
      } else if (this.platform.is('android')) {
        imageData = 'file://' + imageData;
        return this.crop.crop(imageData, { quality: 100, targetWidth: -1, targetHeight: -1 });
      }
    })
    .then((path) => {
      const img = window.Ionic.WebView.convertFileSrc( path );
      this.usuario.fotoPerfil = img;
      this.usuarioService.subirFotoPerfil( path );
    });
  }

}

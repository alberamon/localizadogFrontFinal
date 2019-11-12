import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { NavController, Platform } from '@ionic/angular';
import { UiServiceService } from '../../services/ui-service.service';
import { LocalizacionesService } from '../../services/localizaciones.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { NgForm } from '@angular/forms';

declare var window: any;

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  paises;
  comunidades;
  provincias;
  localidades;
  fotoPerfil;
  fotoMostrar = '';

  textoPassword = '* La contraseña debe tener entre 4 y 12 caracteres alfanuméricos.';
  textoCampo = '* Campo requerido';

  boolPass = false;
  boolComunidad = false;
  boolProvincia = false;
  boolLocalidad = false;


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

repetirpassword = '';

registroUsuario: Usuario = {
  email: '',
  password: '',
  nombre: '',
  apellidos: '',
  localidad: '',
  provincia: '',
  pais: 'España',
  comunidad: ''
};

  constructor( private usuarioService: UsuarioService,
               private navCtrl: NavController,
               private uiService: UiServiceService,
               private localizacionesService: LocalizacionesService,
               private camera: Camera,
               private platform: Platform,
               private crop: Crop) { }

  ngOnInit() {
    this.paises = this.localizacionesService.getPaises();
    this.comunidades = this.localizacionesService.getComunidades();
  }

  onChangeProvincias() {
    this.registroUsuario.provincia = '';
    this.provincias = this.localizacionesService.getProvincias(this.registroUsuario.pais, this.registroUsuario.comunidad);
    this.boolComunidad = true;
    if ( this.provincias.length === 1) {
      this.registroUsuario.provincia = this.provincias[0].nombre;
      this.localidades = this.localizacionesService.getLocalidades(this.registroUsuario.provincia);
      this.boolComunidad = true;
    }
    if (this.registroUsuario.provincia === '') {
      this.registroUsuario.localidad = '';
      this.boolProvincia = false;
      this.boolLocalidad = false;
    }
  }

  onChangeLocalidades() {
    if ( this.registroUsuario.provincia !== '') {
      this.localidades = this.localizacionesService.getLocalidades(this.registroUsuario.provincia);
      this.boolProvincia = true;
    }
  }

  onChangeComprobarLocalidad() {
    if ( this.registroUsuario.localidad !== '') {
      this.boolLocalidad = true;
    }
  }

  comprobarPass() {
    if (this.repetirpassword !== this.registroUsuario.password) {
      this.textoPassword = 'Las contraseñas introducidas no coinciden.';
      this.boolPass = false;
    } else {
      this.boolPass = true;
    }
  }

  async registro( fRegistro: NgForm ) {
    if (this.boolPass === false) {
      this.uiService.mensajeToast('Las contraseñas introducidas no coinciden.');
      return;
    }

    if ( fRegistro.invalid || this.boolComunidad === false || this.boolProvincia === false || this.boolLocalidad === false ) {
      this.uiService.mensajeToast('Complete todos los campos obligatorios.');
      return;
    }

    const valido = await this.usuarioService.registro( this.registroUsuario );

    if ( valido ) {
      await this.usuarioService.login( this.registroUsuario.email, this.registroUsuario.password );
      await this.usuarioService.subirFotoPerfil( this.fotoPerfil );
      console.log('registro');
      this.uiService.mensajeAlerta('Usuario creado correctamente. Iniciando sesión...');
      this.navCtrl.navigateRoot('/main/tabs/tab1', { animated: true});
    } else {
      this.uiService.mensajeAlerta('El correo electrónico introducido ya existe en la base de datos.');
    }
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
      console.log('Cropped Image Path!: ' + path);
      const img = window.Ionic.WebView.convertFileSrc( path );
      this.fotoMostrar = img;
      this.fotoPerfil = path;
    });
  }

  mostrarLogin() {
    this.navCtrl.navigateRoot('/login', { animated: true });
  }

}


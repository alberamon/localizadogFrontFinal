import { Component } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { Router } from '@angular/router';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Platform } from '@ionic/angular';
import { Crop } from '@ionic-native/crop/ngx';
import { Post } from '../../interfaces/interfaces';
import { UiServiceService } from '../../services/ui-service.service';

declare var window: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  imagenesTemp: string[] = [];
  imagenesPost: any[] = [];

  cargandoGeolocalizacion = false;

  toogleGeo = false;

  post: Post = {
    mensaje: '',
  };

  constructor( private postService: PostsService,
               private route: Router,
               private geolocation: Geolocation,
               private camera: Camera,
               private platform: Platform,
               private crop: Crop,
               private uiService: UiServiceService) {}

  async crearPost() {
    const createPost = await this.postService.crearPost( this.post, this.imagenesPost );

    if (createPost) {
      this.imagenesPost = [];
      this.imagenesTemp = [];
      this.post.mensaje = '';
      this.uiService.mensajeToast('Post creado con éxito.');
      this.route.navigateByUrl('/main/tabs/tab1');
    } else {
      this.uiService.mensajeToast('Error, el post no ha podido ser creado');
    }
  }

  getGeolocalizacion() {
    if ( !this.toogleGeo ) {
      this.post.latitud = null;
      this.post.longitud = null;
      return;
    }

    this.cargandoGeolocalizacion = true;

    this.geolocation.getCurrentPosition().then(( geoposition: Geoposition ) => {
      this.cargandoGeolocalizacion = false;
      this.post.latitud = geoposition.coords.latitude;
      this.post.longitud = geoposition.coords.longitude;
     }).catch((error) => {
       console.log('Error obteniendo la localización', error);
       this.cargandoGeolocalizacion = false;
     });
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
      this.imagenesPost.push(path);
      this.imagenesTemp.push(img);
    });
  }
}

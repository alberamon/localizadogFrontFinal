import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { Usuario } from '../interfaces/interfaces';
import { NavController } from '@ionic/angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  token: string = null;

  private usuario: Usuario = {};

  constructor( private http: HttpClient,
               private storage: Storage,
               private navCtrl: NavController,
               private fileTransfer: FileTransfer ) { }

  login( email: string, password: string) {
    const datos = { email, password };

    return new Promise( resolve => {
      this.http.post(`${ URL }/api/login`, datos)
      .subscribe( async resp => {
        if ( resp['ok'] && !resp['recuperarPass']) {
          await this.guardarToken( resp['token'] );
          resolve(true);
        } else if (resp['ok'] && resp['recuperarPass']) {
          await this.guardarToken( resp['token'] );
          this.navCtrl.navigateRoot('/cambiar-pass');
        } else {
          this.token = null;
          this.storage.clear();
          resolve(false);
        }
      });
    });
  }

  logout() {
    this.token = null;
    this.usuario = null;
    this.storage.clear();
    this.navCtrl.navigateRoot('/login', {animated: true});
  }

  registro( usuario: Usuario ) {
    return new Promise( resolve => {
      this.http.post(`${ URL }/api/usuarios/crear`, usuario )
        .subscribe( async resp => {
          if ( resp['ok'] ) {
            await this.guardarToken( resp['token'] );
            resolve(true);
          } else {
            this.token = null;
            this.storage.clear();
            resolve(false);
          }
        });
    });
  }

  getUsuario() {
    if ( !this.usuario.id ) {
      this.validarToken();
    }
    return { ...this.usuario };
  }

  async guardarToken( token: string ) {
    this.token = token;
    await this.storage.set('token' , token);
    await this.validarToken();
  }

  async cargarToken() {
    this.token = await this.storage.get('token') || null;
  }

  async validarToken(): Promise<boolean> {
    await this.cargarToken();

    if ( !this.token ) {
      this.navCtrl.navigateRoot('/login');
      return Promise.resolve(false);
    }

    return new Promise<boolean>( resolve => {
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.token
      });
      this.http.get(`${ URL }/api/usuarios/token`, { headers })
        .subscribe( resp => {
          // tslint:disable-next-line: no-string-literal
          if ( resp['ok'] ) {
            // tslint:disable-next-line: no-string-literal
            this.usuario = resp['usuario'];
            resolve(true);
          } else {
            this.navCtrl.navigateRoot('/login');
            resolve(false);
          }
        });
    });
  }

  actualizarUsuario( usuario: Usuario ) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.token
    });

    return new Promise( resolve => {
      this.http.post(`${ URL }/api/usuarios/update`, usuario, {headers})
        .subscribe( resp => {
          if ( resp['ok'] ) {
            this.guardarToken( resp['token']);
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  }

  subirFotoPerfil( imagen: string ) {
    const options: FileUploadOptions = {
      fileKey: 'file',
      headers: {
        Authorization: 'Bearer ' + this.token
      }
    };
    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    fileTransfer.upload( imagen, `${ URL }/api/upload/fotoperfil`, options )
      .then( () => {
        location.reload();
      }).catch( err => {
        console.log('Error cargando la foto', err);
      });
  }

  setCoordsUser( latitud, longitud ) {
    this.usuario.latitud = latitud;
    this.usuario.longitud = longitud;
  }

  reestablecerPass( email ) {
    return new Promise( resolve => {
      this.http.post(`${ URL }/api/usuarios/recuperar`, email )
        .subscribe( async resp => {
          if ( resp['ok'] ) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  }

  cambiarPass( nuevoPass ) {
    return new Promise<boolean>( resolve => {
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.token
      });
      this.http.post(`${ URL }/api/usuarios/cambiar-pass`, nuevoPass, { headers })
        .subscribe( resp => {
          if ( resp['ok'] ) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  }
}

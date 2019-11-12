import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'tiempoPost'
})
export class TiempoPostPipe implements PipeTransform {

  transform( fecha: number ): any {
    moment.locale('es');

    const fechaActual = new Date();
    const fechaUnix = Date.now();
    const fechaPost = new Date(fecha);

    const añoActual = fechaActual.getFullYear();
    const añoPost = fechaPost.getFullYear();

    const tiempoPost = (fechaUnix - fecha) / 1000;


    if (tiempoPost < 60) {
      return 'Hace pocos segundos';
    } else if (tiempoPost >= 60 && tiempoPost < 120) {
      return 'Hace ' + Math.trunc(tiempoPost / 60) + ' minuto';
    } else if (tiempoPost > 120 && tiempoPost < 3600) {
      return 'Hace ' + Math.trunc(tiempoPost / 60) + ' minutos';
    } else if (tiempoPost > 3600 && tiempoPost < 7200) {
      return 'Hace ' + Math.trunc(tiempoPost / 3600) + ' hora';
    } else if (tiempoPost > 7200 && tiempoPost < 86400) {
      return 'Hace ' + Math.trunc(tiempoPost / 3600) + ' horas';
    } else if ( añoActual > añoPost && tiempoPost > 86400) {
      return moment(fechaPost).format('DD MMMM YYYY');
    } else if ( añoActual === añoPost && tiempoPost > 86400) {
      return moment(fechaPost).format('DD MMMM');
    }
  }

}

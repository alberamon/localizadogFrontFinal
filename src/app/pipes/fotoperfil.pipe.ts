import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

const URL = environment.url;

@Pipe({
  name: 'fotoperfil'
})
export class FotoperfilPipe implements PipeTransform {

  transform( imagen: string, id: number ): string {
    return `${ URL }/api/usuarios/imagen/${ id }/${ imagen }`;
}

}

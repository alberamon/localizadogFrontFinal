import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

const URL = environment.url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform( imagen: string, id: number ): string {
      return `${ URL }/api/posts/imagen/${ id }/${ imagen }`;
  }

}

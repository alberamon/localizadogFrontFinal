export interface RespuestaPosts {
  pagina: number;
  ok: boolean;
  posts: Posts;
}

export interface Posts {
  content: Content[];
  pageable: Pageable;
  totalElements: number;
  last: boolean;
  totalPages: number;
  number: number;
  size: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface Pageable {
  sort: Sort;
  offset: number;
  pageSize: number;
  pageNumber: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface Content {
  id?: number;
  fechaCreacion?: number;
  tiempoPost?: number;
  mensaje?: string;
  imagenes?: any;
  latitud?: number;
  longitud?: number;
  usuario?: Usuario;
  comentarios?: any[];
  favorito?: boolean;
}

export interface Usuario {
  id?: number;
  nombre?: string;
  apellidos?: string;
  email?: string;
  fechaAlta?: any;
  password?: string;
  roles?: Role[];
  localidad?: string;
  provincia?: string;
  comunidad?: string;
  pais?: string;
  fotoPerfil?: string;
  latitud?: number;
  longitud?: number;
}

export interface Role {
  id: number;
  authority: string;
}

export interface RespuestaLogin {
  ok: boolean;
  token?: string;
  error?: string;
  mensaje?: string;
}

export interface Comentario {
  id?: number;
  mensaje: string;
  fechaCreacion?: any;
  usuario?: Usuario;
}

export interface RespuestaFav {
  ok: boolean;
  posts: number[];
}

export interface CreatePostResponse {
  post: Post;
  mensaje: string;
  ok: boolean;
}

export interface Post {
  id?: number;
  fechaCreacion?: string;
  mensaje?: string;
  imagenes?: any;
  longitud?: number;
  latitud?: number;
  usuario?: Usuario;
  comentarios?: any;
}

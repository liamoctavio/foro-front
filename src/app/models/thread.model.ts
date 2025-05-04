// src/app/models/thread.model.ts
export interface Thread {
  id: number;
  titulo: string;
  contenido: string;
  usuario: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
  };
  categoria: {
    id: number;
    nombre: string;
  };
}

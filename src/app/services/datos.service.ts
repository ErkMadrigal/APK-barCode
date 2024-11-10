import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class DatosService {
  // private apiUrl = 'http://localhost/conexionescolar/public/';
  private apiUrl = 'https://mc-madrigal.com/conexionescolar/public/';
  // private apiUrl = 'https://randomuser.me/api/';

  constructor(private http: HttpClient) {}

  getDatos(code: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getEstudentBarrCode/${code}/1`);
    // return this.http.get<any>(`${this.apiUrl}`);
  }

  // Método para enviar un mensaje usando Twilio
 

  // setDatos(id: string): Observable<any>{
  //   return this.http.post<any>(`${this.apiUrl}setAsistencias/${id}/1`, {});
  // }

}
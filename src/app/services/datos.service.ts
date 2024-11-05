import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosService {
  private apiUrl = 'https://7b081g5w-3000.usw3.devtunnels.ms/api/datos/code';
  // private apiUrl = 'https://randomuser.me/api/';

  constructor(private http: HttpClient) {}

  getDatos(code: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${code}`);
    // return this.http.get<any>(`${this.apiUrl}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Parametre } from '../model/Parametre';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParametreService {

	constructor(
		private http: HttpClient
	) { }

	/**
	 * Renvoie la liste des paramètres
	 */
	public liste(): Observable<Parametre[]> {
		return this.http.get<Parametre[]>("/api/parametre");
	}

	/**
	 * Mise à jour des paramètres
	 * @param parametres 
	 */
	public maj(parametres: Parametre[]): Observable<Parametre[]> {
		return this.http.post<Parametre[]>("/api/parametre", parametres);		
	}
}

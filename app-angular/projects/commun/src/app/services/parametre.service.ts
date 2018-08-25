import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Parametre } from 'projects/commun/src/app/model/Parametre';
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

	/**
	 * Renvoie la valeur d'un paramètre
	 * @param nom 
	 */
	public get(nom: string): Observable<string> {
		return this.http.get<string>("/api/parametre/" + nom);
	}
}

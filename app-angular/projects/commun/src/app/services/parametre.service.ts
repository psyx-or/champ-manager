import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Parametre } from 'projects/commun/src/app/model/Parametre';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ParametreService {

	private cache = new Map<string,string>();

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
		this.cache.clear();
		return this.http.post<Parametre[]>("/api/parametre", parametres);		
	}

	/**
	 * Renvoie la valeur d'un paramètre
	 * @param nom 
	 */
	public get(nom: string): Observable<string> {
		if (this.cache.has(nom))
			return of(this.cache.get(nom));
		else
			return this.http.get<string>("/api/parametre/" + nom).pipe(
				tap(val => this.cache.set(nom, val))
			);
	}

	/**
	 * Renvoie la valeur d'un paramètre entier
	 * @param nom 
	 */
	public getInt(nom: string): Observable<number> {
		return this.get(nom).pipe(
			map(parseInt)
		);
	}
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Championnat } from 'projects/commun/src/app/model/Championnat';
import { Observable } from 'rxjs';
import { Classement } from 'projects/commun/src/app/model/Classement';

@Injectable({
  providedIn: 'root'
})
export class ClassementService {

	constructor(
		private http: HttpClient
	) { }

	/**
	 * Récupère le classement d'un championnat
	 * @param champId
	 */
	public get(champId: number): Observable<Championnat> {
		return this.http.get<Championnat>("/api/classement/" + champId);
	}

	/**
	 * Met à jour des classements
	 * @param champ
	 * @param classements 
	 */
	public maj(champ: Championnat, classements: Classement[]): Observable<Championnat> {
		return this.http.patch<Championnat>("/api/classement/" + champ.id, classements);
	}
}

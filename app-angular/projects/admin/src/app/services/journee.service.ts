import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Championnat } from 'projects/commun/src/app/model/Championnat';
import { Journee } from 'projects/commun/src/app/model/Journee';

@Injectable({
  providedIn: 'root'
})
export class JourneeService {

	private _lastDates: Date[][] = [];

	constructor(
		private http: HttpClient
	) { }

	/**
	 * Renvoie un championnat avec toutes ses journées
	 * @param champId 
	 */
	public getJournees(champId: number): Observable<Championnat> {
		return this.http.get<Championnat>("/api/journee/" + champId);
	}

	/**
	 * Met à jour les journées d'un championnat
	 * @param champ 
	 * @param journees 
	 */
	public majJournees(champ: Championnat, journees: Journee[]): Observable<Object> {
		this._lastDates = journees.map(j => [j.debut, j.fin]);
		return this.http.put("/api/journee/" + champ.id, journees);
	}

	/**
	 * Dernières dates enregistrées
	 */
	public get lastDates(): Date[][] {
		return this._lastDates;
	}
}

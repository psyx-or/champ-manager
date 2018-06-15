import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { sort } from '../utils/utils';
import { Championnat } from '../model/Championnat';
import { Journee } from '../model/Journee';

@Injectable({
  providedIn: 'root'
})
export class JourneeService {

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
		return this.http.put("/api/journee/" + champ.id, journees);
	}
}

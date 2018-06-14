import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Journee } from '../model/Journee';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

	constructor(
		private http: HttpClient
	) { }

	/**
	 * Renvoie une hiérarchie de matches
	 * @param champId 
	 */
	public getHierarchie(champId: number): Observable<Journee> {
		return this.http.get<Journee>("/api/match/hierarchie/" + champId);
	}
}

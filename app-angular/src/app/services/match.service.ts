import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Journee } from '../model/Journee';
import { Observable } from 'rxjs';
import { Championnat } from '../model/Championnat';
import { Match } from '../model/Match';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

	constructor(
		private http: HttpClient
	) { }

	/**
	 * Renvoie la liste des matches d'un championnat
	 * @param champId 
	 */
	public liste(champId: number): Observable<Championnat> {
		return this.http.get<Championnat>("/api/match/" + champId);
	}

	/**
	 * Renvoie une hiérarchie de matches
	 * @param champId 
	 */
	public getHierarchie(champId: number): Observable<Journee> {
		return this.http.get<Journee>("/api/match/hierarchie/" + champId);
	}

	/**
	 * Valide un match
	 * @param match 
	 */
	public valide(match: Match): Observable<Match> {
		return this.http.patch<Match>("/api/match/" + match.id, null);
	}

	/**
	 * Met à jour les matches d'une journée (ADMIN)
	 * @param journee 
	 */
	public maj(journee: Journee): Observable<Match[]> {
		return this.http.put<Match[]>("/api/match/", journee.matches);
	}
}

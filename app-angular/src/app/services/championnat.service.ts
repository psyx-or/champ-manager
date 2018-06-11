import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Championnat } from '../model/Championnat';
import { Equipe } from '../model/Equipe';

@Injectable({
  providedIn: 'root'
})
export class ChampionnatService {

    constructor(
        private http: HttpClient
    ) { }

	/**
	 * @returns La liste des championnats
	 */
    public getChampionnats(): Observable<Championnat[]> {
        return this.http.get<Championnat[]>("/api/championnat");
	}
	
	/**
	 * Crée un nouveau championnat
	 * @param championnat 
	 */
	public create(championnat: Championnat, equipes: Equipe[]): Observable<Championnat> {
		return this.http.post<Championnat>("/api/championnat", {championnat: championnat, equipes: equipes});
	}
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Championnat } from '../model/Championnat';
import { Equipe } from '../model/Equipe';
import { Classement } from '../model/Classement';
import { map } from 'rxjs/operators';

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
	 * Liste les championnats similaires à un autre
	 * @param championnat 
	 */
	public listeSimilaires(championnat: Championnat): Observable<Championnat[]> {
		return this.http.get<Championnat[]>("/api/championnat", { params: {
			"sport": championnat.sport.nom,
			"saison": championnat.saison
		}}).pipe(
			map(champs => champs.filter(champ => champ.id != championnat.id))
		);
	}
	
	/**
	 * Crée un nouveau championnat
	 * @param championnat 
	 */
	public cree(championnat: Championnat, equipes: Equipe[]): Observable<Championnat> {
		return this.http.post<Championnat>("/api/championnat", {championnat: championnat, equipes: equipes});
	}

	/**
	 * Supprime un championnat
	 * @param championnat 
	 */
	public supprime(championnat: Championnat): Observable<any> {
		return this.http.delete("/api/championnat/" + championnat.id);
	}

	/**
	 * Remplace une équipe dans un championnat
	 */
	public remplace(championnat: Championnat, oldEquipe: Equipe, newEquipe: Equipe): Observable<Classement[]> {
		return this.http.patch<Classement[]>("/api/championnat/" + championnat.id + "/remplace/" + oldEquipe.id + "/" + newEquipe.id, null);
	}

	/**
	 * Importe les résultats existants de championnats dans un nouveau championnat
	 * @param champDest 
	 * @param champSources 
	 */
	public importe(champDest: Championnat, champSources: Championnat[]): Observable<number> {
		return this.http.post<number>("/api/championnat/" + champDest.id + "/importe", champSources);
	}
}

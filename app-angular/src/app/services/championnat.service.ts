import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { Championnat, ChampModele } from '../model/Championnat';
import { Equipe } from '../model/Equipe';
import { Classement } from '../model/Classement';
import { map, tap } from 'rxjs/operators';
import { Sport } from '../model/Sport';
import { CalendrierDTO } from '../model/CalendrierDTO';
import { getSaisonCourante } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class ChampionnatService {

	private cache: Championnat[];
	private cacheModele: ChampModele[];

    constructor(
        private http: HttpClient
    ) { }

	/**
	 * @returns La liste des championnats
	 */
    public getChampionnatsCourants(): Observable<Championnat[]> {
		if (this.cache) 
			return of(this.cache);

        return this.http.get<Championnat[]>("/api/championnat", {params: { saison: getSaisonCourante() }}).pipe(
			tap(champs => this.cache = champs)
		);
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
		this.cache = null;
		return this.http.post<Championnat>("/api/championnat", {championnat: championnat, equipes: equipes});
	}

	/**
	 * Supprime un championnat
	 * @param championnat 
	 */
	public supprime(championnat: Championnat): Observable<any> {
		this.cache = null;
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

	/**
	 * Renvoie les infos de calendrier pour les championnats de la saison courante
	 * @param sport 
	 */
	public getCalendrierCourant(sport: Sport): Observable<CalendrierDTO[]> {
		return this.http.get<CalendrierDTO[]>("/api/championnat/" + sport.nom + "/calendrier", { params: { saison: getSaisonCourante() }});
	}

	/**
	 * Génère le lien pour générer le fichier du calendrier
	 * @param sport 
	 * @param champs 
	 */
	public lienCalendrier(sport: Sport, champs: Championnat[]): string {
		return "/api/championnat/" + sport.nom + "/calendrier/genere?champs=" + champs.map(c => c.id).join();
	}

	/**
	 * Récupère les modèles de championnat
	 */
	public getModeles(): Observable<ChampModele[]> {
		return this.http.get<ChampModele[]>("/api/championnat/modele").pipe(
			tap(modeles => this.cacheModele = modeles)
		);
	}

	/**
	 * Met à jour un modèle de championnat
	 * @param modele 
	 */
	public majModele(modele: ChampModele): Observable<any> {
		this.cacheModele = null;
		return this.http.post("/api/championnat/modele", modele);
	}

	/**
	 * Supprime un modèle de championnat
	 * @param modele
	 */
	public supprimeModele(modele: ChampModele): Observable<any> {
		this.cacheModele = null;
		return this.http.delete("/api/championnat/modele/" + modele.id);
	}
}

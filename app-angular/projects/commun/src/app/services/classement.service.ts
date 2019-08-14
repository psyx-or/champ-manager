import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Championnat } from '../model/Championnat';
import { Observable } from 'rxjs';
import { Classement } from '../model/Classement';
import { getSaisonCourante } from '../utils/utils';
import { ChampionnatEquipeDTO } from '../model/ChampionnatEquipeDTO';

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
	 * Récupère les classements d'une équipe pour la saison courante
	 * @param equipeId
	 */
	public getEquipe(equipId: number): Observable<ChampionnatEquipeDTO> {
		return this.http.get<ChampionnatEquipeDTO>("/api/classement/equipe/" + equipId, { params: { saison: getSaisonCourante() } });
	}

	/**
	 * Récupère l'historique des classements d'une équipe
	 * @param equipeId
	 */
	public getHistoriqueEquipe(equipId: number): Observable<ChampionnatEquipeDTO> {
		return this.http.get<ChampionnatEquipeDTO>("/api/classement/equipe/" + equipId + "/historique");
	}

	/**
	 * Met à jour des classements
	 * @param champ
	 * @param classements 
	 */
	public maj(champ: Championnat, classements: Classement[]): Observable<Championnat> {
		return this.http.patch<Championnat>("/api/classement/" + champ.id, classements);
	}

	/**
	 * Génère le lien pour exporter les classements
	 * @param saison 
	 */
	public lienExport(saison: string): string {
		return "/api/classement/export?saison=" + saison;
	}
}

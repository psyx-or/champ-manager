import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SanctionCategorie } from '../model/Sanction';

@Injectable({
  providedIn: 'root'
})
export class SanctionService {

    constructor(
        private http: HttpClient
    ) { }

	/**
	 * Récupère le barème des sanctions
	 */
	public getBareme(): Observable<SanctionCategorie[]> {
		return this.http.get<SanctionCategorie[]>("/api/sanction/bareme");
	}

	/**
	 * Met à jour le barème des sanctions
	 */
	public majBareme(bareme: SanctionCategorie[]): Observable<SanctionCategorie[]> {
		return this.http.post<SanctionCategorie[]>("/api/sanction/bareme", bareme);
	}
}

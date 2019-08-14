import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SanctionCategorie, Sanction } from '../model/Sanction';
import { tap } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SanctionService {

	private cache: SanctionCategorie[];

    constructor(
        private http: HttpClient
    ) { }

	/**
	 * Récupère le barème des sanctions
	 */
	public get(): Observable<Sanction[]> {
		return this.http.get<Sanction[]>("/api/sanction", { params: { from: moment().subtract(2, 'year').toISOString() }});
	}

	/**
	 * Crée une nouvelle sanction
	 */
	public creer(sanction: Sanction): Observable<any> {
		return this.http.post("/api/sanction", sanction);
	}

	/**
	 * Récupère le barème des sanctions
	 */
	public getBareme(): Observable<SanctionCategorie[]> {
		if (this.cache != null) {
			return of(this.cache);
		}
		else {
			return this.http.get<SanctionCategorie[]>("/api/sanction/bareme").pipe(
				tap(res => this.cache = res)
			);
		}
	}

	/**
	 * Met à jour le barème des sanctions
	 */
	public majBareme(bareme: SanctionCategorie[]): Observable<SanctionCategorie[]> {
		return this.http.post<SanctionCategorie[]>("/api/sanction/bareme", bareme).pipe(
			tap(res => this.cache = res)
		);
	}
}

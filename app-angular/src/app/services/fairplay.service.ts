import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FPForm } from '../model/FPForm';

@Injectable({
  providedIn: 'root'
})
export class FairplayService {

	constructor(
		private http: HttpClient
	) { }

	/**
	 * Liste les feuilles de fair-play
	 */
	public liste(): Observable<FPForm[]> {
		return this.http.get<FPForm[]>("/api/fairplay");
	}

	/**
	 * Ajoute ou modifie une feuille de fair-play
	 * @param form
	 */
	public maj(form: FPForm): Observable<string> {
		return this.http.post<string>("/api/fairplay", form);
	}

	/**
	 * Supprime une feuille de fair-play
	 * @param form
	 */
	public supprime(form: FPForm): Observable<string> {
		return this.http.delete<string>("/api/fairplay/" + form.id);
	}
}

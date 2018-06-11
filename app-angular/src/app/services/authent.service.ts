import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthentService {

	constructor(
		private http: HttpClient
	) { }

	/**
	 * Essaie de se connecter si creds est fourni.
	 * Vérifie si l'utilisateur est connecté sinon.
	 * @param creds 
	 */
	public authentifie(creds?): Observable<boolean> {
		return new Observable<boolean>(observer => {
			this.http.get<Object>("/api/me", { params: creds }).subscribe(
				obj => { observer.next(true); observer.complete(); },
				err => { observer.next(false); observer.complete(); })
		});
	}
}

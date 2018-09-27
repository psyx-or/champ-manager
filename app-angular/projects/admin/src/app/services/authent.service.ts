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
		let body: FormData = new FormData();
		if (creds != null) {
			body.append('login', creds.login);
			body.append('password', creds.password);
		}

		return new Observable<boolean>(observer => {
			this.http.post<any>("/api/me", body).subscribe(
				obj => { observer.next(obj.roles.indexOf("ROLE_ADMIN") != -1); observer.complete(); },
				err => { observer.next(false); observer.complete(); })
		});
	}
}

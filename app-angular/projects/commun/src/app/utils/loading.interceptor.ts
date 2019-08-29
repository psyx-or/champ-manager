import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable, of, throwError, BehaviorSubject } from "rxjs";
import { finalize, catchError } from "rxjs/operators";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

	/** Compte le nombre de requêtes en cours */
	private static nbChargements: number = 0;

	/** Indique si un chargement est en cours */
	private static chargement$ = new BehaviorSubject(false);

	/**
	 * @returns Vrai si un chargement est en cours
	 */
	public static getChargement(): Observable<boolean> { return LoadingInterceptor.chargement$.asObservable(); }


	constructor(
	) { }

	/**
	 * Intercepte les requêtes
	 * @param req 
	 * @param next 
	 */
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		LoadingInterceptor.updateChargement(1);

		return next.handle(req).pipe(
			catchError((error: HttpErrorResponse) => {
				if (req.url == "/api/me") {
					return throwError(error);
				}
				else {
					alert(`Erreur lors de l'opération (${error.status})`)
					return of(null);
				}
			}),
			finalize(() => {
				LoadingInterceptor.updateChargement(-1);
			})
		);
	}

	/**
	 * Met à jour le nombre de requêtes en cours
	 * @param n 
	 */
	private static updateChargement(n: 1 | -1) {
		setTimeout( () => {
			LoadingInterceptor.nbChargements += n;
			LoadingInterceptor.chargement$.next(this.nbChargements > 0);
		});
	}
}

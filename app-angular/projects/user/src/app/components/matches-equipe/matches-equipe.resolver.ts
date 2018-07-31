import { Injectable } from "@angular/core";
import { Championnat } from "@commun/src/app/model/Championnat";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { RequeteService } from "@commun/src/app/services/requete.service";
import { MatchService } from "@commun/src/app/services/match.service";
import { Observable } from "rxjs";

@Injectable()
export class MatchesEquipeResolver implements Resolve<Championnat[]> {

	constructor(
		private requeteService: RequeteService,
		private matchService: MatchService
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Championnat[]> {
		const equipeId = +route.paramMap.get('equipeId');

		return this.requeteService.recupere(
			this.matchService.listeEquipe(equipeId)
		);
	}
}

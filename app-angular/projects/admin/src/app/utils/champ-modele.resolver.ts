import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { RequeteService } from "projects/commun/src/app/services/requete.service";
import { ChampionnatService } from "../services/championnat.service";
import { Observable } from "rxjs";
import { ChampModele } from "projects/commun/src/app/model/Championnat";

@Injectable()
export class ChampModeleResolver implements Resolve<ChampModele[]> {

	constructor(
		private requeteService: RequeteService,
		private championnatService: ChampionnatService,
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ChampModele[]> {
		return this.requeteService.recupere(
			this.championnatService.getModeles()
		);
	}
}

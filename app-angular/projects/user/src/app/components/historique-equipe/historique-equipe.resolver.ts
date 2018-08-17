import { Injectable } from "@angular/core";
import { Championnat } from "@commun/src/app/model/Championnat";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { RequeteService } from "@commun/src/app/services/requete.service";
import { Observable } from "rxjs";
import { ClassementService } from "@commun/src/app/services/classement.service";
import { ChampionnatEquipeDTO } from "@commun/src/app/model/ChampionnatEquipeDTO";

@Injectable()
export class HistoriqueEquipeResolver implements Resolve<ChampionnatEquipeDTO> {

	constructor(
		private requeteService: RequeteService,
		private classementService: ClassementService
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ChampionnatEquipeDTO> {
		const equipeId = +route.paramMap.get('equipeId');

		return this.requeteService.recupere(
			this.classementService.getHistoriqueEquipe(equipeId)
		);
	}
}

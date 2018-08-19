import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChampionnatsComponent } from './components/championnats/championnats.component';
import { ChampionnatResolver } from '@commun/src/app/utils/championnats.resolver';
import { ClassementResolver } from '@commun/src/app/utils/classement.resolver';
import { MatchesChampionnatComponent } from './components/matches-championnat/matches-championnat.component';
import { MatchesResolver } from '@commun/src/app/utils/matches.resolver';
import { CoupeComponent } from '@commun/src/app/components/coupe/coupe.component';
import { menus } from './utils/menus';
import { HierarchieResolver } from '@commun/src/app/components/coupe/hierarchie.resolver';
import { ClassementChampionnatComponent } from './components/classement-championnat/classement-championnat.component';
import { ClassementEquipeComponent } from './components/classement-equipe/classement-equipe.component';
import { ClassementEquipeResolver } from './components/classement-equipe/classement-equipe.resolver';
import { EquipeComponent } from './components/equipe/equipe.component';
import { EquipeResolver } from '@commun/src/app/utils/equipe.resolver';
import { MatchesEquipeComponent } from './components/matches-equipe/matches-equipe.component';
import { MatchesEquipeResolver } from './components/matches-equipe/matches-equipe.resolver';
import { HistoriqueEquipeComponent } from './components/historique-equipe/historique-equipe.component';
import { HistoriqueEquipeResolver } from './components/historique-equipe/historique-equipe.resolver';
import { EquipeEditionComponent } from './components/equipe-edition/equipe-edition.component';
import { CanDeactivateGuard } from '@commun/src/app/utils/can-deactivate.guard';

const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'championnats' },
	{ path: 'championnats', component: ChampionnatsComponent, resolve: { championnats: ChampionnatResolver } },
	{ path: 'classement/:champId', component: ClassementChampionnatComponent, resolve: { champ: ClassementResolver } },
	{ path: 'coupe/:champId', component: CoupeComponent, data: { menu: menus.championnat }, resolve: { journee: HierarchieResolver } },
	{ path: 'matches/:champId', component: MatchesChampionnatComponent, resolve: { champ: MatchesResolver } },
	{ path: 'equipe/classement/:equipeId', component: ClassementEquipeComponent, resolve: { dto: ClassementEquipeResolver } },
	{ path: 'equipe/matches/:equipeId', component: MatchesEquipeComponent, resolve: { equipe: EquipeResolver, championnats: MatchesEquipeResolver } },
	{ path: 'equipe/historique/:equipeId', component: HistoriqueEquipeComponent, resolve: { dto: HistoriqueEquipeResolver } },
	{ path: 'equipe/edit/:equipeId', component: EquipeEditionComponent, resolve: { equipe: EquipeResolver }, runGuardsAndResolvers: "always", canDeactivate: [CanDeactivateGuard] },
	{ path: 'equipe/:equipeId', component: EquipeComponent, resolve: { equipe: EquipeResolver }, runGuardsAndResolvers: "always" },
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" })],
    exports: [RouterModule]
})
export class AppRoutingModule { }

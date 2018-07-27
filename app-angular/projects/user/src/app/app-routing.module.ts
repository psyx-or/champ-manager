import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChampionnatsComponent } from './components/championnats/championnats.component';
import { ChampionnatResolver } from '@commun/src/app/utils/championnats.resolver';
import { ClassementComponent } from './components/classement/classement.component';
import { ClassementResolver } from '@commun/src/app/utils/classement.resolver';
import { MatchesChampionnatComponent } from './components/matches-championnat/matches-championnat.component';
import { MatchesResolver } from '@commun/src/app/utils/matches.resolver';

const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'championnats' },
	{ path: 'championnats', component: ChampionnatsComponent, resolve: { championnats: ChampionnatResolver }, runGuardsAndResolvers: "always" },
	// { path: 'journees/:champId', component: JourneesChampComponent, resolve: { champ: JourneesChampResolver }, canDeactivate: [CanDeactivateGuard] },
	{ path: 'classement/:champId', component: ClassementComponent, resolve: { champ: ClassementResolver } },
	// { path: 'coupe/:champId', component: CoupeComponent, resolve: { journee: HierarchieResolver } },
	{ path: 'matches/:champId', component: MatchesChampionnatComponent, resolve: { champ: MatchesResolver } },
	// { path: 'calendrier', component: CalendrierComponent, resolve: { sports: SportResolver } },
	// { path: 'equipe/:equipeId', component: EquipeComponent, resolve: { equipe: EquipeResolver }, runGuardsAndResolvers: "always", canDeactivate: [CanDeactivateGuard] },
	// { path: 'fairplay-classement', component: FairplayClassementComponent, resolve: { sports: SportResolver } },
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" })],
    exports: [RouterModule]
})
export class AppRoutingModule { }

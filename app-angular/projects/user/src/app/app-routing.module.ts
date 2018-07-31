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

const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'championnats' },
	{ path: 'championnats', component: ChampionnatsComponent, resolve: { championnats: ChampionnatResolver } },
	{ path: 'classement/:champId', component: ClassementChampionnatComponent, resolve: { champ: ClassementResolver } },
	{ path: 'coupe/:champId', component: CoupeComponent, data: { menu: menus.championnat }, resolve: { journee: HierarchieResolver } },
	{ path: 'matches/:champId', component: MatchesChampionnatComponent, resolve: { champ: MatchesResolver } },
	{ path: 'equipe/classement/:equipeId', component: ClassementEquipeComponent, resolve: { dto: ClassementEquipeResolver } },
	// { path: 'calendrier', component: CalendrierComponent, resolve: { sports: SportResolver } },
	{ path: 'equipe/:equipeId', component: EquipeComponent, resolve: { equipe: EquipeResolver } },
	// { path: 'fairplay-classement', component: FairplayClassementComponent, resolve: { sports: SportResolver } },
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" })],
    exports: [RouterModule]
})
export class AppRoutingModule { }

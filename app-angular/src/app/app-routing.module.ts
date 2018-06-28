import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChampionnatsComponent } from './components/championnats/championnats.component';
import { ChampCreationComponent } from './components/champ-creation/champ-creation.component';
import { JourneesChampComponent } from './components/journees-champ/journees-champ.component';
import { ClassementComponent } from './components/classement/classement.component';
import { CoupeComponent } from './components/coupe/coupe.component';
import { MatchesComponent } from './components/matches/matches.component';
import { ChampionnatResolver } from './components/championnats/championnats.resolver';
import { SportResolver } from './utils/sports.resolver';
import { JourneesChampResolver } from './components/journees-champ/journees-champ.resolver';
import { ClassementResolver } from './components/classement/classement.resolver';
import { MatchAvaliderComponent } from './components/match-avalider/match-avalider.component';
import { EquipesComponent } from './components/equipes/equipes.component';
import { CalendrierComponent } from './components/calendrier/calendrier.component';

const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'championnats' },
    { path: 'championnats', component: ChampionnatsComponent, resolve: { championnats: ChampionnatResolver } },
	{ path: 'champ-creation', component: ChampCreationComponent, resolve: { sports: SportResolver } },
	{ path: 'journees/:champId', component: JourneesChampComponent, resolve: { champ: JourneesChampResolver } }, // TODO: guard quand on quitte
	{ path: 'classement/:champId', component: ClassementComponent, resolve: { champ: ClassementResolver } },
	{ path: 'coupe/:champId', component: CoupeComponent },
	{ path: 'matches/avalider', component: MatchAvaliderComponent, resolve: { sports: SportResolver } },
	{ path: 'matches/:champId', component: MatchesComponent },
	{ path: 'equipes', component: EquipesComponent, resolve: { sports: SportResolver } }, // TODO: guard quand on quitte
	{ path: 'calendrier', component: CalendrierComponent, resolve: { sports: SportResolver } }, // TODO: guard quand on quitte
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

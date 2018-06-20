import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChampionnatsComponent } from './components/championnats/championnats.component';
import { ChampCreationComponent } from './components/champ-creation/champ-creation.component';
import { JourneesChampComponent } from './components/journees-champ/journees-champ.component';
import { ClassementComponent } from './components/classement/classement.component';
import { CoupeComponent } from './components/coupe/coupe.component';
import { MatchesComponent } from './components/matches/matches.component';
import { ChampionnatResolver } from './components/championnats/championnats.resolver';
import { ChampCreationResolver } from './components/champ-creation/champ-creation.resolver';
import { JourneesChampResolver } from './components/journees-champ/journees-champ.resolver';
import { ClassementResolver } from './components/classement/classement.resolver';

const routes: Routes = [
    { path: 'championnats', component: ChampionnatsComponent, resolve: { championnats: ChampionnatResolver } },
	{ path: 'champ-creation', component: ChampCreationComponent, resolve: { sports: ChampCreationResolver } },
	{ path: 'journees/:champId', component: JourneesChampComponent, resolve: { champ: JourneesChampResolver } },
	{ path: 'classement/:champId', component: ClassementComponent, resolve: { champ: ClassementResolver } },
	{ path: 'coupe/:champId', component: CoupeComponent },
	{ path: 'matches/:champId', component: MatchesComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

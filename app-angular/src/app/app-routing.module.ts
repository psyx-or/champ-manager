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
import { FairplayEditorComponent } from './components/fairplay-editor/fairplay-editor.component';
import { FpformsResolver } from './components/fairplay-editor/fairplay-forms.resolver';
import { FpformsResumeResolver } from './components/champ-creation/fairplay-forms-resume.resolver';
import { ChampModeleComponent } from './components/champ-modele/champ-modele.component';
import { ChampModeleResolver } from './utils/champ-modele.resolver';
import { ParametresComponent } from './components/parametres/parametres.component';
import { ParametresResolver } from './components/parametres/parametres.resolver';
import { EquipeComponent } from './components/equipe/equipe.component';
import { EquipeResolver } from './components/equipe/equipe.resolver';
import { CanDeactivateGuard } from './utils/can-deactivate.guard';

const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'championnats' },
	{ path: 'championnats', component: ChampionnatsComponent, resolve: { championnats: ChampionnatResolver }, runGuardsAndResolvers: "always" },
	{ path: 'champ-creation', component: ChampCreationComponent, resolve: { sports: SportResolver, fpForms: FpformsResumeResolver, modeles: ChampModeleResolver } },
	{ path: 'journees/:champId', component: JourneesChampComponent, resolve: { champ: JourneesChampResolver }, canDeactivate: [CanDeactivateGuard] },
	{ path: 'classement/:champId', component: ClassementComponent, resolve: { champ: ClassementResolver } },
	{ path: 'coupe/:champId', component: CoupeComponent },
	{ path: 'matches/avalider', component: MatchAvaliderComponent, resolve: { sports: SportResolver } },
	{ path: 'matches/:champId', component: MatchesComponent },
	{ path: 'equipes', component: EquipesComponent, resolve: { sports: SportResolver }, canDeactivate: [CanDeactivateGuard] },
	{ path: 'calendrier', component: CalendrierComponent, resolve: { sports: SportResolver } },
	{ path: 'fairplay-editor', component: FairplayEditorComponent, resolve: { fpforms: FpformsResolver }, runGuardsAndResolvers: "always", canDeactivate: [CanDeactivateGuard] },
	{ path: 'champ-modele', component: ChampModeleComponent, resolve: { sports: SportResolver, fpForms: FpformsResumeResolver, modeles: ChampModeleResolver }, runGuardsAndResolvers: "always", canDeactivate: [CanDeactivateGuard] },
	{ path: 'parametres', component: ParametresComponent, resolve: { parametres: ParametresResolver }, canDeactivate: [CanDeactivateGuard] },
	{ path: 'equipe/:equipeId', component: EquipeComponent, resolve: { equipe: EquipeResolver }, runGuardsAndResolvers: "always", canDeactivate: [CanDeactivateGuard] },
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" })],
    exports: [RouterModule]
})
export class AppRoutingModule { }

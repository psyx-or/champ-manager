import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChampionnatsComponent } from './components/championnats/championnats.component';
import { ChampionnatResolver } from '@commun/src/app/utils/championnats.resolver';
import { ClassementResolver } from '@commun/src/app/utils/classement.resolver';
import { MatchesChampionnatComponent } from './components/matches-championnat/matches-championnat.component';
import { MatchesResolver } from '@commun/src/app/utils/matches.resolver';
import { HierarchieResolver } from '@commun/src/app/components/coupe/hierarchie.resolver';
import { ClassementChampionnatComponent } from './components/classement-championnat/classement-championnat.component';
import { ClassementEquipeComponent } from './components/classement-equipe/classement-equipe.component';
import { ClassementEquipeResolver } from './components/classement-equipe/classement-equipe.resolver';
import { EquipeComponent } from './components/equipe/equipe.component';
import { EquipeResolver } from '@commun/src/app/utils/equipe.resolver';
import { MatchesEquipeComponent } from './components/matches-equipe/matches-equipe.component';
import { MatchesEquipeResolver } from './utils/matches-equipe.resolver';
import { HistoriqueEquipeComponent } from './components/historique-equipe/historique-equipe.component';
import { HistoriqueEquipeResolver } from './components/historique-equipe/historique-equipe.resolver';
import { EquipeEditionComponent } from './components/equipe-edition/equipe-edition.component';
import { CanDeactivateGuard } from '@commun/src/app/utils/can-deactivate.guard';
import { MatchesSaisieComponent } from './components/matches-saisie/matches-saisie.component';
import { CarteClubsComponent } from './components/carte-clubs/carte-clubs.component';
import { SportResolver } from '@commun/src/app/utils/sports.resolver';
import { DureeSaisieParamResolver } from './components/matches-saisie/dureesaisieparam.resolver';
import { CoupesEquipeComponent } from './components/coupes-equipe/coupes-equipe.component';
import { HierarchiesEquipeResolver } from './components/coupes-equipe/hierarchies-equipe.resolver';
import { SeuilsForfaitParamResolver } from '@commun/src/app/utils/seuils-forfait.resolver';
import { CoupeUserComponent } from './components/coupe-user/coupe-user.component';
import { SanctionEquipeParamResolver } from '@commun/src/app/utils/sanction-equipe.resolver';
import { SanctionEquipeComponent } from './components/sanction-equipe/sanction-equipe.component';
import { SanctionsComponent } from './components/sanctions/sanctions.component';
import { SanctionBaremeComponent } from './components/sanction-bareme/sanction-bareme.component';
import { SanctionBaremeResolver } from '@commun/src/app/utils/sanction-bareme.resolver';

const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'championnats' },
	{ path: 'championnats', component: ChampionnatsComponent, resolve: { championnats: ChampionnatResolver } },
	{ path: 'carte', component: CarteClubsComponent, resolve: { sports: SportResolver } },
	{ path: 'classement/:champId', component: ClassementChampionnatComponent, resolve: { champ: ClassementResolver, seuilsForfait: SeuilsForfaitParamResolver } },
	{ path: 'coupe/:champId', component: CoupeUserComponent, resolve: { journee: HierarchieResolver } },
	{ path: 'matches/:champId', component: MatchesChampionnatComponent, resolve: { champ: MatchesResolver } },
	{ path: 'equipe/classement/:equipeId', component: ClassementEquipeComponent, resolve: { dto: ClassementEquipeResolver, seuilsForfait: SeuilsForfaitParamResolver } },
	{ path: 'equipe/coupes/:equipeId', component: CoupesEquipeComponent, resolve: { equipe: EquipeResolver, journees: HierarchiesEquipeResolver } },
	{ path: 'equipe/matches/:equipeId', component: MatchesEquipeComponent, resolve: { equipe: EquipeResolver, championnats: MatchesEquipeResolver } },
	{ path: 'equipe/historique/:equipeId', component: HistoriqueEquipeComponent, resolve: { dto: HistoriqueEquipeResolver } },
	{ path: 'equipe/edit/:equipeId', component: EquipeEditionComponent, resolve: { equipe: EquipeResolver }, runGuardsAndResolvers: "always", canDeactivate: [CanDeactivateGuard] },
	{ path: 'equipe/saisie/:equipeId', component: MatchesSaisieComponent, resolve: { equipe: EquipeResolver, championnats: MatchesEquipeResolver, dureeSaisie: DureeSaisieParamResolver }, runGuardsAndResolvers: "always" },
	{ path: 'equipe/:equipeId', component: EquipeComponent, resolve: { equipe: EquipeResolver }, runGuardsAndResolvers: "always" },
	{ path: 'sanction-liste', component: SanctionsComponent, resolve: { sports: SportResolver } },
	{ path: 'sanction-bareme', component: SanctionBaremeComponent, resolve: { bareme: SanctionBaremeResolver } },
	{ path: 'sanction/:equipeId', component: SanctionEquipeComponent, resolve: { equipe: EquipeResolver, sanctions: SanctionEquipeParamResolver } },
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" })],
    exports: [RouterModule]
})
export class AppRoutingModule { }

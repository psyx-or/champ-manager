import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChampionnatsComponent } from './components/championnats/championnats.component';
import { ChampCreationComponent } from './components/champ-creation/champ-creation.component';
import { JourneesChampComponent } from './components/journees-champ/journees-champ.component';
import { ClassementComponent } from './components/classement/classement.component';

const routes: Routes = [
    { path: 'championnats', component: ChampionnatsComponent },
	{ path: 'champ-creation', component: ChampCreationComponent },
	{ path: 'journees/:champId', component: JourneesChampComponent },
	{ path: 'classement/:champId', component: ClassementComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'timeline',
        loadChildren: () => import('./timeline/timeline.module').then((m) => m.TimelineModule),
    },
    {
        path: 'timeline-vis',
        loadChildren: () => import('./timeline-vis/timeline-vis.module').then((m) => m.TimelineVisModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}

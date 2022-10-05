import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineVisComponent } from './timeline-vis.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [TimelineVisComponent],
    imports: [CommonModule, RouterModule.forChild([{ path: '', component: TimelineVisComponent }])],
})
export class TimelineVisModule {}

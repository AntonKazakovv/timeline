import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineComponent } from './timeline.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [TimelineComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: TimelineComponent }]),
  ],
})
export class TimelineModule {}

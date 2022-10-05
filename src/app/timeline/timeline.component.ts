import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { NumberValue } from 'd3';

@Component({
    selector: 'app-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements AfterViewInit {
    @ViewChild('svgConvas', { static: true }) svgConvas = new ElementRef(null);
    @ViewChild('groupWrapper', { static: true }) groupWrapper = new ElementRef(null);

    margin = { top: 0, right: 25, bottom: 20, left: 25 };
    width = 900 - this.margin.left - this.margin.right;
    height = 60 - this.margin.top - this.margin.bottom;

    constructor() {}

    createTimeline() {}

    ngAfterViewInit(): void {
        // x domain
        let x = d3.timeDays(new Date(2025, 0, 1), new Date(2025, 0, 6));

        // start with 10 ticks
        let startTicks = 10;

        // zoom function
        let zoom = d3
            .zoom()
            .on('zoom', (event) => {
                xScale = event.transform.rescaleX(xScale2);

                let zoomedRangeWidth = xScale.range()[1] - xScale.range()[0];
                // let zrw = zoomedRangeWidth.toFixed(4);
                // let kw = (t.k * this.width).toFixed(4);
                // let zt = startTicks * Math.floor(t.k);
                let tickDiff = xScale.ticks()[1].getMilliseconds() - xScale.ticks()[0].getMilliseconds();

                console.log(xScale.ticks()[1], xScale.ticks()[0]);
                let axis = d3.axisBottom(xScale).ticks(startTicks);
                // .tickFormat((d: Date | NumberValue) =>
                //     d instanceof Date ? d.toDateString().split(' ')[1][0] : d + ''
                // );

                //@ts-ignore
                svg.select('.x-axis').call(axis);

                let rt = xScale.ticks().length;
            })
            .scaleExtent([1, 60]);
        let yScale = d3.scaleLinear().domain([0, 6]).range([this.height, 0]);

        // x scale
        let xScale = d3
            .scaleTime()
            .domain(d3.extent(x) as Iterable<Date>)
            .range([0, this.width]);

        // x scale copy
        let xScale2 = xScale.copy();

        // svg
        let svg = d3
            .select(this.svgConvas.nativeElement)
            //@ts-ignore
            .call(zoom)
            .append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        // clippath
        svg.append('defs')
            .append('clipPath')
            .attr('id', 'clip')
            .append('rect')
            .attr('x', 0)
            .attr('width', this.width)
            .attr('height', this.height);

        // x-axis
        svg.append('g')
            .attr('class', 'x-axis')
            .attr('clip-path', 'url(#clip)')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(d3.axisBottom(xScale).ticks(startTicks));

        svg.append('g')
            .attr('class', 'y-axis')
            // .attr('transform', )
            //@ts-ignore
            .call(d3.axisLeft(yScale).ticks(6).tickFormat(''));

        let pointX = 3;
        let pointY = 0;

        svg.append('rect')
            .attr('cx', xScale(new Date(2025, 0, 6)))
            .attr('cy', yScale(1))
            .attr('width', 7)
            .attr('height', 7)
            .attr('fill', '#ff00008f');

        svg.append('rect')
            .attr('cx', pointX)
            .attr('cy', 1)
            .attr('width', 7)
            .attr('height', 7)
            .attr('fill', '#ff00008f');
    }
}

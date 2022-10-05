import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Timeline } from 'vis-timeline';
import { DataSet } from 'vis-data';

@Component({
    selector: 'app-timeline-vis',
    templateUrl: './timeline-vis.component.html',
    styleUrls: ['./timeline-vis.component.scss'],
})
export class TimelineVisComponent implements OnInit {
    @ViewChild('timeline', { static: true }) timelineContainer = new ElementRef(null);
    @ViewChild('rangeScreen', { static: true }) rangeScreen = new ElementRef(null);
    timeline: Timeline | null = null;
    options = {};
    data: any;
    groups: any = null;
    currentRange: { start: any; end: any } | null = null;
    selectableMode = false;

    constructor() {
        this.getTimelineData();
        this.getTimelineGroups();
        this.getOptions();
    }

    ngOnInit() {
        //@ts-ignore
        this.timeline = new Timeline(this.timelineContainer.nativeElement!, null, this.options);
        this.timeline.setGroups(this.groups);
        this.timeline.setItems(this.data);
        this.timeline.on('mouseDown', (props) => {
            if (this.selectableMode) {
                this.currentRange = { start: props, end: null };
            }
        });
        this.timeline.on('mouseUp', (props) => {
            if (this.selectableMode) {
                this.currentRange!.end = props;
                this.timeline?.setOptions({ moveable: true });
                console.log(this.currentRange);
            }
        });
    }

    selectRange() {
        this.timeline?.setOptions({ moveable: false });
        this.selectableMode = true;
    }

    mouseDownHandle(props: object) {
        console.log(1);
    }

    mouseUpHandle(props: object) {
        console.log(this.timeline);
        this.timeline?.setOptions({ moveable: true });
    }

    getTimelineGroups() {
        // create groups
        this.groups = new DataSet([
            { id: 1, content: ' ', className: 'custom-row', style: 'height:10px' },
            { id: 2, content: ' ', className: 'custom-row', style: 'height:10px' },
            { id: 3, content: ' ', className: 'custom-row', style: 'height:10px' },
            { id: 4, content: ' ', className: 'custom-row', style: 'height:10px' },
            { id: 5, content: ' ', className: 'custom-row', style: 'height:10px' },
            { id: 6, content: ' ', className: 'custom-row bookmarks', style: 'height:10px' },
        ]);
    }

    getTimelineData() {
        // Create a DataSet (allows two way data-binding)
        // create items
        let getRandom = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        };

        let dataList: object[] = [];
        let maxPoints = 50;
        for (let id = 1; id < maxPoints; id++) {
            let group = Math.floor(getRandom(1, 6));
            dataList.push({
                id: id,
                type: 'point',
                group: group,
                start: new Date(2022, 9, 4, getRandom(1, 22), getRandom(1, 60), 0),
                content: ' ',
                className: `my-dot item-${group}`,
            });
        }
        dataList.push({
            id: maxPoints + 1,
            type: 'point',
            group: 6,
            start: new Date(2022, 9, 4, 11, 0, 0),
            content: ' ',
            className: 'bookmark',
        });
        dataList.push({
            id: maxPoints + 2,
            type: 'point',
            group: 6,
            start: new Date(2022, 9, 4, 15, 0, 0),
            content: ' ',
            className: 'bookmark',
        });
        console.log(dataList);
        this.data = new DataSet(dataList);
        // this.data = new DataSet([
        //     {
        //         id: 1,
        //         type: 'point',
        //         group: 1,
        //         start: new Date(2022, 9, 4, 10, 50, 0),
        //         // end: new Date(2022, 9, 1, 11, 51, 0),
        //         content: ' ',
        //         className: 'my-dot item-1',
        //         style: 'border-color: red',
        //     },
        //     {
        //         id: 2,
        //         type: 'point',
        //         group: 2,
        //         start: new Date(2022, 9, 4, 11, 0, 0),
        //         content: ' ',
        //         className: 'my-dot item-2',
        //     },
        //     {
        //         id: 3,
        //         type: 'point',
        //         group: 3,
        //         start: new Date(2022, 9, 4, 11, 0, 0),
        //         content: ' ',
        //         className: 'my-dot item-3',
        //     },
        //     {
        //         id: 4,
        //         type: 'point',
        //         group: 4,
        //         start: new Date(2022, 9, 4, 11, 0, 0),
        //         content: ' ',
        //         className: 'my-dot item-4',
        //     },
        //     {
        //         id: 8,
        //         type: 'point',
        //         group: 5,
        //         start: new Date(2022, 9, 4, 11, 1, 0),
        //         content: ' ',
        //         className: 'my-dot item-5',
        //     },
        //     {
        //         id: 9,
        //         type: 'point',
        //         group: 5,
        //         start: new Date(2022, 9, 4, 11, 1, 0),
        //         content: ' ',
        //         className: 'my-dot item-5',
        //     },
        //     {
        //         id: 5,
        //         type: 'point',
        //         group: 5,
        //         start: new Date(2022, 9, 4, 11, 0, 0),
        //         content: ' ',
        //         className: 'my-dot item-5',
        //     },
        //     {
        //         id: 6,
        //         type: 'point',
        //         group: 6,
        //         start: new Date(2022, 9, 4, 11, 0, 0),
        //         content: ' ',
        //         className: 'bookmark',
        //     },
        //     {
        //         id: 7,
        //         type: 'point',
        //         group: 6,
        //         start: new Date(2022, 9, 4, 15, 0, 0),
        //         content: ' ',
        //         className: 'bookmark',
        //     },
        //     // {
        //     //     id: 4,
        //     //     group: 3,
        //     //     start: new Date(2022, 9, 4, 11, 0, 0),
        //     //     end: new Date(2022, 9, 4, 20, 0, 0),
        //     //     content: ' ',
        //     //     className: 'range',
        //     // },
        // ]);
    }

    getOptions() {
        this.options = {
            stack: false,
            start: new Date(),
            end: new Date(1000 * 60 * 60 * 24 + new Date().valueOf()),
            margin: {
                item: 5, // minimal margin between items
                axis: 2, // minimal margin between items and the axis
            },
            orientation: 'bottom',
            selectable: true,
            showCurrentTime: false,
            zoomFriction: 1,
            // height: '100px',
            zoomMin: 1000000,
            minHeight: '10px',
            // min: new Date(),
            // ma
        };
    }
}

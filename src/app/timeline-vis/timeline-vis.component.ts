import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Timeline, TimelineItem } from 'vis-timeline';
import { DataSet } from 'vis-data';

enum BtnOpacity {
    Active = 0.5,
    Disable = 0.15,
}

@Component({
    selector: 'app-timeline-vis',
    templateUrl: './timeline-vis.component.html',
    styleUrls: ['./timeline-vis.component.scss'],
})
export class TimelineVisComponent implements OnInit {
    @ViewChild('timeline', { static: true }) timelineContainer = new ElementRef(null);
    @ViewChild('rangeScreen', { static: true }) rangeScreen = new ElementRef(null);
    //Inputs

    timeline: Timeline | null = null;
    maxZoom = 7952400000;
    minZoom = 1000000;
    options = {};
    data: any;
    itemsList: TimelineItem[] = [];
    rangeId: number | null = null;
    startRangeId: number | null = null;
    endRangeId: number | null = null;
    groups: any = null;
    currentRange: { start: any; end: any } | null = null;
    selectableMode = false;
    toolbarOptions = {
        zoomInOpacity: BtnOpacity.Active,
        zoomOutOpacity: BtnOpacity.Active,
    };

    constructor() {
        this.getTimelineData();
        this.getTimelineGroups();
        this.getOptions();
    }

    ngOnInit() {
        //@ts-ignore
        this.timeline = new Timeline(this.timelineContainer.nativeElement!, this.data, this.options);
        this.timeline.setGroups(this.groups);
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
                this.createRangeItem(this.currentRange?.start.time, this.currentRange?.end.time);
            }
            this.selectableMode = false;
        });
        this.timeline.on('rangechanged', (s) => {
            let timelineW = this.timeline?.getWindow();
            if (timelineW) {
                //@ts-ignore
                let diff = timelineW.end - timelineW.start;
                diff <= this.minZoom ? (this.toolbarOptions.zoomInOpacity = BtnOpacity.Disable) : null;
                diff > this.minZoom ? (this.toolbarOptions.zoomInOpacity = BtnOpacity.Active) : null;
                diff >= this.maxZoom ? (this.toolbarOptions.zoomOutOpacity = BtnOpacity.Disable) : null;
                diff < this.maxZoom ? (this.toolbarOptions.zoomOutOpacity = BtnOpacity.Active) : null;
            }
        });
    }
    createRangeItem(start: Date, end: Date) {
        let group = [];
        // this.startRangeId = maxPoints + 4;
        this.data.add([
            {
                id: 1,
                group: 1,
                type: 'box',
                start: start,
                content: ' ',
                editable: {
                    remove: false,
                    updateGroup: false,
                    updateTime: true,
                },
                className: 'left-point-range',
            },
            {
                id: 2,
                group: 1,
                type: 'box',
                start: end,
                content: ' ',
                editable: {
                    remove: false,
                    updateGroup: false,
                    updateTime: true,
                },
                className: 'left-point-range',
            },
            {
                id: 3,
                // group: 1,
                type: 'background',
                start: start,
                end: end,
                content: ' ',
                editable: true,
            },
        ]);

        this.startRangeId = 1;
        this.endRangeId = 2;
        this.rangeId = 3;
        // this.timeline?.setItems(this.itemsList);
    }

    selectRange() {
        this.timeline?.setOptions({ moveable: false });
        this.selectableMode = true;
    }

    onZoomIn() {
        this.timeline?.zoomIn(1, { animation: true });
    }

    onZoomOut() {
        this.timeline?.zoomOut(1, { animation: true });
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
        let getRandom = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        };

        let dataList: object[] = [];
        let maxPoints = 50;
        for (let id = 4; id < maxPoints; id++) {
            let group = Math.floor(getRandom(1, 6));
            dataList.push({
                id: id,
                type: 'point',
                group: group,
                selectable: false,
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
        dataList.push({
            id: maxPoints + 3,
            // group: 1,
            start: new Date(2022, 9, 4, 11, 0, 0),
            end: new Date(2022, 9, 4, 20, 0, 0),
            content: ' ',
            className: 'range',
            editable: true,
        });

        this.itemsList = dataList as TimelineItem[];
        this.data = new DataSet(dataList);
    }

    getOptions() {
        this.options = {
            stack: false,
            start: new Date(2022, 9, 4),
            end: new Date(2022, 9, 5),
            margin: {
                item: 5, // minimal margin between items
                axis: 2, // minimal margin between items and the axis
            },
            locale: 'en',
            orientation: 'bottom',
            selectable: true,
            showCurrentTime: true,
            zoomFriction: 1,
            zoomMin: this.minZoom,
            zoomMax: this.maxZoom,
            minHeight: '10px',
            showWeekScale: true,
            onMoving: (elem: any, callback: Function) => {
                if (elem.id === this.startRangeId || elem.id === this.endRangeId) {
                    console.log(this.data.getIds());
                    if (elem.id === this.startRangeId) {
                        this.data.update({ id: this.rangeId, start: elem.start });
                    } else if (elem.id === this.endRangeId) {
                        this.data.update({ id: this.rangeId, end: elem.start });
                    }
                    this.data.update({ id: elem.id, start: elem.start });
                }
            },
        };
    }
}

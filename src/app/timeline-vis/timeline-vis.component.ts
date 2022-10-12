import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Timeline, TimelineItem } from 'vis-timeline';
import { DataSet } from 'vis-data';
import { logsJson } from './logs';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

enum BtnOpacity {
    Active = 0.5,
    Disable = 0.15,
}

enum RangeIds {
    leftEdge = 1,
    rightEdge = 2,
    firstBackground = 3,
    secondBackground = 4,
}

interface LogItem {
    app: string;
    branch: string;
    component: string;
    data: object;
    id: number;
    level: string;
    message: string;
    msg_count: number;
    seq_id: number;
    timestamp: string;
    version: string;
}

@Component({
    selector: 'app-timeline-vis',
    templateUrl: './timeline-vis.component.html',
    styleUrls: ['./timeline-vis.component.scss'],
})
export class TimelineVisComponent implements OnInit, OnDestroy {
    @ViewChild('timeline', { static: true }) timelineContainer = new ElementRef(null);
    @ViewChild('rangeScreen', { static: true }) rangeScreen = new ElementRef(null);

    timeline: Timeline | null = null;
    maxZoom = 7952400000;
    minZoom = 1000000;
    options = {};
    data: any = null;
    groups: any = null;
    selectableMode = false;
    isMouseDown = false;
    rangeBackAxis: Date | null = null;
    toolbarOptions = {
        zoomInOpacity: BtnOpacity.Active,
        zoomOutOpacity: BtnOpacity.Active,
    };
    isEdgeCross = false;
    counterL = RangeIds.leftEdge;
    counterR = RangeIds.rightEdge;
    logLevelToGroup = {
        info: 1,
        warning: 2,
        error: 3,
    };
    lastItemDate: Date | null = null;

    destroy$ = new Subject();
    bookmarks$ = new BehaviorSubject<number[]>([]);

    ngOnInit() {
        this.getTimelineGroups();
        this.getOptions();
        this.logsToTimelineItems(logsJson);
        this.initTimeline();

        this.createBookmarks();
        this.bookmarks$.next([683678959, 683678957, 683678948]);
    }

    ngOnDestroy() {
        this.destroy$.next(null);
        this.bookmarks$.complete();
    }

    initTimeline(): void {
        //@ts-ignore
        this.timeline = new Timeline(this.timelineContainer.nativeElement!, this.data, this.options);
        this.timeline.setGroups(this.groups);
        this.timeline.on('mouseDown', (props) => {
            if (this.selectableMode) {
                this.removeRange();

                this.isMouseDown = true;

                this.data.add([
                    {
                        id: RangeIds.firstBackground,
                        type: 'background',
                        start: props.time,
                        end: props.time,
                        content: ' ',
                    },
                ]);
                this.rangeBackAxis = props.time;
            }
        });
        this.timeline.on('mouseMove', (props) => {
            if (this.selectableMode && this.isMouseDown) {
                if (props.time < this.rangeBackAxis!) {
                    this.data.update({ id: RangeIds.firstBackground, start: props.time, end: this.rangeBackAxis });
                } else {
                    this.data.update({ id: RangeIds.firstBackground, end: props.time, start: this.rangeBackAxis });
                }
            }
        });
        this.timeline.on('mouseUp', (props) => {
            if (this.selectableMode) {
                this.timeline?.setOptions({ moveable: true });
                if (props.time < this.rangeBackAxis!) {
                    this.createRangeItem(props.time, this.rangeBackAxis!);
                } else {
                    this.createRangeItem(this.rangeBackAxis!, props.time);
                }
                this.data.remove(RangeIds.firstBackground);
            }

            this.isMouseDown = false;
            this.selectableMode = false;
        });
        this.timeline.on('rangechanged', (s) => {
            let timelineW = this.timeline?.getWindow();
            if (timelineW) {
                //@ts-ignore
                const diff = timelineW.end - timelineW.start;
                if (diff <= this.minZoom) this.toolbarOptions.zoomInOpacity = BtnOpacity.Disable;
                if (diff > this.minZoom) this.toolbarOptions.zoomInOpacity = BtnOpacity.Active;
                if (diff >= this.maxZoom) this.toolbarOptions.zoomOutOpacity = BtnOpacity.Disable;
                if (diff < this.maxZoom) this.toolbarOptions.zoomOutOpacity = BtnOpacity.Active;
            }
        });
    }

    logsToTimelineItems(logs: LogItem[]): void {
        const dataList = logs.map((log, ind) => {
            //@ts-ignore
            const group = this.logLevelToGroup[log.level];
            ind === 0 ? (this.lastItemDate = new Date(log.timestamp)) : null;
            return {
                id: log.id,
                type: 'point',
                group,
                selectable: false,
                start: new Date(log.timestamp),
                content: ' ',
                className: `my-dot item-${group}`,
            };
        });
        this.data = new DataSet(dataList);
    }

    createBookmarks(): void {
        this.bookmarks$
            .asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe((bookmarks) => {
                bookmarks.forEach((itemId, ind) => {
                    this.data.add({
                        id: ind + 1000,
                        type: 'point',
                        group: 6,
                        start: this.data.get(itemId).start,
                        content: ' ',
                        className: 'bookmark',
                    });
                });
            });
    }

    createRangeItem(start: Date, end: Date): void {
        this.data.add([
            {
                id: RangeIds.leftEdge,
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
                id: RangeIds.rightEdge,
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
                id: RangeIds.secondBackground,
                type: 'background',
                start: start,
                end: end,
                content: ' ',
                editable: true,
            },
        ]);
    }

    removeRange(): void {
        this.data.remove(RangeIds.leftEdge);
        this.data.remove(RangeIds.rightEdge);
        this.data.remove(RangeIds.firstBackground);
        this.data.remove(RangeIds.secondBackground);
    }

    selectRange(): void {
        this.timeline?.setOptions({ moveable: false });
        this.selectableMode = true;
    }

    onZoomIn(): void {
        this.timeline?.zoomIn(1, { animation: true });
    }

    onZoomOut(): void {
        this.timeline?.zoomOut(1, { animation: true });
    }

    getTimelineGroups(): void {
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

    goToDate(dateItem: Date): void {
        this.timeline?.moveTo(dateItem);
    }

    getOptions(): void {
        this.options = {
            stack: false,
            start: new Date(2022, 9, 4),
            end: new Date(2022, 9, 5),
            margin: {
                item: 5,
                axis: 2,
            },
            locale: 'en',
            orientation: 'bottom',
            selectable: true,
            zoomFriction: 1,
            zoomMin: this.minZoom,
            zoomMax: this.maxZoom,
            minHeight: '10px',
            showWeekScale: true,
            showCurrentTime: false,
            onMoving: (elem: any, callback: Function) => {
                const leftEdge = this.data.get(this.counterL);
                const rightEdge = this.data.get(this.counterR);
                if (elem.id === this.counterL || elem.id === this.counterR) {
                    this.isEdgeCross = leftEdge.start > rightEdge.start;

                    if (this.isEdgeCross) {
                        [this.counterL, this.counterR] = [this.counterR, this.counterL];
                    }
                    if (elem.id === this.counterL) {
                        this.data.update({
                            id: RangeIds.secondBackground,
                            start: elem.start,
                            end: rightEdge.start,
                        });
                        // this.rangeBackAxis = elem.start;
                    } else if (elem.id === this.counterR) {
                        this.data.update({
                            id: RangeIds.secondBackground,
                            start: leftEdge.start,
                            end: elem.start,
                        });
                    }

                    this.data.update({ id: elem.id, start: elem.start });
                }
            },
        };
    }
}

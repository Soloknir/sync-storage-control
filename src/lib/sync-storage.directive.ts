import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SyncStorageService } from './sync-storage.service';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[syncStorage]',
})
export class SyncStorageDirective implements OnInit, OnDestroy {
    @Input() path: string;

    private unsubscribe = new Subject<any>();

    constructor(private control: NgControl, private syncStorageService: SyncStorageService) { }

    ngOnInit(): void {
        if (!this.path) {
            throw Error('Input value "path" is required for storageSyncControl directive');
        }

        this.syncStorageService.getObservable(this.path)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((value) => {
                if (JSON.stringify(value) !== JSON.stringify(this.control.control.value)) {
                    this.control.control.setValue(value);
                }
            });

        this.control.control.valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((value) => this.syncStorageService.setControlValue(this.path, JSON.stringify(value) !== '{}' ? value : null));
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}

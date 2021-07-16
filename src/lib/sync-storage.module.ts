import { NgModule } from '@angular/core';

import { SyncStorageDirective } from './sync-storage.directive';
import { SyncStorageService } from './sync-storage.service';

@NgModule({
    declarations: [SyncStorageDirective],
    imports: [],
    exports: [SyncStorageDirective],
    providers: [SyncStorageService]
})
export class SyncStorageModule { }

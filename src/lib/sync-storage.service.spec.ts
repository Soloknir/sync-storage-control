import { TestBed } from '@angular/core/testing';

import { SyncStorageService } from './sync-storage.service';

describe('SyncStorageService', () => {
    let service: SyncStorageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SyncStorageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SyncStorageService {
    private storageSubjects: { [key: string]: BehaviorSubject<any> } = {};

    constructor() { }

    getObservable(path: string): Observable<any> {
        if (!this.storageSubjects[path]) {
            this.initializeSubjects(path);
        }

        return this.storageSubjects[path].asObservable();
    }

    getControlValue(path: string): any {
        const pathSteps = path.split('.');
        const item = JSON.parse(localStorage.getItem(pathSteps[0]) || '{}');
        return pathSteps.length === 1 ? item : this.getPropertyValue(pathSteps.slice(1), item);
    }

    setControlValue(path: string, value: any, callbackFn?: () => any): void {
        this.dropFields(path, value);

        const pathSteps = path.split('.');
        const stringItem = localStorage.getItem(pathSteps[0]) || '{}';
        const stringItemWithChanges = JSON.stringify(this.setPropertyValue(pathSteps.slice(1), JSON.parse(stringItem), value));

        if (stringItem !== stringItemWithChanges) {
            localStorage.setItem(pathSteps[0], stringItemWithChanges);
            this.updateFields(path, value);

            let relativePath;
            pathSteps.forEach((step: string) => {
                relativePath = relativePath ? `${relativePath}.${step}` : step;
                if (this.storageSubjects[relativePath]) {
                    const valueNext = this.getControlValue(relativePath);
                    this.storageSubjects[relativePath].next(valueNext);
                }
            });
        }

        // tslint:disable-next-line: no-unused-expression
        (typeof callbackFn === 'function') && callbackFn();
    }

    private getPropertyValue(pathSteps: string[], obj: any): any {
        return pathSteps.length > 1
            ? (this.getPropertyValue(pathSteps.slice(1), obj[pathSteps[0]] || {}))
            : (obj[pathSteps[0]] || null);
    }

    private setPropertyValue(pathSteps: string[], obj: any, value: any): void {
        if (pathSteps.length > 1) {
            obj[pathSteps[0]] = this.setPropertyValue(pathSteps.slice(1), obj[pathSteps[0]] || {}, value);
        } else {
            if (!obj[pathSteps[0]] || obj[pathSteps[0]] && JSON.stringify(obj[pathSteps[0]]) !== JSON.stringify(value)) {
                obj[pathSteps[0]] = value;
            }
        }

        return obj;
    }

    private initializeSubjects(path: string): void {
        let relativePath;
        path.split('.').forEach((step: string) => {
            relativePath = relativePath ? `${relativePath}.${step}` : step;
            if (!this.storageSubjects[relativePath]) {
                const value = this.getControlValue(relativePath);
                this.storageSubjects[relativePath] = new BehaviorSubject(value);
            }
        });
    }

    private findChildFields(path: string): string[] {
        return Object.keys(this.storageSubjects).filter(key => key !== path && key.startsWith(path));
    }

    private updateFields(path: string, value): void {
        const fields = value ? Object.keys(value) : null;
        this.findChildFields(path).map(key => {
            const fieldKey = key.slice(path.length + 1);

            // tslint:disable-next-line: no-unused-expression
            fields && fields.includes(fieldKey) && this.storageSubjects[key].next(value[fieldKey]);
        });

    }

    private dropFields(path: string, value): void {
        const fields = value ? Object.keys(value) : null;
        this.findChildFields(path).forEach(key => {
            const fieldKey = key.slice(path.length + 1);

            // tslint:disable-next-line: no-unused-expression
            !fields || !fields.includes(fieldKey) && this.storageSubjects[key].next(null);
        });
    }
}

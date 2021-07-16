# SyncStorageControl

## Installation

```bash
npm install npm install sync-storage-control --save
```

### Setup

Add SyncStorageModule into imports of your AppModule(or feature module)

```ts
  ...
  import { SyncStorageModule } from 'sync-storage-control';


  @NgModule({
      imports: [
          ...
          SyncStorageModule,
      ],
      ...
  })
  export class AppModule { }

```

### Using

Add syncStorage directive into your form control(or another with ngDefaultControl directive) and require field path value
"path" it is a path to object(or value) in your localStorage

```html

      <counter
          syncStorage
          ngDefaultControl
          [path]="'localStorageKey.value.childValue'"
          [formControl]="control"
      ></counter>
  
```



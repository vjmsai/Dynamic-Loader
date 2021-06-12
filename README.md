# Dynamic-Loader|
Example usage 
<dynamic-loader
    events="submitted, searched"
    module-url="sample bundle url"
    url="es5 bundle url"
    tag="component name "
    props='{"user-name": "all properties"}'
    (status)="status($event)"
    (loaded)="elementLoaded($event)"
    (submitted)="loadedComponentSubmittedEvent($event)"
    (searched)="loadedComponentSearchedEvent($event)"
>
  <div slot="loader">
    // Loader UI
  </div>
  <div slot="error">
    // Error UI
  </div>
</dynamic-loader>

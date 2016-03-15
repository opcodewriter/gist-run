export function configure(aurelia) {
  aurelia.use
         .standardConfiguration()
         .plugin('aurelia-dialog');

  aurelia.start()
    .then(() => {
      if ('serviceWorker' in navigator) {
        if (/\/embed/.test(location.href)) {
          aurelia.setRoot('ui/embed/app');
        } else {
          aurelia.setRoot('ui/app');
        }
        return;
      }
      aurelia.setRoot('ui/fallback');
    });
}

// eslint-disable-next-line
(function(app) {
  const moduleName = 'videoSlider';
  // eslint-disable-next-line
  const templateUrl = templateUrlGenerateStateless(moduleName);
  // '/app/components/head-search/head-search.template.html';
  // START MODULE
  // --------------------------------------------------

  const bindings = {
    title: '@',
    fa: '@',
    links: '=',
    href: '@',
  };

  function controller() {}

  // --------------------------------------------------
  // LOAD component
  app.component(moduleName, { templateUrl, controller, bindings });
  // END module
  // eslint-disable-next-line
})(app);
(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Theme": {
        "usage": "dynamic",
        "require": true
      },
      "hoiphadaock.theme.Color": {
        "require": true
      },
      "hoiphadaock.theme.Decoration": {
        "require": true
      },
      "hoiphadaock.theme.Font": {
        "require": true
      },
      "qx.theme.icon.Tango": {
        "require": true
      },
      "hoiphadaock.theme.Appearance": {
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     Copyright: 2022 undefined
  
     License: MIT license
  
     Authors: undefined
  
  ************************************************************************ */
  qx.Theme.define("hoiphadaock.theme.Theme", {
    meta: {
      color: hoiphadaock.theme.Color,
      decoration: hoiphadaock.theme.Decoration,
      font: hoiphadaock.theme.Font,
      icon: qx.theme.icon.Tango,
      appearance: hoiphadaock.theme.Appearance
    }
  });
  hoiphadaock.theme.Theme.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Theme.js.map?dt=1656679404699
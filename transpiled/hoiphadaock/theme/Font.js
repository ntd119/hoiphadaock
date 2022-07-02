(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Theme": {
        "usage": "dynamic",
        "require": true
      },
      "qx.theme.indigo.Font": {
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
  qx.Theme.define("hoiphadaock.theme.Font", {
    extend: qx.theme.indigo.Font,
    fonts: {
      "default": {
        size: 16,
        lineHeight: 1.4,
        family: ["Segoe UI"],
        color: "#212529"
      }
    }
  });
  hoiphadaock.theme.Font.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Font.js.map?dt=1656765909887
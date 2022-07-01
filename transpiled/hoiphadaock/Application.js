(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.application.Standalone": {
        "require": true
      },
      "qx.log.appender.Native": {},
      "qx.log.appender.Console": {},
      "qx.ui.table.model.Simple": {},
      "qx.ui.table.Table": {},
      "qx.ui.table.selection.Model": {},
      "qx.ui.table.cellrenderer.Conditional": {},
      "qx.ui.table.cellrenderer.Image": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     Copyright: 2022 undefined
  
     License: MIT license
  
     Authors: undefined
  
  ************************************************************************ */

  /**
   * This is the main application class of "hoiphadaock"
   *
   * @asset(hoiphadaock/*)
   */
  qx.Class.define("hoiphadaock.Application", {
    extend: qx.application.Standalone,

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      /**
       * This method contains the initial application code and gets called
       * during startup of the application
       *
       * @lint ignoreDeprecated(alert)
       */
      main: function main() {
        // Call super class
        hoiphadaock.Application.superclass.prototype.main.call(this); // Enable logging in debug variant

        {
          // support native logging capabilities, e.g. Firebug for Firefox
          qx.log.appender.Native; // support additional cross-browser console. Press F7 to toggle visibility

          qx.log.appender.Console;
        }
        /*
        -------------------------------------------------------------------------
          Below is your actual application code...
        -------------------------------------------------------------------------
        */
        // table model

        var tableModel = new qx.ui.table.model.Simple();
        tableModel.setColumns(["ID", "Number 1", "Number 2", "Image"]);
        var image = ["icon/16/actions/dialog-ok.png", "icon/16/actions/dialog-cancel.png"];
        var rowData = [];

        for (var row = 0; row < 100; row++) {
          var x = Math.random() * 1000;
          rowData.push([row, x, x, image[Math.floor(x) % 2]]);
        }

        tableModel.setData(rowData);
        tableModel.setColumnEditable(1, true);
        tableModel.setColumnEditable(2, true); // table

        var table = new qx.ui.table.Table(tableModel);
        table.setMetaColumnCounts([1, -1]);
        var selectionMode = qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION;
        table.getSelectionModel().setSelectionMode(selectionMode);
        var newRenderer = new qx.ui.table.cellrenderer.Conditional("right", "", "", "");
        newRenderer.addNumericCondition(">", 0, null, "#FF0000", null, null);
        newRenderer.addNumericCondition(">", 50, null, "#EE0011", null, null);
        newRenderer.addNumericCondition(">", 100, null, "#DD0022", null, null);
        newRenderer.addNumericCondition(">", 150, null, "#CC0033", null, null);
        newRenderer.addNumericCondition(">", 200, null, "#BB0044", null, null);
        newRenderer.addNumericCondition(">", 250, null, "#AA0055", null, null);
        newRenderer.addNumericCondition(">", 300, null, "#990066", null, null);
        newRenderer.addNumericCondition(">", 350, null, "#880077", null, null);
        newRenderer.addNumericCondition(">", 400, null, "#770088", null, null);
        newRenderer.addNumericCondition(">", 450, null, "#660099", null, null);
        newRenderer.addNumericCondition(">", 500, null, "#5500AA", null, null);
        newRenderer.addNumericCondition(">", 550, null, "#4400BB", null, null);
        newRenderer.addNumericCondition(">", 600, null, "#3300CC", null, null);
        newRenderer.addNumericCondition(">", 650, null, "#2200DD", null, null);
        newRenderer.addNumericCondition(">", 700, null, "#1100EE", null, null);
        newRenderer.addNumericCondition(">", 750, null, "#0000FF", null, null);
        newRenderer.addNumericCondition(">", 800, null, "#0033FF", null, null);
        newRenderer.addNumericCondition(">", 850, null, "#0066FF", null, null);
        newRenderer.addNumericCondition(">", 900, null, "#0099FF", null, null);
        newRenderer.addNumericCondition(">", 950, "center", "#00CCFF", null, "bold");
        table.getTableColumnModel().setDataCellRenderer(2, newRenderer);
        var renderer = new qx.ui.table.cellrenderer.Image();
        table.getTableColumnModel().setDataCellRenderer(3, renderer);
        this.getRoot().add(table);
      }
    }
  });
  hoiphadaock.Application.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Application.js.map?dt=1656680576723
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
      "qx.ui.table.model.Simple": {},
      "qx.ui.table.Table": {},
      "qx.ui.table.selection.Model": {},
      "qx.ui.table.cellrenderer.Conditional": {},
      "qx.ui.table.cellrenderer.Image": {},
      "qx.io.request.Xhr": {}
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
  qx.Class.define("hoiphadaock.CpDaMua", {
    extend: qx.application.Standalone,
    members: {
      createTable: function createTable() {
        // table model
        var tableModel = new qx.ui.table.model.Simple();
        tableModel.setColumns(["STT", "Mã CK", "Name", "Ai Mua?", "Giá mua", "Lãi/Lỗ", "Giá hiện tại", "Giá min \ntrong tuần", "Giá max \ntrong tuần", "% Giá Max-Min", "% Giá hiện tại\nso với giá max", "Min Time", "Max Time", "Giá trần", "Giá sàn", "Giá mở cửa", "Có trong\nInfina"]);
        var image = ["icon/16/actions/dialog-ok.png", "icon/16/actions/dialog-cancel.png"];

        var cpDaMua = this._read_file();

        console.log(cpDaMua);
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
        return table;
      },
      call_api: function call_api() {
        var request = new qx.io.request.Xhr("https://s.cafef.vn/ajax/marketmap.ashx?stock=1&type=1&cate=");
        request.setAccept("application/json");
        request.setParser("json");
        request.addListener("success", function (e) {
          var req = e.getTarget();
          var response = req.getResponse();
        }, this);
        request.send();
      },
      _read_file: function _read_file() {
        var file_name = "data/da_mua.json";
        var text = '{"EIB":{"bought":31400},"HBC":{"bought":21100},"OCB":{"bought":20350},"VHC":{"bought":102500},"BCM":{"bought":72300},"LPB":{"bought":13150},"CTG":{"bought":25250},"VSH":{"bought":46100},"DPM":{"bought":48900},"VIB":{"bought":20900},"VIP":{"bought":6330},"AST":{"bought":57900}}';
        return JSON.parse(text);
      }
    }
  });
  hoiphadaock.CpDaMua.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=CpDaMua.js.map?dt=1656726889789
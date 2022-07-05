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
      "qx.event.Timer": {},
      "qx.io.request.Xhr": {},
      "qx.ui.table.Table": {},
      "qx.ui.table.selection.Model": {},
      "qx.ui.table.cellrenderer.Html": {}
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
      timer: null,
      createTable: function createTable() {
        var BACKGROUND_LO = "#F33232";
        var BACKGROUND_LAI = "#00E11A";
        var BACKGROUND_TRAN = "#860D98";
        var BACKGROUND_TANG = "#00E11A";
        var BACKGROUND_DUNG = "#FEA50C";
        var BACKGROUND_GIAM = "#F33232";
        var BACKGROUND_SAN = "#0A8AE3";
        var BACKGROUND_NONE = "#FFFFFF"; // table model

        var tableModel = this._tableModel = new qx.ui.table.model.Simple();
        tableModel.setColumns(["Mã CK", "Name", "Người mua", "Giá mua", "Lãi/Lỗ", "Giá hiện tại", "Giá min \ntrong tuần", "Giá max \ntrong tuần", "% Giá Max-Min", "% Giá hiện tại\nso với giá max", "Min Time", "Max Time", "Giá trần", "Giá sàn", "Giá mở cửa", "Có trong\nInfina"]);

        var cpDaMua = this._read_file();

        var rowData = [];

        for (var key in cpDaMua) {
          var cp = cpDaMua[key];
          var giaDaMua = cp["bought"];
          var nguoiMua = cp["buyer"];
          rowData.push([key, "", nguoiMua, giaDaMua]);
        }

        tableModel.setData(rowData);
        this.timer = new qx.event.Timer(5000);
        this.timer.addListener("interval", function (e) {
          var request = new qx.io.request.Xhr("https://s.cafef.vn/ajax/marketmap.ashx?stock=1&type=1&cate=");
          request.setAccept("application/json");
          request.setParser("json");
          request.addListener("success", function (e) {
            var req = e.getTarget();
            var response = req.getResponse();
            var rowData = tableModel.getRowCount();

            for (var i = 0; i < rowData; i++) {
              var stock_code = tableModel.getValue(0, i);
              var filter_data = response.filter(function (x) {
                return x.NoneSymbol === stock_code;
              })[0];
              console.log("ma ck = " + stock_code);
              var stock_name = filter_data["Name"];
              tableModel.setValue(1, i, stock_name); // Giá hiện tại

              var giaHienTai = filter_data["Price"] * 1000; // Phần trăm thay đổi hiện tại

              var percent_current = filter_data["Percent"];
              var color_percent_current = BACKGROUND_DUNG;

              if (percent_current == 0) {
                color_percent_current = BACKGROUND_DUNG;
              } else if (percent_current > 0) {
                color_percent_current = BACKGROUND_TANG;
              } else if (percent_current < 0) {
                color_percent_current = BACKGROUND_GIAM;
              }

              var giaHienTai_html = "<div style='background-color: " + color_percent_current + ";'>" + giaHienTai + "(" + percent_current + "%)</div>";
              tableModel.setValue(5, i, giaHienTai_html); // Lãi/lỗ

              var giaDaMua_new = tableModel.getValue(3, i);
              var percent_change = parseFloat((giaHienTai - giaDaMua_new) / giaDaMua_new * 100).toFixed(2);
              var color = BACKGROUND_LAI;

              if (percent_change < 0) {
                color = BACKGROUND_LO;
              }

              var percent_change_html = "<div style='background-color: " + color + ";'>" + percent_change + "%</div>";
              tableModel.setValue(4, i, percent_change_html);
            }
          });
          request.send();
        }, this);
        this.timer.start(); // table

        var table = new qx.ui.table.Table(tableModel);
        table.setMetaColumnCounts([1, -1]);
        var selectionMode = qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION;
        table.getSelectionModel().setSelectionMode(selectionMode);
        table.getTableColumnModel().setDataCellRenderer(4, new qx.ui.table.cellrenderer.Html());
        table.getTableColumnModel().setDataCellRenderer(5, new qx.ui.table.cellrenderer.Html());
        table.set({
          width: 700
        });
        return table;
      },
      stop_timer: function stop_timer() {
        alert("stop timer");
      },
      _update_table: function _update_table(tableModel) {
        // tableModel.setValue(1, 1, "xxx");
        console.log(new Date());
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
        var file_name = "data/da_mua.json"; //   const text =
        //     '{"EIB":{"bought":31400,"buyer":"Tuyết-NTA"},"HBC":{"bought":21100,"buyer":"Mỹ Mỹ"},"OCB":{"bought":20350,"buyer":"Mỹ Đạt"},"VHC":{"bought":102500,"buyer":"Đạt-NT"},"BCM":{"bought":72300,"buyer":"Tuyết-NTA"},"LPB":{"bought":13150,"buyer":"Mỹ Mỹ"},"CTG":{"bought":25250,"buyer":"Đạt-NT"},"VSH":{"bought":46100,"buyer":"Đạt-NT"},"DPM":{"bought":48900,"buyer":""},"VIB":{"bought":20900,"buyer":"Đạt-NT"},"VIP":{"bought":6330,"buyer":"Đạt-NT"},"AST":{"bought":57900,"buyer":""}}';

        var text = '{"EIB":{"bought":31400,"buyer":"Tuyết-NTA"},"HBC":{"bought":21100,"buyer":"Mỹ Mỹ"},"OCB":{"bought":20350,"buyer":"Mỹ Đạt"},"VHC":{"bought":102500,"buyer":"Đạt-NT"},"BCM":{"bought":72300,"buyer":"Tuyết-NTA"},"LPB":{"bought":13150,"buyer":"Mỹ Mỹ"},"VSH":{"bought":46100,"buyer":"Đạt-NT"},"VIB":{"bought":20900,"buyer":"Đạt-NT"},"VIP":{"bought":6330,"buyer":"Đạt-NT"},"MWG":{"bought":66700,"buyer":"Tuyết-NTA"},"PNJ":{"bought":118100,"buyer":"Tuyết-NTA"}}';
        return JSON.parse(text);
      }
    } // destruct() {
    //   this._disposeObjects("_tableModel");
    //   alert("huye");
    // },

  });
  hoiphadaock.CpDaMua.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=CpDaMua.js.map?dt=1656991622409
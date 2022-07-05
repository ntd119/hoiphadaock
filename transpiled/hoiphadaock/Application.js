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
      "qx.ui.treevirtual.TreeVirtual": {},
      "qx.ui.treevirtual.MNode": {},
      "qx.ui.container.Composite": {},
      "qx.ui.layout.HBox": {},
      "qx.ui.groupbox.GroupBox": {},
      "qx.ui.layout.VBox": {},
      "hoiphadaock.CpDaMua": {}
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
        hoiphadaock.Application.superclass.prototype.main.call(this);
        qx.Class.include(qx.ui.treevirtual.TreeVirtual, qx.ui.treevirtual.MNode);
        var stock_table = null; // Use an HBox to hold the tree and the groupbox

        var hBox = new qx.ui.container.Composite(new qx.ui.layout.HBox(20));
        this.getRoot().add(hBox, {
          edge: 30
        }); // tree

        var tree = new qx.ui.treevirtual.TreeVirtual("Select");
        tree.set({
          width: 400
        });
        tree.setAlwaysShowOpenCloseSymbol(true); // Obtain the resize behavior object to manipulate

        var resizeBehavior = tree.getTableColumnModel().getBehavior(); // Ensure that the tree column remains sufficiently wide

        resizeBehavior.set(0, {
          width: "1*",
          minWidth: 180
        });
        hBox.add(tree); // tree data model

        var dataModel = tree.getDataModel();
        var te1 = dataModel.addBranch(null, "Stock list", true); // tree.nodeSetLabelStyle(
        //   te1,
        //   "background-color: red; " + "color: white;" + "font-weight: bold;"
        // );

        var te1_1;
        dataModel.addBranch(te1, "Cp theo dõi", true);
        te1_1 = dataModel.addBranch(te1, "Cp đã mua", true);
        dataModel.addBranch(te1, "Network", true); // tree.nodeSetCellStyle(te, "background-color: cyan;");

        var te2 = dataModel.addBranch(null, "Inbox", true);
        dataModel.addBranch(te2, "Sent", false);
        dataModel.addBranch(te2, "Trash", false);
        dataModel.addBranch(te2, "Data", false);
        dataModel.addBranch(te2, "Edit", false);
        dataModel.setData();
        var commandFrame = new qx.ui.groupbox.GroupBox("Danh sách cổ phiếu");
        commandFrame.setLayout(new qx.ui.layout.VBox(8));
        hBox.add(commandFrame);
        var cpdamua = new hoiphadaock.CpDaMua();
        stock_table = cpdamua.createTable();
        commandFrame.add(stock_table); // var url = qx.util.ResourceManager.getInstance().toUri(
        //   "hoiphadaock/da_mua.json"
        // );
        // var store = new qx.data.store.Json(url);
        // console.log(url);

        tree.addListener("changeSelection", function (e) {
          var text;
          var selectedNodes = e.getData();

          for (var i = 0; i < selectedNodes.length; i++) {
            text = selectedNodes[i].label;
          }

          if (text == "Cp đã mua") {// stock_table.stop_timer();
            // stock_table.createTable()();
            // commandFrame.removeAll();
            // var cpdamua = new hoiphadaock.CpDaMua();
            // var table = cpdamua.createTable();
            // commandFrame.add(table);
          }
        });
      }
    }
  });
  hoiphadaock.Application.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Application.js.map?dt=1656991620631
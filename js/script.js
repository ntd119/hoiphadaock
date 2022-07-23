$(document).ready(function () {
  const HEADER_TABLE = [
    "STT",
    "Status",
    "Code",
    "Lãi/Lỗ",
    "Giá mua",
    "Giá hiện tại",
  ];
  const DA_MUA_FILE = "./data/da_mua.json";
  const BACKGROUND_LO = "#ff0017";
  const BACKGROUND_LAI = "#0bdf39";
  const BACKGROUND_TRAN = "#860D98";
  const BACKGROUND_TANG = "#00E11A";
  const BACKGROUND_DUNG = "#FEA50C";
  const BACKGROUND_GIAM = "#F33232";
  const BACKGROUND_SAN = "#0A8AE3";
  const BACKGROUND_NONE = "#FFFFFF";
  let da_mua_data = "";
  let THEO_DOI_DATA = "";
  async function loadIntoTable() {
    let table = document.getElementById("table_da_mua");
    const tableHead = table.querySelector("thead");
    const tableBody = table.querySelector("tbody");
    const response = await fetch(DA_MUA_FILE);
    da_mua_data = await response.json();

    // clear the table
    tableHead.innerHTML = "<tr></tr>";
    tableBody.innerHTML = "";

    // Populate the header
    for (const headerText of HEADER_TABLE) {
      const headerElement = document.createElement("th");
      headerElement.textContent = headerText;
      tableHead.querySelector("tr").appendChild(headerElement);
    }
    let stt = 1;
    for (const key in da_mua_data) {
      const rowElement = document.createElement("tr");

      // STT
      const sttElement = document.createElement("td");
      sttElement.textContent = stt;
      rowElement.appendChild(sttElement);

      // Status
      const statusElement = document.createElement("td");
      statusElement.textContent = "";
      statusElement.setAttribute("id", "status" + stt);
      rowElement.appendChild(statusElement);

      // Mã chứng khoán
      const maCKElement = document.createElement("td");
      let link = document.createElement("a");
      link.setAttribute(
        "href",
        "https://vn.tradingview.com/symbols/HOSE-" + key
      );
      link.setAttribute("target", "_blank");
      link.textContent = key;
      maCKElement.appendChild(link);
      rowElement.appendChild(maCKElement);

      // Lãi lỗ
      const laiLoElement = document.createElement("td");
      laiLoElement.setAttribute("id", "lailo" + stt);
      laiLoElement.textContent = "";
      rowElement.appendChild(laiLoElement);

      // Giá mua
      let giaDaMua = da_mua_data[key]["bought"];
      const giaMuaElement = document.createElement("td");
      giaMuaElement.textContent = giaDaMua.toLocaleString("en-US");
      rowElement.appendChild(giaMuaElement);

      // Giá mua hidden
      let giaMuaInputHidden = document.createElement("input");
      giaMuaInputHidden.setAttribute("type", "hidden");
      giaMuaInputHidden.setAttribute("id", "giadamua" + stt);
      giaMuaInputHidden.setAttribute("value", giaDaMua);
      rowElement.appendChild(giaMuaInputHidden);

      // Giá hiện tại
      const giaHienTaiElement = document.createElement("td");
      giaHienTaiElement.setAttribute("id", "giahientai" + stt);
      giaHienTaiElement.textContent = "";
      rowElement.appendChild(giaHienTaiElement);

      tableBody.appendChild(rowElement);
      stt++;
    }
  }

  function format_price(number) {
    return number.toLocaleString("en-US");
  }

  function leading_zero(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
  }

  function clear_log() {
    $("#logAPI").html("");
  }

  function updateClass() {
    $.ajax({
      url: "https://s.cafef.vn/ajax/marketmap.ashx?stock=1&type=1&cate=",
      // url: "https://api.vietstock.vn/finance/sectorInfo_v2?sectorID=0&catID=0&capitalID=0&languageID=1",
      dataType: "JSON",
      beforeSend: function (request) {
        // request.setRequestHeader("User-Agent","Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36");
        // request.setRequestHeader("Accept-Language","en,ja;q=0.9,vi;q=0.8,zh;q=0.7,en-US;q=0.6,fr-FR;q=0.5,fr;q=0.4");
      },
      error: function (msg) {
        $("#logAPI").html(msg);
        return msg;
      },
      success: function (response) {
        let stt = 1;
        for (const key in da_mua_data) {
          let filter_data = response.filter((x) => x.NoneSymbol === key)[0];

          // Giá hiện tại
          let percent = parseFloat(filter_data["Percent"]);
          let giaHienTai = filter_data["Price"] * 1000;
          if (percent >= 0) {
            $("#giahientai" + stt).html(
              "<div style='color: " +
                BACKGROUND_LAI +
                "'>" +
                format_price(giaHienTai) +
                "(" +
                percent +
                '%)<i class="fa-solid fa-caret-up" style="color:' +
                BACKGROUND_LAI +
                '"</div>'
            );
          } else {
            $("#giahientai" + stt).html(
              "<div style='color: " +
                BACKGROUND_LO +
                "'>" +
                format_price(giaHienTai) +
                "(" +
                percent +
                '%)<i class="fa-solid fa-caret-down" style="color:' +
                BACKGROUND_LO +
                '"</div>'
            );
          }

          //  lãi lỗ
          let giaDaMua = $("#giadamua" + stt).val();
          let percent_change = parseFloat(
            ((giaHienTai - giaDaMua) / giaDaMua) * 100
          ).toFixed(2);
          if (percent_change >= 0) {
            $("#lailo" + stt).html(
              '<strong><div style="color: ' +
                BACKGROUND_LAI +
                '";font-weight: bold;>' +
                format_price(percent_change) +
                "%" +
                '<i class="fa-solid fa-caret-up" style="color:' +
                BACKGROUND_LAI +
                ' ;"></i></div></strong>'
            );
          } else {
            $("#lailo" + stt).html(
              '<strong><div style="color: ' +
                BACKGROUND_LO +
                '";font-weight: bold;>' +
                format_price(percent_change) +
                "%" +
                '<i class="fa-solid fa-caret-down" style="color:' +
                BACKGROUND_LO +
                ' ;"></i></div></strong>'
            );
          }

          // status
          if (percent_change >= 4) {
            $("#status" + stt).html(
              '<div style="background-color:' + BACKGROUND_LAI + ';">Bán</div>'
            );
          } else if (percent_change <= -4) {
            $("#status" + stt).html(
              '<div style="background-color:' +
                BACKGROUND_LO +
                ';">Cắt lỗ</div>'
            );
          } else {
            $("#status" + stt).html("");
          }

          stt++;
        }
        let today = new Date();
        let date =
          leading_zero(today.getDate(), 2) +
          "-" +
          leading_zero(today.getMonth() + 1, 2) +
          "-" +
          today.getFullYear();

        let hour =
          leading_zero(today.getHours(), 2) +
          ":" +
          leading_zero(today.getMinutes(), 2) +
          ":" +
          leading_zero(today.getSeconds(), 2);
        let log = $("#logAPI").val();
        $("#logAPI").html(
          log + "Update giá cổ phiếu: " + date + ": " + hour + "\n"
        );

        // update giá bảng theo dõi
        let stt_theodoi = 1;
        for (const key_theo_doi in THEO_DOI_DATA) {
          let filter_data_theodoi = response.filter(
            (x) => x.NoneSymbol === key_theo_doi
          )[0];
          // Giá hiện tại
          let percent_theodoi = parseFloat(filter_data_theodoi["Percent"]);
          let giaHienTai_theodoi = filter_data_theodoi["Price"] * 1000;
          if (percent_theodoi >= 0) {
            $("#giahientai_theodoi" + stt_theodoi).html(
              "<div style='color: " +
                BACKGROUND_LAI +
                "'>" +
                format_price(giaHienTai_theodoi) +
                "(" +
                percent_theodoi +
                '%)<i class="fa-solid fa-caret-up" style="color:' +
                BACKGROUND_LAI +
                '"</div>'
            );
          } else {
            $("#giahientai_theodoi" + stt_theodoi).html(
              "<div style='color: " +
                BACKGROUND_LO +
                "'>" +
                format_price(giaHienTai_theodoi) +
                "(" +
                percent_theodoi +
                '%)<i class="fa-solid fa-caret-down" style="color:' +
                BACKGROUND_LO +
                '"</div>'
            );
          }
          stt_theodoi++;
        }
      },
    });
  }

  async function loadTableTheodoi() {
    const THEO_DOI_HEADER = [
      "STT",
      "Code",
      "Giá lý tưởng",
      "% mong chờ",
      "Giá hiện tại",
    ];

    let table = document.getElementById("table_theo_doi");
    const tableHead = table.querySelector("thead");
    const tableBody = table.querySelector("tbody");
    const response = await fetch("./data/theo_doi.json");
    THEO_DOI_DATA = await response.json();

    // clear the table
    tableHead.innerHTML = "<tr></tr>";
    tableBody.innerHTML = "";

    // Populate the header
    for (const headerText of THEO_DOI_HEADER) {
      const headerElement = document.createElement("th");
      headerElement.textContent = headerText;
      tableHead.querySelector("tr").appendChild(headerElement);
    }
    let stt = 1;
    for (const key in THEO_DOI_DATA) {
      const rowElement = document.createElement("tr");

      // STT
      const sttElement = document.createElement("td");
      sttElement.textContent = stt;
      rowElement.appendChild(sttElement);

      // Mã chứng khoán
      const maCKElement = document.createElement("td");
      let link = document.createElement("a");
      link.setAttribute(
        "href",
        "https://vn.tradingview.com/symbols/HOSE-" + key
      );
      link.setAttribute("target", "_blank");
      link.textContent = key;
      maCKElement.appendChild(link);
      rowElement.appendChild(maCKElement);

      // Giá lý tưởng
      let gialytuong = THEO_DOI_DATA[key]["price_ideal"];
      const giaLyTuongElement = document.createElement("td");
      giaLyTuongElement.textContent = gialytuong.toLocaleString("en-US");
      rowElement.appendChild(giaLyTuongElement);

      // Giá mua hidden
      let giaMuaInputHidden = document.createElement("input");
      giaMuaInputHidden.setAttribute("type", "hidden");
      // giaMuaInputHidden.setAttribute("id", "giadamua" + stt);
      // giaMuaInputHidden.setAttribute("value", giaDaMua);
      rowElement.appendChild(giaMuaInputHidden);

      // % mong chờ
      const percentMongChoElement = document.createElement("td");
      percentMongChoElement.textContent =
        THEO_DOI_DATA[key]["percent_mong_cho"];
      rowElement.appendChild(percentMongChoElement);

      // Giá hiện tại
      const giaHienTaiElement = document.createElement("td");
      giaHienTaiElement.setAttribute("id", "giahientai_theodoi" + stt);
      giaHienTaiElement.textContent = "";
      rowElement.appendChild(giaHienTaiElement);

      tableBody.appendChild(rowElement);
      stt++;
    }
  }

  loadIntoTable();
  loadTableTheodoi();
  updateClass();
  setInterval(updateClass, 5000);
  setInterval(clear_log, 60000);
});

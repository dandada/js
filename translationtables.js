var flagEditOrAdd;

$(function(){
  //bind events to UI elements
  activateTabs();
  resetDetails();
  var data=[];
  reloadDataGrid(tables);
  bindEventBtnSourceLayoutSave();
  bindEventBtnNewTable();
  bindEventBtnDeleteTable();

  bindEventBtnInDvParameter();
  bindEventBtnAddInputSave();
  bindEventBtnAddOutputSave();

  bindEventBtnInDvData();
  bindEventBtnAddColumnSave();

  bindEventBtnInDvTranslation();
  bindEventBtnAddTranslationSave();
});

var tables = // translation-tables.json is an array
[
    // 1st translation table json
    {
        "id": 1,
        "name": "test1"
    },

    // 2st translation table json
    {
        "id": 2,
        "name": "test2"
    },

    // 3st translation table json
    {
        "id": 3,
        "name": "test3"
    }
];


var table1_Details = 
//translation table 1 details, include rules
{
        "id": 1,
        "name": "test",

        // one-to-one layout json
        "layout": {
            "id": 143,
            "name": "XXX",
            "sql": "SSS",
            "dbInfoId": 123
        },

        // one-to-many input parameters json array
        "inputParams": [
            {
                "id": 1,
                "name": "test1",
                "type": "test1"
            },
            {
                "id": 2,
                "name": "test2",
                "type": "test2"
            }
        ],

        // one-to-many output parameters json array
        "outputParams": [
            {
                "id": 1,
                "name": "t",
                "type": "t"
            }
        ],

        // one-to-many data columns json array
        "dataColumns": [
            {
                "id": 1,
                "name": "t",
                "type": "t"
            }
        ],

        // one-to-many translations json array
        "translations": [

            // 1st translation json
            {
                "id": 1,
                "name": "t1",
                "sequenceNumber": 1
            },

            // 2nd translation json
            {
                "id": 2,
                "name": "t2",
                "sequenceNumber": 2,
            }
        ]
};

var table1_rules = 
{
  "id": 1,
  "name": "test",

  "translations": [
    // 1st translation json
    {
        "id": 1,
        "name": "t1",
        "sequenceNumber": 1,

        // one-to-many translate condition rules json array
        "translateConditionRules": [

            // 1st translate condition rule json
            {
                "id": 1,
                "name": "r1",
                "value": "abc=123",

                // one-to-many translate condition rule output columns json array
                "translateConditionRuleOutputColumns": [
                    {
                        "id": 1,
                        "name": "c1",
                        "value": "abc"
                    }
                ]
            },

            // 2nd translate condition rule json
            {
                "id": 2,
                "name": "r2",
                "value": "123=abc",
                "translateConditionRuleOutputColumns": [
                    {
                        "id": 2,
                        "name": "c2",
                        "value": "xxx"
                    }
                ]
            }
        ]
    },

    // 2nd translation json
    {
        "id": 2,
        "name": "t2",
        "sequenceNumber": 2,
        "translateConditionRules": [
            {
                "id": 3,
                "name": "r3",
                "value": "abc",
                "translateConditionRuleOutputColumns": [
                    {
                        "id": 3,
                        "name": "c3",
                        "value": "lll"
                    }
                ]
            },
            {
                "id": 4,
                "name": "r4",
                "value": "123",
                "translateConditionRuleOutputColumns": [
                    {
                        "id": 4,
                        "name": "c4",
                        "value": "www"
                    }
                ]
            }
        ]
    }
  ]

}



function activateTabs(){
  // $('#tabTranslateDetails a:last').tab('show');
  $('#tabTranslateDetails a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
    });
}

function activateTable(){
  $("#tbTranslationTables").dataTable();
}

function reloadDataGrid(resultData){
    var columns = [];
    //Add check-box column
    var checkboxSelector = new Slick.CheckboxSelectColumn({
        cssClass: "slick-cell-checkboxsel"
    });
    columns.push(checkboxSelector.getColumnDefinition());
    
    columns.push(
      {id: "tableName", name: "Table Name", field: "name", sortable: true, minWidth:50, width:800,maxWidth:800}
    );
    
    var options = {
//      enableCellNavigation: true,
//      enableColumnReorder: false
        editable: true,
          enableAddRow: false,
          enableCellNavigation: true,
          asyncEditorLoading: true,
          forceFitColumns: false
    };
    var gridData = [];
    // for (var i = 0; i < resultData.layoutInfoList.length; i++) {
    //   gridData[i] = resultData.layoutInfoList[i];
    //   gridData[i].id = "id" + (i+1);
    // }
    
    dataView = new Slick.Data.DataView({inlineFilters: true });
    //dataView = new Slick.Data.DataView();
    grid = new Slick.Grid("#dvTranslationTables", dataView, columns, options);

    grid.setSelectionModel(new Slick.RowSelectionModel());
    grid.registerPlugin(checkboxSelector);
    
    dataView.setPagingOptions({
     pageSize: 12,
    });
    var pager = new Slick.Controls.Pager(dataView, grid, $("#dvTranslationTablesPager"));
    var columnpicker = new Slick.Controls.ColumnPicker(columns, grid, options);
    $("#dvTranslationTablesPager .slick-pager-settings-expanded").show();
    
    dataView.onRowCountChanged.subscribe(function (e, args) {
        grid.updateRowCount();
        grid.render();
      });

      dataView.onRowsChanged.subscribe(function (e, args) {
        grid.invalidateRows(args.rows);
        grid.render();
      });

      
      var testData = [];
      for (var i = 0; i < 50000; i++) {
          var d = (testData[i] = {});
          d["id"] = "id_" + i;
          d["tableName"] = "Layout" + i;
          // d["layoutNme"] = "LayoutName" + i;
          // d["createTime"] = "01/01/2009 10:10:10";
          // d["updateTime"] = "01/05/2011 15:15:15";
        }

    dataView.beginUpdate();
    dataView.setItems(resultData);
//    dataView.setFilterArgs({
//        searchString: searchString
//      });
//    dataView.setFilter(myFilter);
    dataView.endUpdate();
    grid.render();

    
    grid.onSelectedRowsChanged.subscribe(function(e, args){
      var selectedRowCount = grid.getSelectedRows().length;
      if(selectedRowCount === 1){
        var selectedRow = grid.getDataItem(grid.getSelectedRows());
        var tableId = selectedRow.id;
        var targetService = null;
        // get table details from database.
        // .getJSON(targetService, function(retTableDetails){
        //   renderDetails(retTableDetails);          
        // }).error(function(e,msg){
        //   showErrorAlert("Error: " + msg);
        // });
        renderDetails(table1_Details);
      }else if(selectedRowCount === 0){
        resetDetails();
      }
    });

}

function resetDetails(){
    $("#textTranslationTableName").val("");
    $("#textSourceLayout").val("");
    $("#tbTTInputParams tbody").empty();        
    $("#tbTTOutputParams tbody").empty();
    $("#tbTTDataColumns tbody").empty();
    $("#tbTTTranslations tbody").empty();

    $("li:nth-child(1) a").tab('show');
    $("#textTranslationTableName").removeAttr("disabled");
    $("#textTranslationTableName").focus();
}

function renderDetails(dataTableDetail){
    resetDetails();
    //use mock data table1_Details
    //generate details tab
    $("#textTranslationTableName").val(dataTableDetail.name);
    $("#textTranslationTableName").attr("disabled","disabled");
    //generate source tab
    $("#textSourceLayout").val(dataTableDetail.layout.name);
    //generate parameter tab
    var tmpRow = "<tr><td><input type='checkbox'></td><td>#name</td><td>#type</td></tr>";
    for (var i=0;i<dataTableDetail.inputParams.length;i++) {
        tmpRow = tmpRow.replace("#name", dataTableDetail.inputParams[i].name);
        tmpRow = tmpRow.replace("#type", dataTableDetail.inputParams[i].type);                    
        $(tmpRow).appendTo("#tbTTInputParams tbody");
    };
    for (var i=0;i<dataTableDetail.outputParams.length;i++) {
        tmpRow = tmpRow.replace("#name", dataTableDetail.outputParams[i].name);
        tmpRow = tmpRow.replace("#type", dataTableDetail.outputParams[i].type);                    
        $(tmpRow).appendTo("#tbTTOutputParams tbody");
    };
    //generate data tab
    var tmpRow = "<tr><td><input type='checkbox'></td><td>#name</td><td>#type</td></tr>";
    for (var i=0;i<dataTableDetail.dataColumns.length;i++) {
        tmpRow = tmpRow.replace("#name", dataTableDetail.dataColumns[i].name);
        tmpRow = tmpRow.replace("#type", dataTableDetail.dataColumns[i].type);                    
        $(tmpRow).appendTo("#tbTTDataColumns tbody");
    };
    //generate translation tab
    var tmpRow = "<tr><td><input type='checkbox'></td><td>#name</td></tr>";
    for (var i=0;i<dataTableDetail.translations.length;i++) {
        tmpRow = tmpRow.replace("#name", dataTableDetail.translations[i].name);                   
        $(tmpRow).appendTo("#tbTTTranslations tbody");
    };
    bindEventCheckboxClick();
}

function bindEventCheckboxClick(){
    $(".tableInTab input[type=checkbox]").click(function(e){
        var target = e.target;
        var parent = $(this).parent();
        if(parent.is("th")){
            $(this).parents("table").find("input[type=checkbox]").prop("checked", $(this).prop("checked"));         
        }else{
            if($(this).prop("checked") == false){
                var arr = $(this).parents("table").find(":checkbox").first().prop("checked",false);                
            }else{
                var headCheckbox = $(this).parents("table").find(":checkbox").first();
                headCheckbox.prop("checked", true);
                var flag=true;
                $(this).parents("table").find(":checkbox").each(function(){
                    flag = flag && $(this).prop("checked");
                });
                headCheckbox.prop("checked", flag);
            }
        }

    });
}


function bindEventBtnSourceLayoutSave(){
    $("#btnSourceLayoutSave").click(function(){
        $("#textSourceLayout").val($("#selSourceLayout").val());
    });
}

function bindEventBtnNewTable(){
    $("#btnNewTable").click(function(){
        alert("btnNewTable");
        //unselect any items in the list.
        resetDetails();

    });
}


function bindEventBtnDeleteTable(){
    $("#btnDeleteTable").click(function(){
        alert("btnDeleteTable"); 
        var selectedRowCount = grid.getSelectedRows().length;
        if(selectedRowCount == 1){
            var selectedRow = grid.getDataItem(grid.getSelectedRows());
            var tableId = selectedRow.id;
            var targetService = "delete a translation table";
            $.ajax({
              url: targetService,
              data: tableId,
              success: function(){
                alert("delete translation table successfully.");
              }
            });
        }
        renderDetails(table1_Details);
    });
}

function bindEventBtnInDvParameter(){
    $("#dvParameter .dvButtons a").click(function(){
        switch($(this).text()){
            case "Add Input":
                flagEditOrAdd = "Add";
                break;
            case "Add Output":
                flagEditOrAdd = "Add";
                break;
            case "Edit":
                var k = 0;
                var name,type;
                $("#dvParameter :checked").each(function(){
                    if($(this).parent().is("th") === false){
                        k++;
                        name = $(this).parent().next().text();
                        type = $(this).parent().next().next().text();
                    }
                });
                if(k === 1){
                    if($("#dvParameter :checked").parents("table").is("#tbTTInputParams")){                        
                        $("#dvDialogAddInput").modal('toggle');
                        $("#textInputName").val(name);
                        $("#selInputType").val(type);
                    }else{
                        $("#dvDialogAddOutput").modal('toggle');
                        $("#textOutputName").val(name);
                        $("#selOutputType").val(type);
                    }
                    flagEditOrAdd = "Edit";
                }
                break;
            case "Remove":
                $("#dvParameter :checked").each(function(){
                    if($(this).parent().is("th") === false){
                        $(this).parents("tr").remove();
                    }
                });
                break;
        }
    });
}

function bindEventBtnAddInputSave(){
    $("#btnAddInputSave").click(function(){
        var name = $("#textInputName").val();
        var type = $("#selInputType").val();
        $("#textInputName").val("");
        $("#selInputType").val("text");
        if (flagEditOrAdd == "Add"){
            var html = "<tr><td><input type='checkbox'></td><td>#name</td><td>#type</td></tr>";
            html = html.replace("#name", name).replace("#type", type);
            $(html).appendTo("#tbTTInputParams tbody");
            bindEventCheckboxClick();
        }
        else if(flagEditOrAdd == "Edit"){
            $("#tbTTInputParams :checked").each(function(){
                if($(this).parent().is("td") === true){
                    $(this).parent().next().text(name);
                    $(this).parent().next().next().text(type);
                }
            });
        }
    });
}

function bindEventBtnAddOutputSave(){
    $("#btnAddOutputSave").click(function(){
        var name = $("#textOutputName").val();
        var type = $("#selOutputType").val();
        $("#textOutputName").val("");
        $("#selOutputType").val("text");
        if (flagEditOrAdd == "Add"){
            var html = "<tr><td><input type='checkbox'></td><td>#name</td><td>#type</td></tr>";
            html = html.replace("#name", name).replace("#type", type);
            $(html).appendTo("#tbTTOutputParams tbody");
            bindEventCheckboxClick();
        }
        else if(flagEditOrAdd == "Edit"){
            $("#tbTTOutputParams :checked").each(function(){
                if($(this).parent().is("td") === true){
                    $(this).parent().next().text(name);
                    $(this).parent().next().next().text(type);
                }
            });
        }
    });
}

function bindEventBtnInDvData(){
    $("#dvData .dvButtons a").click(function(){
        switch($(this).text()){
            case "Add Column":
                flagEditOrAdd = "Add";
                break;
            case "Edit":
                var k = 0;
                var name,type;
                $("#dvData :checked").each(function(){
                    if($(this).parent().is("th") === false){
                        k++;
                        name = $(this).parent().next().text();
                        type = $(this).parent().next().next().text();
                    }
                });
                if(k === 1){
                    if($("#dvData :checked").parents("table").is("#tbTTDataColumns")){                        
                        $("#dvDialogAddColumn").modal('toggle');
                        $("#selColumn").val(name);
                        $("#selColumnType").val(type);
                    }
                    flagEditOrAdd = "Edit";
                }
                break;
            case "Remove":
                $("#dvData :checked").each(function(){
                    if($(this).parent().is("th") === false){
                        $(this).parents("tr").remove();
                    }
                });
                break;
        }
    });
}

function bindEventBtnAddColumnSave(){
    $("#btnAddColumnSave").click(function(){
        var name = $("#selColumn").val();
        var type = $("#selColumnType").val();
        if (flagEditOrAdd == "Add"){
            var html = "<tr><td><input type='checkbox'></td><td>#name</td><td>#type</td></tr>";
            html = html.replace("#name", name).replace("#type", type);
            $(html).appendTo("#tbTTDataColumns tbody");
            bindEventCheckboxClick();
        }
        else if(flagEditOrAdd == "Edit"){
            $("#tbTTDataColumns :checked").each(function(){
                if($(this).parent().is("td") === true){
                    $(this).parent().next().text(name);
                    $(this).parent().next().next().text(type);
                }
            });
        }
    });
}

function bindEventBtnInDvTranslation(){
    $("#dvTranslation .dvButtons a").click(function(){
        switch($(this).text()){
            case "Move Up":
                var k = 0;
                $("#tbTTTranslations tbody :checkbox").each(function(){
                    if($(this).is(":checked") === true){
                        k++;   
                    }                  
                });
                if(k===1){
                    if( $("#tbTTTranslations tbody :checked").parents("tr").is("tr:nth-child(1)")){
                        break;
                    }
                    var row1 = $("#tbTTTranslations tbody :checked").parents("tr").prev();
                    var row2 = $("#tbTTTranslations tbody :checked").parents("tr").detach();
                    
                    row1.before(row2);
                }
                break;
            case "Move Down":
                var k = 0;
                $("#tbTTTranslations tbody :checkbox").each(function(){
                    if($(this).is(":checked") === true){
                        k++;   
                    }                  
                });
                if(k===1){
                    var length = $("#tbTTTranslations tbody tr").length;
                    if( $("#tbTTTranslations tbody :checked").parents("tr").is("tr:nth-child("+length+")")){
                        break;
                    }
                    var row1 = $("#tbTTTranslations tbody :checked").parents("tr").next();
                    var row2 = $("#tbTTTranslations tbody :checked").parents("tr").detach();
                    
                    row1.after(row2);
                }
                break;
            case "Add":            
                flagEditOrAdd = "Add";
                break;
            case "Edit":                
                // var k = 0;
                // var name,type;
                // $("#dvTranslation :checked").each(function(){
                //     if($(this).parent().is("th") === false){
                //         k++;
                //         name = $(this).parent().next().text();
                //         type = $(this).parent().next().next().text();
                //     }
                // });
                // if(k === 1){
                //     if($("#dvTranslation :checked").parents("table").is("#tbTTTranslations")){                        
                //         $("#dvDialogAddTranslation").modal('toggle');
                //         $("#textTranslation").val(name);
                //     }
                //     flagEditOrAdd = "Edit";
                // }
                break;
            case "Remove":
                $("#dvTranslation :checked").each(function(){
                    if($(this).parent().is("th") === false){
                        $(this).parents("tr").remove();
                    }
                });
                break;
        }
    });
}

function bindEventBtnAddTranslationSave(){    
    $("#btnAddTranslationSave").click(function(){
        var name = $("#textTranslation").val();
        if (flagEditOrAdd == "Add"){
            var html = "<tr><td><input type='checkbox'></td><td>#name</td></tr>";
            html = html.replace("#name", name);
            $(html).appendTo("#tbTTTranslations tbody");
            bindEventCheckboxClick();
        }
        else if(flagEditOrAdd == "Edit"){
            $("#tbTTTranslations :checked").each(function(){
                if($(this).parent().is("td") === true){
                    $(this).parent().next().text(name);
                    $(this).parent().next().next().text(type);
                }
            });
        }
    });
}


function bindEventBtnInDvDetailButtonPanel(){
    $("#dvDetailButtonPanel button").click(function(){
        switch($(this).text()){
            case "Save":
                break;
            case "Cancel":
                resetDetails();                
                break;
        }
    });
}


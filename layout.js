var grid;

function showLayoutTab(){
	$("#layoutSpan").show();
	
	var src = "getLayout?timestamp=" + new Date().getTime();
	$.getJSON(src, function(result){
		//check error
		if(result.error){
			showErrorAlert(result.error);
			return false;
		}
		reloadDataGrid(result.data);
		loadDBInfoList(result.data);
		cancelLayout();
	}).error(function(e, msg){
		showErrorAlert("Error: " + msg);
	});
}

function reloadDataGrid(resultData){
    var columns = [];
    //Add check-box column
    var checkboxSelector = new Slick.CheckboxSelectColumn({
        cssClass: "slick-cell-checkboxsel"
    });
    columns.push(checkboxSelector.getColumnDefinition());
    
    columns.push(
        {id: "layoutID", name: "Layout ID", field: "layoutID", sortable: true, minWidth:50, width:100, maxWidth:100},
    	{id: "layoutNme", name: "Layout Name", field: "layoutNme", sortable: true, minWidth:50, width:330, maxWidth:330},
    	{id: "createTime", name: "Create Time", field: "createTime", sortable: true, minWidth:50, width:200, maxWidth:200},
    	{id: "updateTime", name: "Update Time", field: "updateTime", sortable: true, minWidth:50, width:200, maxWidth:200}
    );
    
    var options = {
//      enableCellNavigation: true,
//      enableColumnReorder: false
    		editable: true,
    		  enableAddRow: true,
    		  enableCellNavigation: true,
    		  asyncEditorLoading: true,
    		  forceFitColumns: false
    };
    var gridData = [];
    for (var i = 0; i < resultData.layoutInfoList.length; i++) {
    	gridData[i] = resultData.layoutInfoList[i];
    	gridData[i].id = "id" + (i+1);
    }
    
    dataView = new Slick.Data.DataView({inlineFilters: true });
    //dataView = new Slick.Data.DataView();
    grid = new Slick.Grid("#layoutGrid", dataView, columns, options);

    grid.setSelectionModel(new Slick.RowSelectionModel());
    grid.registerPlugin(checkboxSelector);
    
    dataView.setPagingOptions({
 	   pageSize: 5,
    });
    var pager = new Slick.Controls.Pager(dataView, grid, $("#pager"));
    var columnpicker = new Slick.Controls.ColumnPicker(columns, grid, options);
    $("#pager .slick-pager-settings-expanded").show();
    
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
    	    d["layoutID"] = "Layout" + i;
    	    d["layoutNme"] = "LayoutName" + i;
    	    d["createTime"] = "01/01/2009 10:10:10";
    	    d["updateTime"] = "01/05/2011 15:15:15";
    	  }  
      
    dataView.beginUpdate();
    dataView.setItems(testData);
//    dataView.setFilterArgs({
//        searchString: searchString
//      });
//    dataView.setFilter(myFilter);
    dataView.endUpdate();
    grid.render();
}

function myFilter(item, args) {
	  if (args.searchString != "" && item["layoutName"].indexOf(args.searchString) == -1) {
	    return false;
	  }
	  return true;
}

function loadDBInfoList(data){
	var tbl = "";
	var rowCount = 0.0;
	for(var i in data.dbInfoList){
		tbl = tbl + "<option value = " + data.dbInfoList[i].dbID + ">" + data.dbInfoList[i].driver + " " + data.dbInfoList[i].user;
		tbl = tbl + "@" + data.dbInfoList[i].server + "</option>";
		rowCount = rowCount + 1;
	}
	$("#dbInfoSlct").empty();
	$("#dbInfoSlct").append(tbl);
}

function newLayout(){
	//Display the edit unit
	$("#editLayoutUnit").show();
	$('#myTab a[href="#tab1"]').click();
	
	//Set default value
	$("#layoutID").val("0"); //Action Flag for Create vs. Edit
	$("#layoutNme").val("");
	$("#sqlStmt").val("");
	$("#dataType").val("Exterior");
	$("#dbInfoSlct").find("option:first").attr("selected","selected");
	$("#password").val("");
	$("#paramList").empty();
}

function cancelLayout(){
	//Hide the edit unit
	$("#editLayoutUnit").hide();
	
	//Set value to edit form
	$("#layoutNme").val("");
	$("#sqlStmt").val("");
	$("#dataType").val("Exterior");
	$("#dbInfoSlct").find("option:first").attr("selected","selected");
	$('#myTab a[href="#tab1"]').click();
	$("#paramList").empty();
}

function saveLayout(){
	if($("#layoutNme").val() == ""){
		alert("Please Input Layout Name.");
	}
	if($("#sqlStmt").val() == ""){
		alert("Please Input SQL Statement.");
	}
	var src = "saveLayout?timestamp=" + new Date().getTime();
	$('#editLayoutForm').ajaxSubmit({
		url: src,
		dataType : 'json',
		success : returnMessage // post-submit callback
	});
	return false;
}

function editLayout(){
	var selectedRowCount = grid.getSelectedRows().length;
	if(selectedRowCount > 1 || selectedRowCount == 0){
		alert("Please select one layout to edit.");
		return false;
	}
	var selectedRowIndex = grid.getSelectedRows();
	var selectedRowContent = grid.getDataItem(selectedRowIndex);
	
	//Set value to edit form
	$("#layoutID").val(selectedRowContent.layoutID);
	$("#layoutNme").val(selectedRowContent.layoutNme);
	$("#sqlStmt").val(selectedRowContent.sqlStmt);
	if(selectedRowContent.exterior == 1){
		$("#dataType").val("Exterior");
	}else{
		$("#dataType").val("Internal");
	}
	//Set option value
	$('#dbInfoSlct').val(selectedRowContent.dbInfoID);
	
	//Pass the layout ID
	var src = "loadLayoutDeatils?layoutID=" + selectedRowContent.layoutID + "&timestamp=" + new Date().getTime();
	$.getJSON(src, function(result){
		//check error
		if(result.error){
			showErrorAlert(result.error);
			return false;
		}
		//Load Contents
		showParamList(result.data);
	}).error(function(e, msg){
		showErrorAlert("Error: " + msg);
	});
	//Display the edit unit
	$("#editLayoutUnit").show();
	$('#myTab a[href="#tab1"]').click();
}

function showParamList(data){
	$("#paramList").empty();
	var paramList = "";
	if(data.param.length == 0){
		$("#paramList").append("<p>No Parameter Defined in SQL Statement.</p>");
	}else{
		for(var i = 0; i < data.param.length; i ++){
			paramList = paramList + "<label>Parameter" + (i+1) + ": " + data.param[i].column + "</label>";
			paramList = paramList + "<input name='paramListValue' id='param" + i + "' class = 'input-xlarge' type='text' ";
			paramList = paramList + "value=' " + data.param[i].value + "'></br>";
		}
		$("#paramList").append(paramList);
	}
}

function showParamFromSql(){
	var url = "loadParamListFromSql?sqlStmt=" + URLencode($("#sqlStmt").val()) + "&timestamp=" + new Date().getTime();
	$.getJSON(url, function(result){
		//check error
		if(result.error){
			showErrorAlert(result.error);
			return false;
		}
		//Load parameters from SQL
		$("#paramList").empty();
		var paramList = "";
		if(result.data.length == 0){
			$("#paramList").append("<p>No Parameter Defined in SQL Statement.</p>");
		}else{
			for(var i = 0; i < result.data.length; i ++){
				paramList = paramList + "<label>Parameter" + (i+1) + ": " + result.data[i] + "</label>";
				paramList = paramList + "<input name='paramListValue' id='param" + i + "' class = 'input-xlarge' type='text' ";
				paramList = paramList + "value=''></br>";
				
				paramList = paramList + "<label>Parameter Type:<select>";
				paramList = paramList + "<option value = varchar>VARCHAR</option>";
				paramList = paramList + "<option value = int>INT</option>";
				paramList = paramList + "<option value = float>FLOAT</option>";
				paramList = paramList + "<option value = date>DATE</option>";
				paramList = paramList + "<option value = bool>BOOL</option>";
				paramList = paramList + "</select></br>";
			}
			$("#paramList").append(paramList);
		}
	}).error(function(e, msg){
		showErrorAlert("Error: " + msg);
	});
}

function deleteLayout(){
	var selectedRowCount = grid.getSelectedRows().length;
	if(selectedRowCount == 0){
		alert("Please select at least one layout.");
		return false;
	}
	//Set selected layoutID to hidden text
	var selectedRowIndex = grid.getSelectedRows();
	var selectedRowContent = grid.getDataItem(selectedRowIndex);
	$("#layoutID").val(selectedRowContent.layoutID);
	
	if (confirm("Do you really want to delete the selected layouts?")) {
		var src = "deleteLayout?layoutID=" + selectedRowContent.layoutID + "&timestamp=" + new Date().getTime();
		$('#editLayoutForm').ajaxSubmit({
				url: src,
				dataType : 'json',
				success : returnMessage // post-submit callback
		});
	}
}

function returnMessage(responseText, status, xhr, $form){
	if (responseText != null && responseText.error != null) {
		alert("error: " + responseText.error);
		return false;
	}
	if (responseText != null && responseText.success != null) {
		alert(responseText.success);
		showLayoutTab();
		//TODO: try to select new added/edit row
		if(responseText.success.indexOf("Add") >= 0 || responseText.success.indexOf("Update") >= 0){
			
		}
	} else {
		alert("Can't Operate the Layout!");
	}
	return false;
}

function previewColumn(){
	$("#columnList").empty();
	//Get useful information from screen
	if($("#sqlStmt").val() == ""){
		alert("Please Input SQL Statement.");
	}
	
	var src = "getColumnPreview?timestamp=" + new Date().getTime();
	$('#editLayoutForm').ajaxSubmit({
		url: src,
		dataType : 'json',
		success : showPreview // post-submit callback
	});
	//Get SQL statement
	//Submit to proceed
	//Callback to show result
	//Deal with exceptions
}

function showPreview(responseText, status, xhr, $form){
	var columnType = "";
	if (responseText != null && responseText.error != null) {
		alert("error: " + responseText.error);
		return false;
	}
	if (responseText != null && responseText.success != null) {
		alert("Load Success! You can click the tab to preview the column type.");
		for(var i = 0; i < responseText.success.length; i ++){
			columnType = columnType + "<p>" + responseText.success[i].name;
			columnType = columnType + responseText.success[i].type + "</p></br>";
		}
		$("#columnList").append(columnType);
	} else {
		alert("Can't see the preview!");
	}
}

//function handleTabLink(){
//	$('#myTab a[href="#tab2"]').click(function (e) {
//		$(this).tab('show');
//		var src = "";
//		
//		if($("#layoutID").val()!="0"){
//			src = "loadParamListFromDB";
//		}else{
//			//Load from SQL if it's new created
//			src = "loadParamListFromSql?sqlStmt=" + $("#sqlStmt").val();
//		}	
//		$.getJSON(src, function(result){
//			//check error
//			if(result.error){
//				showErrorAlert(result.error);
//				return false;
//			}
//			showParamList(result.data);
//			if($("#layoutID").val()!="0"){
//				showParamListFromDB(result.data);
//			}else{
//				showParamListFromSql();
//			}
//		}).error(function(e, msg){
//			showErrorAlert("Error: " + msg);
//		});
//	});
//	$('#myTab a[href="#tab3"]').click(function (e) {
//		$(this).tab('show');
//		var src = "loadColumnType?sqlStmt=" + $("#sqlStmt").val();
//		
//		$.getJSON(src, function(result){
//			//check error
//			if(result.error){
//				showErrorAlert(result.error);
//				return false;
//			}
//			showParamList(result.data);
//		}).error(function(e, msg){
//			showErrorAlert("Error: " + msg);
//		});
//	});
//}
function resetSeq(gridData){
	var dataLength = gridData.length;
	for ( var i = 0; i < dataLength; i++) {
		gridData[i].seq = i+1;
		//gridData[i].id = i+1;
	}
	return gridData;
}

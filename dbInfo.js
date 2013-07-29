
function showDBInfoTab(){
	$("#welcomeSpan").hide();
	$("#dbInfoSpan").show();
	var src = "getDBInfo?timestamp=" + new Date().getTime();;
	$("#showUnitTab > tbody").empty(); //Clear up the old table
	$("#editUnit").hide(); //Hide the new/edit unit
	
	$.getJSON(src, function(result){
		if(result.error){
			showErrorAlert(result.error);
			return false;
		}
		var tbl = "";
		var rowCount = 0.0;
		for(var i in result.data){
			tbl = tbl + "<tr>";
			tbl = tbl + "<td><input type='radio' name='dbID' value='" + result.data[i].dbID + "'></input></td>";
			tbl = tbl + "<td>" + result.data[i].dbID + "</td>";
			tbl = tbl + "<td>" + result.data[i].user + "</td>";
			tbl = tbl + "<td>" + result.data[i].driver + "</td>";
			tbl = tbl + "<td>" + result.data[i].server + "</td>";
			tbl = tbl + "<td>" + result.data[i].host + "</td>";
			tbl = tbl + "<td>" + result.data[i].port + "</td>";
			tbl = tbl + "</tr>";
			rowCount = rowCount + 1;
		}
		$("#showUnitTab > tbody").append(tbl);
		if(rowCount > 0){
			$("input:radio[name=dbID]")[0].checked = true;
		}
	}).error(function(e,msg){
		showErrorAlert("Error: " + msg);
	});
}

function newDBInfo(){
	//Show the edit unit
	$("#editUnit").show();
	
	//Clear up all the historical input
	$("#dbID").val("0"); //Set the default id to 0
	$("#dbDriver").val("Oracle");
	$("#dbServer").val("");
	$("#dbHost").val("");
	$("#dbUserName").val("");
	$("#dbPort").val("");
}

function updateDBInfo(){
	var src = "saveDBInfo?timestamp=" + new Date().getTime();
	$('#editDBInfoForm').ajaxSubmit({
		url: src,
		dataType : 'json',
		success : returnMessage // post-submit callback
	});
	return false;
}

function deleteDBInfo(){
	getSelectedRow();
	//var dbIDVal = $("input:radio[name=dbID]:checked").val();
	if (confirm("Do you really want to delete the DB Info?")) {
		var src = "deleteDBInfo?timestamp=" + new Date().getTime();
		$('#editDBInfoForm').ajaxSubmit({
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
		showDBInfoTab();
	} else {
		alert("Can't Operate the DB Info!");
	}
	return false;
}

function cancelDBInfo(){
	//Clear up all the historical input
	$("#dbID").val("0");
	$("#dbDriver").val("Oracle");
	$("#dbServer").val("");
	$("#dbHost").val("");
	$("#dbUserName").val("");
	$("#dbPort").val("");
	//Hide the edit unit
	$("#editUnit").hide();
	return false;
}

function editDBInfo(){
	getSelectedRow();
	$("#editUnit").show();
}

function getSelectedRow(){
	var dbIDObj = $("input:radio[name=dbID]:checked");
	var $tdObj = dbIDObj.parent().parent().children('td');
	var dbIDVal = $tdObj.eq(1).html();
	var userVal = $tdObj.eq(2).html();
	var driverVal = $tdObj.eq(3).html();
	var serverVal = $tdObj.eq(4).html();
	var hostVal = $tdObj.eq(5).html();
	var portVal = $tdObj.eq(6).html();
	
	//Set value to edit table
	$("#dbID").val(dbIDVal); //Set the actual value to dbID, be different to New Created
	$("#dbDriver").val(driverVal);
	$("#dbServer").val(serverVal);
	$("#dbHost").val(hostVal);
	$("#dbUserName").val(userVal);
	$("#dbPort").val(portVal);
}


function showErrorAlert(msg){
	var errorMsg = "<div class='alert nodata-alert'>"
		+ "<button type='button' class='close' data-dismiss='alert'>&times;</button>"
		+ msg
		+ "</div>";
	$('#dbInfoNav').empty().append(msg);
}


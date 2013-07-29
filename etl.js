
$(function() {
	loadSpan();
});

function loadSpan(){
	$('#dbInfoNav').click(function(e) {
		hideAllSpan();
		showDBInfoTab();
	});
	$('#layoutNav').click(function(e) {
		hideAllSpan();
		showLayoutTab();
		
	});
	$('#controlNav').click(function(e) {
		hideAllSpan();
		showControlTab();
	});
	$('#caseNav').click(function(e) {
		hideAllSpan();
		showCaseTab();
	});
	$('#scenarioNav').click(function(e) {
		hideAllSpan();
		showScenarioTab();
	});
	$('#jobNav').click(function(e) {
		hideAllSpan();
		showJobTab();
	});
	$('#userNav').click(function(e) {
		hideAllSpan();
		showUserTab();
	});
	$('#systemNav').click(function(e) {
		hideAllSpan();
		showConfigTab();
	});
}

function hideAllSpan(){
	$("#welcomeSpan").hide();
	$("#dbInfoSpan").hide();
	$("#layoutSpan").hide();
	$("#controlSpan").hide();
	$("#caseSpan").hide();
	$("#scenarioSpan").hide();
	$("#reportSpan").hide();
	$("#jobSpan").hide();
	$("#userSpan").hide();
	$("#configSpan").hide();
}

//URL Encoder
function URLencode(sStr){  
	return escape(sStr).replace(/\+/g, '%2B').replace(/\"/g,'%22').replace(/\'/g, '%27').replace(/\//g,'%2F');  
} 

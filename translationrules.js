var conditions = [
  {id: "1", name:"condition1", value:"( FDW_CorpFinComCCRC_CompanyID = COMPANY_ID ) and ( FDW_CorpFinComCCRC_RESPID = RESP_ID )"},
  {id: "2", name:"condition2", value:"column1 = column2"}
];
 
var outputColumns = [
  {name:"output1", value:"column1", conditionRuleId:"1"},
  {name:"output2", value:"column2", conditionRuleId:"1"},
  {name:"output1", value:"123456", conditionRuleId:"2"}
];

var table_id = 1;

var translation1 = 
{
    "id": 1,
    "name": "t1",
    "sequenceNumber": 1,

    // one-to-many translate condition rules json array
    "translateConditionRules": [

        // 1st translate condition rule json
        {
            "id": 11,
            "name": "r1",
            "value": "abc=123",

            // one-to-many translate condition rule output columns json array
            "translateConditionRuleOutputColumns": [
                {
                    "id": 111,
                    "name": "c1",
                    "value": "abc"
                },
                {
                    "id": 112,
                    "name": "c2",
                    "value": "abcdddd"
                }
            ]
        },

        // 2nd translate condition rule json
        {
            "id": 22,
            "name": "r2",
            "value": "123=abc",
            "translateConditionRuleOutputColumns": [
                {
                    "id": 222,
                    "name": "c2",
                    "value": "xxx"
                }
            ]
        }
    ]
};


function getJsonData(){

  var translation = new Object();
  translation.id = translation1.id;
  translation.name = translation1.name;
  translation.sequenceNumber = translation1.sequenceNumber;

  var cons,con;
  var outputs, output;
  cons = new Array();
  var seq = 0;
  $("tr[data-tt-id]").each(function(){
    var id = $(this).attr("data-tt-id");    
    //condition
    if(layer(id) == 2){     
      var arr = trim($(this).text()).split(":");
      if(arr.length == 2){
        // if(seq>0){
        //   con.translateConditionRuleOutputColumns = outputs;
        //   cons.push(con);
        // }      
        // seq++;
        con = new Object();
        con.id = $(this).find(".spanid").text();
        con.name = trim(arr[0]);
        con.value = trim(arr[1]);
        outputs = new Array();
      }
    }
    //rule
    else if(layer(id) == 3){
      var arr = trim($(this).text()).split("=");
      if(arr.length == 2){
        output = new Object();
        output.id = $(this).find(".spanid").text();
        output.name = trim(arr[0]);
        output.value = trim(arr[1]);
        outputs.push(output);
        //append rules to the condition
        if($.trim($(this).next().text()) == "New Translate Rule"){
          con.translateConditionRuleOutputColumns = outputs;
          cons.push(con);
        }
      }
    }    
  });

  translation.translateConditionRules = cons;
// function getJsonData(){
//   var cons,con;
//   var outputs, output;
//   cons = new Array();
//   outputs = new Array();
//   var seq = 0;
//   $("tr[data-tt-id]").each(function(){
//     var id = $(this).attr("data-tt-id");    
//     //condition
//     if(layer(id) == 2){     
//       var arr = trim($(this).text()).split(":");
//       if(arr.length == 2){
//         if(seq>0){
//           cons.push(con);  
//         }      
//         seq++;
//         con = new Object();
//         con.id = $(this).find(".spanid").text();
//         con.name = trim(arr[0]);
//         con.value = trim(arr[1]);
//       }
//     }
//     //rule
//     else if(layer(id) == 3){
//       var arr = trim($(this).text()).split("=");
//       if(arr.length == 2){
//         output = new Object();
//         output.id = $(this).find(".spanid").text();
//         output.name = trim(arr[0]);
//         output.value = trim(arr[1]);
//         outputs.push(output);
//       }
//     }
//   });

  for(var i=0;i<translation.translateConditionRules.length;i++){
    alert(translation.translateConditionRules[i].id + " " + translation.translateConditionRules[i].name + ":" + translation.translateConditionRules[i].value);
  }
}

function drawConditionTable(dataTranslation){//dataConditions, dataOutputColumns){ 
  var html;
  var L1ID,L2ID1,L2ID2,L3ID;
  var dataConditions = dataTranslation.translateConditionRules;
  for(i in dataConditions){
    var condition = dataConditions[i];
    var conditionId = condition.id;
    var conditionName = condition.name;
    var conditionValue = condition.value;
    var dataOutputColumns = condition.translateConditionRuleOutputColumns;
    L1ID = parseInt(i) + 1;
    L2ID1 = L1ID + ".1";
    L2ID2 = L1ID + ".2";
    L3ID;
    html += "<tr data-tt-id=#L1ID  style='background-color:#996699'>\
          <td><span>When - #ConditionName</span></td>\
          </tr>\
          <tr data-tt-id=#L2ID1 data-tt-parent-id=#L1ID>\
            <td><span class='spanid'>#ConditionId</span>#ConditionName:  #ConditionValue</td>\
          </tr>\
          <tr data-tt-id=#L2ID2 data-tt-parent-id=#L1ID>\
            <td  style='background-color:#C8C8C8'><span >Then Translate</span></td>\
          </tr>";    
    // var L3Id = appendOutputColumns(html, conditionId, dataOutputColumns);\
    var k = 1;
    for(j in dataOutputColumns){
      L3ID = L2ID2 + "." + k;
      //if (dataOutputColumns[j].conditionRuleId == conditionId){
        k= k+1;
        var equation = dataOutputColumns[j].name + " = " + dataOutputColumns[j].value;
        var ruleId = "##RuleId";
        html += "<tr data-tt-id=#L3ID data-tt-parent-id=#L2ID2>\
              <td><span class='spanid'>#ruleId</span>#equation</td>\
              </tr>";
        html = html.replace("#L3ID", L3ID).replace("#L2ID2", L2ID2).replace(/#equation/g,equation);
        html = html.replace("#RuleId", ruleId);
        L3ID = L2ID2 + "." + k;
      //}
    }
    html += "<tr data-tt-id=#L3ID data-tt-parent-id=#L2ID2>\
          <td><span class='file'><a href='##'>New Translate Rule</a></span></td>\
          </tr>";
    html = html.replace(/#L1ID/g, L1ID).replace(/#L2ID1/g, L2ID1).replace(/#L2ID2/g, L2ID2).replace(/#L3ID/g, L3ID);
    html = html.replace(/#ConditionId/g, conditionId).replace(/#ConditionName/g, conditionName).replace(/#ConditionValue/g, conditionValue);

  }
  $("#example-advanced tbody").empty();
  $("#example-advanced tbody").append($(html));

  lastTR = "<tr data-tt-id=#L1ID>\
              <td><span class='file'><a href='##'>New Translate Condition Rule</a></span></td>\
            </tr>";
  L1ID = parseInt(L1ID) + 1;
  lastTR = lastTR.replace("#L1ID", L1ID);
  $("#example-advanced tbody").append($(lastTR));


  $(".spanid").hide();
}


// $("#dvTranslateRule").hide();
function switch2Read(){
  $("#textNewConditionRuleName").val("");
  $("#textAreaTranslateRule").val("");
  $(".section").hide();
  $(".tdid").hide();
};

$(function(){
  
  //drawtable according to json data
  drawConditionTable(translation1);

      //initialize UIs
      switch2Read();
      

      //OK click
      $("#btnOK").click(function(){
          getJsonData();

      });

      //Apply click
      $("#btnApply").click(function(){
        var selectedRow = $(".selected");
        var seletedRowText = trim(selectedRow.text());
        var reg = new RegExp("(When -|Then Translate|Otherwise -)","i");
        //if New Translate Rule is selected, then add a new row in the table        
        if (seletedRowText == "New Translate Rule"){
          var rule = $("#textAreaTranslateRule").val();          
          $("#textAreaTranslateRule").val("");

          var id = selectedRow.attr("data-tt-id");
          var parentId = selectedRow.attr("data-tt-parent-id");
          //move down
          idPart1 = id.substring(0, id.lastIndexOf("."));
          tmp = id.substring(id.lastIndexOf(".")+1);
          tmp = parseInt(tmp) + 1;
          idPart2 = tmp.toString();
          newId = idPart1+"."+idPart2;
          selectedRow.attr("data-tt-id", newId);

          //add a new tr before New Translate Rule
          var html = "<tr data-tt-id=#id data-tt-parent-id=#parentId><td>#rule</td></tr>";
          html = html.replace("#id", id).replace("#parentId", parentId).replace("#rule", rule);       
          var node = $("#example-advanced").treetable('node',idPart1);
          var linknode = $("[data-tt-id='"+newId+"']");

          $("#example-advanced").treetable('loadBranch',node,$(html));
          linknode = linknode.detach();
          $("[data-tt-id='"+id+"']").after(linknode);
          //hide the textarea
          switch2Read();
        }        
        //if New Condition Rule is selected
        else if(seletedRowText == "New Translate Condition Rule"){
          var html =  "" +
                "<tr data-tt-id=#L1ID  style='background-color:#996699'>\
                  <td><span>When - #ConditionRuleName</span></td>\
                </tr>\
                <tr data-tt-id=#L2ID1 data-tt-parent-id=#L1ID>\
                  <td>#ConditionRuleName:</td>\
                </tr>\
                <tr data-tt-id=#L2ID2 data-tt-parent-id=#L1ID>\
                  <td  style='background-color:#C8C8C8'><span >Then Translate</span></td>\
                </tr>\
                <tr data-tt-id=#L3ID1 data-tt-parent-id=#L2ID2>\
                  <td><span class='file'><a href='##'>New Translate Rule</a></span></td>\
                </tr>";
          var id = selectedRow.attr("data-tt-id");
          var L1ID = id;
          var L2ID1 = id + "." + "1";
          var L2ID2 = id + "." + "2";
          var L3ID1 = L2ID2 + "." + "1";
          var conditionRuleName = $("#textNewConditionRuleName").val();

          html = html.replace(/#L1ID/g, L1ID).replace(/#L2ID1/g, L2ID1).replace(/#L2ID2/g, L2ID2);
          html = html.replace(/#L3ID1/g, L3ID1).replace(/#ConditionRuleName/g, conditionRuleName);

          var newId = parseInt(id) + 1;
          selectedRow.attr("data-tt-id", newId);

          $("#example-advanced").treetable('loadBranch',null,$(html));
          $("[data-tt-id='"+L3ID1+"'] a").bind('click',  function(event){
            newRule(trim($(this).text()));
          });
          selectedRow.detach();
          selectedRow.appendTo("#example-advanced tbody");
          $("#example-advanced").treetable('expandAll');

          switch2Read();
        }
        //if titles are selected: When -|Then Translate|Otherwise -
        else if(true==reg.test(seletedRowText)){
          //alert("titlle");
        }
        //if an existing rule is selected, then edit this rule
        else{
          var s = seletedRowText.split(":");
          if(s.length == 2){
            s = s[0] + ":  ";
          }else{
            s="";
          }
          var strRule =  $.trim($("#textAreaTranslateRule").val());
          var tmp = $(".selected td").html();
          tmp = tmp.substring(0, tmp.lastIndexOf("</span>")+7) + s + strRule;
          $(".selected td").html(tmp);
        }

      });

      //edit textarea textAreaTranslateRule
      $("#textAreaTranslateRule").val("");
      var str = $("#textAreaTranslateRule").val();
      $("#textAreaTranslateRule").focusout(function(){
        str = $("#textAreaTranslateRule").val();
      });
      $("#selInput").change(function(){
        var sel = $("#selInput").val();
        $("#textAreaTranslateRule").val(str+sel+" ");
      }).focusout(function(){
        $("#selInput").val("");
        str = $("#textAreaTranslateRule").val();
      });
      $("#selColumn").change(function(){
        var sel = $("#selColumn").val();
        $("#textAreaTranslateRule").val(str+sel+" ");
      }).focusout(function(){
        $("#selColumn").val("");
        str = $("#textAreaTranslateRule").val();
      });
      $("#selOperation").change(function(){
        var sel = $("#selOperation").val();
        $("#textAreaTranslateRule").val(str+sel+" ");
      }).focusout(function(){
        $("#selOperation").val("");
        str = $("#textAreaTranslateRule").val();
      });
      $("#selBoolLiteral").change(function(){
        var sel = $("#selBoolLiteral").val();
        $("#textAreaTranslateRule").val(str+sel+" ");
      }).focusout(function(){
        $("#selBoolLiteral").val("");
        str = $("#textAreaTranslateRule").val();
      });
      $("#textOtherLiteral").keyup(function(){        
        var sel = $("#textOtherLiteral").val();
        $("#textAreaTranslateRule").val(str+sel+" "); 
      }).focusout(function(){
        $("#textOtherLiteral").val("");
        str = $("#textAreaTranslateRule").val();
      });

      //click function of button panel
      $(".section").hide();
      $(".buttonsPanel button").click(function(e){
        if($("#dvTranslateRule").is(":visible") == false){
          return;
        }
        $("#selInput").val("");
        $("#selColumn").val("");
        $("#selOperation").val("");
        $("#selBoolLiteral").val("");
        $("#textOtherLiteral").val("");
        str = $("#textAreaTranslateRule").val();

        switch($(this).text()){
          case "Add Input":
            $(".section").hide();
            $("#dvTranslateRule").show();
            $("#dvAddInput").show();
            break;
          case "Add Column":
            $(".section").hide();
            $("#dvTranslateRule").show();
            $("#dvAddColumn").show();
            break;
          case "Add Operation":            
            $(".section").hide();
            $("#dvTranslateRule").show();
            $("#dvAddOperation").show();
            break;
          case "Add Literal":            
            $(".section").hide();
            $("#dvTranslateRule").show();
            $("#dvAddLiteral").show();
            break;
          case "Remove":
            var selectedRow = $(".selected");
            var seletedRowText = trim(selectedRow.text());
            var reg = new RegExp("(When -|Then Translate|Otherwise -|New Translate Rule|New Translate Condition Rule)","i");
            if(false==reg.test(seletedRowText)){
              var id = selectedRow.attr("data-tt-id");
              //translate rule, delete this row.
              if(layer(id) == 3){
                selectedRow.detach();
              }
              //condition rule, delete condition and relative translate rules.
              else if(layer(id)==2){
                var rootId = getRootNodeId(id);
                $("tr[data-tt-id]").each(function(){
                  thisId = $(this).attr("data-tt-id");
                  if(getRootNodeId(thisId) == rootId){
                    $(this).detach();
                  }
                });
              }
            }
            break;
        };
      });
  



      $("#example-advanced").treetable({ expandable: true });
      $("#example-advanced").treetable('expandAll');


      //select a line in the table, highlight the line, and display edit area
      $("#example-advanced tbody").on("mousedown", "tr", function() {
        $(".selected").not(this).removeClass("selected");
        $(this).addClass("selected");
        
        var tmp = $(this).text();
        tmp=trim(tmp);
        var reg = new RegExp("(When -|Then Translate|New Translate|Otherwise -)","i");
        if(false == reg.test(tmp)){
          $("#dvTranslateRule").show();
          tmp = tmp.split(":");
          if(1==tmp.length){
            tmp=tmp[0];
          }else{
            tmp=trim(tmp[1]);
          }
          $("#textAreaTranslateRule").val(tmp);
        }else{
          switch2Read();
        }
      });




      // $("tbody span a").click(function(e){
      //     //$("#dvTranslateRule").hide();
      //     tmp = trim($(this).text());
      //     //New Translate Rule
      //     if(tmp == "New Translate Rule"){
      //       switch2Read();
      //       $("#textAreaTranslateRule").attr("placeholder", "Please edit a translate rule as Output = Column");
      //       $("#dvTranslateRule").show();
      //     }
      //     //New Condition Rule
      //     else if(tmp == "New Translate Condition Rule"){
      //       switch2Read();
      //       $("#dvNewConditionRuleName").show();
      //     }else{
      //       switch2Read();
      //       $("#textAreaTranslateRule").attr("placeholder", "");
      //     }          
      //     //addRule($(this), e.target.innerHTML);
      // });

      $("[href=##]").click(function(){
        newRule(trim($(this).text()));           
      });

      function newRule(ruleType){
        //New Translate Rule
        if(ruleType == "New Translate Rule"){
          switch2Read();
          $("#textAreaTranslateRule").attr("placeholder", "Please edit a translate rule as Output = Column");
          $("#dvTranslateRule").show();
        }
        //New Condition Rule
        else if(ruleType == "New Translate Condition Rule"){
          switch2Read();
          $("#dvNewConditionRuleName").show();
          $("#textNewConditionRuleName").focus();
        }else{
          switch2Read();
          $("#textAreaTranslateRule").attr("placeholder", "");
        }         
      }

      function addRule(sourceObject, commandSource){
          switch(commandSource){
            case "New Translate Rule":
              var id = sourceObject.parents("tr").attr("data-tt-id");
              var parentId = sourceObject.parents("tr").attr("data-tt-parent-id");
              //move down
              idPart1 = id.substring(0, id.lastIndexOf("."));
              tmp = id.substring(id.lastIndexOf(".")+1);
              tmp = parseInt(tmp) + 1;
              idPart2 = tmp.toString();
              newId = idPart1+"."+idPart2;
              sourceObject.parents("tr").attr("data-tt-id", newId);

              //add a new tr before New Translate Rule
              var html = "<tr data-tt-id=#id data-tt-parent-id=#parentId><td>TESTTEST</td></tr>";
              html = html.replace("#id", id).replace("#parentId", parentId);
           
              var pos = sourceObject.parents("tr");
              var node = $("#example-advanced").treetable('node',idPart1);
              var linknode = $("[data-tt-id='"+newId+"']");

              $("#example-advanced").treetable('loadBranch',node,$(html));
              linknode = linknode.detach();
              $("[data-tt-id='"+id+"']").after(linknode);

              break;

            case "New Translate Condition Rule":
              var html =  "" +
                "<tr data-tt-id=#L1ID  style='background-color:#996699'>\
                  <td><span>When - LOOKUP</span></td>\
                </tr>\
                <tr data-tt-id=#L2ID1 data-tt-parent-id=#L1ID>\
                  <td>my lookup:  </td>\
                </tr>\
                <tr data-tt-id=#L2ID2 data-tt-parent-id=#L1ID>\
                  <td  style='background-color:#C8C8C8'><span >Then Translate(1)</span></td>\
                </tr>\
                <tr data-tt-id=#L3ID1 data-tt-parent-id=#L2ID2>\
                  <td>GEOGRPHY_DESP = FDW_CorpFin_GeoDescp</td>\
                </tr>\
                <tr data-tt-id=#L3ID2 data-tt-parent-id=#L2ID2>\
                  <td><span class='file'><a href='#'>New Translate Rule</a></span></td>\
                </tr>";

              var id = sourceObject.parents("tr").attr("data-tt-id");
              var L1ID = id;
              var L2ID1 = id + "." + "1";
              var L2ID2 = id + "." + "2";
              var L3ID1 = L2ID2 + "." + "1";
              var L3ID2 = L2ID2 + "." + "2";

              html = html.replace(/#L1ID/g, L1ID).replace(/#L2ID1/g, L2ID1).replace(/#L2ID2/g, L2ID2);
              html = html.replace(/#L3ID1/g, L3ID1).replace(/#L3ID2/g, L3ID2);

              var newId = parseInt(id) + 1;
              sourceObject.parents("tr").attr("data-tt-id", newId);

              $("#example-advanced").treetable('loadBranch',null,$(html));
              $("[data-tt-id='"+L3ID2+"'] a").bind('click',  function(event){
                addRule($(this), event.target.innerHTML);
                // addRule($("[data-tt-id='"+L3ID2+"'] a"), event.target.innerHTML);
              });
              sourceObject.parents("tr").detach();
              sourceObject.parents("tr").appendTo("#example-advanced tbody");
              $("#example-advanced").treetable('expandAll');
              break;

        };
      };

      //setup literal display
      $("#selLiteralType").val("Text");
      $("#selBoolLiteral").hide();
      $("#textOtherLiteral").show();
      $("#selLiteralType").change(function(){
        if($(this).val() == "Boolean"){
          $("#selBoolLiteral").show();
          $("#textOtherLiteral").hide();
        }else{
          $("#selBoolLiteral").hide();
          $("#textOtherLiteral").show();
        }        
      });



})


//remove blankspace and \n at the begining and endding of a string.
function trim(str){
  var i;
  for (i=0;i<str.length;i++) {
    if(str.charAt(i) != ' ' && str.charAt(i) != '\n' ){
      break;
    }
  }
  var j;
  for (j=str.length-1;j>=0;j--) {
    if(str.charAt(j) != ' ' && str.charAt(j) != '\n' ){
      break;
    }
  }
  return str.substring(i, j+1);
}

//get the layer of a row with data-tt-id = id.
function layer(id){
  var n = id.split(".");
  return n.length;
};

function getRootNodeId(id){
  var n = id.split(".");        
  var ret = n[0];
  return ret;
};


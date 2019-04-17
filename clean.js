var handleType;
function handleFileSelect(type){     
  handleType = type;          
  if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    alert('The File APIs are not fully supported in this browser.');
    return;
  }   

  input = document.getElementById('fileinput');
  if (!input) {
    alert("Um, couldn't find the fileinput element.");
  }
  else if (!input.files) {
    alert("This browser doesn't seem to support the `files` property of file inputs.");
  }
  else if (!input.files[0]) {
    alert("Please select a file before clicking 'Load'");               
  }
  else {
    file = input.files[0];
    fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsText(file)
  }
}

function receivedText() {
  let text = fr.result;
  //remove context-group and context tags after it remove linebreaks from xlf and reformat it
  let newText = text.replace(/(<context-group (.*)>)/ig,"");
  let newText2 = newText.replace(/(<context (.*)>(.*)<\/context>)/ig,"");
  let newText3 = newText2.replace(/(<\/context-group>)/ig,"");
  let newText4 = newText3.replace(/\r?\n|\r/ig, "");
  let newText5 = newText4.replace(/(<\/trans-unit>)/gm, "<\/trans-unit> \n");
  let newText6 = newText5.replace(/(<source>)/ig, "\n<source>");
  let newText7 = newText6.replace(/(<\/source>)/ig, "<\/source> \n");
  let newText8 = newText7.replace(/(^ +)/gm, "");
  var newText9 = newText8.replace(/(<source>)/ig, "\t<source>");
  let newText10 = "";


  switch(handleType){  
    case "review":
      document.getElementById('editor').value = newText9 ;
      break;
    case "clean":
      var filename = prompt("Download cleaned file", "messages.xlf");
      var blob = new Blob([newText9], {
        type: "text/plain;charset=utf-8"
      });
      saveAs(blob, filename);
      break;
    case "review_test":
      newText10 = newText9.replace(/(<source>(.*)<\/source>)/ig, function(source){
        let text = source;
        let text1 = text.replace(/(<source>)/ig, "");
        let text2 = text1.replace(/(<\/source>)/ig, "");
        return source + '\n\t<target>'+text2+'_test</target>';
      });
      document.getElementById('editor').value = newText10;
      break;
    case "generate_test":
      newText10 = newText9.replace(/(<source>(.*)<\/source>)/ig, function(source){
        let text = source;
        let text1 = text.replace(/(<source>)/ig, "");
        let text2 = text1.replace(/(<\/source>)/ig, "");
        return source + '\n\t<target>'+text2+'_test</target>';
      });
      var filename = prompt("Download cleaned test file", "messages.test.xlf");
      var blob = new Blob([newText10], {
        type: "text/plain;charset=utf-8"
      });
      saveAs(blob, filename);
      break;
    }
}        
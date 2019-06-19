function CommandEnter(event){
   var keyCode = event.charCode;
    if(keyCode == 13){
        // If Enter Key is pressed:
        
        //  Get value of Input tag
        var CommandLineText = document.getElementById("Command_Line").value;
        //  Add it on to the old command table at the end
        document.getElementById("Old_Commands").insertRow(-1).insertCell(-1).innerHTML = CommandLineText;
        //  Set Input line to empty
        document.getElementById("Command_Line").value="";
        
    }
    
}

FocusOnInput = function getFocus(){
    //  Make sure user is focused on input line
    document.getElementById("Command_Line").focus();
}

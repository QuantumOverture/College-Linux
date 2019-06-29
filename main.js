// === CORE ==============================
dir_hashtable = new Map();
dir_hashtable.set("/root",["|"]);
current_working_directory = "/root";
file_hashtable = new Map();

//=======================================
/*

Add to table command:
 document.getElementById("Old_Commands").insertRow(-1).insertCell(-1).innerHTML = "UNSUPPORTED COMMAND!";




TO DO LIST:(ERROR CHECKING AT EVERY STEP)
Path Resolution ==> new path and file path AND TAB(for FILE PATHS) <----------------------------------------------
Commands(all + flags)[FILE SYSTEM COMMANDS] ==> Make then their own functions and they return their output <_____|
Piping and redirection

*/



//======================================KEY PRESSES=====================================================================
function CommandEnter(event){
   var keyCode = event.charCode;
    if(keyCode == 13){
        // If Enter Key is pressed:
        
        //  Get value of Input tag
        var CommandLineText = document.getElementById("Command_Line").value;
        
        
      
    }
    
}
//=======================================KEY PRESSES END================================================================









//======================================STYLE============================================================================

FocusOnInput = function getFocus(){
    //  Make sure user is focused on input line
    document.getElementById("Command_Line").focus();
}

//========================================STYLE END======================================================================









//======================================INTERNAL STUFF===================================================================
function PathResolution(Path){
    
}
//======================================INTERNAL STUFF END================================================================








//======================================COMMANDS===================================================================


//======================================COMMANDS END===============================================================


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
        
        PathResolution("/root/test/cool/nice.txt");
      
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

function IsInDirectory(Internal_Directory,Dir){
    //  Function: Simpilfies Directory Check
    return dir_hashtable.get(Internal_Directory).slice(0,dir_hashtable.get(Internal_Directory).indexOf("|")).find(Dir);
}

function IsAInternalFile(Internal_Directory,Fil){
        //  Function: Simpilfies File Check
    return dir_hashtable.get(Internal_Directory).slice(dir_hashtable.get(Internal_Directory).indexOf("|"),dir_hashtable.get(Internal_Directory).length).find(Dir);
}


function PathResolution(Path){
    //  Function: More like a path checker -->as we have hashtables that give us direct access
    var Internal_Directory = current_working_directory;
    var ResolvedPath = Path.split("/");

    for(var i = 0; i < Path.length; i++){
        // files (there and not) + directories (there and not)
        if(IsInDirectory(Internal_Directory,Path[i]) != undefined){
            //  Moves futhter in Path
            Internal_Directory = Path[i];
        }else if(IsInDirectory(Internal_Directory,Path[i]) == undefined && i == Path.length-1){
            //  For commands like mkdir
            return ["new directory",Path[i]];
        }else if(IsAInternalFile(Internal_Directory,Path[i]) != undefined && i == Path.length-1){
            //  For commands like rm and cat
            return ["old file",Path[i],Internal_Directory];
        }else if(IsAInternalFile(Internal_Directory,Path[i]) == undefined && i == Path.length-1){
            //  For commands like touch
            return ["new file",Path[i],Internal_Directory];
        }else{
            alert(".:ERROR IN PATH:.");
            return "ERROR";
        }
                 
        return ["old directory",Internal_Directory];
        
    }
}
//======================================INTERNAL STUFF END================================================================








//======================================COMMANDS===================================================================


//======================================COMMANDS END===============================================================


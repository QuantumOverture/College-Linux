// === CORE ==============================
dir_hashtable = new Map();
dir_hashtable.set("/root",["NULL","|"]);
current_working_directory = "/root";
file_hashtable = new Map();

//=======================================
/*

Add to table command:
 document.getElementById("Old_Commands").insertRow(-1).insertCell(-1).innerHTML = "UNSUPPORTED COMMAND!";


MV:
name change requries both args to be in the same directory

CHECK TASK LIST ON THE RIGHT -->

Spaces not needed between > and < and >>

tee command comment but not included
*/



//======================================KEY PRESSES=====================================================================
function CommandEnter(event){
   var keyCode = event.charCode;
    if(keyCode == 13){
        // If Enter Key is pressed:
        //  Get value of Input tag
        var CommandLineText = document.getElementById("Command_Line").value;
        var CommandArray = CommandLineText.split("|");
        //  Output goes into other OR file not both
        var Output = CommandResolution(CommandArray);
        document.getElementById("Old_Commands").insertRow(-1).insertCell(-1).innerHTML = "User~:" + CommandLineText;
        document.getElementById("Old_Commands").insertRow(-1).insertCell(-1).innerHTML = Output;
        document.getElementById("Command_Line").value = "";
        
        
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
    return dir_hashtable.get(Internal_Directory).slice(0,dir_hashtable.get(Internal_Directory).indexOf("|")).indexOf(Dir);
}

function IsAInternalFile(Internal_Directory,Fil){
    //  Function: Simpilfies File Check
    return dir_hashtable.get(Internal_Directory).slice(dir_hashtable.get(Internal_Directory).indexOf("|"),dir_hashtable.get(Internal_Directory).length).indexOf(Fil);
}


function PathResolution(Path){
    //  Function: More like a path checker -->as we have hashtables that give us direct access[make sure you handle new directory/file properly based on context of calling function ==> If it something like rm or cat --> throw an error]
    var Internal_Directory = current_working_directory;
    var ResolvedPath = Path.split("/");
   
    for(var i = 0; i < ResolvedPath.length; i++){
        if(ResolvedPath[i] == "" || ResolvedPath[i] == "root"){
            Internal_Directory = "/root";
            continue;
        }
        
        // files (there and not) + directories (there and not)
        if(IsInDirectory(Internal_Directory,ResolvedPath[i]) != -1){
            //  Moves further in ResolvedPath
            Internal_Directory = ResolvedPath[i];
        }else if(ResolvedPath[i] == ".."){
            Internal_Directory = dir_hashtable.get(Internal_Directory)[0];
        }else if(ResolvedPath[i] == "."){
            //  Do nothing lol
        }else if(IsInDirectory(Internal_Directory,ResolvedPath[i]) == -1 && IsAInternalFile(Internal_Directory,ResolvedPath[i]) == -1){
            //  For commands like mkdir and touch[functions that require NON-existing entites] but ALSO an error signal for commands like rm and cat[functions that require existing entites]
            if(i == (ResolvedPath.length)-1){
            return ["new directory/file",ResolvedPath[i],Internal_Directory];
            }else{
                alert(".:ERROR IN PATH:.");
                return "ERROR";
            }
        }else if(IsAInternalFile(Internal_Directory,ResolvedPath[i]) != -1 ){
            //  For commands like cat
            if(i == (ResolvedPath.length)-1){
                return ["old file",ResolvedPath[i],Internal_Directory];
            }else{
                alert(".:ERROR IN PATH:.");
                return "ERROR";
            }
    
        }else{
            alert(".:ERROR IN PATH:.");
            return "ERROR";
        }
              

        
    }
            return ["old directory",Internal_Directory];
}


function CommandResolution(CommandArray){
    //  Function: Resolve given commands while keeping piping and file redirection in mind
    //  WE get an array which has been broken down by | --> further break it down by command spaces
    var InternalOutput = "";
    
    /*
    * Implement the following functions:
    *FileIn,FileOut,FileAppend
    *All the commands
    */
    for(var i = 0; i < CommandArray.length; i++){
        //  We are going through each pipped (or even a single command) command
        if(CommandArray[i].indexOf("<") != -1 || CommandArray[i].indexOf(">") != -1){
            // File Output   command | file if file doesn't exist make it unless it is append
            //  For the redirections be aware there can be > < > inside
            var CurrCommand = CommandArray[i].split("<");
            FileInOutAppend(CurrCommand);
            InternalOutput = "";
        }else{
            //  Command Resolution
            var CurrCommand = CommandArray[i].split(" ");
            //  We put InternalOutput There Because of Piping related reasons(added parameter) --> We no output then return ""
            //  Have internal checks for empty parameters for each command
            switch(CurrCommand[0]){
            /*[X}*/case "mkdir": CurrCommand = mkdir(CurrCommand,InternalOutput); break;
            /*[X}*/case "rmdir": CurrCommand = rmdir(CurrCommand,InternalOutput); break;
            case "rm": CurrCommand = rm(CurrCommand,InternalOutput); break;
            /*[X}*/case "touch": CurrCommand = touch(CurrCommand,InternalOutput); break;
            /*[X}*/case "clear": CurrCommand = clear(CurrCommand,InternalOutput); break;        
            /*[X}*/case "cat": CurrCommand = cat(CurrCommand,InternalOutput); break;
            /*[X}*/case "ls": CurrCommand = ls(CurrCommand,InternalOutput); break;
            /*[X}*/case "echo": CurrCommand = echo(CurrCommand,InternalOutput); break;
            /*[X}*/case "cd": CurrCommand = cd(CurrCommand,InternalOutput); break;
            case "cp": CurrCommand = cp(CurrCommand,InternalOutput); break;
            case "mv": CurrCommand = mv(CurrCommand,InternalOutput); break;
            /*[X}*/case "pwd": CurrCommand = pwd(CurrCommand,InternalOutput); break;
            default : CurrCommand = "UNSUPPORTED COMMAND";break; }

            InternalOutput = CurrCommand;
            if(CurrCommand == "UNSUPPORTED COMMAND"){ 
                return InternalOutput;
            }
                
           
        }
        
    }
    
    return InternalOutput;
}

//======================================INTERNAL STUFF END================================================================








//======================================COMMANDS===================================================================

function mkdir(CurrCommand,InternalOutput){
    //  Resolve path piping and regular
    if( CurrCommand.length <2){
        GivenPath = PathResolution(InternalOutput);  
    }else{
        GivenPath = PathResolution(CurrCommand[1]);
    }
  
    if(GivenPath == "Error" || GivenPath[0] != "new directory/file"){
        return "mkdir Error";
    }
    
    //  Intialize new directory
    dir_hashtable.set(GivenPath[1],["|"]);
    (dir_hashtable.get(GivenPath[1])).splice(0,0,GivenPath[2]);
    
    //  Add to new directory to start
    (dir_hashtable.get(GivenPath[2])).splice((dir_hashtable.get(GivenPath[2])).indexOf("|"),0,GivenPath[1]);
    return "";
}


function ls(CurrCommand,InternalOutput){
    //  Conditional here to hide .. for cd ..s
    return dir_hashtable.get(current_working_directory).slice(1);
}

function cd(CurrCommand,InternalOutput){
    
    if( CurrCommand.length <2){
        GivenPath = PathResolution(InternalOutput);  
    }else{
        GivenPath = PathResolution(CurrCommand[1]);
    }

    if(GivenPath == "Error" || GivenPath[0] != "old directory"){
        return "Cd Error";
    }
    
    current_working_directory = GivenPath[1];
    if(current_working_directory == "NULL"){
        current_working_directory = "/root";
    }
    
    
    return "";
}

function pwd(CurrCommand,InternalOutput){
    return current_working_directory;
}


function echo(CurrCommand,InternalOutput){

    if( CurrCommand.length <2){
        GivenString = InternalOutput.join(" ");  
    }else{
        GivenString = CurrCommand.slice(1).join(" ");
    }
    return GivenString;
}


function clear(CurrCommand,InternalOutput){
    NumRows = document.getElementById('Old_Commands').rows.length;

    for(var i = 0; i < NumRows; i++){
        document.getElementById('Old_Commands').deleteRow(-1);
    }
    return "";   
}

function rmdir(CurrCommand,InternalOutput){
    if( CurrCommand.length <2){
        GivenPath = PathResolution(InternalOutput);  
    }else{
        GivenPath = PathResolution(CurrCommand[1]);
    }    
    if(GivenPath == "Error" || GivenPath[0] != "old directory"){
        return "rmdir Error";
    }
    
    if(dir_hashtable.get(GivenPath[1]).length == 2){
        //  Removing Child directory access from parent
        dir_hashtable.get(dir_hashtable.get(GivenPath[1])[0]).splice(dir_hashtable.get(dir_hashtable.get(GivenPath[1])[0]).indexOf(GivenPath[1]),1);
        dir_hashtable.delete(GivenPath[1]);
        
    }else{
        return "Directory not empty"; 
    }    

    
    return "";
}


function touch(CurrCommand,InternalOutput){
    if( CurrCommand.length <2){
        GivenPath = PathResolution(InternalOutput);  
    }else{
        GivenPath = PathResolution(CurrCommand[1]);
    }    
    if(GivenPath == "Error" || GivenPath[0] != "new directory/file"){
        return "Touch Error";
    }

    
    dir_hashtable.get(GivenPath[2]).splice((dir_hashtable.get(GivenPath[2])).indexOf("|")+1,0,GivenPath[1]);
    file_hashtable.set(GivenPath[1],"FILE CONTENTS OF "+GivenPath[1]);
    
    return "";
}

function cat(CurrCommand,InternalOutput){
    if( CurrCommand.length <2){
        GivenPath = PathResolution(InternalOutput);  
    }else{
        GivenPath = PathResolution(CurrCommand[1]);
    }    
    if(GivenPath == "Error" || GivenPath[0] != "old file"){
        return "Cat Error";
    }
    
    //  ["old file",ResolvedPath[i],Internal_Directory];
    return  file_hashtable.get(GivenPath[1]); 
    
}


//======================================COMMANDS END===============================================================


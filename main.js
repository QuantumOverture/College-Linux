// === CORE ==============================
dir_hashtable = new Map();
dir_hashtable.set("/root",["|"]);
current_working_directory = "/root";
file_hashtable = new Map();
info_hashtable = new Map(); //  For Date/time,permissions,etc.
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
        document.getElementById("Old_Commands").insertRow(-1).insertCell(-1).innerHTML = CommandLineText;
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
            continue;
        }
    
        // files (there and not) + directories (there and not)
        if(IsInDirectory(Internal_Directory,ResolvedPath[i]) != -1){
            //  Moves further in ResolvedPath
            Internal_Directory = ResolvedPath[i];
        }else if(IsInDirectory(Internal_Directory,ResolvedPath[i]) == -1 || IsAInternalFile(Internal_Directory,ResolvedPath[i]) == -1){
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
        if(CommandArray[i].indexOf("<") != -1 && CommandArray[i].indexOf(">") != -1){
            // File Output   command | file if file doesn't exist make it unless it is append
            //  For the redirections be aware there can be > < > inside
            var CurrCommand = CommandArray[i].split("<");
            FileInOutAppend(CurrCommand);
            InternalOutput = "";
        }}else{
            //  Command Resolution
            var CurrCommand = CommandArray[i].split(" ");
            
            //  We put InternalOutput There Because of Piping related reasons(added parameter) --> We no output then return ""
            //  Have internal checks for empty parameters for each command
            switch(CurrCommand[0]){
            case "mkidr": CurrCommand = mkdir(CurrCommand,InternalOutput); break;
            case "rmdr": CurrCommand = rmdir(CurrCommand,InternalOutput); break;
            case "rm": CurrCommand = rm(CurrCommand,InternalOutput); break;
            case "touch": CurrCommand = touch(CurrCommand,InternalOutput); break;
            case "cat": CurrCommand = cat(CurrCommand,InternalOutput); break;
            case "ls": CurrCommand = ls(CurrCommand,InternalOutput); break;
            case "echo": CurrCommand = echo(CurrCommand,InternalOutput); break;
            case "cd": CurrCommand = cd(CurrCommand,InternalOutput); break;
            case "cp": CurrCommand = cp(CurrCommand,InternalOutput); break;
            case "mv": CurrCommand = mv(CurrCommand,InternalOutput); break;
            case "head": CurrCommand = head(CurrCommand,InternalOutput); break;
            case "pwd": CurrCommand = pwd(CurrCommand,InternalOutput); break;
            case "tail": CurrCommand = tail(CurrCommand,InternalOutput); break;
            case "chmod": CurrCommand = chmod(CurrCommand,InternalOutput); break;
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


//======================================COMMANDS END===============================================================


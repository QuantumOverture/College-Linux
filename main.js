supported_commands = ["mv","ls","cat","rm","rmdir","mkdir","head","tail","pwd","cd","cp","clear","touch"];
dir_hashtable = new Map();
dir_hashtable.set("/root",["|"]);
current_working_directory = "/root";
file_hashtable = new Map();
/*
TO DO LIST:

- make rest of supported commands and flags
- make cd work with .. , relative and absolute paths --> correct all commands other than cd
- implement correct error checking
- correct ls --> shouldn't show | and should be in correct format
- Piping and redirection
- tab autocomplete
- check wiki for final check
- rm and rmdir are not realistic
- functions for each command
*/



function PathResolution(path,command){
    if(path.substr(0,1) == "/" ){
        path = path.substr(1,path.length);
        if(path.substr(0,4)!="root"){
            return -12;
        }
        
       }
    var internal_dir = current_working_directory;
    var arr_path = path.split("/");
    for(var i = 0;i < arr_path.length; i++){
        if(arr_path[i] == "root"){
             internal_dir = "/root";
        }else if(arr_path[i] == ".."){
            internal_dir = dir_hashtable.get(internal_dir)[0];
        }else if(dir_hashtable.get(internal_dir).includes(arr_path[i])){
            internal_dir = arr_path[i];
        }else if(arr_path[i] == "." || arr_path[i] == null){
            //  do nothing lel
        }else if(command == "mkdir" && i == arr_path.length-1){
            return [internal_dir,arr_path[i]];
        }
        else{
            return -12;
        }
        
    }
    
    return  internal_dir;
    
}


function CommandEnter(event){
   var keyCode = event.charCode;
    if(keyCode == 13){
        var Pipe_Redirect = false;
        // If Enter Key is pressed:
        
        //  Get value of Input tag
        var CommandLineText = document.getElementById("Command_Line").value;
        
        if(CommandLineText.includes("|") || CommandLineText.includes(">") || CommandLineText.includes("<")){
             Pipe_Redirect = true;
        }
        var command_arr = CommandLineText.split(" ");
        
        if(!supported_commands.includes(command_arr[0])){
             document.getElementById("Old_Commands").insertRow(-1).insertCell(-1).innerHTML = "UNSUPPORTED COMMAND!";
            document.getElementById("Command_Line").value="";
            return;
        }
        
 
 
        //  Add it on to the old command table at the end
        document.getElementById("Old_Commands").insertRow(-1).insertCell(-1).innerHTML = ">User~:"+CommandLineText;
        //  Set Input line to empty
        document.getElementById("Command_Line").value="";
        
        // still need to contented with piping :/
        TerminalOutput(command_arr);
    }
    
}

FocusOnInput = function getFocus(){
    //  Make sure user is focused on input line
    document.getElementById("Command_Line").focus();
}

function TerminalOutput(command_arr){
    //  add appropriate error checking
    if(command_arr[0] == "mkdir"){
        resolved_path = PathResolution(command_arr[1],"mkdir");
        dir_hashtable.set(resolved_path[1],["|"]);
        dir_hashtable.get(resolved_path[1]).splice(0,0,resolved_path[0]);
        dir_hashtable.get(resolved_path[0]).splice(dir_hashtable.get(resolved_path[0]).indexOf("|"),0,resolved_path[1]);
    }else if(command_arr[0] == "cd"){
      
        current_working_directory = PathResolution(command_arr[1],"cd");
        if(current_working_directory == -12){
            alert("INCORRECT PATH!");
            current_working_directory = "/root";
        }
        
    }else if(command_arr[0] == "pwd"){
        document.getElementById("Old_Commands").insertRow(-1).insertCell(-1).innerHTML = current_working_directory;
    }else if(command_arr[0] == "ls"){
        // fix this --> first element is cd ..
        document.getElementById("Old_Commands").insertRow(-1).insertCell(-1).innerHTML =  dir_hashtable.get(current_working_directory).toString();
    }else if(command_arr[0] == "clear"){
        var runs =document.getElementById("Old_Commands").rows.length;
        for(var i=0;i<runs;i++){
            document.getElementById("Old_Commands").deleteRow(-1);
        }
    }else if(command_arr[0] == "cat"){
        if(dir_hashtable.get(current_working_directory).includes(command_arr[1])){
            document.getElementById("Old_Commands").insertRow(-1).insertCell(-1).innerHTML =  file_hashtable.get(command_arr[1]);
        }   
    }else if(command_arr[0] == "touch"){
        
        dir_hashtable.get(current_working_directory).splice(  dir_hashtable.get(current_working_directory).length,0,command_arr[1]);
        file_hashtable.set(command_arr[1],"EMPTY FILE\nVIM COPY HASN'T BEEN MADE YET"+command_arr[1]);
    }else if(command_arr[0] == "rm"){
      dir_hashtable.get(current_working_directory).splice(dir_hashtable.get(current_working_directory).indexOf(command_arr[1]),1);
      file_hashtable.delete(command_arr[1]);
    }else if(command_arr[0] == "rmdir"){
        if(!dir_hashtable.get(current_working_directory).includes(command_arr[1])){
            return;}
       dir_hashtable.get(current_working_directory).splice(dir_hashtable.get(current_working_directory).indexOf(command_arr[1]),1);
        for(var i=dir_hashtable.get(command_arr[1]).indexOf("|")+1;i<dir_hashtable.get(command_arr[1]).length;i++){
            file_hashtable.delete(dir_hashtable.get(current_working_directory)[i]);
        }
        dir_hashtable.delete(command_arr[1]);
    }else if(command_arr[0] == "mv"){
        if(!file_hashtable.has(command_arr[1])){
            return;
        }
        if(dir_hashtable.has(command_arr[2])){
            dir_hashtable.get(current_working_directory).splice((dir_hashtable.get(current_working_directory)).indexOf(command_arr[1]),1);
             dir_hashtable.get(command_arr[2]).splice(  dir_hashtable.get(command_arr[2]).length,0,command_arr[1]);
        }else if(file_hashtable.has(command_arr[1]) && !dir_hashtable.has(command_arr[2])){
            dir_hashtable.get(current_working_directory).splice((dir_hashtable.get(current_working_directory)).indexOf(command_arr[1]),1);
            dir_hashtable.get(current_working_directory).splice( dir_hashtable.get(current_working_directory).length,0,command_arr[2]);
            var OldContents = file_hashtable.get(command_arr[1]);
            file_hashtable.delete(command_arr[1]);
            file_hashtable.set(command_arr[2],OldContents);
        }
    }
        
    
    
    }
    
    
    


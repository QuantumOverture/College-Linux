supported_commands = ["mv","ls","cat","rm","rmdir","mkdir","head","tail","pwd","cd","cp","clear","touch"];
dir_hashtable = new Map();
dir_hashtable.set("/root",["|"]);
current_working_directory = "/root";
file_hashtable = new Map();
/*
TO DO LIST:

- make rest of supported commands
- make cd work with .. , relative and absolute paths
- implement correct error checking
- correct ls --> shouldn't show | and should be in correct format
- Piping and redirection


*/



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
        document.getElementById("Old_Commands").insertRow(-1).insertCell(-1).innerHTML = CommandLineText;
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
       dir_hashtable.set(command_arr[1],["|"]);
        dir_hashtable.get(current_working_directory).splice(0,0,command_arr[1]);
    }else if(command_arr[0] == "cd"){
        current_working_directory = command_arr[1];
    }else if(command_arr[0] == "pwd"){
        document.getElementById("Old_Commands").insertRow(-1).insertCell(-1).innerHTML = current_working_directory;
    }else if(command_arr[0] == "ls"){
        // fix this
        document.getElementById("Old_Commands").insertRow(-1).insertCell(-1).innerHTML =  dir_hashtable.get(current_working_directory);
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
        file_hashtable.set(command_arr[1],"EMPTY FILE\nVIM COPY HASN'T BEEN MADE YET");
    }else if(command_arr[0] == "rm"){
        
    }
    
    
    
}

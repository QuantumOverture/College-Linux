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
        document.getElementById("Old_Commands").insertRow(-1).insertCell(-1).innerHTML = "User~:" + CommandLineText;
        var Output = CommandResolution(CommandArray);
        Output = Output.replace("\\t","                ");
        Output = Output.split("\n");
        //  for \n to show up properly
        for(var x=0;x<Output.length;x++){
        document.getElementById("Old_Commands").insertRow(-1).insertCell(-1).innerHTML = Output[x];
        }
        
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
            
            InternalOutput = FileInOutAppend(CommandArray[i],InternalOutput);
        }else{
            //  Command Resolution
            var CurrCommand = CommandArray[i].split(" ");

            while(CurrCommand[0] == ""){
                CurrCommand.splice(0,1);
            }
            
            while(CurrCommand[CurrCommand.length-1] == " "){
                CurrCommand.splice(CurrCommand.length-1,1);
            }
            
            
            //  We put InternalOutput There Because of Piping related reasons(added parameter) --> We no output then return ""
            //  Have internal checks for empty parameters for each command
            switch(CurrCommand[0]){
            /*[X}*/case "mkdir": CurrCommand = mkdir(CurrCommand,InternalOutput); break;
            /*[X}*/case "rmdir": CurrCommand = rmdir(CurrCommand,InternalOutput); break;
            /*[X}*/case "rm": CurrCommand = rm(CurrCommand,InternalOutput); break;
            /*[X}*/case "touch": CurrCommand = touch(CurrCommand,InternalOutput); break;
            /*[X}*/case "clear": CurrCommand = clear(CurrCommand,InternalOutput); break;        
            /*[X}*/case "cat": CurrCommand = cat(CurrCommand,InternalOutput); break;
            /*[X}*/case "ls": CurrCommand = ls(CurrCommand,InternalOutput); break;
            /*[X}*/case "echo": CurrCommand = echo(CurrCommand,InternalOutput); break;
            /*[X}*/case "cd": CurrCommand = cd(CurrCommand,InternalOutput); break;
            /*[X}*/case "cp": CurrCommand = cp(CurrCommand,InternalOutput); break;
            /*[X}*/case "mv": CurrCommand = mv(CurrCommand,InternalOutput); break;
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
       document.getElementById("Old_Commands").insertRow(-1).insertCell(-1).innerHTML = InternalOutput;
       return ""; 
    }else{
        GivenString = CurrCommand.slice(1).join(" ");
    }
    

    document.getElementById("Old_Commands").insertRow(-1).insertCell(-1).innerHTML = GivenString;
    return ""; 
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
        return "";
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
    //  Also hold which directory it is in order to remove collisions
    file_hashtable.set(GivenPath[1]+" "+GivenPath[2],"");
    
    return "";
}

function cat(CurrCommand,InternalOutput){
    if( CurrCommand.length <2){
        return InternalOutput;  
    }else{
        GivenPath = PathResolution(CurrCommand[1]);
    }    
    if(GivenPath == "Error" || GivenPath[0] != "old file"){
        return "Cat Error";
    }
    
    //  ["old file",ResolvedPath[i],Internal_Directory];
    return  file_hashtable.get(GivenPath[1]+" "+GivenPath[2]); 
    
}

function cp(CurrCommand,InternalOutput){
    //  Only old file to new file copy supported [keeping the name same and different also supported]
    if( CurrCommand.length <2){
        InternalOutput = InternalOutput.split(" ");
        Source = PathResolution(InternalOutput[0]);
        Destination = PathResolution(InternalOutput[1]);
    }else{
        Source = PathResolution(CurrCommand[1]);
        Destination = PathResolution(CurrCommand[2]);
    }    
    if(Source == "Error" || Destination == "Error" || Source[0]!="old file" || Destination[0]=="old file" ){
        return "Cp Error";
    }
    //  Intialize file
    if(Destination[0] == "old directory"){
        // Same name copy
      
        file_hashtable.set(Source[1]+" "+Destination[1],file_hashtable.get(Source[1]+" "+Source[2]));
        dir_hashtable.get(Destination[1]).push(Source[1]);
    }else{
        //  Different name copy
        file_hashtable.set(Destination[1]+" "+Destination[2],file_hashtable.get(Source[1]+" "+Source[2]));
        // Add file to directory
        dir_hashtable.get(Destination[2]).push(Destination[1]);
    }
    return "";
}


function rmRecursiveDeletion(Directory){

    if(dir_hashtable.get(Directory).length == 2 ){
        dir_hashtable.get(dir_hashtable.get(Directory)[0]).splice(dir_hashtable.get(dir_hashtable.get(Directory)[0]).indexOf(Directory),1);
        dir_hashtable.delete(Directory);
        return "";
    }
    
    for(var i = 1; i < dir_hashtable.get(Directory).indexOf("|"); i++){
   
        rmRecursiveDeletion((dir_hashtable.get(Directory))[i]);
    }
    
    for(i = dir_hashtable.get(Directory).indexOf("|") + 1; i < dir_hashtable.get(Directory).length; i++){
  
        file_hashtable.delete((dir_hashtable.get(Directory))[i]+" "+Directory);
    }
    
    
   for(var j = dir_hashtable.get(Directory).length-1;j>=0;j--){
    
       if(dir_hashtable.get(Directory)[j] == "|"){
           continue;
       }
       
       dir_hashtable.get(Directory).pop();
       
   }
    
    dir_hashtable.get(dir_hashtable.get(Directory)[0]).splice(dir_hashtable.get(dir_hashtable.get(Directory)[0]).indexOf(Directory),1);
    dir_hashtable.delete(Directory);
    return "";
}

function rm(CurrCommand,InternalOutput){
    //  Name of file +" " + Name of directory that holds said file --> also fix |
    if(CurrCommand.indexOf("-r") != -1){
        // recursive directory deletion
        
        CurrCommand.splice(CurrCommand.indexOf("-r"),1);

        if( CurrCommand.length <2){
            GivenPath = PathResolution(InternalOutput);  
        }else{
            GivenPath = PathResolution(CurrCommand[1]);
        }    
        if(GivenPath == "Error" || GivenPath[0] != "old directory"){
            return "rm Error";
        }
        
       
        rmRecursiveDeletion(GivenPath[1]);
       
        
    }else if(CurrCommand.indexOf("-d") != -1){
        //  rmdir
        CurrCommand.splice(CurrCommand.indexOf("-d"),1);
        CurrCommand[0] = "rmdir";
        rmdir(CurrCommand,InternalOutput);
    }else{
        // file removal
        if( CurrCommand.length <2){
            GivenPath = PathResolution(InternalOutput);  
        }else{
            GivenPath = PathResolution(CurrCommand[1]);
        }    
        if(GivenPath == "Error" || GivenPath[0] != "old file"){
            return "rm Error";
        }

        file_hashtable.delete(GivenPath[1]+" "+GivenPath[2]);
        dir_hashtable.get(GivenPath[2]).splice(dir_hashtable.get(GivenPath[2]).indexOf(GivenPath[1]),1);
    }
    
    return "";
}


function mv(CurrCommand,InternalOutput){
    
    
    if( CurrCommand.length <2){
        InternalOutput = InternalOutput.split(" ");
        Source = PathResolution(InternalOutput[0]);
        Destination = PathResolution(InternalOutput[1]); 
    }else{
        Source = PathResolution(CurrCommand[1]); 
        Destination = PathResolution(CurrCommand[2]);
    } 
    
    
    if(Source == "Error" || Destination == "Error"){
        return "Mv Error";
    }else if(Source[0] == "old file" &&  Destination[0]=="new directory/file" && Destination[2] == Source[2]){
        //  File rename
        file_hashtable.set(Destination[1]+" "+Destination[2],file_hashtable.get(Source[1]));
        file_hashtable.delete(Source[1]);
        dir_hashtable.get(Source[2]).splice(dir_hashtable.get(Source[2]).indexOf(Source[1]),1,Destination[1]);
        return "";
    }else if(Source[0] == "old directory" &&  Destination[0]=="new directory/file" && (dir_hashtable.get(Source[1])[0]) == Destination[2]){
        //  Directory rename
        
        //  for cd .. command
        for( var i = 0; i <  dir_hashtable.get(Source[1]).indexOf("|");i++){
            dir_hashtable.get(dir_hashtable.get(Source[1])[i])[0] = Destination[1];
        }
        
        //  for file hashtable 
        for( var i = dir_hashtable.get(Source[1]).indexOf("|")+1; i <  dir_hashtable.get(Source[1]).length;i++){
            file_hashtable.set(dir_hashtable.get(Source[1])[i]+" "+Destination[1],file_hashtable.get(dir_hashtable.get(Source[1])[i]+" "+Source[1]));
            file_hashtable.delete(dir_hashtable.get(Source[1])[i]+" "+Source[1]);
        }
        
        dir_hashtable.set(Destination[1],dir_hashtable.get(Source[1]));
        
        dir_hashtable.delete(Source[1]);
        dir_hashtable.get(Destination[2]).splice(dir_hashtable.get(Destination[2]).indexOf(Source[1]),1,Destination[1]);
        return "";
    }else if(Source[0] == "old file" &&  Destination[0]=="old directory"){
        //  File move
        file_hashtable.set(Source[1]+" "+Destination[1],file_hashtable.get(Source[1]+" "+Source[2]));
        file_hashtable.delete(Source[1]+" "+Source[2]);
        dir_hashtable.get(Source[2]).splice(dir_hashtable.get(Source[2]).indexOf(Source[1]),1);     
        dir_hashtable.get(Destination[1]).push(Source[1]);
        return "";
    }else if(Source[0] == "old directory" &&  Destination[0]=="old directory" && (IsInDirectory(Source[1],Destination[1])) ){
        //  Directory move
        dir_hashtable.get(dir_hashtable.get(Source[1])[0]).splice(dir_hashtable.get(dir_hashtable.get(Source[1])[0]).indexOf(Source[1]),1);
        dir_hashtable.get(Destination[1]).splice(dir_hashtable.get(Destination[1]).indexOf("|"),0,Source[1]);
        return "";
    }
    
    
    
}

function echo(CurrCommand,InternalOutput, Overloaded){
    
    if( CurrCommand.length <2){

        return InternalOutput; 
    }else{
        GivenString = CurrCommand.slice(1).join(" ");
    }
    
    return GivenString;; 
    
}


//======================================COMMANDS END===============================================================



//======================================FILE MANIPULATION===========================================================



function FileInOutAppend(CommandArray,InternalOutput){

//  new file creation case 
    
    if(CommandArray.indexOf(">>") != -1){
        
        
        var CurrCommand = CommandArray.substr(0,CommandArray.indexOf(">>")).split(" ");

        while(CurrCommand[0] == ""){
            CurrCommand.splice(0,1);
        }

        while(CurrCommand[CurrCommand.length-1] == " "){
            CurrCommand.splice(CurrCommand.length-1,1);
        }


        //  We put InternalOutput There Because of Piping related reasons(added parameter) --> We no output then return ""
        //  Have internal checks for empty parameters for each command
        switch(CurrCommand[0]){
                /*[X}*/case "mkdir": CurrCommand = mkdir(CurrCommand,InternalOutput); break;
                /*[X}*/case "rmdir": CurrCommand = rmdir(CurrCommand,InternalOutput); break;
                /*[X}*/case "rm": CurrCommand = rm(CurrCommand,InternalOutput); break;
                /*[X}*/case "touch": CurrCommand = touch(CurrCommand,InternalOutput); break;
                /*[X}*/case "clear": CurrCommand = clear(CurrCommand,InternalOutput); break;        
                /*[X}*/case "cat": CurrCommand = cat(CurrCommand,InternalOutput); break;
                /*[X}*/case "ls": CurrCommand = ls(CurrCommand,InternalOutput); break;
                /*[X}*/case "echo": CurrCommand = echo(CurrCommand,InternalOutput,"OVERLOAD_4_REDIRECTION"); break;
                /*[X}*/case "cd": CurrCommand = cd(CurrCommand,InternalOutput); break;
                /*[X}*/case "cp": CurrCommand = cp(CurrCommand,InternalOutput); break;
                /*[X}*/case "mv": CurrCommand = mv(CurrCommand,InternalOutput); break;
                /*[X}*/case "pwd": CurrCommand = pwd(CurrCommand,InternalOutput); break;
            default : return "UNSUPPORTED COMMAND";break; }

        TestPath = CommandArray.substr(CommandArray.indexOf(">>")+2,CommandArray.length);
        
        while(TestPath[0] == " "){
            TestPath = TestPath.substr(1,TestPath.length);
        }
        
        while(TestPath[TestPath.length-1] == " "){
            TestPath = TestPath.substr(0,TestPath.length-1);
        }
        
        TestPath = PathResolution(TestPath);
        
        if(TestPath == "Error"){
            return "Redirection Error";
        }else if(TestPath[0] == "new directory/file"){
            file_hashtable.set(TestPath[1]+" "+TestPath[2],"");
            dir_hashtable.get(TestPath[2]).splice(dir_hashtable.get(TestPath[2]).indexOf("|")+1,0,TestPath[1]);
        }else if(TestPath[0] != "old file"){
            return "Redirection Error";
        }
        
        file_hashtable.set(TestPath[1]+" "+TestPath[2],file_hashtable.get(TestPath[1]+" "+TestPath[2])+"\n"+CurrCommand);
        
        return "";
        
    }else if(CommandArray.indexOf(">") != -1){
    

        var CurrCommand = CommandArray.substr(0,CommandArray.indexOf(">")).split(" ");

        while(CurrCommand[0] == ""){
            CurrCommand.splice(0,1);
        }

        while(CurrCommand[CurrCommand.length-1] == " "){
            CurrCommand.splice(CurrCommand.length-1,1);
        }


        //  We put InternalOutput There Because of Piping related reasons(added parameter) --> We no output then return ""
        //  Have internal checks for empty parameters for each command
        switch(CurrCommand[0]){
                /*[X}*/case "mkdir": CurrCommand = mkdir(CurrCommand,InternalOutput); break;
                /*[X}*/case "rmdir": CurrCommand = rmdir(CurrCommand,InternalOutput); break;
                /*[X}*/case "rm": CurrCommand = rm(CurrCommand,InternalOutput); break;
                /*[X}*/case "touch": CurrCommand = touch(CurrCommand,InternalOutput); break;
                /*[X}*/case "clear": CurrCommand = clear(CurrCommand,InternalOutput); break;        
                /*[X}*/case "cat": CurrCommand = cat(CurrCommand,InternalOutput); break;
                /*[X}*/case "ls": CurrCommand = ls(CurrCommand,InternalOutput); break;
                /*[X}*/case "echo": CurrCommand = echo(CurrCommand,InternalOutput,"OVERLOAD_4_REDIRECTION"); break;
                /*[X}*/case "cd": CurrCommand = cd(CurrCommand,InternalOutput); break;
                /*[X}*/case "cp": CurrCommand = cp(CurrCommand,InternalOutput); break;
                /*[X}*/case "mv": CurrCommand = mv(CurrCommand,InternalOutput); break;
                /*[X}*/case "pwd": CurrCommand = pwd(CurrCommand,InternalOutput); break;
            default : return "UNSUPPORTED COMMAND";break; }

        TestPath = CommandArray.substr(CommandArray.indexOf(">")+1,CommandArray.length);

        while(TestPath[0] == " "){
            TestPath = TestPath.substr(1,TestPath.length);
        }
      
        while(TestPath[TestPath.length-1] == " "){
            TestPath = TestPath.substr(0,TestPath.length-1);
        }

        TestPath = PathResolution(TestPath);

        if(TestPath == "Error"){
            return "Redirection Error";
        }else if(TestPath[0] == "new directory/file"){
            file_hashtable.set(TestPath[1]+" "+TestPath[2],"");
            dir_hashtable.get(TestPath[2]).splice(dir_hashtable.get(TestPath[2]).indexOf("|")+1,0,TestPath[1]);
        }else if(TestPath[0] != "old file"){
            return "Redirection Error";
        }

        file_hashtable.set(TestPath[1]+" "+TestPath[2],"\n"+CurrCommand);

        return "";
        
             
    }else if(CommandArray.indexOf("<") != -1){

        TestPath = CommandArray.substr(CommandArray.indexOf("<")+1,CommandArray.length);

        while(TestPath[0] == " "){
            TestPath = TestPath.substr(1,TestPath.length);
        }

        while(TestPath[TestPath.length-1] == " "){
            TestPath = TestPath.substr(0,TestPath.length-1);
        }

        TestPath = PathResolution(TestPath);

        if(TestPath == "Error" || TestPath[0] !="old file"){
            return "Redirection Error";
        }
        
        
        var CurrCommand = CommandArray.substr(0,CommandArray.indexOf("<")).split(" ");
        
        CurrCommand[1] = file_hashtable.get(TestPath[1]+" "+TestPath[2]);
       
        while(CurrCommand[0] == ""){
            CurrCommand.splice(0,1);
        }

        while(CurrCommand[CurrCommand.length-1] == " "){
            CurrCommand.splice(CurrCommand.length-1,1);
        }

        
   

      

        //  We put InternalOutput There Because of Piping related reasons(added parameter) --> We no output then return ""
        //  Have internal checks for empty parameters for each command
        switch(CurrCommand[0]){
                /*[X}*/case "mkdir": CurrCommand = mkdir(CurrCommand,InternalOutput); break;
                /*[X}*/case "rmdir": CurrCommand = rmdir(CurrCommand,InternalOutput); break;
                /*[X}*/case "rm": CurrCommand = rm(CurrCommand,InternalOutput); break;
                /*[X}*/case "touch": CurrCommand = touch(CurrCommand,InternalOutput); break;
                /*[X}*/case "clear": CurrCommand = clear(CurrCommand,InternalOutput); break;        
                /*[X}*/case "cat": CurrCommand = cat(CurrCommand,InternalOutput); break;
                /*[X}*/case "ls": CurrCommand = ls(CurrCommand,InternalOutput); break;
                /*[X}*/case "echo": CurrCommand = echo(CurrCommand,InternalOutput); break;
                /*[X}*/case "cd": CurrCommand = cd(CurrCommand,InternalOutput); break;
                /*[X}*/case "cp": CurrCommand = cp(CurrCommand,InternalOutput); break;
                /*[X}*/case "mv": CurrCommand = mv(CurrCommand,InternalOutput); break;
                /*[X}*/case "pwd": CurrCommand = pwd(CurrCommand,InternalOutput); break;
            default : return "UNSUPPORTED COMMAND";break; }

        

        
        return CurrCommand;
        
    }
    
    return "REDIRECTION ERROR - NO INTERNAL COMMAND"
}











//========================================FILE MANIPULATION END=========+=============================================




var fs   = require("fs");
var path = require("path");
var ncp = require('ncp').ncp;
ncp.limit = 16;

var configFile = "example.json";
if (process.argv.length == 3) {
    configFile = process.argv[2];
}
var config = JSON.parse(fs.readFileSync(configFile, "UTF-8"));

config.repatterns = [];
for (var i = 0; i < config.patterns.length; i++) {
    config.repatterns.push(new RegExp(config.patterns[i], "i"));    
}

console.log("------------------------------------------");
console.log("Autosync");
console.log("------------------------------------------");
console.log("Source:      " + config.source);
console.log("Destination: " + config.destination);
console.log("Patterns:    " + config.repatterns);
console.log("------------------------------------------");
// validador origen y destino
ubicationValidator(config.source, config.destination);
if(vainaNueva()){
    console.log("paso validacion");
}
else{
    console.log("No encontró las carpetas en dirección de origen");
    process.exit();
}
//folderValidator(config.source, config.folders);

///////////////////////////////////////////////////////////////////////
// Busca todas las carpetas del arreglo y copia su contenido
// si las carpetas no estan creadas, se crea junto con su contenido en el destino seleccionado
if(config.folders[0] != undefined){
    //fs.readdir(config.destination, function (err, destinationFiles) {
    fs.readdir(config.destination, function (err, destinationFiles) { 
        if (err) throw err;  
        config.folders.forEach(carpeta => {
            if (!fs.existsSync(config.destination+'\\'+carpeta)){
                fs.mkdirSync(config.destination+'\\'+carpeta);
                console.log('Se creó La carpeta');
            }
            ncp(config.source+'\\'+carpeta, config.destination+'\\'+carpeta, function (err) {
                if (err) {
                    return console.error(err);
                }
                console.log('Nube - PC');
            });
            ncp(config.destination+'\\'+carpeta, config.source+'\\'+carpeta, function (err) {
                if (err) {
                    return console.error(err);
                }
                console.log('Pc - Nube');
            });
        })
    })
}
// Si no tiene carpeta seleccionadas, se deben copiar todas las carpetas 
// y archivos de la ubicacion de origen
else{
    ncp(config.source, config.destination, function (err) {
        if (err) {
          return console.error(err);
        }
        console.log('Nube - PC');
      });
    ncp(config.destination, config.source, function (err) {
        if (err) {
            return console.error(err);
        }
        console.log('Pc - Nube');
    });
}
///////////////////////////////////////////////////////////////////////

// valida si la ubicacion de origen y destino se encuentran inicializadas
function ubicationValidator(source, destination){
    if(source == ""){
        console.log('Ubicacion de Origen no identificado');
        process.exit();        
    }
    else if(source == undefined){
        console.log('Ubicacion de Origen no identificado');
        process.exit();        
    }
    else if(destination == ""){
        console.log('Ubicacion de Destino no identificado');
        process.exit();        
    }
    else if(destination == undefined){
        console.log('Ubicacion de Destino no identificado');
        process.exit();        
    }
}

/*
function folderValidator(source, carpeta){
    config.folders.forEach(carpeta => {            
        fs.readdir(source, function (err, sourceFiles) { 
            sourceFiles.forEach((element )=>{
                console.log('element',element);
                console.log('carpeta',carpeta);
                if (element == carpeta){
                    console.log('siiiiiii');
                }
                else{
                    console.log('noooooooooo');
                }
            });
        });
    });
}
*/
function vainaNueva(){
    var files = fs.readdirSync(config.source);
    let flag;
    for (var i in config.folders){
        flag = false;
        for (var j in files){
            if (files[j] == config.folders[i]){
                console.log('siiiiiiii');
                flag = true;
                break;
            }
        }
        if(!flag){
            console.log("nnooooooo");
            break;
        }
    }
    return flag;
}
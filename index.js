const path=require('path'); 
const express= require('express');
const app=express();
const bodyparser=require('body-parser');
var mysql = require('mysql');
const router = express.Router();

//Conecion ala Base de Datos
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "solera",
  port:"3306",
  multipleStatemensts:true
});

//Confuguracion de los Metotos aceptador y origenes desconosidos
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

//Configuracion de Rutas.
router.get('/index',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.use('/', router);

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

//configuracion para que sea accedido desde cualquier dominio.
app.use(allowCrossDomain);

//configuracion del Puerto
app.set('port',process.env.PORT || 3000);

//Levanta el servidor en el puerto 3000
const server=app.listen(app.get('port'),()=>{
	console.log("Server Puerto",app.get('port'));
});

//Endpoint que permite Listar los Puestos que estan Registrados en la Base de Datos
app.get('/servicios', function (req, res) { 
  let sql="SELECT * FROM  puesto";	
  con.query(sql, function (err, result) {
    if (err) throw err;    
    res.send(JSON.stringify(result));
  });
});

//Endpoint que permite filtrar los puestos segun su Tipo(todos,autos,salud,hogar)
app.get('/servicios/:filtro', function(req, res) {
  let filtro=req.params.filtro; 
  let query="";
  if (filtro!="todos"){
  	query+="WHERE TIPO='"+filtro+"'";
  }
  let sql="SELECT * FROM  puesto "+query;	
  con.query(sql, function (err, result) {
    if (err) throw err;    
    res.send(JSON.stringify(result));
  });   
});

//Endpoint que permite Crear un Puesto
app.post('/crear', function (req, res) { 
	let dataUser=req.body;   	
	let sql="INSERT INTO puesto VALUES (default,?,?,?,null,null)";			
		let data_insert=[dataUser.nombre,dataUser.descripcion,dataUser.tipo];
		  con.query(sql,data_insert,
		   function (err, result) {			
			if (err) throw err;    
		    var mensaje={};   			    		    			    					    	
			mensaje['estado']=true;				
			mensaje['mensaje']="Puesto Registrado Correctamente";
	    	res.send(JSON.stringify(mensaje));
	});
});

//Endpoint que permite Editar un Puesto
app.post('/leer', function (req, res) { 
	let dataUser=req.body;   	
	let sql="SELECT *FROM puesto WHERE ID=?";			
		let data_insert=[dataUser.id];
		  con.query(sql,data_insert,
		   function (err, result) {			
			if (err) throw err;    
		    res.send(JSON.stringify(result));
	});
});

//Endpoint que permite Editar un Puesto
app.post('/editar', function (req, res) { 
	let dataUser=req.body;   	
	let sql="UPDATE puesto SET NOMBRE=?,DESCRIPCION=?,TIPO=? WHERE ID=?";			
		let data_insert=[dataUser.nombre,dataUser.descripcion,dataUser.tipo,dataUser.id];
		  con.query(sql,data_insert,
		   function (err, result) {			
			if (err) throw err;    
		    var mensaje={};   			    		    			    					    	
			mensaje['estado']=true;				
			mensaje['mensaje']="Puesto Actualizado Correctamente";
	    	res.send(JSON.stringify(mensaje));
	});
});

//Endpoint que permite eliminar un Puesto
app.post('/eliminar', function (req, res) { 
	let dataUser=req.body;   	
	let sql="DELETE FROM puesto WHERE ID=?";			
		let data_insert=[dataUser.id];
		  con.query(sql,data_insert,
		   function (err, result) {			
			if (err) throw err;    
		    var mensaje={};   			    		    			    					    	
			mensaje['estado']=true;				
			mensaje['mensaje']="Puesto Eliminado Correctamente";
	    	res.send(JSON.stringify(mensaje));
	});
});

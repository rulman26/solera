CREATE SCHEMA `solera` ;
use solera;
create table puesto(
ID int not null primary key not null auto_increment,
NOMBRE varchar(50) not null,
DESCRIPCION varchar(150) not null
)
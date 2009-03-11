Instalar GESTAS
===============
Actualmente GESTAS s�lo se puede instalar desde el c�digo fuente (no
hay paquete para ninguna distribuci�n), con lo que los pasos a seguir
para instalar GESTAS son las siguientes:

1.- Descargar el c�digo fuente: El c�digo fuente del programa est�
disponible en un repositorio alojado en http://opentia.net/GESTAS, por
lo que para descargarlo tendr�s que tener instalado subversion y
ejecutar el siguiente comando:

	 $ svn co https://forja.rediris.es/svn/cusl3-gestas/trunk/software gestas

    Subversion (http://subversion.tigris.org) es un sistema de gesti�n de
versiones que esta disponible en la mayor�a de las distribuciones
GNU/Linux como paquete binario, con lo que resulta sencillo
instalarselo a partir de un gestor de paquetes.

2.- Instalar dependencias: Actualmente GESTAS depende de los
siguientes paquetes Debian: mysql-server-5.0, mysql-client-5.0, apache2,
libapache2-mod-php5, php5, php5-mysql y php-gettext. Estos paquetes
son de uso com�n (aunque pueden tener otro nombre), con lo que la
mayor�a de las distribuciones tienen un paquete binario para su f�cil
instalaci�n.

3.- Crear la base de datos: GESTAS trabaja con una base de datos, con
lo que tendremos que crear una y dar permisos a un usuario para acceder
a dicha base de datos. En MySQL las bases de datos se crean con el
siguiente comando:

	  $ mysqladmin -u <admin> create gestas

    donde <admin> es el administrador del servidor mysql (generalmente
el usuario root) y gestas es el nombre de la base de datos. Para crear
un nuevo usuario y darle permisos sobre la base de datos debemos de
ejecutar las siguientes instrucciones:

     	  $ mysql -u <admin>
	  sql> GRANT ALL PRIVILEGES ON gestas.* TO usuario_gestas IDENTIFIED BY
	  'contrase�a_gestas';
          sql> FLUSH PRIVILEGES;
	  sql> exit

    donde admin, como en el caso anterior, es el administrador del
servidor mysql, usuario_gestas es el usuario que va a administrar la
base de datos de la aplicaci�n y contrase�a_gestas es la contrase�a
que va a utilizar el administrador de la base de datos de la aplicaci�n.

4.- Configuraci�n de par�metros: Antes de cargar las tablas a la base
de datos hay que configurar algunos par�metros b�sicos que utiliza la
aplicaci�n. Para ello hay que crear un fichero, mysql-configs.sql, en
el directorio sql de donde se haya descargado gestas. En ese mismo directorio
ver�s un fichero, mysql-configs.sql.default, con los par�metros que hay que 
configurar, con lo que lo puedes copiar a mysql-configs.sql y configurar los 
par�metros convenientemente. Actualmente el par�metro que debes de modificar es
dir_base, que indica el directorio base donde se encuentra la
aplicaci�n (se representará a partir de ahora como <GESTAS>).

5.- Cargar el esquema: Despues de haber configurado los par�metros que
se van a insertar en la base de datos deber�s cargar el esquema de
tablas y los datos en la base de datos, para lo cual deber�s de
ejecutar las siguientes instrucciones:

     	  $ cd <GESTAS>/sql
          $ mysql -u <admin>
          sql> use gestas;
	  sql> source mysql.sql;
	  sql> exit;

Nota: esta orden borra al completo la base de datos gestas que hubiera
anteriormente.

6.- Configurar la conexi�n a la base de datos: Una vez tenemos cargado
el esquema de la base de datos vamos a crear un peque�o archivo,
const.php, en el que indicaremos los datos de conexi�n a la base de
datos. Para ello vamos al directorio ra�z donde est� el c�digo fuente,
copiamos el fichero const.php.default a const.php y editamos dicho
fichero, indicando todos los datos de conexi�n a la base de datos
(usuario, contrase�a, host, nombre de la base de datos y puerto). Como
base se puede copiar el fichero const.php.default que existe en dicho
directorio.

7.- Dar acceso a la aplicaci�n: Para que la aplicaci�n se vea desde
cualquier ordenador deberemos de configurar el servidor web
Apache. Para eso hay que crear un nuevo fichero en
/etc/apache2/sites-available con los datos del VirtualHost y enlazar
desde /etc/apache2/sites-enabled a este fichero, reiniciando el
servidor una vez este configurado. Si lo que quieres es probar la
aplicaci�n de manera local basta con poner en un directorio o
subdirectorio que este ya configurado con Apache para poder acceder
desde local.

8.- Reiniciar apache con /etc/init.d/apache2 restart

Con estos sencillos pasos tendr�s ya instalada una versi�n de GESTAS,
as� que divi�rtete y �a hackear!

NOTA IMPORTANTE: actualmente existe una limitaci�n por la cual GESTAS
no funciona con la versi�n oldestable de Debian (etch). En Debian
stable (lenny) s� funciona perfectamente. Parece ser un problema con
el php5 de dicha versi�n.

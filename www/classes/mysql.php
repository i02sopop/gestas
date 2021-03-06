<?php
/**
 * mysql.php
 *
 * Description
 * This class implements the access to a MySQL database. It inherit from
 * Database and implements the abstract methods required.
 *
 * copyright (c) 2008-2009 OPENTIA s.l. (http://www.opentia.com)
 *
 * This file is part of GESTAS (http://gestas.opentia.org)
 * 
 * GESTAS is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

require_once("gexception.php");
require_once("gdatabaseexception.php");
require_once("database.php");

class Mysql_db extends Database {
  // Constructor of the class.
  public function __construct($newHost=null, $newPort=-1, $newUser=null, $newPass=null, $newDbName=null) {
    parent::__construct($newHost, $newPort, $newUser, $newPass, $newDbName, 1);
  }

  // This function connect the object to the database
  public function connect() {
    if($this->isConnected === false) {
      if($this->host == null || $this->port <= 0 || $this->user == null || 
	 $this->pass == null || $this->dbname == null)
	throw new GException(GException::$PARAM_MISSING);
      else if(!($this->conn=mysql_pconnect($this->host.":".$this->port,$this->user,
					   $this->pass->pass,MYSQL_CLIENT_SSL &&
					   MYSQL_CLIENT_COMPRESS)))
	throw new GDatabaseException(GDatabaseException::$DB_CONN);
      else if(!mysql_select_db($this->dbname,$this->conn))
	throw new GDatabaseException(GDatabaseException::$DB_SEL);
      
      $this->isConnected = true;
      $this->execute("SET NAMES 'utf8'");
    } else {
      $this->isConnected = false;
      $this->connect();
    }

    return $this->isConnected;
  }

  // This function disconnect the object from the database
  public function disconnect() {
    if($this->isConnected == true) {
      if(!mysql_close($this->conn))
	throw new GDatabaseException(GDatabaseException::$DB_CLOSE);
      $this->isConnected = false;
    }

    return true;
  }

  // This method make a query to the database and gets the data returned to the rows array.
  public function consult($consult=null) {
    if($consult == null)
      throw new GException(GException::$VAR_TYPE);

    $this->connect();
    if(!($this->result=mysql_query($consult,$this->conn)))
      throw new GDatabaseException(GDatabaseException::$DB_CONSULT,$consult);

    // If the result is bool the query return true
    if(is_bool($this->result))
      return $this->result;

    // We store the result in the rows array.
    $this->firstRow();
    $this->rows = null;
    while($this->iter < $this->numRows()) {
      $this->rows[$this->iter] = mysql_fetch_array($this->result);
      $this->nextRow();
    }

    // And rewind the iterator.
    $this->firstRow();

    return true;
  }

  // This method execute a database query without data result
  public function execute($consult=null) {
    if($consult == null)
      throw new GException(GException::$VAR_TYPE);

    if($this->isConnected === false)
      $this->connect();
    if(!mysql_query($consult,$this->conn))
      throw new GDatabaseException(GDatabaseException::$DB_CONSULT,$consult);

    return true;
  }

  // This method returns the number of rows obtained by the last consult to the database
  public function numRows() {
    if($this->result !== null && !is_bool($this->result))
      return mysql_num_rows($this->result);
    return 0;
  }

  // This method returns the result row pointed by the iterator
  public function getRow() {
    if($this->result && !is_bool($this->result) && $this->iter >= 0 && $this->iter < $this->numRows()) {
      $ret = $this->rows[$this->iter];
      $this->nextRow();
      return $ret;
    }
    return false;
  }

  // This static method check if the parameter passed is an object of the type Mysql_db
  public static function is_mysql($db) {
    if(is_object($db) && (get_class($db) == "Mysql_db" || is_subclass_of($db,"Mysql_db")))
      return true;

    return false;
  }

  // This method returns the identification generated by mysql,
  protected function getId(){
    return mysql_insert_id();
  }

  // Destructor of the class
   public function __destruct() {
     parent::__destruct();
   }
}
?>

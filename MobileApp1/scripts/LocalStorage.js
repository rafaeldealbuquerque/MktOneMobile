    
document.addEventListener("deviceready", init, false);
    
var appDB = {};
    
appDB.db = null;
          
appDB.openDb = function() {
	if (window.sqlitePlugin !== undefined) {
		appDB.db = window.sqlitePlugin.openDatabase("MobileMktOne");
	}
	else {
		// For debugin in simulator fallback to native SQL Lite
		console.log("Use built in SQL Lite");
		appDB.db = window.openDatabase("MobileMktOne", "1.0", "MobileAppMktOne", 200000);
	}
}
          
appDB.createTable = function() {
	var db = appDB.db;
	db.transaction(function(tx) {		
        tx.executeSql("CREATE TABLE IF NOT EXISTS Products(ProductId INTEGER PRIMARY KEY ASC, ProductName TEXT, UnitPrice REAL, Discontinued INTEGER, UnitsInStock REAL)", []);
	});
}
          
appDB.addTodo = function(productId, productName, unitPrice, discontinued, unitsInStock) {
	var db = appDB.db;
	db.transaction(function(tx) {		
		tx.executeSql("INSERT INTO Products(ProductId, ProductName, UnitPrice, Discontinued, UnitsInStock) VALUES (?,?,?,?,?)",
					  [productId, productName, unitPrice, discontinued, unitsInStock], 
					  appDB.onSuccess,
					  appDB.onError);
	});
}
  
appDB.updateTodo = function(productId, productName, unitPrice, discontinued, unitsInStock) {
	var db = appDB.db;
	db.transaction(function(tx) {		
		tx.executeSql("UPDATE Products set ProductId = ?, ProductName = ?, UnitPrice = ?, UnitsInStock = ?",
					  [productId, productName, unitPrice,  unitsInStock], 
					  appDB.onSuccess,
					  appDB.onError);
	});
}
        
appDB.onError = function(tx, e) {
	console.log("Error: " + e.message);
} 
          
appDB.onSuccess = function(tx, r) {
	console.log("Sucesso");
}
          
appDB.deleteTodo = function(productId) {
	var db = appDB.db;
	db.transaction(function(tx) {
		tx.executeSql("DELETE FROM Products WHERE ID=?", [productId],
					  appDB.onSuccess,
					  appDB.onError);
	});
}
    
appDB.selectProduct = function() {
	var db = appDB.db;
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM Products", [], 
					  onSuccess, 
					  appDB.onError);
	});
}
          
function init() {
	appDB.openDb();
	appDB.createTable();
}
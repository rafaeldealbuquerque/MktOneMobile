//Based on http://www.html5rocks.com/en/tutorials/webdatabase/todo/

document.addEventListener("deviceready", init, false);

var app = {};

app.db = null;
      
app.openDb = function() {
	if (window.sqlitePlugin !== undefined) {
		app.db = window.sqlitePlugin.openDatabase("MobileMktOne");
	}
	else {
		// For debugin in simulator fallback to native SQL Lite
		console.log("Use built in SQL Lite");
		app.db = window.openDatabase("MobileMktOne", "1.0", "MobileAppMktOne", 200000);
	}
}
      
app.createTable = function() {
	var db = app.db;
	db.transaction(function(tx) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS Products(ProductId INTEGER PRIMARY KEY ASC, ProductName TEXT, UnitPrice REAL, Discontinued INTEGER, UnitsInStock REAL)", []);
	});
}
      
app.addTodo = function(productId, productName, unitPrice, discontinued, unitsInStock) {
	var db = app.db;
	db.transaction(function(tx) {		
		tx.executeSql("INSERT INTO Products(ProductId, ProductName, UnitPrice, Discontinued, UnitsInStock) VALUES (?,?,?,?,?)",
					  [productId, productName, unitPrice, discontinued, unitsInStock],
					  app.onSuccess,
					  app.onError);
	});
}
      
app.onError = function(tx, e) {
	console.log("Error: " + e.message);
} 
      
app.onSuccess = function(tx, r) {
	app.refresh();
}
      
app.deleteTodo = function(productId) {
	var db = app.db;
	db.transaction(function(tx) {
		tx.executeSql("DELETE FROM Products WHERE ID=?", [productId],
					  app.onSuccess,
					  app.onError);
	});
}

app.selectProduct = function() {
	var db = app.db;
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM Products", [], 
					  render, 
					  app.onError);
	});
}
      
function init() {
	app.openDb();
	app.createTable();
}
      
function addTodo() {
	var products = document.getElementById("todo");
	app.addTodo(products.value);
	products.value = "";
}

function getProducts() {
    app.selectProduct();
}
//Based on http://www.html5rocks.com/en/tutorials/webdatabase/todo/

document.addEventListener("deviceready", init, false);

var app = {};
app.db = null;
      
app.openDb = function() {
    if(window.sqlitePlugin !== undefined) {
        app.db = window.sqlitePlugin.openDatabase("MobileMktOne");
    } else {
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

app.refresh = function() {
	var renderTodo = function (row) {
		return "<li>" + "<div class='todo-check'></div>" + row.todo + "<a class='button delete' href='javascript:void(0);'  onclick='app.deleteTodo(" + row.ProductId + ");'><p class='todo-delete'></p></a>" + "<div class='clear'></div>" + "</li>";
	}
    
	var render = function (tx, rs) {
		var rowOutput = "";
		var todoItems = document.getElementById("todoItems");
		for (var i = 0; i < rs.rows.length; i++) {
			rowOutput += renderTodo(rs.rows.item(i));
		}
      
		todoItems.innerHTML = rowOutput;
	}
    
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
	app.refresh();
}
      
function addTodo() {
	var products = document.getElementById("Products");
	products.addTodo(products.value);
	products.value = "";
}
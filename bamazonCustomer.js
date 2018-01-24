var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database : 'bamazon'
});

connection.connect(function(err) {
	if (err) throw err;
	shop();
})

function shop(){

	console.log("\n==========================");
	console.log("Welcome to Bamazon:");
	console.log("==========================\n");

	connection.query("SELECT * FROM products", function(err, res){
		if(err) throw err;

		console.log("Items for sale today:\n");
		for (item in res){
			console.log(res[item].item_id + " | " + res[item].product_name + " | " + res[item].price);
		}

		inquirer
			.prompt([
				{
					type: "input",
					message: "Please enter the ID# of the product you would like to buy.",
					name: "id"
				},
				{
					type: "input",
					message: "How many would you like to buy?",
					name: "quantity"
				}
			]).then(function(answers){
				var choice = parseInt(answers.id) - 1;

				if (res[choice].stock_quantity < answers.quantity) {
					console.log("We're sorry, but there is not enough of this product in stock!");
				} else {
					var totalCost = answers.quantity * res[choice].price;
					var newQuantity = res[choice].stock_quantity - answers.quantity;
					console.log(answers.quantity + "x " + res[choice].product_name + " purchased! (" + newQuantity + " left!)");
					console.log("Your total: $" + totalCost);		
					connection.query("UPDATE products SET ? WHERE ?", 
						[{stock_quantity: newQuantity},{item_id: answers.id}]
					);
				};

				connection.end();
			})
		
		

	})
}
var express = require('express');
var bodyParser = require('body-parser');
var mongoClient = require('mongodb').MongoClient;
var CronJob = require('cron').CronJob;

module.exports = function(){	

	global.app = express();
	global.app.use('/',express.static(__dirname + '/public'));
	global.app.use(bodyParser.urlencoded({extended:true}));
	global.app.use(bodyParser.json());
	require('./config/cors.js')(); //cors

	function connectMongoDB(){
		mongoClient.connect(global.keys.mongodb,function (err, db) {
	        if (err) {
	            console.log("Error connecting to MongoDB");
	            console.log(err);
	        } else {            
	            console.log("Database connected successfully");
	            global.mongoClient = db;

	            //allowing services to run after connecting to mongoDB
	            attachServices();
   				attachAPI();   				   			
	        }
	    });
	}

	//Routes
	function attachAPI(){
	    try{
	       require('./api/analytics')();
	       require('./api/userAnalytics')();
	       require('./api/server')();
	       require('./api/payments')();
	       require('./api/appPlans')();	              
	    }catch(e){
	       console.log(e);
	    }
	}

	//Services
	function attachServices(){
		try{
	       global.analyticsService = require('./service/analyticsService.js');	      
	       global.userApiAnalyticsService = require('./service/userApiAnalyticsService.js');
	       global.userMonthlyApiService = require('./service/userMonthlyApiService.js');
	       global.userStorageAnalyticsService = require('./service/userStorageAnalyticsService.js');

	       global.serverService = require('./service/serverService.js');
	       global.paymentsService = require('./service/paymentsService.js');
	       global.twoCheckoutService = require('./service/twoCheckoutService.js');
	       global.salesService = require('./service/salesService.js');
	       global.appPlansService = require('./service/appPlansService.js');
	       global.notificationService = require('./service/notificationService.js');
	    }catch(e){
	       console.log(e);
	    }	    
	}

	connectMongoDB();    
    
 	return app;
};

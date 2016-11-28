var mysql = require("mysql");

var pool = mysql.createPool({host:"192.168.50.202",
	connectionLimit:50,
	user:"root",
	password:"bugentuan",
	port:"3306",
	database:"Ticket"
});

/**
 * 当一个连接被创建时发生
 *
 */
pool.on("connection",function(connection){
	//配置该连接可以执行格式化的sql语句
	
	connection.config.queryFormat = function (query, values) {
		if (!values) return query;
		return query.replace(/\:(\w+)/g, function (txt, key) {
			if (values.hasOwnProperty(key)) {
				return this.escape(values[key]);
			}
			return txt;
		}.bind(this));
	};
	connection.query('SET SESSION auto_increment_increment=1'); 
});

var db ={
	query:function(sql,values,callback){

		/**
		 * 执行查询操作
		 */
		pool.getConnection(function(err,conn){

			if (err) console.log("POOL ==> " + err);

			conn.query(sql,values,function(err,rows){
				if (err) {
					console.log("QUERY  ==> " + err);
				}
				else {
					callback(err,rows);
				}
				conn.release();
			});
		});
	},

	end:function(callback){
		pool.end(callback);
	}
	/*
	//按格式化的方式执行sql语句,适合参数比较多的操作
	queryFormat:function(sql,values,callback){
		pool.getConnection(function(err,conn){	

			if(err) console.log("POOL ==> " + err);

			conn.query(sql,values);
		},
		*/
}

module.exports= db;

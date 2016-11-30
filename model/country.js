var db = require("../mysql");

module.exports = function(country){
	var model = {};

	var sqlInsert = "insert into Countries (COUNTRY,CODE) select :COUNTRY,:CODE from dual where not exists (select 1  from Countries where CODE = :CODE)";

	var selectByID   = "select ID,COUNTRY,CODE,STATUS from Countries where ID= :ID";
	var selectByCode = "select ID,COUNTRY,CODE,STATUS from Countries where CODE = :CODE";


	/**
	 * 插入城市数据到数据库
	 *
	 */
	model.save = function(callback){
		if(country) {
			db.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;",null,null);
			db.query(sqlInsert,country,function(err,res){
				if(err)
					console.log(err);
				else
				{
					country.ID = res.insertId;
					console.log(res);
					console.log(country);
					callback(null,[country]);
				}
			});
		}
		else{
			throw "no data!"
		}
	};

	model.findByCode = function(code,callback){
		var _model = this;
		if(code){
			db.query(selectByCode,{"CODE":code},function(err,res){

				if(err)
					console.log(err);
				else if(res.length === 1)
					callback(err,res);
				else if(res.length === 0 && country)
					_model.save(callback)
				else 
					callback("no record");
			});
		}
		else if(country.CODE)
		{
			db.query(selectByCode,{"CODE":country.CODE},callback);	
		}
		else
			throw "no para";
	};

	return model; 
}

var db = require("../mysql");

module.exports = function(airport){
	var model = {};

	var sqlInsert = "insert into Airports (CODE,NAME,EN_NAME,REGION_ID,LAT,LON) select :CODE,:NAME,:EN_NAME,:REGION_ID,:LAT,:LON from dual where not exists (select 1 from Airports where CODE = :CODE)";

	var sqlSelect = "select CODE,NAME,EN_NAME,REGION_ID,LAT,LON from Airports where ID=:ID";


	/**
	 * 插入城市数据到数据库
	 *
	 */
	model.save = function(callback){
		if(airport)
			db.query(sqlInsert,airport,callback);
		else
			throw "no data!";
	};

	return model; 
}

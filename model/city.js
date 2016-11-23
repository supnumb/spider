var db = require("../mysql");

module.exports = function(cityData){
	var model = {};

	var sqlInsert = "insert into Cities (TWO_CODE,THREE_CODE,NAME,EN_NAME,COUNTRY_ID) select :TWO_CODE,:THREE_CODE,:NAME,:EN_NAME,:COUNTRY_ID from dual where not exists (select 1  from  Cities where TWO_CODE = :TWO_CODE)";

	var sqlSelect = "select TWO_CODE,THREE_CODE,NAME,EN_NAME,COUNTRY_ID from Cities where ID=:ID";


	/**
	 * 插入城市数据到数据库
	 *
	 */
	model.save = function(callback){
		if(cityData)
		db.query(sqlInsert,cityData,callback);
		else
			throw "no data!";
	};

	return model; 
}

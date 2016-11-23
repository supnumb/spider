/**
 * 抓取和更新抓取世界主要机场城市的信息；
 * 实现逻辑：根据页面规则生成数据页面的
 * 第一步：
 */ 
var http = require('http');
var cheerio = require("cheerio");
var countryModel = require("./model/country");
var airportModel = require("./model/airport");

/**
 * 异步下载指定的网页
 *
 * @param url 要下载的网页地址
 * @param callback 处理网页数据的回调
 */
function download(url,callback){

	http.get(url,function(res){
		var data = "";

		res.on('data',function(chunk){
			data+=chunk;
		});
		res.on('end',function(){
			callback(data);
		});
	}).on('error',function(){
		callback(null);
	});
}

//var url = "http://www.likecha.com/tools/airport.html";
//var url = "http://www.likecha.com/tools/airport.html?a=1&b=&c="

function patch_download(a) {

	var url = "http://www.likecha.com/tools/airport.html?a="+a+"&b=&c=";

	download(url,function(data){

		if(data){
			$ = cheerio.load(data);

			$("div.seelist tr").each(function(i,ele){
				if(i===0) return true;
				console.log(a+"=="+i+"===="+$(this).find("td").eq(4).text());

				var country ={
					"CODE":$(this).find("td").eq(3).text(),
					"COUNTRY":$(this).find("td").eq(4).text()
				};

				var airport = {
					"CODE":$(this).find("td").eq(0).text(),
					"NAME":$(this).find("td").eq(2).text(),
					"EN_NAME":$(this).find("td").eq(1).text(),
					"LAT":$(this).find("td").eq(6).text(),
					"LON":$(this).find("td").eq(7).text()
				};

				//查到国家的ID并绑定到机场信息
				countryModel(country).findByCode(country.CODE,function(err,row){

					if(err)
						console.log(err);
					else
					{
						console.log(row)
						airport.REGION_ID = row[0].ID;
						airportModel(airport).save(function(err,res){
							if(err)
								console.log(err);
							else {
								//console.log(res);
							}
						});
					}
				});

			});
		}
		else
			console.log("error");
	});
}

//patch_download(3);

for(var i=40;i<50;i++) {
	patch_download(i);
}	

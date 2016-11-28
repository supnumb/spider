/**
 * 抓取和更新抓取世界主要机场城市的信息；
 * 实现逻辑：根据页面规则生成数据页面的URL地址数组；
 * 第一步：
 * 第二步：
 * 第三步：
 * 第四步：
 */ 
var http = require('http');
var cheerio = require("cheerio");
var countryModel = require("./model/country");
var airportModel = require("./model/airport");
var request = require('superagent');
var eventproxy = require('eventproxy');
var async = require('async');

var ep = new eventproxy();

/**
 * 异步下载指定的网页
 *
 * @param url 要下载的网页地址
 * @param callback 处理网页数据的回调
 */
function download(url,callback){
	request.get(url).end(function(err,res){
		if(err){
			console.log("========================");
			console.log(err);
		}else
			callback(res.text);	
	});
}

//var url = "http://www.likecha.com/tools/airport.html";
//var url = "http://www.likecha.com/tools/airport.html?a=1&b=&c="

{{{ //分批下载数据
	function patch_download(url,callback) {
		console.log("URL:\t"+url);

		download(url,function(data){
			if(data){
				$ = cheerio.load(data);

				var len=$("div.seelist tr").length;

				console.log("airport num:"+len);

				if(len == 0){
					console.log(data);
					return;
				}
				
				ep.after("airport_save",len,function(err,res){

					setTimeout(function(){
						callback(null,len);
					},Math.random()*2000);
				});

				$("div.seelist tr").each(function(i,ele){
					if(i===0) 
					{
						ep.emit("airport_save",1);
						return true;
					}

					{{{
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
					}}}
					//查到国家的ID并绑定到机场信息
					countryModel(country).findByCode(country.CODE,function(err,row){
						if(err)
							console.log(err);
						else
						{
							airport.REGION_ID = row[0].ID;
							airportModel(airport).save(function(err,res){
								if(err)
									console.log(err);
								else {
									//console.log(res);
								}
							});
						}
						//console.log("save completed:"+airport.EN_NAME);
						ep.emit("airport_save",1);
					});
				});
			}
			else
				console.log("error");
		});
	}
}}}

var URLs = [];     //抓取网址

for(var i=1;i<173;i++) {
	var url = "http://www.likecha.com/tools/airport.html?a=" + i + "&b=&c=";
	URLs.push(url);
}	

async.mapSeries(URLs,patch_download,function(err,res){
	console.log(res);
});

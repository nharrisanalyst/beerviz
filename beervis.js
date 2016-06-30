var margin={top:20, bottom:30, left:40, right:20};

var width = 800 - margin.left-margin.right;

var height = 550 -margin.top- margin.bottom;
// 
var svg = d3.select("#chart")
			.append('svg')
			.attr("width", (width + margin.left +margin.right))
			.attr("height", (height + margin.top + margin.bottom))
// 			
// 			
var chart = svg.append("g")
			.attr("class", "chartWrapper")
			.attr("transform","translate("+margin.left+","+margin.top+")");


// 			
// 
// 			
// 			
var beerData;
var unique;
var check;

d3.csv("DATA/beerData.csv",function(error,data){
if(error){
	alert("we had an error in data");
}
  beerData=data;
  

//axis and scales

var dotOpacity = 0.7;

var xScale = d3.scale.linear()
				.domain([0,d3.max(beerData, function(d){
					return parseFloat(d.ABV)})])
				.range([0,width])
				.nice()

var xAxis = d3.svg.axis()
					.scale(xScale)
					.orient("bottom");
					
chart.append("g")
	.attr("class","axis")
	.attr("transform","translate(0,"+height+")")
	.call(xAxis)
 

var yScale = d3.scale.linear()
		.domain([0,d3.max(beerData, function(d){return parseInt(d.IBUs)})])
		.range([height,0])
		.nice()
		
var yAxis = d3.svg.axis()
					.scale(yScale)
					.orient("left")
					
					
var rScale= d3.scale.sqrt()
					.domain(d3.extent(beerData, function(d){ return parseFloat(d.SIZE)}))
					.range([1,18])				
					.nice()
var beerColors = d3.scale.ordinal()
					.domain(["Other Ale","Lager","Stout/Porter","Red Ale","American IPA","Fruit", "Pilsner","Sour","American Pale Ale (APA)","Rye","English Bitter","Oktoberfest","Wheat"])
					.range(["#FFE600","#F2DA91","#3f3f3f","#CD0000","#FF7F00","#F2473F","#CECC15","#C8F526","#734A12","#FFCC99","#0080ff","#DC8909","#EEE9E9"]) 					
					
					
chart.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + 0 + "," + 0 + ")")
		.call(yAxis);


var voronoi= d3.geom.voronoi()
				.x(function(d){return xScale(parseFloat(d.ABV));})
				.y(function(d){ return yScale(parseInt(d.IBUs));})
				
//mouseover effects
var showToolTip= function(d){
		$(this).popover({
			placement:"auto top",
			container: "#chart",
			trigger:"manual",
			html: true,
			content: function(){ return "Beer: "+d.BEER+"<br>Brewery: " + d.BREWERY+"</br> Location: "+
									d.LOCATION+ "<br> Sub Style: " +d.SUBSTYLE + "</br>"	}
		});
		$(this).popover('show');
		var element = d3.selectAll("."+d.Unique)
		element.style("opacity",1);
		//vertical line
		chart.append("g")
			.attr("class","lineHelper")
			.append("line")
			.attr({
					"x1": element.attr("cx"),
					"x2": element.attr("cx"),
					"y1": element.attr("cy"),
					"y2": height,
					stroke: element.style("fill")
			});
		
//horizontal line

chart.append("g")
			.attr("class","lineHelper")
			.append("line")
			.attr({
					"x1": 0,
					"x2": element.attr("cx"),
					"y1": element.attr("cy"),
					"y2": element.attr("cy"),
					stroke: element.style("fill")
			});		
		
};

var removeToolTip = function(d){
			$('.popover').each(function() {
		 		$(this).remove()})
		 	var element = d3.selectAll("."+d.Unique)
		element.style("opacity",.4);
//remove mouseover lines		
		var line = d3.selectAll(".lineHelper");	
		
		line
		.transition()
		.duration(100)
		.style("opacity",0)
		.remove();
		 		


};
//Creating Buubles
chart.selectAll("circle")
		.data(beerData)
		.enter()
		.append("circle")
		.style("opacity", 0.4)
		.attr({
			"cx": function(d){ return xScale(parseFloat(d.ABV))},
			"cy": function(d){ return yScale(parseInt(d.IBUs))},
			"fill": function(d){return beerColors(d.STYLE)},
			"r": function(d){ return rScale(parseFloat(d.SIZE))},
			"class":function(d){ return "beers "+ d.Unique}
			
		})
		.on("mouseover",showToolTip)
		.on("mouseout",removeToolTip);
// var voronoiG= chart.append("g")
// 					.attr("class","voronoiG");
// 
// voronoiG.selectAll("path")
// 	.data(voronoi(beerData))
// 	.enter().append("path")
// 	.attr("d", function(d, i) { return "M" + d.join("L") + "Z"; })
	
//placing a veroni

		

//creating labels

//x axis label

chart.append("g")
	.append("text")
	.attr("class","text")
	.attr("text-anchor","end")
	.attr("font-size","12px")
	.attr("transform","translate("+width+","+(height-10)+")")
	.text("Alcohol By Volume")
	
//y axis label

chart.append("g")
		.append("text")
		.attr("class","text")
		.attr("text-anchor","end")
		.attr("font-size","12px")
		.attr("transform","translate(18,0) rotate(-90)")
		.text("International Bittering Units")
		

//tooltips


//Legend

var legMargin={left: 5, top: 10, right: 5, bottom:10};

var legWidth= 155-legMargin.left-legMargin.right

var legHeight= 370-legMargin.top-legMargin.bottom

var legSvg = d3.select("#legend")
				.append("svg")
				.attr("width", legWidth+legMargin.left+legMargin.right)
				.attr("height",legHeight+legMargin.top-+legMargin.bottom)
				
var legendWrapper = legSvg.append("g")
					.attr("class","legendWrapper")
					.attr("width",legWidth)
					.attr("height",legHeight)
					.attr("transform","translate(" +legMargin.left+","+legMargin.top+")")

var rectSize= 15;
var rowHeight= 20;
var rowMaxWidth = 154;


//bubble size code

var bubbleWrapper = legSvg.append("g")
							.attr("class", "bubbleWrapper")
							.attr("width", rowMaxWidth)
							.attr("height",90)
							.attr("transform","translate(50,"+320+")")
							
bubbleWrapper.append("circle")
				.attr("r", rScale(24))
				.style("stroke-dasharray","4,5,4,5")
				.style("fill","none")
				.style("stroke","black")
				.style("opacity",0.4);
				
bubbleWrapper.append("circle")
				.attr("r", rScale(16))
				.attr("cy",rScale(24)-rScale(16))
				.style("stroke-dasharray","4,5,4,5")
				.style("fill","none")
				.style("stroke","black")
				.style("opacity",0.4);
				
bubbleWrapper.append("circle")
				.attr("r", rScale(12))
				.attr("cy",rScale(24)-rScale(12))
				.style("stroke-dasharray","4,5,4,5")
				.style("fill","none")
				.style("stroke","black")
				.style("opacity",0.4);
				
				
bubbleWrapper.append("line")
				.attr({
				"class":"legendLine",
				"x1":0,
				"x2":30,
				"y1":-rScale(24),
				"y2":-rScale(24)  })
				.style("stroke","black")				
				.style("opacity",0.4)
				.style("stroke-width",.5)
				
bubbleWrapper.append("line")
				.attr({
				"class":"legendLine",
				"x1":0,
				"x2":30,
				"y1":rScale(24)-(rScale(16)+rScale(16)),
				"y2":rScale(24)-(rScale(16)+rScale(16)) })
				.style("stroke","black")				
				.style("opacity",0.4)
				.style("stroke-width",.5)				
				
bubbleWrapper.append("line")
				.attr({
				"class":"legendLine",
				"x1":0,
				"x2":30,
				"y1":rScale(24)-(rScale(12)+rScale(12)),
				"y2":rScale(24)-(rScale(12)+rScale(12)) })
				.style("stroke","black")				
				.style("opacity",0.4)
				.style("stroke-width",.5)
				
				
bubbleWrapper.append("text")
			  .attr({
			  "class":"legendText",
			  "x":31,
			  "y":-rScale(24)+2,
			    })
			    .text("24oz.")
			    .style({
			    	"font-family":"Sans-Serif",
			    	"font-size":"10px",
			    	"opacity":0.4
			    	
			    });
			    
bubbleWrapper.append("text")
			  .attr({
			  "class":"legendText",
			  "x":31,
			  "y":rScale(24)-(rScale(16)+rScale(16))+2,
			    })
			    .text("16oz.")
			    .style({
			    	"font-family":"Sans-Serif",
			    	"font-size":"10px",
			    	"opacity":0.4
			    	
			    });

bubbleWrapper.append("text")
			  .attr({
			  "class":"legendText",
			  "x":31,
			  "y":rScale(24)-(rScale(12)+rScale(12))+2,
			    })
			    .text("12oz.")
			    .style({
			    	"font-family":"Sans-Serif",
			    	"font-size":"10px",
			    	"opacity":0.4
			    	
			    });



bubbleWrapper.append("text")
			  .attr({
			  "class":"legendText",
			  "x":-10,
			  "y":-28,
			    })
			    .text("Beer Size")
			    .style({
			    	"font-family":"Sans-Serif",
			    	"font-size":"10px",
			    	
			    	});





//legend basics				
var legend =legendWrapper.selectAll('.legendrect')
		.data(beerColors.range())
		.enter()
		.append('g')
		.attr("class","legendrect")
		.attr("transform", function(d,i){
		return  "translate(0,"+ i*rowHeight+")"
		})
		.style("cursor", "pointer")		
		.on("mouseover",legendOver(0.002))
		.on("mouseout",legendOver(0.4))
		.on("click",legendClick);
		
		
		
		
legend.append("rect")
		.attr("width", rowMaxWidth)
		.attr("height",rowHeight)
		.style("fill","white")



				
legend.append("rect")
		.attr("height",rectSize)
		.attr("width",rectSize)
		.style("fill",function(d){
			return d;
		});

legend.append("text")
		.attr("transform","translate(22,"+(rowHeight/2)+")")
		.attr("class","legendText")
		.style("font-size","10px")
		.text(function(d,i){
			return "-" + beerColors.domain()[i];
		});
		
//legend mouseover mouseout and click function

function legendOver(opac){
		
		return function(d,i){
		
		
		var selected = beerColors.domain()[i];
		
		chart.selectAll(".beers")
			.filter(function(d){ return d.STYLE != selected;})
			.transition()
			.style("opacity",opac)
		
		
		};
		
		
		
		
	}



 function legendClick(d,i){
 	
 	event.stopPropagation();
 	
 	d3.selectAll(".legendrect")
		.on("mouseover",null)
		.on("mouseout",null);
 
 	var selected = beerColors.domain()[i];
 		
 		chart.selectAll(".beers")
 			.style("opacity",0.4)
 			.style("visibility",function(d){  if(d.STYLE != selected) return "hidden"
 							else return "visible";})
 			
 			chart.selectAll(".beers")
 				.on("mouseover",function(d){  if(d.STYLE != selected) return null
 							else return showToolTip.call(this,d,i);})							
 			
 			
 			chart.selectAll(".beers")
 				.on("mouseout",function(d){  if(d.STYLE != selected) return null
 							else return removeToolTip.call(this,d,i);})
 			
};

function removeClick(){

	d3.selectAll(".legendrect")
		.on("mouseover",legendOver(0.002))
		.on("mouseout",legendOver(0.4));
		
		
		chart.selectAll(".beers")
			.style("opacity", 0.4)
			.style("visibility","visible")
			.on("mouseover",showToolTip)
			.on("mouseout",removeToolTip)

} 	
 
 d3.select("body").on("click",removeClick);
	


unique=[];
 check={};

for(var i =0; i<beerData.length; i++){
	if(check[beerData[i].SIZE]==undefined){
		unique.push(beerData[i].SIZE);
		check[beerData[i].STYLE]=beerData[i].SIZE;
	}	

}


console.log(unique)








});




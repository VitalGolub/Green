
var url = "http://feeds.feedburner.com/MyMint"; 
var xhr = createCORSRequest("GET","https://api.rss2json.com/v1/api.json?rss_url="+url);


function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
   
    return xhr;
    
}


window.onload = function() {
    
    var usdMoney = this.document.getElementById('CAD/USD');
    var eurMoney = this.document.getElementById('CAD/EUR');
    var gbpMoney = this.document.getElementById('CAD/GBP');
    var jpyMoney  =  this.document.getElementById('CAD/JPY');

    var cardTitles = this.document.getElementsByTagName('h5');
    var cardDescriptions = this.document.getElementsByClassName('card-text');
    var cardButtons = this.document.getElementsByClassName('btn');
    //var cardImages = this.document.getElementsByClassName('card-img-top');

    console.log(cardDescriptions);
    
   
    
    $.ajax({
        method: 'GET',
        url: "https://api.exchangeratesapi.io/latest?base=CAD&symbols=CAD,USD,EUR,GBP,JPY", 
        dataType: 'json',
        async: false,
        success: function (data) {
            usdMoney.innerText = "CAD/USD = " + data.rates.USD;
            eurMoney.innerText = "CAD/EUR = "  + data.rates.EUR;
            gbpMoney.innerText = "CAD/GBP = "  + data.rates.GBP;
            jpyMoney.innerText = "CAD/JPY = "  + data.rates.JPY;
         }

        });


 var articleData;
 var descriptionParser;

if (!xhr) {
  throw new Error('CORS not supported');
} else {
    xhr.send();
}
xhr.onreadystatechange = function() {
    if (xhr.readyState==4 && xhr.status==200) {
        var responseText = xhr.responseText;
        var result = JSON.parse(responseText);
        

        
        articleData = result;
        console.log(articleData);
        for (var i = 0; i < 6; i++){
            cardTitles[i].innerText = articleData.items[i].title;
            if (articleData.items[i].description.length > 200){
                descriptionParser = "";
                for (var g = 0; g < 140; g++){
                   if ((articleData.items[i].description[g] != '<') && (articleData.items[i].description[g] != 'p') && (articleData.items[i].description[g] != '>') ){
                        descriptionParser += articleData.items[i].description[g];
                   }
                }

            }
            cardDescriptions[i].innerText = descriptionParser + "...";
            cardButtons[i].setAttribute('href', articleData.items[i].link);
           // cardImages[i].src = articleData.items[i].thumbnail;
        }
        
        
    }
}




  
    


       

  
  
}


(function() {
    'use strict'

var server = 'google.com';
    var key = ' AIzaSyB5bcUS0P73OIWbn00nKsfxHeramslZ4Rs';
    var ts = 1710680601;

  //var poll = function() {
  $('.search__button').click(function () {
     $.ajax({
     	  url: 'https://'+server+'?act=a_check&key='+key+'&ts='+ts+'&wait=25&mode=8&access', // url запроса
          dataType : 'json', // тип данных ответа
          error : function(){ console.log('ajax error'); }, // callback ошибки
          success : function(json) { // callback успеха
        // еще запрос
        $.ajax({
            url : json.url,
            dataType : 'text',
            error : function(){ console.log('ajax error'); },
            success : function(text) {
                console.log(text);
        }});
     }
	})
  
  //success: function() {alert("успех"); }
  })
  
   //setInterval(function() {
     //   poll();
   //}, 2000);
   
   
   
   
   
   
$('.search__button').on('click', update);

var ajaxModule = function(){};
	ajaxModule.prototype = {
  		iterator: 1,
  		masonryTimeoutClear: "",

		init: function(request, callback) {
			var self = this;

			self.iterator++;

			request = encodeURIComponent(request.split());
			this.callAjax(request, callback);

			$(".result").html("").show();
		},
		callAjax: function(request, callback) {
			var self = this;

			var ajaxRequest = $.ajax({
		  		url: 'https://'+server+'?act=a_check&key='+key+'&ts='+ts+'&wait=25&mode=8&access'+ request+ "&image_type=photo", // url запроса  
		  		success: function(response) {
					self.parseResponse(response);
		  		},
		  		error: function(response) {
					console.log(response);
		  		}
			})

			ajaxRequest.then(function() {
		  		if(callback) {
					callback();
				}
			})
		},
   parseResponse: function(response) {
			var self = this;

			$.each(response.hits, function(index, value) {
				$(".search-result").prepend("<div class='image image" + index + "' style='width:" + value.webformatWidth + "px; height:" + value.webformatHeight + "px; background: url(" + value.webformatURL + ");'><a href='" + value.pageURL + "' target='_blank'><div class='overlay'></div></a><div class='hidden'></div></div>");
			});
			if (response.hits == 0) {
				$(".search-result").prepend("<div class='error'>Sorrow, no result :(</div>");
			}

			clearTimeout(self.masonryTimeoutClear);
		},
	}
// ----------------------------------------------------------- Метод умного поиска
	var timeoutClear;
	$("._sw").keyup(function() { // при вводе данных в поисковую строку автоматически выводим результаты поиска
		var keyword = $(this).val().toLowerCase();

		clearTimeout(timeoutClear);
		timeoutClear = setTimeout(function() {

			if(keyword || !keyword === "undefined") {
				newModule.init(keyword);
			}
		},500);
	});




  /*function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
})()*/
});

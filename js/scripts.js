$(document).ready(function(){

    'use strict'
	

     $.ajax({
  url: 'google.com.ua',
  dataType: 'jsonp',
  jsonp: 'jsoncallback',
  data: {
    tags: 'mount rainier',
    tagmode: 'any',
    format: 'json'
  }
}).done(function (data) {
  console.log(data);
});

	// Создать переменную для объекта поиска
var webSearch;    

// Задать имя сайта
var siteName = 'www.site.test';

// Подключить Google AJAX Search API
google.load('search', '1', {'nooldnames': true, 'language': 'ru-RU', 'nocss': true});

// Зарегистрировать обработчик события полной загрузки страницы с библиотеками Google API
google.setOnLoadCallback(onPageLoad);
//любые действия с API поиска можно производить только после полной загрузки API и страницы, 
//поэтому нужно зарегистрировать обработчик соответствующего события.
function onPageLoad() {
    // Создать объект web-поиска
    webSearch = new google.search.WebSearch();
    
    // Ограничить область поиска заданным сайтом
    webSearch.setSiteRestriction(siteName);
    
    // Задать расширенный размер результатов
    webSearch.setResultSetSize(google.search.Search.LARGE_RESULTSET);                    
    
    // Запретить автоматическую генерацию HTML-кода для результатов
    webSearch.setNoHtmlGeneration();
    
    // Зарегистрировать обработчик события завершения поиска
    webSearch.setSearchCompleteCallback(this, onWebSearchComplete);            
    // Создаем элемент управления для запуска поиска Google
      var searchControl = new GSearchControl();

      // Определяем, что появляется в результатах поиска               
      var localSearch = new GlocalSearch();                                     
      searchControl.addSearcher(localSearch);                                   
      searchControl.addSearcher(new GwebSearch());                              
      searchControl.addSearcher(new GvideoSearch());                            
      searchControl.addSearcher(new GblogSearch());                             

      // Указываем ваше местоположение, 
      //чтобы установить исходную точку поиска                      
      localSearch.setCenterPoint("Dallas, TX"); 

      // "Рисуем" HTML-форму для элемента
      searchControl.draw(document.getElementById("search-form"));
    // Зарегистрировать обработчик события нажатия на кнопку поиска и выполнить его
    $('.search-form :submit, .search-form :image')
        .click(function() { 
            if ($('.search-form :text').val() != '') {
                onWebSearchStarting();
                webSearch.execute($('.search-form :text').val());
            }
            return false;
        })
        .click(); 
}
//Кроме того, на некоторых сайтах форма поиска создается на каждой 
//странице и после нажатия кнопки выполняет перенаправление на страницу поиска.
// Поэтому я имитирую нажатие на кнопку поиска сразу после загрузки страницы. 
//Если текстовое поле формы поиска будет при этом пустым, никаких действий выполняться не будет.
function onWebSearchComplete() {    
    // Скрыть блок с информацией о процессе поиска
    $('.search-loading').hide();        
        
    if (webSearch.results.length > 0) {    // Если поиск вернул результаты, отобразить их
        // Поместить текст запроса в соответствующий элемент 
        $('.search-result .query').text($('.search-form :text').val());
        
        // Отобразить результаты поиска в заданном контейнере
        showSearchResults($('.search-result .results'));        
                
        // Если поиск вернул больше одной страницы, вывести элементы пэйджинга в заданный контейнер,
        // иначе не отображать пэйджинг
        if (webSearch.cursor.pages.length > 1) {
            showSearchPaging($('.search-result .paging ul'))            
            $('.search-result .paging').show();
        }
        else {
            $('.search-result .paging').hide();        
        }
        
        // Отобразить блок с результатами
        $('.search-result').show();
    }
    else { // Если поиск не вернул результатов, отобразить соответствующее сообщение
        $('.search-fail').show();
    }
}
function showSearchResults(resultsContainer) {
    // Установить начальное значение нумерации элементов
    resultsContainer.attr('start', Number(webSearch.cursor.pages[webSearch.cursor.currentPageIndex].start) + 1);        
    
    // Сгенерировать HTML-разметку для каждого результата и добавить ее в контейнер
    $.each(webSearch.results, function(i, resItem) {            
        $('<li/>')
            .append( $('<a/>').html(resItem.titleNoFormatting).attr('href', resItem.unescapedUrl) )
            .append( $('<p/>').html(resItem.content) )
            .appendTo(resultsContainer);
    });
}
//Затем формируем разметку пэйджинга, используя свойство cursor:

function showSearchPaging(pagingContainer) {
    // Если текущая страница - не первая, создать и добавить в контейнер кнопку "Назад"
    if (webSearch.cursor.currentPageIndex > 0) {
        $('<li>')
            .append ( $('<a/>').attr('href', '#').text('Назад').data('pageNumber', webSearch.cursor.currentPageIndex - 1) )
            .appendTo(pagingContainer);
    } 
// Сгенерировать HTML-разметку для каждого элемента пэйджинга и добавить ее в контейнер
    $.each(webSearch.cursor.pages, function(pageIndex, pageItem) {            
        (webSearch.cursor.currentPageIndex == pageIndex 
            ? $('<li/>').text(pageItem.label) 
            : $('<li/>').append( $('<a/>').attr('href', '#').text(pageItem.label).data('pageNumber', pageIndex) )
        ).appendTo(pagingContainer);
    });

    // Если текущая страница - не последняя, создать и добавить в контейнер кнопку "Вперед"
    if (webSearch.cursor.currentPageIndex < webSearch.cursor.pages.length - 1) {
        $('<li/>')
            .append ( $('<a/>').attr('href', '#').text('Вперед').data('pageNumber', webSearch.cursor.currentPageIndex + 1) )
            .appendTo(pagingContainer);
    }
    
    // Зарегистрировать обработчик нажатия для всех ссылок в контейнере
    pagingContainer.find('a').click(function() {
        var pageNum = $(this).data('pageNumber');
        onWebSearchStarting();
        webSearch.gotoPage(pageNum); 
        return false;
    });
}	
	});

//挂载页面的事件
var ISMOBILE = false;
function initDevice(){
  if ($(window).width() <= 1280) {
    ISMOBILE = true;
    $('#sidebar').addClass('mobile');
    $('#sidebar, #pjax, #icon-arrow').addClass('fullscreen');
  }
}
function initEvent(){
  // Variables
  var sidebar    = $('#sidebar'),
      container  = $('#post'),
      content    = $('#pjax'),
      button     = $('#icon-arrow');

  // Tags switcher
  var clickHandler = function(k) {
    return function() {
      $(this).addClass('active').siblings().removeClass('active');
      tag1.hide();
      window['tag'+k].delay(50).fadeIn(350);
    }
  };
  for (var i = 1; i <= 100; i++) {
    if( !window['tag'+i] ){
      break;
    }
    $('#js-label' + i).on('click', clickHandler(i)).find('.post_count').text(window['tag'+i].length);
  }

  // If sidebar has class 'mobile', hide it after clicking.
  tag1.on('click', function() {
    $(this).addClass('active').siblings().removeClass('active');
    if (sidebar.hasClass('mobile')) {
      $('#sidebar, #pjax, #icon-arrow').addClass('fullscreen');
    }
  });

  // Enable fullscreen.
  $('#js-fullscreen').on('click', function() {
    if (button.hasClass('fullscreen')) {
      sidebar.removeClass('fullscreen');
      button.removeClass('fullscreen');
      content.delay(300).queue(function(){
        $(this).removeClass('fullscreen').dequeue();
      });
    } else {
      sidebar.addClass('fullscreen');
      button.addClass('fullscreen');
      content.delay(200).queue(function(){
        $(this).addClass('fullscreen').dequeue();
      });
    }
  });

  $('#mobile-avatar').on('click', function(){
    $('#sidebar, #pjax, #icon-arrow').addClass('fullscreen');
  });
}

function initPjax(){
  var content = $('#pjax');
  var container  = $('#post');
  $(document).pjax('#avatar, #mobile-avatar, .pl__all', '#pjax', { fragment: '#pjax', timeout: 10000 });
  $(document).on({
    'pjax:click': function() {
      content.removeClass('fadeIn').addClass('fadeOut');
      $('#post__toc').hide();
      NProgress.start();
    },
    'pjax:start': function() {
      content.css({'opacity':0});
    },
    'pjax:end': function() {
      NProgress.done();
      container.scrollTop(0);
      content.css({'opacity':1}).removeClass('fadeOut').addClass('fadeIn');
      initAfterPjax();
    }
  });
}

function initAfterPjax(){
  initToc();
  initDisqus();
  initHighLight();
}

function binarySearchTocLower(list,elem){
  var left = 0;
  var right = list.length - 1;
  while( left <= right ){
    var middle = Math.floor((left+right)/2);
    var listMiddle = list[middle].target.offset().top;
    if( listMiddle == elem ){
      return middle;
    }else if( listMiddle > elem ){
      right = middle - 1;
    }else{
      left = middle + 1;
    }
  }
  if( left - 1 < 0 ){
    return 0;
  }else{
    return left - 1;
  }
}

function initToc(){
  var container  = $('#post');
  $('#post__content a').attr('target','_blank');

  // Generate post TOC for h1 h2 and h3
  var toc = $('#post__toc-ul');
  var tocContainer = $('#post__toc');;
  var tocList = [];
  toc.empty();

  $('#post__content').find('h1,h2,h3').each(function() {
    var elem = $(this);
    var single = {};
    single.target = elem;
    single.tagName = {
      "h1":"h2",
      "h2":"h3",
      "h3":"h4",
    }[elem.prop("tagName").toLowerCase()];
    single.text = elem.text();
    single.id = elem.attr('id');
    tocList.push(single);
  });

  for( var i in tocList ){
    var singleToc = tocList[i];
    toc.append('<li class="post__toc-li post__toc-'+singleToc.tagName+'"><a href="#' + singleToc.id + '" class="js-anchor-link">' + singleToc.text + '</a></li>');
  }

  function updateToc(){
    var index = binarySearchTocLower(tocList,140);
    var targetToc = $('#post__toc .post__toc-li');
    targetToc.eq(index).addClass('active').siblings().removeClass('active');
    var targetScroll = targetToc.eq(index).offset().top - targetToc.eq(0).offset().top;
    tocContainer.scrollTop(targetScroll-tocContainer.height()/2);
  }
  container.off('scroll').bind('scroll',updateToc);
  updateToc();

  // Smooth scrolling
  $('.js-anchor-link').off('click').on('click', function() {
    var target = $(this.hash);
    container.animate({scrollTop: target.offset().top + container.scrollTop() - 140}, 500, function() {
      target.addClass('flash').delay(700).queue(function() {
        $(this).removeClass('flash').dequeue();
      });
    });
  });
  if( ISMOBILE == false ){
    $('#post__toc').fadeIn();
  }
  
}

function initDisqus(){
  var ds_interval = null;
  function check() {
    if( !window.DISQUS ){
      return;
    }
    clearInterval(ds_interval);
    window.DISQUS.reset({
        reload: true,
        config: function () {
            this.page.identifier = $('#post__content').data('identifier');
            this.page.title = $('#post__content').data('title');
        }
    });
  }
  ds_interval = setInterval(check,500);
}

function initHighLight(){
  var hightlight_interval = null;
  function checkHightlight() {
    if( !window.hljs ){
      return;
    }
    clearInterval(hightlight_interval);
    function getLinenumber(text){
      var linenumber = 0;
      var lastIndex = -1;
      for( var i = 0 ; i < text.length ; i++ ){
        var single = text.charAt(i);
        if( single == '\n'){
          ++linenumber;
          lastIndex = i;
        }
      }
      if( lastIndex != text.length -1 ){
        ++linenumber;
      }
      return linenumber;
    }
    function generateLineDiv(linenumber){
      var codeHtml = '<code style="float:left;" class="lineno">';
      for( var i = 1 ; i <= linenumber ; ++i ){
        codeHtml += i+"\n";
      }
      codeHtml += '</code>';
      return $(codeHtml);
    }
    function initLineNumber(){
      $('pre code').each(function(i, block) {
        block = $(block);
        if( block.hasClass("lineno") ){
          return;
        }
        if( block.prev().hasClass("lineno")){
          return;
        }
        var linenumber = getLinenumber(block.text());
        var div = generateLineDiv(linenumber);
        block.before(div);
      });
    }
    function initHighLight(){
      hljs.configure({
        tabReplace: '    ', // 4 spaces
      });
      $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
      });
    }
    initLineNumber();
    initHighLight();
  }
  hightlight_interval = setInterval(checkHightlight,500);
}

initDevice();
initEvent();
initPjax();
initAfterPjax();


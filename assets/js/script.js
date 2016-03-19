//挂载页面的事件
function initDevice(){
  if ($(window).width() <= 1280) {
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
  initDocument();
  initDisqus();
  initHighLight();
}

function initDocument(){
  var container  = $('#post');
  $('#post__content a').attr('target','_blank');
  // Generate post TOC for h1 h2 and h3
  var toc = $('#post__toc-ul');
  // Empty TOC and generate an entry for h1
  toc.empty();
     // .append('<li class="post__toc-li post__toc-h1"><a href="#post__title" class="js-anchor-link">' + $('#post__title').text() + '</a></li>');

  // Generate entries for h2 and h3
  var onlyOneH1 = ($('#post__content').find('h1').length == 1);
  $('#post__content').find('h1,h2,h3').each(function() {
    // Generate random ID for each heading
    $(this).attr('id', function() {
      var ID = "",
          alphabet = "abcdefghijklmnopqrstuvwxyz";

      for(var i=0; i < 5; i++) {
        ID += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      }
      return ID;
    });

    var tagName = $(this).prop("tagName");
    if(tagName == 'H3' && !onlyOneH1) return;

    var asTag = onlyOneH1 ? tagName : (tagName == 'H1'?'h2':'h3');
    toc.append('<li class="post__toc-li post__toc-'+asTag.toLowerCase()+'"><a href="#' + $(this).attr('id') + '" class="js-anchor-link">' + $(this).text() + '</a></li>');

  });

  $('#icon-list').off('click').on('click',function(){
    $('#post__toc').toggle();
  });

  // Smooth scrolling
  $('.js-anchor-link').off('click').on('click', function() {
    var target = $(this.hash);
    container.animate({scrollTop: target.offset().top + container.scrollTop() - 70}, 500, function() {
      target.addClass('flash').delay(700).queue(function() {
        $(this).removeClass('flash').dequeue();
      });
    });
  });
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


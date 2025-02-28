function getURLVar(key) {
  var value = [];

  var query = String(document.location).split('?');

  if (query[1]) {
    var part = query[1].split('&');

    for (i = 0; i < part.length; i++) {
      var data = part[i].split('=');

      if (data[0] && data[1]) {
        value[data[0]] = data[1];
      }
    }

    if (value[key]) {
      return value[key];
    } else {
      return '';
    }
  }
}
function isEmpty( el ){
  return !$.trim(el.html())
}
$(document).ajaxStop(function() {
  function isEmpty( el ){
    return !$.trim(el.html())
  }
  if (!isEmpty($('#product'))) {
    $('#product .option-container').addClass('has-option');      
  }	
});
$(document).ready(function() {
  if ($(".hd1").length) {
    $('.slider-group .col1hd1:first').addClass('hd1slider');
  }
  if ($(".banner-static.static-top-volga1 .col3").length == 0) {
    $('.banner-static.static-top-volga1').addClass('tworow');
  }
  // vertical thumbs on product page
  
  
  
  // product video 
  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false
  });

  // color swatch js snippet
  $('.swatch :radio').change(function() {
    var optionIndex = $(this).closest('.swatch').attr('data-option-index');
    var optionValue = $(this).val();
    $(this)
    .closest('form')
    .find('.single-option-selector')
    .eq(optionIndex)
    .val(optionValue)
    .trigger('change');
  });

  // product page add to cart
  $('#button-cart').on('click', function(e) {
    e.preventDefault();
    $.ajax({
      url: '/cart/add.js',
      type: 'post',
      data: $('#form_buy input[type=\'text\'], #form_buy select'),
      dataType: 'json',
      beforeSend: function() {
        $('#button-cart').button('loading');
      },
      complete: function() {
        $('#button-cart').button('reset');
      },
      success: function(json) {
        $('.alert, .text-danger').remove();
        $('.form-group').removeClass('has-error');

        if (json['error']) {
          if (json['error']['option']) {
            for (i in json['error']['option']) {
              var element = $('#input-option' + i.replace('_', '-'));
              if (element.parent().hasClass('input-group')) {
                element.parent().after('<div class="text-danger">' + json['error']['option'][i] + '</div>');
              } else {
                element.after('<div class="text-danger">' + json['error']['option'][i] + '</div>');
              }
            }
          }

          if (json['error']['recurring']) {
            $('select[name=\'recurring_id\']').after('<div class="text-danger">' + json['error']['recurring'] + '</div>');
          }

          // Highlight any found errors
          $('.text-danger').parent().addClass('has-error');
        }

        toastr.success('Congratulation! Item added successfully.')

        $.getJSON('/cart.js', function(cart) {
          $('#cart > button').load('/ #cart > button #hcart');
          Currency.convertAll(shopCurrency, Currency.cookie.read());
        });

        //$('html, body').animate({ scrollTop: 0 }, 'slow');

        $('#cart > ul').load('/ #cart > ul li');

      },
      error: function(xhr, ajaxOptions, thrownError) {
        alert(xhr.responseText);
      }
    });
  });

  //stickyMenu();
  var sticky_menu = $('#sticky-menu').attr('data-sticky');
  if (sticky_menu==1){
    var headerSpaceH = $('header').outerHeight(true);
    $('header').after('<div class="headerSpace unvisible" style="height:'+headerSpaceH+'px;"></div>');	
  }
  // Scroll
  var currentP = 0;
  var stickyOffset = 0;

  stickyOffset = $('header').offset().top;
  stickyOffset += $('header').outerHeight();
  stickyOffset += 30;
  $(window).scroll(function(){
    var headerH = $('header').height();
    var scrollP = $(window).scrollTop();
    var winInnW = window.innerWidth;
    if( winInnW > 1024 ){
      if(scrollP != currentP){
        //Sticky header
        if (sticky_menu==1){
          if(scrollP >= stickyOffset){
            $('.top-menu').addClass('fix-header');

            $('.headerSpace').removeClass('unvisible');
          } else {
            $('.top-menu').removeClass('fix-header');

            $('.headerSpace').addClass('unvisible');
          }
        }
        currentP = $(window).scrollTop();
      }
    }
  });

  if (!isEmpty($('#product'))) {
    $('#product .option-container').addClass('has-option');      
  }
  if (!isEmpty($('#product2'))) {
    $('#product2 .option-container').addClass('has-option');      
  }

  // move breadcrumbs
  $("header").after('<div class="breadcrumbs"><div class="container"></div></div>');	
  var breadcrumb = $('ul.breadcrumb');
  var breadcrumbs_container = $('.breadcrumbs .container');
  breadcrumb.appendTo(breadcrumbs_container);
  $("header").after('<div class="category-images"><div class="container"></div></div>');	
  var category_image = $('.category-image');
  var category_image_container = $('.category-images .container');
  category_image.appendTo(category_image_container);


  // Highlight any found errors
  $('.text-danger').each(function() {
    var element = $(this).parent().parent();

    if (element.hasClass('form-group')) {
      element.addClass('has-error');
    }
  });

  /* Search */
  $('header #search input[name=\'q\']').parent().find('button').on('click', function() {
    var url = '/search';

    var value = $('#search input[name=\'q\']').val();
    if(value == "Search all products..." || value ==""){
      jQuery('#search input[name=\'q\']').focus();
      return false;
    }else {
      url += '?type=product&q=' + encodeURIComponent(value);
    }
    location = url;
  });

  $('header #search input[name=\'q\']').on('keydown', function(e) {
    if (e.keyCode == 13) {
      $('header #search input[name=\'q\']').parent().find('button').trigger('click');
    }
  });


  // Menu
  $('#menu .dropdown-menu').each(function() {
    var menu = $('#menu').offset();
    var dropdown = $(this).parent().offset();

    var i = (dropdown.left + $(this).outerWidth()) - (menu.left + $('#menu').outerWidth());

    if (i > 0) {
      $(this).css('margin-left', '-' + (i + 10) + 'px');
    }
  });

  // Product List
  $('#list-view').click(function() {
    $('.custom-products').removeClass('custom-products-row');
    $(this).addClass('selected');
    $('#grid-view').removeClass('selected');
    $('#content .product-grid > .clearfix').remove();

    //$('#content .product-layout').attr('class', 'product-layout product-list col-xs-12');
    $('#content .product-grid').attr('class', 'product-layout product-list clearfix');
    $('#content .product-list .col-image').addClass('col-sm-4 col-sms-4 col-smb-12');
    $('#content .product-list .col-des').addClass('col-sm-8 col-sms-8 col-smb-12');


    localStorage.setItem('display', 'list');
  });

  // Product Grid
  $('#grid-view').click(function() {
    $('.custom-products').addClass('custom-products-row');
    $(this).addClass('selected');
    $('#list-view').removeClass('selected');
    // What a shame bootstrap does not take into account dynamically loaded columns
    cols = $('#column-right, #column-left').length;

    if (cols == 2) {
      $('#content .product-layout').attr('class', 'product-layout product-grid grid-style col-md-6 col-sm-6 col-xs-6 two-items');
    } else if (cols == 1) {
      $('#content .product-layout').attr('class', 'product-layout product-grid grid-style col-md-4 col-sm-6 col-xs-6 category');
    } else {
      $('#content .product-layout').attr('class', 'product-layout product-grid grid-style col-md-3 col-sm-6 col-xs-6 four-items');
    }
    $('#content .product-grid .col-image').removeClass('col-sm-4 col-sms-4 col-smb-12');
    $('#content .product-grid .col-des').removeClass('col-sm-8 col-sms-8 col-smb-12');


    localStorage.setItem('display', 'grid');
  });

  if (localStorage.getItem('display') == null) {
    $('#list-view').trigger('click');
  } else if (localStorage.getItem('display') == 'grid') {
    $('#grid-view').trigger('click');
  } else {
    $('#list-view').trigger('click');
  }

  // Checkout
  $(document).on('keydown', '#collapse-checkout-option input[name=\'email\'], #collapse-checkout-option input[name=\'password\']', function(e) {
    if (e.keyCode == 13) {
      $('#collapse-checkout-option #button-login').trigger('click');
    }
  });

  // tooltips on hover
  $('[data-toggle=\'tooltip\']').tooltip({container: 'body'});

  // Makes tooltips work on ajax generated content
  $(document).ajaxStop(function() {
    $('[data-toggle=\'tooltip\']').tooltip({container: 'body'});
  });
});

// Cart add remove functions
var cart = {
  'add': function(product_id, quantity) {
    $.ajax({
      url: '/cart/add.js',
      type: 'post',
      data: 'id=' + product_id + '&quantity=' + (typeof(quantity) != 'undefined' ? quantity : 1),
      dataType: 'json',
      beforeSend: function() {
        var btn = $(this);
        $('.btn-cart > .button').button('loading');
      },
      complete: function() {
        $('.btn-cart > .button').button('reset');
      },
      success: function(json) {
        $('.alert, .text-danger').remove();

        if (json['redirect']) {
          location = json['redirect'];
        }

        toastr.success('Congratulation! Your item has been added.')

        $.getJSON('/cart.js', function(cart) {
          setTimeout(function () {
            $('#cart > button').load('/ #cart > button #hcart');
          }, 100);
          //Currency.convertAll(shopCurrency, Currency.cookie.read());
        });

        $('#cart > ul').load('/ #cart > ul li');
      },
      error: function(xhr, ajaxOptions, thrownError) {
        alert(xhr.responseText);
      }
    });
  },
  'remove': function(key) {
    $.ajax({
      url: '/cart/update.js',
      type: 'post',
      data: 'updates['+key+']=0',
      dataType: 'json',
      beforeSend: function() {
        //$('#cart > button').button('loading');
      },
      success: function(json) {
        $('#cart > button').button('reset');
        setTimeout(function () {
          $('#cart > button').load('/ #cart > button #hcart');
        }, 100);
        //Currency.convertAll(shopCurrency, Currency.cookie.read());

        if (getURLVar('route') == '/cart' || getURLVar('route') == '/checkout') {
          location = '/cart';
        } else {
          $('#cart > ul').load('/ #cart > ul li');
        }
      },
      error: function(xhr, ajaxOptions, thrownError) {
        alert(xhr.responseText);
      }
    });
  }
}

var wishlist = {
  'add': function(product_id) {
    $.ajax({
      url: 'index.php?route=account/wishlist/add',
      type: 'post',
      data: 'product_id=' + product_id,
      dataType: 'json',
      success: function(json) {
        $('.alert-dismissible').remove();

        if (json['redirect']) {
          location = json['redirect'];
        }

        if (json['success']) {
          $('body').before('<div class="alert alert-success alert-dismissible"><i class="fa fa-check-circle"></i> ' + json['success'] + ' <button type="button" class="close" data-dismiss="alert">&times;</button></div>');
        }

        $('#wishlist-total .count').html(json['total']);
        $('#wishlist-total').attr('title', json['total']);

        $('html, body').animate({ scrollTop: 0 }, 'slow');
      },
      error: function(xhr, ajaxOptions, thrownError) {
        alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
      }
    });
  },
  'remove': function() {

  }
}

/* Agree to Terms */
$(document).delegate('.agree', 'click', function(e) {
  e.preventDefault();

  $('#modal-agree').remove();

  var element = this;

  $.ajax({
    url: $(element).attr('href'),
    type: 'get',
    dataType: 'html',
    success: function(data) {
      html  = '<div id="modal-agree" class="modal">';
      html += '  <div class="modal-dialog">';
      html += '    <div class="modal-content">';
      html += '      <div class="modal-header">';
      html += '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
      html += '        <h4 class="modal-title">' + $(element).text() + '</h4>';
      html += '      </div>';
      html += '      <div class="modal-body">' + data + '</div>';
      html += '    </div>';
      html += '  </div>';
      html += '</div>';

      $('body').append(html);

      $('#modal-agree').modal('show');
    }
  });
});

// Autocomplete */
(function($) {
  $.fn.autocomplete = function(option) {
    return this.each(function() {
      this.timer = null;
      this.items = new Array();

      $.extend(this, option);

      $(this).attr('autocomplete', 'off');

      // Focus
      $(this).on('focus', function() {
        this.request();
      });

      // Blur
      $(this).on('blur', function() {
        setTimeout(function(object) {
          object.hide();
        }, 200, this);
      });

      // Keydown
      $(this).on('keydown', function(event) {
        switch(event.keyCode) {
          case 27: // escape
            this.hide();
            break;
          default:
            this.request();
            break;
        }
      });

      // Click
      this.click = function(event) {
        event.preventDefault();

        value = $(event.target).parent().attr('data-value');

        if (value && this.items[value]) {
          this.select(this.items[value]);
        }
      }

      // Show
      this.show = function() {
        var pos = $(this).position();

        $(this).siblings('ul.dropdown-menu').css({
          top: pos.top + $(this).outerHeight(),
          left: pos.left
        });

        $(this).siblings('ul.dropdown-menu').show();
      }

      // Hide
      this.hide = function() {
        $(this).siblings('ul.dropdown-menu').hide();
      }

      // Request
      this.request = function() {
        clearTimeout(this.timer);

        this.timer = setTimeout(function(object) {
          object.source($(object).val(), $.proxy(object.response, object));
        }, 200, this);
      }

      // Response
      this.response = function(json) {
        html = '';

        if (json.length) {
          for (i = 0; i < json.length; i++) {
            this.items[json[i]['value']] = json[i];
          }

          for (i = 0; i < json.length; i++) {
            if (!json[i]['category']) {
              html += '<li data-value="' + json[i]['value'] + '"><a href="#">' + json[i]['label'] + '</a></li>';
            }
          }

          // Get all the ones with a categories
          var category = new Array();

          for (i = 0; i < json.length; i++) {
            if (json[i]['category']) {
              if (!category[json[i]['category']]) {
                category[json[i]['category']] = new Array();
                category[json[i]['category']]['name'] = json[i]['category'];
                category[json[i]['category']]['item'] = new Array();
              }

              category[json[i]['category']]['item'].push(json[i]);
            }
          }

          for (i in category) {
            html += '<li class="dropdown-header">' + category[i]['name'] + '</li>';

            for (j = 0; j < category[i]['item'].length; j++) {
              html += '<li data-value="' + category[i]['item'][j]['value'] + '"><a href="#">&nbsp;&nbsp;&nbsp;' + category[i]['item'][j]['label'] + '</a></li>';
            }
          }
        }

        if (html) {
          this.show();
        } else {
          this.hide();
        }

        $(this).siblings('ul.dropdown-menu').html(html);
      }

      $(this).after('<ul class="dropdown-menu"></ul>');
      $(this).siblings('ul.dropdown-menu').delegate('a', 'click', $.proxy(this.click, this));

    });
  }
})(window.jQuery);
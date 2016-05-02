window.theme = window.theme || {};

theme.initCache = function () {
  theme.cache = {
    // General
    $html : $('html'),
    $body : $('body'),

    // Product Page
    $productPhoto: $('#ProductPhoto'),
    $productImage : $('#ProductPhotoImg'),
    $productThumbs : $('#ProductThumbs'),
    $productImageGallery: $('.gallery__item'),
  };
};

theme.init = function() {
  theme.initCache();
  theme.productImageSwitch();
  theme.productImageGallery();
};

theme.productPage = function (options) {
  var moneyFormat = options.money_format,
      variant = options.variant,
      selector = options.selector,
      translations = options.translations;

  // Selectors
  var $productImage = $('#ProductPhotoImg'),
      $addToCart = $('#AddToCart'),
      $productPrice = $('#ProductPrice'),
      $comparePrice = $('#ComparePrice');
      $productStatus = $('#ProductStatus');

  if (variant) {
    // Update variant image, if one is set
    if (variant.featured_image) {
      var newImg = variant.featured_image,
              el = $productImage[0];
      Shopify.Image.switchImage(newImg, el, theme.switchImage);
    }

    // Update the product price
    $productPrice.html(Shopify.formatMoney(variant.price, moneyFormat));

    // Update and show the product's compare price if necessary
    if (variant.compare_at_price > variant.price) {
      $comparePrice.text(Shopify.formatMoney(variant.compare_at_price, moneyFormat)).removeClass('hide');
      $productStatus.text(translations.on_sale).removeClass('hide');
    } else {
      $comparePrice.addClass('hide');
      $productStatus.addClass('hide');
    }

    // Select a valid variant if available
    if (variant.available) {
      // We have a valid product variant, so enable the submit button
      $addToCart.removeClass('disabled').prop('disabled', false);
    } else {
      // Variant is sold out, disable the submit button
      $addToCart.addClass('disabled').prop('disabled', true);
      $productStatus.text(translations.sold_out).removeClass('hide');
    }


  } else {
    // The variant does not exist, disable submit button
    $addToCart.addClass('disabled').prop('disabled', true);
    $productStatus.text(translations.unavailable).removeClass('hide');
  }

};

theme.productImageSwitch = function () {
  if (theme.cache.$productThumbs.length) {
    // Switch the main image with one of the thumbnails
    // Note: this does not change the variant selected, just the image
    theme.cache.$productThumbs.on('click', 'a', function(evt) {
      evt.preventDefault();
      var newImage = $(this).attr('href');
      var newImageId = $(this).attr('data-image-id');
      theme.switchImage(newImage, { id: newImageId }, theme.cache.$productImage);
    });
  }
};

theme.switchImage = function (src, imgObject, el) {
  // Make sure element is a jquery object
  var $el = $(el);
  $el.parent('a').attr('href', src.replace('_grande', '_1024x1024'));
  $el.attr('src', src);
  $el.attr('data-image-id', imgObject.id);
};

theme.productImageGallery = function() {
  if (!theme.cache.$productImageGallery.length) {
    return;
  };
  theme.cache.$productImageGallery.magnificPopup({
    type:'image',
    tLoading: '',
    gallery: {
      enabled: true
    }
  });

  theme.cache.$productPhoto.on('click', function(e) {
    e.preventDefault();
    var imageId = $(this).children('img').attr('data-image-id');
    theme.cache.$productImageGallery.filter('[data-image-id="' + imageId + '"]').trigger('click');
  });
};

// Initialize Theme's JS on docready
$(theme.init);

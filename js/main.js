$(function(){
  slickSetting();
  scrollToTarget();
});

function slickSetting() {
  $(".slick-dots").addClass('container');
  $(".regular").slick({
    dots: true,
    arrows: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000
  });
}

function scrollToTarget() {
  $('a[href*="#"]:not([href="#"])').click(function () {
    var target = $(this.hash);
    $('html, body').animate({ scrollTop: target.offset().top - 76 }, 500);
    return false;
  });
}
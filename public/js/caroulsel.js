let slideIndex = 0;
function showSlides() {
  let slides = $('.slideshow-img');
  let totalSlides = slides.length;

  // Fade out the current image
  slides.eq(slideIndex).fadeOut(2000, function () {
    // Increment or reset the slide index
    slideIndex = (slideIndex + 1) % totalSlides;
    // Fade in the next image
    slides.eq(slideIndex).fadeIn(2000);
  });

  // Change image every 4 seconds
  setTimeout(showSlides, 6000);
}

$(document).ready(function () {
  // Initially hide all images and then start the slideshow
  $('.slideshow-img').hide();
  showSlides();
});

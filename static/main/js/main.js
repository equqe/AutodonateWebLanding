'use strict';

(function ($) {

    /* preloader */
    $(window).on('load', function () {
        $(".loader").fadeOut();
        $("#preloder").delay(200).fadeOut("slow");
    });

    /* bg set */
    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });

    /* menu hover*/
    $(".header-section .nav-menu .mainmenu ul li").on('mouseenter', function() {
        $(this).addClass('active');
    });
    $(".header-section .nav-menu .mainmenu ul li").on('mouseleave', function() {
        $('.header-section .nav-menu .mainmenu ul li').removeClass('active');
    });
})
(jQuery);

/*copy text*/

function addNotification() {
        var notification = document.getElementById('notification');
        notification.classList.add('show');
        setTimeout(function() {
            notification.classList.remove('show');
        }, 2000);
}

function copy() {
        const textToCopy = "mc.krasworld.ru";
        navigator.clipboard.writeText(textToCopy).then(function() {
            addNotification();
        });
}

document.querySelector(".copy-btn").addEventListener("click", copy);

/* progress bar */

function progressBar() {
    let scroll = window.scrollY || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = scroll / height * 100;

    document.getElementById('progressBar').style.width = scrolled + '%';
}
window.addEventListener('scroll', progressBar);

/* animating when observing */

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function animateScrollingElements() {
    const elements = document.querySelectorAll('.anim-elem');
    elements.forEach((element) => {
        if (isElementInViewport(element)) {
            element.classList.add('animated');
            return;
        }
        element.classList.remove('animated');
    });
}

document.addEventListener('DOMContentLoaded', animateScrollingElements);
window.addEventListener('scroll', animateScrollingElements);

/* calc vault */

const rangeInputs = document.querySelectorAll('input[type="range"]');
const numberInput = document.querySelector('input[type="number"]');

function handleInputChange(e) {
    let target = e.target;
    if (e.target.type !== 'range') {
        target = document.getElementById('range');
    } 
    const min = target.min;
    const max = target.max;
    const val = target.value;
  
    target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
}

rangeInputs.forEach(input => {
    input.addEventListener('input', handleInputChange);
});

numberInput.addEventListener('input', handleInputChange);

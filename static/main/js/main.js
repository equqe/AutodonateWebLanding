$(function () {
    'use strict';

    // preloader
    $(window).on('load', function () {
        $(".loader, #preloder").fadeOut("slow");
    });

    // bg set
    $('.set-bg').css('background-image', function () {
        return 'url(' + $(this).data('setbg') + ')';
    });

    // menu hover
    const menuItems = $(".header-section .nav-menu .mainmenu ul li");
    menuItems.hover(
        function() {
            $(this).addClass('active');
        },
        function() {
            $(this).removeClass('active');
        }
    );

    // copy text
    const notification = $('#notification');
    function addNotification() {
        notification.addClass('show');
        setTimeout(function() {
            notification.removeClass('show');
        }, 2000);
    }

    function copy() {
        const textToCopy = "mc.krasworld.ru";
        navigator.clipboard.writeText(textToCopy)
            .then(function() {
                addNotification();
            })
    }

    $(".copy-btn.notif").on("click", copy);

    // progress bar
    function progressBar() {
        const scroll = window.scrollY || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = scroll / height * 100;

        $('#progressBar').css('width', scrolled + '%');
    }

    $(window).on('scroll', progressBar);

    // animating when observing
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
        const elements = $('.anim-elem');
        elements.each((index, element) => {
            if (isElementInViewport(element)) {
                $(element).addClass('animated');
                return;
            }
            $(element).removeClass('animated');
        });
    }

    $(document).ready(animateScrollingElements);
    $(window).on('scroll', animateScrollingElements);

    // calc vault
    const rangeInputs = $('input[type="range"]');
    const numberInput = $('input[type="number"]');
    const buttonStar = $('#crystal');

    buttonStar.on('click', function(event) {
        event.preventDefault();
        buttonStar.data('amount', numberInput.val());
    });

    function handleInputChange(e) {
        const target = e.target.type !== 'range' ? $('#range')[0] : e.target;
        const min = target.min;
        const max = target.max;
        const val = target.value;

        target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
        numberInput.val(val);
    }

    rangeInputs.each((index, input) => {
        $(input).on('input', handleInputChange);
    });

    numberInput.on('input', handleInputChange);

    // username input and popup
    const openPopupButtons = $(".open-popup");

    openPopupButtons.each(function(index, button) {
        $(button).on("click", function() {
            const amount = $(this).data('amount');
            const donate = $(this).data('donate');
            $('#popup').show();
            $(".confirm-btn").on("click", function(event) {
                event.preventDefault();
                const username = $('#username').val();
                const email = $('#email').val();
                const usernameRegex = /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]+$/;
                const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
                if (username && username.length >= 2 && username.length <= 16 && usernameRegex.test(username) && email && emailRegex.test(email)) {
                    $('#popup').hide();
                    createPayment(amount, username, donate, email);
                } else {
                    alert("Неверный юзернейм/email");
                }
            });
        });
    });

    $('#close-popup').on("click", function() {
        $('#popup').hide();
    });

    function createPayment(amount, username, donate, email) {
        fetch('/payment/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                amount: amount,
                donate: donate,
                email: email,
            }),
        })
        .then(response => response.json())
        .then(data => {
            const checkout = new window.YooMoneyCheckoutWidget({
                confirmation_token: data.confirmation_token,
                return_url: 'https://krasworld.ru',
                customization: {
                    userData: {
                        name: username
                    },
                    modal: true
                },
                error_callback: function(error) {
                    console.log('Error during initialization:', error);
                }
            });
            checkout.render()
        });
    }
});

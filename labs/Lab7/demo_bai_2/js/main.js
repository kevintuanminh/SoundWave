'use strict';

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        $(".loader").fadeOut();
        $("#preloder").delay(200).fadeOut("slow");

        /*------------------
            Gallery filter
        --------------------*/
        $('.featured__controls li').on('click', function () {
            $('.featured__controls li').removeClass('active');
            $(this).addClass('active');
        });
        if ($('.featured__filter').length > 0) {
            var containerEl = document.querySelector('.featured__filter');
            var mixer = mixitup(containerEl);
        }
    });

    /*------------------
        Background Set
    --------------------*/
    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });

    //Humberger Menu
    $(".humberger__open").on('click', function () {
        $(".humberger__menu__wrapper").addClass("show__humberger__menu__wrapper");
        $(".humberger__menu__overlay").addClass("active");
        $("body").addClass("over_hid");
    });

    $(".humberger__menu__overlay").on('click', function () {
        $(".humberger__menu__wrapper").removeClass("show__humberger__menu__wrapper");
        $(".humberger__menu__overlay").removeClass("active");
        $("body").removeClass("over_hid");
    });

    /*------------------
		Navigation
	--------------------*/
    $(".mobile-menu").slicknav({
        prependTo: '#mobile-menu-wrap',
        allowParentLinks: true
    });


    $('.hero__categories__all').on('click', function(){
        $('.hero__categories ul').slideToggle(400);
    });

    /*-------------------
		Quantity change
	--------------------- */
    var proQty = $('.pro-qty');
    proQty.prepend('<span class="dec qtybtn">-</span>');
    proQty.append('<span class="inc qtybtn">+</span>');
    proQty.on('click', '.qtybtn', function () {
        var $button = $(this);
        var oldValue = $button.parent().find('input').val();
        if ($button.hasClass('inc')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        $button.parent().find('input').val(newVal);
        updateTotal();
    });

    /*-------------------
	Bổ sung hàm updateTotal()
	--------------------- */
    // function updateTotal(){
    //     var solg = document.getElementById("quantity").value;
    //     var gia = document.getElementsByClassName("shoping__cart__price")[0];
    //     var tong = solg * parseFloat(gia.innerText);

    //     document.getElementById('total').innerText = tong.toFixed(3) + ' đ';
    // }

    $(document).ready(function () {
        // Hàm định dạng số thành tiền tệ (VND)
        function formatCurrency(value) {
            return value.toLocaleString('vi-VN') + " đ";
        }
    
        // Hàm chuyển đổi chuỗi tiền tệ thành số để tính toán
        function parseCurrency(text) {
            return parseFloat(text.replace(/[^\d]/g, ""));
        }
    
        // Hàm cập nhật tổng tiền cho từng dòng và toàn bộ giỏ hàng
        function updateCart() {
            let subtotal = 0;
    
            $(".shoping__cart__table tbody tr").each(function () {
                const price = parseCurrency($(this).find(".shoping__cart__price").text());
                const quantity = parseInt($(this).find(".pro-qty input").val());
                
                // Tính tổng từng dòng
                const rowTotal = price * quantity;
                $(this).find(".shoping__cart__total").text(formatCurrency(rowTotal));
                
                subtotal += rowTotal;
            });
    
            // Cập nhật phần tổng phụ và tổng chính
            $(".shoping__checkout ul li.tongphu span").text(formatCurrency(subtotal));
            $(".shoping__checkout ul li.tongchinh span").text(formatCurrency(subtotal));
            
            // Cập nhật giá trên Header (nếu cần)
            $(".header__cart__price span").text(formatCurrency(subtotal));
        }
    
        // Lắng nghe sự kiện thay đổi số lượng
        // Sử dụng 'body' để bắt được cả các nút tăng/giảm do template Ogani tạo ra
        $(document).on("click", ".qtybtn", function () {
            updateCart();
        });
    
        $(document).on("change", ".pro-qty input", function () {
            if ($(this).val() < 1) $(this).val(1);
            updateCart();
        });
    
        // Xử lý nút xóa sản phẩm
        $(".shoping__cart__item__close").on("click", function () {
            $(this).closest("tr").remove();
            updateCart();
        });
    
        // Chạy tính toán lần đầu khi load trang
        updateCart();
    });

})(jQuery);
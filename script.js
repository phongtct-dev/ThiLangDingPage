// Khởi tạo thư viện AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function () {
    AOS.init({
        duration: 1000, // thời gian chạy hiệu ứng (từ 0 đến 3000ms, bước nhảy 50ms)
        easing: 'ease-in-out', // kiểu chuyển động mặc định cho các hiệu ứng AOS
        once: true, // hiệu ứng chỉ chạy 1 lần khi cuộn xuống (không lặp lại khi cuộn lại lên)
        mirror: false, // không chạy hiệu ứng khi cuộn ngược lên (tắt hiệu ứng ngược)
        anchorPlacement: 'top-bottom', // xác định vị trí của phần tử sẽ kích hoạt hiệu ứng
    });

    // Cuộn mượt khi click vào các link điều hướng có dạng #id
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href'); // lấy id mục tiêu từ thẻ a
            const targetElement = document.querySelector(targetId); // chọn phần tử có id tương ứng

            if (targetElement) {
                // Tính toán vị trí cuộn (có bù trừ chiều cao của header)
                const headerOffset = document.querySelector('.main-header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset - 20; // trừ thêm 20px để tạo khoảng cách

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth' // cuộn mượt
                });

                // Đóng menu mobile nếu đang mở
                const mainNav = document.querySelector('.main-nav');
                const menuToggle = document.querySelector('.menu-toggle');
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });

    // Bật/tắt menu mobile khi nhấn vào nút menu
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Tự động đóng menu mobile khi click ra ngoài (tùy chọn nhưng tốt cho trải nghiệm người dùng)
    document.addEventListener('click', (event) => {
        if (!mainNav.contains(event.target) && !menuToggle.contains(event.target) && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
});

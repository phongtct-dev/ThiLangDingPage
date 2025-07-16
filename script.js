// Khởi tạo thư viện AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function () {
    AOS.init({
        duration: 1000, // thời gian chạy hiệu ứng (từ 0 đến 3000ms, bước nhảy 50ms)
        easing: 'ease-in-out', // kiểu chuyển động mặc định cho các hiệu ứng AOS
        once: true, // hiệu ứng chỉ chạy 1 lần khi cuộn xuống (không lặp lại khi cuộn lại lên)
        mirror: false, // không chạy hiệu ứng khi cuộn ngược lên (tắt hiệu ứng ngược)
        anchorPlacement: 'top-bottom', // xác định vị trí của phần tử sẽ kích hoạt hiệu ứng
    });

    // ===== KHỞI TẠO SWIPER CHO HERO SLIDESHOW =====
    const heroSwiper = new Swiper('.hero-swiper', {
        // Cấu hình cơ bản
        loop: true, // Lặp vô hạn các slide
        autoplay: false, // Tắt autoplay ban đầu (sẽ bật khi cần)
        effect: 'fade', // Hiệu ứng chuyển slide fade
        fadeEffect: {
            crossFade: true // Hiệu ứng fade mượt mà
        },
        speed: 1000, // Tốc độ chuyển slide (1 giây)

        // Pagination (chấm tròn điều hướng)
        pagination: {
            el: '.swiper-pagination',
            clickable: true, // Cho phép click vào chấm để chuyển slide
            dynamicBullets: false, // Không sử dụng dynamic bullets
        },

        // Hỗ trợ chuột và touch
        grabCursor: true, // Hiển thị con trỏ grab khi hover
        touchRatio: 1, // Độ nhạy của touch
        touchAngle: 45, // Góc touch để kích hoạt swipe

        // Keyboard navigation
        keyboard: {
            enabled: true, // Cho phép điều khiển bằng bàn phím
            onlyInViewport: true, // Chỉ hoạt động khi slider trong viewport
        },

        // Responsive breakpoints
        breakpoints: {
            320: {
                touchRatio: 1.5, // Tăng độ nhạy touch trên mobile
            },
            768: {
                touchRatio: 1,
            }
        },

        // Events
        on: {
            slideChange: function () {
                const activeSlide = this.slides[this.activeIndex];
                const soundToggle = document.getElementById('soundToggle');

                // Kiểm tra loại slide hiện tại
                if (activeSlide && activeSlide.classList.contains('video-slide')) {
                    // ===== SLIDE VIDEO =====
                    soundToggle.style.display = 'flex';

                    // ❌ DỪNG AUTOPLAY khi ở slide video
                    if (this.autoplay.running) {
                        this.autoplay.stop();
                        console.log('🎥 Đang ở slide video - Dừng autoplay');
                    }
                } else {
                    // ===== SLIDE HÌNH ẢNH =====
                    soundToggle.style.display = 'none';

                    // ✅ BẬT AUTOPLAY khi ở slide hình ảnh
                    if (!this.autoplay.running) {
                        // Cấu hình autoplay cho slide hình ảnh
                        this.autoplay.delay = 5000; // 5 giây cho mỗi slide ảnh
                        this.autoplay.start();
                        console.log('🖼️ Đang ở slide hình ảnh - Bật autoplay');
                    }
                }

                // Làm mới hiệu ứng AOS cho slide mới
                AOS.refresh();
            },

            // Xử lý khi slider được khởi tạo
            init: function () {
                const firstSlide = this.slides[this.activeIndex];
                const soundToggle = document.getElementById('soundToggle');

                // Kiểm tra slide đầu tiên
                if (firstSlide && firstSlide.classList.contains('video-slide')) {
                    soundToggle.style.display = 'flex';
                    console.log('🎬 Khởi tạo với slide video - Autoplay tắt');
                } else {
                    soundToggle.style.display = 'none';
                    // Nếu slide đầu không phải video, bật autoplay
                    this.autoplay.delay = 5000;
                    this.autoplay.start();
                    console.log('🖼️ Khởi tạo với slide hình ảnh - Autoplay bật');
                }
            }
        }
    });

    // ===== XỬ LÝ HEADER TRONG SUỐT =====
    const header = document.getElementById('mainHeader');
    const heroSection = document.getElementById('hero');

    // Tạo Intersection Observer để theo dõi Hero Section
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Khi Hero Section hiển thị - header trong suốt
                header.classList.remove('scrolled');
            } else {
                // Khi cuộn qua Hero Section - header có nền trắng
                header.classList.add('scrolled');
            }
        });
    }, {
        threshold: 0.1, // Kích hoạt khi 10% Hero Section còn hiển thị
        rootMargin: '-50px 0px 0px 0px' // Offset để header chuyển đổi sớm hơn một chút
    });

    // Bắt đầu theo dõi Hero Section
    heroObserver.observe(heroSection);

    // ===== CUỘN MƯỢT CHO NAVIGATION =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href'); // lấy id mục tiêu từ thẻ a
            const targetElement = document.querySelector(targetId); // chọn phần tử có id tương ứng

            if (targetElement) {
                // Tính toán vị trí cuộn (có bù trừ chiều cao của header)
                const headerOffset = header.offsetHeight;
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

    // ===== XỬ LÝ MENU MOBILE =====
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Tự động đóng menu mobile khi click ra ngoài
    document.addEventListener('click', (event) => {
        if (!mainNav.contains(event.target) && !menuToggle.contains(event.target) && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });

    // ===== XỬ LÝ VIDEO VÀ ÂM THANH =====
    const heroVideo = document.getElementById('heroVideo');
    const soundToggle = document.getElementById('soundToggle');
    const soundIcon = soundToggle.querySelector('i');

    // Khởi tạo trạng thái video
    let isMuted = true;
    heroVideo.muted = true;

    // Xử lý nút bật/tắt âm thanh
    soundToggle.addEventListener('click', function () {
        if (isMuted) {
            // Bật âm thanh
            heroVideo.muted = false;
            isMuted = false;
            soundIcon.className = 'fas fa-volume-up';
            soundToggle.classList.add('unmuted');
            soundToggle.setAttribute('aria-label', 'Tắt âm thanh');
        } else {
            // Tắt âm thanh
            heroVideo.muted = true;
            isMuted = true;
            soundIcon.className = 'fas fa-volume-mute';
            soundToggle.classList.remove('unmuted');
            soundToggle.setAttribute('aria-label', 'Bật âm thanh');
        }
    });

    // Xử lý lỗi video một cách graceful
    heroVideo.addEventListener('error', function () {
        console.warn('Video hero không thể tải. Sử dụng background gradient thay thế.');
        const videoSlide = document.querySelector('.video-slide');
        if (videoSlide) {
            videoSlide.style.background = 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)';
        }

        // Ẩn nút sound toggle nếu video không tải được
        soundToggle.style.display = 'none';
    });

    // Đảm bảo video phát trên các trình duyệt mobile
    heroVideo.addEventListener('canplay', function () {
        // Thử phát video
        const playPromise = heroVideo.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn('Auto-play bị ngăn chặn:', error);
                // Auto-play bị ngăn chặn, nhưng không ảnh hưởng đến trải nghiệm người dùng
            });
        }
    });

    // Tạm dừng video khi không trong viewport để tiết kiệm băng thông
    const videoObserverOptions = {
        threshold: 0.5 // Video phải hiển thị ít nhất 50% để tiếp tục phát
    };

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Video trong viewport - tiếp tục phát
                heroVideo.play().catch(e => console.warn('Không thể phát video:', e));
            } else {
                // Video ngoài viewport - tạm dừng
                heroVideo.pause();
            }
        });
    }, videoObserverOptions);

    // Bắt đầu theo dõi video
    videoObserver.observe(heroVideo);

    // ===== XỬ LÝ RESPONSIVE CHO SLIDESHOW =====
    // Điều chỉnh autoplay delay dựa trên kích thước màn hình
    function adjustSlideshowForDevice() {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            // Trên mobile: tăng thời gian autoplay để người dùng có thể đọc nội dung
            heroSwiper.autoplay.delay = 7000;
        } else {
            // Trên desktop: thời gian autoplay bình thường
            heroSwiper.autoplay.delay = 5000;
        }
    }

    // Gọi hàm khi tải trang
    adjustSlideshowForDevice();

    // Gọi hàm khi thay đổi kích thước màn hình
    window.addEventListener('resize', adjustSlideshowForDevice);

    // ===== ACCESSIBILITY IMPROVEMENTS =====
    // Thêm keyboard navigation cho slideshow
    document.addEventListener('keydown', function (e) {
        // Chỉ hoạt động khi slideshow đang trong viewport
        const heroRect = heroSection.getBoundingClientRect();
        const isHeroVisible = heroRect.top < window.innerHeight && heroRect.bottom > 0;

        if (isHeroVisible) {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    heroSwiper.slidePrev();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    heroSwiper.slideNext();
                    break;
                case ' ': // Spacebar
                    e.preventDefault();
                    const currentSlide = heroSwiper.slides[heroSwiper.activeIndex];
                    // Chỉ toggle autoplay nếu đang ở slide hình ảnh
                    if (currentSlide && !currentSlide.classList.contains('video-slide')) {
                        if (heroSwiper.autoplay.running) {
                            heroSwiper.autoplay.stop();
                        } else {
                            heroSwiper.autoplay.start();
                        }
                    }
                    break;
            }
        }
    });

    // ===== PERFORMANCE OPTIMIZATION =====
    // Lazy load images trong các slide không active
    const slideImages = document.querySelectorAll('.hero-slide img');
    slideImages.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    });

    console.log('🎉 Hero Slideshow với Video và Hình ảnh đã được khởi tạo thành công!');
    console.log('📋 Quy tắc autoplay:');
    console.log('   🎥 Slide video: KHÔNG tự động chuyển');
    console.log('   🖼️ Slide hình ảnh: TỰ ĐỘNG chuyển sau 5-7 giây');
});


// ===== XỬ LÝ CHUYỂN ĐỔI MỤC TIÊU CUỘC THI =====
const prevGoalBtn = document.getElementById('prevGoalBtn');
const nextGoalBtn = document.getElementById('nextGoalBtn');
const goalItems = document.querySelectorAll('#muc-tieu .goal-item');
let currentGoalIndex = 0;
const goalsPerPage = 3;

function updateGoals() {
    goalItems.forEach((item, index) => {
        item.style.display = 'none'; // Ẩn tất cả trước
    });
    if (currentGoalIndex === 0) {
        // Ban đầu hoặc sau khi quay lại, hiển thị thẻ 1, 2, 3
        goalItems[0].style.display = 'block';
        goalItems[1].style.display = 'block';
        goalItems[2].style.display = 'block';
    } else if (currentGoalIndex === 1) {
        // Khi click "Sang Trái", hiển thị thẻ 2, 3, 4
        goalItems[1].style.display = 'block';
        goalItems[2].style.display = 'block';
        goalItems[3].style.display = 'block';
    }
}

nextGoalBtn.addEventListener('click', () => {
    if (currentGoalIndex === 0) {
        currentGoalIndex = 1; // Chuyển sang trạng thái thẻ 2, 3, 4
        updateGoals();
    }
});

prevGoalBtn.addEventListener('click', () => {
    if (currentGoalIndex === 1) {
        currentGoalIndex = 0; // Quay lại trạng thái thẻ 1, 2, 3
        updateGoals();
    }
});

// Khởi tạo hiển thị 3 mục tiêu đầu tiên
updateGoals();

///


// ===== XỬ LÝ CHUYỂN ĐỔI CẢM XÚC CỘNG ĐỒNG =====
const prevFeedbackBtn = document.getElementById('prevFeedbackBtn');
const nextFeedbackBtn = document.getElementById('nextFeedbackBtn');
const feedbackItems = document.querySelectorAll('#cam-xuc-cong-dong .emotion-card');
const totalItems = feedbackItems.length;
let currentIndex = 0;
const itemsPerPage = 3;

function updateFeedback() {
    feedbackItems.forEach((item, index) => {
        item.style.display = 'none'; // Ẩn tất cả trước
        item.style.opacity = '0'; // Đặt opacity về 0 trước khi chuyển
        item.style.transform = 'translateY(20px)'; // Chuẩn bị dịch xuống
    });

    // Hiển thị 3 thẻ với hiệu ứng
    for (let i = 0; i < itemsPerPage; i++) {
        const displayIndex = (currentIndex + i) % totalItems;
        const item = feedbackItems[displayIndex];
        item.style.display = 'flex';
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 50); // Delay 50ms để hiệu ứng hoạt động
    }
}

nextFeedbackBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalItems;
    updateFeedback();
});

prevFeedbackBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateFeedback();
});

// Khởi tạo hiển thị 3 thẻ đầu tiên (0, 1, 2)
updateFeedback();



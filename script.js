// Initialize AOS (Animate On Scroll) library
document.addEventListener('DOMContentLoaded', function() {
 AOS.init({
 duration: 1000, // values from 0 to 3000, with step 50ms
 easing: 'ease-in-out', // default easing for AOS animations
 once: true, // whether animation should happen only once - while scrolling down
 mirror: false, // whether elements should animate out while scrolling past them
 anchorPlacement: 'top-bottom', // defines which position of the element should trigger the animation
 });

 // Smooth scrolling for navigation links
 document.querySelectorAll('a[href^="#"]').forEach(anchor => {
 anchor.addEventListener('click', function (e) {
 e.preventDefault();

 const targetId = this.getAttribute('href');
 const targetElement = document.querySelector(targetId);

 if (targetElement) {
 // Calculate offset for fixed header
 const headerOffset = document.querySelector('.main-header').offsetHeight;
 const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
 const offsetPosition = elementPosition - headerOffset - 20; // Added extra 20px for padding

 window.scrollTo({
 top: offsetPosition,
 behavior: 'smooth'
 });

 // Close mobile menu if open
 const mainNav = document.querySelector('.main-nav');
 const menuToggle = document.querySelector('.menu-toggle');
 if (mainNav.classList.contains('active')) {
 mainNav.classList.remove('active');
 menuToggle.classList.remove('active');
 }
 }
 });
 });

 // Mobile menu toggle
 const menuToggle = document.querySelector('.menu-toggle');
 const mainNav = document.querySelector('.main-nav');

 menuToggle.addEventListener('click', () => {
 mainNav.classList.toggle('active');
 menuToggle.classList.toggle('active');
 });

 // Close mobile menu when clicking outside (optional, but good for UX)
 document.addEventListener('click', (event) => {
 if (!mainNav.contains(event.target) && !menuToggle.contains(event.target) && mainNav.classList.contains('active')) {
 mainNav.classList.remove('active');
 menuToggle.classList.remove('active');
 }
 });
});
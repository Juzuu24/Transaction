document.addEventListener('DOMContentLoaded', function () {
    const superDealsSection = document.getElementById('super-deals');
    if (superDealsSection) {
        const carouselContainer = superDealsSection.querySelector('.carousel-container');
        const prevButton = superDealsSection.querySelector('.prev');
        const nextButton = superDealsSection.querySelector('.next');
        const carouselItems = superDealsSection.querySelectorAll('.carousel-item');
 
        if (carouselContainer && prevButton && nextButton && carouselItems.length > 0) {
            let currentIndex = 0;
            const itemsPerView = 2; // Initially show Flash Sale + 1 product
            const itemWidth = carouselItems[0].offsetWidth + 20; // Add gap width
            const totalItems = carouselItems.length;
            const maxIndex = totalItems - itemsPerView; // Ensure last item is visible
 
            function updateCarousel() {
                const offset = -currentIndex * itemWidth;
                carouselContainer.style.transform = `translateX(${offset}px)`;
            }
 
            prevButton.addEventListener('click', function () {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });
 
            nextButton.addEventListener('click', function () {
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateCarousel();
                }
            });
 
            // Ensure correct starting position
            updateCarousel();
        }
    }
});
 
 
 
document.addEventListener('DOMContentLoaded', function () {
    const mostPopularSection = document.getElementById('top-products');
    if (mostPopularSection) {
        const carouselContainer = mostPopularSection.querySelector('.carousel-container');
        const prevButton = mostPopularSection.querySelector('.prev');
        const nextButton = mostPopularSection.querySelector('.next');
        const carouselItems = mostPopularSection.querySelectorAll('.carousel-item');
 
        if (carouselContainer && prevButton && nextButton && carouselItems.length > 0) {
            let currentIndex = 0;
            const itemsPerView = 3; // Number of items visible at once
            const totalItems = carouselItems.length;
            const itemWidth = carouselItems[0].offsetWidth;
            const maxIndex = Math.max(0, totalItems - itemsPerView); // Ensure last items are visible
 
            function updateCarousel() {
                const offset = -currentIndex * itemWidth;
                carouselContainer.style.transform = `translateX(${offset}px)`;
            }
 
            prevButton.addEventListener('click', function () {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });
 
            nextButton.addEventListener('click', function () {
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateCarousel();
                }
            });
        }
    }
});
 
document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript Loaded!");
 
    /*** 🔹 Highlight Active Navigation Link ***/
    const navLinks = document.querySelectorAll("nav a");
    const currentPage = window.location.pathname.split("/").pop();
 
    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPage || (currentPage === "" && link.getAttribute("href") === "index.html")) {
            link.classList.add("active");
        }
    });
 
    /*** 🔹 Carousel Slider ***/
    let slideIndex = 0;
    const slides = document.querySelectorAll(".slide");
    const totalSlides = slides.length;
    const slideContainer = document.querySelector(".slides");
 
    function showSlide(index) {
        if (!slideContainer) return;
        const newIndex = (index + totalSlides) % totalSlides;
        slideContainer.style.transform = `translateX(-${newIndex * 100}%)`;
        slideIndex = newIndex;
    }
 
    document.querySelector(".prev")?.addEventListener("click", () => showSlide(slideIndex - 1));
    document.querySelector(".next")?.addEventListener("click", () => showSlide(slideIndex + 1));
 
    setInterval(() => showSlide(slideIndex + 1), 3000);
 
    /*** 🔹 Flash Sale Countdown ***/
    function updateCountdown() {
        let countdownElement = document.getElementById('countdown');
        if (!countdownElement) return;
 
        let time = countdownElement.textContent.split(':');
        let hours = parseInt(time[0]);
        let minutes = parseInt(time[1]);
        let seconds = parseInt(time[2]);
 
        if (seconds > 0) {
            seconds--;
        } else {
            if (minutes > 0) {
                minutes--;
                seconds = 59;
            } else {
                if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                } else {
                    clearInterval(interval);
                    alert('Flash sale has ended!');
                    return;
                }
            }
        }
 
        countdownElement.textContent =
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
 
    let interval = setInterval(updateCountdown, 1000);
 
    document.querySelectorAll(".category").forEach(category => {
        category.addEventListener("click", () => {
            const categoryName = category.dataset.name; // Get the category name
            window.location.href = `/${categoryName}`; // Redirect to the corresponding page (e.g., /women, /men, etc.)
        });
    });
   
   
 
   
 
 
   
document.addEventListener('DOMContentLoaded', function () {
    const superDealsSection = document.getElementById('super-deals');
    if (superDealsSection) {
        const carouselContainer = superDealsSection.querySelector('.carousel-container');
        const prevButton = superDealsSection.querySelector('.prev');
        const nextButton = superDealsSection.querySelector('.next');
        const carouselItems = superDealsSection.querySelectorAll('.carousel-item');
 
        if (carouselContainer && prevButton && nextButton && carouselItems.length > 0) {
            let currentIndex = 0;
            const itemsPerView = 2; // Initially show Flash Sale + 1 product
            const itemWidth = carouselItems[0].offsetWidth + 20; // Add gap width
            const totalItems = carouselItems.length;
            const maxIndex = totalItems - itemsPerView; // Ensure last item is visible
 
            function updateCarousel() {
                const offset = -currentIndex * itemWidth;
                carouselContainer.style.transform = `translateX(${offset}px)`;
            }
 
            prevButton.addEventListener('click', function () {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });
 
            nextButton.addEventListener('click', function () {
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateCarousel();
                }
            });
 
            // Ensure correct starting position
            updateCarousel();
        }
    }
});
 
 
 
document.addEventListener('DOMContentLoaded', function () {
    const mostPopularSection = document.getElementById('top-products');
    if (mostPopularSection) {
        const carouselContainer = mostPopularSection.querySelector('.carousel-container');
        const prevButton = mostPopularSection.querySelector('.prev');
        const nextButton = mostPopularSection.querySelector('.next');
        const carouselItems = mostPopularSection.querySelectorAll('.carousel-item');
 
        if (carouselContainer && prevButton && nextButton && carouselItems.length > 0) {
            let currentIndex = 0;
            const itemsPerView = 3; // Number of items visible at once
            const totalItems = carouselItems.length;
            const itemWidth = carouselItems[0].offsetWidth;
            const maxIndex = Math.max(0, totalItems - itemsPerView); // Ensure last items are visible
 
            function updateCarousel() {
                const offset = -currentIndex * itemWidth;
                carouselContainer.style.transform = `translateX(${offset}px)`;
            }
 
            prevButton.addEventListener('click', function () {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });
 
            nextButton.addEventListener('click', function () {
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateCarousel();
                }
            });
        }
    }
});
 
document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript Loaded!");
 
    /*** 🔹 Highlight Active Navigation Link ***/
    const navLinks = document.querySelectorAll("nav a");
    const currentPage = window.location.pathname.split("/").pop();
 
    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPage || (currentPage === "" && link.getAttribute("href") === "index.html")) {
            link.classList.add("active");
        }
    });
 
    /*** 🔹 Carousel Slider ***/
    let slideIndex = 0;
    const slides = document.querySelectorAll(".slide");
    const totalSlides = slides.length;
    const slideContainer = document.querySelector(".slides");
 
    function showSlide(index) {
        if (!slideContainer) return;
        const newIndex = (index + totalSlides) % totalSlides;
        slideContainer.style.transform = `translateX(-${newIndex * 100}%)`;
        slideIndex = newIndex;
    }
 
    document.querySelector(".prev")?.addEventListener("click", () => showSlide(slideIndex - 1));
    document.querySelector(".next")?.addEventListener("click", () => showSlide(slideIndex + 1));
 
    setInterval(() => showSlide(slideIndex + 1), 3000);
 
    /*** 🔹 Flash Sale Countdown ***/
    function updateCountdown() {
        let countdownElement = document.getElementById('countdown');
        if (!countdownElement) return;
 
        let time = countdownElement.textContent.split(':');
        let hours = parseInt(time[0]);
        let minutes = parseInt(time[1]);
        let seconds = parseInt(time[2]);
 
        if (seconds > 0) {
            seconds--;
        } else {
            if (minutes > 0) {
                minutes--;
                seconds = 59;
            } else {
                if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                } else {
                    clearInterval(interval);
                    alert('Flash sale has ended!');
                    return;
                }
            }
        }
 
        countdownElement.textContent =
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
 
    let interval = setInterval(updateCountdown, 1000);
 
    document.querySelectorAll(".category").forEach(category => {
        category.addEventListener("click", () => {
            const categoryName = category.dataset.name; // Get the category name
            window.location.href = `/${categoryName}`; // Redirect to the corresponding page (e.g., /women, /men, etc.)
        });
    });
   
   
 
   
 
   
 
    /*** 🔹 Email Subscription ***/
    const subscribeButton = document.getElementById("subscribe-btn");
    const emailInput = document.getElementById("email");
    const feedbackContainer = document.getElementById("subscribe-feedback");
 
    if (subscribeButton && emailInput && feedbackContainer) {
        subscribeButton.addEventListener("click", function () {
            const email = emailInput.value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 
            feedbackContainer.innerHTML = ""; // Clear previous feedback
 
            if (emailPattern.test(email)) {
                feedbackContainer.innerHTML = "<p style='color: green;'>✅ Thank you for subscribing!</p>";
                emailInput.value = ''; // Clear the input
                console.log("Email Submitted: " + email);
            } else {
                feedbackContainer.innerHTML = "<p style='color: red;'>❌ Please enter a valid email address.</p>";
            }
        });
    } else {
        console.error("❌ Subscription elements are missing in the HTML.");
    }
 
    document.addEventListener("DOMContentLoaded", () => {
    // Select all anchor tags inside the footer section
    const links = document.querySelectorAll(".footer-section a");
 
    
 
    // Add event listener to each link
    links.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default anchor behavior
            const socialName = link.textContent.trim(); // Get link text
            if (socialLinks[socialName]) {
                window.open(socialLinks[socialName], "_blank"); // Open in new tab
            }
        });
    });
});
document.addEventListener("DOMContentLoaded", () => {
    // Select all anchor tags inside the footer section
    const links = document.querySelectorAll(".footer-section a");
 
    // Define social media links
    const socialLinks = {
        "Facebook": "#",
        "Instagram": "#",
        "LinkedIn": "#"
    };
 
    // Add event listener to each link
    links.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default anchor behavior
 
            const socialName = link.textContent.trim(); // Get the link text (e.g., "Facebook")
 
            if (socialLinks[socialName]) {
                window.open(socialLinks[socialName], "_blank"); // Open link in a new tab
            } else {
                console.error("No matching social media link found for:", socialName);
            }
        });
    });
});
 
document.querySelectorAll('.navbar a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        document.getElementById(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
 
// Highlight active link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav.main-navigation a');
 
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) { // Adjust offset as needed
            navLinks.forEach(link => link.classList.remove('active'));
            navLinks[index].classList.add('active');
        }
    });
});
document.addEventListener('DOMContentLoaded', function () {
    // Select ALL "BUY NOW" buttons
    const buyNowButtons = document.querySelectorAll('.buy-now');
 
    // Check if buttons are found
    if (buyNowButtons.length === 0) {
        console.error('No "BUY NOW" buttons found!');
        return;
    }
 
    // Add click event listener to each button
    buyNowButtons.forEach(button => {
        button.addEventListener('click', function () {
            console.log('BUY NOW button clicked!'); // Debugging log
            showToast('Product added to cart!'); // Show toast message
        });
    });
 
    // Function to show toast message
    function showToast(message) {
        // Create toast element
        let toast = document.createElement('div');
        toast.className = 'toast show';
        toast.innerText = message;
 
        // Append toast to the body
        document.body.appendChild(toast);
 
        // Remove toast after 2 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500); // Fade out animation
        }, 2000);
    }
});
});
 


/////////////
document.querySelectorAll('.navbar a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        document.getElementById(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
 
// Highlight active link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav.main-navigation a');
 
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) { // Adjust offset as needed
            navLinks.forEach(link => link.classList.remove('active'));
            navLinks[index].classList.add('active');
        }
    });
});
document.addEventListener('DOMContentLoaded', function () {
    // Select ALL "BUY NOW" buttons
    const buyNowButtons = document.querySelectorAll('.buy-now');
 
    // Check if buttons are found
    if (buyNowButtons.length === 0) {
        console.error('No "BUY NOW" buttons found!');
        return;
    }
 
    // Add click event listener to each button
    buyNowButtons.forEach(button => {
        button.addEventListener('click', function () {
            console.log('BUY NOW button clicked!'); // Debugging log
            showToast('Product added to cart!'); // Show toast message
        });
    });
 
    // Function to show toast message
    function showToast(message) {
        // Create toast element
        let toast = document.createElement('div');
        toast.className = 'toast show';
        toast.innerText = message;
 
        // Append toast to the body
        document.body.appendChild(toast);
 
        // Remove toast after 2 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500); // Fade out animation
        }, 2000);
    }
});
});
 
document.getElementById('logoutButton').addEventListener('click', function() {
    fetch('/logout', {
        method: 'GET',
        credentials: 'include' // Include session cookie
    }).then(response => {
        if (response.redirected) {
            window.location.href = response.url; // Redirect to login page
        }
    }).catch(error => {
        console.error('Logout failed:', error);
    });
});

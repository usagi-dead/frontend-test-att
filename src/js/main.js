import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import localeRu from 'air-datepicker/locale/ru';

const debounce = (func, delay = 150) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
};

const initDropdowns = () => {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach((dropdown) => {
        const btn = dropdown.querySelector('.dropdown__btn');
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdowns.forEach((d) => {
                if (d !== dropdown) d.classList.remove('is-open');
            });
            dropdown.classList.toggle('is-open');
        });
    });

    document.addEventListener('click', (e) => {
        dropdowns.forEach((dropdown) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('is-open');
            }
        });
    });
};

const initBurgerMenu = () => {
    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');
    const body = document.body;
    const navLinks = document.querySelectorAll('.header__link');

    if (!burger || !nav) return;

    const closeMenu = () => {
        burger.classList.remove('is-active');
        nav.classList.remove('is-active');
        body.style.overflow = '';
    };

    burger.addEventListener('click', () => {
        burger.classList.toggle('is-active');
        nav.classList.toggle('is-active');
        body.style.overflow = nav.classList.contains('is-active') ? 'hidden' : '';
    });

    navLinks.forEach((link) => link.addEventListener('click', closeMenu));
};

const initSmoothScroll = () => {
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    smoothScrollLinks.forEach((link) => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerOffset = 74;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });
};

const initFormAndCalendar = () => {
    const dateFromInput = document.getElementById('date-from');
    const dateToInput = document.getElementById('date-to');

    if (dateFromInput) {
        new AirDatepicker('#date-from', { locale: localeRu, autoClose: true, minDate: new Date() });
    }
    if (dateToInput) {
        new AirDatepicker('#date-to', { locale: localeRu, autoClose: true, minDate: new Date() });
    }

    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const dateFrom = document.getElementById('date-from').value;
            const dateTo = document.getElementById('date-to').value;
            const adults = document.getElementById('adults').value;
            const children = document.getElementById('children').value;

            if (!dateFrom) {
                alert('Пожалуйста, выберите начальную дату (Дата с)');
                return;
            }
            alert(
                `Поиск запущен!\nС ${dateFrom} по ${dateTo}\nВзрослых: ${adults}, Детей: ${children}`
            );
        });
    }
};

const initSlider = () => {
    const track = document.getElementById('reviews-track');
    const prevBtn = document.getElementById('reviews-prev');
    const nextBtn = document.getElementById('reviews-next');

    if (!track || !prevBtn || !nextBtn) return;

    let currentIndex = 0;

    const updateSlider = () => {
        const cards = track.querySelectorAll('.review-card');
        if (cards.length === 0) return;

        const isMobile = window.innerWidth <= 768;
        const visibleCards = isMobile ? 1 : 2;
        const maxIndex = Math.max(0, cards.length - visibleCards);

        if (currentIndex > maxIndex) currentIndex = maxIndex;

        const cardWidth = cards[0].offsetWidth;
        const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
        const slideDistance = cardWidth + gap;

        track.style.transform = `translateX(-${currentIndex * slideDistance}px)`;
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === maxIndex;
    };

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    nextBtn.addEventListener('click', () => {
        const cards = track.querySelectorAll('.review-card');
        const isMobile = window.innerWidth <= 768;
        const visibleCards = isMobile ? 1 : 2;
        const maxIndex = Math.max(0, cards.length - visibleCards);

        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        }
    });

    window.addEventListener('resize', debounce(updateSlider, 100));
    updateSlider();
};

const initReviewToggles = () => {
    const reviewToggles = document.querySelectorAll('.review-card__toggle');
    reviewToggles.forEach((toggle) => {
        toggle.addEventListener('click', function () {
            const card = this.closest('.review-card');
            card.classList.toggle('is-expanded');
            this.textContent = card.classList.contains('is-expanded') ? 'свернуть' : 'далее...';
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initDropdowns();
    initBurgerMenu();
    initSmoothScroll();
    initFormAndCalendar();
    initSlider();
    initReviewToggles();
});

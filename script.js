const track = document.querySelector('.cards-track');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const cards = document.querySelectorAll('.card');

function anyCardOpen() {
    return document.querySelector('.card.is-open') !== null;
}

cards.forEach(function (card) {
    const button = card.querySelector('.card-toggle');

    button.addEventListener('click', function (){
        const isOpen = card.classList.toggle('is-open');

        button.textContent = isOpen ? 'Less' : 'More';
        button.setAttribute('aria-expanded', isOpen);

        if (isOpen) {
            stopAuto();

            setTimeout(function() {
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
            }, 400);
        } else if (!anyCardOpen()) {
            startAuto();
        }
    });
});

function stepSize() {
    const card = document.querySelector('.card:not(.is-open)') || cards[0];
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return card.offsetWidth + gap;
}

function goNext() {
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
    if (atEnd) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
        track.scrollBy({ left: stepSize(), behavior: 'smooth' });
    }
}

function goPrev() {
    const atStart = track.scrollLeft <= 5;
    if (atStart) {
        track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
    } else {
        track.scrollBy({ left: -stepSize(), behavior: 'smooth' });
    }
}

nextBtn.addEventListener('click', function () {
    goNext();
    restartAuto();
});

prevBtn.addEventListener('click', function () {
    goPrev();
    restartAuto();
});

let timer = null;

// respektuje systémové nastavení "omezit animace"
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function startAuto() {
    if (reduceMotion || anyCardOpen()) return;
    stopAuto();
    timer = setInterval(goNext, 4000);
}

function stopAuto() {
    clearInterval(timer);
    timer = null;
}

function restartAuto() {
    stopAuto();
    startAuto();
}

track.addEventListener('mouseenter', stopAuto);
track.addEventListener('mouseleave', startAuto);

startAuto();


let highlightTimer = null;

document.querySelectorAll('.skill-ref').forEach(function (link) {
    link.addEventListener('click', function (event) {
        event.preventDefault();

        const card = document.querySelector(link.getAttribute('href'));
        const padding = parseFloat(getComputedStyle(track).paddingLeft) || 0;

        stopAuto();
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
        track.scrollTo({ left: card.offsetLeft - padding, behavior: 'smooth' });

        cards.forEach(function (other) {
            other.classList.remove('is-highlighted');
        });
        card.classList.add('is-highlighted');

        clearTimeout(highlightTimer);
        highlightTimer = setTimeout(function () {
            card.classList.remove('is-highlighted');
            startAuto();
        }, 3000);
    });
});

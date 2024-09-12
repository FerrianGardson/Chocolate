document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".carousel").forEach((carouselContainer) => {
    const rows = carouselContainer.querySelectorAll(".row");

    rows.forEach((carousel) => {
      // Кнопки и позиционные элементы
      const prevButtons = carouselContainer.querySelectorAll(
        ".carousel-button.left"
      );
      const nextButtons = carouselContainer.querySelectorAll(
        ".carousel-button.right"
      );
      const currentPositions =
        carouselContainer.querySelectorAll(".position .current");
      const totalPositions =
        carouselContainer.querySelectorAll(".position .total");
      const numbersContainer =
        carouselContainer.querySelector(".position.numbers");
      const bulletsContainer =
        carouselContainer.querySelector(".position.bullets");

      let cardWidth = carouselContainer.querySelector(".card").offsetWidth; // Ширина одной карточки
      let carouselWidth = carouselContainer.offsetWidth; // Ширина карусели
      let gap = parseInt(getComputedStyle(carousel).columnGap) || 0; // Расстояние между карточками
      let cardsPerView = Math.floor((carouselWidth + gap) / (cardWidth + gap)); // Количество карточек, видимых на экране
      const totalCards = carousel.querySelectorAll(".card").length; // Общее количество карточек

      let currentIndex = 0; // Индекс текущей видимой карточки

      // Функция для обновления карусели
      function updateCarousel() {
        // Расчёт смещения для показа нужных карточек
        const offset = -(currentIndex * (cardWidth + gap)); // Смещение в пикселях
        console.log("gap", gap);
        console.log("offset", offset);
        carousel.style.transform = `translateX(${offset}px)`; // Применение смещения

        const endIndex = Math.min(currentIndex + cardsPerView, totalCards); // Последняя видимая карточка
        currentPositions.forEach(
          (position) => (position.textContent = endIndex)
        );
        totalPositions.forEach(
          (position) => (position.textContent = totalCards)
        );

        // Обновляем позиционные кружки и номера
        updateBullets();
        updateNumbers();

        // Активация или деактивация кнопок
        prevButtons.forEach((button) => (button.disabled = currentIndex === 0));
        nextButtons.forEach(
          (button) => (button.disabled = endIndex >= totalCards)
        );
      }

      // Функция для обновления числового счётчика
      function updateNumbers() {
        if (numbersContainer) {
          // Обновление счётчика
          numbersContainer.querySelector(".current").textContent = Math.min(
            currentIndex + cardsPerView,
            totalCards
          );
          numbersContainer.querySelector(".total").textContent = totalCards;
        }
      }

      // Функция для обновления кружков (буллетов)
      function updateBullets() {
        if (bulletsContainer) {
          // Очистка старых кружков
          bulletsContainer.innerHTML = "";

          // Количество кружков, основанное на количестве "круток"
          const totalBullets = Math.ceil(totalCards / cardsPerView);

          for (let i = 0; i < totalBullets; i++) {
            const bullet = document.createElement("div");
            bullet.className =
              i === Math.floor(currentIndex / cardsPerView)
                ? "bullet active"
                : "bullet";

            bullet.addEventListener("click", () => {
              currentIndex = i * cardsPerView; // Переход к выбранной позиции
              updateCarousel();
            });

            bulletsContainer.appendChild(bullet);
          }
        }
      }

      // Функция для показа следующего набора карточек
      function showNextRow() {
        if (currentIndex + cardsPerView < totalCards) {
          currentIndex += cardsPerView; // Переход к следующему набору карточек
        } else {
          currentIndex = totalCards - cardsPerView; // Показать последнюю группу карточек
        }
        updateCarousel();
      }

      // Функция для показа предыдущего набора карточек
      function showPrevRow() {
        if (currentIndex > 0) {
          currentIndex -= cardsPerView; // Переход к предыдущему набору карточек
          if (currentIndex < 0) currentIndex = 0; // Убедиться, что индекс не становится отрицательным
          updateCarousel();
        }
      }

      // Привязка обработчиков событий к кнопкам
      nextButtons.forEach((button) =>
        button.addEventListener("click", showNextRow)
      );
      prevButtons.forEach((button) =>
        button.addEventListener("click", showPrevRow)
      );

      updateCarousel(); // Инициализация карусели

      // Обновление карусели при изменении размера окна
      window.addEventListener("resize", function () {
        cardWidth = carouselContainer.querySelector(".card").offsetWidth; // Обновление ширины карточки
        carouselWidth = carouselContainer.offsetWidth; // Обновление ширины карусели
        gap = parseInt(getComputedStyle(carousel).gap) || 0; // Обновление зазора между карточками
        cardsPerView = Math.floor((carouselWidth + gap) / (cardWidth + gap)); // Пересчёт видимых карточек
        const offset = -(currentIndex * (cardWidth + gap)); // Пересчёт смещения

        carousel.style.transition = "none"; // Отключаем анимацию
        carousel.style.transform = `translateX(${offset}px)`; // Применение нового смещения
        setTimeout(() => {
          carousel.style.transition = ""; // Включаем анимацию
        }, 0);

        updateCarousel();
      });







// Автоматическое перемещение вправо каждые 4 секунды только для каруселей с классом .cycled
if (carouselContainer.classList.contains("cycled")) {
  let autoScrollInterval;
  let pauseTimeout;

  // Функция для запуска автопрокрутки
  function startAutoScroll() {
    autoScrollInterval = setInterval(function () {
      // Проверка на конец карусели и возврат к началу
      if (currentIndex + cardsPerView < totalCards) {
        currentIndex += cardsPerView; // Переход к следующему набору карточек
      } else {
        currentIndex = 0; // Переход на первую карточку
      }
      updateCarousel();
    }, 4000);
  }

  // Функция для остановки автопрокрутки
  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
    clearTimeout(pauseTimeout); // Очистка предыдущего таймера паузы, если он был
    // Возобновляем автопрокрутку через 10 секунд после клика
    pauseTimeout = setTimeout(startAutoScroll, 10000);
  }

  // Инициализация автопрокрутки
  startAutoScroll();

  // Остановка автопрокрутки при клике по карточке или её содержимому
  const cards = carousel.querySelectorAll(".card");

  cards.forEach(card => {
    card.addEventListener("click", function() {
      stopAutoScroll(); // Приостанавливаем прокрутку на 10 секунд
    });
  });
}






// Привязка обработчиков к карточкам
const cards = carousel.querySelectorAll(".card");

cards.forEach(card => {
  card.addEventListener("click", function(event) {
    // Проверяем, что клик был непосредственно по самой карточке, а не по её содержимому
    if (event.target === event.currentTarget) {
      const cardRect = card.getBoundingClientRect();
      const clickX = event.clientX - cardRect.left;

      const leftBoundary = cardRect.width * 0.2;  // Левая 20% ширина
      const rightBoundary = cardRect.width * 0.8; // Правая 20% ширина

      if (clickX < leftBoundary) {
        // Клик по левой 20% части карточки — прокрутка влево
        showPrevRow();
      } else if (clickX > rightBoundary) {
        // Клик по правой 20% части карточки — прокрутка вправо
        showNextRow();
      }
    }
  });
});






    });
  });
});

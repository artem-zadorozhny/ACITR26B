const selectElement = document.getElementById('country-select');
const infoContainer = document.getElementById('country-info');

// Посилання на відкритий JSON-файл з усіма країнами світу через надійний CDN
const API_URL = 'https://jsdelivr.net';

let countriesList = [];

// 1. Асинхронне отримання списку країн
async function loadCountries() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Помилка HTTP: ${response.status}`);

        countriesList = await response.json();

        // Сортуємо країни за алфавітом
        countriesList.sort((a, b) => a.name.common.localeCompare(b.name.common));

        // Додаємо країни у випадаючий список
        countriesList.forEach(country => {
            const option = document.createElement('option');
            option.value = country.cca2; // Дволітерний код (наприклад, UA)
            option.textContent = country.name.common;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error('Помилка:', error);
        alert('Помилка завантаження: ' + error.message);
    }
}

// 2. Асинхронне отримання даних про обрану країну
async function getCountryDetails(countryCode) {
    if (!countryCode) {
        infoContainer.style.display = 'none';
        return;
    }

    try {
        // Імітуємо асинхронний запит до API (або беремо з отриманого масиву)
        const response = await fetch(API_URL);
        const allData = await response.json();
        const country = allData.find(c => c.cca2 === countryCode);

        if (!country) throw new Error('Країну не знайдено');

        // Основні параметри за завданням
        document.getElementById('country-name').textContent = country.name.common;
        document.getElementById('country-capital').textContent = (country.capital && country.capital.length > 0) 
            ? country.capital.join(', ') 
            : 'Немає даних';
        
        // Населення (якщо у базі вказано — форматуємо, інакше виводимо статус незалежності)
        document.getElementById('country-population').textContent = country.population 
            ? country.population.toLocaleString('uk-UA') 
            : (country.independent ? 'Незалежна держава' : 'Залежна територія');

        // 3 додаткові параметри на вибір (Регіон, Площа, Валюта)
        document.getElementById('country-region').textContent = `${country.region}${country.subregion ? ' (' + country.subregion + ')' : ''}`;
        document.getElementById('country-area').textContent = country.area ? country.area.toLocaleString('uk-UA') : 'Немає даних';

        const currencies = country.currencies
            ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol || ''})`).join(', ')
            : 'Немає даних';
        document.getElementById('country-currency').textContent = currencies;

        // Прапор із безкоштовного CDN по дволітерному коду країни
        const flagImg = document.getElementById('flag');
        flagImg.src = `https://flagcdn.com{countryCode.toLowerCase()}.png`;
        flagImg.alt = `Прапор ${country.name.common}`;
        flagImg.style.display = 'block';

        infoContainer.style.display = 'block';
    } catch (error) {
        console.error('Помилка:', error);
        alert('Помилка отримання даних: ' + error.message);
    }
}

selectElement.addEventListener('change', (event) => {
    getCountryDetails(event.target.value);
});

loadCountries();
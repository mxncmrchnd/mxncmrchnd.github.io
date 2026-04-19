const data = [
    {
        years: "2016 - 2018",
        title: "DUT Informatique",
        univ: "I.U.T. Reims-Châlons-Charleville",
        coords: [4.06206, 49.23992]
    },
    {
        years: "2018 - 2019",
        title: "Licence Professionnelle Médias Numériques Associés aux Technologies de l'Image et du Son",
        univ: "I.U.T. Reims-Châlons-Charleville",
        coords: [4.06206, 49.23992]
    },
    {
        years: "2019 - 2020",
        title: "Licence d'Informatique",
        univ: "Université de Reims Champagne-Ardenne",
        coords: [4.06236, 49.24426]
    },
    {
        years: "2021 - 2024",
        title: "Licence de Géographie et d'Aménagement",
        univ: "Université de Reims Champagne-Ardenne",
        coords: [4.00017, 49.23744]
    },
    {
        years: "2024 - 2026",
        title: "Master Observation de la Terre et Géomatique",
        univ: "Université de Strasbourg",
        coords: [7.77159, 48.58428]
    }
];

let currentIndex = 0;

const map = new maplibregl.Map({
    container: 'education_map',
    style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    center: data[0].coords,
    zoom: 12,
    interactive: false
});

function showPoint(index) {
    currentIndex = index;
    const d = data[currentIndex];

    // Update circle source
    map.getSource('education-point').setData({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: d.coords
        }
    });

    // Fly to point
    map.flyTo({ center: d.coords, zoom: 12, duration: 1200 });

    // Update panel
    const panel = document.getElementById('education_panel');
    panel.querySelector('.edu-years').textContent = d.years;
    panel.querySelector('.edu-title').textContent = d.title;
    panel.querySelector('.edu-univ').textContent = d.univ;
    panel.querySelector('.edu-counter').textContent = `${currentIndex + 1} / ${data.length}`;

    // Update button states
    panel.querySelector('.edu-prev').disabled = currentIndex === 0;
    panel.querySelector('.edu-next').disabled = currentIndex === data.length - 1;
}

map.on('load', () => {
    // Add GeoJSON source with first point
    map.addSource('education-point', {
        type: 'geojson',
        data: {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: data[0].coords
            }
        }
    });

    // Add circle layer
    map.addLayer({
        id: 'education-circle',
        type: 'circle',
        source: 'education-point',
        paint: {
            'circle-radius': 10,
            'circle-color': '#0a2a66',
            'circle-opacity': 0.8,
            'circle-stroke-width': 3,
            'circle-stroke-color': '#ffffff'
        }
    });

    // Build panel content
    const panel = document.getElementById('education_panel');
    panel.innerHTML = `
        <span class="edu-counter"></span>
        <h2 class="edu-title"></h2>
        <p class="edu-univ"></p>
        <p class="edu-years"></p>
        <div class="edu-nav">
            <button class="edu-prev" onclick="showPoint(currentIndex - 1)">❮ Précédent</button>
            <button class="edu-next" onclick="showPoint(currentIndex + 1)">Suivant ❯</button>
        </div>
    `;

    // Show first point
    showPoint(0);
});
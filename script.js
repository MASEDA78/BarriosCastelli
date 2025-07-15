document.addEventListener("DOMContentLoaded", function () {
  const map = L.map('map').setView([-36.0972, -57.8016], 14);

  const capaMapa = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const capaSatelital = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
  });

  const personaIcono = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });

  var barrios = [
  { nombre: "B. La Esmeralda", coords: [-36.090277, -57.796444], color: "darkred" },
  { nombre: "B. La Esperanza", coords: [-36.086069, -57.810999], color: "gray" },
  { nombre: "B. Solidaridad I", coords: [-36.082830, -57.809431], color: "lightblue" },
  { nombre: "B. Nicholls", coords: [-36.084576, -57.802298], color: "purple" },
  { nombre: "B. de Oro", coords: [-36.088907, -57.796926], color: "darkblue" },
  { nombre: "B. Procasa I", coords: [-36.084702, -57.800921], color: "pink" },
  { nombre: "B. Procasa II", coords: [-36.083536, -57.801525], color: "deeppink" },
  { nombre: "B. Procasa III", coords: [-36.084600, -57.808030], color: "mediumpurple" },
  { nombre: "B. Procasa IV", coords: [-36.087624, -57.798955], color: "lightblue" },
  { nombre: "B. Procasa V", coords: [-36.085932, -57.800002], color: "lightpink" },
  { nombre: "B. Procasa VI", coords: [-36.085172, -57.800396], color: "green" },
  { nombre: "B. 17 de Octubre", coords: [-36.081678, -57.808328], color: "lightgreen" },
  { nombre: "B. Abuelos", coords: [-36.083406, -57.808316], color: "yellow" },
  { nombre: "B. Autoconstrucción", coords: [-36.084057, -57.810128], color: "orange" },
  { nombre: "B. Fonavi", coords: [-36.086839, -57.806957], color: "saddlebrown" },
  { nombre: "B. Ley 9104", coords: [-36.084877, -57.808928], color: "darkgreen" },
  { nombre: "B. Matadero", coords: [-36.080156, -57.809157], color: "red" },
  { nombre: "B. Novios", coords: [-36.083041, -57.807863], color: "khaki" },
  { nombre: "B. Las Ranas", coords: [-36.084133, -57.799397], color: "black" },
  { nombre: "B. Solidaridad II", coords: [-36.081671, -57.809923], color: "firebrick" },
  { nombre: "B. San José", coords: [-36.093492, -57.799257], color: "seagreen" },
  { nombre: "B. Mejías", coords: [-36.097224, -57.809515], color: "gray" },
  { nombre: "B. Manzanares", coords: [-36.086843, -57.813082], color: "gold" },
  { nombre: "B. Pérez", coords: [-36.096793, -57.807634], color: "lightblue" },
  { nombre: "B. Py M", coords: [-36.085570, -57.809270], color: "palegreen" },
  { nombre: "B. Obrero", coords: [-36.087003, -57.808453], color: "plum" },
  { nombre: "B. Autogestión Cons.", coords: [-36.086955, -57.799361], color: "lightgreen" },
  { nombre: "B. Raúl R. Alfonsín", coords: [-36.085941, -57.798433], color: "indigo" },
  { nombre: "B. Procrear II", coords: [-36.098535, -57.805680], color: "darkgreen" },
  { nombre: "B. Favaloro", coords: [-36.084865, -57.811720], color: "springgreen" },
  { nombre: "B. Policía", coords: [-36.082510, -57.805787], color: "lightblue" },
  { nombre: "B. Eva Perón", coords: [-36.082502, -57.807739], color: "black" },
  { nombre: "B. Carlos Zocchi", coords: [-36.097096, -57.801468], color: "red" },
  { nombre: "B. Ganadera", coords: [-36.085269, -57.805787], color: "mediumorchid" }
];

  const barrioSelect = document.getElementById("barrioSelect");
  const nombreInput = document.getElementById("nombreUsuario");
  const botonCompartir = document.getElementById("btnCompartir");
  const lista = document.getElementById("listaUbicaciones");

  barrios.forEach(barrio => {
    const option = document.createElement("option");
    option.value = JSON.stringify(barrio.coords);
    option.textContent = barrio.nombre;
    barrioSelect.appendChild(option);

    L.circleMarker(barrio.coords, {
      radius: 10,
      fillColor: barrio.color,
      color: barrio.color,
      fillOpacity: 0.6
    }).addTo(map)
      .bindTooltip(barrio.nombre, { permanent: true, direction: "top" });
  });

  window.centrarBarrio = function () {
    const selectedValue = barrioSelect.value;
    if (selectedValue) {
      const coords = JSON.parse(selectedValue);
      map.setView(coords, 16);
      botonCompartir.style.display = "inline-block";
    } else {
      botonCompartir.style.display = "none";
    }
  };

  window.cambiarVista = function () {
    if (map.hasLayer(capaMapa)) {
      map.removeLayer(capaMapa);
      capaSatelital.addTo(map);
    } else {
      map.removeLayer(capaSatelital);
      capaMapa.addTo(map);
    }
  };

  window.miUbicacion = function () {
    if (!navigator.geolocation) {
      alert("La geolocalización no está disponible en este navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        L.marker([lat, lng]).addTo(map)
          .bindPopup("📍 Estás aquí").openPopup();

        map.setView([lat, lng], 16);
      },
      function () {
        alert("No se pudo obtener tu ubicación.");
      }
    );
  };

  window.compartirUbicacion = function () {
    const selectedIndex = barrioSelect.selectedIndex;
    if (selectedIndex <= 0) return;

    const nombreUsuario = nombreInput.value.trim() || "Vecino";
    const barrio = barrios[selectedIndex - 1];
    const nombreBarrio = barrio.nombre;
    const coords = barrio.coords;

    const mensaje = `👤 ${nombreUsuario} compartió la ubicación del ${nombreBarrio} en Castelli:\nhttps://www.google.com/maps?q=${coords[0]},${coords[1]}`;
    const urlWhatsApp = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsApp, '_blank');

    // Mostrar en el mapa
    L.marker(coords, { icon: personaIcono }).addTo(map)
      .bindPopup(`👤 ${nombreUsuario}<br>📍 ${nombreBarrio}`).openPopup();

    // Agregar al historial
    const item = document.createElement("li");
    item.textContent = `${nombreUsuario} → ${nombreBarrio}`;
    lista.appendChild(item);
  };
});
import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import './Map.css';

const geoUrl = "https://raw.githubusercontent.com/lotusms/world-map-data/main/world.json";

function MapPage() {
  const { searchResult, setSearchResult } = useOutletContext();
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [info, setInfo] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  // Имитация данных об урбанизации (в реальном проекте можно заменить на JSON или API)
  const getUrbanizationStyle = (geoName) => {
    // Просто для примера: распределяем цвета по длине названия или первой букве
    // В будущем здесь будет проверка по базе данных
    const hash = geoName.length % 3;
    if (hash === 0) return "#ff4d4d"; // Высокая (Красный)
    if (hash === 1) return "#ffcc00"; // Средняя (Желтый)
    return "#66bb6a"; // Низкая (Зеленый)
  };

  useEffect(() => {
    if (searchResult) {
      setPosition({
        coordinates: searchResult.coordinates,
        zoom: searchResult.type === "city" ? 8 : 2.5
      });
      setInfo(searchResult);
      setIsExpanded(false);
    }
  }, [searchResult]);

  const getPlaceDetails = async (lon, lat) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lon=${lon}&lat=${lat}&addressdetails=1&accept-language=ru`
      );
      const data = await response.json();
      if (data && data.address) {
        const addr = data.address;
        const isCity = addr.city || addr.town || addr.village || addr.hamlet;
        
        // Находим название страны для корректной подсветки
        const countryName = addr.country;

        const newPlace = {
          name: isCity || countryName || "Место без названия",
          fullName: data.display_name,
          coordinates: [lon, lat],
          type: isCity ? "city" : "country",
          country: countryName,
          details: addr
        };
        
        setSearchResult(newPlace);
        setInfo(newPlace);
        setIsExpanded(false);
      }
    } catch (e) {
      console.error("Ошибка геокодинга", e);
    }
  };

  const handleZoomIn = () => setPosition(p => ({ ...p, zoom: p.zoom * 1.5 }));
  const handleZoomOut = () => setPosition(p => ({ ...p, zoom: p.zoom / 1.5 }));

  // Проверка: является ли текущая страна выбранной (через поиск или клик)
  const isSelected = (geo) => {
    if (!searchResult) return false;
    const geoName = geo.properties.name || geo.properties.NAME;
    return (
      geoName?.toLowerCase() === searchResult.country?.toLowerCase() ||
      geoName?.toLowerCase() === searchResult.name?.toLowerCase()
    );
  };

  return (
    <div className="map-screen">
      {info && (
        <div className={`info-panel animate-slide ${isExpanded ? "expanded" : "mini"}`}>
          <button className="close-panel" onClick={() => {setInfo(null); setSearchResult(null);}}>×</button>
          <div className="info-content">
            <span className="type-badge">{info.type === "city" ? "🏙 Город" : "🌍 Страна"}</span>
            <h2>{info.name}</h2>
            {!isExpanded ? (
              <button className="explore-btn" onClick={() => navigate('/details', { state: { info } })}>
                Исследовать {info.type === "city" ? "место" : "страну"}
              </button>
            ) : (
              <div className="details-area">
                <p><strong>Полный адрес:</strong> {info.fullName}</p>
                {info.details.state && <p><strong>Регион:</strong> {info.details.state}</p>}
                <p><strong>Координаты:</strong> {info.coordinates[1].toFixed(4)}, {info.coordinates[0].toFixed(4)}</p>
                <button className="explore-btn" onClick={() => setIsExpanded(false)}>Свернуть</button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="zoom-bar">
        <button onClick={handleZoomIn}>+</button>
        <button onClick={handleZoomOut}>-</button>
      </div>

      {/* Легенда цветов */}
      <div className="map-legend">
        <div><span className="dot red"></span> Высокая урбанизация</div>
        <div><span className="dot yellow"></span> Средняя</div>
        <div><span className="dot green"></span> Низкая</div>
      </div>

      <ComposableMap projectionConfig={{ scale: 145 }} style={{ width: "100%", height: "100%", cursor: "grab" }}>
        <ZoomableGroup zoom={position.zoom} center={position.coordinates} onMoveEnd={setPosition}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const geoName = geo.properties.name || geo.properties.NAME;
                const active = isSelected(geo);
                const urbColor = getUrbanizationStyle(geoName);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={(e) => {
                      const { lng, lat } = e;
                      getPlaceDetails(lng, lat);
                    }}
                    style={{
                      default: { 
                        fill: active ? "#4A90E2" : urbColor, // Если выбрана — синяя, иначе по уровню урбанизации
                        fillOpacity: active ? 1 : 0.6,
                        outline: "none", 
                        stroke: "#fff", 
                        strokeWidth: 0.5 
                      },
                      hover: { fill: "#4A90E2", fillOpacity: 1, cursor: "pointer", outline: "none" },
                      pressed: { fill: "#eca406", outline: "none" }
                    }}
                  />
                );
              })
            }
          </Geographies>

          {searchResult && searchResult.type === "city" && (
            <Marker coordinates={searchResult.coordinates}>
              <circle r={6 / (position.zoom / 2)} fill="#ef4444" stroke="#fff" strokeWidth={2} />
            </Marker>
          )}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}

export default MapPage;
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

  const getUrbanizationStyle = (geoName) => {
    const hash = geoName ? geoName.length % 3 : 0;
    if (hash === 0) return "#ff4d4d"; 
    if (hash === 1) return "#ffcc00"; 
    return "#66bb6a"; 
  };

  // Синхронизация: когда searchResult меняется (поиск или клик), обновляем инфо и камеру
  useEffect(() => {
    if (searchResult) {
      setPosition({
        coordinates: searchResult.coordinates,
        zoom: searchResult.type === "city" ? 8 : 3
      });
      setInfo(searchResult);
      setIsExpanded(false);
    }
  }, [searchResult]);

  // Функция получения данных при клике (Обратный геокодинг на РУССКОМ)
  const handleMapClick = async (lon, lat) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lon=${lon}&lat=${lat}&addressdetails=1&accept-language=ru`
      );
      const data = await response.json();
      
      if (data && data.address) {
        const addr = data.address;
        const city = addr.city || addr.town || addr.village || addr.hamlet || addr.state;
        const country = addr.country;

        const newPlace = {
          name: city || country || "Неизвестное место",
          fullName: data.display_name,
          coordinates: [lon, lat],
          type: (addr.city || addr.town || addr.village) ? "city" : "country",
          country: country,
          details: addr
        };
        
        // Это обновит всё приложение и откроет панель
        setSearchResult(newPlace);
      }
    } catch (e) {
      console.error("Ошибка геокодинга:", e);
    }
  };

  const isSelected = (geo) => {
    if (!searchResult) return false;
    const geoName = geo.properties.name || geo.properties.NAME;
    const geoNameRU = geo.properties.name_ru; // Если в json есть ру-названия
    
    return (
      geoName?.toLowerCase() === searchResult.country?.toLowerCase() ||
      geoName?.toLowerCase() === searchResult.name?.toLowerCase() ||
      geoNameRU?.toLowerCase() === searchResult.name?.toLowerCase()
    );
  };

  return (
    <div className="map-screen">
      {info && (
        <div className={`info-panel animate-slide ${isExpanded ? "expanded" : "mini"}`}>
          <button className="close-panel" onClick={() => {setInfo(null); setSearchResult(null);}}>×</button>
          <div className="info-content">
            <span className="type-badge">{info.type === "city" ? "🏙 Место" : "🌍 Страна"}</span>
            <h2>{info.name}</h2>
            {!isExpanded ? (
              <button className="explore-btn" onClick={() => navigate('/details', { state: { info } })}>
                Исследовать
              </button>
            ) : (
              <div className="details-area">
                <p><strong>Адрес:</strong> {info.fullName}</p>
                <button className="explore-btn" onClick={() => setIsExpanded(false)}>Свернуть</button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="zoom-bar">
        <button onClick={() => setPosition(p => ({ ...p, zoom: Math.min(p.zoom * 1.5, 12) }))}>+</button>
        <button onClick={() => setPosition(p => ({ ...p, zoom: Math.max(p.zoom / 1.5, 1) }))}>-</button>
      </div>

      <div className="map-legend">
        <div><span className="dot red"></span> Высокая</div>
        <div><span className="dot yellow"></span> Средняя</div>
        <div><span className="dot green"></span> Низкая</div>
      </div>

      <ComposableMap 
        projectionConfig={{ scale: 145 }} 
        style={{ width: "100%", height: "100%", background: "#f5f7fa" }}
      >
        <ZoomableGroup 
          zoom={position.zoom} 
          center={position.coordinates} 
          onMoveEnd={setPosition}
          minZoom={1}
          maxZoom={12}
          translateExtent={[[-20, -20], [820, 620]]}
        >
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
                      // Получаем координаты клика из события
                      const { lng, lat } = e; 
                      handleMapClick(lng, lat);
                    }}
                    style={{
                      default: { 
                        fill: active ? "#4A90E2" : urbColor,
                        fillOpacity: active ? 1 : 0.7,
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

          {searchResult && (
            <Marker coordinates={searchResult.coordinates}>
              <circle r={5 / (position.zoom / 1.5)} fill="#ef4444" stroke="#fff" strokeWidth={2} />
            </Marker>
          )}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}

export default MapPage;
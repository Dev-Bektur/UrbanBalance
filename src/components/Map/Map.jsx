import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import './Map.css'

const geoUrl = "https://raw.githubusercontent.com/lotusms/world-map-data/main/world.json";

function MapPage() {
  const { searchResult, setSearchResult } = useOutletContext();
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [info, setInfo] = useState(null); // Данные о месте
  const [isExpanded, setIsExpanded] = useState(false); // Развернуто ли окно

  // Синхронизация с поиском из Хедера
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

  // Функция получения данных по координатам (Клик)
  const getPlaceDetails = async (lon, lat) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lon=${lon}&lat=${lat}&addressdetails=1&accept-language=ru`
      );
      const data = await response.json();
      if (data && data.address) {
        const addr = data.address;
        const isCity = addr.city || addr.town || addr.village || addr.hamlet;
        const newPlace = {
          name: isCity || addr.country || "Место без названия",
          fullName: data.display_name,
          coordinates: [lon, lat],
          type: isCity ? "city" : "country",
          country: addr.country,
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

  // Обработка кнопок масштаба
  const handleZoomIn = () => setPosition(p => ({ ...p, zoom: p.zoom * 1.5 }));
  const handleZoomOut = () => setPosition(p => ({ ...p, zoom: p.zoom / 1.5 }));

  const isThisCountry = (geoName) => {
    if (!searchResult || searchResult.type !== "country") return false;
    return geoName?.toLowerCase() === searchResult.name?.toLowerCase() || 
           geoName?.toLowerCase() === searchResult.country?.toLowerCase();
  };

  return (
    <div className="map-screen" style={{ position: "relative", width: "100%", height: "90vh", background: "#f0f2f5" }}>
      
      {/* ЛЕВЫЙ ВЕРХНИЙ БЛОК ИНФОРМАЦИИ */}
      {info && (
        <div className={`info-panel ${isExpanded ? "expanded" : "mini"}`}>
          <button className="close-panel" onClick={() => setInfo(null)}>×</button>
          
          <div className="info-content">
            <span className="type-badge">{info.type === "city" ? "🏙 Город" : "🌍 Страна"}</span>
            <h2>{info.name}</h2>
            
            {!isExpanded ? (
              <button className="explore-btn" onClick={() => setIsExpanded(true)}>
                Исследовать {info.type === "city" ? "место" : "страну"}
              </button>
            ) : (
              <div className="details-area">
                <p><strong>Полный адрес:</strong> {info.fullName}</p>
                {info.details.state && <p><strong>Регион:</strong> {info.details.state}</p>}
                {info.details.postcode && <p><strong>Индекс:</strong> {info.details.postcode}</p>}
                <p><strong>Координаты:</strong> {info.coordinates[1].toFixed(4)}, {info.coordinates[0].toFixed(4)}</p>
                <button className="explore-btn" onClick={() => setIsExpanded(false)}>Свернуть</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* КНОПКИ МАСШТАБА (Справа внизу) */}
      <div className="zoom-bar">
        <button onClick={handleZoomIn}>+</button>
        <button onClick={handleZoomOut}>-</button>
      </div>

      <ComposableMap projectionConfig={{ scale: 145 }} style={{ width: "100%", height: "100%" }}>
        <ZoomableGroup 
          zoom={position.zoom} 
          center={position.coordinates} 
          onMoveEnd={setPosition}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const geoName = geo.properties.name || geo.properties.NAME;
                const active = isThisCountry(geoName);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    // КЛИК ПО СТРАНЕ
                    onClick={(e) => {
                      const { lng, lat } = e; // Библиотека передает координаты в объект клика
                      getPlaceDetails(lng, lat);
                    }}
                    style={{
                      default: { fill: active ? "#FFD700" : "#d1d5db", outline: "none", stroke: "#fff", strokeWidth: 0.5 },
                      hover: { fill: "#4A90E2", cursor: "pointer", outline: "none" },
                      pressed: { fill: "#FFD700", outline: "none" }
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
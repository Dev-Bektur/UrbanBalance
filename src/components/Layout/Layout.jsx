import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import { toast, ToastContainer } from "react-toastify";
import Footer from '../Footer/Footer'

function Layout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      // Запрашиваем данные с деталями адреса и английским языком для стабильности имен
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1&accept-language=en`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const place = data[0];
        const { address, type, class: placeClass } = place;

        // Логика определения: Страна это или Город
        // Если в типе или классе есть 'country' или 'boundary', считаем страной
        const isCountry = type === "country" || placeClass === "boundary" || !address.city && !address.town && !address.village;

        setSearchResult({
          name: isCountry ? (address.country || place.display_name.split(',')[0]) : (address.city || address.town || address.village || place.display_name.split(',')[0]),
          coordinates: [parseFloat(place.lon), parseFloat(place.lat)],
          type: isCountry ? "country" : "city",
          // Дополнительные варианты имен для сопоставления с картой
          alternativeNames: [
            address.country,
            place.display_name.split(',')[0],
            address["ISO3166-2-lvl4"] // Код региона (иногда помогает)
          ].filter(Boolean)
        });

        toast.success(`Найдено: ${place.display_name.split(',')[0]}`);
      } else {
        toast.error("Место не найдено");
      }
    } catch (error) {
      toast.error("Ошибка при поиске");
    }
  };

  return (
    <div>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch} />
      <main>
<Outlet context={{ searchResult, setSearchResult }} />
      </main>
      <ToastContainer position="bottom-right" />
      <Footer/>
    </div>
  );
}

export default Layout;  
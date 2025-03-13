"use client";
import SearchComponent from "@/components/searchComponent";
import style from "./search.module.css";
import apiService from "@/services/apiService";
import { useEffect, useState } from "react";
import {
  AdjustmentsHorizontalIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import React from "react";
import { useRouter } from "next/navigation";
export default function SearchPage() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [menuFormData, setMenuFormData] = useState<{ name: string; maxPrice: number; ratings: number[]; includeUnclassified: boolean }>({ name: "", maxPrice: 600, ratings: [], includeUnclassified: false  });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function fetchHotels() {
      const data = await apiService.getHotels();
      setHotels(data);
      setIsLoading(false);
    }
    fetchHotels();
  }, []);

  const clearFilters = () => {
    setMenuFormData({ name: "", maxPrice: 600, ratings: [], includeUnclassified: false });
  }
  const handleMaxPriceChange = (event: any) => {
    setMenuFormData((prevData: any) => ({
      ...prevData,
      maxPrice: Number(event?.target.value),
    }));
  };

  const menuClickHandle = () => {
    setIsOpen(!isOpen);
  };

  const handleRatingChange = (event: any) => {
    const rating = Number(event.target.value); 
    setMenuFormData((prev: any) => {
      const isSelected = prev.ratings.includes(rating);
      
      return {
        ...prev,
        ratings: isSelected
          ? prev.ratings.filter((r: any) => r !== rating) 
          : [...prev.ratings, rating] 
      };
    });
  }
  const getHotelCountByRating = (rating: number | undefined) => {
    return hotels.filter((h) => h.hotel.stars === rating).length;
  };
  const filteredHotels = hotels.filter(hotel => {
    const meetsNameCriteria = hotel.hotel.name.toLowerCase().includes(menuFormData.name.toLowerCase());

    const meetsRatingCriteria = menuFormData.ratings.length === 0 || (hotel.hotel.stars !== undefined && menuFormData.ratings.includes(hotel.hotel.stars));

    const meetsUnratedCriteria = menuFormData.includeUnclassified && hotel.hotel.stars == undefined;
    
    const meetsPriceCriteria = hotel.lowestPrice.amount <= menuFormData.maxPrice;
  
    return meetsNameCriteria && (meetsRatingCriteria || meetsUnratedCriteria) && meetsPriceCriteria;
  });

  const goToHotel = (id: number) => {
    router.push(`/hotel/${id}`)    
  }
  return (
    <div className={style.main}>
      <SearchComponent />
      <div className={style.infoRow}>
        <div className={style.info}>
          <h3>
            <strong>São Paulo, </strong>Brasil
          </h3>
          <span>102 hoteis encontrados</span>
        </div>

        <div className={style.sort} onClick={menuClickHandle}>
          <AdjustmentsHorizontalIcon className={style.icon} />
        </div>
        <div
          className={style.menu}
          style={{ display: isOpen ? "block" : "none" }}
        >
          <div className={style.menuTop}>
            Filtros
            <div className={style.menuClear} onClick={clearFilters}>
              <TrashIcon className={`${style.icon} ${style.trash}`} />
              Limpar filtros
            </div>
          </div>
          <div className={style.menuSection}>
            Hotel
            <input
              type="text"
              name="hotelName"
              id="hotelName"
              placeholder="Nome do hotel"
              value={menuFormData.name}
              onChange={(e) => setMenuFormData({ ...menuFormData, name: e.target.value })}
            />
          </div>
          <div className={style.menuSection}>
            Preço
            <div className={style.prices}>
              <span>R$ 0,00</span>
              <span>-</span>
              <span>R${menuFormData.maxPrice},00</span>
            </div>
            <input
              type="range"
              name="menuPrice"
              id="menuPrice"
              max="1200"
              value={menuFormData.maxPrice}
              onChange={handleMaxPriceChange}
            />
          </div>
          <div className={style.menuSection} style={{ borderBottom: "none" }}>
            Estrelas
            <div className={style.menuStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <div className={style.menuStar} key={`div${star}`}>
                  <div className={style.starCheckbox}>
                    <input
                      name={`star-${star}`}
                      id={`star-${star}`}
                      type="checkbox"
                      value={star}
                      checked={menuFormData.ratings.includes(star)}
                      onChange={handleRatingChange}
                      key={star}
                    />
                    <label htmlFor={`star-${star}`}>{star} estrela{star > 1? 's': ''}</label>
                  </div>
                  {getHotelCountByRating(star)}
                </div>
              ))}
              <div className={style.menuStar}>
                <div className={style.starCheckbox}>
                  <input type="checkbox" name="unclassified" id="unclassified" checked={menuFormData.includeUnclassified} onChange={(e) => setMenuFormData({ ...menuFormData, includeUnclassified: e.target.checked })}/>
                  <label htmlFor="unclassified">Não classificado</label>
                </div>
                {getHotelCountByRating(undefined)}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className={style.loading}>Carregando...</div>
      ) : filteredHotels.length > 0 ? (
        <div className={style.hotels}>
          {filteredHotels.map((hotel) => (
            <div key={hotel.id} className={style.hotel}>
              <div
                style={{ backgroundImage: `url(${hotel.hotel.image})` }}
                className={style.hotelImage}
              >
                R$ {hotel.lowestPrice.amount}
              </div>
              <div className={style.hotelInfo}>
                <h3>{hotel.hotel.name}</h3>
                <div className={style.hotelBottom}>
                  <div className={style.stars}>
                    {Array.from({ length: hotel.hotel.stars }, (_, index) => (
                      <StarIcon key={index} className={style.star} />
                    ))}
                  </div>

                  <button type="button" onClick={ () => goToHotel(hotel.id)}>Ver Mais</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : <div className={style.loading}>Nenhum hotel disponível</div>}
    </div>
  );
}

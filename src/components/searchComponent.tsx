"use client";
import apiService from "@/services/apiService";
import { useEffect, useState } from "react";
import {
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useRouter, usePathname } from "next/navigation";
import style from "./searchComponent.module.css";
import { useSearch } from "@/context/SearchContext";

export default function SearchComponent() {

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); 
  const todayFormatted = today.toISOString().split('T')[0];
  const tomorrowFormatted = tomorrow.toISOString().split('T')[0];

  const { formData, setFormData } = useSearch();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();


  const onOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });    
  };
  
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    if (checkOutDate <= checkInDate) {
      alert("A data de saída (checkOut) deve ser posterior à data de entrada (checkIn).");
      return;
    }
    if (pathname !== "/search") {
      const queryParams = new URLSearchParams({
        ...formData,
        rooms: formData.rooms.toString(),
        adults: formData.adults.toString(),
        children: formData.children.toString(),
      }).toString();
      router.push("/search");
    }
  };

  const calculateMinCheckOut = () => {
    const checkInDate = new Date(formData.checkIn);
    checkInDate.setDate(checkInDate.getDate() + 1); 
    return checkInDate.toISOString().split("T")[0]; 
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={style.container}>
        <div className={style.field}>
          <div className={style.label}>
            <MapPinIcon className={style.icon} />
            <span>Destino</span>
          </div>

          <input
            type="text"
            name="destiny"
            id="destiny"
            className={style.destinyInput}
            value={formData.destiny}
            onChange={handleChange}
            required
          />
        </div>
        <div className={style.field}>
          <div className={style.label}>
            <CalendarIcon className={style.icon} />
            <span>Entrada</span>
          </div>
          <input
            type="date"
            name="checkIn"
            id="checkIn"
            min={todayFormatted}
            className={`${style.destinyInput} ${style.dateInput}`}
            value={formData.checkIn}
            onChange={handleChange}
            onClick={(e: any) => ( e.target.showPicker())}
            required
            />
        </div>
        <div className={style.field}>
          <div className={style.label}>
            <CalendarIcon className={style.icon} />
            <span>Saída</span>
          </div>
          <input
            type="date"
            name="checkOut"
            id="checkOut"
            min={calculateMinCheckOut()}
            className={`${style.destinyInput} ${style.dateInput}`}
            value={formData.checkOut}
            onChange={handleChange}
            onClick={(e: any) => ( e.target.showPicker())}
            required
          />
        </div>
        <div className={`${style.field} ${style.lastField}`} onClick={onOpen}>
          <div className={style.label}>
            <UsersIcon className={style.icon} />
            <span>Hóspedes</span>
          </div>
          <span>
            {" "}
            {formData.adults} {formData.adults > 1 ? "Adultos" : "Adulto"}, {formData.rooms} Quarto{formData.rooms > 1 ? 's' : ''}
          </span>
        </div>
        <div
          className={style.menu}
          style={{ display: isOpen ? "block" : "none" }}
        >
          <div className={style.menuSection}>
            Adultos
            <div className={style.numberSelect}>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, adults: Math.max(formData.adults - 1, 1) })
                }
              >
                -
              </button>
              {formData.adults}
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, adults: Math.max(formData.adults + 1, 1) })
                }
              >
                +
              </button>
            </div>
          </div>
          <div className={style.menuSection}>
            Crianças
            <div className={style.numberSelect}>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, children: Math.max(formData.children - 1, 0) })
                }
              >
                -
              </button>
              {formData.children}
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, children: Math.max(formData.children + 1, 0) })
                }
              >
                +
              </button>
            </div>
          </div>
          <div className={style.buttonSection}>
            <button type="button" onClick={onOpen}>
              Aplicar
            </button>
          </div>
        </div>
        <div className={style.buttonField}>
          <button type="submit">Pesquisar</button>
        </div>
      </div>
    </form>
  );
}

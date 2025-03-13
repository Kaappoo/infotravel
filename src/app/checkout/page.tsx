"use client";

import { useRouter, useSearchParams } from "next/navigation";
import apiService from "@/services/apiService";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useSearch } from "@/context/SearchContext";

import style from "./checkout.module.css";
import { FormEvent, useEffect, useState } from "react";
export default function Checkout() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hotelId = searchParams.get("hotelId");
  const roomIndex = searchParams.get("roomIndex");

  const [hotelData, setHotelData] = useState<any>(null);
  const { formData, setFormData } = useSearch();
  const [guestFormData, setGuestFormData] = useState<any>({
    guestName: "",
    guestSurname: "",
    contactName: "",
    email: "",
    phone: "",
    obs: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    async function checkParamsAndFetch() {
      if (!hotelId || !roomIndex) {
        router.push("/");
      }
      const data = await apiService.getHotelById(Number(hotelId));
      setHotelData(data);
      setIsLoading(false);
    }
    checkParamsAndFetch();
  }, []);

  function calculateNumberOfDays() {
    const d1 = new Date(formData.checkIn);
    const d2 = new Date(formData.checkOut);
    const milissecondsDiff = Math.abs(d2.getTime() - d1.getTime());
    const daysDiff = Math.ceil(milissecondsDiff / (1000 * 60 * 60 * 24));
    return daysDiff;
  }

  const calculateTotalValue = () => {
    const TAX = 1.03;
    const nightCost = hotelData.rooms[Number(roomIndex)].price.amount;
    const nightsSum = nightCost * calculateNumberOfDays();
    return (nightsSum * formData.rooms * TAX).toFixed(2);
  };
  
  const calculateTotalTaxes = () => {
    const TAX = 1.03;
    const nightCost = hotelData.rooms[Number(roomIndex)].price.amount;
    const nightsSum = nightCost * calculateNumberOfDays();
    return (nightsSum * TAX - nightsSum).toFixed(2);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowOverlay(true);
    
    setTimeout(() => {
      router.push("/");
    }, 5000);
  };

  return (
    <div className={style.main}>
      {!isLoading ? (
        <form onSubmit={onSubmit}>
          <div className={style.topText}>
            <h1>Finalize sua reserva!</h1>
          </div>
          <div className={style.content}>
            <div className={style.containers}>
              <div className={style.container}>
                <div className={style.containerTop}>
                  Hotel: {hotelData.hotel.name}
                </div>
                <div className={style.inputs}>
                  <div className={style.input}>
                    <label htmlFor="guestName">Nome (Hóspede)</label>
                    <input
                      type="text"
                      name="guestName"
                      id="guestName"
                      placeholder="Nome"
                      value={guestFormData.guestName}
                      onChange={(e) =>
                        setGuestFormData({
                          ...guestFormData,
                          guestName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className={style.input}>
                    <label htmlFor="guestSurname">Sobrenome</label>
                    <input
                      type="text"
                      name="guestSurname"
                      id="guestSurname"
                      placeholder="Sobrenome"
                      value={guestFormData.guestSurname}
                      onChange={(e) =>
                        setGuestFormData({
                          ...guestFormData,
                          guestSurname: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
              </div>
              <div className={style.container}>
                <div className={style.containerTop}>Contato da reserva</div>
                <div className={style.inputs}>
                  <div className={style.input}>
                    <label htmlFor="contactName">Nome </label>
                    <input
                      type="text"
                      name="contactName"
                      id="contactName"
                      placeholder="Nome"
                      value={guestFormData.contactName}
                      onChange={(e) =>
                        setGuestFormData({
                          ...guestFormData,
                          contactName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className={style.input}>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={guestFormData.email}
                      placeholder="Digite seu e-mail"
                      onChange={(e) =>
                        setGuestFormData({
                          ...guestFormData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className={style.input}>
                    <label htmlFor="phone">Telephone (Whatsapp)</label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      placeholder="(XX)XXXXX-XXXX"
                      value={guestFormData.phone}
                      onChange={(e) =>
                        setGuestFormData({
                          ...guestFormData,
                          phone: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className={style.inputs}>
                  <div className={style.input}>
                    <label htmlFor="obs">Observações</label>
                    <textarea
                      name="obs"
                      id="obs"
                      placeholder="Sua mensagem"
                      rows={100}
                      cols={200}
                      value={guestFormData.obs}
                      onChange={(e) =>
                        setGuestFormData({
                          ...guestFormData,
                          obs: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={`${style.container} ${style.small}`}>
              <h1>Sua reserva</h1>
              <div className={style.containerSection}>
                <div className={style.nameAdrress}>
                  <h1>{hotelData.hotel.name}</h1>
                  <span>{hotelData.hotel.address}</span>
                </div>
                <div className={style.roomPolicy}>
                  <legend>
                    Quarto: {hotelData.rooms[Number(roomIndex)].roomType.name}
                  </legend>
                  {hotelData.rooms[Number(roomIndex)].cancellationPolicies
                    .refundable ? (
                    <span className={style.canRefund}>
                      <CheckCircleIcon className={style.iconCanRefund} />
                      Cancelamento gratuito
                    </span>
                  ) : (
                    <span className={style.cantRefund}>
                      <XCircleIcon className={style.iconCantRefund} />
                      Multa de cancelamento
                    </span>
                  )}
                </div>
              </div>
              <div className={style.containerSection}>
                <div className={style.total}>
                  <div className={style.totalSection}>
                    Impostos e taxas
                    <strong>R$ {calculateTotalTaxes()}</strong>
                  </div>
                  <div className={style.totalSection}>
                    Total
                    <span>R$ {calculateTotalValue()}</span>
                  </div>
                </div>
                <button type="submit">RESERVAR</button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <h1>Carregando</h1>
      )}
      {showOverlay && (
        <div className={style.overlay}>
          <div className={style.overlaySection}>
            <h1>Reserva realizada com sucesso!</h1>
            <span>
              <strong>Hotel:</strong> {hotelData.hotel.name}
            </span>
          </div>
          <div className={style.overlaySection}>
              <strong>Hospede:</strong>Nome: {guestFormData.guestName}
          </div>
          <div className={style.overlaySection}>
              <strong>Contato:</strong>
              Nome: {guestFormData.contactName} <br/>
              E-mail: {guestFormData.email}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import style from "./hotel.module.css";
import apiService from "@/services/apiService";
import SearchComponent from "@/components/searchComponent";
import {
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function HotelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [hotelData, setHotelData] = useState<any>(null);
  const router = useRouter();

 

  useEffect(() => {
    async function fetchHotelData() {
      const { id } = await params;
      const data = await apiService.getHotelById(Number(id));
      setHotelData(data);
    }
    fetchHotelData();
  }, []);

  const handleCheckout = ( roomIndex: number) => {
    router.push(`/checkout?hotelId=${hotelData.id}&roomIndex=${roomIndex}`);
  };
  return (
    <div className={style.main}>
      {hotelData?.hotel ? (
        <>
          <SearchComponent />
          <div className={style.container}>
            <div className={style.hotelInfo}>
              <div
                className={style.hotelImage}
                style={{ backgroundImage: `url(${hotelData.hotel.image})` }}
              ></div>
              <div className={style.infoText}>
                <div className={style.nameLocation}>
                  <h2> {hotelData.hotel.name} </h2>
                  <span>
                    <MapPinIcon className={style.icon} />
                    {hotelData.hotel.address}
                  </span>
                </div>
                <div className={style.stars}>
                  {Array.from({ length: hotelData.hotel.stars }, (_, index) => (
                    <StarIcon key={index} className={style.star} />
                  ))}
                </div>
                <div
                  className={style.description}
                  dangerouslySetInnerHTML={{
                    __html: hotelData.hotel.description,
                  }}
                ></div>
              </div>
            </div>
            <div className={style.availableRooms}>
              <legend>Quartos disponíveis</legend>
              <div className={style.rooms}>
                {hotelData.rooms.map((room: any, index: number) => (
                  <div className={style.room} key={index}>
                    <div className={style.roomTitle}>
                      {room.roomType.name}
                      {room.cancellationPolicies.refundable ? (
                        <span className={style.canRefund}>
                          <CheckCircleIcon className={style.iconCanRefund} />{" "}
                          Cancelamento gratuito
                        </span>
                      ) : (
                        <span className={style.cantRefund}>
                          <XCircleIcon className={style.iconCantRefund} /> Multa
                          de cancelamento
                        </span>
                      )}
                    </div>
                    <div className={style.priceCta}>
                      <div className={style.price}>
                        <h3>
                          R$ {room.price.amount} <span>/ noite</span>
                        </h3>
                        <span>Pagamento no hotel</span>
                      </div>
                      <button className={style.ctaButton} onClick={() => handleCheckout(index)}>
                        Reservar Agora
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

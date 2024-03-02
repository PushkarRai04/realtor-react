import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import Spinner from '../components/Spinner';
import {Swiper, SwiperSlide} from 'swiper/react';
import  SwiperCore, {EffectFade, Autoplay, Navigation, Pagination} from 'swiper';
import "swiper/css/bundle";
import { FaShare } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { FaBed, FaBath, FaCar } from "react-icons/fa";
import { GiSofa } from "react-icons/gi";
import { getAuth } from "firebase/auth";
import Contact from '../components/Contact';

export default function Listing() {

    const auth = getAuth();
    const params= useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
    const [contactLandlord, setContactLandlord] = useState(false);
    SwiperCore.use([Autoplay, Navigation, Pagination]);
    
    useEffect(()=>{
       async function fetchListing(){
        const docRef = doc(db, "listings", params.listingId);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
            setListing(docSnap.data());
            setLoading(false);
        }
       } 
       fetchListing();
    },[params.listingId, listing]);
    if(loading){
        return <Spinner/>;
    }
  return (
    <main>
      <Swiper 
      slidesPerView={1} 
      navigation 
      pagination={{type: "progressbar"}} 
      effect="fade" 
      modules={[EffectFade]} 
      autoplay={{delay: 3000}}
      >
        {listing.imgUrls.map((url, index)=>(
            <SwiperSlide key={index}>
                <div className="relative w-full overflow-hidden h-[300px]" 
                style={{
                  background: `url(${listing.imgUrls[index]}) center no-repeat`, 
                  backgroundSize: "cover"}}>

                </div>
            </SwiperSlide>
        ))}
      </Swiper>
      <div className='fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center' onClick={()=>{
        navigator.clipboard.writeText(window.location.href)
        setShareLinkCopied(true);
        setTimeout(()=>{
          setShareLinkCopied(false);
        }, 2000)
      }}>
      <FaShare className='text-lg text-slate-500'/>
      </div>
      {shareLinkCopied && (<p className='fixed top-[23%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2'>Link Copied</p>)}

      <div className='mt-6 bg-white p-3'>
        <div className=' w-full  '>
          <p className='flex justify-center text-2xl font-bold text-blue-900'>
            {listing.name} - $ {listing.offer ? listing.discountedPrice
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",") : listing.regularPrice
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type ==="rent" ? "/ month" : ""}
          </p>

          <p className='flex justify-center mt-2 items-center font-bold'><MdLocationOn className='h-4 w-4 text-green-600 mr-1'/> {listing.address}</p>

          <div className='flex justify-center items-center mt-2 space-x-4 '>
          <p className='bg-red-700 w-full max-w-[130px] rounded-lg p-1 text-white font-semibold text-center shadow-md'>{listing.type === "rent" ? "For Rent" : "For Sale"}</p>
          <p className='bg-green-700 w-full max-w-[130px] rounded-lg p-1 text-white font-semibold text-center shadow-md'>{listing.offer && (
            <p>${listing.regularPrice-listing.discountedPrice} discount</p>
          )}</p>
          </div>
        
          <p className='flex justify-center mt-3 mb-3'>
            <span className='font-semibold'>Description- </span>
            {listing.description}</p>
          
          <ul className='flex justify-center items-center space-x-2 sm:space-x-10 text-sm font-semibold mb-6'>
            <li className='flex items-center whitespace-nowrap'>
              <FaBed className='text-lg mr-1'/>
              {+listing.bedrooms>1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </li>

            <li className='flex items-center whitespace-nowrap'>
              <FaBath className='text-lg mr-1'/>
              {+listing.bathrooms>1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </li>

            <li className='flex items-center whitespace-nowrap'>
              <FaCar className='text-lg mr-1'/>
              {listing.parking ? "Parking" : "No Parking"}
            </li>

            <li className='flex items-center whitespace-nowrap'>
              <GiSofa className='text-lg mr-1'/>
              {listing.furnished ? "Furnished" : "Not Furnished"}
            </li>
          </ul>
          {listing.userRef !== auth.currentUser?.uid && !contactLandlord &&(
            <div className='mt-6'>
            <button onClick={()=>setContactLandlord(true)} className='px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg w-full text-center transition duration-150 ease-in-out'>Contact Landlord</button>
            </div>
          )}
          
          {contactLandlord &&(
            <Contact userRef={listing.userRef} listing={listing}/>
          )}
        </div>
      </div>
    </main>
  )
}

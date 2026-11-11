import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiRequest } from "@/lib/api";

import qrImage from "@/assets/bank-qr.jpeg";
import { getLocalizedText, languageText, TextValue, useLanguage } from "@/lib/language";

type DonationData = {
  title?: TextValue;
  description?: TextValue;
  bankName?: string;
  branchName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
  qrCodeUrl?: string;
};

const fallbackDonation: DonationData = {
  title: {
    bn: "শ্রী শ্রী৺রী কিরীটেশ্বরী মাতার নিত্য-সেবা, পূজা ও মন্দির সংস্কার পরিচালন কমিটি",
    en: "Committee for the daily seva, worship, and restoration of Sri Sri Kiriteswari Mata's Temple",
    hi: "श्री श्री किरीटेश्वरी माता की नित्य सेवा, पूजा और मंदिर जीर्णोद्धार समिति",
  },
  description: {
    bn: "আপনার অনুদান নিত্যপূজা, মন্দির রক্ষণাবেক্ষণ, ধর্মীয় আচার, উৎসব ও ভক্তসেবায় সহায়তা করে।",
    en: "Your generous contribution helps support daily puja, temple maintenance, sacred rituals, festivals, and services for devotees.",
    hi: "आपका योगदान नित्य पूजा, मंदिर रखरखाव, धार्मिक अनुष्ठानों, उत्सवों और भक्तों की सेवा में सहायता करता है।",
  },
  bankName: "Punjab National Bank",
  branchName: "Azimganj",
  accountNumber: "0930010389143",
  ifscCode: "PUNB0093020",
  upiId: "kiriteswari@upi",
  qrCodeUrl: qrImage,
};

const Donate: React.FC = () => {
  const { language } = useLanguage();
  const [donation, setDonation] = useState<DonationData>(fallbackDonation);

  useEffect(() => {
    let isMounted = true;

    const loadDonation = async () => {
      try {
        const response = await apiRequest<{ data?: DonationData }>("/donation");
        const value = response?.data || fallbackDonation;

        if (isMounted) {
          setDonation({ ...fallbackDonation, ...value });
        }
      } catch {
        if (isMounted) {
          setDonation(fallbackDonation);
        }
      }
    };

    loadDonation();
    return () => {
      isMounted = false;
    };
  }, []);

  const donationImage = donation.qrCodeUrl || qrImage;

  return (
    <>
      <Navbar />

      <div className="relative z-0 min-h-screen bg-gray-50 flex flex-col pt-28">
        <div className="max-w-3xl mx-auto px-4 py-12 flex-grow">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-green-700 mb-10">
            {languageText(language, {
              bn: "কিরীটেশ্বরী মন্দিরের সেবামূলক কার্যক্রমে আপনার অনুদান প্রদান করুন",
              en: "Support Our Cause – Donate to Kiriteswari Temple",
              hi: "किरीटेश्वरी मंदिर की सेवा के लिए दान करें",
            })}
          </h2>

          <div className="bg-white shadow-lg rounded-xl p-10 md:p-12 border border-gray-200 text-center mb-6">
            <h3 className="text-xl md:text-2xl font-semibold text-green-700 mb-4">
              {languageText(language, { bn: "ব্যাংক ট্রান্সফারের বিবরণ", en: "Bank Transfer Details", hi: "बैंक हस्तांतरण विवरण" })}
            </h3>

            <ul className="space-y-3 text-gray-700 text-base">
              <h2 className="font-bold">
                <span aria-hidden="true" className="mr-2">🙏</span>
                {getLocalizedText(donation.title, language)}
              </h2>

              <li>
                <span className="font-medium">{languageText(language, { bn: "ব্যাংকের নাম:", en: "Bank Name:", hi: "बैंक का नाम:" })}</span>{" "}
                {donation.bankName || "Punjab National Bank"}
              </li>

              <li>
                <span className="font-medium">{languageText(language, { bn: "শাখার নাম:", en: "Branch Name:", hi: "शाखा का नाम:" })}</span>{" "}
                {donation.branchName || "Azimganj"}
              </li>

              <li>
                <span className="font-medium">{languageText(language, { bn: "অ্যাকাউন্ট নম্বর:", en: "Account No:", hi: "खाता संख्या:" })}</span>{" "}
                {donation.accountNumber || "0930010389143"}
              </li>

              <li>
                <span className="font-medium">{languageText(language, { bn: "IFSC কোড:", en: "IFSC Code:", hi: "IFSC कोड:" })}</span>{" "}
                {donation.ifscCode || "PUNB0093020"}
              </li>

              <li>
                <span className="font-medium">UPI:</span>{" "}
                {donation.upiId || "kiriteswari@upi"}
              </li>
            </ul>
          </div>

          <div className="text-center text-gray-500 font-semibold mb-6">
            {languageText(language, { bn: "অথবা", en: "OR", hi: "या" })}
          </div>

          <div className="bg-white shadow-lg rounded-xl p-16 md:p-20 border border-gray-200 flex flex-col items-center justify-center">
            <h3 className="text-2xl md:text-4xl font-semibold text-green-700 mb-10">
              {languageText(language, { bn: "স্ক্যান করে অনুদান দিন", en: "Scan & Pay", hi: "स्कैन करके दान करें" })}
            </h3>

            <img
              src={typeof donationImage === "string" ? donationImage : qrImage}
              alt={languageText(language, { bn: "অনুদানের QR কোড", en: "Donation QR Code", hi: "दान के लिए QR कोड" })}
              className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[30rem] lg:h-[30rem] border rounded-md shadow-lg"
            />

            <p className="mt-10 text-base md:text-lg text-gray-600 text-center max-w-lg">
              {languageText(language, {
                bn: "যেকোনো UPI অ্যাপ দিয়ে এই কোড স্ক্যান করে সহজেই অনুদান দিন।",
                en: "Use any UPI app to scan this code and donate instantly.",
                hi: "किसी भी UPI ऐप से इस कोड को स्कैन करके आसानी से दान करें।",
              })}
            </p>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-2">
              {languageText(language, { bn: "ধন্যবাদ 💚", en: "Thank You 💚", hi: "धन्यवाद 💚" })}
            </h2>

            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              {getLocalizedText(donation.description, language)}
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Donate;

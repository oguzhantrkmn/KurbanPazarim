"use client";

import React, { useState } from "react";
import { FaInstagram, FaTwitter, FaFacebook, FaBars, FaCamera } from 'react-icons/fa';
import Image from "next/image";
import NavbarAuthMenu, { useAuth } from "./components/NavbarAuthMenu";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function IlanEkleModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    tur: "",
    irk: "",
    yas: "",
    kilo: "",
    fiyat: "",
    aciklama: "",
    il: "",
    ilce: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Irk ve yaş seçenekleri
  const irkOptions: Record<string, string[]> = {
    "Büyükbaş": ["Simental", "Holstein", "Montofon", "Yerli Kara", "Diğer"],
    "Küçükbaş": ["Kıvırcık", "Merinos", "Karaman", "Sakız", "Diğer"],
    "Deve": ["Tülü", "Yörük", "Diğer"],
    "Diğer": ["Diğer"],
  };
  const yasOptions: Record<string, string[]> = {
    "Büyükbaş": [
      "3 ay", "6 ay", "9 ay", "1 yıl", "1.5 yıl", "2 yıl", "2.5 yıl", "3 yıl", "4 yıl", "5 yıl", "6 yıl", "7 yıl", "8 yıl", "9 yıl", "10 yıl+"
    ],
    "Küçükbaş": [
      "3 ay", "6 ay", "9 ay", "1 yıl", "1.5 yıl", "2 yıl", "2.5 yıl", "3 yıl", "4 yıl", "5 yıl", "6 yıl", "7 yıl", "8 yıl", "9 yıl", "10 yıl+"
    ],
    "Deve": [
      "1 yıl", "2 yıl", "3 yıl", "4 yıl", "5 yıl", "6 yıl", "7 yıl", "8 yıl", "9 yıl", "10 yıl+"
    ],
    "Diğer": [
      "1 yıl", "2 yıl", "3 yıl", "4 yıl", "5 yıl", "6 yıl", "7 yıl", "8 yıl", "9 yıl", "10 yıl+"
    ],
  };

  // İl ve ilçe seçenekleri (TÜM TÜRKİYE - TAM LİSTE)
  const ilIlceData: Record<string, string[]> = {
    "Adana": ["Aladağ", "Ceyhan", "Çukurova", "Feke", "İmamoğlu", "Karaisalı", "Karataş", "Kozan", "Pozantı", "Saimbeyli", "Sarıçam", "Seyhan", "Tufanbeyli", "Yumurtalık", "Yüreğir"],
    "Adıyaman": ["Besni", "Çelikhan", "Gerger", "Gölbaşı", "Kahta", "Merkez", "Samsat", "Sincik", "Tut"],
    "Afyonkarahisar": ["Başmakçı", "Bayat", "Bolvadin", "Çay", "Çobanlar", "Dazkırı", "Dinar", "Emirdağ", "Evciler", "Hocalar", "İhsaniye", "İscehisar", "Kızılören", "Merkez", "Sandıklı", "Sinanpaşa", "Sultandağı", "Şuhut"],
    "Ağrı": ["Diyadin", "Doğubayazıt", "Eleşkirt", "Hamur", "Merkez", "Patnos", "Taşlıçay", "Tutak"],
    "Amasya": ["Göynücek", "Gümüşhacıköy", "Hamamözü", "Merkez", "Merzifon", "Suluova", "Taşova"],
    "Ankara": ["Akyurt", "Altındağ", "Ayaş", "Bala", "Beypazarı", "Çamlıdere", "Çankaya", "Çubuk", "Elmadağ", "Etimesgut", "Evren", "Gölbaşı", "Güdül", "Haymana", "Kahramankazan", "Kalecik", "Keçiören", "Kızılcahamam", "Mamak", "Nallıhan", "Polatlı", "Pursaklar", "Sincan", "Şereflikoçhisar", "Yenimahalle"],
    "Antalya": ["Akseki", "Aksu", "Alanya", "Demre", "Döşemealtı", "Elmalı", "Finike", "Gazipaşa", "Gündoğmuş", "İbradı", "Kale", "Kaş", "Kemer", "Kepez", "Konyaaltı", "Korkuteli", "Kumluca", "Manavgat", "Muratpaşa", "Serik"],
    "Artvin": ["Ardanuç", "Arhavi", "Borçka", "Hopa", "Merkez", "Murgul", "Şavşat", "Yusufeli"],
    "Aydın": ["Bozdoğan", "Buharkent", "Çine", "Didim", "Efeler", "Germencik", "İncirliova", "Karacasu", "Karpuzlu", "Koçarlı", "Köşk", "Kuşadası", "Kuyucak", "Nazilli", "Söke", "Sultanhisar", "Yenipazar"],
    "Balıkesir": ["Altıeylül", "Ayvalık", "Balya", "Bandırma", "Bigadiç", "Burhaniye", "Dursunbey", "Edremit", "Erdek", "Gömeç", "Gönen", "Havran", "İvrindi", "Karesi", "Kepsut", "Manyas", "Marmara", "Savaştepe", "Sındırgı", "Susurluk"],
    "Bilecik": ["Bozüyük", "Gölpazarı", "İnhisar", "Merkez", "Osmaneli", "Pazaryeri", "Söğüt", "Yenipazar"],
    "Bingöl": ["Adaklı", "Genç", "Karlıova", "Kiğı", "Merkez", "Solhan", "Yayladere", "Yedisu"],
    "Bitlis": ["Adilcevaz", "Ahlat", "Güroymak", "Hizan", "Merkez", "Mutki", "Tatvan"],
    "Bolu": ["Dörtdivan", "Gerede", "Göynük", "Kıbrıscık", "Mengen", "Merkez", "Mudurnu", "Seben", "Yeniçağa"],
    "Burdur": ["Ağlasun", "Altınyayla", "Bucak", "Çavdır", "Çeltikçi", "Gölhisar", "Karamanlı", "Kemer", "Merkez", "Tefenni", "Yeşilova"],
    "Bursa": ["Büyükorhan", "Gemlik", "Gürsu", "Harmancık", "İnegöl", "İznik", "Karacabey", "Keles", "Kestel", "Mudanya", "Mustafakemalpaşa", "Nilüfer", "Orhaneli", "Orhangazi", "Osmangazi", "Yenişehir", "Yıldırım"],
    "Çanakkale": ["Ayvacık", "Bayramiç", "Biga", "Bozcaada", "Çan", "Eceabat", "Ezine", "Gelibolu", "Gökçeada", "Lapseki", "Merkez", "Yenice"],
    "Çankırı": ["Atkaracalar", "Bayramören", "Çerkeş", "Eldivan", "Ilgaz", "Kızılırmak", "Korgun", "Kurşunlu", "Merkez", "Orta", "Şabanözü", "Yapraklı"],
    "Çorum": ["Alaca", "Bayat", "Boğazkale", "Dodurga", "İskilip", "Kargı", "Laçin", "Mecitözü", "Merkez", "Oğuzlar", "Ortaköy", "Osmancık", "Sungurlu", "Uğurludağ"],
    "Denizli": ["Acıpayam", "Babadağ", "Baklan", "Bekilli", "Beyağaç", "Bozkurt", "Buldan", "Çal", "Çameli", "Çardak", "Çivril", "Güney", "Honaz", "Kale", "Merkezefendi", "Pamukkale", "Sarayköy", "Serinhisar", "Tavas"],
    "Diyarbakır": ["Bağlar", "Bismil", "Çermik", "Çınar", "Çüngüş", "Dicle", "Eğil", "Ergani", "Hani", "Hazro", "Kayapınar", "Kocaköy", "Kulp", "Lice", "Silvan", "Sur", "Yenişehir"],
    "Düzce": ["Akçakoca", "Cumayeri", "Çilimli", "Gölyaka", "Gümüşova", "Kaynaşlı", "Merkez", "Yığılca"],
    "Edirne": ["Enez", "Havsa", "İpsala", "Keşan", "Lalapaşa", "Meriç", "Merkez", "Süloğlu", "Uzunköprü"],
    "Elazığ": ["Ağın", "Alacakaya", "Arıcak", "Baskil", "Karakoçan", "Keban", "Kovancılar", "Maden", "Merkez", "Palu", "Sivrice"],
    "Erzincan": ["Çayırlı", "İliç", "Kemah", "Kemaliye", "Merkez", "Otlukbeli", "Refahiye", "Tercan", "Üzümlü"],
    "Erzurum": ["Aşkale", "Aziziye", "Çat", "Hınıs", "Horasan", "İspir", "Karaçoban", "Karayazı", "Köprüköy", "Narman", "Oltu", "Olur", "Palandöken", "Pasinler", "Pazaryolu", "Şenkaya", "Tekman", "Tortum", "Uzundere", "Yakutiye"],
    "Eskişehir": ["Alpu", "Beylikova", "Çifteler", "Günyüzü", "Han", "İnönü", "Mahmudiye", "Mihalgazi", "Mihalıççık", "Odunpazarı", "Sarıcakaya", "Seyitgazi", "Sivrihisar", "Tepebaşı"],
    "Gaziantep": ["Araban", "İslahiye", "Karkamış", "Nizip", "Nurdağı", "Oğuzeli", "Şahinbey", "Şehitkamil", "Yavuzeli"],
    "Giresun": ["Alucra", "Bulancak", "Çamoluk", "Çanakçı", "Dereli", "Doğankent", "Espiye", "Eynesil", "Görele", "Güce", "Keşap", "Merkez", "Piraziz", "Şebinkarahisar", "Tirebolu", "Yağlıdere"],
    "Gümüşhane": ["Kelkit", "Köse", "Kürtün", "Merkez", "Şiran", "Torul"],
    "Hakkari": ["Çukurca", "Derecik", "Merkez", "Şemdinli", "Yüksekova"],
    "Hatay": ["Altınözü", "Antakya", "Arsuz", "Belen", "Defne", "Dörtyol", "Erzin", "Hassa", "İskenderun", "Kırıkhan", "Kumlu", "Payas", "Reyhanlı", "Samandağ", "Yayladağı"],
    "Iğdır": ["Aralık", "Karakoyunlu", "Merkez", "Tuzluca"],
    "Isparta": ["Aksu", "Atabey", "Eğirdir", "Gelendost", "Gönen", "Keçiborlu", "Merkez", "Senirkent", "Sütçüler", "Şarkikaraağaç", "Uluborlu", "Yalvaç", "Yenişarbademli"],
    "Kahramanmaraş": ["Afşin", "Andırın", "Çağlayancerit", "Dulkadiroğlu", "Ekinözü", "Elbistan", "Göksun", "Nurhak", "Onikişubat", "Pazarcık", "Türkoğlu"],
    "Karabük": ["Eflani", "Eskipazar", "Merkez", "Ovacık", "Safranbolu", "Yenice"],
    "Karaman": ["Ayrancı", "Başyayla", "Ermenek", "Kazımkarabekir", "Merkez", "Sarıveliler"],
    "Kars": ["Akyaka", "Arpaçay", "Digor", "Kağızman", "Merkez", "Sarıkamış", "Selim", "Susuz"],
    "Kastamonu": ["Abana", "Ağlı", "Araç", "Azdavay", "Bozkurt", "Cide", "Çatalzeytin", "Daday", "Devrekani", "Doğanyurt", "Hanönü", "İhsangazi", "İnebolu", "Küre", "Merkez", "Pınarbaşı", "Şenpazar", "Seydiler", "Taşköprü", "Tosya"],
    "Kayseri": ["Akkışla", "Bünyan", "Develi", "Felahiye", "Hacılar", "İncesu", "Kocasinan", "Melikgazi", "Özvatan", "Pınarbaşı", "Sarıoğlan", "Sarız", "Talas", "Tomarza", "Yahyalı", "Yeşilhisar"],
    "Kırıkkale": ["Bahşili", "Balışeyh", "Çelebi", "Delice", "Karakeçili", "Keskin", "Merkez", "Sulakyurt", "Yahşihan"],
    "Kırklareli": ["Babaeski", "Demirköy", "Kofçaz", "Lüleburgaz", "Merkez", "Pehlivanköy", "Pınarhisar", "Vize"],
    "Kırşehir": ["Akçakent", "Akpınar", "Boztepe", "Çiçekdağı", "Kaman", "Merkez", "Mucur"],
    "Kilis": ["Elbeyli", "Merkez", "Musabeyli", "Polateli"],
    "Kocaeli": ["Başiskele", "Çayırova", "Darıca", "Derince", "Dilovası", "Gebze", "Gölcük", "İzmit", "Kandıra", "Karamürsel", "Kartepe", "Körfez"],
    "Konya": ["Ahırlı", "Akören", "Akşehir", "Altınekin", "Beyşehir", "Bozkır", "Cihanbeyli", "Çeltik", "Çumra", "Derbent", "Derebucak", "Doğanhisar", "Emirgazi", "Ereğli", "Güneysınır", "Hadim", "Halkapınar", "Hüyük", "Ilgın", "Kadınhanı", "Karapınar", "Karatay", "Kulu", "Meram", "Sarayönü", "Selçuklu", "Seydişehir", "Taşkent", "Tuzlukçu", "Yalıhüyük", "Yunak"],
    "Kütahya": ["Altıntaş", "Aslanapa", "Çavdarhisar", "Domaniç", "Dumlupınar", "Emet", "Gediz", "Hisarcık", "Merkez", "Pazarlar", "Şaphane", "Simav", "Tavşanlı"],
    "Malatya": ["Akçadağ", "Arapgir", "Arguvan", "Battalgazi", "Darende", "Doğanşehir", "Doğanyol", "Hekimhan", "Kale", "Kuluncak", "Pütürge", "Yazıhan", "Yeşilyurt"],
    "Manisa": ["Ahmetli", "Akhisar", "Alaşehir", "Demirci", "Gölmarmara", "Gördes", "Kırkağaç", "Köprübaşı", "Kula", "Salihli", "Sarıgöl", "Saruhanlı", "Selendi", "Soma", "Şehzadeler", "Turgutlu", "Yunusemre"],
    "Mardin": ["Artuklu", "Dargeçit", "Derik", "Kızıltepe", "Mazıdağı", "Midyat", "Nusaybin", "Ömerli", "Savur", "Yeşilli"],
    "Mersin": ["Akdeniz", "Anamur", "Aydıncık", "Bozyazı", "Çamlıyayla", "Erdemli", "Gülnar", "Mezitli", "Mut", "Silifke", "Tarsus", "Toroslar", "Yenişehir"],
    "Muğla": ["Bodrum", "Dalaman", "Datça", "Fethiye", "Kavaklıdere", "Köyceğiz", "Marmaris", "Menteşe", "Milas", "Ortaca", "Seydikemer", "Ula", "Yatağan"],
    "Muş": ["Bulanık", "Hasköy", "Korkut", "Malazgirt", "Merkez", "Varto"],
    "Nevşehir": ["Acıgöl", "Avanos", "Derinkuyu", "Gülşehir", "Hacıbektaş", "Kozaklı", "Merkez", "Ürgüp"],
    "Niğde": ["Altunhisar", "Bor", "Çamardı", "Çiftlik", "Merkez", "Ulukışla"],
    "Ordu": ["Akkuş", "Altınordu", "Aybastı", "Çamaş", "Çatalpınar", "Çaybaşı", "Fatsa", "Gölköy", "Gülyalı", "Gürgentepe", "İkizce", "Kabadüz", "Kabataş", "Korgan", "Kumru", "Mesudiye", "Perşembe", "Ulubey", "Ünye"],
    "Osmaniye": ["Bahçe", "Düziçi", "Hasanbeyli", "Kadirli", "Merkez", "Sumbas", "Toprakkale"],
    "Rize": ["Ardeşen", "Çamlıhemşin", "Çayeli", "Derepazarı", "Fındıklı", "Güneysu", "Hemşin", "İkizdere", "İyidere", "Kalkandere", "Merkez", "Pazar"],
    "Sakarya": ["Adapazarı", "Akyazı", "Arifiye", "Erenler", "Ferizli", "Geyve", "Hendek", "Karapürçek", "Karasu", "Kaynarca", "Kocaali", "Pamukova", "Sapanca", "Serdivan", "Söğütlü", "Taraklı"],
    "Samsun": ["Alaçam", "Asarcık", "Atakum", "Ayvacık", "Bafra", "Canik", "Çarşamba", "Havza", "İlkadım", "Kavak", "Ladik", "Salıpazarı", "Tekkeköy", "Terme", "Vezirköprü", "Yakakent"],
    "Siirt": ["Baykan", "Eruh", "Kurtalan", "Merkez", "Pervari", "Şirvan", "Tillo"],
    "Sinop": ["Ayancık", "Boyabat", "Dikmen", "Durağan", "Erfelek", "Gerze", "Merkez", "Saraydüzü", "Türkeli"],
    "Sivas": ["Akıncılar", "Altınyayla", "Divriği", "Doğanşar", "Gemerek", "Gölova", "Gürün", "Hafik", "İmranlı", "Kangal", "Koyulhisar", "Merkez", "Suşehri", "Şarkışla", "Ulaş", "Yıldızeli", "Zara"],
    "Şanlıurfa": ["Akçakale", "Birecik", "Bozova", "Ceylanpınar", "Eyyübiye", "Halfeti", "Haliliye", "Harran", "Hilvan", "Karaköprü", "Siverek", "Suruç", "Viranşehir"],
    "Şırnak": ["Beytüşşebap", "Cizre", "Güçlükonak", "İdil", "Merkez", "Silopi", "Uludere"],
    "Tekirdağ": ["Çerkezköy", "Çorlu", "Ergene", "Hayrabolu", "Kapaklı", "Malkara", "Marmaraereğlisi", "Muratlı", "Saray", "Süleymanpaşa", "Şarköy"],
    "Tokat": ["Almus", "Artova", "Başçiftlik", "Erbaa", "Merkez", "Niksar", "Pazar", "Reşadiye", "Sulusaray", "Turhal", "Yeşilyurt", "Zile"],
    "Trabzon": ["Akçaabat", "Araklı", "Arsin", "Beşikdüzü", "Çarşıbaşı", "Çaykara", "Dernekpazarı", "Düzköy", "Hayrat", "Köprübaşı", "Maçka", "Merkez", "Of", "Ortahisar", "Sürmene", "Şalpazarı", "Tonya", "Vakfıkebir", "Yomra"],
    "Tunceli": ["Çemişgezek", "Hozat", "Mazgirt", "Merkez", "Nazımiye", "Ovacık", "Pertek", "Pülümür"],
    "Uşak": ["Banaz", "Eşme", "Karahallı", "Merkez", "Sivaslı", "Ulubey"],
    "Van": ["Bahçesaray", "Başkale", "Çaldıran", "Çatak", "Edremit", "Erciş", "Gevaş", "Gürpınar", "İpekyolu", "Muradiye", "Özalp", "Saray", "Tuşba"],
    "Yalova": ["Altınova", "Armutlu", "Çiftlikköy", "Çınarcık", "Merkez", "Termal"],
    "Yozgat": ["Akdağmadeni", "Aydıncık", "Boğazlıyan", "Çandır", "Çayıralan", "Çekerek", "Kadışehri", "Merkez", "Saraykent", "Sarıkaya", "Sorgun", "Şefaatli", "Yenifakılı", "Yerköy"],
    "Zonguldak": ["Alaplı", "Çaycuma", "Devrek", "Gökçebey", "Karadeniz Ereğli", "Kilimli", "Kozlu", "Merkez"]
  };
  const iller = Object.keys(ilIlceData).sort();
  const ilceler = form.il && ilIlceData[form.il] ? ilIlceData[form.il] : [];

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Fotoğrafları Storage'a yükle
      const imageUrls: string[] = [];
      for (const img of images) {
        const storageRef = ref(storage, `ilanlar/${user.uid}/${Date.now()}_${img.name}`);
        await uploadBytes(storageRef, img);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }
      // Firestore'a ilanı kaydet
      await addDoc(collection(db, "ilanlar"), {
        ...form,
        images: imageUrls,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      alert("İlan başarıyla eklendi!");
      setForm({ tur: "", irk: "", yas: "", kilo: "", fiyat: "", aciklama: "", il: "", ilce: "" });
      setImages([]);
      onClose();
    } catch (err: any) {
      setError("Bir hata oluştu: " + err?.message);
      alert("Bir hata oluştu: " + err?.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="relative w-full max-w-xl mx-4 bg-white rounded-2xl shadow-2xl p-4 md:p-8 animate-fade-in border border-gray-200 max-h-screen overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-4 text-3xl text-gray-400 hover:text-red-500 transition-colors font-bold">×</button>
        <h2 className="text-3xl font-extrabold mb-6 text-green-700 text-center tracking-tight">İlan Ekle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Hayvan Türü</label>
              <select name="tur" value={form.tur} onChange={handleChange} required className="w-full border rounded px-3 py-2 text-gray-900 bg-white">
                <option value="">Seçiniz</option>
                <option value="Büyükbaş">Büyükbaş</option>
                <option value="Küçükbaş">Küçükbaş</option>
                <option value="Deve">Deve</option>
                <option value="Diğer">Diğer</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Irk</label>
              <select name="irk" value={form.irk} onChange={handleChange} required disabled={!form.tur} className="w-full border rounded px-3 py-2 text-gray-900 bg-white">
                <option value="">Seçiniz</option>
                {form.tur && irkOptions[form.tur].map((irk) => (
                  <option key={irk} value={irk}>{irk}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Yaş</label>
              <select name="yas" value={form.yas} onChange={handleChange} required disabled={!form.tur} className="w-full border rounded px-3 py-2 text-gray-900 bg-white">
                <option value="">Seçiniz</option>
                {form.tur && yasOptions[form.tur].map((yas) => (
                  <option key={yas} value={yas}>{yas}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Kilo (kg)</label>
              <input
                type="number"
                name="kilo"
                value={form.kilo}
                onChange={handleChange}
                required
                min={form.tur === "Büyükbaş" ? 100 : form.tur === "Küçükbaş" ? 10 : form.tur === "Deve" ? 100 : 1}
                max={form.tur === "Büyükbaş" ? 1500 : form.tur === "Küçükbaş" ? 200 : form.tur === "Deve" ? 1000 : 2000}
                step="0.5"
                placeholder={form.tur === "Büyükbaş" ? "Örn: 350" : form.tur === "Küçükbaş" ? "Örn: 45" : form.tur === "Deve" ? "Örn: 400" : "Örn: 10"}
                className="w-full border rounded px-3 py-2 text-gray-900 bg-white"
                disabled={!form.tur}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Fiyat (₺)</label>
              <input
                type="number"
                name="fiyat"
                value={form.fiyat}
                onChange={handleChange}
                required
                min={0}
                max={1000000}
                step="50"
                placeholder="Örn: 15000"
                className="w-full border rounded px-3 py-2 text-gray-900 bg-white"
              />
              {form.fiyat && (
                <div className="text-green-700 font-semibold mt-1">
                  {Number(form.fiyat).toLocaleString("tr-TR")} ₺
                </div>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-700">İl</label>
              <select
                name="il"
                value={form.il || ""}
                onChange={e => setForm({ ...form, il: e.target.value, ilce: "" })}
                required
                className="w-full border rounded px-3 py-2 text-gray-900 bg-white"
              >
                <option value="">Seçiniz</option>
                {iller.map((il) => (
                  <option key={il} value={il}>{il}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-700">İlçe</label>
              <select
                name="ilce"
                value={form.ilce || ""}
                onChange={handleChange}
                required
                disabled={!form.il}
                className="w-full border rounded px-3 py-2 text-gray-900 bg-white"
              >
                <option value="">Seçiniz</option>
                {ilceler.map((ilce) => (
                  <option key={ilce} value={ilce}>{ilce}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Açıklama</label>
            <textarea name="aciklama" value={form.aciklama} onChange={handleChange} required className="w-full border rounded px-3 py-2 text-gray-900 bg-white" rows={3} />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Fotoğraflar (çoklu seçilebilir)</label>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 hover:bg-green-200 border border-green-300 text-green-700 text-2xl shadow-sm transition-colors focus:outline-none"
                title="Fotoğraf Yükle"
              >
                <FaCamera />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <span className="text-gray-500 text-sm">
                {images.length > 0
                  ? images.map((img, i) => <span key={i} className="inline-block bg-gray-100 px-2 py-1 rounded text-xs text-gray-700 mr-1">{img.name}</span>)
                  : "Fotoğraf seçmek için ikona tıklayın"}
              </span>
            </div>
          </div>
          {error && <div className="text-red-600 font-semibold">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-md mt-2">
            {loading ? "Yükleniyor..." : "İlanı Paylaş"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  if (!auth) return null;
  const { role } = auth;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <a href="/" className="flex items-center gap-2 group">
                <Image src="/logo.png" alt="Logo" width={200} height={200} className="h-14 w-14 object-contain transition-transform group-hover:scale-105" />
                <span className="text-3xl font-extrabold text-green-700 tracking-tight group-hover:text-green-800 transition-colors">KurbanPazarım</span>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              {role === "satici" && (
                <button
                  onClick={() => setModalOpen(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
                >
                  İlan Ekle
                </button>
              )}
              <NavbarAuthMenu />
            </div>
          </div>
        </div>
      </nav>
      <IlanEkleModal open={modalOpen} onClose={() => setModalOpen(false)} />
      {children}
      <footer className="bg-gray-900 text-white py-10 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-green-400">KurbanPazarım</h3>
              <p className="text-gray-300">
                Güvenilir ve kaliteli kurbanlık hayvan alım satım platformu
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Hızlı Bağlantılar</h3>
              <ul className="space-y-2">
                <li><a href="/ilanlar" className="text-gray-300 hover:text-green-400 transition-colors">İlanlar</a></li>
                <li><a href="/hakkimizda" className="text-gray-300 hover:text-green-400 transition-colors">Hakkımızda</a></li>
                <li><a href="/iletisim" className="text-gray-300 hover:text-green-400 transition-colors">İletişim</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Bizi Takip Edin</h3>
              <div className="flex space-x-4 mt-2">
                <a href="#" className="hover:text-green-400 transition-colors text-2xl"><FaInstagram /></a>
                <a href="#" className="hover:text-green-400 transition-colors text-2xl"><FaTwitter /></a>
                <a href="#" className="hover:text-green-400 transition-colors text-2xl"><FaFacebook /></a>
              </div>
              <ul className="space-y-2 text-gray-300 mt-4">
                <li>Email: info@kurbanpazarim.com</li>
                <li>Tel: +90 (555) 123 45 67</li>
                <li>Adres: İstanbul, Türkiye</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; 2024 KurbanPazarım. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
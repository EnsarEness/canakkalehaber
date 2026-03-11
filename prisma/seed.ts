import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    await prisma.news.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash("password123", 10);

    // ── SEED USERS ──────────────────────────────────────────────────────────
    const admin = await prisma.user.create({
        data: { name: "Admin", email: "admin@canakkale.com", password: hashedPassword, role: "ADMIN", avatarUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&q=80" },
    });

    const fatma = await prisma.user.create({
        data: { name: "Fatma Kaya", email: "fatma@canakkale.com", password: hashedPassword, role: "AUTHOR", bio: "Kültür ve sanat muhabiri.", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80" },
    });

    const mehmet = await prisma.user.create({
        data: { name: "Mehmet Demir", email: "mehmet@canakkale.com", password: hashedPassword, role: "AUTHOR", bio: "Spor ve yerel haberler muhabiri.", avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&q=80" },
    });

    const elif = await prisma.user.create({
        data: { name: "Elif Çelik", email: "elif@canakkale.com", password: hashedPassword, role: "AUTHOR", bio: "Gündem ve sıcak haber muhabiri.", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80" },
    });

    const caner = await prisma.user.create({
        data: { name: "Caner Taşkın", email: "caner@canakkale.com", password: hashedPassword, role: "AUTHOR", bio: "Ekonomi ve tarım haberleri uzmanı.", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80" },
    });

    // ── SEED CATEGORIES ──────────────────────────────────────────────────────────
    const gundem = await prisma.category.create({ data: { name: "Gündem", slug: "gundem", color: "#EF4444" } });
    const ekonomi = await prisma.category.create({ data: { name: "Ekonomi", slug: "ekonomi", color: "#F59E0B" } });
    const spor = await prisma.category.create({ data: { name: "Spor", slug: "spor", color: "#10B981" } });
    const kultur = await prisma.category.create({ data: { name: "Kültür & Sanat", slug: "kultur-sanat", color: "#8B5CF6" } });
    const turizm = await prisma.category.create({ data: { name: "Turizm", slug: "turizm", color: "#06B6D4" } });

    // --- İLÇELER (DISTRICTS) ---
    const biga = await prisma.category.create({ data: { name: "Biga", slug: "biga", color: "#6366F1" } });
    const can = await prisma.category.create({ data: { name: "Çan", slug: "can", color: "#EAB308" } });
    const ayvacik = await prisma.category.create({ data: { name: "Ayvacık", slug: "ayvacik", color: "#14B8A6" } });
    const gelibolu = await prisma.category.create({ data: { name: "Gelibolu", slug: "gelibolu", color: "#8B5CF6" } });
    const ezine = await prisma.category.create({ data: { name: "Ezine", slug: "ezine", color: "#F43F5E" } });

    // ── SEED NEWS (20 ARTICLES) ──────────────────────────────────────────────────
    const newsData = [
        // --- GÜNDEM ---
        {
            title: "Çanakkale Boğazı'nda Yeni Köprü Projesi Başlıyor",
            slug: "canakkale-bogazinda-yeni-kopru-projesi-basliyor",
            excerpt: "Çanakkale Boğazı'na yapılacak ikinci köprü projesi için hazırlıklar başladı. 2030'da bitmesi planlanıyor.",
            content: `
<h2>İkinci Köprü İçin Kollar Sıvandı</h2>
<p>Çanakkale Boğazı geçişini daha da rahatlatmak amacıyla hazırlanan yeni ulaşım master planı kapsamında, ikinci bir köprü projesinin etüt çalışmaları resmen başladı.</p>
<p>Bölge halkı ve lojistik firmaları tarafından uzun süredir talep edilen bu proje, özellikle yaz aylarında yaşanan araç kuyruklarını tamamen ortadan kaldırmayı hedefliyor.</p>
<blockquote>"Bu sadece bir ulaşım projesi değil, bölgesel kalkınma hamlesidir."</blockquote>
<p>Proje detaylarına göre köprü sadece araç trafiğine değil, gelecekteki demiryolu entegrasyonuna da uygun olarak inşa edilecek. 2030 yılına kadar tamamlanması öngörülen projenin ÇED (Çevresel Etki Değerlendirilmesi) süreci önümüzdeki ay başlatılacak.</p>
            `,
            categoryId: gundem.id, authorId: elif.id,
            coverImage: "https://picsum.photos/seed/news1/800/450",
            status: "PUBLISHED", viewCount: 1540,
        },
        {
            title: "Çanakkale'de Sel Uyarısı: Meteoroloji'den Kritik Açıklama",
            slug: "canakkale-sel-uyarisi-meteoroloji",
            excerpt: "Meteoroloji'den Çanakkale için 48 saatlik kuvvetli yağış uyarısı. Belediye ekipleri teyakkuzda.",
            content: "<p>Önümüzdeki iki gün boyunca...</p>",
            categoryId: gundem.id, authorId: mehmet.id,
            coverImage: "https://picsum.photos/seed/news2/800/450",
            status: "PUBLISHED", viewCount: 890,
        },
        {
            title: "Çanakkale Belediyesi'nden Ücretsiz Ulaşım Kararı",
            slug: "canakkale-belediyesi-ucretsiz-ulasim",
            excerpt: "Ramazan Bayramı boyunca Çanakkale genelinde toplu taşıma araçları ücretsiz hizmet verecek.",
            content: "<p>Belediye başkanı yaptığı açıklamada...</p>",
            categoryId: gundem.id, authorId: elif.id,
            coverImage: "https://picsum.photos/seed/news3/800/450",
            status: "PUBLISHED", viewCount: 2210,
        },
        {
            title: "Çanakkale Boğazı'nda Yoğun Sis Nedeniyle Transit Geçişler Durduruldu",
            slug: "canakkale-bogazi-yogun-sis-transit-gecisler",
            excerpt: "Görüş mesafesinin düşmesi sebebiyle boğaz çift yönlü olarak transit gemi geçişlerine kapatıldı.",
            content: "<p>Boğaz trafiği sis nedeniyle durdu...</p>",
            categoryId: gundem.id, authorId: elif.id,
            coverImage: "https://picsum.photos/seed/news4/800/450",
            status: "PUBLISHED", viewCount: 340,
        },
        {
            title: "ÇOMÜ 2026-2027 Akademik Yılı Vizyonunu Açıkladı",
            slug: "comu-2026-2027-akademik-yili-vizyonu",
            excerpt: "Çanakkale Onsekiz Mart Üniversitesi rektörlüğü, önümüzdeki yıl açılacak yeni vizyon bölümlerini tanıttı.",
            content: "<p>Yeni açılan yapay zeka bölümü...</p>",
            categoryId: gundem.id, authorId: fatma.id,
            coverImage: "https://picsum.photos/seed/news5/800/450",
            status: "PUBLISHED", viewCount: 520,
        },
        {
            title: "Ayvacık Depremi Sonrası Konteyner Kentlerde Son Durum",
            slug: "ayvacik-depremi-sonrasi-konteyner-kentler",
            excerpt: "Geçtiğimiz yıl yaşanan deprem sonrası kurulan alanlarda kışa hazırlık çalışmaları tamamlandı.",
            content: `
<h2>Konteyner Kentlerde Kış Hazırlığı Tamam</h2>
<p>Ayvacık ilçesinde meydana gelen ve bölgeyi derinden etkileyen depremin yaraları sarılmaya devam ediyor. Geçtiğimiz yıl kurulan konteyner kentlerde, yaklaşan zorlu kış şartlarına karşı Valilik koordinesinde yürütülen altyapı güçlendirme çalışmaları nihayet tamamlandı.</p>
<p>Ekipler, özellikle çatı izolasyonları, ısıtma sistemlerinin bakımı ve ortak kullanım alanlarının kışa uygun hale getirilmesi konularında yoğun mesai harcadı.</p>
<h3>Yapılan Başlıca Çalışmalar:</h3>
<ul>
  <li>Tüm barınakların çatı izolasyonları yenilendi.</li>
  <li>Elektrik altyapısı güçlendirildi ve jeneratör destekleri sağlandı.</li>
  <li>Ortak sosyal alanlara kapalı ısıtma sistemleri eklendi.</li>
</ul>
<p>Depremzede vatandaşlar, yapılan çalışmalardan duydukları memnuniyeti dile getirirken, kalıcı konutların teslim tarihlerinin öne çekilmesi yönündeki taleplerini de yetkililere iletmeye devam ediyor.</p>
            `,
            categoryId: gundem.id, authorId: caner.id,
            coverImage: "https://picsum.photos/seed/news6/800/450",
            status: "PUBLISHED", viewCount: 910,
        },

        // --- KÜLTÜR & SANAT ---
        {
            title: "Troia Festivali 2026 Programı Açıklandı",
            slug: "troia-festivali-2026-programi",
            excerpt: "Bu yıl 63'üncüsü düzenlenecek Uluslararası Troia Festivali'nin sahne alacak sanatçıları ve etkinlik takvimi belli oldu.",
            content: "<p>Festival kapsamında dünyaca ünlü...</p>",
            categoryId: kultur.id, authorId: fatma.id,
            coverImage: "https://picsum.photos/seed/news7/800/450",
            status: "PUBLISHED", viewCount: 1850,
        },
        {
            title: "Çanakkale Müzesi Yeni Koleksiyon Sergiliyor",
            slug: "canakkale-muzesi-yeni-koleksiyon",
            excerpt: "Çanakkale Arkeoloji Müzesi, 300'den fazla eserin yer aldığı yeni sergisini açtı.",
            content: "<p>Müze müdürü yaptığı konuşmada...</p>",
            categoryId: kultur.id, authorId: fatma.id,
            coverImage: "https://picsum.photos/seed/news8/800/450",
            status: "PUBLISHED", viewCount: 630,
        },
        {
            title: "Çanakkale Savaşları Araştırma Merkezi Kütüphanesi Açıldı",
            slug: "canakkale-savaslari-arastirma-merkezi-kutuphanesi",
            excerpt: "Tarih meraklıları ve araştırmacılar için binlerce yeni nadir eseri barındıran kütüphane ziyarete açıldı.",
            content: "<p>Ecdadın mirasına sahip çıkıyoruz...</p>",
            categoryId: kultur.id, authorId: fatma.id,
            coverImage: "https://picsum.photos/seed/news9/800/450",
            status: "PUBLISHED", viewCount: 410,
        },
        {
            title: "Kilitbahir Kalesi'nde Yaz Konserleri Başladı",
            slug: "kilitbahir-kalesi-yaz-konserleri",
            excerpt: "Tarihi kalede düzenlenen senfoni orkestrası konseri sanatseverleri büyüledi.",
            content: "<p>Harika bir müzik şöleniydi...</p>",
            categoryId: kultur.id, authorId: elif.id,
            coverImage: "https://picsum.photos/seed/news10/800/450",
            status: "PUBLISHED", viewCount: 780,
        },

        // --- SPOR ---
        {
            title: "Çanakkale'de Boğaz Maratonu Kayıtları Başladı",
            slug: "canakkale-bogaz-maratonu-kayitlari",
            excerpt: "Gelenekselleşen Çanakkale Boğazı Yarı Maratonu için binlerce sporcu bekleniyor.",
            content: "<p>Eceabat'tan başlayacak olan...</p>",
            categoryId: spor.id, authorId: mehmet.id,
            coverImage: "https://picsum.photos/seed/news11/800/450",
            status: "PUBLISHED", viewCount: 1120,
        },
        {
            title: "Çanakkale 1915 Spor Kulübü Şampiyonluk Peşinde",
            slug: "canakkale-1915-sampiyonluk",
            excerpt: "Çanakkale 1915 Spor Kulübü, ligde liderliğini koruyarak tarihinde ilk kez 2. Lig'e çıkmayı hedefliyor.",
            content: "<p>Takım kaptanı destek çağrısı yaptı...</p>",
            categoryId: spor.id, authorId: mehmet.id,
            coverImage: "https://picsum.photos/seed/news12/800/450",
            status: "PUBLISHED", viewCount: 950,
        },
        {
            title: "Çanakkale Belediyespor Sultanlar Ligi Yolunda",
            slug: "canakkale-belediyespor-sultanlar-ligi",
            excerpt: "Kadın voleybol takımımız, kritik virajda rakibini 3-1 mağlup ederek play-off biletini garantiledi.",
            content: "<p>Kızlarımız harika oynadı...</p>",
            categoryId: spor.id, authorId: caner.id,
            coverImage: "https://picsum.photos/seed/news13/800/450",
            status: "PUBLISHED", viewCount: 1400,
        },
        {
            title: "Saros Körfezi'nde Uluslararası Rüzgar Sörfü Şampiyonası",
            slug: "saros-korfezi-ruzgar-sorfu-sampiyonasi",
            excerpt: "Dünyanın dört bir yanından gelen rüzgar sörfü sporcuları Saros'ta hünerlerini sergileyecek.",
            content: "<p>Büyük heyecan başlıyor...</p>",
            categoryId: spor.id, authorId: mehmet.id,
            coverImage: "https://picsum.photos/seed/news14/800/450",
            status: "PUBLISHED", viewCount: 880,
        },

        // --- EKONOMİ ---
        {
            title: "Çanakkale'de Yeni Sanayi Bölgesi Kuruluyor",
            slug: "canakkale-yeni-sanayi-bolgesi",
            excerpt: "Biga istikametinde kurulacak olan yeni sanayi gölgesi, binlerce kişiye istihdam sağlayacak.",
            content: "<p>Sanayi ve Teknoloji Bakanı öncülüğünde...</p>",
            categoryId: ekonomi.id, authorId: caner.id,
            coverImage: "https://picsum.photos/seed/news15/800/450",
            status: "PUBLISHED", viewCount: 2100,
        },
        {
            title: "Çanakkale Zeytinyağı İhracatında Rekor",
            slug: "canakkale-zeytinyagi-ihracati",
            excerpt: "Çanakkale zeytinyağı ihracatı %42 artarak 85 milyon dolara ulaştı. 24 ülkede talep görüyor.",
            content: "<p>Edremit körfezi sınırındaki ezine ve ayvacık ilçeleri...</p>",
            categoryId: ekonomi.id, authorId: caner.id,
            coverImage: "https://picsum.photos/seed/news16/800/450",
            status: "PUBLISHED", viewCount: 1300,
        },
        {
            title: "Biga OSB'de Yeni Fabrikaların Temeli Atılıyor",
            slug: "biga-osb-yeni-fabrikalar",
            excerpt: "Ağır sanayi yatırımlarının adresi Biga OSB'de 3 yeni çelik üretim ve döküm fabrikasının temeli atıldı.",
            content: "<p>Bölge ekonomisine dev katkı...</p>",
            categoryId: ekonomi.id, authorId: caner.id,
            coverImage: "https://picsum.photos/seed/news17/800/450",
            status: "PUBLISHED", viewCount: 670,
        },

        // --- TURİZM ---
        {
            title: "Çanakkale Turizmi Rekor Kırıyor: 5 Milyon Ziyaretçi",
            slug: "canakkale-turizmi-rekor-kiriyor",
            excerpt: "Çanakkale, bu yıl ağırladığı 5 milyonun üzerinde yerli ve yabancı turistle tarihi bir rekora imza attı.",
            content: "<p>Geçen yıla oranla %20 artış oldu...</p>",
            categoryId: turizm.id, authorId: mehmet.id,
            coverImage: "https://picsum.photos/seed/news18/800/450",
            status: "PUBLISHED", viewCount: 3200,
        },
        {
            title: "Gelibolu Yarımadası Yeni Turizm Rotası Açılıyor",
            slug: "gelibolu-yarimadasi-yeni-turizm-rotasi",
            excerpt: "Gelibolu'da 45 km'lik yeni 'Barış ve Tarih Yolu' rotası mayıs ayında açılıyor.",
            content: "<p>Rota üzerinde 12 yeni köy ve siper müzesi bulunuyor...</p>",
            categoryId: turizm.id, authorId: fatma.id,
            coverImage: "https://picsum.photos/seed/news19/800/450",
            status: "PUBLISHED", viewCount: 1750,
        },
        {
            title: "Çanakkale'de Butik Otel Sayısı Hızla Artıyor",
            slug: "canakkale-butik-otel-sayisi-artiyor",
            excerpt: "Çanakkale'de ilk yılda 32 yeni butik otel açıldı. Bozcaada ve Gökçeada yoğun ilgi görüyor.",
            content: "<p>Özellikle taş ev tarzı otellere yabancı turist akını var...</p>",
            categoryId: turizm.id, authorId: caner.id,
            coverImage: "https://picsum.photos/seed/news20/800/450",
            status: "PUBLISHED", viewCount: 650,
        },

        // --- İLÇELER HABERLERİ ---
        {
            title: "Biga OSB'de Yeni Fabrikalar Yükseliyor",
            slug: "biga-osb-dev-yatirimlar",
            excerpt: "Biga Organize Sanayi Bölgesi'ne yatırım yapan 3 yeni fabrikanın temeli atıldı.",
            content: `<h2>Biga'ya Dev Yatırım</h2><p>Biga Organize Sanayi Bölgesi genişlemeye devam ediyor. Bölgeye ciddi istihdam sağlayacak 3 dev fabrikanın temeli devlet yetkililerinin katılımıyla atıldı.</p><p>Fabrikalar tamamlandığında bölge ekonomisine yıllık 500 milyon lira katkı sağlaması hedefleniyor.</p>`,
            categoryId: biga.id, authorId: caner.id,
            coverImage: "https://picsum.photos/seed/news21/800/450",
            status: "PUBLISHED", viewCount: 1420,
        },
        {
            title: "Çan Termik Santrali Filtre Sistemleri Yenileniyor",
            slug: "can-termik-santrali-filtre",
            excerpt: "İlçe halkının uzun süredir talep ettiği santral baca filtrelerinin modernizasyon projesi resmen başladı.",
            content: `<h2>Temiz Hava Çan İçin Önemli</h2><p>İlçenin havasını etkileyen termik santralin eski filtreleri tamamen söküldü. Yerine Avrupa standartlarında son teknoloji emisyon filtre sistemleri kuruluyor.</p><p>Yetkililer yaz sonuna kadar montajın biteceğini müjdeledi.</p>`,
            categoryId: can.id, authorId: mehmet.id,
            coverImage: "https://picsum.photos/seed/news22/800/450",
            status: "PUBLISHED", viewCount: 890,
        },
        {
            title: "Ayvacık Sahillerinde Erken Turizm Hareketliliği",
            slug: "ayvacik-sahilleri-turizm",
            excerpt: "Havaların erken ısınmasıyla birlikte Assos ve Küçükkuyu sahilleri bahar aylarında yerli ve yabancı turist akınına uğradı.",
            content: `<h2>Baharda Yaz Havası</h2><p>Normal şartlarda Haziran'da başlayan sezon, Ayvacık sahillerinde bu yıl Nisan'da açıldı. Otellerdeki doluluk oranları şimdiden yüzde 70'i aştı.</p><ul><li>Bölge esnafı sezondan umutlu.</li><li>Tarihi alanlarda ziyaretçi rekoru kırıldı.</li></ul>`,
            categoryId: ayvacik.id, authorId: elif.id,
            coverImage: "https://picsum.photos/seed/news23/800/450",
            status: "PUBLISHED", viewCount: 2150,
        },
        {
            title: "Gelibolu Tarihi Yarımada'da Yeni Yürüyüş Rotaları",
            slug: "gelibolu-tarihi-yarimada-yuruyus",
            excerpt: "Tarihi Milli Park sınırları içerisindeki cephe hatlarını birbirine bağlayan doğa dostu 4 yeni trekking parkuru açıldı.",
            content: `<h2>Tarihe Yürüyüş</h2><p>1915 Çanakkale Savaşları Araştırma Merkezi, doğaseverler ve tarih meraklıları için eski cephe patikalarını temizleyerek yürüyüş rotaları oluşturdu.</p><p>Rotalar boyunca karekod destekli bilgilendirme tabelaları da yerleştirildi.</p>`,
            categoryId: gelibolu.id, authorId: fatma.id,
            coverImage: "https://picsum.photos/seed/news24/800/450",
            status: "PUBLISHED", viewCount: 1730,
        },
        {
            title: "Ezine Peyniri İçin Coğrafi İşaret Denetimleri Sıkılaştı",
            slug: "ezine-peyniri-denetim",
            excerpt: "Türkiye'nin en ünlü peynir markası olan Ezine peynirinin sahtelerine karşı denetim ekipleri seferber oldu.",
            content: `<h2>Orijinal Lezzete Koruma</h2><p>Coğrafi sınırları belli sütlerden üretilmesi gereken Ezine Peyniri adını haksız kullanan firmalara karşı hem yerel yönetimler hem de Tarım Müdürlüğü ekipleri şok baskınlar düzenledi.</p>`,
            categoryId: ezine.id, authorId: caner.id,
            coverImage: "https://picsum.photos/seed/news25/800/450",
            status: "PUBLISHED", viewCount: 3010,
        }
    ];

    for (const news of newsData) {
        const publishedAt = new Date();
        publishedAt.setDate(publishedAt.getDate() - Math.floor(Math.random() * 10));
        await prisma.news.create({ data: { ...news, publishedAt } });
    }

    console.log("✅ Yeni yazarlar ve 20 haber oluşturuldu!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

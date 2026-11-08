# Tuğrul ile Çalış

Ders kaynaklarıyla çalışmak için Türkçe bir uygulama. Yerel modda Qwen2.5 0.5B Instruct'ın 4-bit ONNX sürümü tarayıcıdaki bir Web Worker'da çalışır; API anahtarı gerekmez. Konu anlatımı, soru-cevap kartları, quiz ve kaynak hakkında sohbet becerileri sunar. İsteğe bağlı Gemini modu da vardır.

## Çalıştırma

```bash
npm install
npm run dev
```

Yerel model ilk çalıştırmada Hugging Face üzerinden yaklaşık 400 MB indirir ve tarayıcı önbelleğine alınabilir. İndirme için internet ve yeterli disk/bellek gerekir; önbelleğin silinmesi yeniden indirmeyi gerektirebilir. WebGPU destekli bir tarayıcı ve cihaz önerilir; yoksa WASM/CPU denenir ve çok yavaş olabilir. Model dosyaları projeye dahil değildir. Uygulamanın kendisinin ve önbelleğe alınmamış kaynaklarının yüklenmesi de ağ erişimi gerektirir.

PDF'de seçilebilir metin, DOCX, TXT ve Markdown yerel olarak okunur. Yerel metin modeli görsel veya taranmış PDF'leri okuyamaz. Uzun kaynaklar küçük bölümlere ayrılır; model yalnızca seçilen bölümü görür. Küçük modelin Türkçe ve özellikle yapılandırılmış quiz/kart çıktıları sınırlı olabilir; bazen tekrar denemek gerekebilir. Yanıtları mutlaka kaynakla doğrulayın.

Gemini modunda Google AI Studio API anahtarı gerekir. Ücretsiz kota ve erişim Google'ın koşullarına ve bölgeye bağlıdır; faturalandırma ayarlarını kontrol edin. Bu modda kaynaklar doğrudan Google'a gönderilir. Anahtar ve yüklenen kaynaklar yenilemede silinir; kaydedilen kartlar, görevler ve ilerleme tarayıcının yerel depolamasında tutulur.

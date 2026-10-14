Däcklager — PWA för Android (svenskt gränssnitt)

INNEHÅLL
- index.html
- manifest.json
- sw.js
- functions/api/ocr.js (säker serverfunktion för handskrifts-OCR)
- README.txt

VIKTIGT OM HANDSKRIFT
OCR-anropet använder Google Cloud Vision API med DOCUMENT_TEXT_DETECTION och engelsk språkledtråd. Tjänsten kan läsa både tryckt text och handskrift, men handskriftsresultat varierar med penna, bildskärpa och skrivstil. All OCR-text måste kontrolleras manuellt. Den här mallen kan inte lova en viss noggrannhet.

INSTALLATION PÅ GRATIS HTTPS-VÄRD
1. Skapa ett Cloudflare Pages-projekt från en Git-repository och ladda upp hela mappens innehåll, inklusive functions/api/ocr.js. Funktionen måste distribueras som Pages Function; enbart uppladdning av statiska filer räcker inte.
2. Skapa ett Google Cloud-projekt, aktivera Cloud Vision API och konfigurera API-nyckel samt eventuell fakturering/kvot enligt Google Cloud.
3. I Cloudflare Pages: Settings > Variables and Secrets, lägg till secret med namnet GOOGLE_CLOUD_VISION_API_KEY. Lägg aldrig nyckeln i index.html.
4. Distribuera och öppna HTTPS-adressen i Chrome på Android. Välj Install app / Add to Home screen.
5. Testa först med några kopior av etiketter innan registret används i skarpt läge.

PRIVACY
- Bilder skickas till Google Cloud Vision via den serverfunktion du distribuerar.
- Koden skriver inte bilder till IndexedDB eller annan beständig lagring och svaren markeras no-store.
- Bilden och OCR-texten kan behandlas av OCR-leverantören enligt dess villkor och loggningspolicy; läs leverantörens villkor innan du använder riktiga kunduppgifter.
- Bilderna väljs och hålls tillfälligt i webbläsarminnet och skickas för analys; programmet sparar endast fälten du själv sparar.
- Kundposter lagras lokalt i webbläsarens IndexedDB på den aktuella enheten. De synkroniseras inte automatiskt till andra enheter.
- Exportera JSON regelbundet. CSV-export finns för kalkylblad.
- Google Cloud Vision kan medföra kostnad eller begränsningar beroende på konto och användning. Gratis HTTPS-hosting innebär inte att OCR-tjänsten är gratis.

FUNKTIONER
- Svenskt gränssnitt.
- Ny post, redigering, sökning på bil, registreringsnummer, telefon, ägare, plats och anteckningar.
- Foto med kamera och val av flera bilder.
- OCR-resultat förs som förslag till formuläret, aldrig sparas automatiskt.
- Lokal lagring och JSON/CSV-export samt JSON-import.
- PWA-cache för appens skal. OCR kräver internet.

import fitz  # PyMuPDF
import io
import os
from PIL import Image

def extract_images_from_pdf_to_jpg(pdf_path):
    # Erstelle einen neuen Ausgabeordner für die JPGs
    base_dir = os.path.dirname(pdf_path)
    output_dir = os.path.join(base_dir, "Extrahierte_Bilder_JPG")
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Öffne die PDF-Datei
    try:
        pdf_document = fitz.open(pdf_path)
    except Exception as e:
        print(f"Fehler beim Öffnen der PDF: {e}")
        return

    image_counter = 0

    # Gehe durch alle Seiten der PDF
    for page_num in range(len(pdf_document)):
        page = pdf_document.load_page(page_num)
        image_list = page.get_images(full=True)

        # Gehe durch alle Bilder auf der aktuellen Seite
        for img_index, img in enumerate(image_list):
            xref = img[0]
            
            # Extrahiere die Bilddaten
            base_image = pdf_document.extract_image(xref)
            image_bytes = base_image["image"]

            try:
                # Lade das Bild mit Pillow (PIL)
                image = Image.open(io.BytesIO(image_bytes))

                # Zwingende Konvertierung in RGB, da JPG keine Transparenz (RGBA) unterstützt
                if image.mode in ("RGBA", "P", "CMYK"):
                    image = image.convert("RGB")

                # Definiere den Dateinamen als .jpg
                image_counter += 1
                filename = f"bild_{image_counter:03d}.jpg"
                output_path = os.path.join(output_dir, filename)

                # Speichere das Bild (Pillow benötigt "jpeg" als Formatname für .jpg)
                image.save(output_path, "jpeg", quality=85)
                print(f"Gespeichert: {output_path}")
                
            except Exception as e:
                print(f"Fehler beim Verarbeiten von Bild {image_counter + 1} auf Seite {page_num + 1}: {e}")

    pdf_document.close()
    print(f"\nFertig! Es wurden insgesamt {image_counter} Bilder in '{output_dir}' gespeichert.")

# Dein Dateipfad
pdf_file_path = r"C:\Users\Andi\Desktop\Ursl60\20260511171812041.pdf"

# Skript ausführen
extract_images_from_pdf_to_jpg(pdf_file_path)
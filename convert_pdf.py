import fitz
import sys

def convert_pdf_to_png(pdf_path, output_path):
    try:
        # Abre el documento
        doc = fitz.open(pdf_path)
        # Selecciona la primera página
        page = doc.load_page(0)
        # Renderiza a imagen (ajustando la resolución con el matrix, 2.0 es equivalente a un DPI alto)
        mat = fitz.Matrix(3.0, 3.0)
        pix = page.get_pixmap(matrix=mat, alpha=True)
        # Guarda como png
        pix.save(output_path)
        print(f"Conversión exitosa: {output_path}")
        doc.close()
    except Exception as e:
        print(f"Error al convertir: {e}")
        sys.exit(1)

if __name__ == "__main__":
    convert_pdf_to_png(r"C:\Users\josem\Downloads\Logo Crear.pdf", r"src\assets\logo-crear.png")

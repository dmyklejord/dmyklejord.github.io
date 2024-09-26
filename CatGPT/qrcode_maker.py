import qrcode
from PIL import Image
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer

def create_custom_qr(url, output_file, fill_color="#000000", back_color="#FFFFFF", logo_path=None):
    # Create QR code instance
    qr = qrcode.QRCode(version=None, box_size=10, border=4, error_correction=qrcode.constants.ERROR_CORRECT_H)
    
    # Add data
    qr.add_data(url)
    qr.make(fit=True)

    # Create an image from the QR Code instance
    img = qr.make_image(fill_color=fill_color, back_color=back_color, image_factory=StyledPilImage, module_drawer=RoundedModuleDrawer())

    # If logo is provided, add it to the center of the QR code
    if logo_path:
        logo = Image.open(logo_path)
        
        # Calculate the size of the logo (e.g., 1/4 of the QR code size)
        basewidth = int(img.size[0] / 4)
        wpercent = (basewidth / float(logo.size[0]))
        hsize = int((float(logo.size[1]) * float(wpercent)))
        logo = logo.resize((basewidth, hsize), Image.LANCZOS)
        
        # Calculate position to paste the logo
        pos = ((img.size[0] - logo.size[0]) // 2, (img.size[1] - logo.size[1]) // 2)
        
        # Create a white background for the logo
        logo_bg = Image.new("RGBA", logo.size, (255, 255, 255, 255))
        img.paste(logo_bg, pos, logo_bg)
        img.paste(logo, pos, logo)

    # Save the image
    img.save(output_file)
    print(f"QR code saved as {output_file}")

# Example usage
create_custom_qr(
    url="https://dmyklejord.github.io/CatGPT",
    output_file="home_qr_code.png",
    fill_color="#0000FF",  # Blue
    back_color="#FFFFFF",  # White
    #logo_path="path/to/your/logo.png"  # Optional: path to your logo file
)
# Example usage
create_custom_qr(
    url="https://dmyklejord.github.io/CatGPT/d6k/",
    output_file="d6k_qr_code.png",
    fill_color="#0000FF",  # Blue
    back_color="#FFFFFF",  # White
    # logo_path="website/d6k_art.png"  # Optional: path to your logo file
)
# Example usage
create_custom_qr(
    url="https://dmyklejord.github.io/CatGPT/349dl/",
    output_file="349dl_qr_code.png",
    fill_color="#0000FF",  # Blue
    back_color="#FFFFFF",  # White
    # logo_path="website/349dl_art.png"  # Optional: path to your logo file
)
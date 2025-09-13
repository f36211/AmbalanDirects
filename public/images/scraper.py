import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from PIL import Image
from io import BytesIO
import re

# Function to create a valid filename from URL
def get_valid_filename(url):
    # Extract filename from URL
    parsed = urlparse(url)
    filename = os.path.basename(parsed.path)
    
    # If no filename is found, create one based on URL hash
    if not filename or '.' not in filename:
        return f"image_{hash(url) % 10000:04d}.jpg"
    
    # Remove invalid characters from filename
    filename = re.sub(r'[\\/*?:"<>|]', "", filename)
    return filename

# Function to save the image after detecting and converting format if needed
def save_image(img_data, save_path):
    try:
        img = Image.open(BytesIO(img_data))  # Open image from bytes
        
        # Get the file extension from the original format
        img_format = img.format.lower() if img.format else "jpg"
        
        # Ensure save_path has the correct extension
        base_path = os.path.splitext(save_path)[0]
        save_path = f"{base_path}.{img_format}"
        
        # Convert webp to png if needed
        if img_format == 'webp':
            save_path = f"{base_path}.png"
            img = img.convert('RGBA')  # Convert to RGBA for transparency support
        
        img.save(save_path)
        print(f"Saved {save_path}")
        return True
    except Exception as e:
        print(f"Error saving image: {e}")
        return False

# Function to download and save all images from the website
def download_images(url, download_location):
    # Create a session for better performance
    session = requests.Session()
    
    try:
        # Send a GET request to the website with a user agent
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = session.get(url, headers=headers, timeout=10)
        response.raise_for_status()  # Raise an exception for bad status codes
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the URL: {e}")
        return
   
    # Parse the content with BeautifulSoup
    soup = BeautifulSoup(response.text, 'html.parser')
   
    # Find all img tags
    images = soup.find_all('img')
    
    if not images:
        print("No images found on the page.")
        return
   
    # Create a folder to save the images if it doesn't exist
    if not os.path.exists(download_location):
        os.makedirs(download_location)
        
    # Keep track of successfully downloaded images
    downloaded_count = 0
    
    # Download and save images
    for i, img in enumerate(images):
        # Check for src or data-src attributes (many sites use data-src for lazy loading)
        src = img.get('src') or img.get('data-src') or img.get('data-original')
        
        if not src:
            continue
            
        # Skip base64 encoded images and SVGs
        if src.startswith('data:'):
            print(f"Skipping base64 encoded image")
            continue
            
        # Ensure the src is a full URL (combine with the base URL if needed)
        img_url = urljoin(url, src)
        
        try:
            # Get the image's content
            img_response = session.get(img_url, headers=headers, timeout=10)
            img_response.raise_for_status()
            
            # Create a filename based on the URL
            filename = get_valid_filename(img_url)
            
            # Set the save path
            save_path = os.path.join(download_location, f'image_{i + 1}_{filename}')
            
            # Save the image
            if save_image(img_response.content, save_path):
                downloaded_count += 1
                
        except requests.exceptions.RequestException as e:
            print(f"Error downloading image {img_url}: {e}")
        except Exception as e:
            print(f"Error processing image {img_url}: {e}")
    
    if downloaded_count > 0:
        print(f"Successfully downloaded {downloaded_count} images!")
    else:
        print("No images were downloaded. Please check the URL and try again.")

# Input URL and download location
def main():
    url = input("Enter the URL to scrape: ")
    download_location = input("Enter the folder to save images (e.g., './images'): ")
    
    # Call the function to download and save images
    download_images(url, download_location)

if __name__ == "__main__":
    main()
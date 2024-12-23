import os
import time
from huggingface_hub import InferenceClient
from requests.exceptions import HTTPError

# Initialize the client with your API key and model
client = InferenceClient(token=os.getenv("HUGGING_FACE_API_KEY"))

def generate_image(pokemon: str, uuid: str, description: str, image_location: str, retries: int = 3, delay: int = 5):
    prompt = (
        f"The UUID MUST {uuid} is artistically embedded in the background "
        f"A highly detailed, NFT-style artwork of the Pokémon {pokemon}, featuring a futuristic and vibrant design. "
        f"The UUID MUST {uuid} is artistically embedded in the background "
        "The artwork is colorful, dynamic, and visually striking, perfect for a collectible."
        f"This is how the pokemon looks: {description}"
    )
    
    models = ["black-forest-labs/FLUX.1-schnell", "Datou1111/shou_xin", "cagliostrolab/animagine-xl-3.1", "stabilityai/stable-diffusion-3.5-large"]
    model = models[0]

    print(f"Chosen model: {model}")

    attempt = 0
    while attempt < retries:
        try:
            # Generate the image
            image = client.text_to_image(prompt, model=model)
            
            # Ensure the directory exists
            directory = os.path.dirname(image_location)
            if not os.path.exists(directory):
                os.makedirs(directory, exist_ok=True)
            
            # Remove the existing file if it exists
            if os.path.exists(image_location):
                os.remove(image_location)
            
            # Save the image
            image.save(image_location)
            print(f"Image generated and saved: '{image_location}'")
            return  # Exit the function after successfully saving the image
        
        except HTTPError as e:
            print(f"Attempt {attempt + 1} failed with error: {e}. Retrying in {delay} seconds...")
            attempt += 1
            time.sleep(delay)
    
    print(f"Failed to generate image after {retries} attempts.")

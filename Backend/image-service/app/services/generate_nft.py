import time
from .description_generator import GeminiLLM
from .image_generation import generate_image
# from app.celery_app import celery_app
from celery import shared_task

# @celery_app.task
@shared_task
def generate_nft_async(pokemon:str, uuid:str, image_location:str):
    start_time = time.time()
    print(f"Starting async function at ${start_time}")

    # generate prompt
    model = GeminiLLM()
    description = model.run(pokemon=pokemon, uuid=uuid)
    description_generation_end_time = time.time()

    # generate image
    generate_image(pokemon=pokemon, uuid=uuid, description=description, image_location=image_location)
    end_time = time.time()

    # debug logs
    description_execution_time = description_generation_end_time - start_time
    image_generation_time = end_time - description_generation_end_time
    total_execution_time = end_time - start_time
    print(f"function took {total_execution_time:.5f} seconds to execute.")
    print(f"prompt took {description_execution_time:.5f} seconds to execute.")
    print(f"image took {image_generation_time:.5f} seconds to execute.")
    print(f"NFT generation for {pokemon} with UUID {uuid} completed.")
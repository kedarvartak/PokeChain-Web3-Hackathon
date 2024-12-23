from flask import Blueprint, request, jsonify, send_from_directory, abort
import uuid
import os
import requests
from PIL import Image
from io import BytesIO

from .db import query
from .services.generate_nft import generate_nft_async
from .services.helper import get_pokemon_name

main = Blueprint('main', __name__)

@main.route('/items', methods=['GET'])
def get_items():
    sql = "SELECT * FROM pokemons"
    items = query(sql)
    return jsonify(items)


@main.route('/images/<wallet>/<uuid>', methods=['GET'])
def serve_image(wallet, uuid):
    wallet = "public/" + wallet
    image_directory = os.path.join(os.getcwd(), wallet)
    image_filename = f"{uuid}.png"

    # Check if the file exists
    if not os.path.exists(os.path.join(image_directory, image_filename)):
        abort(404, description="Image not found")

    # Serve the image
    return send_from_directory(image_directory, image_filename)


@main.route('/nft', methods=['POST'])
def nft():
    if  request.method == "POST":
        data = request.json
        pokemon_id = int(data.get("pokemon_id"))
        # pokemon_id = 7
        wallet_address = data.get("wallet_address")
        # wallet_address = "123"
        if not pokemon_id or not wallet_address:
            return jsonify({"error": "pokemon_id and wallet_address are required"}), 400

        # generate a uuid 
        image_uuid = str(uuid.uuid4())
        print(f"generated uuid : ${uuid}")

        # get pokemon name from pokemon id
        pokemon_name = get_pokemon_name(pokemon_id)
        print(f"pokemon name: {pokemon_name}, pokemon_id: {pokemon_id}")

        # storage location 
        # Create a new directory, exists = ok where directory name = wallet address
        cwd = os.getcwd()
        directory_path = os.path.join(cwd, f"public/{wallet_address}")
        print(f"created directory path = {directory_path}")

        os.makedirs(directory_path, exist_ok=True)
        
        # store a temporary image in the 
        temp_image_url = f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{pokemon_id}.png"
        
        # store the image to directory_path
        try:
            response = requests.get(temp_image_url)
            response.raise_for_status()  # Raise an error for bad status codes
            
            img = Image.open(BytesIO(response.content))
            image_path = os.path.join(directory_path, f"{image_uuid}.png")
            img.save(image_path)
            print(f"Temp image saved at {image_path}")
        except requests.exceptions.RequestException as e:
            return jsonify({"error": f"Failed to fetch image: {str(e)}"}), 500
        
        # The image can be accessed from this endpoint
        image_url = f"/images/{wallet_address}/{image_uuid}"

        # Store the image in DB
        sql = "INSERT INTO nfts (uuid, wallet_address, pokemon_id, nft_image_location) VALUES (%s, %s, %s, %s)"
        query(sql, [image_uuid, wallet_address, pokemon_id, image_url])

        # queue the process just after the temp image is stored.
        # the image gets replaced by the new one in the same location as above, so we don't have to deal with it
        print(f"Starting async function")
        generate_nft_async.delay(pokemon=pokemon_name, uuid=image_uuid, image_location=image_path)

        return jsonify({
            "success": "complete",
            "wallet_address": wallet_address,
            "pokemon_id": pokemon_id,
            "pokemon_name": pokemon_name,
            "uuid": image_uuid,
            "image_path": image_path,
            "image_url": image_url
        })

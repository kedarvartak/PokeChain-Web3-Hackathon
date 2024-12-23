from app.db import query

# def get_pokemon_name(pokemon_id: int) -> str:
#     # Fetch this from database
#     # Select pokemon_name from pokemons where pokemon_id = %s , pokemon_id 

#     if pokemon_id == 1:
#         return "bulbasaur"
#     elif pokemon_id == 4:
#         return "charmandar"
#     else:
#         return "squartle"

def get_pokemon_name(pokemon_id: int) -> str:
    """
    Fetch the Pokemon name from the database based on the given Pokemon ID.

    Args:
        pokemon_id (int): The ID of the Pokemon.

    Returns:
        str: The name of the Pokemon, or None if not found.
    """
    sql = "SELECT pokemon_name FROM pokemons WHERE pokemon_id = %s"
    try:
        result = query(sql, (pokemon_id,))
        if result:
            return result[0]['pokemon_name']  # Assuming the column name is pokemon_name
        else:
            return None  # Pokemon not found
    except Exception as e:
        print(f"Error fetching Pokemon name: {e}")
        return None
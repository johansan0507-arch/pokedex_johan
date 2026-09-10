"""
Pokédex en Python con Flask
Servidor backend que consulta la PokéAPI (Gen 1 - 9), procesa datos (rugidos, estadísticas, tipos, habilidades)
y los expone a la aplicación web con soporte para las 9 generaciones completas.
"""

from concurrent.futures import ThreadPoolExecutor
import json
import urllib.request
from flask import Flask, jsonify, render_template, request

app = Flask(
    __name__,
    template_folder="templates",
    static_folder="static"
)

# Configuración de las 9 Generaciones
GENERATIONS_CONFIG = {
    1: {"name": "Kanto", "offset": 0, "limit": 151},
    2: {"name": "Johto", "offset": 151, "limit": 100},
    3: {"name": "Hoenn", "offset": 251, "limit": 135},
    4: {"name": "Sinnoh", "offset": 386, "limit": 107},
    5: {"name": "Teselia", "offset": 493, "limit": 156},
    6: {"name": "Kalos", "offset": 649, "limit": 72},
    7: {"name": "Alola", "offset": 721, "limit": 88},
    8: {"name": "Galar", "offset": 809, "limit": 96},
    9: {"name": "Paldea", "offset": 905, "limit": 120},
}

# Caché en memoria por generación para responder al instante
GENERATION_CACHE = {}


def fetch_pokemon_detail(url):
    """Obtiene los detalles de un Pokémon individual."""
    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "PokedexPython/1.0"}
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode("utf-8"))
            return {
                "id": data.get("id"),
                "name": data.get("name"),
                "height": data.get("height"),
                "weight": data.get("weight"),
                "types": data.get("types", []),
                "stats": data.get("stats", []),
                "abilities": data.get("abilities", []),
                "sprites": data.get("sprites", {}),
                "cries": data.get("cries", {})
            }
    except Exception as e:
        print(f"Aviso: Error obteniendo {url}: {e}")
        return None


def load_generation(gen_id=1):
    """Carga y almacena en caché una generación específica."""
    global GENERATION_CACHE
    if gen_id in GENERATION_CACHE:
        return GENERATION_CACHE[gen_id]

    cfg = GENERATIONS_CONFIG.get(gen_id, GENERATIONS_CONFIG[1])
    offset = cfg["offset"]
    limit = cfg["limit"]

    api_url = f"https://pokeapi.co/api/v2/pokemon?offset={offset}&limit={limit}"
    try:
        req = urllib.request.Request(
            api_url,
            headers={"User-Agent": "PokedexPython/1.0"}
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            payload = json.loads(response.read().decode("utf-8"))
            results = payload.get("results", [])

            # Descarga paralela en hilos
            with ThreadPoolExecutor(max_workers=20) as executor:
                pokemon_details = list(executor.map(fetch_pokemon_detail, [r["url"] for r in results]))

            valid_pokemon = [p for p in pokemon_details if p is not None]
            valid_pokemon.sort(key=lambda x: x["id"])
            GENERATION_CACHE[gen_id] = valid_pokemon
            print(f"✓ Éxito: {len(valid_pokemon)} Pokémon de Gen {gen_id} ({cfg['name']}) cacheados.")
            return valid_pokemon
    except Exception as e:
        print(f"Error cargando Gen {gen_id}: {e}")
        return []


@app.route("/")
def index():
    """Ruta principal: renderiza la interfaz Pokédex."""
    return render_template("index.html")


@app.route("/api/pokemon")
def get_pokemon_list():
    """Endpoint API que devuelve Pokémon de una generación con filtros."""
    gen = request.args.get("gen", 1, type=int)
    q = request.args.get("q", "").strip().lower()
    poke_type = request.args.get("type", "all").strip().lower()

    pokemon_list = load_generation(gen)

    # Filtrar por tipo si se indica
    if poke_type != "all":
        pokemon_list = [
            p for p in pokemon_list
            if any(t.get("type", {}).get("name") == poke_type for t in p.get("types", []))
        ]

    # Filtrar por texto si se indica
    if q:
        pokemon_list = [
            p for p in pokemon_list
            if q in p.get("name", "").lower() or str(p.get("id")) == q
        ]

    return jsonify({
        "generation": gen,
        "count": len(pokemon_list),
        "results": pokemon_list
    })


@app.route("/api/pokemon/<id_or_name>")
def get_pokemon_detail(id_or_name):
    """Endpoint API para buscar cualquier Pokémon en todas las generaciones o en la API."""
    id_or_name = str(id_or_name).strip().lower()

    # 1. Buscar en las generaciones ya cacheadas
    for gen_list in GENERATION_CACHE.values():
        for p in gen_list:
            if str(p.get("id")) == id_or_name or p.get("name", "").lower() == id_or_name:
                return jsonify(p)

    # 2. Si no está en caché, consultar directamente a PokéAPI
    direct_url = f"https://pokeapi.co/api/v2/pokemon/{id_or_name}"
    data = fetch_pokemon_detail(direct_url)
    if data:
        return jsonify(data)

    return jsonify({"error": "Pokémon no encontrado"}), 404


if __name__ == "__main__":
    print("=" * 60)
    print(" Invocando servidor Pokédex en Python (Flask)")
    print(" Abre en tu navegador: http://127.0.0.1:5000")
    print("=" * 60)
    # Precargar Gen 1 al arrancar
    ThreadPoolExecutor(max_workers=1).submit(load_generation, 1)
    app.run(debug=True, port=5000)

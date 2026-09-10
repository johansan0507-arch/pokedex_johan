"""
Pokédex de Escritorio en Python (Tkinter)
Interfaz gráfica nativa con búsqueda de Pokémon, estadísticas y tipos.
"""

import json
import threading
import tkinter as tk
from tkinter import ttk, messagebox
import urllib.request


class PokedexApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Pokédex · Python Tkinter")
        self.root.geometry("450x650")
        self.root.configure(bg="#dc0a2d")
        self.root.resizable(False, False)

        self.setup_ui()
        # Cargar Pikachu por defecto
        self.search_pokemon("pikachu")

    def setup_ui(self):
        # Título superior
        header_frame = tk.Frame(self.root, bg="#dc0a2d", pady=10)
        header_frame.pack(fill="x")

        title_lbl = tk.Label(
            header_frame,
            text="⚡ Pokédex Python",
            font=("Segoe UI", 20, "bold"),
            fg="#ffffff",
            bg="#dc0a2d"
        )
        title_lbl.pack()

        # Barra de búsqueda
        search_frame = tk.Frame(self.root, bg="#dc0a2d", padx=20, pady=5)
        search_frame.pack(fill="x")

        self.search_entry = tk.Entry(
            search_frame,
            font=("Segoe UI", 12),
            bg="#f8f0e3",
            fg="#1e1e2a",
            relief="flat"
        )
        self.search_entry.pack(side="left", fill="x", expand=True, ipady=6, padx=(0, 10))
        self.search_entry.bind("<Return>", lambda e: self.on_search())
        self.search_entry.insert(0, "pikachu")

        search_btn = tk.Button(
            search_frame,
            text="Buscar",
            font=("Segoe UI", 10, "bold"),
            bg="#1e1e2a",
            fg="#ffffff",
            activebackground="#333344",
            activeforeground="#ffffff",
            relief="flat",
            padx=15,
            cursor="hand2",
            command=self.on_search
        )
        search_btn.pack(side="right")

        # Tarjeta de detalles del Pokémon
        self.card_frame = tk.Frame(
            self.root,
            bg="#f8f0e3",
            bd=0,
            padx=20,
            pady=15
        )
        self.card_frame.pack(fill="both", expand=True, padx=20, pady=15)

        # ID y Nombre
        self.id_label = tk.Label(
            self.card_frame,
            text="#000",
            font=("Segoe UI", 11, "bold"),
            bg="#1e1e2a",
            fg="#f8f0e3",
            padx=10,
            pady=2
        )
        self.id_label.pack(anchor="w")

        self.name_label = tk.Label(
            self.card_frame,
            text="Buscando...",
            font=("Segoe UI", 22, "bold"),
            bg="#f8f0e3",
            fg="#1e1e2a"
        )
        self.name_label.pack(pady=(5, 0))

        # Tipos
        self.types_label = tk.Label(
            self.card_frame,
            text="",
            font=("Segoe UI", 10, "bold"),
            bg="#f8f0e3",
            fg="#b0021f"
        )
        self.types_label.pack(pady=(0, 10))

        # Medidas (Altura y Peso)
        self.info_frame = tk.Frame(self.card_frame, bg="#efe4d3", padx=10, pady=8)
        self.info_frame.pack(fill="x", pady=5)

        self.height_label = tk.Label(
            self.info_frame,
            text="Altura: -- m",
            font=("Segoe UI", 10, "bold"),
            bg="#efe4d3",
            fg="#4a3f35"
        )
        self.height_label.pack(side="left", expand=True)

        self.weight_label = tk.Label(
            self.info_frame,
            text="Peso: -- kg",
            font=("Segoe UI", 10, "bold"),
            bg="#efe4d3",
            fg="#4a3f35"
        )
        self.weight_label.pack(side="right", expand=True)

        # Habilidades
        self.abilities_label = tk.Label(
            self.card_frame,
            text="Habilidades: --",
            font=("Segoe UI", 9),
            bg="#f8f0e3",
            fg="#333333",
            wraplength=380
        )
        self.abilities_label.pack(pady=8)

        # Estadísticas Base
        stats_title = tk.Label(
            self.card_frame,
            text="📊 Estadísticas Base",
            font=("Segoe UI", 11, "bold"),
            bg="#f8f0e3",
            fg="#1e1e2a"
        )
        stats_title.pack(anchor="w", pady=(10, 5))

        self.stats_container = tk.Frame(self.card_frame, bg="#f8f0e3")
        self.stats_container.pack(fill="both", expand=True)

    def on_search(self):
        query = self.search_entry.get().strip().lower()
        if not query:
            return
        threading.Thread(target=self.search_pokemon, args=(query,), daemon=True).start()

    def search_pokemon(self, query):
        url = f"https://pokeapi.co/api/v2/pokemon/{query}"
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "PokedexPython/1.0"})
            with urllib.request.urlopen(req, timeout=8) as response:
                data = json.loads(response.read().decode("utf-8"))
                self.root.after(0, self.display_pokemon, data)
        except Exception:
            self.root.after(0, lambda: messagebox.showerror("Error", f"No se encontró el Pokémon '{query}'"))

    def display_pokemon(self, data):
        # Actualizar textos
        p_id = f"{data['id']:03d}"
        self.id_label.config(text=f"#{p_id}")
        self.name_label.config(text=data["name"].capitalize())

        # Tipos
        types = [t["type"]["name"].upper() for t in data.get("types", [])]
        self.types_label.config(text="  •  ".join(types))

        # Altura y Peso
        height_m = data["height"] / 10
        weight_kg = data["weight"] / 10
        self.height_label.config(text=f"Altura: {height_m:.1f} m")
        self.weight_label.config(text=f"Peso: {weight_kg:.1f} kg")

        # Habilidades
        abilities = [a["ability"]["name"].replace("-", " ").capitalize() for a in data.get("abilities", [])]
        self.abilities_label.config(text=f"Habilidades: {', '.join(abilities)}")

        # Limpiar y regenerar estadísticas
        for widget in self.stats_container.winfo_children():
            widget.destroy()

        stat_names = {
            "hp": "PS",
            "attack": "Ataque",
            "defense": "Defensa",
            "special-attack": "Atq. Esp",
            "special-defense": "Def. Esp",
            "speed": "Velocidad"
        }

        for stat in data.get("stats", []):
            code = stat["stat"]["name"]
            label = stat_names.get(code, code.capitalize())
            val = stat["base_stat"]

            row = tk.Frame(self.stats_container, bg="#f8f0e3")
            row.pack(fill="x", pady=2)

            name_lbl = tk.Label(row, text=label, font=("Segoe UI", 8, "bold"), width=9, anchor="w", bg="#f8f0e3", fg="#5a4b3d")
            name_lbl.pack(side="left")

            val_lbl = tk.Label(row, text=str(val), font=("Segoe UI", 8, "bold"), width=4, anchor="e", bg="#f8f0e3", fg="#1e1e2a")
            val_lbl.pack(side="left", padx=(0, 8))

            progress = ttk.Progressbar(row, orient="horizontal", maximum=180, value=val)
            progress.pack(side="left", fill="x", expand=True)


if __name__ == "__main__":
    root = tk.Tk()
    app = PokedexApp(root)
    root.mainloop()

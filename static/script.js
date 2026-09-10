(function () {
  // Configuración de las 9 Generaciones de Pokémon
  const GENERATIONS = {
    1: { name: 'Kanto', offset: 0, limit: 151 },
    2: { name: 'Johto', offset: 151, limit: 100 },
    3: { name: 'Hoenn', offset: 251, limit: 135 },
    4: { name: 'Sinnoh', offset: 386, limit: 107 },
    5: { name: 'Teselia', offset: 493, limit: 156 },
    6: { name: 'Kalos', offset: 649, limit: 72 },
    7: { name: 'Alola', offset: 721, limit: 88 },
    8: { name: 'Galar', offset: 809, limit: 96 },
    9: { name: 'Paldea', offset: 905, limit: 120 }
  };

  // Traducción de métodos e ítems de evolución
  const EVO_ITEMS_MAP = {
    'thunder-stone': 'Piedra Trueno',
    'fire-stone': 'Piedra Fuego',
    'water-stone': 'Piedra Agua',
    'leaf-stone': 'Piedra Hoja',
    'moon-stone': 'Piedra Luna',
    'sun-stone': 'Piedra Solar',
    'shiny-stone': 'Piedra Día',
    'dusk-stone': 'Piedra Noche',
    'dawn-stone': 'Piedra Alba',
    'ice-stone': 'Piedra Hielo'
  };

  // Elementos del DOM
  const pokedexGrid = document.getElementById('pokedexGrid');
  const statusContainer = document.getElementById('statusContainer');
  const loaderContainer = document.getElementById('loaderContainer');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const generationSelect = document.getElementById('generationSelect');
  const pokemonCounterBadge = document.getElementById('pokemonCounterBadge');
  const typesFilterContainer = document.getElementById('typesFilterContainer');
  const pokemonModal = document.getElementById('pokemonModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBody = document.getElementById('modalBody');

  // Estado de la aplicación
  let currentSelection = '1'; // Puede ser '1'-'9', o 'mega', 'gmax'
  const cacheByGen = {}; // Caché de Pokémon por categoría/generación
  const speciesCache = {}; // Caché de datos de especie (variedades y evoluciones)
  let currentPokemonList = [];
  let selectedType = 'all';
  let searchTerm = '';
  let currentAudio = null;
  let isGlobalSearching = false;

  // Mapeo de estadísticas base
  const STATS_MAP = {
    hp: { label: 'PS', class: 'stat-fill-hp' },
    attack: { label: 'Ataque', class: 'stat-fill-attack' },
    defense: { label: 'Defensa', class: 'stat-fill-defense' },
    'special-attack': { label: 'Atq. Esp', class: 'stat-fill-special-attack' },
    'special-defense': { label: 'Def. Esp', class: 'stat-fill-special-defense' },
    speed: { label: 'Velocidad', class: 'stat-fill-speed' }
  };

  // Formato para nombres amigables (ej: Mega Charizard X, Gengar Gigamax)
  function formatPokemonDisplayName(name) {
    if (!name) return '';
    const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

    if (name.endsWith('-mega-x')) return 'Mega ' + cap(name.replace('-mega-x', '')) + ' X';
    if (name.endsWith('-mega-y')) return 'Mega ' + cap(name.replace('-mega-y', '')) + ' Y';
    if (name.endsWith('-mega')) return 'Mega ' + cap(name.replace('-mega', ''));
    if (name.endsWith('-gmax')) return cap(name.replace('-gmax', '')) + ' Gigamax';
    if (name.endsWith('-primal')) return cap(name.replace('-primal', '')) + ' Primigenio';
    if (name.endsWith('-alola')) return cap(name.replace('-alola', '')) + ' de Alola';
    if (name.endsWith('-galar')) return cap(name.replace('-galar', '')) + ' de Galar';
    if (name.endsWith('-hisui')) return cap(name.replace('-hisui', '')) + ' de Hisui';
    if (name.endsWith('-paldea')) return cap(name.replace('-paldea', '')) + ' de Paldea';

    return cap(name.replace(/-/g, ' '));
  }

  function formatVarietyLabel(baseName, varietyName) {
    if (varietyName === baseName) return 'Forma Base';
    const suffix = varietyName.replace(baseName + '-', '');
    if (suffix === 'mega') return 'Mega';
    if (suffix === 'mega-x') return 'Mega X';
    if (suffix === 'mega-y') return 'Mega Y';
    if (suffix === 'gmax') return 'Gigamax';
    if (suffix === 'primal') return 'Primigenio';
    if (suffix === 'alola') return 'Alola';
    if (suffix === 'galar') return 'Galar';
    if (suffix === 'hisui') return 'Hisui';
    if (suffix === 'paldea') return 'Paldea';
    return suffix.replace(/-/g, ' ').toUpperCase();
  }

  // ---------- Mensajes y Loader ----------
  function showStatus(message, isError = false) {
    statusContainer.textContent = message;
    statusContainer.style.display = 'block';
    statusContainer.style.background = isError ? 'rgba(180, 10, 30, 0.85)' : 'rgba(0, 0, 0, 0.45)';
    loaderContainer.style.display = 'none';
  }

  function hideStatus() {
    statusContainer.style.display = 'none';
  }

  function showLoader(text = 'Cargando Pokémon...') {
    loaderContainer.style.display = 'block';
    statusContainer.style.display = 'none';
    pokedexGrid.innerHTML = '';
  }

  function hideLoader() {
    loaderContainer.style.display = 'none';
  }

  function updateCounter(count) {
    if (pokemonCounterBadge) {
      pokemonCounterBadge.textContent = `${count} Pokémon`;
    }
  }

  // ---------- Reproducción de Rugidos (Cries) ----------
  function playCry(audioUrl, buttonElement) {
    if (!audioUrl) return;

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      document.querySelectorAll('.btn-cry, .modal-cry-btn').forEach(btn => btn.classList.remove('playing'));
    }

    const audio = new Audio(audioUrl);
    audio.volume = 0.55;
    currentAudio = audio;

    if (buttonElement) {
      buttonElement.classList.add('playing');
    }

    audio.play().catch(err => {
      console.warn('Audio no disponible o bloqueado:', err);
      if (buttonElement) buttonElement.classList.remove('playing');
    });

    audio.onended = () => {
      if (buttonElement) buttonElement.classList.remove('playing');
    };

    audio.onerror = () => {
      if (buttonElement) buttonElement.classList.remove('playing');
    };
  }

  // ---------- Carga de Especie (Evoluciones y Variedades) ----------
  async function fetchSpeciesData(pokemon) {
    let speciesId = pokemon.id;
    if (pokemon.species?.url) {
      const parts = pokemon.species.url.split('/').filter(Boolean);
      speciesId = parseInt(parts.pop(), 10);
    }

    if (speciesCache[speciesId]) {
      return speciesCache[speciesId];
    }

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${speciesId}/`);
      if (!res.ok) return null;
      const data = await res.json();
      speciesCache[speciesId] = data;
      return data;
    } catch (e) {
      console.warn('No se pudo cargar datos de especie:', e);
      return null;
    }
  }

  // ---------- Parseo de Cadena Evolutiva ----------
  function parseEvolutionNode(node) {
    const id = parseInt(node.species.url.split('/').filter(Boolean).pop(), 10);
    const current = {
      id: id,
      name: node.species.name,
      evolves_to: []
    };

    for (const evo of node.evolves_to) {
      let triggerText = 'Evolución';
      if (evo.evolution_details && evo.evolution_details.length > 0) {
        const d = evo.evolution_details[0];
        if (d.min_level) {
          triggerText = `Nv. ${d.min_level}`;
        } else if (d.item) {
          triggerText = EVO_ITEMS_MAP[d.item.name] || d.item.name.replace(/-/g, ' ');
        } else if (d.trigger?.name === 'trade') {
          triggerText = d.held_item ? `Intercambio (${d.held_item.name.replace(/-/g, ' ')})` : 'Intercambio';
        } else if (d.min_happiness) {
          triggerText = 'Amistad';
        } else if (d.known_move) {
          triggerText = `Mov. ${d.known_move.name.replace(/-/g, ' ')}`;
        } else if (d.location) {
          triggerText = `Lugar`;
        } else if (d.time_of_day) {
          triggerText = d.time_of_day === 'day' ? 'De Día' : 'De Noche';
        }
      }
      const child = parseEvolutionNode(evo);
      child.trigger = triggerText;
      current.evolves_to.push(child);
    }

    return current;
  }

  async function fetchEvolutionChainFromSpecies(speciesData) {
    if (!speciesData || !speciesData.evolution_chain?.url) return null;
    try {
      const chainRes = await fetch(speciesData.evolution_chain.url);
      if (!chainRes.ok) return null;
      const chainData = await chainRes.json();
      return parseEvolutionNode(chainData.chain);
    } catch (e) {
      return null;
    }
  }

  function renderEvolutionHtml(evoNode, currentPokemonId) {
    const formattedId = evoNode.id.toString().padStart(3, '0');
    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evoNode.id}.png`;
    const fallbackSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evoNode.id}.png`;
    const isCurrent = evoNode.id === currentPokemonId;

    let html = `
      <div class="evo-card ${isCurrent ? 'current-pokemon' : ''}" data-pokemon-id="${evoNode.id}">
        <img src="${spriteUrl}" alt="${evoNode.name}" loading="lazy" onerror="this.src='${fallbackSprite}'">
        <span class="evo-name">${formatPokemonDisplayName(evoNode.name)}</span>
        <span class="evo-id">#${formattedId}</span>
      </div>
    `;

    if (evoNode.evolves_to && evoNode.evolves_to.length > 0) {
      if (evoNode.evolves_to.length === 1) {
        const next = evoNode.evolves_to[0];
        html += `
          <div class="evo-arrow">
            <span class="evo-trigger">${next.trigger || '➔'}</span>
            <span>➔</span>
          </div>
          ${renderEvolutionHtml(next, currentPokemonId)}
        `;
      } else {
        html += `
          <div class="evo-arrow">
            <span class="evo-trigger">Varios</span>
            <span>➔</span>
          </div>
          <div class="evo-branch-group">
            ${evoNode.evolves_to
              .map(
                branch => `
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="evo-trigger">${branch.trigger || '➔'}</span>
                ${renderEvolutionHtml(branch, currentPokemonId)}
              </div>
            `
              )
              .join('')}
          </div>
        `;
      }
    }

    return html;
  }

  // ---------- Modal de Detalles con Formas (Megas y Gigamax) ----------
  async function openModal(pokemon) {
    let isModalShiny = Boolean(pokemon.isShiny);
    const formattedId = (pokemon.id || 0).toString().padStart(3, '0');
    const displayName = formatPokemonDisplayName(pokemon.name);

    const defaultArtwork =
      pokemon.sprites?.other?.['official-artwork']?.front_default ||
      pokemon.sprites?.other?.showdown?.front_default ||
      pokemon.sprites?.front_default ||
      '';

    const shinyArtwork =
      pokemon.sprites?.other?.['official-artwork']?.front_shiny ||
      pokemon.sprites?.front_shiny ||
      defaultArtwork;

    const cryUrl = pokemon.cries?.latest || pokemon.cries?.legacy || '';

    // Tipos
    const typeBadges = (pokemon.types || [])
      .map(t => `<span class="type-badge type-${t.type.name}">${t.type.name}</span>`)
      .join('');

    // Habilidades
    const abilitiesBadges = (pokemon.abilities || [])
      .map(
        a =>
          `<span class="ability-badge ${a.is_hidden ? 'hidden' : ''}">${a.ability.name.replace('-', ' ')}${
            a.is_hidden ? ' (Oculta)' : ''
          }</span>`
      )
      .join('');

    // Estadísticas
    const statsHtml = (pokemon.stats || [])
      .map(s => {
        const config = STATS_MAP[s.stat.name] || { label: s.stat.name, class: 'stat-fill-hp' };
        const percentage = Math.min(100, Math.round((s.base_stat / 200) * 100));
        return `
          <div class="stat-row">
            <span class="stat-name">${config.label}</span>
            <span class="stat-val">${s.base_stat}</span>
            <div class="stat-bar-container">
              <div class="stat-bar-fill ${config.class}" style="width: ${percentage}%"></div>
            </div>
          </div>
        `;
      })
      .join('');

    const heightMeters = (pokemon.height / 10).toFixed(1);
    const weightKg = (pokemon.weight / 10).toFixed(1);

    modalBody.innerHTML = `
      <div class="modal-header-section">
        <span class="modal-id-badge">#${formattedId}</span>
        <h2 class="modal-title">${displayName}</h2>
        <div class="pokemon-types">${typeBadges}</div>
      </div>

      <!-- Selector de Formas (Mega / Gigamax / Base) -->
      <div id="modalFormsSection" style="display: none;"></div>

      <div class="modal-sprite-wrapper">
        <div class="modal-sprite-container ${isModalShiny ? 'is-shiny' : ''}" id="modalSpriteContainer">
          <img id="modalSpriteImg" src="${isModalShiny ? shinyArtwork : defaultArtwork}" alt="${displayName}">
        </div>
        <div class="modal-actions-row">
          ${
            cryUrl
              ? `<button class="modal-cry-btn" id="modalCryBtn" aria-label="Escuchar rugido de ${displayName}">
                  🔊 Rugido
                </button>`
              : ''
          }
          <button class="modal-shiny-btn ${isModalShiny ? 'active' : ''}" id="modalShinyBtn" aria-label="Alternar versión Shiny">
            ${isModalShiny ? '⭐ Ver Normal' : '✨ Ver Shiny'}
          </button>
        </div>
      </div>

      <div class="modal-attributes-grid">
        <div class="modal-attr-item">
          <span class="modal-attr-label">Altura</span>
          <span class="modal-attr-value">${heightMeters} m</span>
        </div>
        <div class="modal-attr-item">
          <span class="modal-attr-label">Peso</span>
          <span class="modal-attr-value">${weightKg} kg</span>
        </div>
      </div>

      <div class="modal-abilities-container">
        ${abilitiesBadges}
      </div>

      <div class="modal-stats-section">
        <h3 class="modal-stats-title">📊 Estadísticas Base</h3>
        ${statsHtml}
      </div>

      <div class="modal-evolution-section">
        <h3 class="modal-evolution-title">🧬 Cadena Evolutiva</h3>
        <div class="evolution-flow" id="evolutionFlow">
          <div class="evo-loading-spinner">Cargando línea evolutiva...</div>
        </div>
      </div>
    `;

    // Eventos de Audio y Shiny
    const modalCryBtn = document.getElementById('modalCryBtn');
    if (modalCryBtn && cryUrl) {
      modalCryBtn.addEventListener('click', () => {
        playCry(cryUrl, modalCryBtn);
      });
    }

    const modalShinyBtn = document.getElementById('modalShinyBtn');
    const modalSpriteImg = document.getElementById('modalSpriteImg');
    const modalSpriteContainer = document.getElementById('modalSpriteContainer');

    if (modalShinyBtn && modalSpriteImg) {
      modalShinyBtn.addEventListener('click', () => {
        isModalShiny = !isModalShiny;
        modalSpriteImg.classList.remove('shiny-sparkle-anim');
        void modalSpriteImg.offsetWidth;
        modalSpriteImg.classList.add('shiny-sparkle-anim');

        if (isModalShiny) {
          modalSpriteImg.src = shinyArtwork;
          modalShinyBtn.classList.add('active');
          modalShinyBtn.innerHTML = '⭐ Ver Normal';
          modalSpriteContainer.classList.add('is-shiny');
        } else {
          modalSpriteImg.src = defaultArtwork;
          modalShinyBtn.classList.remove('active');
          modalShinyBtn.innerHTML = '✨ Ver Shiny';
          modalSpriteContainer.classList.remove('is-shiny');
        }
      });
    }

    // Abrir diálogo
    if (typeof pokemonModal.showModal === 'function') {
      pokemonModal.showModal();
    } else {
      pokemonModal.setAttribute('open', '');
    }

    // Cargar asíncronamente las Formas Alternas y Cadena Evolutiva desde la especie
    const speciesData = await fetchSpeciesData(pokemon);

    if (speciesData) {
      // 1. Manejo de Variedades (Megaevoluciones / Gigamax)
      const modalFormsSection = document.getElementById('modalFormsSection');
      const varieties = speciesData.varieties || [];

      if (varieties.length > 1 && modalFormsSection) {
        modalFormsSection.className = 'modal-forms-section';
        modalFormsSection.style.display = 'flex';

        const baseName = speciesData.name;
        const buttonsHtml = varieties
          .map(v => {
            const label = formatVarietyLabel(baseName, v.pokemon.name);
            const isActive = v.pokemon.name === pokemon.name;
            return `
              <button class="modal-form-btn ${isActive ? 'active' : ''}" data-variety-name="${v.pokemon.name}">
                ${label}
              </button>
            `;
          })
          .join('');

        modalFormsSection.innerHTML = `
          <span class="modal-forms-label">⚡ Formas Disponibles (Mega / Gigamax):</span>
          <div class="modal-forms-buttons">${buttonsHtml}</div>
        `;

        modalFormsSection.querySelectorAll('.modal-form-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const targetVarietyName = btn.dataset.varietyName;
            if (targetVarietyName === pokemon.name) return;

            btn.textContent = 'Cargando...';
            try {
              const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${targetVarietyName}`);
              if (res.ok) {
                const varietyData = await res.json();
                openModal(varietyData);
              }
            } catch (err) {
              console.warn('Error cambiando de forma:', err);
            }
          });
        });
      }

      // 2. Manejo de Cadena Evolutiva
      const evolutionFlow = document.getElementById('evolutionFlow');
      const evoChain = await fetchEvolutionChainFromSpecies(speciesData);

      if (evoChain && evolutionFlow) {
        const baseId = parseInt(speciesData.id, 10);
        evolutionFlow.innerHTML = renderEvolutionHtml(evoChain, baseId);

        evolutionFlow.querySelectorAll('.evo-card').forEach(evoCard => {
          evoCard.addEventListener('click', async () => {
            const targetId = parseInt(evoCard.dataset.pokemonId, 10);
            try {
              evolutionFlow.innerHTML = '<div class="evo-loading-spinner">Cargando Pokémon...</div>';
              const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${targetId}`);
              if (res.ok) {
                const targetData = await res.json();
                openModal(targetData);
              }
            } catch (e) {}
          });
        });
      } else if (evolutionFlow) {
        evolutionFlow.innerHTML = '<div class="evo-loading-spinner">Este Pokémon no tiene evoluciones conocidas.</div>';
      }
    }
  }

  function closeModal() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    if (typeof pokemonModal.close === 'function') {
      pokemonModal.close();
    } else {
      pokemonModal.removeAttribute('open');
    }
  }

  // ---------- Renderizado de Tarjetas ----------
  function renderPokemonList(pokemonArray) {
    if (!pokemonArray || pokemonArray.length === 0) {
      pokedexGrid.innerHTML = '';
      updateCounter(0);
      showStatus('No se encontraron Pokémon con los filtros seleccionados 🧐', true);
      return;
    }

    hideStatus();
    pokedexGrid.innerHTML = '';
    updateCounter(pokemonArray.length);

    pokemonArray.forEach(pokemon => {
      const card = document.createElement('div');
      card.className = 'pokemon-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      const displayName = formatPokemonDisplayName(pokemon.name);
      card.setAttribute('aria-label', `Ver detalles de ${displayName}`);

      const id = (pokemon.id || 0).toString().padStart(3, '0');

      const regularSprite =
        pokemon.sprites?.other?.['official-artwork']?.front_default ||
        pokemon.sprites?.other?.showdown?.front_default ||
        pokemon.sprites?.front_default ||
        '';

      const shinySprite =
        pokemon.sprites?.other?.['official-artwork']?.front_shiny ||
        pokemon.sprites?.front_shiny ||
        regularSprite;

      const cryUrl = pokemon.cries?.latest || pokemon.cries?.legacy || '';

      const typeBadges = (pokemon.types || [])
        .map(t => `<span class="type-badge type-${t.type.name}">${t.type.name}</span>`)
        .join('');

      card.innerHTML = `
        <div class="card-header-row">
          <span class="pokemon-id">#${id}</span>
          <div class="card-actions">
            <button class="btn-shiny ${pokemon.isShiny ? 'active' : ''}" title="Alternar versión Shiny (Variocolor)" aria-label="Versión Shiny de ${displayName}">✨</button>
            ${
              cryUrl
                ? `<button class="btn-cry" title="Escuchar rugido" aria-label="Rugido de ${displayName}">🔊</button>`
                : ''
            }
          </div>
        </div>
        <div class="pokemon-sprite">
          <img class="pokemon-card-img ${pokemon.isShiny ? 'shiny-sparkle-anim' : ''}" src="${
        pokemon.isShiny ? shinySprite : regularSprite
      }" alt="${displayName}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2245%22 fill=%22%23d0c0b0%22/%3E%3Ctext x=%2250%22 y=%2255%22 text-anchor=%22middle%22 font-size=%2230%22 fill=%22%235a4a3a%22%3E?%3C/text%3E%3C/svg%3E'">
        </div>
        <span class="pokemon-name">${displayName}</span>
        <div class="pokemon-types">${typeBadges}</div>
      `;

      // Evento de Sonido
      const cryBtn = card.querySelector('.btn-cry');
      if (cryBtn && cryUrl) {
        cryBtn.addEventListener('click', e => {
          e.stopPropagation();
          playCry(cryUrl, cryBtn);
        });
      }

      // Evento de Shiny
      const shinyBtn = card.querySelector('.btn-shiny');
      const cardImg = card.querySelector('.pokemon-card-img');
      if (shinyBtn && cardImg) {
        shinyBtn.addEventListener('click', e => {
          e.stopPropagation();
          pokemon.isShiny = !pokemon.isShiny;

          cardImg.classList.remove('shiny-sparkle-anim');
          void cardImg.offsetWidth;
          cardImg.classList.add('shiny-sparkle-anim');

          if (pokemon.isShiny) {
            shinyBtn.classList.add('active');
            cardImg.src = shinySprite;
          } else {
            shinyBtn.classList.remove('active');
            cardImg.src = regularSprite;
          }
        });
      }

      card.addEventListener('click', () => openModal(pokemon));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(pokemon);
        }
      });

      pokedexGrid.appendChild(card);
    });
  }

  // ---------- Búsqueda Global ----------
  async function searchGlobally(term) {
    if (isGlobalSearching) return;
    isGlobalSearching = true;
    showStatus(`Buscando "${term}" en toda la base de datos nacional...`);

    try {
      let pokemonData = null;
      try {
        const pyRes = await fetch(`/api/pokemon/${encodeURIComponent(term)}`);
        if (pyRes.ok) {
          pokemonData = await pyRes.json();
        }
      } catch (e) {}

      if (!pokemonData) {
        const apiRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(term)}`);
        if (apiRes.ok) {
          pokemonData = await apiRes.json();
        }
      }

      if (pokemonData && pokemonData.id) {
        renderPokemonList([pokemonData]);
      } else {
        renderPokemonList([]);
      }
    } catch (err) {
      renderPokemonList([]);
    } finally {
      isGlobalSearching = false;
    }
  }

  // ---------- Filtrado Combinado ----------
  function applyFilters() {
    if (!currentPokemonList.length) return;

    let filtered = currentPokemonList;

    if (selectedType !== 'all') {
      filtered = filtered.filter(p =>
        (p.types || []).some(t => t.type.name === selectedType)
      );
    }

    const query = searchTerm.trim().toLowerCase();
    if (query !== '') {
      filtered = filtered.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(query) || formatPokemonDisplayName(p.name).toLowerCase().includes(query);
        const idMatch = p.id.toString() === query;
        return nameMatch || idMatch;
      });

      if (filtered.length === 0 && query.length >= 2) {
        searchGlobally(query);
        return;
      }
    }

    renderPokemonList(filtered);
  }

  // ---------- Carga de Pokémon (Generaciones, Megas o Gigamax) ----------
  async function loadSelection(selection) {
    currentSelection = selection;

    // 1. Si ya está en caché, mostrar inmediatamente
    if (cacheByGen[selection]) {
      currentPokemonList = cacheByGen[selection];
      applyFilters();
      return;
    }

    showLoader();

    try {
      let results = [];

      if (selection === 'mega' || selection === 'gmax') {
        // Cargar todas las formas especiales desde offset 1000
        const listRes = await fetch('https://pokeapi.co/api/v2/pokemon?limit=350&offset=1000');
        if (!listRes.ok) throw new Error('Error al conectar con formas especiales');
        const listData = await listRes.json();

        if (selection === 'mega') {
          results = listData.results.filter(
            p => p.name.endsWith('-mega') || p.name.includes('-mega-x') || p.name.includes('-mega-y') || p.name.endsWith('-primal')
          );
        } else if (selection === 'gmax') {
          results = listData.results.filter(p => p.name.endsWith('-gmax'));
        }
      } else {
        // Generaciones estándar (1 a 9)
        const config = GENERATIONS[selection] || GENERATIONS[1];
        const listUrl = `https://pokeapi.co/api/v2/pokemon?offset=${config.offset}&limit=${config.limit}`;
        const response = await fetch(listUrl);
        if (!response.ok) throw new Error('Error al conectar con PokéAPI');
        const data = await response.json();
        results = data.results;
      }

      // Descargar detalles en paralelo
      const fetchPromises = results.map(async item => {
        try {
          const res = await fetch(item.url);
          if (!res.ok) return null;
          return await res.json();
        } catch (err) {
          return null;
        }
      });

      const pokemonData = await Promise.all(fetchPromises);
      const validData = pokemonData.filter(p => p !== null);
      validData.sort((a, b) => a.id - b.id);

      cacheByGen[selection] = validData;
      currentPokemonList = validData;

      hideLoader();
      hideStatus();
      applyFilters();
    } catch (error) {
      console.error('Error cargando selección:', error);
      hideLoader();
      showStatus('Error al cargar los Pokémon. Por favor, intenta de nuevo.', true);
    }
  }

  // ---------- Inicialización de Eventos ----------
  function init() {
    loadSelection('1');

    if (generationSelect) {
      generationSelect.addEventListener('change', e => {
        const val = e.target.value;
        searchTerm = '';
        searchInput.value = '';
        loadSelection(val);
      });
    }

    searchInput.addEventListener('input', e => {
      searchTerm = e.target.value;
      applyFilters();
    });

    searchBtn.addEventListener('click', () => {
      searchTerm = searchInput.value;
      applyFilters();
    });

    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        searchTerm = searchInput.value;
        applyFilters();
      }
    });

    if (typesFilterContainer) {
      typesFilterContainer.addEventListener('click', e => {
        const btn = e.target.closest('.type-filter-btn');
        if (!btn) return;

        typesFilterContainer
          .querySelectorAll('.type-filter-btn')
          .forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        selectedType = btn.dataset.type || 'all';
        applyFilters();
      });
    }

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }

    if (pokemonModal) {
      pokemonModal.addEventListener('click', e => {
        const rect = pokemonModal.getBoundingClientRect();
        const isInDialog =
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width;
        if (!isInDialog) {
          closeModal();
        }
      });

      pokemonModal.addEventListener('close', () => {
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

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

  // Matriz Oficial de Efectividad de Tipos (Gen 6-9)
  const TYPE_EFFECTIVENESS = {
    normal: { rock: 0.5, ghost: 0, steel: 0.5 },
    fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
    water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
    grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
    electric: { water: 2, grass: 0.5, electric: 0.5, ground: 0, flying: 2, dragon: 0.5 },
    ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
    fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
    poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
    ground: { fire: 2, grass: 0.5, electric: 2, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
    flying: { grass: 2, electric: 0.5, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
    psychic: { fighting: 2, poison: 2, psychic: 0.5, steel: 0.5, dark: 0 },
    bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, steel: 0.5, fairy: 0.5 },
    rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
    ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
    dragon: { dragon: 2, steel: 0.5, fairy: 0 },
    steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
    dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
    fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, steel: 0.5, dark: 2 }
  };

  // Base de datos de movimientos populares preconfigurados
  const COMMON_MOVES_DB = {
    'flamethrower': { name: 'Lanzallamas', power: 90, type: 'fire', class: 'special', acc: 100 },
    'fire-blast': { name: 'Llamarada', power: 110, type: 'fire', class: 'special', acc: 85 },
    'fire-punch': { name: 'Puño Fuego', power: 75, type: 'fire', class: 'physical', acc: 100 },
    'flare-blitz': { name: 'Envite Ígneo', power: 120, type: 'fire', class: 'physical', acc: 100 },
    'heat-wave': { name: 'Onda Ígnea', power: 95, type: 'fire', class: 'special', acc: 90 },
    'hydro-pump': { name: 'Hidrobomba', power: 110, type: 'water', class: 'special', acc: 80 },
    'surf': { name: 'Surf', power: 90, type: 'water', class: 'special', acc: 100 },
    'water-pulse': { name: 'Pulso Agua', power: 60, type: 'water', class: 'special', acc: 100 },
    'scald': { name: 'Escaldar', power: 80, type: 'water', class: 'special', acc: 100 },
    'waterfall': { name: 'Cascada', power: 80, type: 'water', class: 'physical', acc: 100 },
    'solar-beam': { name: 'Rayo Solar', power: 120, type: 'grass', class: 'special', acc: 100 },
    'energy-ball': { name: 'Energibola', power: 90, type: 'grass', class: 'special', acc: 100 },
    'leaf-blade': { name: 'Hoja Aguda', power: 90, type: 'grass', class: 'physical', acc: 100 },
    'giga-drain': { name: 'Gigadrenado', power: 75, type: 'grass', class: 'special', acc: 100 },
    'seed-bomb': { name: 'Bomba Germen', power: 80, type: 'grass', class: 'physical', acc: 100 },
    'thunderbolt': { name: 'Rayo', power: 90, type: 'electric', class: 'special', acc: 100 },
    'thunder': { name: 'Trueno', power: 110, type: 'electric', class: 'special', acc: 70 },
    'thunder-punch': { name: 'Puño Trueno', power: 75, type: 'electric', class: 'physical', acc: 100 },
    'wild-charge': { name: 'Voltio Cruel', power: 90, type: 'electric', class: 'physical', acc: 100 },
    'ice-beam': { name: 'Rayo Hielo', power: 90, type: 'ice', class: 'special', acc: 100 },
    'blizzard': { name: 'Ventisca', power: 110, type: 'ice', class: 'special', acc: 70 },
    'ice-punch': { name: 'Puño Hielo', power: 75, type: 'ice', class: 'physical', acc: 100 },
    'earthquake': { name: 'Terremoto', power: 100, type: 'ground', class: 'physical', acc: 100 },
    'earth-power': { name: 'Tierra Viva', power: 90, type: 'ground', class: 'special', acc: 100 },
    'bulldoze': { name: 'Terratemblor', power: 60, type: 'ground', class: 'physical', acc: 100 },
    'psychic': { name: 'Psíquico', power: 90, type: 'psychic', class: 'special', acc: 100 },
    'psyshock': { name: 'Psicocarga', power: 80, type: 'psychic', class: 'special', acc: 100 },
    'shadow-ball': { name: 'Bola Sombra', power: 80, type: 'ghost', class: 'special', acc: 100 },
    'shadow-claw': { name: 'Garra Umbría', power: 70, type: 'ghost', class: 'physical', acc: 100 },
    'dark-pulse': { name: 'Pulso Umbrío', power: 80, type: 'dark', class: 'special', acc: 100 },
    'crunch': { name: 'Triturar', power: 80, type: 'dark', class: 'physical', acc: 100 },
    'night-slash': { name: 'Tajo Umbrío', power: 70, type: 'dark', class: 'physical', acc: 100 },
    'close-combat': { name: 'A Bocajarro', power: 120, type: 'fighting', class: 'physical', acc: 100 },
    'focus-blast': { name: 'Onda Certera', power: 120, type: 'fighting', class: 'special', acc: 70 },
    'brick-break': { name: 'Demolición', power: 75, type: 'fighting', class: 'physical', acc: 100 },
    'dragon-claw': { name: 'Garra Dragón', power: 80, type: 'dragon', class: 'physical', acc: 100 },
    'dragon-pulse': { name: 'Pulso Dragón', power: 85, type: 'dragon', class: 'special', acc: 100 },
    'outrage': { name: 'Enfado', power: 120, type: 'dragon', class: 'physical', acc: 100 },
    'moonblast': { name: 'Fuerza Lunar', power: 95, type: 'fairy', class: 'special', acc: 100 },
    'dazzling-gleam': { name: 'Brillo Mágico', power: 80, type: 'fairy', class: 'special', acc: 100 },
    'play-rough': { name: 'Carantoña', power: 90, type: 'fairy', class: 'physical', acc: 90 },
    'iron-head': { name: 'Cabeza de Hierro', power: 80, type: 'steel', class: 'physical', acc: 100 },
    'flash-cannon': { name: 'Foco Resplandor', power: 80, type: 'steel', class: 'special', acc: 100 },
    'sludge-bomb': { name: 'Bomba Lodo', power: 90, type: 'poison', class: 'special', acc: 100 },
    'poison-jab': { name: 'Puya Nociva', power: 80, type: 'poison', class: 'physical', acc: 100 },
    'stone-edge': { name: 'Roca Afilada', power: 100, type: 'rock', class: 'physical', acc: 80 },
    'rock-slide': { name: 'Avalancha', power: 75, type: 'rock', class: 'physical', acc: 90 },
    'air-slash': { name: 'Tajo Aéreo', power: 75, type: 'flying', class: 'special', acc: 95 },
    'brave-bird': { name: 'Pájaro Osado', power: 120, type: 'flying', class: 'physical', acc: 100 },
    'bug-buzz': { name: 'Zumbido', power: 90, type: 'bug', class: 'special', acc: 100 },
    'x-scissor': { name: 'Tijera X', power: 80, type: 'bug', class: 'physical', acc: 100 },
    'hyper-beam': { name: 'Hiperrayo', power: 150, type: 'normal', class: 'special', acc: 90 },
    'body-slam': { name: 'Golpe Cuerpo', power: 85, type: 'normal', class: 'physical', acc: 100 },
    'quick-attack': { name: 'Ataque Rápido', power: 40, type: 'normal', class: 'physical', acc: 100 },
    'slash': { name: 'Cuchillada', power: 70, type: 'normal', class: 'physical', acc: 100 }
  };

  const dynamicMoveCache = {}; // Caché de movimientos cargados de PokéAPI

  // Elementos del DOM Principal
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

  // Elementos del DOM de la Arena de Batalla
  const openBattleBtn = document.getElementById('openBattleBtn');
  const battleModal = document.getElementById('battleModal');
  const battleCloseBtn = document.getElementById('battleCloseBtn');
  const battleSetupView = document.getElementById('battleSetupView');
  const battleArenaView = document.getElementById('battleArenaView');

  const p1Select = document.getElementById('p1Select');
  const p2Select = document.getElementById('p2Select');
  const p1Preview = document.getElementById('p1Preview');
  const p2Preview = document.getElementById('p2Preview');
  const randomRivalBtn = document.getElementById('randomRivalBtn');
  const startBattleBtn = document.getElementById('startBattleBtn');

  const p1MovesSelects = [
    document.getElementById('p1Move0'),
    document.getElementById('p1Move1'),
    document.getElementById('p1Move2'),
    document.getElementById('p1Move3')
  ];
  const p2MovesSelects = [
    document.getElementById('p2Move0'),
    document.getElementById('p2Move1'),
    document.getElementById('p2Move2'),
    document.getElementById('p2Move3')
  ];

  const p1BattleSprite = document.getElementById('p1BattleSprite');
  const p2BattleSprite = document.getElementById('p2BattleSprite');
  const p1HudName = document.getElementById('p1HudName');
  const p2HudName = document.getElementById('p2HudName');
  const p1HpFill = document.getElementById('p1HpFill');
  const p2HpFill = document.getElementById('p2HpFill');
  const p1HpText = document.getElementById('p1HpText');
  const p2HpText = document.getElementById('p2HpText');
  const battleLogText = document.getElementById('battleLogText');
  const battleMovesGrid = document.getElementById('battleMovesGrid');
  const rematchBattleBtn = document.getElementById('rematchBattleBtn');
  const changeFightersBtn = document.getElementById('changeFightersBtn');

  // Estado general
  let currentSelection = '1';
  const cacheByGen = {};
  const speciesCache = {};
  let currentPokemonList = [];
  let selectedType = 'all';
  let searchTerm = '';
  let currentAudio = null;
  let isGlobalSearching = false;

  // Estado del Combate
  let battleP1 = null;
  let battleP2 = null;
  let battleP1Moves = [];
  let battleP2Moves = [];
  let isTurnRunning = false;

  // Mapeo de estadísticas
  const STATS_MAP = {
    hp: { label: 'PS', class: 'stat-fill-hp' },
    attack: { label: 'Ataque', class: 'stat-fill-attack' },
    defense: { label: 'Defensa', class: 'stat-fill-defense' },
    'special-attack': { label: 'Atq. Esp', class: 'stat-fill-special-attack' },
    'special-defense': { label: 'Def. Esp', class: 'stat-fill-special-defense' },
    speed: { label: 'Velocidad', class: 'stat-fill-speed' }
  };

  // Formato para nombres amigables
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

  function showLoader() {
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

  // ---------- Carga de Especie ----------
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
      return null;
    }
  }

  // ---------- Cadena Evolutiva ----------
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
          triggerText = d.item.name.replace(/-/g, ' ');
        } else if (d.trigger?.name === 'trade') {
          triggerText = 'Intercambio';
        } else if (d.min_happiness) {
          triggerText = 'Amistad';
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

  // ---------- Modal de Detalles ----------
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

    const typeBadges = (pokemon.types || [])
      .map(t => `<span class="type-badge type-${t.type.name}">${t.type.name}</span>`)
      .join('');

    const abilitiesBadges = (pokemon.abilities || [])
      .map(
        a =>
          `<span class="ability-badge ${a.is_hidden ? 'hidden' : ''}">${a.ability.name.replace('-', ' ')}${
            a.is_hidden ? ' (Oculta)' : ''
          }</span>`
      )
      .join('');

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

    if (typeof pokemonModal.showModal === 'function') {
      pokemonModal.showModal();
    } else {
      pokemonModal.setAttribute('open', '');
    }

    const speciesData = await fetchSpeciesData(pokemon);

    if (speciesData) {
      // 1. Variedades (Megas / Gigamax)
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
          <span class="modal-forms-label">⚡ Formas Disponibles:</span>
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
            } catch (err) {}
          });
        });
      }

      // 2. Cadena Evolutiva
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

  // ---------- Renderizado de Tarjetas de la Pokédex ----------
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

      const cryBtn = card.querySelector('.btn-cry');
      if (cryBtn && cryUrl) {
        cryBtn.addEventListener('click', e => {
          e.stopPropagation();
          playCry(cryUrl, cryBtn);
        });
      }

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
        const nameMatch =
          p.name.toLowerCase().includes(query) ||
          formatPokemonDisplayName(p.name).toLowerCase().includes(query);
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

    if (cacheByGen[selection]) {
      currentPokemonList = cacheByGen[selection];
      applyFilters();
      return;
    }

    showLoader();

    try {
      let results = [];

      if (selection === 'mega' || selection === 'gmax') {
        const listRes = await fetch('https://pokeapi.co/api/v2/pokemon?limit=350&offset=1000');
        if (!listRes.ok) throw new Error('Error al conectar con formas especiales');
        const listData = await listRes.json();

        if (selection === 'mega') {
          results = listData.results.filter(
            p =>
              p.name.endsWith('-mega') ||
              p.name.includes('-mega-x') ||
              p.name.includes('-mega-y') ||
              p.name.endsWith('-primal')
          );
        } else if (selection === 'gmax') {
          results = listData.results.filter(p => p.name.endsWith('-gmax'));
        }
      } else {
        const config = GENERATIONS[selection] || GENERATIONS[1];
        const listUrl = `https://pokeapi.co/api/v2/pokemon?offset=${config.offset}&limit=${config.limit}`;
        const response = await fetch(listUrl);
        if (!response.ok) throw new Error('Error al conectar con PokéAPI');
        const data = await response.json();
        results = data.results;
      }

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

  // ==========================================================================
  //  LÓGICA DEL SIMULADOR DE COMBATE / ARENA DE BATALLA
  // ==========================================================================

  // Cálculo de Multiplicador de Tipo
  function getDamageMultiplier(moveType, targetTypes) {
    let mult = 1;
    const relations = TYPE_EFFECTIVENESS[moveType] || {};
    for (const t of targetTypes) {
      if (relations[t] !== undefined) {
        mult *= relations[t];
      }
    }
    return mult;
  }

  // Obtener movimientos de un Pokémon
  async function getAvailableMovesForPokemon(pokemon) {
    const rawMoves = pokemon.moves || [];
    const validMoves = [];

    // 1. Primero comprobar con nuestra base de datos preconfigurada
    for (const item of rawMoves) {
      const moveName = item.move.name;
      if (COMMON_MOVES_DB[moveName]) {
        validMoves.push({
          id: moveName,
          ...COMMON_MOVES_DB[moveName]
        });
      }
    }

    // 2. Si tiene menos de 4, completar con ataques dinámicos
    if (validMoves.length < 4) {
      const needed = 4 - validMoves.length;
      const candidates = rawMoves
        .filter(m => !validMoves.some(v => v.id === m.move.name))
        .slice(0, 8);

      for (const item of candidates) {
        if (validMoves.length >= 6) break;
        const name = item.move.name;
        if (dynamicMoveCache[name]) {
          if (dynamicMoveCache[name].power) validMoves.push(dynamicMoveCache[name]);
          continue;
        }

        try {
          const res = await fetch(item.move.url);
          if (res.ok) {
            const data = await res.json();
            const moveObj = {
              id: name,
              name: data.name.replace(/-/g, ' '),
              power: data.power || 60,
              type: data.type?.name || 'normal',
              class: data.damage_class?.name || 'physical',
              acc: data.accuracy || 100
            };
            dynamicMoveCache[name] = moveObj;
            validMoves.push(moveObj);
          }
        } catch (e) {}
      }
    }

    // Fallback asegurado
    if (validMoves.length === 0) {
      validMoves.push(
        { id: 'tackle', name: 'Placaje', power: 50, type: 'normal', class: 'physical', acc: 100 },
        { id: 'quick-attack', name: 'Ataque Rápido', power: 40, type: 'normal', class: 'physical', acc: 100 },
        { id: 'body-slam', name: 'Golpe Cuerpo', power: 85, type: 'normal', class: 'physical', acc: 100 },
        { id: 'hyper-beam', name: 'Hiperrayo', power: 150, type: 'normal', class: 'special', acc: 90 }
      );
    }

    return validMoves;
  }

  // Poblar dropdowns de selección de 4 ataques
  function populateMoveSlots(selectElements, availableMoves) {
    selectElements.forEach((selectEl, idx) => {
      selectEl.innerHTML = '';
      availableMoves.forEach((move, mIdx) => {
        const opt = document.createElement('option');
        opt.value = move.id;
        opt.textContent = `${move.name} (${move.type.toUpperCase()} · Pot: ${move.power})`;
        selectEl.appendChild(opt);
      });

      // Seleccionar diferentes por defecto
      if (idx < availableMoves.length) {
        selectEl.selectedIndex = idx;
      }
    });
  }

  // Cargar vista previa y ataques en el setup de combate
  async function updateFighterSetup(pokemon, previewEl, moveSelects) {
    if (!pokemon) return;

    const sprite =
      pokemon.sprites?.other?.['official-artwork']?.front_default ||
      pokemon.sprites?.front_default ||
      '';
    const types = (pokemon.types || [])
      .map(t => `<span class="type-badge type-${t.type.name}">${t.type.name}</span>`)
      .join('');

    const hp = pokemon.stats?.find(s => s.stat.name === 'hp')?.base_stat || 60;
    const speed = pokemon.stats?.find(s => s.stat.name === 'speed')?.base_stat || 50;

    previewEl.innerHTML = `
      <img class="fighter-preview-sprite" src="${sprite}" alt="${pokemon.name}">
      <span class="fighter-preview-name">${formatPokemonDisplayName(pokemon.name)}</span>
      <div class="fighter-preview-types">${types}</div>
      <div style="font-size: 0.8rem; font-weight: 700; color: #5a4b3d; margin-top: 4px;">
        PS Base: ${hp} | Velocidad: ${speed}
      </div>
    `;

    // Cargar movimientos disponibles y colocarlos en los 4 selects
    const moves = await getAvailableMovesForPokemon(pokemon);
    pokemon.availableBattleMoves = moves;
    populateMoveSlots(moveSelects, moves);
  }

  // Abrir modal de arena de batalla
  function openBattleArena() {
    // Si no hay pokemon en lista, cargar primero
    if (!currentPokemonList.length) {
      loadSelection('1');
    }

    // Poblar selectores de combatientes con los Pokémon actuales
    [p1Select, p2Select].forEach(sel => {
      sel.innerHTML = '';
      currentPokemonList.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.name;
        opt.textContent = `#${p.id.toString().padStart(3, '0')} - ${formatPokemonDisplayName(p.name)}`;
        sel.appendChild(opt);
      });
    });

    // P1 por defecto: primero o Charizard
    battleP1 = currentPokemonList.find(p => p.name === 'charizard') || currentPokemonList[0];
    p1Select.value = battleP1?.name || currentPokemonList[0]?.name;

    // P2 por defecto: Blastoise o el segundo
    battleP2 = currentPokemonList.find(p => p.name === 'blastoise') || currentPokemonList[1] || currentPokemonList[0];
    p2Select.value = battleP2?.name || currentPokemonList[1]?.name;

    updateFighterSetup(battleP1, p1Preview, p1MovesSelects);
    updateFighterSetup(battleP2, p2Preview, p2MovesSelects);

    battleSetupView.style.display = 'block';
    battleArenaView.style.display = 'none';

    if (typeof battleModal.showModal === 'function') {
      battleModal.showModal();
    } else {
      battleModal.setAttribute('open', '');
    }
  }

  // Iniciar combate real
  function startCombat() {
    if (!battleP1 || !battleP2) return;

    // Recoger los 4 ataques elegidos para P1
    battleP1Moves = p1MovesSelects.map(sel => {
      const moveId = sel.value;
      return (
        battleP1.availableBattleMoves?.find(m => m.id === moveId) ||
        COMMON_MOVES_DB[moveId] || { id: moveId, name: 'Placaje', power: 50, type: 'normal', class: 'physical', acc: 100 }
      );
    });

    // Recoger los 4 ataques elegidos para P2
    battleP2Moves = p2MovesSelects.map(sel => {
      const moveId = sel.value;
      return (
        battleP2.availableBattleMoves?.find(m => m.id === moveId) ||
        COMMON_MOVES_DB[moveId] || { id: moveId, name: 'Ataque', power: 50, type: 'normal', class: 'physical', acc: 100 }
      );
    });

    // Inicializar PS con fórmula de combate Nv. 50
    const p1BaseHp = battleP1.stats?.find(s => s.stat.name === 'hp')?.base_stat || 70;
    const p2BaseHp = battleP2.stats?.find(s => s.stat.name === 'hp')?.base_stat || 70;

    battleP1.maxHp = Math.floor(p1BaseHp * 2 + 110);
    battleP1.currentHp = battleP1.maxHp;

    battleP2.maxHp = Math.floor(p2BaseHp * 2 + 110);
    battleP2.currentHp = battleP2.maxHp;

    // Actualizar HUDs
    p1HudName.textContent = formatPokemonDisplayName(battleP1.name);
    p2HudName.textContent = formatPokemonDisplayName(battleP2.name);
    updateHpUi();

    // Sprites
    const p1Sprite =
      battleP1.sprites?.other?.showdown?.back_default ||
      battleP1.sprites?.other?.['official-artwork']?.front_default ||
      battleP1.sprites?.front_default ||
      '';
    const p2Sprite =
      battleP2.sprites?.other?.showdown?.front_default ||
      battleP2.sprites?.other?.['official-artwork']?.front_default ||
      battleP2.sprites?.front_default ||
      '';

    p1BattleSprite.src = p1Sprite;
    p2BattleSprite.src = p2Sprite;
    p1BattleSprite.className = 'battle-sprite';
    p2BattleSprite.className = 'battle-sprite';

    // Generar los 4 botones de ataque en la arena
    battleMovesGrid.innerHTML = '';
    battleP1Moves.forEach((move, idx) => {
      const btn = document.createElement('button');
      btn.className = `battle-move-btn type-${move.type}`;
      btn.innerHTML = `
        <span class="move-btn-name">${move.name}</span>
        <div class="move-btn-meta">
          <span>Pot: ${move.power || 60}</span>
          <span>Prec: ${move.acc || 100}%</span>
        </div>
      `;
      btn.addEventListener('click', () => handlePlayerTurn(idx));
      battleMovesGrid.appendChild(btn);
    });

    rematchBattleBtn.style.display = 'none';
    changeFightersBtn.style.display = 'inline-block';

    battleSetupView.style.display = 'none';
    battleArenaView.style.display = 'block';

    battleLogText.textContent = `¡Comienza el duelo entre ${formatPokemonDisplayName(
      battleP1.name
    )} y ${formatPokemonDisplayName(battleP2.name)}! ¿Qué ataque usarás?`;

    // Reproducir grito del jugador al entrar
    if (battleP1.cries?.latest) {
      playCry(battleP1.cries.latest);
    }
  }

  // Actualizar interfaz de barras de vida
  function updateHpUi() {
    const p1Pct = Math.max(0, (battleP1.currentHp / battleP1.maxHp) * 100);
    const p2Pct = Math.max(0, (battleP2.currentHp / battleP2.maxHp) * 100);

    p1HpFill.style.width = `${p1Pct}%`;
    p2HpFill.style.width = `${p2Pct}%`;

    p1HpFill.className = `hud-hp-fill ${p1Pct <= 20 ? 'hp-red' : p1Pct <= 50 ? 'hp-yellow' : ''}`;
    p2HpFill.className = `hud-hp-fill ${p2Pct <= 20 ? 'hp-red' : p2Pct <= 50 ? 'hp-yellow' : ''}`;

    p1HpText.textContent = `PS: ${battleP1.currentHp} / ${battleP1.maxHp}`;
    p2HpText.textContent = `PS: ${battleP2.currentHp} / ${battleP2.maxHp}`;
  }

  // Cálculo de Daño Oficial
  function calculateDamage(attacker, defender, move) {
    const level = 50;
    const isSpecial = move.class === 'special';

    const atkStat = isSpecial
      ? attacker.stats?.find(s => s.stat.name === 'special-attack')?.base_stat || 70
      : attacker.stats?.find(s => s.stat.name === 'attack')?.base_stat || 70;

    const defStat = isSpecial
      ? defender.stats?.find(s => s.stat.name === 'special-defense')?.base_stat || 70
      : defender.stats?.find(s => s.stat.name === 'defense')?.base_stat || 70;

    const defenderTypes = (defender.types || []).map(t => t.type.name);
    const attackerTypes = (attacker.types || []).map(t => t.type.name);

    // Multiplicador de tipo
    const typeMult = getDamageMultiplier(move.type, defenderTypes);

    // Bonificación por mismo tipo (STAB)
    const stab = attackerTypes.includes(move.type) ? 1.5 : 1.0;

    // Factor aleatorio entre 0.85 y 1.0
    const random = 0.85 + Math.random() * 0.15;

    const baseDmg =
      ((((2 * level) / 5 + 2) * move.power * (atkStat / defStat)) / 50 + 2) * stab * typeMult * random;

    return {
      damage: Math.max(1, Math.floor(baseDmg)),
      multiplier: typeMult
    };
  }

  // Turno de Batalla
  async function handlePlayerTurn(playerMoveIdx) {
    if (isTurnRunning || battleP1.currentHp <= 0 || battleP2.currentHp <= 0) return;
    isTurnRunning = true;

    // Deshabilitar botones mientras transcurre el turno
    battleMovesGrid.querySelectorAll('.battle-move-btn').forEach(b => (b.disabled = true));

    const p1Move = battleP1Moves[playerMoveIdx];
    // Rival elige uno de sus 4 ataques
    const p2Move = battleP2Moves[Math.floor(Math.random() * battleP2Moves.length)];

    const p1Speed = battleP1.stats?.find(s => s.stat.name === 'speed')?.base_stat || 50;
    const p2Speed = battleP2.stats?.find(s => s.stat.name === 'speed')?.base_stat || 50;

    const p1First = p1Speed >= p2Speed;

    if (p1First) {
      // 1. Ataca Jugador
      await executeAttack(battleP1, battleP2, p1Move, true);
      if (battleP2.currentHp <= 0) {
        finishBattle(true);
        return;
      }
      // 2. Ataca Rival
      await new Promise(r => setTimeout(r, 900));
      await executeAttack(battleP2, battleP1, p2Move, false);
      if (battleP1.currentHp <= 0) {
        finishBattle(false);
        return;
      }
    } else {
      // 1. Ataca Rival primero por velocidad
      await executeAttack(battleP2, battleP1, p2Move, false);
      if (battleP1.currentHp <= 0) {
        finishBattle(false);
        return;
      }
      // 2. Ataca Jugador
      await new Promise(r => setTimeout(r, 900));
      await executeAttack(battleP1, battleP2, p1Move, true);
      if (battleP2.currentHp <= 0) {
        finishBattle(true);
        return;
      }
    }

    // Fin del turno: re-habilitar ataques
    isTurnRunning = false;
    battleMovesGrid.querySelectorAll('.battle-move-btn').forEach(b => (b.disabled = false));
    battleLogText.textContent = `¿Qué debería hacer ${formatPokemonDisplayName(battleP1.name)} ahora?`;
  }

  // Ejecución de un ataque con animaciones
  async function executeAttack(attacker, defender, move, isPlayerAttacking) {
    const atkSprite = isPlayerAttacking ? p1BattleSprite : p2BattleSprite;
    const defSprite = isPlayerAttacking ? p2BattleSprite : p1BattleSprite;

    // 1. Animación de embestida
    atkSprite.classList.add(isPlayerAttacking ? 'attack-lunge-player' : 'attack-lunge-rival');
    await new Promise(r => setTimeout(r, 200));

    // 2. Cálculo de daño y efectividad
    const result = calculateDamage(attacker, defender, move);
    defender.currentHp = Math.max(0, defender.currentHp - result.damage);

    // 3. Animación de daño en defensor
    defSprite.classList.add('hit-shake');
    updateHpUi();

    let effectivenessMsg = '';
    if (result.multiplier >= 2) effectivenessMsg = ' ¡Es súper eficaz! 🔥';
    else if (result.multiplier === 0) effectivenessMsg = ' ¡No afectó en absoluto! ❌';
    else if (result.multiplier < 1) effectivenessMsg = ' No es muy eficaz... 🛡️';

    battleLogText.textContent = `¡${formatPokemonDisplayName(attacker.name)} usó ${move.name}!${effectivenessMsg} Causó ${result.damage} de daño.`;

    await new Promise(r => setTimeout(r, 450));
    atkSprite.classList.remove('attack-lunge-player', 'attack-lunge-rival');
    defSprite.classList.remove('hit-shake');
  }

  // Fin del combate
  function finishBattle(playerWon) {
    isTurnRunning = false;
    rematchBattleBtn.style.display = 'inline-block';

    if (playerWon) {
      p2BattleSprite.classList.add('faint-fall');
      battleLogText.textContent = `🎉 ¡${formatPokemonDisplayName(
        battleP2.name
      )} se ha debilitado! ¡Has ganado el combate!`;
      if (battleP1.cries?.latest) {
        playCry(battleP1.cries.latest);
      }
    } else {
      p1BattleSprite.classList.add('faint-fall');
      battleLogText.textContent = `💀 ¡${formatPokemonDisplayName(
        battleP1.name
      )} se ha debilitado! Has perdido el combate...`;
      if (battleP2.cries?.latest) {
        playCry(battleP2.cries.latest);
      }
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

    // Eventos de la Arena de Batalla
    if (openBattleBtn) {
      openBattleBtn.addEventListener('click', openBattleArena);
    }

    if (battleCloseBtn) {
      battleCloseBtn.addEventListener('click', () => {
        if (typeof battleModal.close === 'function') {
          battleModal.close();
        } else {
          battleModal.removeAttribute('open');
        }
      });
    }

    if (p1Select) {
      p1Select.addEventListener('change', e => {
        battleP1 = currentPokemonList.find(p => p.name === e.target.value);
        updateFighterSetup(battleP1, p1Preview, p1MovesSelects);
      });
    }

    if (p2Select) {
      p2Select.addEventListener('change', e => {
        battleP2 = currentPokemonList.find(p => p.name === e.target.value);
        updateFighterSetup(battleP2, p2Preview, p2MovesSelects);
      });
    }

    if (randomRivalBtn) {
      randomRivalBtn.addEventListener('click', () => {
        if (!currentPokemonList.length) return;
        const randomIdx = Math.floor(Math.random() * currentPokemonList.length);
        battleP2 = currentPokemonList[randomIdx];
        p2Select.value = battleP2.name;
        updateFighterSetup(battleP2, p2Preview, p2MovesSelects);
      });
    }

    if (startBattleBtn) {
      startBattleBtn.addEventListener('click', startCombat);
    }

    if (rematchBattleBtn) {
      rematchBattleBtn.addEventListener('click', startCombat);
    }

    if (changeFightersBtn) {
      changeFightersBtn.addEventListener('click', () => {
        battleSetupView.style.display = 'block';
        battleArenaView.style.display = 'none';
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

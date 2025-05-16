// Datos de la 7ª edición
const SKILLS_7TH = {
    "Antropología": {base: 1, type: "occupational", category: "academic"},
    "Arqueología": {base: 1, type: "occupational", category: "academic"},
    "Armas de Fuego": {base: 20, type: "occupational", category: "combat"},
    "Biblioteca": {base: 20, type: "occupational", category: "academic"},
    "Cerrajería": {base: 1, type: "occupational", category: "technical"},
    "Conducir Automóvil": {base: 20, type: "occupational", category: "technical"},
    "Disfraz": {base: 5, type: "occupational", category: "social"},
    "Fotografía": {base: 5, type: "occupational", category: "technical"},
    "Historia": {base: 5, type: "occupational", category: "academic"},
    "Informática": {base: 5, type: "occupational", category: "technical"},
    "Ingeniería Eléctrica": {base: 1, type: "occupational", category: "technical"},
    "Ingeniería Mecánica": {base: 1, type: "occupational", category: "technical"},
    "Mecánica": {base: 10, type: "occupational", category: "technical"},
    "Medicina": {base: 1, type: "occupational", category: "academic"},
    "Ocultismo": {base: 5, type: "occupational", category: "academic"},
    "Pilotar Avión": {base: 1, type: "occupational", category: "technical"},
    "Pilotar Barco": {base: 1, type: "occupational", category: "technical"},
    "Psicoanálisis": {base: 1, type: "occupational", category: "academic"},
    "Rastrear": {base: 10, type: "occupational", category: "physical"},
    "Supervivencia": {base: 10, type: "occupational", category: "physical"},
    "Tasación": {base: 5, type: "occupational", category: "social"},
    "Tiro con Arco": {base: 15, type: "occupational", category: "combat"},
    
    // Habilidades Personales
    "Bailar": {base: 10, type: "personal", category: "physical"},
    "Callejeo": {base: 10, type: "personal", category: "social"},
    "Charlatanería": {base: 5, type: "personal", category: "social"},
    "Discreción": {base: 10, type: "personal", category: "social"},
    "Eludir": {base: 30, type: "personal", category: "physical"},
    "Escuchar": {base: 20, type: "personal", category: "perception"},
    "Esquivar": {base: 30, type: "personal", category: "physical"},
    "Idioma Propio": {base: 50, type: "personal", category: "social"},
    "Intimidar": {base: 15, type: "personal", category: "social"},
    "Nadar": {base: 20, type: "personal", category: "physical"},
    "Persuasión": {base: 10, type: "personal", category: "social"},
    "Psicología": {base: 10, type: "personal", category: "social"},
    "Saltar": {base: 20, type: "personal", category: "physical"},
    "Sigilo": {base: 20, type: "personal", category: "physical"},
    "Trepar": {base: 20, type: "personal", category: "physical"},
    
    // Habilidades Académicas
    "Astronomía": {base: 1, type: "academic", category: "science"},
    "Botánica": {base: 1, type: "academic", category: "science"},
    "Ciencias Naturales": {base: 10, type: "academic", category: "science"},
    "Física": {base: 1, type: "academic", category: "science"},
    "Geología": {base: 1, type: "academic", category: "science"},
    "Leyenda": {base: 5, type: "academic", category: "humanities"},
    "Mitología": {base: 1, type: "academic", category: "humanities"},
    "Química": {base: 1, type: "academic", category: "science"},
    "Zoología": {base: 1, type: "academic", category: "science"},
    
    // Habilidades de Combate
    "Armas Blancas": {base: 20, type: "combat", category: "melee"},
    "Lucha": {base: 50, type: "combat", category: "melee"}
};

// Variables globales
let character = {
    info: {
        name: "",
        occupation: "",
        age: 30,
        gender: "",
        residence: "",
        birthplace: ""
    },
    attributes: {
        str: 50,
        con: 50,
        siz: 50,
        dex: 50,
        app: 50,
        int: 50,
        pow: 50,
        edu: 50
    },
    skills: {},
    weapons: [
        {
            name: "Pistola .32",
            skill: 25,
            damage: "1D10",
            range: "15m"
        }
    ],
    sanity: {
        current: 50,
        maximum: 99
    },
    hp: {
        current: 10,
        maximum: 10
    },
    mp: {
        current: 10,
        maximum: 10
    },
    luck: 50
};

// ==============================================
// FUNCIONES PRINCIPALES
// ==============================================

function init() {
    loadCharacter();
    setupEventListeners();
    renderSkills();
    renderWeapons();
    updateDerivedStats();
    updateCharacterInfo();
    console.log("Aplicación inicializada correctamente");
}

function rollDice(sides) {
    playSound("diceSound");
    const result = Math.floor(Math.random() * sides) + 1;
    
    // Mostrar resultado
    const resultBox = document.getElementById("resultBox");
    const diceResult = document.getElementById("diceResult");
    const diceIcon = document.getElementById("diceIcon");
    
    diceResult.innerHTML = `<i class="fas fa-dice"></i> Resultado: <strong>${result}</strong>`;
    diceIcon.innerHTML = `<i class="fas fa-dice-d${sides}"></i>`;
    resultBox.classList.add("animate__animated", "animate__rubberBand");
    
    // Agregar al historial
    addToHistory(`D${sides}: ${result}`);
    
    // Eliminar la animación después de que termine
    setTimeout(() => {
        resultBox.classList.remove("animate__rubberBand");
    }, 1000);
    
    return result;
}

function rollSkill() {
    const skillSelect = document.getElementById("skillSelect");
    const selectedSkill = skillSelect.value;
    const skillValue = character.skills[selectedSkill] || SKILLS_7TH[selectedSkill]?.base || 0;
    
    if (!selectedSkill || skillValue === 0) {
        alert("Por favor selecciona una habilidad válida");
        return;
    }
    
    const roll = rollDice(100);
    const resultText = document.getElementById("skillResult");
    
    // Determinar el resultado
    if (roll <= skillValue / 5) {
        resultText.innerHTML = `¡Éxito crítico! (${roll} ≤ ${Math.floor(skillValue / 5)})`;
        resultText.className = "result-text critical-hit";
        playSound("successSound");
    } else if (roll <= skillValue) {
        resultText.innerHTML = `¡Éxito! (${roll} ≤ ${skillValue})`;
        resultText.className = "result-text";
    } else if (roll >= 96) {
        resultText.innerHTML = `¡Fallo crítico! (${roll} ≥ 96)`;
        resultText.className = "result-text critical-fail";
        playSound("failSound");
    } else {
        resultText.innerHTML = `Fallo (${roll} > ${skillValue})`;
        resultText.className = "result-text";
    }
    
    // Agregar al historial
    addToHistory(`${selectedSkill}: ${roll}/${skillValue}`);
}

// ==============================================
// SISTEMA DE FICHA DE PERSONAJE - REDISEÑADO
// ==============================================

function updateDerivedStats() {
    // Cálculos para 7ª edición
    const {str, con, siz, pow, dex} = character.attributes;
    
    // Puntos de Vida (HP)
    character.hp.maximum = Math.floor((con + siz) / 10);
    document.getElementById("hpMax").textContent = character.hp.maximum;
    document.getElementById("hpValue").max = character.hp.maximum;
    
    // Puntos de Magia (MP)
    character.mp.maximum = Math.floor(pow / 5);
    document.getElementById("mpMax").textContent = character.mp.maximum;
    document.getElementById("mpValue").max = character.mp.maximum;
    
    // Daño cuerpo a cuerpo (DB)
    const build = Math.floor((str + siz) / 6);
    character.db = calculateDB(build);
    document.getElementById("dbValue").textContent = character.db;
    
    // Movimiento
    let move = 7;
    if (dex > siz && str > siz) move = 9;
    else if (dex < siz && str < siz) move = 7;
    else move = 8;
    document.getElementById("movementValue").textContent = move;
    
    // Cordura máxima
    character.sanity.maximum = pow;
    document.getElementById("sanityMax").textContent = character.sanity.maximum;
    document.getElementById("sanityValue").max = character.sanity.maximum;
    
    // Actualizar suerte
    document.getElementById("luckValue").value = character.luck;
}

function calculateDB(build) {
    if (build < 1) return "-2";
    if (build < 3) return "-1";
    if (build < 5) return "0";
    if (build < 7) return "1D4";
    if (build < 9) return "1D6";
    if (build < 11) return "2D6";
    if (build < 13) return "3D6";
    if (build < 15) return "4D6";
    return "5D6";
}

function updateCharacterInfo() {
    document.getElementById("charName").value = character.info.name;
    document.getElementById("charOccupation").value = character.info.occupation;
    document.getElementById("charAge").value = character.info.age;
    document.getElementById("charGender").value = character.info.gender;
    
    // Atributos
    document.getElementById("strValue").value = character.attributes.str;
    document.getElementById("conValue").value = character.attributes.con;
    document.getElementById("sizValue").value = character.attributes.siz;
    document.getElementById("dexValue").value = character.attributes.dex;
    document.getElementById("appValue").value = character.attributes.app;
    document.getElementById("intValue").value = character.attributes.int;
    document.getElementById("powValue").value = character.attributes.pow;
    document.getElementById("eduValue").value = character.attributes.edu;
    
    // Salud
    document.getElementById("sanityValue").value = character.sanity.current;
    document.getElementById("hpValue").value = character.hp.current;
    document.getElementById("mpValue").value = character.mp.current;
    document.getElementById("luckValue").value = character.luck;
}

function renderSkills() {
    const skillsList = document.getElementById("skillsList");
    skillsList.innerHTML = "";
    
    // Ordenar habilidades alfabéticamente
    const sortedSkills = Object.entries(character.skills).sort((a, b) => a[0].localeCompare(b[0]));
    
    // Agregar habilidades del personaje
    sortedSkills.forEach(([skill, value]) => {
        const skillData = SKILLS_7TH[skill] || {type: "personal", category: "other"};
        
        const skillItem = document.createElement("div");
        skillItem.className = "skill-item";
        skillItem.dataset.type = skillData.type;
        skillItem.dataset.category = skillData.category;
        
        skillItem.innerHTML = `
            <label>${skill}</label>
            <input type="number" value="${value}" data-skill="${skill}">
            <span>%</span>
            <button class="delete-skill" data-skill="${skill}"><i class="fas fa-trash"></i></button>
        `;
        
        skillsList.appendChild(skillItem);
    });
    
    // Configurar event listeners para inputs de habilidades
    document.querySelectorAll(".skill-item input").forEach(input => {
        input.addEventListener("change", function() {
            const skill = this.dataset.skill;
            const value = parseInt(this.value) || 0;
            character.skills[skill] = value;
            saveCharacter();
        });
    });
    
    // Configurar event listeners para botones de eliminar
    document.querySelectorAll(".delete-skill").forEach(btn => {
        btn.addEventListener("click", function() {
            const skill = this.dataset.skill;
            delete character.skills[skill];
            renderSkills();
            saveCharacter();
        });
    });
    
    // Configurar filtro de habilidades
    const skillsFilter = document.getElementById("skillsFilter");
    if (skillsFilter) {
        skillsFilter.addEventListener("change", function() {
            const filter = this.value;
            document.querySelectorAll(".skill-item").forEach(item => {
                if (filter === "all" || item.dataset.type === filter) {
                    item.style.display = "flex";
                } else {
                    item.style.display = "none";
                }
            });
        });
    }
    
    // Configurar botón para añadir habilidades
    const addSkillBtn = document.getElementById("addSkillBtn");
    if (addSkillBtn) {
        addSkillBtn.addEventListener("click", function() {
            const skillName = prompt("Introduce el nombre de la nueva habilidad:");
            if (skillName && !character.skills[skillName]) {
                character.skills[skillName] = 0;
                renderSkills();
                saveCharacter();
            } else if (skillName) {
                alert("¡Ya tienes esa habilidad!");
            }
        });
    }
}

function renderWeapons() {
    const weaponsList = document.getElementById("weaponsList");
    weaponsList.innerHTML = "";
    
    character.weapons.forEach((weapon, index) => {
        const weaponEntry = document.createElement("div");
        weaponEntry.className = "weapon-entry";
        
        weaponEntry.innerHTML = `
            <div class="weapon-info">
                <input type="text" placeholder="Nombre del arma" value="${weapon.name}" data-index="${index}" data-field="name">
                <div class="weapon-stats">
                    <div>
                        <label>Habilidad</label>
                        <input type="number" value="${weapon.skill}" data-index="${index}" data-field="skill">
                        <span>%</span>
                    </div>
                    <div>
                        <label>Daño</label>
                        <input type="text" value="${weapon.damage}" data-index="${index}" data-field="damage">
                    </div>
                    <div>
                        <label>Alcance</label>
                        <input type="text" value="${weapon.range}" data-index="${index}" data-field="range">
                    </div>
                </div>
            </div>
            <button class="delete-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
        `;
        
        weaponsList.appendChild(weaponEntry);
    });
    
    // Configurar event listeners para inputs de armas
    document.querySelectorAll(".weapon-info input").forEach(input => {
        input.addEventListener("change", function() {
            const index = parseInt(this.dataset.index);
            const field = this.dataset.field;
            character.weapons[index][field] = this.value;
            saveCharacter();
        });
    });
    
    // Configurar event listeners para botones de eliminar
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            const index = parseInt(this.dataset.index);
            character.weapons.splice(index, 1);
            renderWeapons();
            saveCharacter();
        });
    });
    
    // Configurar botón para añadir armas
    const addWeaponBtn = document.getElementById("addWeaponBtn");
    if (addWeaponBtn) {
        addWeaponBtn.addEventListener("click", function() {
            character.weapons.push({
                name: "Nueva arma",
                skill: 0,
                damage: "1D6",
                range: "Contacto"
            });
            renderWeapons();
            saveCharacter();
        });
    }
}

// ==============================================
// IMPORTAR/EXPORTAR FICHAS
// ==============================================

function exportCharacter() {
    // Actualiza los datos del personaje antes de exportar
    saveCharacter();
    
    // Crea el nombre del archivo con la fecha actual
    const date = new Date();
    const dateString = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const fileName = `CoC_${character.info.name || 'Personaje'}_${dateString}.json`;
    
    // Crea el archivo JSON
    const data = JSON.stringify(character, null, 2);
    const blob = new Blob([data], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    
    // Crea el enlace de descarga
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    // Limpieza
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
    
    // Feedback al usuario
    const resultBox = document.getElementById("resultBox");
    resultBox.classList.add("animate__animated", "animate__flash");
    setTimeout(() => resultBox.classList.remove("animate__flash"), 1000);
    
    addToHistory(`Personaje exportado: ${fileName}`);
}

function importCharacter(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Muestra el nombre del archivo seleccionado
    const importBtn = document.getElementById("importSheet");
    const fileNameSpan = document.createElement("span");
    fileNameSpan.className = "file-name";
    fileNameSpan.textContent = file.name;
    importBtn.appendChild(fileNameSpan);
    
    // Elimina el nombre después de 3 segundos
    setTimeout(() => {
        if (importBtn.contains(fileNameSpan)) {
            importBtn.removeChild(fileNameSpan);
        }
    }, 3000);
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedChar = JSON.parse(e.target.result);
            
            // Validación básica del archivo
            if (!importedChar.info || !importedChar.attributes) {
                throw new Error("Archivo no válido");
            }
            
            // Actualiza el personaje
            character = importedChar;
            updateCharacterInfo();
            updateDerivedStats();
            renderSkills();
            renderWeapons();
            
            // Guarda automáticamente
            saveCharacter();
            
            // Feedback visual
            const resultBox = document.getElementById("resultBox");
            resultBox.classList.add("animate__animated", "animate__tada");
            setTimeout(() => resultBox.classList.remove("animate__tada"), 1000);
            
            addToHistory(`Personaje importado: ${file.name}`);
            alert('Personaje importado con éxito!');
            
        } catch (error) {
            console.error('Error al importar:', error);
            alert('Error al importar el personaje. Asegúrate de que es un archivo válido.');
        }
    };
    reader.readAsText(file);
    
    // Resetea el input para permitir importar el mismo archivo otra vez
    event.target.value = '';
}

// ==============================================
// HISTORIAL
// ==============================================

function addToHistory(entry) {
    const historyList = document.getElementById("historyList");
    const li = document.createElement("li");
    li.textContent = entry;
    historyList.prepend(li);
    
    // Limitar historial a 20 entradas
    if (historyList.children.length > 20) {
        historyList.removeChild(historyList.lastChild);
    }
}

function clearHistory() {
    document.getElementById("historyList").innerHTML = "";
}

// ==============================================
// GUARDADO Y CARGA LOCAL
// ==============================================

function saveCharacter() {
    // Recoge todos los datos del formulario
    character.info.name = document.getElementById("charName").value;
    character.info.occupation = document.getElementById("charOccupation").value;
    character.info.age = parseInt(document.getElementById("charAge").value) || 30;
    character.info.gender = document.getElementById("charGender").value;
    
    // Atributos
    character.attributes.str = parseInt(document.getElementById("strValue").value) || 50;
    character.attributes.con = parseInt(document.getElementById("conValue").value) || 50;
    character.attributes.siz = parseInt(document.getElementById("sizValue").value) || 50;
    character.attributes.dex = parseInt(document.getElementById("dexValue").value) || 50;
    character.attributes.app = parseInt(document.getElementById("appValue").value) || 50;
    character.attributes.int = parseInt(document.getElementById("intValue").value) || 50;
    character.attributes.pow = parseInt(document.getElementById("powValue").value) || 50;
    character.attributes.edu = parseInt(document.getElementById("eduValue").value) || 50;
    
    // Salud
    character.sanity.current = parseInt(document.getElementById("sanityValue").value) || 0;
    character.hp.current = parseInt(document.getElementById("hpValue").value) || 0;
    character.mp.current = parseInt(document.getElementById("mpValue").value) || 0;
    character.luck = parseInt(document.getElementById("luckValue").value) || 50;
    
    // Guarda en localStorage
    localStorage.setItem("coc7e_character", JSON.stringify(character));
    
    // Feedback opcional
    addToHistory('Personaje guardado');
}

function loadCharacter() {
    const saved = localStorage.getItem("coc7e_character");
    if (saved) {
        try {
            character = JSON.parse(saved);
            addToHistory('Personaje cargado');
        } catch (error) {
            console.error("Error al cargar personaje:", error);
            addToHistory('Error al cargar personaje');
        }
    }
}

// ==============================================
// EVENT LISTENERS Y UTILIDADES
// ==============================================

function setupEventListeners() {
    // Botones de tema y ficha
    document.getElementById("themeToggle").addEventListener("click", toggleTheme);
    document.getElementById("saveSheet").addEventListener("click", saveCharacter);
    document.getElementById("closeSheet").addEventListener("click", toggleSheet);
    document.getElementById("toggleSheet").addEventListener("click", toggleSheet);
    
    // Importar/Exportar
    document.getElementById("exportSheet").addEventListener("click", exportCharacter);
    document.getElementById("importSheet").addEventListener("click", function() {
        document.getElementById("fileInput").click();
    });
    document.getElementById("fileInput").addEventListener("change", importCharacter);
    
    // Event listeners para pestañas
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const tabId = btn.getAttribute("data-tab");
            switchTab(tabId);
        });
    });
    
    // Actualizar estadísticas cuando cambian los atributos
    document.querySelectorAll(".attribute-value input").forEach(input => {
        input.addEventListener("change", updateDerivedStats);
    });
    
    // Actualizar estadísticas cuando cambian los valores de salud
    document.getElementById("sanityValue").addEventListener("change", function() {
        character.sanity.current = parseInt(this.value) || 0;
        saveCharacter();
    });
    
    document.getElementById("hpValue").addEventListener("change", function() {
        character.hp.current = parseInt(this.value) || 0;
        saveCharacter();
    });
    
    document.getElementById("mpValue").addEventListener("change", function() {
        character.mp.current = parseInt(this.value) || 0;
        saveCharacter();
    });
    
    document.getElementById("luckValue").addEventListener("change", function() {
        character.luck = parseInt(this.value) || 50;
        saveCharacter();
    });
}

function toggleSheet() {
    const sheet = document.getElementById("characterSheet");
    sheet.classList.toggle("active");
}

function switchTab(tabId) {
    // Ocultar todas las pestañas
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.classList.remove("active");
    });
    
    // Desactivar todos los botones
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    
    // Mostrar pestaña seleccionada
    document.getElementById(`${tabId}Tab`).classList.add("active");
    
    // Activar botón seleccionado
    document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add("active");
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode");
    
    const icon = document.querySelector("#themeToggle i");
    if (document.body.classList.contains("light-mode")) {
        icon.classList.replace("fa-moon", "fa-sun");
    } else {
        icon.classList.replace("fa-sun", "fa-moon");
    }
}

function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Error al reproducir sonido:", e));
    }
}

// Iniciar al cargar
document.addEventListener("DOMContentLoaded", init);
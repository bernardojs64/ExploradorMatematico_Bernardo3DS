// Data structure for all tabs
const tabsData = [
  {
    id: "statistics",
    name: "Estatística Descritiva",
    category: "Estatística",
    keywords: ["média", "moda", "mediana", "estatística"],
  },
  {
    id: "frequency",
    name: "Tabela de Frequência",
    category: "Estatística",
    keywords: ["frequência", "tabela", "dados", "classes"],
  },
  {
    id: "histogram",
    name: "Histogramas",
    category: "Estatística",
    keywords: ["histograma", "gráfico", "frequência", "distribuição"],
  },
  {
    id: "sectors",
    name: "Gráfico de Setores",
    category: "Estatística",
    keywords: ["setores", "pizza", "gráfico", "porcentagem"],
  },
  {
    id: "probability",
    name: "Probabilidade",
    category: "Estatística",
    keywords: ["probabilidade", "chance", "eventos"],
  },
  {
    id: "trigonometry",
    name: "Relações Trigonométricas",
    category: "Trigonometria",
    keywords: ["seno", "cosseno", "tangente", "círculo"],
  },
  {
    id: "sine-function",
    name: "Função do Seno",
    category: "Trigonometria",
    keywords: ["seno", "função", "gráfico", "onda"],
  },
  {
    id: "fundamental",
    name: "Relações Fundamentais",
    category: "Trigonometria",
    keywords: ["identidade", "fundamental", "trigonométrica"],
  },
  {
    id: "complex",
    name: "Números Complexos",
    category: "Trigonometria",
    keywords: ["complexo", "imaginário", "módulo"],
  },
  {
    id: "functions",
    name: "Funções e Gráficos",
    category: "Funções",
    keywords: ["função", "gráfico", "exponencial", "logaritmo"],
  },
  {
    id: "progressions",
    name: "Progressões (PA e PG)",
    category: "Funções",
    keywords: ["pa", "pg", "progressão", "termo"],
  },
  { id: "polyhedron", name: "Poliedros", category: "Geometria", keywords: ["poliedro", "euler", "faces", "vértices"] },
  { id: "primes", name: "Números Primos", category: "Teoria dos Números", keywords: ["primo", "divisor", "fatoração"] },
  {
    id: "graph-builder",
    name: "Construtor de Gráficos",
    category: "Ferramentas",
    keywords: ["gráfico", "plotar", "coordenadas", "função"],
  },
]

// State management
let currentTab = "statistics"
let sidebarOpen = window.innerWidth >= 1024
let darkMode = true
const favorites = JSON.parse(localStorage.getItem("mathExplorerFavorites") || "[]")

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  // Hide loading screen
  setTimeout(() => {
    const loadingScreen = document.getElementById("loading-screen")
    loadingScreen.classList.add("fade-out")
    setTimeout(() => loadingScreen.remove(), 500)
  }, 2000)

  // Setup event listeners
  document.getElementById("menu-toggle").addEventListener("click", toggleSidebar)
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme)
  document.getElementById("search-input").addEventListener("input", handleSearch)
  document.getElementById("overlay").addEventListener("click", closeSidebar)

  // Initialize sidebar and content
  renderSidebar()
  renderContent(currentTab)
  updateResponsive()

  window.addEventListener("resize", updateResponsive)
})

function toggleSidebar() {
  sidebarOpen = !sidebarOpen
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("overlay")

  if (sidebarOpen) {
    sidebar.classList.remove("closed")
    sidebar.classList.add("open")
    overlay.classList.add("active")
  } else {
    sidebar.classList.add("closed")
    sidebar.classList.remove("open")
    overlay.classList.remove("active")
  }
}

function closeSidebar() {
  sidebarOpen = false
  document.getElementById("sidebar").classList.add("closed")
  document.getElementById("overlay").classList.remove("active")
}

function toggleTheme() {
  darkMode = !darkMode
  document.body.classList.toggle("dark", darkMode)

  const moonIcon = document.querySelector(".moon-icon")
  const sunIcon = document.querySelector(".sun-icon")

  moonIcon.classList.toggle("hidden", !darkMode)
  sunIcon.classList.toggle("hidden", darkMode)

  localStorage.setItem("mathExplorerTheme", darkMode ? "dark" : "light")
}

function handleSearch(e) {
  const query = e.target.value.toLowerCase()
  renderSidebar(query)
}

function renderSidebar(searchQuery = "") {
  const sidebarContent = document.getElementById("sidebar-content")

  // Filter tabs
  const filteredTabs = searchQuery
    ? tabsData.filter(
        (tab) =>
          tab.name.toLowerCase().includes(searchQuery) ||
          tab.keywords.some((k) => k.toLowerCase().includes(searchQuery)),
      )
    : tabsData

  // Group by category
  const grouped = filteredTabs.reduce((acc, tab) => {
    if (!acc[tab.category]) acc[tab.category] = []
    acc[tab.category].push(tab)
    return acc
  }, {})

  // Render
  let html = ""

  // Favorites section
  if (favorites.length > 0 && !searchQuery) {
    html += '<div class="sidebar-category"><div class="category-title">⭐ Favoritos</div>'
    favorites.forEach((favId) => {
      const tab = tabsData.find((t) => t.id === favId)
      if (tab) {
        html += createTabButton(tab, true)
      }
    })
    html += "</div>"
  }

  // Categories
  Object.entries(grouped).forEach(([category, tabs]) => {
    html += `<div class="sidebar-category"><div class="category-title">${category}</div>`
    tabs.forEach((tab) => {
      html += createTabButton(tab)
    })
    html += "</div>"
  })

  sidebarContent.innerHTML = html

  // Add click listeners
  document.querySelectorAll(".tab-button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const tabId = e.currentTarget.dataset.tab
      switchTab(tabId)
      if (window.innerWidth < 1024) closeSidebar()
    })
  })
}

function createTabButton(tab, isFavorite = false) {
  const isActive = currentTab === tab.id ? "active" : ""
  return `
    <button class="tab-button ${isActive}" data-tab="${tab.id}">
      <span>📊</span>
      <span style="flex: 1; text-align: left;">${tab.name}</span>
    </button>
  `
}

function switchTab(tabId) {
  currentTab = tabId
  renderSidebar()
  renderContent(tabId)
  updateBreadcrumb(tabId)
}

function updateBreadcrumb(tabId) {
  const tab = tabsData.find((t) => t.id === tabId)
  const breadcrumb = document.getElementById("breadcrumb")
  breadcrumb.innerHTML = `📊 / ${tab.category} / <strong>${tab.name}</strong>`
}

function updateResponsive() {
  const mainContent = document.querySelector(".main-content")
  if (window.innerWidth < 1024) {
    sidebarOpen = false
    document.getElementById("sidebar").classList.add("closed")
    mainContent.classList.add("expanded")
  } else {
    sidebarOpen = true
    document.getElementById("sidebar").classList.remove("closed")
    mainContent.classList.remove("expanded")
  }
}

function renderContent(tabId) {
  const contentArea = document.getElementById("content-area")

  switch (tabId) {
    case "statistics":
      contentArea.innerHTML = renderStatistics()
      // setupStatistics() is not defined, removed it.
      break
    case "frequency":
      contentArea.innerHTML = renderFrequencyTable()
      // setupFrequencyTable() is not defined, removed it.
      break
    case "histogram":
      contentArea.innerHTML = renderHistogram()
      setupHistogram()
      break
    case "sectors":
      contentArea.innerHTML = renderSectorChart()
      setupSectorChart()
      break
    case "probability":
      contentArea.innerHTML = renderProbability()
      setupProbability()
      break
    case "trigonometry":
      contentArea.innerHTML = renderTrigonometry()
      setupTrigonometry()
      break
    case "sine-function":
      contentArea.innerHTML = renderSineFunction()
      setupSineFunction()
      break
    case "fundamental":
      contentArea.innerHTML = renderFundamental()
      setupFundamental()
      break
    case "complex":
      contentArea.innerHTML = renderComplex()
      setupComplex()
      break
    case "functions":
      contentArea.innerHTML = renderFunctions()
      setupFunctions()
      break
    case "progressions":
      contentArea.innerHTML = renderProgressions()
      setupProgressions()
      break
    case "polyhedron":
      contentArea.innerHTML = renderPolyhedron()
      setupPolyhedron()
      break
    case "primes":
      contentArea.innerHTML = renderPrimes()
      setupPrimes()
      break
    case "graph-builder":
      contentArea.innerHTML = renderGraphBuilder()
      setupGraphBuilder()
      break
    default:
      contentArea.innerHTML =
        '<div class="card"><h2 class="card-title">Em desenvolvimento</h2><p>Esta seção está em desenvolvimento.</p></div>'
  }
}

//STATISTICS SECTION
function renderStatistics() {
  return `
    <div class="card">
      <h2 class="card-title">📊 Estatística Descritiva</h2>
      <p style="color: var(--muted-foreground); margin-bottom: 2rem;">
        Calcule média, mediana, moda, variância e desvio padrão de um conjunto de dados.
      </p>
      
      <div class="input-group">
        <label class="input-label">Digite os números (separados por vírgula ou espaço):</label>
        <input type="text" id="stats-input" class="input-field" placeholder="Ex: 5, 10, 15, 20, 25">
      </div>
      
      <button onclick="calculateStatistics()" class="button">Calcular Estatísticas</button>
      
      <div id="stats-results" class="result-box hidden">
        <h3 class="card-subtitle">Resultados:</h3>
        <div id="stats-output"></div>
        
        <h3 class="card-subtitle">Passo a Passo:</h3>
        <div id="stats-steps"></div>
        
        <!-- Adicionando botões de salvamento -->
        <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
          <button onclick="saveStatisticsJSON()" class="button" style="background: linear-gradient(135deg, #059669, #0891b2);">
            💾 Salvar JSON
          </button>
          <button onclick="saveStatisticsCSV()" class="button" style="background: linear-gradient(135deg, #059669, #0891b2);">
            📄 Salvar CSV
          </button>
        </div>
      </div>
    </div>
  `
}

let currentStatisticsData = null

function calculateStatistics() {
  const input = document.getElementById("stats-input").value
  const numbers = input
    .split(/[,\s]+/)
    .map((n) => Number.parseFloat(n.trim()))
    .filter((n) => !isNaN(n))

  if (numbers.length === 0) {
    alert("Por favor, insira números válidos!")
    return
  }

  // Sort for median
  const sorted = [...numbers].sort((a, b) => a - b)

  // Mean
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length

  // Median
  const mid = Math.floor(sorted.length / 2)
  const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]

  // Mode
  const frequency = {}
  numbers.forEach((n) => (frequency[n] = (frequency[n] || 0) + 1))
  const maxFreq = Math.max(...Object.values(frequency))
  const modes = Object.keys(frequency).filter((k) => frequency[k] === maxFreq)
  const mode = maxFreq > 1 ? modes.join(", ") : "Não há moda"

  // Variance and Standard Deviation
  const variance = numbers.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / numbers.length
  const stdDev = Math.sqrt(variance)

  currentStatisticsData = {
    dadosOriginais: numbers,
    dadosOrdenados: sorted,
    quantidade: numbers.length,
    media: Number.parseFloat(mean.toFixed(2)),
    mediana: Number.parseFloat(median.toFixed(2)),
    moda: mode,
    variancia: Number.parseFloat(variance.toFixed(2)),
    desvioPadrao: Number.parseFloat(stdDev.toFixed(2)),
    dataCalculo: new Date().toISOString(),
  }

  // Display results
  const resultsDiv = document.getElementById("stats-results")
  resultsDiv.classList.remove("hidden")

  document.getElementById("stats-output").innerHTML = `
    <div class="result-item">
      <span class="result-label">Quantidade de dados:</span>
      <span class="result-value">${numbers.length}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Média:</span>
      <span class="result-value">${mean.toFixed(2)}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Mediana:</span>
      <span class="result-value">${median.toFixed(2)}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Moda:</span>
      <span class="result-value">${mode}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Variância:</span>
      <span class="result-value">${variance.toFixed(2)}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Desvio Padrão:</span>
      <span class="result-value">${stdDev.toFixed(2)}</span>
    </div>
  `

  document.getElementById("stats-steps").innerHTML = `
    <p><strong>1. Média:</strong> Soma todos os valores e divide pela quantidade</p>
    <p style="margin-left: 1rem; color: var(--muted-foreground);">
      (${numbers.join(" + ")}) / ${numbers.length} = ${mean.toFixed(2)}
    </p>
    
    <p><strong>2. Mediana:</strong> Valor central após ordenar os dados</p>
    <p style="margin-left: 1rem; color: var(--muted-foreground);">
      Dados ordenados: ${sorted.join(", ")}
    </p>
    
    <p><strong>3. Moda:</strong> Valor(es) que aparece(m) com maior frequência</p>
    
    <p><strong>4. Variância:</strong> Média dos quadrados das diferenças em relação à média</p>
    
    <p><strong>5. Desvio Padrão:</strong> Raiz quadrada da variância</p>
  `
}

function saveStatisticsJSON() {
  if (!currentStatisticsData) {
    alert("Nenhum dado para salvar! Calcule as estatísticas primeiro.")
    return
  }

  const dataStr = JSON.stringify(currentStatisticsData, null, 2)
  const blob = new Blob([dataStr], { type: "application/json" })
  downloadFile(blob, "estatisticas.json")
}

function saveStatisticsCSV() {
  if (!currentStatisticsData) {
    alert("Nenhum dado para salvar! Calcule as estatísticas primeiro.")
    return
  }

  let csv = "Métrica,Valor\n"
  csv += `Quantidade,${currentStatisticsData.quantidade}\n`
  csv += `Média,${currentStatisticsData.media}\n`
  csv += `Mediana,${currentStatisticsData.mediana}\n`
  csv += `Moda,${currentStatisticsData.moda}\n`
  csv += `Variância,${currentStatisticsData.variancia}\n`
  csv += `Desvio Padrão,${currentStatisticsData.desvioPadrao}\n`
  csv += `\nDados Originais\n${currentStatisticsData.dadosOriginais.join(",")}\n`

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  downloadFile(blob, "estatisticas.csv")
}

// FREQUENCY TABLE SECTION
function renderFrequencyTable() {
  return `
    <div class="card">
      <h2 class="card-title">📋 Criador de Tabela de Frequência</h2>
      <p style="color: var(--muted-foreground); margin-bottom: 2rem;">
        Crie tabelas de frequência com diferentes tipos de organização de dados.
      </p>
      
      <div class="input-group">
        <label class="input-label">Tipo de Tabela:</label>
        <select id="freq-type" class="input-field">
          <option value="simple">Frequência Simples</option>
          <option value="grouped">Frequência Agrupada (Classes)</option>
        </select>
      </div>
      
      <div class="input-group">
        <label class="input-label">Digite os dados (separados por vírgula):</label>
        <input type="text" id="freq-input" class="input-field" placeholder="Ex: 5, 7, 5, 8, 9, 5, 7, 8, 9, 10">
      </div>
      
      <div id="grouped-options" class="hidden">
        <div class="input-group">
          <label class="input-label">Número de classes:</label>
          <input type="number" id="num-classes" class="input-field" value="5" min="3" max="10">
        </div>
      </div>
      
      <button onclick="generateFrequencyTable()" class="button">Gerar Tabela</button>
      
      <div id="freq-results" class="result-box hidden">
        <div id="freq-output"></div>
        
        <!-- Adicionando botões de salvamento para tabela de frequência -->
        <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
          <button onclick="saveFrequencyJSON()" class="button" style="background: linear-gradient(135deg, #059669, #0891b2);">
            💾 Salvar JSON
          </button>
          <button onclick="saveFrequencyCSV()" class="button" style="background: linear-gradient(135deg, #059669, #0891b2);">
            📄 Salvar CSV
          </button>
        </div>
      </div>
    </div>
  `
}

let currentFrequencyData = null

function generateFrequencyTable() {
  const input = document.getElementById("freq-input").value
  const type = document.getElementById("freq-type").value
  const data = input
    .split(/[,\s]+/)
    .map((n) => Number.parseFloat(n.trim()))
    .filter((n) => !isNaN(n))

  if (data.length === 0) {
    alert("Por favor, insira dados válidos!")
    return
  }

  const resultsDiv = document.getElementById("freq-results")
  resultsDiv.classList.remove("hidden")

  if (type === "simple") {
    generateSimpleFrequency(data)
  } else {
    generateGroupedFrequency(data)
  }
}

function generateSimpleFrequency(data) {
  const frequency = {}
  data.forEach((n) => (frequency[n] = (frequency[n] || 0) + 1))

  const total = data.length
  const sorted = Object.keys(frequency)
    .map(Number)
    .sort((a, b) => a - b)

  const tableData = []
  let accumulated = 0

  let html = '<h3 class="card-subtitle">Tabela de Frequência Simples</h3>'
  html += '<table class="data-table">'
  html +=
    "<thead><tr><th>Valor (xi)</th><th>Frequência (fi)</th><th>Freq. Relativa (%)</th><th>Freq. Acumulada</th></tr></thead>"
  html += "<tbody>"

  sorted.forEach((value) => {
    const freq = frequency[value]
    accumulated += freq
    const relative = ((freq / total) * 100).toFixed(1)

    tableData.push({
      valor: value,
      frequencia: freq,
      frequenciaRelativa: Number.parseFloat(relative),
      frequenciaAcumulada: accumulated,
    })

    html += `<tr>
      <td>${value}</td>
      <td>${freq}</td>
      <td>${relative}%</td>
      <td>${accumulated}</td>
    </tr>`
  })

  html += `<tr style="font-weight: 700; background: rgba(16, 185, 129, 0.1);">
    <td>Total</td>
    <td>${total}</td>
    <td>100%</td>
    <td>${total}</td>
  </tr>`
  html += "</tbody></table>"

  currentFrequencyData = {
    tipo: "simples",
    dadosOriginais: data,
    total: total,
    tabela: tableData,
    dataGeracao: new Date().toISOString(),
  }

  document.getElementById("freq-output").innerHTML = html
}

function generateGroupedFrequency(data) {
  const numClasses = Number.parseInt(document.getElementById("num-classes").value)
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min
  const classWidth = Math.ceil(range / numClasses)

  const classes = []
  for (let i = 0; i < numClasses; i++) {
    const lower = min + i * classWidth
    const upper = lower + classWidth
    classes.push({ lower, upper, count: 0, midpoint: (lower + upper) / 2 })
  }

  // Count frequencies
  data.forEach((value) => {
    for (const cls of classes) {
      if (value >= cls.lower && value < cls.upper) {
        cls.count++
        break
      } else if (value === max && cls.upper === min + numClasses * classWidth) {
        cls.count++
        break
      }
    }
  })

  const total = data.length

  const tableData = []
  let accumulated = 0

  let html = '<h3 class="card-subtitle">Tabela de Frequência Agrupada</h3>'
  html += '<table class="data-table">'
  html +=
    "<thead><tr><th>Classe</th><th>Ponto Médio</th><th>Frequência</th><th>Freq. Relativa (%)</th><th>Freq. Acumulada</th></tr></thead>"
  html += "<tbody>"

  classes.forEach((cls) => {
    accumulated += cls.count
    const relative = ((cls.count / total) * 100).toFixed(1)

    tableData.push({
      classe: `${cls.lower.toFixed(1)} ⊢ ${cls.upper.toFixed(1)}`,
      pontoMedio: Number.parseFloat(cls.midpoint.toFixed(1)),
      frequencia: cls.count,
      frequenciaRelativa: Number.parseFloat(relative),
      frequenciaAcumulada: accumulated,
    })

    html += `<tr>
      <td>${cls.lower.toFixed(1)} ⊢ ${cls.upper.toFixed(1)}</td>
      <td>${cls.midpoint.toFixed(1)}</td>
      <td>${cls.count}</td>
      <td>${relative}%</td>
      <td>${accumulated}</td>
    </tr>`
  })

  html += `<tr style="font-weight: 700; background: rgba(16, 185, 129, 0.1);">
    <td colspan="2">Total</td>
    <td>${total}</td>
    <td>100%</td>
    <td>${total}</td>
  </tr>`
  html += "</tbody></table>"

  currentFrequencyData = {
    tipo: "agrupada",
    dadosOriginais: data,
    numeroClasses: numClasses,
    amplitude: classWidth,
    total: total,
    tabela: tableData,
    dataGeracao: new Date().toISOString(),
  }

  document.getElementById("freq-output").innerHTML = html
}

function saveFrequencyJSON() {
  if (!currentFrequencyData) {
    alert("Nenhum dado para salvar! Gere uma tabela de frequência primeiro.")
    return
  }

  const dataStr = JSON.stringify(currentFrequencyData, null, 2)
  const blob = new Blob([dataStr], { type: "application/json" })
  downloadFile(blob, "tabela_frequencia.json")
}

function saveFrequencyCSV() {
  if (!currentFrequencyData) {
    alert("Nenhum dado para salvar! Gere uma tabela de frequência primeiro.")
    return
  }

  let csv = ""

  if (currentFrequencyData.tipo === "simples") {
    csv = "Valor,Frequência,Freq. Relativa (%),Freq. Acumulada\n"
    currentFrequencyData.tabela.forEach((row) => {
      csv += `${row.valor},${row.frequencia},${row.frequenciaRelativa},${row.frequenciaAcumulada}\n`
    })
  } else {
    csv = "Classe,Ponto Médio,Frequência,Freq. Relativa (%),Freq. Acumulada\n"
    currentFrequencyData.tabela.forEach((row) => {
      csv += `"${row.classe}",${row.pontoMedio},${row.frequencia},${row.frequenciaRelativa},${row.frequenciaAcumulada}\n`
    })
  }

  csv += `\nTotal,${currentFrequencyData.total}\n`
  csv += `\nDados Originais\n${currentFrequencyData.dadosOriginais.join(",")}\n`

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  downloadFile(blob, "tabela_frequencia.csv")
}

function downloadFile(blob, filename) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// HISTOGRAM SECTION
function renderHistogram() {
  return `
    <div class="card">
      <h2 class="card-title">📊 Gerador de Histogramas</h2>
      <p style="color: var(--muted-foreground); margin-bottom: 2rem;">
        Visualize a distribuição de frequências através de histogramas.
      </p>
      
      <div class="input-group">
        <label class="input-label">Digite os dados (separados por vírgula):</label>
        <input type="text" id="hist-input" class="input-field" placeholder="Ex: 12, 15, 18, 22, 25, 18, 30, 22, 15, 28">
      </div>
      
      <div class="input-group">
        <label class="input-label">Número de classes:</label>
        <input type="number" id="hist-classes" class="input-field" value="5" min="3" max="10">
      </div>
      
      <button onclick="generateHistogram()" class="button">Gerar Histograma</button>
      
      <div id="hist-results" class="result-box hidden">
        <canvas id="histogram-canvas" class="chart-canvas"></canvas>
        <div class="save-buttons" style="margin-top: 1rem;">
          <button onclick="downloadCanvasAsPNG('histogram-canvas', 'histograma')" class="button button-secondary">🖼️ Salvar PNG</button>
        </div>
      </div>
    </div>
  `
}

function setupHistogram() {
  // Setup complete
}

function generateHistogram() {
  const input = document.getElementById("hist-input").value
  const data = input
    .split(/[,\s]+/)
    .map((n) => Number.parseFloat(n.trim()))
    .filter((n) => !isNaN(n))
  const numClasses = Number.parseInt(document.getElementById("hist-classes").value)

  if (data.length === 0) {
    alert("Por favor, insira dados válidos!")
    return
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min
  const classWidth = Math.ceil(range / numClasses)

  const classes = []
  const frequencies = []

  for (let i = 0; i < numClasses; i++) {
    const lower = min + i * classWidth
    const upper = lower + classWidth
    classes.push(`${lower.toFixed(0)}-${upper.toFixed(0)}`)

    const count = data.filter((v) => (v >= lower && v < upper) || (v === max && i === numClasses - 1)).length
    frequencies.push(count)
  }

  const resultsDiv = document.getElementById("hist-results")
  resultsDiv.classList.remove("hidden")

  // Pure Canvas implementation
  const canvas = document.getElementById("histogram-canvas")
  const ctx = canvas.getContext("2d")
  canvas.width = 800
  canvas.height = 400

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Background
  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--card")
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const padding = 60
  const chartWidth = canvas.width - padding * 2
  const chartHeight = canvas.height - padding * 2
  const maxFreq = Math.max(...frequencies)
  const barWidth = chartWidth / numClasses

  // Draw bars
  frequencies.forEach((freq, i) => {
    const barHeight = (freq / maxFreq) * chartHeight
    const x = padding + i * barWidth
    const y = padding + chartHeight - barHeight

    const gradient = ctx.createLinearGradient(x, y, x, y + barHeight)
    gradient.addColorStop(0, "#10b981")
    gradient.addColorStop(1, "#059669")

    ctx.fillStyle = gradient
    ctx.fillRect(x + 5, y, barWidth - 10, barHeight)

    // Border
    ctx.strokeStyle = "#10b981"
    ctx.lineWidth = 2
    ctx.strokeRect(x + 5, y, barWidth - 10, barHeight)

    // Labels
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--foreground")
    ctx.font = "12px Inter"
    ctx.textAlign = "center"
    ctx.fillText(classes[i], x + barWidth / 2, canvas.height - padding + 20)
    ctx.fillText(freq, x + barWidth / 2, y - 5)
  })

  // Axes
  ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue("--foreground")
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, canvas.height - padding)
  ctx.lineTo(canvas.width - padding, canvas.height - padding)
  ctx.stroke()

  // Title
  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--foreground")
  ctx.font = "bold 18px Inter"
  ctx.textAlign = "center"
  ctx.fillText("Histograma de Frequências", canvas.width / 2, 30)

  // Axis labels
  ctx.font = "14px Inter"
  ctx.fillText("Classes", canvas.width / 2, canvas.height - 10)
  ctx.save()
  ctx.translate(20, canvas.height / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText("Frequência", 0, 0)
  ctx.restore()
}

// SECTOR CHART SECTION
function renderSectorChart() {
  return `
    <div class="card">
      <h2 class="card-title">🥧 Gráfico de Setores (Pizza)</h2>
      <p style="color: var(--muted-foreground); margin-bottom: 2rem;">
        Crie gráficos de setores para visualizar proporções e percentuais.
      </p>
      
      <div class="input-group">
        <label class="input-label">Categorias (separadas por vírgula):</label>
        <input type="text" id="sector-labels" class="input-field" placeholder="Ex: Categoria A, Categoria B, Categoria C">
      </div>
      
      <div class="input-group">
        <label class="input-label">Valores (separados por vírgula):</label>
        <input type="text" id="sector-values" class="input-field" placeholder="Ex: 30, 45, 25">
      </div>
      
      <button onclick="generateSectorChart()" class="button">Gerar Gráfico</button>
      
      <div id="sector-results" class="result-box hidden">
        <canvas id="sector-canvas" class="chart-canvas"></canvas>
        <div id="sector-table"></div>
        <div class="save-buttons" style="margin-top: 1rem;">
          <button onclick="downloadCanvasAsPNG('sector-canvas', 'grafico_setores')" class="button button-secondary">🖼️ Salvar PNG</button>
        </div>
      </div>
    </div>
  `
}

function setupSectorChart() {
  // Setup complete
}

function generateSectorChart() {
  const labelsInput = document.getElementById("sector-labels").value
  const valuesInput = document.getElementById("sector-values").value

  const labels = labelsInput
    .split(/[,]+/)
    .map((l) => l.trim())
    .filter((l) => l)
  const values = valuesInput
    .split(/[,\s]+/)
    .map((n) => Number.parseFloat(n.trim()))
    .filter((n) => !isNaN(n))

  if (labels.length === 0 || values.length === 0 || labels.length !== values.length) {
    alert("Por favor, insira rótulos e valores válidos com a mesma quantidade!")
    return
  }

  const total = values.reduce((a, b) => a + b, 0)
  const percentages = values.map((v) => ((v / total) * 100).toFixed(1))

  const resultsDiv = document.getElementById("sector-results")
  resultsDiv.classList.remove("hidden")

  // Pure Canvas implementation
  const canvas = document.getElementById("sector-canvas")
  const ctx = canvas.getContext("2d")
  canvas.width = 600
  canvas.height = 600

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Background
  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--card")
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const centerX = canvas.width / 2
  const centerY = canvas.height / 2 - 30
  const radius = 180

  const colors = ["#10b981", "#06b6d4", "#34d399", "#22d3ee", "#059669", "#0891b2"]

  let currentAngle = -Math.PI / 2

  // Draw pie slices
  values.forEach((value, i) => {
    const sliceAngle = (value / total) * 2 * Math.PI

    ctx.fillStyle = colors[i % colors.length]
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
    ctx.closePath()
    ctx.fill()

    // Border
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 2
    ctx.stroke()

    // Label
    const labelAngle = currentAngle + sliceAngle / 2
    const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7)
    const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7)

    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 14px Inter"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(`${percentages[i]}%`, labelX, labelY)

    currentAngle += sliceAngle
  })

  // Title
  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--foreground")
  ctx.font = "bold 18px Inter"
  ctx.textAlign = "center"
  ctx.fillText("Gráfico de Setores", centerX, 30)

  // Legend
  const legendY = centerY + radius + 50
  labels.forEach((label, i) => {
    const legendX = 50 + (i % 3) * 180
    const legendYPos = legendY + Math.floor(i / 3) * 30

    ctx.fillStyle = colors[i % colors.length]
    ctx.fillRect(legendX, legendYPos, 20, 20)

    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--foreground")
    ctx.font = "12px Inter"
    ctx.textAlign = "left"
    ctx.fillText(label, legendX + 30, legendYPos + 15)
  })

  // Display percentages table
  let percHtml = '<h3 class="card-subtitle">Percentuais:</h3>'
  percHtml +=
    '<table class="data-table"><thead><tr><th>Categoria</th><th>Valor</th><th>Percentual</th></tr></thead><tbody>'

  labels.forEach((label, i) => {
    percHtml += `<tr>
      <td>${label}</td>
      <td>${values[i]}</td>
      <td>${percentages[i]}%</td>
    </tr>`
  })

  percHtml += `<tr style="font-weight: 700; background: rgba(16, 185, 129, 0.1);">
    <td>Total</td>
    <td>${total}</td>
    <td>100%</td>
  </tr></tbody></table>`

  document.getElementById("sector-table").innerHTML = percHtml
}

// PROBABILITY SECTION
function renderProbability() {
  return `
    <div class="card">
      <h2 class="card-title">🎲 Probabilidade e Análise Combinatória</h2>
      
      <h3 class="card-subtitle">Probabilidade Simples</h3>
      <div class="input-group">
        <label class="input-label">Eventos favoráveis:</label>
        <input type="number" id="prob-favorable" class="input-field" value="1" min="0">
      </div>
      <div class="input-group">
        <label class="input-label">Total de eventos possíveis:</label>
        <input type="number" id="prob-total" class="input-field" value="6" min="1">
      </div>
      <button onclick="calculateProbability()" class="button">Calcular Probabilidade</button>
      <div id="prob-result" class="result-box hidden"></div>
      
      <h3 class="card-subtitle">Análise Combinatória</h3>
      <div class="input-group">
        <label class="input-label">Tipo de cálculo:</label>
        <select id="comb-type" class="input-field">
          <option value="permutation">Permutação (n!)</option>
          <option value="arrangement">Arranjo (A(n,r))</option>
          <option value="combination">Combinação (C(n,r))</option>
        </select>
      </div>
      <div class="input-group">
        <label class="input-label">n (total de elementos):</label>
        <input type="number" id="comb-n" class="input-field" value="5" min="0">
      </div>
      <div class="input-group" id="comb-r-group">
        <label class="input-label">r (elementos escolhidos):</label>
        <input type="number" id="comb-r" class="input-field" value="3" min="0">
      </div>
      <button onclick="calculateCombinatorics()" class="button">Calcular</button>
      <div id="comb-result" class="result-box hidden"></div>
    </div>
  `
}

function setupProbability() {
  document.getElementById("comb-type").addEventListener("change", (e) => {
    document.getElementById("comb-r-group").classList.toggle("hidden", e.target.value === "permutation")
  })
}

function calculateProbability() {
  const favorable = Number.parseInt(document.getElementById("prob-favorable").value)
  const total = Number.parseInt(document.getElementById("prob-total").value)

  if (total === 0) {
    alert("Total não pode ser zero!")
    return
  }

  const probability = favorable / total
  const percentage = (probability * 100).toFixed(2)

  document.getElementById("prob-result").classList.remove("hidden")
  document.getElementById("prob-result").innerHTML = `
    <h3 class="card-subtitle">Resultado:</h3>
    <div class="result-item">
      <span class="result-label">Probabilidade:</span>
      <span class="result-value">${favorable}/${total} = ${probability.toFixed(4)}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Percentual:</span>
      <span class="result-value">${percentage}%</span>
    </div>
    <p style="margin-top: 1rem; color: var(--muted-foreground);">
      <strong>Fórmula:</strong> P(E) = Eventos Favoráveis / Total de Eventos
    </p>
  `
}

function factorial(n) {
  if (n <= 1) return 1
  return n * factorial(n - 1)
}

function calculateCombinatorics() {
  const type = document.getElementById("comb-type").value
  const n = Number.parseInt(document.getElementById("comb-n").value)
  const r = Number.parseInt(document.getElementById("comb-r").value)

  let result, formula, explanation

  if (type === "permutation") {
    result = factorial(n)
    formula = `P(${n}) = ${n}!`
    explanation = `Número de maneiras de ordenar ${n} elementos`
  } else if (type === "arrangement") {
    if (r > n) {
      alert("r não pode ser maior que n!")
      return
    }
    result = factorial(n) / factorial(n - r)
    formula = `A(${n},${r}) = ${n}! / (${n}-${r})!`
    explanation = `Número de maneiras de escolher e ordenar ${r} elementos de ${n}`
  } else {
    if (r > n) {
      alert("r não pode ser maior que n!")
      return
    }
    result = factorial(n) / (factorial(r) * factorial(n - r))
    formula = `C(${n},${r}) = ${n}! / (${r}! × (${n}-${r})!)`
    explanation = `Número de maneiras de escolher ${r} elementos de ${n} (sem ordem)`
  }

  document.getElementById("comb-result").classList.remove("hidden")
  document.getElementById("comb-result").innerHTML = `
    <h3 class="card-subtitle">Resultado:</h3>
    <div class="result-item">
      <span class="result-label">Fórmula:</span>
      <span class="result-value">${formula}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Resultado:</span>
      <span class="result-value">${result}</span>
    </div>
    <p style="margin-top: 1rem; color: var(--muted-foreground);">${explanation}</p>
  `
}

// TRIGONOMETRY SECTION
function renderTrigonometry() {
  return `
    <div class="card">
      <h2 class="card-title">📐 Relações Trigonométricas</h2>
      
      <div class="input-group">
        <label class="input-label">Ângulo (graus):</label>
        <input type="range" id="trig-angle" class="input-field" min="0" max="360" value="45" oninput="updateTrigonometry()">
        <span id="trig-angle-value" class="result-value">45°</span>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 2rem 0;">
        <div>
          <canvas id="trig-circle" width="300" height="300" style="max-width: 100%; border: 2px solid var(--border); border-radius: 0.75rem; background: var(--card);"></canvas>
          <div class="save-buttons" style="margin-top: 0.5rem;">
            <button onclick="downloadCanvasAsPNG('trig-circle', 'circulo_trigonometrico')" class="button button-secondary">🖼️ Salvar PNG</button>
          </div>
        </div>
        <div id="trig-values" class="result-box"></div>
      </div>
      
      <div class="save-buttons">
        <button onclick="saveTrigonometryData('json')" class="button button-secondary">💾 Salvar JSON</button>
        <button onclick="saveTrigonometryData('csv')" class="button button-secondary">📊 Salvar CSV</button>
      </div>
      
      <div class="result-box">
        <h3 class="card-subtitle">Relações Fundamentais:</h3>
        <p><strong>sen²(θ) + cos²(θ) = 1</strong></p>
        <p><strong>tan(θ) = sen(θ) / cos(θ)</strong></p>
        <p><strong>sec(θ) = 1 / cos(θ)</strong></p>
        <p><strong>csc(θ) = 1 / sen(θ)</strong></p>
        <p><strong>cot(θ) = 1 / tan(θ)</strong></p>
      </div>
    </div>
  `
}

function setupTrigonometry() {
  updateTrigonometry()
}

function updateTrigonometry() {
  const angle = Number.parseInt(document.getElementById("trig-angle").value)
  document.getElementById("trig-angle-value").textContent = angle + "°"

  const rad = (angle * Math.PI) / 180
  const sin = Math.sin(rad)
  const cos = Math.cos(rad)
  const tan = Math.tan(rad)

  // Draw circle
  const canvas = document.getElementById("trig-circle")
  const ctx = canvas.getContext("2d")
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = 120

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Circle
  ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue("--primary")
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
  ctx.stroke()

  // Axes
  ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue("--muted-foreground")
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, centerY)
  ctx.lineTo(canvas.width, centerY)
  ctx.moveTo(centerX, 0)
  ctx.lineTo(centerX, canvas.height)
  ctx.stroke()

  // Angle line
  const endX = centerX + radius * cos
  const endY = centerY - radius * sin

  ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue("--cyan")
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(centerX, centerY)
  ctx.lineTo(endX, endY)
  ctx.stroke()

  // Point
  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--accent")
  ctx.beginPath()
  ctx.arc(endX, endY, 6, 0, 2 * Math.PI)
  ctx.fill()

  // Display values
  document.getElementById("trig-values").innerHTML = `
    <div class="result-item">
      <span class="result-label">sen(${angle}°):</span>
      <span class="result-value">${sin.toFixed(4)}</span>
    </div>
    <div class="result-item">
      <span class="result-label">cos(${angle}°):</span>
      <span class="result-value">${cos.toFixed(4)}</span>
    </div>
    <div class="result-item">
      <span class="result-label">tan(${angle}°):</span>
      <span class="result-value">${tan.toFixed(4)}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Verificação:</span>
      <span class="result-value">sen²+cos² = ${(sin * sin + cos * cos).toFixed(4)}</span>
    </div>
  `
}

// Trigonometry save functions
function downloadJSON(data, filename) {
  const dataStr = JSON.stringify(data, null, 2)
  const blob = new Blob([dataStr], { type: "application/json" })
  downloadFile(blob, `${filename}.json`)
}

function downloadCSV(csvString, filename) {
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
  downloadFile(blob, `${filename}.csv`)
}

function saveTrigonometryData(format) {
  const angle = Number.parseInt(document.getElementById("trig-angle").value)
  const rad = (angle * Math.PI) / 180
  const sin = Math.sin(rad)
  const cos = Math.cos(rad)
  const tan = Math.tan(rad)
  const sec = 1 / cos
  const csc = 1 / sin
  const cot = 1 / tan

  const data = {
    secao: "Relações Trigonométricas",
    angulo_graus: angle,
    angulo_radianos: rad.toFixed(4),
    seno: sin.toFixed(4),
    cosseno: cos.toFixed(4),
    tangente: tan.toFixed(4),
    secante: sec.toFixed(4),
    cossecante: csc.toFixed(4),
    cotangente: cot.toFixed(4),
    verificacao_fundamental: (sin * sin + cos * cos).toFixed(4),
    data_hora: new Date().toLocaleString("pt-BR"),
  }

  if (format === "json") {
    downloadJSON(data, "trigonometria_relacoes")
  } else {
    const csv =
      `Seção,Ângulo (graus),Ângulo (radianos),Seno,Cosseno,Tangente,Secante,Cossecante,Cotangente,Verificação\n` +
      `${data.secao},${data.angulo_graus},${data.angulo_radianos},${data.seno},${data.cosseno},${data.tangente},${data.secante},${data.cossecante},${data.cotangente},${data.verificacao_fundamental}`
    downloadCSV(csv, "trigonometria_relacoes")
  }
}

// SINE FUNCTION SECTION
function renderSineFunction() {
  return `
    <div class="card">
      <h2 class="card-title">🌊 Função do Seno</h2>
      <p style="color: var(--muted-foreground); margin-bottom: 2rem;">
        Explore a função f(x) = a·sen(b·x + c) + d
      </p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div class="input-group">
          <label class="input-label">Amplitude (a): <span id="sine-a-val">1</span></label>
          <input type="range" id="sine-a" min="-5" max="5" step="0.1" value="1" oninput="updateSineFunction()">
        </div>
        <div class="input-group">
          <label class="input-label">Frequência (b): <span id="sine-b-val">1</span></label>
          <input type="range" id="sine-b" min="0.1" max="5" step="0.1" value="1" oninput="updateSineFunction()">
        </div>
        <div class="input-group">
          <label class="input-label">Fase (c): <span id="sine-c-val">0</span></label>
          <input type="range" id="sine-c" min="-6" max="6" step="0.1" value="0" oninput="updateSineFunction()">
        </div>
        <div class="input-group">
          <label class="input-label">Deslocamento (d): <span id="sine-d-val">0</span></label>
          <input type="range" id="sine-d" min="-5" max="5" step="0.1" value="0" oninput="updateSineFunction()">
        </div>
      </div>
      
      <canvas id="sine-canvas" width="800" height="400" class="chart-canvas" style="margin-top: 1.5rem;"></canvas>
      
      <div class="result-box" style="margin-top: 1.5rem;">
        <p id="sine-formula" class="result-value" style="text-align: center; font-size: 1.25rem;"></p>
      </div>
      
      <div class="save-buttons">
        <button onclick="downloadCanvasAsPNG('sine-canvas', 'funcao_seno')" class="button button-secondary">🖼️ Salvar PNG</button>
        <button onclick="saveSineFunctionData('json')" class="button button-secondary">💾 Salvar JSON</button>
        <button onclick="saveSineFunctionData('csv')" class="button button-secondary">📊 Salvar CSV</button>
      </div>
    </div>
  `
}

function setupSineFunction() {
  updateSineFunction()
}

function updateSineFunction() {
  const a = Number.parseFloat(document.getElementById("sine-a").value)
  const b = Number.parseFloat(document.getElementById("sine-b").value)
  const c = Number.parseFloat(document.getElementById("sine-c").value)
  const d = Number.parseFloat(document.getElementById("sine-d").value)

  document.getElementById("sine-a-val").textContent = a.toFixed(1)
  document.getElementById("sine-b-val").textContent = b.toFixed(1)
  document.getElementById("sine-c-val").textContent = c.toFixed(1)
  document.getElementById("sine-d-val").textContent = d.toFixed(1)

  const canvas = document.getElementById("sine-canvas")
  const ctx = canvas.getContext("2d")
  const width = canvas.width
  const height = canvas.height

  ctx.clearRect(0, 0, width, height)

  // Background
  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--card")
  ctx.fillRect(0, 0, width, height)

  // Grid
  ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue("--border")
  ctx.lineWidth = 1
  for (let i = 0; i <= 10; i++) {
    const y = (height / 10) * i
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
  for (let i = 0; i <= 20; i++) {
    const x = (width / 20) * i
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  // Axes
  ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue("--foreground")
  ctx.lineWidth = 2
  const centerY = height / 2
  ctx.beginPath()
  ctx.moveTo(0, centerY)
  ctx.lineTo(width, centerY)
  ctx.stroke()

  // Draw sine wave
  ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue("--primary")
  ctx.lineWidth = 3
  ctx.beginPath()

  for (let x = 0; x < width; x++) {
    const xVal = (x / width) * 4 * Math.PI
    const yVal = a * Math.sin(b * xVal + c) + d
    const yPixel = centerY - (yVal / 10) * (height / 2)

    if (x === 0) {
      ctx.moveTo(x, yPixel)
    } else {
      ctx.lineTo(x, yPixel)
    }
  }
  ctx.stroke()

  // Update formula
  const signC = c >= 0 ? "+" : ""
  const signD = d >= 0 ? "+" : ""
  document.getElementById("sine-formula").textContent = `f(x) = ${a}·sen(${b}·x ${signC} ${c}) ${signD} ${d}`
}

function saveSineFunctionData(format) {
  const a = Number.parseFloat(document.getElementById("sine-a").value)
  const b = Number.parseFloat(document.getElementById("sine-b").value)
  const c = Number.parseFloat(document.getElementById("sine-c").value)
  const d = Number.parseFloat(document.getElementById("sine-d").value)

  const data = {
    secao: "Função do Seno",
    parametros: { amplitude: a, frequencia: b, fase: c, deslocamento: d },
    formula: `f(x) = ${a}·sen(${b}·x + ${c}) + ${d}`,
    data_hora: new Date().toLocaleString("pt-BR"),
  }

  if (format === "json") {
    downloadJSON(data, "funcao_seno")
  } else {
    const csv =
      `Seção,Amplitude,Frequência,Fase,Deslocamento,Fórmula\n` + `${data.secao},${a},${b},${c},${d},"${data.formula}"`
    downloadCSV(csv, "funcao_seno")
  }
}

// FUNDAMENTAL RELATIONS SECTION
function renderFundamental() {
  return `
    <div class="card">
      <h2 class="card-title">🔗 Relações Fundamentais e Derivadas</h2>
      
      <h3 class="card-subtitle">Verificador de Identidades</h3>
      <div class="input-group">
        <label class="input-label">Ângulo (graus):</label>
        <input type="number" id="fund-angle" class="input-field" value="30" min="0" max="360">
      </div>
      <button onclick="verifyIdentities()" class="button">Verificar Identidades</button>
      <div id="fund-result" class="result-box hidden"></div>
      
      <div class="save-buttons" id="fund-save-buttons" style="display: none;">
        <button onclick="saveFundamentalData('json')" class="button button-secondary">💾 Salvar JSON</button>
        <button onclick="saveFundamentalData('csv')" class="button button-secondary">📊 Salvar CSV</button>
      </div>
      
      <div class="result-box" style="margin-top: 2rem;">
        <h3 class="card-subtitle">Derivadas Trigonométricas:</h3>
        <table class="data-table">
          <thead><tr><th>Função</th><th>Derivada</th></tr></thead>
          <tbody>
            <tr><td>sen(x)</td><td>cos(x)</td></tr>
            <tr><td>cos(x)</td><td>-sen(x)</td></tr>
            <tr><td>tan(x)</td><td>sec²(x)</td></tr>
            <tr><td>sec(x)</td><td>sec(x)·tan(x)</td></tr>
            <tr><td>csc(x)</td><td>-csc(x)·cot(x)</td></tr>
            <tr><td>cot(x)</td><td>-csc²(x)</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `
}

function setupFundamental() {}

function verifyIdentities() {
  const angle = Number.parseFloat(document.getElementById("fund-angle").value)
  const rad = (angle * Math.PI) / 180

  const sin = Math.sin(rad)
  const cos = Math.cos(rad)
  const tan = Math.tan(rad)

  const identity1 = sin * sin + cos * cos
  const identity2 = tan - sin / cos
  const identity3 = 1 + tan * tan - 1 / (cos * cos)

  window.currentFundamentalData = {
    angulo_graus: angle,
    angulo_radianos: rad,
    seno: sin,
    cosseno: cos,
    tangente: tan,
    identidade1: identity1,
    identidade2: identity2,
    identidade3: identity3,
  }

  document.getElementById("fund-result").classList.remove("hidden")
  document.getElementById("fund-result").innerHTML = `
    <h3 class="card-subtitle">Verificação para ${angle}°:</h3>
    <div class="result-item">
      <span class="result-label">sen²(θ) + cos²(θ):</span>
      <span class="result-value">${identity1.toFixed(6)} ≈ 1 ✓</span>
    </div>
    <div class="result-item">
      <span class="result-label">tan(θ) - sen(θ)/cos(θ):</span>
      <span class="result-value">${identity2.toFixed(6)} ≈ 0 ✓</span>
    </div>
    <div class="result-item">
      <span class="result-label">1 + tan²(θ) - sec²(θ):</span>
      <span class="result-value">${identity3.toFixed(6)} ≈ 0 ✓</span>
    </div>
  `

  document.getElementById("fund-save-buttons").style.display = "flex"
}

function saveFundamentalData(format) {
  if (!window.currentFundamentalData) return

  const data = {
    secao: "Relações Fundamentais",
    ...window.currentFundamentalData,
    data_hora: new Date().toLocaleString("pt-BR"),
  }

  if (format === "json") {
    downloadJSON(data, "relacoes_fundamentais")
  } else {
    const csv =
      `Seção,Ângulo (graus),Seno,Cosseno,Tangente,Identidade 1,Identidade 2,Identidade 3\n` +
      `${data.secao},${data.angulo_graus},${data.seno.toFixed(6)},${data.cosseno.toFixed(6)},${data.tangente.toFixed(6)},${data.identidade1.toFixed(6)},${data.identidade2.toFixed(6)},${data.identidade3.toFixed(6)}`
    downloadCSV(csv, "relacoes_fundamentais")
  }
}

// COMPLEX NUMBERS SECTION
function renderComplex() {
  return `
    <div class="card">
      <h2 class="card-title">🔢 Números Complexos</h2>
      
      <h3 class="card-subtitle">Forma Algébrica (a + bi)</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="input-group">
          <label class="input-label">Parte Real (a):</label>
          <input type="number" id="complex-a" class="input-field" value="3" step="0.1">
        </div>
        <div class="input-group">
          <label class="input-label">Parte Imaginária (b):</label>
          <input type="number" id="complex-b" class="input-field" value="4" step="0.1">
        </div>
      </div>
      <button onclick="calculateComplex()" class="button">Calcular</button>
      <div id="complex-result" class="result-box hidden"></div>
      
      <div class="save-buttons" id="complex-save-buttons" style="display: none;">
        <button onclick="saveComplexData('json')" class="button button-secondary">💾 Salvar JSON</button>
        <button onclick="saveComplexData('csv')" class="button button-secondary">📊 Salvar CSV</button>
      </div>
      
      <div class="result-box" style="margin-top: 2rem;">
        <h3 class="card-subtitle">Lei dos Senos e Cossenos</h3>
        <p><strong>Lei dos Senos:</strong> a/sen(A) = b/sen(B) = c/sen(C)</p>
        <p><strong>Lei dos Cossenos:</strong> c² = a² + b² - 2ab·cos(C)</p>
      </div>
    </div>
  `
}

function setupComplex() {}

function calculateComplex() {
  const a = Number.parseFloat(document.getElementById("complex-a").value)
  const b = Number.parseFloat(document.getElementById("complex-b").value)

  const modulo = Math.sqrt(a * a + b * b)
  const angulo = (Math.atan2(b, a) * 180) / Math.PI
  const conjugado = `${a} - ${Math.abs(b)}i`

  window.currentComplexData = {
    parte_real: a,
    parte_imaginaria: b,
    modulo: modulo,
    argumento_graus: angulo,
    conjugado: conjugado,
    forma_trigonometrica: `${modulo.toFixed(2)}(cos ${angulo.toFixed(1)}° + i·sen ${angulo.toFixed(1)}°)`,
  }

  document.getElementById("complex-result").classList.remove("hidden")
  document.getElementById("complex-result").innerHTML = `
    <h3 class="card-subtitle">Resultados para z = ${a} + ${b}i:</h3>
    <div class="result-item">
      <span class="result-label">Módulo |z|:</span>
      <span class="result-value">${modulo.toFixed(4)}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Argumento (θ):</span>
      <span class="result-value">${angulo.toFixed(2)}°</span>
    </div>
    <div class="result-item">
      <span class="result-label">Conjugado:</span>
      <span class="result-value">${conjugado}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Forma Trigonométrica:</span>
      <span class="result-value">${modulo.toFixed(2)}(cos ${angulo.toFixed(1)}° + i·sen ${angulo.toFixed(1)}°)</span>
    </div>
  `

  document.getElementById("complex-save-buttons").style.display = "flex"
}

function saveComplexData(format) {
  if (!window.currentComplexData) return

  const data = {
    secao: "Números Complexos",
    ...window.currentComplexData,
    data_hora: new Date().toLocaleString("pt-BR"),
  }

  if (format === "json") {
    downloadJSON(data, "numeros_complexos")
  } else {
    const csv =
      `Seção,Parte Real,Parte Imaginária,Módulo,Argumento (graus),Conjugado,Forma Trigonométrica\n` +
      `${data.secao},${data.parte_real},${data.parte_imaginaria},${data.modulo.toFixed(4)},${data.argumento_graus.toFixed(2)},"${data.conjugado}","${data.forma_trigonometrica}"`
    downloadCSV(csv, "numeros_complexos")
  }
}

// FUNCTIONS SECTION
function renderFunctions() {
  return `
    <div class="card">
      <h2 class="card-title">📈 Funções e Gráficos</h2>
      
      <div class="input-group">
        <label class="input-label">Tipo de Função:</label>
        <select id="func-type" class="input-field" onchange="updateFunctionInputs()">
          <option value="linear">Linear (ax + b)</option>
          <option value="quadratic">Quadrática (ax² + bx + c)</option>
          <option value="exponential">Exponencial (a·bˣ)</option>
          <option value="logarithmic">Logarítmica (a·log(x) + b)</option>
        </select>
      </div>
      
      <div id="func-params"></div>
      
      <button onclick="plotFunction()" class="button">Plotar Função</button>
      
      <div class="save-buttons" id="func-save-buttons" style="display: none; margin-top: 1rem;">
        <button onclick="saveFunctionData('json')" class="button button-secondary">💾 Salvar JSON</button>
        <button onclick="saveFunctionData('csv')" class="button button-secondary">📊 Salvar CSV</button>
      </div>
      
      <canvas id="func-canvas" width="800" height="400" class="chart-canvas" style="margin-top: 1.5rem;"></canvas>
    </div>
  `
}

function setupFunctions() {
  updateFunctionInputs()
}

function updateFunctionInputs() {
  const type = document.getElementById("func-type").value
  let html = ""

  if (type === "linear") {
    html = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="input-group">
          <label class="input-label">a (coeficiente angular):</label>
          <input type="number" id="func-a" class="input-field" value="2" step="0.1">
        </div>
        <div class="input-group">
          <label class="input-label">b (coeficiente linear):</label>
          <input type="number" id="func-b" class="input-field" value="1" step="0.1">
        </div>
      </div>
    `
  } else if (type === "quadratic") {
    html = `
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
        <div class="input-group">
          <label class="input-label">a:</label>
          <input type="number" id="func-a" class="input-field" value="1" step="0.1">
        </div>
        <div class="input-group">
          <label class="input-label">b:</label>
          <input type="number" id="func-b" class="input-field" value="0" step="0.1">
        </div>
        <div class="input-group">
          <label class="input-label">c:</label>
          <input type="number" id="func-c" class="input-field" value="0" step="0.1">
        </div>
      </div>
    `
  } else if (type === "exponential") {
    html = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="input-group">
          <label class="input-label">a (multiplicador):</label>
          <input type="number" id="func-a" class="input-field" value="1" step="0.1">
        </div>
        <div class="input-group">
          <label class="input-label">b (base):</label>
          <input type="number" id="func-b" class="input-field" value="2" step="0.1" min="0.1">
        </div>
      </div>
    `
  } else {
    html = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="input-group">
          <label class="input-label">a (multiplicador):</label>
          <input type="number" id="func-a" class="input-field" value="1" step="0.1">
        </div>
        <div class="input-group">
          <label class="input-label">b (deslocamento):</label>
          <input type="number" id="func-b" class="input-field" value="0" step="0.1">
        </div>
      </div>
    `
  }

  document.getElementById("func-params").innerHTML = html
}

function plotFunction() {
  const type = document.getElementById("func-type").value
  const a = Number.parseFloat(document.getElementById("func-a").value)
  const b = Number.parseFloat(document.getElementById("func-b").value)
  const c = document.getElementById("func-c") ? Number.parseFloat(document.getElementById("func-c").value) : 0
  const d = document.getElementById("func-d") ? Number.parseFloat(document.getElementById("func-d").value) : 0 // Added for completeness, though not used in current types

  const canvas = document.getElementById("func-canvas")
  const ctx = canvas.getContext("2d")
  const width = canvas.width
  const height = canvas.height

  ctx.clearRect(0, 0, width, height)

  // Background and grid
  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--card")
  ctx.fillRect(0, 0, width, height)

  ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue("--border")
  ctx.lineWidth = 1
  for (let i = 0; i <= 10; i++) {
    ctx.beginPath()
    ctx.moveTo(0, (height / 10) * i)
    ctx.lineTo(width, (height / 10) * i)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo((width / 10) * i, 0)
    ctx.lineTo((width / 10) * i, height)
    ctx.stroke()
  }

  // Axes
  ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue("--foreground")
  ctx.lineWidth = 2
  const centerY = height / 2
  const centerX = width / 2
  ctx.beginPath()
  ctx.moveTo(0, centerY)
  ctx.lineTo(width, centerY)
  ctx.moveTo(centerX, 0)
  ctx.lineTo(centerX, height)
  ctx.stroke()

  // Plot function
  ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue("--primary")
  ctx.lineWidth = 3
  ctx.beginPath()

  let firstPoint = true
  const points = []

  // Adjusted loop to cover a wider range and sample points for saving
  for (let x = -10; x <= 10; x += 0.1) {
    let y
    if (type === "linear") {
      y = a * x + b
    } else if (type === "quadratic") {
      y = a * x * x + b * x + c
    } else if (type === "exponential") {
      // Ensure base is valid for exponential function
      if (b <= 0) {
        console.error("Base 'b' for exponential function must be positive.")
        return // Exit if base is invalid
      }
      y = a * Math.pow(b, x)
    } else {
      // logarithmic
      // Ensure x is positive for logarithmic function
      if (x <= 0) {
        continue // Skip non-positive x values for log
      }
      y = a * Math.log(x) + b
    }

    if (y !== null && !isNaN(y) && isFinite(y)) {
      const screenX = centerX + x * (width / 20)
      const screenY = centerY - y * (height / 20)

      // Store points, sampling for better performance in save data
      if (x === -10 || (Math.abs(x - Math.round(x * 10) / 10) < 0.001 && x !== 0) || x === 10) {
        points.push({ x: x.toFixed(2), y: y.toFixed(2) })
      }

      if (screenX < 0 || screenX > width || screenY < 0 || screenY > height) continue // Clip to canvas bounds

      if (firstPoint) {
        ctx.moveTo(screenX, screenY)
        firstPoint = false
      } else {
        ctx.lineTo(screenX, screenY)
      }
    }
  }

  ctx.stroke()

  window.currentFunctionData = {
    type,
    parameters: type === "quadratic" ? { a, b, c } : type === "logarithmic" ? { a, b } : { a, b }, // Adjust parameters based on type
    points: points.filter((_, i) => i % 10 === 0), // Sample points for saving
  }

  document.getElementById("func-save-buttons").style.display = "flex"
}

function saveFunctionData(format) {
  if (!window.currentFunctionData) return

  const typeNames = {
    linear: "Linear",
    quadratic: "Quadrática",
    exponential: "Exponencial",
    logarithmic: "Logarítmica",
  }

  const data = {
    secao: "Funções e Gráficos",
    tipo_funcao: typeNames[window.currentFunctionData.type],
    parameters: window.currentFunctionData.parameters,
    points: window.currentFunctionData.points,
    data_hora: new Date().toLocaleString("pt-BR"),
  }

  if (format === "json") {
    downloadJSON(data, "funcoes_graficos")
  } else {
    let csv = `Seção,Tipo,Parâmetros,Pontos (x;y)\n`
    const params = Object.entries(data.parameters)
      .map(([k, v]) => `${k}=${v}`)
      .join(" ")
    const points = data.points.map((p) => `(${p.x};${p.y})`).join(" ")
    csv += `${data.secao},${data.tipo_funcao},"${params}","${points}"`
    downloadCSV(csv, "funcoes_graficos")
  }
}

// PROGRESSIONS SECTION
function renderProgressions() {
  return `
    <div class="card">
      <h2 class="card-title">🔢 Progressões Aritmética (PA) e Geométrica (PG)</h2>
      
      <div class="input-group">
        <label class="input-label">Tipo de Progressão:</label>
        <select id="prog-type" class="input-field">
          <option value="pa">Progressão Aritmética (PA)</option>
          <option value="pg">Progressão Geométrica (PG)</option>
        </select>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
        <div class="input-group">
          <label class="input-label">Primeiro termo (a₁):</label>
          <input type="number" id="prog-a1" class="input-field" value="2" step="0.1">
        </div>
        <div class="input-group">
          <label class="input-label" id="prog-r-label">Razão (r):</label>
          <input type="number" id="prog-r" class="input-field" value="3" step="0.1">
        </div>
        <div class="input-group">
          <label class="input-label">Número de termos (n):</label>
          <input type="number" id="prog-n" class="input-field" value="10" min="1" max="100">
        </div>
      </div>
      
      <button onclick="calculateProgression()" class="button">Calcular Progressão</button>
      
      <div id="prog-result" class="result-box hidden"></div>
      
      <div class="save-buttons" id="prog-save-buttons" style="display: none;">
        <button onclick="saveProgressionData('json')" class="button button-secondary">💾 Salvar JSON</button>
        <button onclick="saveProgressionData('csv')" class="button button-secondary">📊 Salvar CSV</button>
      </div>
    </div>
  `
}

function setupProgressions() {}

function calculateProgression() {
  const type = document.getElementById("prog-type").value
  const a1 = Number.parseFloat(document.getElementById("prog-a1").value)
  const r = Number.parseFloat(document.getElementById("prog-r").value)
  const n = Number.parseInt(document.getElementById("prog-n").value)

  const terms = [a1]
  let sum = a1

  if (type === "pa") {
    for (let i = 1; i < n; i++) {
      terms.push(a1 + i * r)
    }
    const an = a1 + (n - 1) * r
    sum = (n * (a1 + an)) / 2

    window.currentProgressionData = {
      tipo: "PA",
      primeiro_termo: a1,
      razao: r,
      numero_termos: n,
      termo_n: an,
      soma: sum,
      sequencia: terms,
    }

    document.getElementById("prog-result").classList.remove("hidden")
    document.getElementById("prog-result").innerHTML = `
      <h3 class="card-subtitle">Progressão Aritmética:</h3>
      <div class="result-item">
        <span class="result-label">Termo Geral:</span>
        <span class="result-value">aₙ = ${a1} + (n-1)·${r}</span>
      </div>
      <div class="result-item">
        <span class="result-label">Termo n=${n}:</span>
        <span class="result-value">a₍${n}₎ = ${an.toFixed(2)}</span>
      </div>
      <div class="result-item">
        <span class="result-label">Soma dos ${n} termos:</span>
        <span class="result-value">S₍${n}₎ = ${sum.toFixed(2)}</span>
      </div>
      <p style="margin-top: 1rem;"><strong>Sequência:</strong> ${terms
        .slice(0, 10)
        .map((t) => t.toFixed(1))
        .join(", ")}${n > 10 ? "..." : ""}</p>
    `
  } else {
    for (let i = 1; i < n; i++) {
      terms.push(a1 * Math.pow(r, i))
    }
    const an = a1 * Math.pow(r, n - 1)
    sum = r !== 1 ? (a1 * (Math.pow(r, n) - 1)) / (r - 1) : a1 * n

    window.currentProgressionData = {
      tipo: "PG",
      primeiro_termo: a1,
      razao: r,
      numero_termos: n,
      termo_n: an,
      soma: sum,
      sequencia: terms,
    }

    document.getElementById("prog-result").classList.remove("hidden")
    document.getElementById("prog-result").innerHTML = `
      <h3 class="card-subtitle">Progressão Geométrica:</h3>
      <div class="result-item">
        <span class="result-label">Termo Geral:</span>
        <span class="result-value">aₙ = ${a1}·${r}⁽ⁿ⁻¹⁾</span>
      </div>
      <div class="result-item">
        <span class="result-label">Termo n=${n}:</span>
        <span class="result-value">a₍${n}₎ = ${an.toFixed(2)}</span>
      </div>
      <div class="result-item">
        <span class="result-label">Soma dos ${n} termos:</span>
        <span class="result-value">S₍${n}₎ = ${sum.toFixed(2)}</span>
      </div>
      <p style="margin-top: 1rem;"><strong>Sequência:</strong> ${terms
        .slice(0, 10)
        .map((t) => t.toFixed(1))
        .join(", ")}${n > 10 ? "..." : ""}</p>
    `
  }

  document.getElementById("prog-save-buttons").style.display = "flex"
}

function saveProgressionData(format) {
  if (!window.currentProgressionData) return

  const data = {
    secao: "Progressões",
    ...window.currentProgressionData,
    data_hora: new Date().toLocaleString("pt-BR"),
  }

  if (format === "json") {
    downloadJSON(data, "progressoes")
  } else {
    const csv =
      `Seção,Tipo,Primeiro Termo,Razão,Nº Termos,Termo n,Soma,Sequência\n` +
      `${data.secao},${data.tipo},${data.primeiro_termo},${data.razao},${data.numero_termos},${data.termo_n.toFixed(2)},${data.soma.toFixed(2)},"${data.sequencia
        .slice(0, 20)
        .map((t) => t.toFixed(1))
        .join(", ")}${data.numero_termos > 20 ? "..." : ""}"`
    downloadCSV(csv, "progressoes")
  }
}

// POLYHEDRON SECTION
function renderPolyhedron() {
  return `
    <div class="card">
      <h2 class="card-title">🔷 Poliedros de Platão</h2>
      
      <div class="input-group">
        <label class="input-label">Selecione um Poliedro:</label>
        <select id="poly-type" class="input-field" onchange="showPolyhedron()">
          <option value="tetrahedron">Tetraedro (4 faces)</option>
          <option value="cube">Cubo (6 faces)</option>
          <option value="octahedron">Octaedro (8 faces)</option>
          <option value="dodecahedron">Dodecaedro (12 faces)</option>
          <option value="icosahedron">Icosaedro (20 faces)</option>
        </select>
      </div>
      
      <div id="poly-result" class="result-box"></div>
      
      <div class="save-buttons">
        <button onclick="savePolyhedronData('json')" class="button button-secondary">💾 Salvar JSON</button>
        <button onclick="savePolyhedronData('csv')" class="button button-secondary">📊 Salvar CSV</button>
      </div>
      
      <div class="result-box" style="margin-top: 2rem;">
        <h3 class="card-subtitle">Relação de Euler:</h3>
        <p><strong>V - A + F = 2</strong></p>
        <p style="color: var(--muted-foreground);">
          Onde V = vértices, A = arestas, F = faces
        </p>
      </div>
    </div>
  `
}

function setupPolyhedron() {
  showPolyhedron()
}

function showPolyhedron() {
  const type = document.getElementById("poly-type").value
  const polyData = {
    tetrahedron: { name: "Tetraedro", v: 4, a: 6, f: 4, face: "Triângulos" },
    cube: { name: "Cubo", v: 8, a: 12, f: 6, face: "Quadrados" },
    octahedron: { name: "Octaedro", v: 6, a: 12, f: 8, face: "Triângulos" },
    dodecahedron: { name: "Dodecaedro", v: 20, a: 30, f: 12, face: "Pentágonos" },
    icosahedron: { name: "Icosaedro", v: 12, a: 30, f: 20, face: "Triângulos" },
  }

  const poly = polyData[type]
  const euler = poly.v - poly.a + poly.f

  document.getElementById("poly-result").innerHTML = `
    <h3 class="card-subtitle">${poly.name}</h3>
    <div class="result-item">
      <span class="result-label">Vértices (V):</span>
      <span class="result-value">${poly.v}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Arestas (A):</span>
      <span class="result-value">${poly.a}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Faces (F):</span>
      <span class="result-value">${poly.f}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Tipo de Face:</span>
      <span class="result-value">${poly.face}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Verificação de Euler:</span>
      <span class="result-value">${poly.v} - ${poly.a} + ${poly.f} = ${euler} ✓</span>
    </div>
  `
}

function savePolyhedronData(format) {
  const type = document.getElementById("poly-type").value
  const polyData = {
    tetrahedron: { name: "Tetraedro", v: 4, a: 6, f: 4, face: "Triângulos" },
    cube: { name: "Cubo", v: 8, a: 12, f: 6, face: "Quadrados" },
    octahedron: { name: "Octaedro", v: 6, a: 12, f: 8, face: "Triângulos" },
    dodecahedron: { name: "Dodecaedro", v: 20, a: 30, f: 12, face: "Pentágonos" },
    icosahedron: { name: "Icosaedro", v: 12, a: 30, f: 20, face: "Triângulos" },
  }

  const poly = polyData[type]
  const euler = poly.v - poly.a + poly.f

  const data = {
    secao: "Poliedros de Platão",
    poliedro: poly.name,
    vertices: poly.v,
    arestas: poly.a,
    faces: poly.f,
    tipo_face: poly.face,
    relacao_euler: `${poly.v} - ${poly.a} + ${poly.f} = ${euler}`,
    data_hora: new Date().toLocaleString("pt-BR"),
  }

  if (format === "json") {
    downloadJSON(data, "poliedros_platao")
  } else {
    const csv =
      `Seção,Poliedro,Vértices,Arestas,Faces,Tipo de Face,Relação de Euler\n` +
      `${data.secao},${data.poliedro},${data.vertices},${data.arestas},${data.faces},${data.tipo_face},"${data.relacao_euler}"`
    downloadCSV(csv, "poliedros_platao")
  }
}

// PRIMES SECTION
function renderPrimes() {
  return `
    <div class="card">
      <h2 class="card-title">🔢 Números Primos</h2>
      
      <h3 class="card-subtitle">Teste de Primalidade</h3>
      <div class="input-group">
        <label class="input-label">Digite um número:</label>
        <input type="number" id="prime-test" class="input-field" value="17" min="2">
      </div>
      <button onclick="testPrime()" class="button">Verificar se é Primo</button>
      <div id="prime-test-result" class="result-box hidden"></div>
      
      <div class="save-buttons" id="prime-test-save" style="display: none; margin-top: 1rem;">
        <button onclick="savePrimeTestData('json')" class="button button-secondary">💾 Salvar Teste JSON</button>
        <button onclick="savePrimeTestData('csv')" class="button button-secondary">📊 Salvar Teste CSV</button>
      </div>
      
      <h3 class="card-subtitle" style="margin-top: 2rem;">Gerar Números Primos</h3>
      <div class="input-group">
        <label class="input-label">Gerar primos até:</label>
        <input type="number" id="prime-limit" class="input-field" value="100" min="2" max="1000">
      </div>
      <button onclick="generatePrimes()" class="button">Gerar Lista</button>
      <div id="prime-list-result" class="result-box hidden"></div>
      
      <div class="save-buttons" id="prime-list-save" style="display: none; margin-top: 1rem;">
        <button onclick="savePrimeListData('json')" class="button button-secondary">💾 Salvar Lista JSON</button>
        <button onclick="savePrimeListData('csv')" class="button button-secondary">📊 Salvar Lista CSV</button>
      </div>
    </div>
  `
}

function setupPrimes() {}

function isPrime(n) {
  if (n < 2) return false
  if (n === 2) return true
  if (n % 2 === 0) return false
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false
  }
  return true
}

function testPrime() {
  const num = Number.parseInt(document.getElementById("prime-test").value)
  const prime = isPrime(num)

  const factors = []
  if (!prime) {
    for (let i = 2; i <= num / 2; i++) {
      if (num % i === 0) factors.push(i)
    }
  }

  window.currentPrimeTest = {
    numero: num,
    eh_primo: prime,
    divisores: !prime ? [1, ...factors, num] : [1, num],
  }

  document.getElementById("prime-test-result").classList.remove("hidden")
  document.getElementById("prime-test-result").innerHTML = `
    <div class="result-item">
      <span class="result-label">Número ${num}:</span>
      <span class="result-value">${prime ? "É PRIMO ✓" : "NÃO é primo ✗"}</span>
    </div>
    ${
      !prime
        ? `
      <div class="result-item">
        <span class="result-label">Divisores:</span>
        <span class="result-value">1, ${factors.join(", ")}, ${num}</span>
      </div>
    `
        : ""
    }
  `

  document.getElementById("prime-test-save").style.display = "flex"
}

function savePrimeTestData(format) {
  if (!window.currentPrimeTest) return

  const data = {
    secao: "Números Primos - Teste de Primalidade",
    ...window.currentPrimeTest,
    data_hora: new Date().toLocaleString("pt-BR"),
  }

  if (format === "json") {
    downloadJSON(data, "primos_teste")
  } else {
    const csv =
      `Seção,Número,É Primo,Divisores\n` +
      `${data.secao},${data.numero},${data.eh_primo ? "Sim" : "Não"},"${data.divisores.join(", ")}"`
    downloadCSV(csv, "primos_teste")
  }
}

function generatePrimes() {
  const limit = Number.parseInt(document.getElementById("prime-limit").value)
  const primes = []

  for (let i = 2; i <= limit; i++) {
    if (isPrime(i)) primes.push(i)
  }

  window.currentPrimeList = {
    limite: limit,
    quantidade: primes.length,
    primos: primes,
  }

  document.getElementById("prime-list-result").classList.remove("hidden")
  document.getElementById("prime-list-result").innerHTML = `
    <h3 class="card-subtitle">Números Primos até ${limit}:</h3>
    <div class="result-item">
      <span class="result-label">Quantidade:</span>
      <span class="result-value">${primes.length}</span>
    </div>
    <p style="margin-top: 1rem; line-height: 1.8;">${primes.join(", ")}</p>
  `

  document.getElementById("prime-list-save").style.display = "flex"
}

function savePrimeListData(format) {
  if (!window.currentPrimeList) return

  const data = {
    secao: "Números Primos - Lista Gerada",
    ...window.currentPrimeList,
    data_hora: new Date().toLocaleString("pt-BR"),
  }

  if (format === "json") {
    downloadJSON(data, "primos_lista")
  } else {
    const csv =
      `Seção,Limite,Quantidade,Números Primos\n` +
      `${data.secao},${data.limite},${data.quantidade},"${data.primos.join(", ")}"`
    downloadCSV(csv, "primos_lista")
  }
}

// GRAPH BUILDER SECTION
function renderGraphBuilder() {
  return `
    <div class="card">
      <h2 class="card-title">📊 Construtor de Gráficos Personalizado</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <div>
          <h3 class="card-subtitle">Adicionar Pontos</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 0.5rem; align-items: end;">
            <div class="input-group">
              <label class="input-label">x:</label>
              <input type="number" id="point-x" class="input-field" value="0" step="0.5">
            </div>
            <div class="input-group">
              <label class="input-label">y:</label>
              <input type="number" id="point-y" class="input-field" value="0" step="0.5">
            </div>
            <button onclick="addPoint()" class="button" style="height: fit-content;">Adicionar</button>
          </div>
          <div id="points-list" style="margin-top: 1rem; max-height: 200px; overflow-y: auto;"></div>
        </div>
        
        <div>
          <h3 class="card-subtitle">Plotar Função</h3>
          <div class="input-group">
            <label class="input-label">Tipo:</label>
            <select id="gb-func-type" class="input-field">
              <option value="linear">Linear: y = ax + b</option>
              <option value="quadratic">Quadrática: y = ax² + bx + c</option>
              <option value="cubic">Cúbica: y = ax³ + bx² + cx + d</option>
              <option value="sin">Seno: y = a·sen(bx)</option>
            </select>
          </div>
          <div id="gb-params" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;"></div>
          <button onclick="updateGraphBuilder()" class="button" style="margin-top: 1rem;">Atualizar Gráfico</button>
        </div>
      </div>
      
      <canvas id="gb-canvas" width="800" height="600" class="chart-canvas" style="margin-top: 1.5rem;"></canvas>
      
      <div class="save-buttons">
        <button onclick="downloadCanvasAsPNG('gb-canvas', 'construtor_grafico')" class="button button-secondary">🖼️ Salvar PNG</button>
        <button onclick="saveGraphBuilderData('json')" class="button button-secondary">💾 Salvar JSON</button>
        <button onclick="saveGraphBuilderData('csv')" class="button button-secondary">📊 Salvar CSV</button>
      </div>
    </div>
  `
}

const graphBuilderPoints = []

function setupGraphBuilder() {
  updateGraphBuilderParams()
  updateGraphBuilder()

  document.getElementById("gb-func-type").addEventListener("change", () => {
    updateGraphBuilderParams()
    updateGraphBuilder()
  })
}

function updateGraphBuilderParams() {
  const type = document.getElementById("gb-func-type").value
  let html = ""

  if (type === "linear") {
    html = `
      <div class="input-group"><label class="input-label">a:</label><input type="number" id="gb-a" class="input-field" value="1" step="0.1"></div>
      <div class="input-group"><label class="input-label">b:</label><input type="number" id="gb-b" class="input-field" value="0" step="0.1"></div>
    `
  } else if (type === "quadratic") {
    html = `
      <div class="input-group"><label class="input-label">a:</label><input type="number" id="gb-a" class="input-field" value="1" step="0.1"></div>
      <div class="input-group"><label class="input-label">b:</label><input type="number" id="gb-b" class="input-field" value="0" step="0.1"></div>
      <div class="input-group"><label class="input-label">c:</label><input type="number" id="gb-c" class="input-field" value="0" step="0.1"></div>
    `
  } else if (type === "cubic") {
    html = `
      <div class="input-group"><label class="input-label">a:</label><input type="number" id="gb-a" class="input-field" value="1" step="0.1"></div>
      <div class="input-group"><label class="input-label">b:</label><input type="number" id="gb-b" class="input-field" value="0" step="0.1"></div>
      <div class="input-group"><label class="input-label">c:</label><input type="number" id="gb-c" class="input-field" value="0" step="0.1"></div>
      <div class="input-group"><label class="input-label">d:</label><input type="number" id="gb-d" class="input-field" value="0" step="0.1"></div>
    `
  } else {
    html = `
      <div class="input-group"><label class="input-label">a:</label><input type="number" id="gb-a" class="input-field" value="1" step="0.1"></div>
      <div class="input-group"><label class="input-label">b:</label><input type="number" id="gb-b" class="input-field" value="1" step="0.1"></div>
    `
  }

  document.getElementById("gb-params").innerHTML = html
}

function addPoint() {
  const x = Number.parseFloat(document.getElementById("point-x").value)
  const y = Number.parseFloat(document.getElementById("point-y").value)

  graphBuilderPoints.push({ x, y })
  updatePointsList()
  updateGraphBuilder()
}

function removePoint(index) {
  graphBuilderPoints.splice(index, 1)
  updatePointsList()
  updateGraphBuilder()
}

function updatePointsList() {
  const list = document.getElementById("points-list")
  if (graphBuilderPoints.length === 0) {
    list.innerHTML = '<p style="color: var(--muted-foreground);">Nenhum ponto adicionado</p>'
    return
  }

  list.innerHTML = graphBuilderPoints
    .map(
      (p, i) => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: rgba(16, 185, 129, 0.1); border-radius: 0.5rem; margin-bottom: 0.5rem;">
      <span>(${p.x}, ${p.y})</span>
      <button onclick="removePoint(${i})" style="background: var(--destructive); color: white; border: none; padding: 0.25rem 0.75rem; border-radius: 0.25rem; cursor: pointer;">Remover</button>
    </div>
  `,
    )
    .join("")
}

function updateGraphBuilder() {
  const canvas = document.getElementById("gb-canvas")
  const ctx = canvas.getContext("2d")
  const width = canvas.width
  const height = canvas.height

  ctx.clearRect(0, 0, width, height)

  // Background
  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--card")
  ctx.fillRect(0, 0, width, height)

  // Grid
  ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue("--border")
  ctx.lineWidth = 1
  for (let i = 0; i <= 20; i++) {
    ctx.beginPath()
    ctx.moveTo(0, (height / 20) * i)
    ctx.lineTo(width, (height / 20) * i)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo((width / 20) * i, 0)
    ctx.lineTo((width / 20) * i, height)
    ctx.stroke()
  }

  // Axes
  ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue("--foreground")
  ctx.lineWidth = 2
  const centerY = height / 2
  const centerX = width / 2
  ctx.beginPath()
  ctx.moveTo(0, centerY)
  ctx.lineTo(width, centerY)
  ctx.moveTo(centerX, 0)
  ctx.lineTo(centerX, height)
  ctx.stroke()

  const scale = 40

  // Plot function
  const type = document.getElementById("gb-func-type").value
  const a = Number.parseFloat(document.getElementById("gb-a").value)
  const b = Number.parseFloat(document.getElementById("gb-b").value)
  const c = document.getElementById("gb-c") ? Number.parseFloat(document.getElementById("gb-c").value) : 0
  const d = document.getElementById("gb-d") ? Number.parseFloat(document.getElementById("gb-d").value) : 0

  ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue("--cyan")
  ctx.lineWidth = 3
  ctx.beginPath()

  let started = false
  for (let px = 0; px < width; px++) {
    const x = (px - centerX) / scale
    let y

    if (type === "linear") {
      y = a * x + b
    } else if (type === "quadratic") {
      y = a * x * x + b * x + c
    } else if (type === "cubic") {
      y = a * x * x * x + b * x * x + c * x + d
    } else {
      y = a * Math.sin(b * x)
    }

    const py = centerY - y * scale

    if (py < 0 || py > height || isNaN(y) || !isFinite(y)) continue

    if (!started) {
      ctx.moveTo(px, py)
      started = true
    } else {
      ctx.lineTo(px, py)
    }
  }
  ctx.stroke()

  // Plot points
  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--primary")
  graphBuilderPoints.forEach((point) => {
    const px = centerX + point.x * scale
    const py = centerY - point.y * scale

    ctx.beginPath()
    ctx.arc(px, py, 6, 0, 2 * Math.PI)
    ctx.fill()

    // Label
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--foreground")
    ctx.font = "12px Inter"
    ctx.fillText(`(${point.x}, ${point.y})`, px + 10, py - 10)
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--primary")
  })
}

function saveGraphBuilderData(format) {
  const type = document.getElementById("gb-func-type").value
  const a = Number.parseFloat(document.getElementById("gb-a").value)
  const b = Number.parseFloat(document.getElementById("gb-b").value)
  const c = document.getElementById("gb-c") ? Number.parseFloat(document.getElementById("gb-c").value) : 0
  const d = document.getElementById("gb-d") ? Number.parseFloat(document.getElementById("gb-d").value) : 0

  const typeNames = {
    linear: "Linear",
    quadratic: "Quadrática",
    cubic: "Cúbica",
    sin: "Seno",
  }

  const data = {
    secao: "Construtor de Gráficos",
    tipo_funcao: typeNames[type],
    parametros: type === "cubic" ? { a, b, c, d } : type === "quadratic" ? { a, b, c } : { a, b },
    pontos_adicionados: graphBuilderPoints,
    data_hora: new Date().toLocaleString("pt-BR"),
  }

  if (format === "json") {
    downloadJSON(data, "construtor_graficos")
  } else {
    const params = Object.entries(data.parametros)
      .map(([k, v]) => `${k}=${v}`)
      .join(" ")
    const points = data.pontos_adicionados.map((p) => `(${p.x};${p.y})`).join(" ")
    const csv = `Seção,Tipo,Parâmetros,Pontos\n` + `${data.secao},${data.tipo_funcao},"${params}","${points}"`
    downloadCSV(csv, "construtor_graficos")
  }
}

function downloadCanvasAsPNG(canvasId, filename) {
  const canvas = document.getElementById(canvasId)
  if (!canvas) {
    alert("Canvas não encontrado!")
    return
  }

  // Convert canvas to PNG
  canvas.toBlob((blob) => {
    downloadFile(blob, `${filename}.png`)
  }, "image/png")
}

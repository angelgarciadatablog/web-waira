// === CONFIG === (CSV publicado en la web)
const SHEET_CSV_BASE =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRSdgxLG5bFq5l6RbmuAjeb0DSRxOrOMXBd-Ea35VmPHlcoGfpTqoKXBhTMO42C2sfDeXi90wwtwWbn/pub?gid=1176594951&single=true&output=csv";

// cache-buster global (se actualiza al pulsar "Actualizar")
let CSV_VERSION = Date.now();

function sheetUrl(){
  return `${SHEET_CSV_BASE}&cacheBust=${CSV_VERSION}`;
}

// === Utils ===
function slugify(s=""){
  return s.normalize("NFD")
    .replace(/\p{Diacritic}/gu,"")
    .replace(/\s+/g,"-")
    .replace(/[^A-Za-z0-9\-]/g,"")
    .toUpperCase();
}

// === DOM ===
const grid = document.getElementById("grid");
const estado = document.getElementById("estado");
const filtroNombre = document.getElementById("filtroNombre");
const filtroColor = document.getElementById("filtroColor");
const soloDisp = document.getElementById("soloDisp");
document.getElementById("refresh")?.addEventListener("click", () => {
  // Limpiar caché manualmente
  localStorage.removeItem('waira_catalog_cache');
  console.log('🗑️ Caché limpiado manualmente');

  CSV_VERSION = Date.now();   // fuerza nueva URL de CSV e imágenes
  cargarCatalogo();
});

// === Estado ===
let rowsRaw = [];        // filas por talla (CSV)
let groups = [];         // grupos (nombre + color)
let groupsFiltrados = [];
let firstLoad = true;

// === CSV parser robusto ===
function csvToObjects(csv){
  const rows=[]; let row=[], cell="", inQuotes=false;
  for(let i=0;i<csv.length;i++){
    const ch=csv[i], next=csv[i+1];
    if(inQuotes){
      if(ch==='"' && next==='"'){ cell+='"'; i++; }
      else if(ch==='"'){ inQuotes=false; }
      else { cell+=ch; }
    }else{
      if(ch==='"'){ inQuotes=true; }
      else if(ch===','){ row.push(cell); cell=""; }
      else if(ch==='\n'){ row.push(cell); rows.push(row); row=[]; cell=""; }
      else if(ch!=='\r'){ cell+=ch; }
    }
  }
  if(cell.length || row.length){ row.push(cell); rows.push(row); }

  const headers=(rows.shift()||[]).map(h=>h.trim());
  return rows.map(cols=>{
    const o={};
    headers.forEach((h,i)=>o[h]=(cols[i]??"").trim());

    // normaliza tipos/valores
    o.taco_cm  = Number(o.taco_cm  || 0);
    o.talla    = Number(o.talla    || 0);
    o.precio   = Number(o.precio   || 0);
    o.cantidad = Number(o.cantidad || 0);

    // estado → canon (solo usamos estado para disponibilidad)
    const est = (o.estado || "").trim().toUpperCase();
    if (est.startsWith("DISP")) o.estado = "DISPONIBLE";
    else if (est.startsWith("AGOT")) o.estado = "AGOTADO";
    else if (est === "NO_FABRICADO") o.estado = "NO_FABRICADO";
    else o.estado = est || "";

    // color y nombre
    o.color  = (o.color  || "").trim().toUpperCase();
    o.nombre = (o.nombre || "").trim();
    o.modelo = (o.modelo || "").trim();

    // imagen (puede venir vacío)
    o.imagen = (o.imagen || "").trim();

    return o;
  });
}

// === Fetch CSV con caché localStorage (3 minutos) ===
async function fetchCSV(url){
  const CACHE_KEY = 'waira_catalog_cache';
  const CACHE_TIME = 3 * 60 * 1000; // 3 minutos en milisegundos

  // Revisar si hay caché válido en localStorage
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;

      if (age < CACHE_TIME) {
        const remaining = Math.round((CACHE_TIME - age) / 1000);
        console.log(`✅ Usando caché (válido por ${remaining}s más)`);
        return csvToObjects(data);
      } else {
        console.log('⏰ Caché expirado, descargando datos frescos...');
      }
    }
  } catch (e) {
    console.warn('Error leyendo caché:', e);
  }

  // Si no hay caché válido, hacer request a Google Sheets
  console.log('📡 Descargando catálogo desde Google Sheets...');
  try {
    const txt = await fetch(url, { cache: "no-store" }).then(r=>{
      if(!r.ok) throw new Error("CSV no disponible");
      return r.text();
    });

    // Guardar en caché con timestamp
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: txt,
        timestamp: Date.now()
      }));
      console.log('💾 Datos guardados en caché');
    } catch (e) {
      console.warn('No se pudo guardar caché:', e);
    }

    return csvToObjects(txt);
  } catch (error) {
    // Fallback: intentar usar caché expirado si hay error de red
    console.error('❌ Error descargando datos:', error);
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      console.log('🔄 Usando caché antiguo como fallback');
      const { data } = JSON.parse(cached);
      return csvToObjects(data);
    }
    throw error;
  }
}

// === Agrupar por (nombre + color) y calcular métricas ===
function agruparNombreColor(items){
  const map = new Map();
  for (const it of items){
    const nameKey = (it.nombre||"").trim().toUpperCase();
    const colorKey = (it.color||"").trim().toUpperCase();
    if (!nameKey || !colorKey) continue;

    const key = `${nameKey}|${colorKey}`;
    if(!map.has(key)){
      map.set(key, {
        nombre: it.nombre,
        color: it.color,
        modelo: it.modelo,
        items: [],
        imagen: "",      // tomaremos la primera no vacía
      });
    }
    const g = map.get(key);
    g.items.push(it);
    if (!g.imagen && it.imagen) g.imagen = it.imagen;
  }

  const out = [];
  for (const g of map.values()){
    // tallas por estado (solo por estado, no por cantidad)
    const disponibles = g.items.filter(x => x.estado === "DISPONIBLE");
    const agotadas    = g.items.filter(x => x.estado !== "DISPONIBLE" && x.estado !== "NO_FABRICADO");

    const tallasDisp = Array.from(new Set(
      disponibles.map(x => x.talla).filter(n => Number.isFinite(n) && n > 0)
    )).sort((a,b)=>a-b);

    const tallasAgot = Array.from(new Set(
      agotadas.map(x => x.talla).filter(n => Number.isFinite(n) && n > 0)
    )).sort((a,b)=>a-b);

    // disponibilidad del grupo: true si alguna talla está DISPONIBLE
    const disponibleGrupo = disponibles.length > 0;

    // stock total (suma de cantidades, informativo)
    const stockTotal = g.items.reduce((sum,x)=> sum + (Number(x.cantidad)||0), 0);

    // precios: único o "Desde"
    const precios = Array.from(new Set(
      g.items.map(x => Number(x.precio)||0).filter(v => v>0)
    ));
    let precio = null, precioDesde = false;
    if (precios.length === 1) { precio = precios[0]; }
    else if (precios.length > 1) { precio = Math.min(...precios); precioDesde = true; }

    // tacos: único o lista "taco 2,3" (sin "cm")
    const tacos = Array.from(new Set(
      g.items.map(x => Number(x.taco_cm)||0).filter(v => v>0)
    )).sort((a,b)=>a-b);
    let tacoText = "";
    if (tacos.length === 1) tacoText = `taco ${tacos[0]}`;
    else if (tacos.length > 1) tacoText = `taco ${tacos.join(",")}`;

    out.push({
      slug: slugify(`${g.nombre}-${g.color}`),
      nombre: g.nombre,
      color: g.color,
      modelo: g.modelo,
      imagen: g.imagen || "",
      tallasDisp,
      tallasAgot,
      disponible: disponibleGrupo,
      stockTotal,
      precio,
      precioDesde,
      tacoText
    });
  }

  // ordenar por nombre, luego color
  out.sort((a,b) =>
    (a.nombre||"").localeCompare(b.nombre||"", "es") ||
    (a.color ||"").localeCompare(b.color ||"", "es")
  );

  return out;
}

// === Rellenar selects dinámicamente ===
function populateNameFilter(items){
  if(!filtroNombre) return;
  const prev = filtroNombre.value;
  const names = Array.from(new Set(items.map(x => (x.nombre||"").trim()).filter(Boolean)))
    .sort((a,b)=>a.localeCompare(b,"es"));
  filtroNombre.innerHTML =
    `<option value="">Nombre (todos)</option>` +
    names.map(n => `<option value="${n}">${n}</option>`).join("");
  if (prev && names.includes(prev)) filtroNombre.value = prev;
}

function populateColorFilter(items){
  if(!filtroColor) return;
  const prev = filtroColor.value;
  const colors = Array.from(new Set(items.map(x => (x.color||"").trim().toUpperCase()).filter(Boolean)))
    .sort((a,b)=>a.localeCompare(b,"es"));
  filtroColor.innerHTML =
    `<option value="">Color (todos)</option>` +
    colors.map(c => `<option value="${c}">${c}</option>`).join("");
  if (prev && colors.includes(prev)) filtroColor.value = prev;
}

// === Cargar y agrupar ===
async function cargarCatalogo(){
  try{
    estado.textContent = "Cargando catálogo…";
    const rows = await fetchCSV(sheetUrl());

    // excluir NO_FABRICADO
    rowsRaw = rows.filter(r => (r.estado || "") !== "NO_FABRICADO");

    if (firstLoad){
      if(filtroNombre) filtroNombre.value = "";
      if(filtroColor)  filtroColor.value  = "";
      if(soloDisp) soloDisp.checked = false;
      firstLoad = false;
    }

    groups = agruparNombreColor(rowsRaw);
    populateNameFilter(groups);
    populateColorFilter(groups);
    aplicarFiltros();
  }catch(e){
    console.error(e);
    estado.textContent = "Error al cargar el catálogo.";
  }
}

// === Filtros sobre grupos ===
function aplicarFiltros(){
  const selNom = (filtroNombre?.value || "").trim();
  const selCol = (filtroColor?.value  || "").trim();   // color en mayúsculas
  const onlyAvail = !!soloDisp?.checked;

  groupsFiltrados = groups.filter(g=>{
    const matchNombre = !selNom || (g.nombre || "") === selNom;
    const matchColor  = !selCol || (g.color  || "").toUpperCase() === selCol;
    const matchEstado = !onlyAvail || g.disponible === true;
    return matchNombre && matchColor && matchEstado;
  });

  render();
  estado.textContent = groupsFiltrados.length
    ? `${groupsFiltrados.length} productos`
    : `Sin resultados con los filtros actuales`;
}

// === Render tarjetas (Nombre-Color → link a producto) ===
function render(){
  grid.innerHTML = "";
  if(!groupsFiltrados.length){
    grid.innerHTML = "<div style='grid-column:1/-1;color:#6b6b6b'>No hay productos que coincidan.</div>";
    return;
  }

  groupsFiltrados.forEach(g=>{
    const agotadoGrupo = !g.disponible;
    const precioHtml = (Number.isFinite(g.precio) && g.precio>0)
      ? `<div style="margin-top:8px;font-weight:600">${g.precioDesde ? "Desde " : ""}S/ ${g.precio.toFixed(2)}</div>`
      : "";
    const tacoHtml = g.tacoText ? `<div style="margin-top:4px">${g.tacoText}</div>` : "";
    const imgUrl = g.imagen
      ? `${g.imagen}${g.imagen.includes("?") ? "&" : "?"}v=${CSV_VERSION}`
      : "";

    const chips = []
      .concat(g.tallasDisp.map(t => `<span class="chip">${t}</span>`))
      .concat(g.tallasAgot.map(t => `<span class="chip soldout">${t}</span>`))
      .join("");

    const slug = g.slug; // ya calculado

    const card = document.createElement("a");
    card.href = `producto.html?p=${encodeURIComponent(slug)}`;
    card.className = "card" + (agotadoGrupo ? " agotado" : "");
    card.innerHTML = `
      <div class="body">
        <h4>${[g.nombre || "Modelo", g.color || ""].filter(Boolean).join('-')}</h4>
      </div>
      ${imgUrl ? `<img src="${imgUrl}" alt="${g.nombre} ${g.color}" loading="lazy">` : ""}
      <div class="body">
        ${precioHtml}
        ${tacoHtml}
        <div class="chips">${chips}</div>
        <div style="margin-top:6px;font-size:12px;color:#6b6b6b">Stock total: ${Number(g.stockTotal)||0}</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// === Eventos de filtros ===
filtroNombre?.addEventListener("change", aplicarFiltros);
filtroColor?.addEventListener("change", aplicarFiltros);
soloDisp?.addEventListener("change", aplicarFiltros);

// === Init ===
cargarCatalogo();

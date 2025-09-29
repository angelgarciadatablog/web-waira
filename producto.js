// === CONFIG (mismo CSV) ===
const SHEET_CSV_BASE =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRSdgxLG5bFq5l6RbmuAjeb0DSRxOrOMXBd-Ea35VmPHlcoGfpTqoKXBhTMO42C2sfDeXi90wwtwWbn/pub?gid=1176594951&single=true&output=csv";

// Cache-buster por carga
const CSV_VERSION = Date.now();
function sheetUrl(){ return `${SHEET_CSV_BASE}&cacheBust=${CSV_VERSION}`; }

// Número de WhatsApp mostrado como texto (sin botón)
const WHATSAPP_NUMBER_TEXT = "999 999 999"; // así quieres mostrarlo

// Utils
function slugify(s=""){
  return s.normalize("NFD")
    .replace(/\p{Diacritic}/gu,"")
    .replace(/\s+/g,"-")
    .replace(/[^A-Za-z0-9\-]/g,"")
    .toUpperCase();
}
function getParam(name){
  const url = new URL(location.href);
  return url.searchParams.get(name) || "";
}

// CSV parser (igual que antes)
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
    o.taco_cm  = Number(o.taco_cm  || 0);
    o.talla    = Number(o.talla    || 0);
    o.precio   = Number(o.precio   || 0);
    o.cantidad = Number(o.cantidad || 0);

    const est = (o.estado || "").trim().toUpperCase();
    if (est.startsWith("DISP")) o.estado = "DISPONIBLE";
    else if (est.startsWith("AGOT")) o.estado = "AGOTADO";
    else if (est === "NO_FABRICADO") o.estado = "NO_FABRICADO";
    else o.estado = est || "";

    o.color  = (o.color  || "").trim().toUpperCase();
    o.nombre = (o.nombre || "").trim();
    o.modelo = (o.modelo || "").trim();
    o.descripcion = (o.descripcion || "").trim();
    o.imagen = (o.imagen || "").trim();
    return o;
  });
}

async function fetchCSV(url){
  const txt = await fetch(url, { cache: "no-store" }).then(r=>{
    if(!r.ok) throw new Error("CSV no disponible");
    return r.text();
  });
  return csvToObjects(txt);
}

function agruparNombreColor(items){
  const map = new Map();
  for(const it of items){
    const nameKey = (it.nombre||"").trim().toUpperCase();
    const colorKey = (it.color||"").trim().toUpperCase();
    if(!nameKey || !colorKey) continue;
    const key = `${nameKey}|${colorKey}`;
    if(!map.has(key)){
      map.set(key, { nombre:it.nombre, color:it.color, modelo:it.modelo, items:[], imagenes:new Set() });
    }
    const g = map.get(key);
    g.items.push(it);
    if (it.imagen) g.imagenes.add(it.imagen);
  }
  const groups=[];
  for(const g of map.values()){
    const disponibles = g.items.filter(x=>x.estado==="DISPONIBLE");
    const agotadas    = g.items.filter(x=>x.estado!=="DISPONIBLE" && x.estado!=="NO_FABRICADO");
    const tallasDisp = Array.from(new Set(disponibles.map(x=>x.talla).filter(n=>Number.isFinite(n)&&n>0))).sort((a,b)=>a-b);
    const tallasAgot = Array.from(new Set(agotadas.map(x=>x.talla).filter(n=>Number.isFinite(n)&&n>0))).sort((a,b)=>a-b);
    const stockTotal = g.items.reduce((s,x)=>s+(Number(x.cantidad)||0),0);
    const precios = Array.from(new Set(g.items.map(x=>Number(x.precio)||0).filter(v=>v>0)));
    let precio=null, precioDesde=false;
    if(precios.length===1) precio=precios[0];
    else if(precios.length>1){ precio=Math.min(...precios); precioDesde=true; }
    const tacos = Array.from(new Set(g.items.map(x=>Number(x.taco_cm)||0).filter(v=>v>0))).sort((a,b)=>a-b);
    let tacoText="";
    if(tacos.length===1) tacoText=`taco ${tacos[0]}`;
    else if(tacos.length>1) tacoText=`taco ${tacos.join(",")}`;
    groups.push({
      slug: slugify(`${g.nombre}-${g.color}`),
      nombre:g.nombre, color:g.color, modelo:g.modelo,
      descripcion: g.items.find(x=>x.descripcion)?.descripcion || "",
      tallasDisp, tallasAgot, stockTotal,
      precio, precioDesde, tacoText,
      imagenes: Array.from(g.imagenes)
    });
  }
  return groups;
}

function setMainImage(url){
  const main = document.getElementById("mainImg");
  if(!url){ main.removeAttribute("src"); return; }
  main.src = `${url}${url.includes("?") ? "&" : "?"}v=${CSV_VERSION}`;
}

function renderProduct(g){
  // título
  document.getElementById("title").textContent =
    [g.nombre||"Producto", g.color||""].filter(Boolean).join("-");

  // precio
  const price = document.getElementById("price");
  price.textContent = "";
  if(Number.isFinite(g.precio) && g.precio>0){
    price.textContent = `${g.precioDesde ? "Desde " : ""}S/ ${g.precio.toFixed(2)}`;
  }

  // taco
  document.getElementById("taco").textContent = g.tacoText || "";

  // tallas
  const tallas = document.getElementById("tallas");
  tallas.innerHTML = ""
    + g.tallasDisp.map(t=>`<span class="chip">${t}</span>`).join("")
    + g.tallasAgot.map(t=>`<span class="chip soldout">${t}</span>`).join("");

  // stock
  document.getElementById("stock").textContent = `Stock total: ${Number(g.stockTotal)||0}`;

  // descripción
  document.getElementById("desc").textContent =
    g.descripcion || (g.modelo ? `Modelo: ${g.modelo}` : "—");

  // galería
  const thumbs = document.getElementById("thumbs");
  const imgs = g.imagenes.length ? g.imagenes : [];
  if(imgs.length){
    setMainImage(imgs[0]);
    thumbs.innerHTML = imgs
      .map(url=>`<div class="thumb"><img src="${url}${url.includes("?")?"&":"?"}v=${CSV_VERSION}" alt=""></div>`)
      .join("");
    thumbs.querySelectorAll(".thumb").forEach((el,idx)=>{
      el.addEventListener("click", ()=> setMainImage(imgs[idx]));
    });
  }else{
    setMainImage(""); thumbs.innerHTML="";
  }

  // CTA: solo texto (sin botón)
  const cta = document.getElementById("ctaText");
  cta.textContent = `Para comprar, comunícate al WhatsApp ${WHATSAPP_NUMBER_TEXT}. Indica nombre-color y talla. Te confirmamos stock y tiempos.`;
}

(async function init(){
  const slug = (getParam("p") || "").toUpperCase();
  if(!slug){ document.getElementById("title").textContent="Producto no especificado"; return; }

  try{
    const rows = await fetchCSV(sheetUrl());
    const valid = rows.filter(r => (r.estado||"") !== "NO_FABRICADO");
    const groups = agruparNombreColor(valid);
    const g = groups.find(x => x.slug === slug);
    if(!g){
      document.getElementById("title").textContent = "Producto no encontrado";
      return;
    }
    renderProduct(g);
  }catch(e){
    console.error(e);
    document.getElementById("title").textContent = "Error cargando producto";
  }
})();

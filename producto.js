// === CONFIG (mismo CSV) ===
const SHEET_CSV_BASE =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRSdgxLG5bFq5l6RbmuAjeb0DSRxOrOMXBd-Ea35VmPHlcoGfpTqoKXBhTMO42C2sfDeXi90wwtwWbn/pub?gid=1176594951&single=true&output=csv";

// Cache-buster por carga
const CSV_VERSION = Date.now();
function sheetUrl(){ return `${SHEET_CSV_BASE}&cacheBust=${CSV_VERSION}`; }

// Número de WhatsApp para pedidos (formato internacional sin espacios ni signos)
const WHATSAPP_NUMBER = "51906396063"; // antes +51 962 370 684
const WHATSAPP_NUMBER_TEXT = "+51 906 396 063"; // formato para mostrar

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
    o.taco_cm    = Number(o.taco_cm    || 0);
    o.talla      = Number(o.talla      || 0);
    o.precio     = Number(o.precio     || 0);
    o.precio_sale = Number(o.precio_sale || 0);
    o.cantidad   = Number(o.cantidad   || 0);

    const est = (o.estado || "").trim().toUpperCase();
    if (est.startsWith("DISP")) o.estado = "DISPONIBLE";
    else if (est.startsWith("AGOT")) o.estado = "AGOTADO";
    else if (est === "OCULTO") o.estado = "OCULTO";
    else o.estado = est || "";

    o.color  = (o.color  || "").trim().toUpperCase();
    o.nombre = (o.nombre || "").trim();
    o.modelo = (o.modelo || "").trim();
    o.sku    = (o.sku    || "").trim().toUpperCase();
    o.tipo   = (o.tipo   || "").trim();
    o.descripcion = (o.descripcion || "").trim();
    o.imagen = (o.imagen || "").trim();
    return o;
  });
}

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

function agruparNombreColor(items){
  const map = new Map();
  for(const it of items){
    const sku = (it.sku || "").trim().toUpperCase();
    if(!sku) continue; // Saltar items sin SKU
    if(!map.has(sku)){
      map.set(sku, { sku:sku, nombre:it.nombre, color:it.color, modelo:it.modelo, tipo:it.tipo, items:[] });
    }
    const g = map.get(sku);
    g.items.push(it);
  }
  const groups=[];
  for(const g of map.values()){
    const disponibles = g.items.filter(x=>x.estado==="DISPONIBLE");
    const agotadas    = g.items.filter(x=>x.estado!=="DISPONIBLE" && x.estado!=="OCULTO");
    const tallasDisp = Array.from(new Set(disponibles.map(x=>x.talla).filter(n=>Number.isFinite(n)&&n>0))).sort((a,b)=>a-b);
    const tallasAgot = Array.from(new Set(agotadas.map(x=>x.talla).filter(n=>Number.isFinite(n)&&n>0))).sort((a,b)=>a-b);
    const stockTotal = g.items.reduce((s,x)=>s+(Number(x.cantidad)||0),0);

    // Precios normales
    const precios = Array.from(new Set(g.items.map(x=>Number(x.precio)||0).filter(v=>v>0)));
    let precio=null, precioDesde=false;
    if(precios.length===1) precio=precios[0];
    else if(precios.length>1){ precio=Math.min(...precios); precioDesde=true; }

    // Precios de oferta (precio_sale)
    const preciosSale = Array.from(new Set(g.items.map(x=>Number(x.precio_sale)||0).filter(v=>v>0)));
    let precioSale=null, precioSaleDesde=false;
    if(preciosSale.length===1) precioSale=preciosSale[0];
    else if(preciosSale.length>1){ precioSale=Math.min(...preciosSale); precioSaleDesde=true; }

    const tacos = Array.from(new Set(g.items.map(x=>Number(x.taco_cm)||0).filter(v=>v>0))).sort((a,b)=>a-b);
    let tacoText="";
    if(tacos.length===1) tacoText=`taco ${tacos[0]}`;
    else if(tacos.length>1) tacoText=`taco ${tacos.join(",")}`;

    // estado agregado: el que más se repite
    const estadoCounts = {};
    g.items.forEach(x => {
      const est = x.estado || "AGOTADO";
      estadoCounts[est] = (estadoCounts[est] || 0) + 1;
    });
    const estadoAgregado = Object.entries(estadoCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || "AGOTADO";

    groups.push({
      sku: g.sku,
      nombre:g.nombre, color:g.color, modelo:g.modelo, tipo:g.tipo,
      descripcion: g.items.find(x=>x.descripcion)?.descripcion || "",
      tallasDisp, tallasAgot, stockTotal,
      precio, precioDesde,
      precioSale, precioSaleDesde,
      tacoText,
      estado: estadoAgregado
    });
  }
  return groups;
}

function setMainImage(url){
  const main = document.getElementById("mainImg");
  if(!url){
    main.removeAttribute("src");
    main.style.display = 'none';
    return;
  }

  main.src = `${url}${url.includes("?") ? "&" : "?"}v=${CSV_VERSION}`;

  // Mostrar cuando cargue correctamente
  main.onload = function() {
    this.style.display = 'block';
  };

  // Ocultar si falla la carga
  main.onerror = function() {
    this.style.display = 'none';
    console.warn('Imagen principal no disponible:', url);
  };
}

function loadProductImages(sku) {
  // Generar rutas para 10 posibles imágenes en formato webp
  // Solo se mostrarán las que existan (mediante onload/onerror en el DOM)
  const images = [];
  const basePath = `assets/img/productos/${sku}`;

  for (let i = 1; i <= 10; i++) {
    images.push(`${basePath}/${i}.webp`);
  }

  return images;
}

async function renderProduct(g){
  // título de la página (para SEO y GA4)
  const productFullName = [g.nombre||"Producto", g.color||""].filter(Boolean).join(" ");
  document.title = `${productFullName} — WAIRA & DR`;

  // título del h1
  document.getElementById("title").textContent =
    [g.nombre||"Producto", g.color||""].filter(Boolean).join("-");

  // precio con lógica de promoción
  const price = document.getElementById("price");
  price.innerHTML = "";
  if (Number.isFinite(g.precioSale) && g.precioSale > 0) {
    // Tiene precio en oferta - mostrar precio sale grande y precio original tachado
    price.innerHTML = `
      <div class="price-sale-large">${g.precioSaleDesde ? "Desde " : ""}S/ ${g.precioSale.toFixed(2)}</div>
      <div class="price-original-large">${g.precioDesde ? "Desde " : ""}S/ ${g.precio.toFixed(2)}</div>
    `;
  } else if (Number.isFinite(g.precio) && g.precio > 0) {
    // Precio normal sin oferta
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

  // galería: cargar todas las imágenes desde la carpeta del producto
  const thumbs = document.getElementById("thumbs");
  const imgs = loadProductImages(g.sku);

  if(imgs.length){
    setMainImage(imgs[0]);
    thumbs.innerHTML = imgs
      .map((url, idx) => `
        <div class="thumb" data-index="${idx}" style="display:none;">
          <img src="${url}${url.includes("?")?"&":"?"}v=${CSV_VERSION}"
               alt=""
               onload="this.parentElement.style.display='flex';"
               onerror="this.parentElement.remove();">
        </div>
      `)
      .join("");
    thumbs.querySelectorAll(".thumb").forEach((el)=>{
      el.addEventListener("click", ()=> {
        const idx = parseInt(el.getAttribute('data-index'));
        setMainImage(imgs[idx]);
      });
    });
  }else{
    setMainImage(""); thumbs.innerHTML="";
  }

  // Agregar data attributes para GA4/GTM en el body o contenedor principal
  const metaContainer = document.querySelector('.meta');
  if(metaContainer) {
    metaContainer.setAttribute('data-sku', g.sku);
    metaContainer.setAttribute('data-product-name', g.nombre);
    metaContainer.setAttribute('data-product-color', g.color);
    metaContainer.setAttribute('data-product-type', g.tipo || '');
    metaContainer.setAttribute('data-product-model', g.modelo || '');
    metaContainer.setAttribute('data-product-taco', g.tacoText || '');
    metaContainer.setAttribute('data-product-precio', g.precio || '');
    metaContainer.setAttribute('data-product-precio-sale', g.precioSale || '');
    metaContainer.setAttribute('data-product-cantidad', g.stockTotal || '0');
    metaContainer.setAttribute('data-product-estado', g.estado || '');
  }

  // CTA: botón de WhatsApp con mensaje pre-escrito
  const productName = [g.nombre || "Producto", g.color || ""].filter(Boolean).join("-");
  const mensaje = encodeURIComponent(
    `Hola, estoy interesado en ${productName}. ¿Podrías confirmarme disponibilidad?`
  );
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`;

  const ctaContainer = document.getElementById("ctaText");
  ctaContainer.innerHTML = `
    <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" class="btn-comprar" id="btnComprarPrincipal">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor"/>
        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.2c-.157.47.302.928.772.772l3.032-.892A9.958 9.958 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.706 0-3.305-.535-4.61-1.447l-.33-.233-2.246.66.66-2.246-.233-.33A7.958 7.958 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" fill="currentColor"/>
      </svg>
      Comprar por WhatsApp
    </a>
  `;

  // === DATALAYER: view_item ===
  // Esperar un tick para asegurar que el DOM y el título estén completamente actualizados
  setTimeout(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null }); // Limpiar ecommerce anterior
    window.dataLayer.push({
      event: 'view_item',
      page_title: document.title, // Título dinámico para GA4
      page_location: window.location.href,
      page_path: window.location.pathname,
      ecommerce: {
        currency: 'PEN',
        value: g.precioSale || g.precio || 0,
        items: [{
          item_id: g.sku,
          item_name: g.nombre,
          item_brand: 'WAIRA & DR',
          item_category: g.tipo || '',
          item_variant: g.color,
          price: g.precioSale || g.precio || 0,
          quantity: 1
        }]
      },
      // Datos adicionales del producto
      product_sku: g.sku,
      product_name: g.nombre,
      product_color: g.color,
      product_type: g.tipo || '',
      product_model: g.modelo || '',
      product_taco: g.tacoText || '',
      product_precio: g.precio || 0,
      product_precio_sale: g.precioSale || 0,
      product_stock: g.stockTotal || 0,
      product_estado: g.estado || ''
    });
  }, 100);

  // === DATALAYER: begin_checkout (botón principal) ===
  setTimeout(() => {
    const btnPrincipal = document.getElementById('btnComprarPrincipal');
    if(btnPrincipal) {
      btnPrincipal.addEventListener('click', function() {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ ecommerce: null });
        window.dataLayer.push({
          event: 'begin_checkout',
          ecommerce: {
            currency: 'PEN',
            value: g.precioSale || g.precio || 0,
            items: [{
              item_id: g.sku,
              item_name: g.nombre,
              item_brand: 'WAIRA & DR',
              item_category: g.tipo || '',
              item_variant: g.color,
              price: g.precioSale || g.precio || 0,
              quantity: 1
            }]
          },
          button_location: 'product_detail_top'
        });
      });
    }
  }, 100);
}

// Función para cargar productos similares aleatorios
async function loadSimilarProducts(currentSku, allGroups, maxProducts = 8) {
  // Filtrar todos los productos excepto el actual
  const otherProducts = allGroups.filter(g => g.sku !== currentSku);

  // Mezclar aleatoriamente los productos
  const shuffled = otherProducts.sort(() => Math.random() - 0.5);

  // Tomar los primeros maxProducts
  const selectedProducts = shuffled.slice(0, maxProducts);

  // Renderizar en el carrusel
  const carousel = document.getElementById("similarProductsCarousel");
  if (!carousel) return;

  carousel.innerHTML = selectedProducts.map(product => {
    // Construir la ruta de la imagen 1 (portada) desde la carpeta del producto
    const imgUrl = `assets/img/productos/${product.sku}/1.webp`; // Por defecto usamos webp, el navegador fallará gracefully si no existe
    const productName = [product.nombre, product.color].filter(Boolean).join(" - ");
    const priceText = product.precio
      ? `${product.precioDesde ? "Desde " : ""}S/ ${product.precio.toFixed(2)}`
      : "";
    const tallasText = product.tallasDisp.length
      ? `Tallas: ${product.tallasDisp.join(", ")}`
      : "Consultar disponibilidad";

    return `
      <a href="producto.html?p=${product.sku}" class="similar-product-card"
         data-sku="${product.sku}"
         data-product-name="${product.nombre}"
         data-product-color="${product.color}">
        <img src="${imgUrl}?v=${CSV_VERSION}" alt="${productName}" class="similar-product-image" loading="lazy" onerror="this.style.display='none'">
        <div class="similar-product-info">
          <h3 class="similar-product-name">${productName}</h3>
          ${priceText ? `<p class="similar-product-price">${priceText}</p>` : ''}
          <p class="similar-product-tallas">${tallasText}</p>
        </div>
      </a>
    `;
  }).join("");
}

(async function init(){
  const sku = (getParam("p") || "").toUpperCase();
  if(!sku){ document.getElementById("title").textContent="Producto no especificado"; return; }

  try{
    const rows = await fetchCSV(sheetUrl());
    const valid = rows.filter(r => (r.estado||"") !== "OCULTO");
    const groups = agruparNombreColor(valid);
    const g = groups.find(x => x.sku === sku);
    if(!g){
      document.getElementById("title").textContent = "Producto no encontrado";
      return;
    }
    await renderProduct(g);

    // Cargar productos similares
    await loadSimilarProducts(sku, groups);

    // === DATALAYER: begin_checkout (botón CTA final) ===
    setTimeout(() => {
      const btnCTAFinal = document.querySelector('.btn-cta-primary');
      if(btnCTAFinal) {
        btnCTAFinal.addEventListener('click', function() {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ ecommerce: null });
          window.dataLayer.push({
            event: 'begin_checkout',
            ecommerce: {
              currency: 'PEN',
              value: g.precioSale || g.precio || 0,
              items: [{
                item_id: g.sku,
                item_name: g.nombre,
                item_brand: 'WAIRA & DR',
                item_category: g.tipo || '',
                item_variant: g.color,
                price: g.precioSale || g.precio || 0,
                quantity: 1
              }]
            },
            button_location: 'product_detail_bottom'
          });
        });
      }
    }, 500);
  }catch(e){
    console.error(e);
    document.getElementById("title").textContent = "Error cargando producto";
  }
})();

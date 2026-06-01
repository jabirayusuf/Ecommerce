// Minimal product data
const PRODUCTS = [
    { id:1, title:"Classic Tee", price:24.99, category:"clothing", img:"https://picsum.photos/seed/p1/500/400" },
    { id:2, title:"Wireless Earbuds", price:79.00, category:"electronics", img:"https://picsum.photos/seed/p2/500/400" },
    { id:3, title:"Ceramic Vase", price:34.50, category:"home", img:"https://picsum.photos/seed/p3/500/400" },
    { id:4, title:"Denim Jacket", price:89.99, category:"clothing", img:"https://picsum.photos/seed/p4/500/400" },
    { id:5, title:"Smart Lamp", price:45.00, category:"electronics", img:"https://picsum.photos/seed/p5/500/400" },
    { id:6, title:"Coffee Maker", price:69.95, category:"home", img:"https://picsum.photos/seed/p6/500/400" },
    { id:7, title:"Running Shoes", price:59.99, category:"clothing", img:"https://picsum.photos/seed/p7/500/400" },
    { id:8, title:"Bluetooth Speaker", price:39.99, category:"electronics", img:"https://picsum.photos/seed/p8/500/400" }
  ];
  
  const state = {
    products: [...PRODUCTS],
    cart: {}, // id -> qty
    filters: { q: '', category: 'all', sort: 'default' }
  };
  
  const els = {
    products: document.getElementById('products'),
    cartBtn: document.getElementById('cartBtn'),
    cartSidebar: document.getElementById('cartSidebar'),
    cartItems: document.getElementById('cartItems'),
    cartTotal: document.getElementById('cartTotal'),
    cartCount: document.getElementById('cartCount'),
    closeCart: document.getElementById('closeCart'),
    overlay: document.getElementById('overlay'),
    search: document.getElementById('search'),
    categoryFilter: document.getElementById('categoryFilter'),
    sortBy: document.getElementById('sortBy'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    menuToggle: document.getElementById('menuToggle'),
    mainNav: document.getElementById('mainNav'),
    year: document.getElementById('year'),
  };
  
  function formatPrice(n){ return n.toFixed(2); }
  
  function renderProducts(){
    const { q, category, sort } = state.filters;
    let list = state.products.filter(p=>{
      if(category !== 'all' && p.category !== category) return false;
      if(q && !p.title.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  
    if(sort === 'price-asc') list.sort((a,b)=>a.price-b.price);
    if(sort === 'price-desc') list.sort((a,b)=>b.price-a.price);
  
    els.products.innerHTML = list.map(p => `
      <article class="card" data-id="${p.id}">
        <div class="product-img" style="background-image:url('${p.img}')"></div>
        <h3 class="title">${p.title}</h3>
        <div class="badge">${p.category}</div>
        <div class="card-foot">
          <div>
            <div class="price">$${formatPrice(p.price)}</div>
          </div>
          <div>
            <button class="primary-btn add-btn" data-id="${p.id}">Add</button>
          </div>
        </div>
      </article>
    `).join('');
  }
  
  function openCart(){
    els.cartSidebar.classList.add('open');
    els.cartSidebar.setAttribute('aria-hidden', 'false');
    els.overlay.hidden = false;
  }
  
  function closeCart(){
    els.cartSidebar.classList.remove('open');
    els.cartSidebar.setAttribute('aria-hidden', 'true');
    els.overlay.hidden = true;
  }
  
  function updateCartUI(){
    const itemIds = Object.keys(state.cart).map(Number);
    if(itemIds.length === 0){
      els.cartItems.innerHTML = '<p class="empty">Your cart is empty.</p>';
      els.cartCount.textContent = '0';
      els.cartTotal.textContent = '0.00';
      return;
    }
    let total = 0;
    els.cartItems.innerHTML = itemIds.map(id=>{
      const product = PRODUCTS.find(p=>p.id===id);
      const qty = state.cart[id];
      const line = product.price*qty;
      total += line;
      return `
        <div class="cart-item" data-id="${id}">
          <img src="${product.img}" alt="${product.title}">
          <div style="flex:1">
            <div style="font-weight:600">${product.title}</div>
            <div style="color:var(--muted)">$${formatPrice(product.price)} × ${qty} = $${formatPrice(line)}</div>
          </div>
          <div>
            <div class="qty-controls">
              <button class="qty-btn dec" data-id="${id}">−</button>
              <div style="padding:4px 6px;">${qty}</div>
              <button class="qty-btn inc" data-id="${id}">＋</button>
            </div>
            <button class="icon-btn remove" data-id="${id}" style="margin-top:6px;color:#b91c1c">Remove</button>
          </div>
        </div>
      `;
    }).join('');
    els.cartCount.textContent = itemIds.reduce((s,id)=>s+state.cart[id],0);
    els.cartTotal.textContent = formatPrice(total);
  }
  
  function addToCart(id, qty=1){
    state.cart[id] = (state.cart[id] || 0) + qty;
    updateCartUI();
  }
  
  function removeFromCart(id){
    delete state.cart[id];
    updateCartUI();
  }
  
  function changeQty(id, delta){
    const current = state.cart[id] || 0;
    const next = current + delta;
    if(next <= 0) removeFromCart(id);
    else {
      state.cart[id] = next;
      updateCartUI();
    }
  }
  
  /* Event wiring */
  document.addEventListener('click', (e)=>{
    const add = e.target.closest('.add-btn');
    if(add){
      const id = Number(add.dataset.id);
      addToCart(id,1);
      els.cartSidebar.classList.add('open'); els.overlay.hidden = false;
      return;
    }
  
    const open = e.target === els.cartBtn || e.target.closest('#cartBtn');
    if(open){ openCart(); return; }
  
    if(e.target === els.closeCart || e.target.closest('#closeCart')){ closeCart(); return; }
  
    if(e.target === els.overlay){ closeCart(); return; }
  
    const dec = e.target.closest('.dec');
    if(dec){ changeQty(Number(dec.dataset.id), -1); return; }
  
    const inc = e.target.closest('.inc');
    if(inc){ changeQty(Number(inc.dataset.id), +1); return; }
  
    const rem = e.target.closest('.remove');
    if(rem){ removeFromCart(Number(rem.dataset.id)); return; }
  });
  
  els.search.addEventListener('input', (e)=>{ state.filters.q = e.target.value; renderProducts(); });
  
  els.categoryFilter.addEventListener('change', (e)=>{ state.filters.category = e.target.value; renderProducts(); });
  els.sortBy.addEventListener('change', (e)=>{ state.filters.sort = e.target.value; renderProducts(); });
  
  els.checkoutBtn.addEventListener('click', ()=>{
    if(Object.keys(state.cart).length === 0){ alert('Your cart is empty.'); return; }
    // Simple mock checkout
    alert('Checkout — total: $' + els.cartTotal.textContent);
    state.cart = {}; updateCartUI(); closeCart();
  });
  
  els.menuToggle.addEventListener('click', ()=>{
    const visible = els.mainNav.style.display === 'flex';
    els.mainNav.style.display = visible ? 'none' : 'flex';
  });
  
  window.addEventListener('load', ()=>{ renderProducts(); updateCartUI(); els.year.textContent = new Date().getFullYear(); });
  
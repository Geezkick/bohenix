// src/UI.js
// Handles: SPA routing, cart, custom cursor, products grid, filter,
//          nav scroll, hamburger menu, reveal animations, search,
//          subscription plan add-to-cart, legal modals.
// frameCtrl: API from FrameSequence to adapt overlay per page.

import gsap from 'gsap';
import { PRODUCTS } from './products.js';

/* ─── CART STATE ─────────────────────────────────────── */
let cart = [];
const cartTotal = () => cart.reduce((s, i) => s + i.price, 0);
const fmt = (n) => '$' + n.toLocaleString();

/* ─── RENDER PRODUCT CARD ────────────────────────────── */
function makeCard(product) {
    const div = document.createElement('div');
    div.className = 'product-card reveal';
    div.dataset.cat = product.cat;
    div.innerHTML = `
    <div class="product-image">${product.emoji}</div>
    <div class="product-cat-tag">${product.cat}</div>
    <div class="product-card-body">
      <h3>${product.name}</h3>
      <p>${product.desc}</p>
      <div class="product-price">${fmt(product.price)}</div>
      <div class="product-actions">
        <button class="btn-primary add-to-cart-btn"
          data-id="${product.id}"
          data-name="${product.name}"
          data-price="${product.price}"
          data-emoji="${product.emoji}">
          Add to Cart
        </button>
      </div>
    </div>`;
    return div;
}

/* ─── POPULATE GRIDS ─────────────────────────────────── */
function populateHomeGrid() {
    const grid = document.getElementById('home-product-grid');
    if (!grid || grid.children.length) return;
    PRODUCTS.slice(0, 4).forEach(p => grid.appendChild(makeCard(p)));
}

function populateFullGrid(filter = 'all') {
    const grid = document.getElementById('full-product-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const list = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === filter);
    list.forEach(p => grid.appendChild(makeCard(p)));
    setupReveal();
}

/* ─── CART UI ────────────────────────────────────────── */
function renderCartUI() {
    const list = document.getElementById('cart-items-list');
    const counter = document.getElementById('cart-count');
    const total = document.getElementById('cart-total-amount');
    if (!list) return;

    counter.textContent = cart.length;
    total.textContent = fmt(cartTotal());

    if (cart.length === 0) {
        list.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
        return;
    }
    list.innerHTML = '';
    cart.forEach((item, idx) => {
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
      <div class="cart-item-icon">${item.emoji}</div>
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <span>${fmt(item.price)}</span>
      </div>
      <button class="icon-btn cart-remove" data-idx="${idx}">✕</button>`;
        list.appendChild(row);
    });

    list.querySelectorAll('.cart-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            cart.splice(Number(btn.dataset.idx), 1);
            renderCartUI();
        });
    });
}

function openCart() {
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('cart-overlay').classList.add('visible');
}
function closeCart() {
    document.getElementById('cart-drawer').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('visible');
}

/* ─── REVEAL OBSERVER on scroll ─────────────────────── */
let revealObserver;
function setupReveal() {
    if (!revealObserver) {
        revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('in-view');
                    revealObserver.unobserve(e.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    }
    document.querySelectorAll('.reveal:not(.in-view)').forEach(el => revealObserver.observe(el));
}

/* ─── MAIN INIT ──────────────────────────────────────── */
export function initUI(lenis, frameCtrl) {

    /* ── Custom Cursor ───────────────────────────────── */
    const ring = document.getElementById('cursor-ring');
    const dot = document.getElementById('cursor-dot');
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    const LERP = 0.12;

    window.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        gsap.set(dot, { x: mx, y: my });
    }, { passive: true });

    gsap.ticker.add((time, deltaTime) => {
        rx += (mx - rx) * LERP;
        ry += (my - ry) * LERP;
        gsap.set(ring, { x: rx, y: ry });
    });

    document.addEventListener('mouseover', e => {
        const btn = e.target.closest('a, button, .interactive');
        if (btn) {
            document.body.classList.add('cursor-hover');
            if (btn.classList.contains('magnetic')) {
                gsap.to(ring, { scale: 1.5, borderColor: 'rgba(255,255,255,0.5)', duration: 0.3 });
            }
        }
    });

    document.addEventListener('mouseout', e => {
        const btn = e.target.closest('a, button, .interactive');
        if (btn) {
            document.body.classList.remove('cursor-hover');
            gsap.to(ring, { scale: 1, borderColor: '', duration: 0.3 });
        }
    });

    // Magnetic / Interactive buttons
    document.addEventListener('mousemove', e => {
        const btn = e.target.closest('.magnetic');
        if (btn) {
            const rect = btn.getBoundingClientRect();
            const bx = rect.left + rect.width / 2;
            const by = rect.top + rect.height / 2;
            const dist = Math.sqrt(Math.pow(e.clientX - bx, 2) + Math.pow(e.clientY - by, 2));

            if (dist < 100) {
                const x = (e.clientX - bx) * 0.3;
                const y = (e.clientY - by) * 0.3;
                gsap.to(btn, { x, y, duration: 0.4, ease: 'power2.out' });
            } else {
                gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
            }
        }
    });

    /* ── Nav: scroll header / hamburger ─────────────── */
    const header = document.getElementById('site-header');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
    });
    navLinks.addEventListener('click', e => {
        if (e.target.matches('a')) {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
        }
    });

    /* ── Search ──────────────────────────────────────── */
    const searchBar = document.getElementById('search-bar');
    const searchInput = document.getElementById('search-input');
    const searchToggle = document.getElementById('search-toggle');
    const searchClose = document.getElementById('search-close');

    searchToggle.addEventListener('click', () => {
        const v = !searchBar.classList.contains('visible');
        searchBar.classList.toggle('visible', v);
        if (v) searchInput.focus();
    });
    searchClose.addEventListener('click', () => searchBar.classList.remove('visible'));

    /* ── Cart ────────────────────────────────────────── */
    document.getElementById('cart-toggle').addEventListener('click', openCart);
    document.getElementById('close-cart').addEventListener('click', closeCart);
    document.getElementById('cart-overlay').addEventListener('click', closeCart);

    /* ─── SPA Router ─────────────────────────────────── */
    const PAGES = ['home', 'products', 'services', 'subscriptions'];
    // Background canvas stays always-on; only overlay alpha changes.
    const HOME_OVERLAY = 0.40;   // lighter — let frames show through on Home
    const INNER_OVERLAY = 0.86;   // darker   — uniform dark bg on inner pages

    function showPage(id) {
        if (!PAGES.includes(id)) id = 'home';
        const isHome = id === 'home';

        // Swap page panels
        PAGES.forEach(p => {
            const el = document.getElementById(`page-${p}`);
            if (el) el.classList.toggle('active', p === id);
        });

        // Adapt overlay opacity — canvas stays ALWAYS running
        if (frameCtrl) frameCtrl.setOverlayIntensity(isHome ? HOME_OVERLAY : INNER_OVERLAY);

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(a => {
            const href = (a.getAttribute('href') || '').replace('#', '');
            a.classList.toggle('active', href === id);
        });

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' });
        if (lenis) lenis.scrollTo(0, { immediate: true });

        // Products grid
        if (id === 'products') populateFullGrid('all');

        setupReveal();
    }

    // Intercept all #hash navigation links
    document.addEventListener('click', e => {
        const anchor = e.target.closest('[href^="#"], [data-target]');
        if (!anchor) return;
        const raw = anchor.dataset.target || (anchor.getAttribute('href') || '').replace('#', '');
        if (PAGES.includes(raw)) {
            e.preventDefault();
            history.pushState({}, '', `#${raw}`);
            showPage(raw);
        }
    });

    window.addEventListener('popstate', () => {
        showPage(window.location.hash.replace('#', '') || 'home');
    });

    /* ─── Products Filter ─────────────────────────────── */
    populateHomeGrid();

    document.addEventListener('click', e => {
        if (e.target.matches('.filter-btn')) {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            populateFullGrid(e.target.dataset.filter || 'all');
        }
    });

    /* ─── Add-to-Cart & Action Buttons ────────────── */
    document.addEventListener('click', e => {
        const btn = e.target.closest('.btn-primary, .btn-outline, .icon-btn, .ripple-btn');
        if (!btn) return;

        // Ripple Effect
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple-circle';
        const size = Math.max(rect.width, rect.height) * 1.5;
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);

        // Logic
        const cartBtn = e.target.closest('.add-to-cart-btn, .add-plan-btn');
        if (cartBtn) {
            if (cartBtn.matches('.add-to-cart-btn')) {
                cart.push({ id: cartBtn.dataset.id, name: cartBtn.dataset.name, price: Number(cartBtn.dataset.price), emoji: cartBtn.dataset.emoji });
            } else if (cartBtn.matches('.add-plan-btn')) {
                cart.push({ id: cartBtn.dataset.plan, name: cartBtn.dataset.plan, price: 0, emoji: '📋' });
            }
            renderCartUI();

            const counter = document.getElementById('cart-count');
            gsap.fromTo(counter, { scale: 1.6 }, { scale: 1, duration: 0.45, ease: 'back.out(2.5)' });
        }

        // Tactile scale
        gsap.fromTo(btn, { scale: 0.96 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
    });

    /* ─── Newsletter ──────────────────────────────────── */
    document.getElementById('newsletter-form')?.addEventListener('submit', e => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const inp = e.target.querySelector('input');
        btn.textContent = '✓ Subscribed!';
        btn.disabled = true;
        inp.value = '';
        setTimeout(() => { btn.textContent = 'Subscribe'; btn.disabled = false; }, 3000);
    });

    /* ─── Legal Modals ────────────────────────────────── */
    function bindLegal(id, modalId) {
        [`${id}`, `${id}2`].forEach(tid => {
            document.getElementById(tid)?.addEventListener('click', e => {
                e.preventDefault();
                document.getElementById(modalId).classList.remove('hidden');
            });
        });
    }
    bindLegal('terms-link', 'terms-modal');
    bindLegal('privacy-link', 'privacy-modal');

    document.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.addEventListener('click', () => btn.closest('.legal-modal').classList.add('hidden'));
    });
    document.querySelectorAll('.legal-modal').forEach(m => {
        m.addEventListener('click', e => { if (e.target === m) m.classList.add('hidden'); });
    });

    /* ─── Hero CTA buttons ────────────────────────────── */
    document.getElementById('explore-btn')?.addEventListener('click', () => {
        history.pushState({}, '', '#products');
        showPage('products');
    });
    document.getElementById('explore-more-btn')?.addEventListener('click', () => {
        const hero = document.querySelector('.hero-section');
        if (!hero) return;
        if (lenis) lenis.scrollTo(hero.offsetHeight - window.innerHeight + 50, { duration: 2 });
        else window.scrollTo({ top: hero.offsetHeight - window.innerHeight + 50, behavior: 'smooth' });
    });

    /* ─── Boot from URL hash ──────────────────────────── */
    showPage(window.location.hash.replace('#', '') || 'home');
    setupReveal();
}

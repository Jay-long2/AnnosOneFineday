/* ===================== EDIT THIS BLOCK ===================== */
const CONFIG = {
  /* M-Pesa */
  paybill: "522522",
  accountNo: "7735032",

  /* contact */
  email:    "info@annosonefineday.org",
  whatsapp: "254722886172",          // digits only, no "+"
  phone:    "+254 722 886172",

  /* social */
  facebook:  "https://www.facebook.com/annosonefineday",
  instagram: "https://www.instagram.com/annosonefinedayartcentrekibera/",
  youtube:   "https://www.youtube.com/@annosonefineday5913",
  x:         "https://twitter.com/Aonefineday",

  /* Instagram section.
     These are individual posts, embedded straight from Instagram - no account or
     token needed, but the LIST IS FIXED: new posts do not appear on their own.
     For a feed that updates itself, see the comment above <div id="igFeed"> in
     index.html. Add or swap post links here any time.

     "ratio" is the post's shape: 1 = square (most posts), 1.25 = portrait 4:5,
     0.56 = landscape / widescreen video. Getting it right just means the card ends
     neatly under "View more on Instagram"; leave it out and it assumes square. */
  instagramPosts: [
    { url: "https://www.instagram.com/p/DeOWjq3ArwC/",    ratio: 1 },
    { url: "https://www.instagram.com/reel/DeL-Y3TCybD/", ratio: 0.566 },
    { url: "https://www.instagram.com/p/DeKY6cREVnt/",    ratio: 1 }
  ],

  /* hero */
  heroImage: "",        // optional photo shown INSTEAD of the logo badge in the hero
  backgroundImage: "",  // optional override for the hero background (default: assets/hero.webp)
  headline: "Where creativity opens doors to new possibilities.",
  sub: "Anno's One Fine Day Art Centre is a creative space in Kibera where children and young people explore, dream, create and imagine new possibilities for their lives."
};
/* Campaign links without editing code: add ?headline=...&sub=... to the page URL.
   Example: index.html?headline=Give%20on%20Giving%20Tuesday&sub=Every%20shilling%20funds%20a%20class */
/* =========================================================== */

const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const ORG = "Anno's One Fine Day";

/* ---------- hero (index only) ---------- */
const q = new URLSearchParams(location.search);
if ($("#headline")) $("#headline").textContent = q.get("headline") || CONFIG.headline;
if ($("#sub"))      $("#sub").textContent      = q.get("sub")      || CONFIG.sub;
if (CONFIG.backgroundImage && $(".hero")) $(".hero").style.setProperty("--hero-img", 'url("' + CONFIG.backgroundImage + '")');
if (CONFIG.heroImage && $("#stage")) $("#stage").innerHTML = '<img class="photo" alt="" src="' + CONFIG.heroImage + '">';

/* ---------- amount picker (index only) ---------- */
const fmt = n => "KES " + n.toLocaleString("en-KE");
const amtBtns = $$("#amounts button");
const customAmt = $("#customAmt"), customField = $("#customField");
let lastPreset = 2500, amount = 2500;

if (amtBtns.length) {
  const pressOnly = v => amtBtns.forEach(x => x.setAttribute("aria-pressed", +x.dataset.amt === v ? "true" : "false"));
  amtBtns.forEach(b => b.addEventListener("click", () => {
    lastPreset = amount = +b.dataset.amt;
    pressOnly(lastPreset);
    customAmt.value = "";
    customField.classList.remove("on");
  }));

  const digitsOf = s => s.replace(/\D/g, "").replace(/^0+/, "").slice(0, 7);
  customAmt.addEventListener("input", () => {
    const d = digitsOf(customAmt.value);
    customAmt.value = d;
    if (d) { amount = +d; pressOnly(-1); customField.classList.add("on"); }
    else   { amount = lastPreset; pressOnly(lastPreset); customField.classList.remove("on"); }
  });
  customAmt.addEventListener("focus", () => { customAmt.value = digitsOf(customAmt.value); });
  customAmt.addEventListener("blur",  () => {
    const d = digitsOf(customAmt.value);
    customAmt.value = d ? (+d).toLocaleString("en-KE") : "";
  });
  customAmt.addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); customAmt.blur(); openDonate(); }
  });
}

/* ---------- donate modal (both pages) ---------- */
const dlg = $("#donateDlg");
if ($("#dPay")) $("#dPay").textContent = CONFIG.paybill;
if ($("#dAcc")) $("#dAcc").textContent = CONFIG.accountNo;

function openDonate() {
  if (!dlg) { location.href = "index.html#give"; return; }
  if ($("#dAmt")) $("#dAmt").textContent = fmt(amount);
  dlg.showModal();
}
$$("[data-donate]").forEach(b => b.addEventListener("click", openDonate));
if (dlg) {
  $("#dClose").onclick = () => dlg.close();
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
}
$$("[data-copy]").forEach(b => b.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($("#" + b.dataset.copy).textContent);
    const t = b.textContent; b.textContent = "Copied"; setTimeout(() => b.textContent = t, 1500);
  } catch (e) {}
}));

/* ---------- contact + social ---------- */
$$("[data-mail]").forEach(a => a.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent(a.dataset.mail));

const socialLinks = [
  ["Instagram", CONFIG.instagram], ["Facebook", CONFIG.facebook],
  ["YouTube",   CONFIG.youtube],   ["X",        CONFIG.x]
].filter(s => s[1]);

if ($("#contact")) {
  $("#contact").innerHTML =
      '<a href="mailto:' + CONFIG.email + '">' + CONFIG.email + '</a>'
    + (CONFIG.whatsapp ? '<br><a href="https://wa.me/' + CONFIG.whatsapp + '">WhatsApp ' + (CONFIG.phone || CONFIG.whatsapp) + '</a>' : '')
    + '<br>' + socialLinks.map(s => '<a href="' + s[1] + '" target="_blank" rel="noopener">' + s[0] + '</a>').join(" &middot; ");
}

/* ---------- share ---------- */
const url = location.href.split("#")[0].split("?")[0];
const msg = "Arts education for children in Kibera. Support " + ORG + ": ";
if ($("#sh-wa")) $("#sh-wa").href = "https://wa.me/?text=" + encodeURIComponent(msg + url);
if ($("#sh-x"))  $("#sh-x").href  = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(msg) + "&url=" + encodeURIComponent(url);
if ($("#sh-ig") && CONFIG.instagram) $("#sh-ig").href = CONFIG.instagram;
if ($("#sh-copy")) $("#sh-copy").onclick = async e => {
  try { await navigator.clipboard.writeText(url); e.target.textContent = "Link copied"; } catch (_) {}
};

/* ---------- Instagram ---------- */
const igHost = $("#igFeed");
if (igHost && !igHost.querySelector("*")) {          // leave a pasted widget embed alone
  const posts = (CONFIG.instagramPosts || []).map(item => {
    const url   = typeof item === "string" ? item : (item && item.url) || "";
    const ratio = (typeof item === "object" && item && +item.ratio > 0) ? +item.ratio : 1;
    const m = url.match(/\/(p|reel|tv)\/([A-Za-z0-9_-]+)/);
    return m ? { kind: m[1], code: m[2], ratio } : null;
  }).filter(Boolean);

  if (posts.length) {
    igHost.className = "ig-grid";
    igHost.innerHTML = posts.slice(0, 3).map(p =>
      '<div class="ig-post"><div class="ig-frame" style="--r:' + p.ratio + '">' +
      '<iframe src="https://www.instagram.com/' + p.kind + '/' + p.code +
      '/embed/" loading="lazy" scrolling="no" title="Instagram post from ' + ORG + '"></iframe>' +
      '</div></div>'
    ).join("");
  } else {
    const handle = (CONFIG.instagram || "").replace(/\/$/, "").split("/").pop();
    igHost.innerHTML =
      '<div class="ig-follow"><div><b>@' + handle + '</b>' +
      '<span>Classes, rehearsals and showcases, posted as they happen.</span></div>' +
      '<a class="btn btn-sun" href="' + CONFIG.instagram + '" target="_blank" rel="noopener">Follow on Instagram</a></div>';
  }
}

/* ---------- count-up stats ---------- */
const io = new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting) return;
  io.unobserve(en.target);
  const el = en.target, end = +el.dataset.count, sfx = el.dataset.suffix || "";
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) {
    el.textContent = end.toLocaleString("en-KE") + sfx; return;
  }
  const t0 = performance.now();
  (function tick(t) {
    const p = Math.min((t - t0) / 1100, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString("en-KE") + (p < 1 ? "" : sfx);
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}), { threshold: .6 });
$$("[data-count]").forEach(el => io.observe(el));

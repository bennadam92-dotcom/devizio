/* Devizio — porte d'authentification.
   Connexion par mot de passe (email + mdp), inscription avec mot de passe + vérification email par code,
   et code par email en secours. Chargé AVANT app.js. */
(function () {
  "use strict";

  var API_BASE = "https://piscineo-api.onrender.com"; // backend partagé
  var TKEY = "devizio_token";
  var email = ""; // partagé entre les écrans

  function esc(s) { return (s == null ? "" : String(s)).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function emailOk(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
  function api(path, opts) {
    opts = opts || {};
    var h = { "Content-Type": "application/json" };
    var t = localStorage.getItem(TKEY); if (t) h.Authorization = "Bearer " + t;
    opts.headers = h;
    return fetch(API_BASE + path, opts).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (b) { return { ok: r.ok, status: r.status, body: b }; });
    });
  }

  var root;
  function screen(html, after) {
    root = document.getElementById("auth-root"); if (!root) return; root.hidden = false;
    root.innerHTML = '<div class="auth-overlay"><div class="auth-card">' +
      '<div class="auth-logo"><img src="assets/img/logo.svg" alt="" style="width:30px;height:30px;margin-right:6px"><span>Devizio</span></div>' + html + '</div></div>';
    if (after) after();
  }

  /* ---------- Bannière d'essai + déconnexion ---------- */
  function renderTrial(user) {
    var foot = document.querySelector(".side-foot"); if (!foot || !user) return;
    var el = document.getElementById("trial-info");
    if (!el) { el = document.createElement("div"); el.id = "trial-info"; foot.appendChild(el); }
    var txt = user.plan === "trial" ? ("Essai gratuit — <strong>" + user.days_left + " j</strong> restants")
      : (user.plan === "expired" ? "Essai terminé" : "");
    el.innerHTML = '<div style="margin-top:12px;font-size:12px;color:#aeb6c8;line-height:1.5">' + esc(user.email) + '<br>' + txt +
      '<br><a href="#" id="logout" style="color:#aeb6c8;text-decoration:underline">se déconnecter</a></div>';
    var lo = document.getElementById("logout"); if (lo) lo.onclick = function (e) { e.preventDefault(); localStorage.removeItem(TKEY); location.reload(); };
  }

  /* ---------- Écran : Connexion (mot de passe) ---------- */
  function viewLogin() {
    screen(
      '<h2>Connexion</h2><p class="auth-sub">Content de vous revoir 👋</p>' +
      '<div class="auth-field"><input type="email" id="l-email" placeholder="vous@exemple.fr" autocomplete="email" value="' + esc(email) + '"></div>' +
      '<div class="auth-field"><input type="password" id="l-pw" placeholder="Mot de passe" autocomplete="current-password"></div>' +
      '<button class="btn btn-primary btn-block" id="l-go">Se connecter</button>' +
      '<p class="auth-msg" id="l-msg"></p>' +
      '<p class="auth-note">Pas encore de compte ? <a href="#" id="to-signup">Créer un compte</a></p>' +
      '<p class="auth-note"><a href="#" id="to-code">Mot de passe oublié ? Recevoir un code</a></p>',
      function () {
        var b = document.getElementById("l-go"), msg = document.getElementById("l-msg");
        function go() {
          email = (document.getElementById("l-email").value || "").trim().toLowerCase();
          var pw = document.getElementById("l-pw").value || "";
          if (!emailOk(email) || !pw) { msg.textContent = "Email et mot de passe requis."; return; }
          b.disabled = true; b.textContent = "Connexion…";
          api("/api/auth/login", { method: "POST", body: JSON.stringify({ email: email, password: pw }) }).then(function (r) {
            if (r.ok) { localStorage.setItem(TKEY, r.body.token); location.reload(); return; }
            b.disabled = false; b.textContent = "Se connecter";
            if (r.body.error === "non_verifie") { msg.textContent = "Compte non vérifié — on vous envoie un code."; api("/api/auth/signup", { method: "POST", body: JSON.stringify({ email: email }) }).then(function () { viewCode(false); }); return; }
            msg.textContent = "Email ou mot de passe incorrect.";
          }).catch(function () { b.disabled = false; b.textContent = "Se connecter"; msg.textContent = "Serveur injoignable (réveil ~30 s), réessayez."; });
        }
        b.onclick = go;
        document.getElementById("l-pw").addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
        document.getElementById("to-signup").onclick = function (e) { e.preventDefault(); viewSignup(); };
        document.getElementById("to-code").onclick = function (e) { e.preventDefault(); viewCodeReq(); };
      });
  }

  /* ---------- Écran : Créer un compte (email + mot de passe) ---------- */
  function viewSignup() {
    screen(
      '<h2>Créer un compte</h2><p class="auth-sub">Choisissez un mot de passe. On vérifie votre email avec un code (une seule fois).</p>' +
      '<div class="auth-field"><input type="email" id="s-email" placeholder="vous@exemple.fr" autocomplete="email" value="' + esc(email) + '"></div>' +
      '<div class="auth-field"><input type="password" id="s-pw" placeholder="Mot de passe (6 caractères min)" autocomplete="new-password"></div>' +
      '<button class="btn btn-primary btn-block" id="s-go">Créer mon compte</button>' +
      '<p class="auth-note">🎁 Essai gratuit 30 jours · sans carte bancaire</p>' +
      '<p class="auth-msg" id="s-msg"></p>' +
      '<p class="auth-note">Déjà un compte ? <a href="#" id="to-login">Se connecter</a></p>',
      function () {
        var b = document.getElementById("s-go"), msg = document.getElementById("s-msg");
        b.onclick = function () {
          email = (document.getElementById("s-email").value || "").trim().toLowerCase();
          var pw = document.getElementById("s-pw").value || "";
          if (!emailOk(email)) { msg.textContent = "Email invalide."; return; }
          if (pw.length < 6) { msg.textContent = "Mot de passe : 6 caractères minimum."; return; }
          b.disabled = true; b.textContent = "Création…";
          api("/api/auth/signup", { method: "POST", body: JSON.stringify({ email: email, password: pw, trade: (localStorage.getItem("devizio_trade") || "") }) }).then(function (r) {
            b.disabled = false; b.textContent = "Créer mon compte";
            if (!r.ok) { msg.textContent = "Erreur, réessayez."; return; }
            viewCode(r.body.sent === "dev");
          }).catch(function () { b.disabled = false; b.textContent = "Créer mon compte"; msg.textContent = "Serveur injoignable (réveil ~30 s), réessayez."; });
        };
        document.getElementById("to-login").onclick = function (e) { e.preventDefault(); viewLogin(); };
      });
  }

  /* ---------- Écran : Code par email (sans mot de passe / secours) ---------- */
  function viewCodeReq() {
    screen(
      '<h2>Connexion par code</h2><p class="auth-sub">On vous envoie un code par email, sans mot de passe.</p>' +
      '<div class="auth-field"><input type="email" id="c-email" placeholder="vous@exemple.fr" value="' + esc(email) + '"></div>' +
      '<button class="btn btn-primary btn-block" id="c-go">Recevoir un code</button>' +
      '<p class="auth-msg" id="c-msg"></p>' +
      '<p class="auth-note"><a href="#" id="to-login2">Retour à la connexion</a></p>',
      function () {
        var b = document.getElementById("c-go"), msg = document.getElementById("c-msg");
        b.onclick = function () {
          email = (document.getElementById("c-email").value || "").trim().toLowerCase();
          if (!emailOk(email)) { msg.textContent = "Email invalide."; return; }
          b.disabled = true; b.textContent = "Envoi…";
          api("/api/auth/signup", { method: "POST", body: JSON.stringify({ email: email, trade: (localStorage.getItem("devizio_trade") || "") }) }).then(function (r) {
            b.disabled = false; b.textContent = "Recevoir un code";
            if (!r.ok) { msg.textContent = "Erreur, réessayez."; return; }
            viewCode(r.body.sent === "dev");
          }).catch(function () { b.disabled = false; b.textContent = "Recevoir un code"; msg.textContent = "Serveur injoignable."; });
        };
        document.getElementById("to-login2").onclick = function (e) { e.preventDefault(); viewLogin(); };
      });
  }

  /* ---------- Écran : saisie du code ---------- */
  function viewCode(dev) {
    screen(
      '<h2>Entrez votre code</h2><p class="auth-sub">Code à 6 chiffres envoyé à <strong>' + esc(email) + '</strong>.</p>' +
      '<div class="auth-field"><input type="text" id="v-code" inputmode="numeric" maxlength="6" placeholder="123456" style="text-align:center;font-size:24px;letter-spacing:6px"></div>' +
      '<button class="btn btn-primary btn-block" id="v-go">Valider</button>' +
      '<p class="auth-msg" id="v-msg">' + (dev ? "(Mode démo : le code est dans les logs du serveur.)" : "") + '</p>' +
      '<p class="auth-note"><a href="#" id="v-resend">Renvoyer le code</a> · <a href="#" id="v-back">changer d\'email</a></p>',
      function () {
        var b = document.getElementById("v-go"), msg = document.getElementById("v-msg");
        function go() {
          var code = (document.getElementById("v-code").value || "").trim();
          if (code.length < 6) { msg.textContent = "Entrez le code à 6 chiffres."; return; }
          b.disabled = true; b.textContent = "Vérification…";
          api("/api/auth/verify", { method: "POST", body: JSON.stringify({ email: email, code: code }) }).then(function (r) {
            if (r.ok) { localStorage.setItem(TKEY, r.body.token); location.reload(); return; }
            b.disabled = false; b.textContent = "Valider";
            msg.textContent = { code_invalide: "Code incorrect.", code_expire: "Code expiré, renvoyez-en un.", aucun_code: "Demandez d'abord un code." }[r.body.error] || "Erreur.";
          }).catch(function () { b.disabled = false; b.textContent = "Valider"; msg.textContent = "Serveur injoignable."; });
        }
        b.onclick = go;
        document.getElementById("v-code").addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
        document.getElementById("v-code").focus();
        document.getElementById("v-resend").onclick = function (e) { e.preventDefault(); api("/api/auth/signup", { method: "POST", body: JSON.stringify({ email: email }) }); msg.textContent = "Nouveau code envoyé."; };
        document.getElementById("v-back").onclick = function (e) { e.preventDefault(); viewLogin(); };
      });
  }

  /* ---------- Verrou / déverrou ---------- */
  function lock() {
    document.body.classList.add("locked");
    api("/api/track", { method: "POST", body: JSON.stringify({ event: "signup" }) }).catch(function () {});
    viewLogin();
  }
  function unlock(user) { document.body.classList.remove("locked"); if (root) root.hidden = true; renderTrial(user); }

  /* ---------- Init ---------- */
  var token = localStorage.getItem(TKEY);
  function startFn() {
    if (!token) { lock(); return; }
    document.body.classList.remove("locked");
    api("/api/me").then(function (r) { if (r.ok) unlock(r.body.user); else { localStorage.removeItem(TKEY); lock(); } }).catch(function () {});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startFn);
  else startFn();
})();

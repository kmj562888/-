/* Ji입니다만 — Issue 01, Takamatsu
   Tabs · scroll reveals · checklist · budget · trip notes
   All user data stays in this browser (localStorage). */

(function () {
  'use strict';

  var KEY = {
    check: 'ji.takamatsu.checklist.v1',
    budget: 'ji.takamatsu.budget.v1',
    notes: 'ji.takamatsu.notes.v1'
  };

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function store(key, value) {
    try {
      if (value === undefined) {
        var raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      }
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      return null;
    }
  }

  /* ---------------- header + reveal ---------------- */

  var head = $('.site-head');
  if (head) {
    var onScroll = function () {
      head.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = $$('.reveal');

  if (!reduceMotion && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------------- day tabs ---------------- */

  var tabs = $$('.daytab');
  var panels = tabs.map(function (tab) { return document.getElementById(tab.getAttribute('aria-controls')); });

  function selectTab(index, focus) {
    tabs.forEach(function (tab, i) {
      var on = i === index;
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.setAttribute('tabindex', on ? '0' : '-1');
      if (panels[i]) panels[i].hidden = !on;
    });
    if (focus && tabs[index]) tabs[index].focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(i); });
    tab.addEventListener('keydown', function (event) {
      var last = tabs.length - 1;
      var next = null;
      if (event.key === 'ArrowRight') next = i === last ? 0 : i + 1;
      if (event.key === 'ArrowLeft') next = i === 0 ? last : i - 1;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = last;
      if (next !== null) {
        event.preventDefault();
        selectTab(next, true);
      }
    });
  });

  if (tabs.length) selectTab(0);

  /* ---------------- nav highlight ---------------- */

  var navLinks = $$('.nav a').filter(function (link) {
    return (link.getAttribute('href') || '').indexOf('#') > -1;
  });
  var sections = navLinks.map(function (link) {
    var id = (link.getAttribute('href') || '').split('#').pop();
    return id ? document.getElementById(id) : null;
  }).filter(Boolean);

  if (sections.length) {
    var navTick = false;
    var updateNav = function () {
      navTick = false;
      var marker = window.scrollY + window.innerHeight * 0.38;
      var current = sections[0];
      sections.forEach(function (section) {
        if (section.offsetTop <= marker) current = section;
      });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
        current = sections[sections.length - 1];
      }
      navLinks.forEach(function (link) {
        var id = (link.getAttribute('href') || '').split('#').pop();
        if (current && id === current.id) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    };
    var queueNav = function () {
      if (navTick) return;
      navTick = true;
      window.requestAnimationFrame(updateNav);
    };
    updateNav();
    window.addEventListener('scroll', queueNav, { passive: true });
    window.addEventListener('resize', queueNav);
  }

  /* ---------------- checklist ---------------- */

  var checklist = $('#checklist');
  if (checklist) {
    var boxes = $$('input[type="checkbox"]', checklist);
    var countEl = $('#check-count');
    var barEl = $('#check-bar');
    var totalEl = $('#check-total');
    var saved = store(KEY.check) || {};

    if (totalEl) totalEl.textContent = String(boxes.length);

    var paintCheck = function () {
      var done = boxes.filter(function (box) { return box.checked; }).length;
      if (countEl) countEl.textContent = String(done);
      if (barEl) barEl.style.width = (boxes.length ? (done / boxes.length) * 100 : 0) + '%';
    };

    boxes.forEach(function (box) {
      var key = box.getAttribute('data-key');
      box.checked = Boolean(saved && saved[key]);
      box.addEventListener('change', function () {
        saved = saved || {};
        saved[key] = box.checked;
        store(KEY.check, saved);
        paintCheck();
      });
    });
    paintCheck();
  }

  /* ---------------- budget ---------------- */

  var budgetRows = $('#budget-rows');
  if (budgetRows) {
    var amountInputs = $$('input[data-key]', budgetRows);
    var currencySelects = $$('select[data-cur]', budgetRows);
    var rateInput = $('#rate');
    var totalKrwEl = $('#total-krw');
    var totalSubEl = $('#total-sub');
    var clearBtn = $('#budget-clear');
    var bSaved = store(KEY.budget) || { rate: 950, items: {} };

    var fmt = function (n) {
      return Math.round(n).toLocaleString('ko-KR');
    };

    var applyState = function () {
      if (!bSaved) bSaved = { rate: 950, items: {} };
      if (rateInput) rateInput.value = bSaved.rate || 950;
      amountInputs.forEach(function (input) {
        var item = (bSaved.items || {})[input.getAttribute('data-key')] || {};
        input.value = item.amount ? item.amount : '';
      });
      currencySelects.forEach(function (select) {
        var item = (bSaved.items || {})[select.getAttribute('data-cur')] || {};
        select.value = item.cur || select.value;
      });
    };

    var readState = function () {
      var items = {};
      amountInputs.forEach(function (input) {
        var key = input.getAttribute('data-key');
        var select = currencySelects.filter(function (s) { return s.getAttribute('data-cur') === key; })[0];
        items[key] = {
          amount: parseFloat(input.value) || 0,
          cur: select ? select.value : 'KRW'
        };
      });
      return {
        rate: parseFloat(rateInput && rateInput.value) || 950,
        items: items
      };
    };

    var calc = function () {
      var state = readState();
      var rate = state.rate > 0 ? state.rate : 950;
      var total = 0;
      var jpy = 0;
      Object.keys(state.items).forEach(function (key) {
        var item = state.items[key];
        if (item.cur === 'JPY') {
          jpy += item.amount;
          total += item.amount * rate / 100;
        } else {
          total += item.amount;
        }
      });
      if (totalKrwEl) totalKrwEl.textContent = fmt(total);
      if (totalSubEl) {
        totalSubEl.textContent = 'JPY ' + fmt(jpy) + ' · 100엔 ' + fmt(rate) + '원 기준';
      }
    };

    applyState();
    calc();

    var saveTimer = null;
    var scheduleSave = function () {
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(function () {
        bSaved = readState();
        store(KEY.budget, bSaved);
      }, 220);
    };

    amountInputs.forEach(function (input) {
      input.addEventListener('input', function () { calc(); scheduleSave(); });
    });
    currencySelects.forEach(function (select) {
      select.addEventListener('change', function () { calc(); scheduleSave(); });
    });
    if (rateInput) rateInput.addEventListener('input', function () { calc(); scheduleSave(); });

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        bSaved = { rate: 950, items: {} };
        amountInputs.forEach(function (input) { input.value = ''; });
        if (rateInput) rateInput.value = '950';
        currencySelects.forEach(function (select) {
          var key = select.getAttribute('data-cur');
          select.value = (key === 'flight' || key === 'stay') ? 'KRW' : 'JPY';
        });
        store(KEY.budget, bSaved);
        calc();
      });
    }
  }

  /* ---------------- trip notes ---------------- */

  var form = $('#note-form');
  if (form) {
    var listEl = $('#note-list');
    var msgEl = $('#note-msg');
    var dateEl = $('#note-date');
    var titleEl = $('#note-title');
    var textEl = $('#note-text');
    var photoEl = $('#note-photo');
    var notes = store(KEY.notes) || [];
    var MAX_NOTES = 6;

    var setMsg = function (text) {
      if (!msgEl) return;
      msgEl.textContent = text || '';
      if (text) {
        window.setTimeout(function () {
          if (msgEl.textContent === text) msgEl.textContent = '';
        }, 6000);
      }
    };

    var renderNotes = function () {
      if (!listEl) return;
      listEl.textContent = '';
      if (!notes.length) {
        var p = document.createElement('p');
        p.className = 'empty';
        p.textContent = '아직 기록이 없다. 돌아온 뒤에 첫 장을 남겨보자.';
        listEl.appendChild(p);
        return;
      }
      notes.forEach(function (note) {
        var card = document.createElement('article');
        card.className = 'notecard';

        if (note.photo) {
          var fig = document.createElement('figure');
          var img = document.createElement('img');
          img.src = note.photo;
          img.alt = note.title ? note.title + ' 여행 사진' : '여행 사진';
          img.loading = 'lazy';
          fig.appendChild(img);
          card.appendChild(fig);
        }

        var body = document.createElement('div');
        var date = document.createElement('p');
        date.className = 'date';
        date.textContent = note.date || '';
        var h4 = document.createElement('h4');
        h4.textContent = note.title || '제목 없음';
        var text = document.createElement('p');
        text.textContent = note.text || '';
        body.appendChild(date);
        body.appendChild(h4);
        if (note.text) body.appendChild(text);
        card.appendChild(body);

        var del = document.createElement('button');
        del.className = 'del';
        del.type = 'button';
        del.textContent = '삭제';
        del.setAttribute('aria-label', (note.title || '기록') + ' 삭제');
        del.addEventListener('click', function () {
          notes = notes.filter(function (item) { return item.id !== note.id; });
          store(KEY.notes, notes);
          renderNotes();
        });
        card.appendChild(del);

        listEl.appendChild(card);
      });
    };

    var compressImage = function (file) {
      return new Promise(function (resolve, reject) {
        if (!file || !/^image\//.test(file.type)) return reject(new Error('이미지 파일이 아니다.'));
        if (file.size > 15 * 1024 * 1024) return reject(new Error('사진이 너무 크다. 15MB 이하로.'));
        var reader = new FileReader();
        reader.onerror = function () { reject(new Error('사진을 읽지 못했다.')); };
        reader.onload = function () {
          var img = new Image();
          img.onerror = function () { reject(new Error('사진을 열지 못했다.')); };
          img.onload = function () {
            var max = 1200;
            var scale = Math.min(1, max / Math.max(img.width, img.height));
            var canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(img.width * scale));
            canvas.height = Math.max(1, Math.round(img.height * scale));
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            try {
              resolve(canvas.toDataURL('image/jpeg', 0.78));
            } catch (err) {
              reject(new Error('사진을 저장용으로 바꾸지 못했다.'));
            }
          };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      });
    };

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var title = titleEl ? titleEl.value.trim() : '';
      var text = textEl ? textEl.value.trim() : '';
      if (!title && !text) {
        setMsg('제목이나 메모를 한 줄 적어줘.');
        return;
      }
      if (notes.length >= MAX_NOTES) {
        setMsg('기록은 최대 ' + MAX_NOTES + '개까지 저장된다. 하나 지우고 다시.');
        return;
      }

      var file = photoEl && photoEl.files && photoEl.files[0];
      var done = function (photo) {
        notes.unshift({
          id: 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          date: dateEl ? dateEl.value : '',
          title: title || '제목 없음',
          text: text,
          photo: photo || null
        });
        var ok = store(KEY.notes, notes);
        if (!ok) {
          notes.shift();
          setMsg('저장 공간이 부족하다. 사진을 빼고 다시 시도해줘.');
          return;
        }
        renderNotes();
        form.reset();
        if (dateEl) dateEl.value = '2026-11-27';
        setMsg('기록을 저장했다.');
      };

      if (file) {
        compressImage(file).then(done).catch(function (err) {
          setMsg(err && err.message ? err.message : '사진을 처리하지 못했다.');
        });
      } else {
        done(null);
      }
    });

    renderNotes();
  }

})();

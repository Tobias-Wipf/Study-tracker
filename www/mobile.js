// ============================================================
// Mobile UI — iOS-style native app layout
// Loaded after app.js, reuses all data functions and helpers
// ============================================================

var mobileTab = "home";
var mobileSubjectView = null;
var isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
var isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream;
var isIOSSafari = isIOS && !isStandalone;

// Prevent iOS standalone from opening links in Safari
if (isStandalone) {
    document.addEventListener('click', function(e) {
        var a = e.target.closest('a');
        if (a && a.href && a.target !== '_blank' && a.origin === location.origin) {
            e.preventDefault();
            if (a.href !== location.href) window.location = a.href;
        }
    });
}

// ---- iOS PWA Install Guide ----
var iosInstallLang = 'de';
var iosInstallStrings = {
    de: {
        subtitle: 'F\u00fcr das beste Erlebnis, installiere Studytracker als App auf deinem Home-Bildschirm.',
        s1title: 'Tippe auf die drei Punkte',
        s1desc: 'Unten rechts in der Safari-Leiste (\u2026)',
        s2title: 'Tippe auf das Teilen-Symbol',
        s2desc: 'Das Symbol findest du im ge\u00f6ffneten Men\u00fc',
        s3title: 'Scrolle und tippe \u201eZum Home-Bildschirm\u201c',
        s3desc: 'Die Option erscheint weiter unten im Men\u00fc',
        s4title: 'Tippe \u201eHinzuf\u00fcgen\u201c',
        s4desc: 'Die App erscheint auf deinem Home-Bildschirm',
        langBtn: 'EN'
    },
    en: {
        subtitle: 'For the best experience, install Studytracker as an app on your home screen.',
        s1title: 'Tap the three dots',
        s1desc: 'Bottom right in the Safari toolbar (\u2026)',
        s2title: 'Tap the Share icon',
        s2desc: 'You\u2019ll find it in the opened menu',
        s3title: 'Scroll and tap \u201cAdd to Home Screen\u201d',
        s3desc: 'The option appears further down in the menu',
        s4title: 'Tap \u201cAdd\u201d',
        s4desc: 'The app will appear on your home screen',
        langBtn: 'DE'
    }
};

function showIOSInstallGuide() {
    var view = document.getElementById("mobile-view");
    var tabBar = document.getElementById("mobile-tab-bar");
    if (tabBar) tabBar.style.display = "none";
    if (!view) return;

    // Force dark background everywhere (prevent white bar on iOS)
    document.documentElement.style.cssText = 'background:#0f0f0f !important';
    document.body.style.cssText += ';background:#0f0f0f !important';
    view.style.background = '#0f0f0f';
    var mobileApp = document.getElementById('mobile-app');
    if (mobileApp) mobileApp.style.background = '#0f0f0f';
    // Update theme-color meta tag
    var themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.content = '#0f0f0f';
    else { themeMeta = document.createElement('meta'); themeMeta.name = 'theme-color'; themeMeta.content = '#0f0f0f'; document.head.appendChild(themeMeta); }

    var t = iosInstallStrings[iosInstallLang];

    var h = '<div class="m-install-guide">';

    // Language toggle
    h += '<button class="m-install-lang-btn" id="ios-install-lang">' + t.langBtn + '</button>';

    h += '<div class="m-install-icon">';
    h += '<img src="icon-192.png" alt="Studytracker" style="width:80px;height:80px;border-radius:18px;">';
    h += '</div>';
    h += '<h1 class="m-install-title">Studytracker</h1>';
    h += '<p class="m-install-subtitle">' + t.subtitle + '</p>';

    h += '<div class="m-install-steps">';

    // Step 1
    h += '<div class="m-install-step">';
    h += '<div class="m-install-step-num">1</div>';
    h += '<div class="m-install-step-content">';
    h += '<div class="m-install-step-title">' + t.s1title + '</div>';
    h += '<div class="m-install-step-desc">' + t.s1desc + '</div>';
    h += '<div class="m-install-step-icon">';
    h += '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>';
    h += '</div>';
    h += '</div></div>';

    // Step 2
    h += '<div class="m-install-step">';
    h += '<div class="m-install-step-num">2</div>';
    h += '<div class="m-install-step-content">';
    h += '<div class="m-install-step-title">' + t.s2title + '</div>';
    h += '<div class="m-install-step-desc">' + t.s2desc + '</div>';
    h += '<div class="m-install-step-icon">';
    h += '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>';
    h += '</div>';
    h += '</div></div>';

    // Step 3
    h += '<div class="m-install-step">';
    h += '<div class="m-install-step-num">3</div>';
    h += '<div class="m-install-step-content">';
    h += '<div class="m-install-step-title">' + t.s3title + '</div>';
    h += '<div class="m-install-step-desc">' + t.s3desc + '</div>';
    h += '<div class="m-install-step-icon">';
    h += '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>';
    h += '</div>';
    h += '</div></div>';

    // Step 4
    h += '<div class="m-install-step">';
    h += '<div class="m-install-step-num">4</div>';
    h += '<div class="m-install-step-content">';
    h += '<div class="m-install-step-title">' + t.s4title + '</div>';
    h += '<div class="m-install-step-desc">' + t.s4desc + '</div>';
    h += '<div class="m-install-step-icon">\u2705</div>';
    h += '</div></div>';

    h += '</div>';

    // Arrow pointing down-right to three dots button
    h += '<div class="m-install-arrow">';
    h += '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00b87a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>';
    h += '</div>';

    h += '</div>';

    view.innerHTML = h;

    // Language toggle handler
    document.getElementById('ios-install-lang').onclick = function() {
        iosInstallLang = iosInstallLang === 'de' ? 'en' : 'de';
        showIOSInstallGuide();
    };
}


// ---- SVG Icons for Tab Bar ----
var M_ICONS = {
    home: '<svg viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z"/></svg>',
    subjects: '<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    todo: '<svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    settings: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    back: '<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>'
};

// ---- Tab Bar ----
function renderMobileTabBar() {
    var bar = document.getElementById("mobile-tab-bar");
    if (!bar) return;
    var tabs = [
        { id: "home", icon: M_ICONS.home, label: t("overview") },
        { id: "subjects", icon: M_ICONS.subjects, label: t("subjects") },
        { id: "todo", icon: M_ICONS.todo, label: t("todo") },
        { id: "settings", icon: M_ICONS.settings, label: t("settings") }
    ];
    var h = "";
    tabs.forEach(function(tab) {
        h += '<button class="m-tab-btn' + (mobileTab === tab.id ? ' m-tab-active' : '') + '" data-mtab="' + tab.id + '">';
        h += tab.icon;
        h += '<span>' + tab.label + '</span>';
        h += '</button>';
    });
    bar.innerHTML = h;
    bar.querySelectorAll(".m-tab-btn").forEach(function(btn) {
        btn.onclick = function() {
            mobileTab = btn.dataset.mtab;
            mobileSubjectView = null;
            renderMobileAll();
        };
    });
}

// ---- Main Router ----
function renderMobileAll() {
    // Block iOS Safari — require PWA install
    if (isIOSSafari) {
        showIOSInstallGuide();
        return;
    }

    renderMobileTabBar();
    var view = document.getElementById("mobile-view");
    if (!view) return;

    switch (mobileTab) {
        case "home": renderMobileHome(view); break;
        case "subjects":
            if (mobileSubjectView) renderMobileSubjectDetail(view, mobileSubjectView);
            else renderMobileSubjects(view);
            break;
        case "todo": renderMobileTodo(view); break;
        case "settings": renderMobileSettings(view); break;
    }
}

// ---- HOME ----
function renderMobileHome(view) {
    var subjects = loadSubjects();
    var data = loadStatuses();
    var user = currentUser;

    var h = '<div class="m-header">';
    h += '<div><div class="m-header-title">' + t("overview") + '</div>';
    if (user) h += '<div class="m-header-subtitle">' + esc(user.displayName || user.email) + '</div>';
    h += '</div></div>';

    // Overall progress ring
    var totalPct = 0, count = 0;
    subjects.forEach(function(s) {
        if (s.topics.length && s.categories.length) {
            totalPct += calcSubjPct(data, s);
            count++;
        }
    });
    var avgPct = count ? totalPct / count : 0;
    var pctInt = Math.round(avgPct * 100);
    var circumference = 2 * Math.PI * 42;
    var offset = circumference - (avgPct * circumference);

    h += '<div class="m-card" style="text-align:center">';
    h += '<svg class="m-progress-ring" viewBox="0 0 100 100">';
    h += '<circle class="ring-bg" cx="50" cy="50" r="42"/>';
    h += '<circle class="ring-fill" cx="50" cy="50" r="42" stroke-dasharray="' + circumference + '" stroke-dashoffset="' + offset + '"/>';
    h += '<text class="m-ring-text" x="50" y="50">' + pctInt + '%</text>';
    h += '</svg>';
    h += '<div style="font-size:.85rem;color:var(--hsg-text-secondary)">' + t("total") + ' ' + t("progress") + '</div>';
    h += '</div>';

    // Daily goal
    var goal = loadDailyGoal();
    var log = loadStudyLog();
    var todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    var todayCount = log.filter(function(e) { return e.ts >= todayStart.getTime(); }).length;
    var goalPct = Math.min(todayCount / (goal.target || 5), 1);
    var goalCirc = 2 * Math.PI * 22;
    var goalOffset = goalCirc - (goalPct * goalCirc);

    h += '<div class="m-card">';
    h += '<div class="m-card-title">' + t("daily.goal") + '</div>';
    h += '<div class="m-goal-card">';
    h += '<svg class="m-goal-ring" viewBox="0 0 56 56">';
    h += '<circle class="ring-bg" cx="28" cy="28" r="22"/>';
    h += '<circle class="ring-fill" cx="28" cy="28" r="22" stroke-dasharray="' + goalCirc + '" stroke-dashoffset="' + goalOffset + '"/>';
    h += '<text class="m-goal-text" x="28" y="28">' + todayCount + '</text>';
    h += '</svg>';
    h += '<div class="m-goal-info">';
    h += '<div class="m-goal-info-title">' + todayCount + ' / ' + (goal.target || 5) + ' ' + t("completed.today") + '</div>';
    if (goalPct >= 1) h += '<div class="m-goal-info-sub" style="color:var(--hsg-green)">' + t("goal.reached") + '</div>';
    h += '</div></div></div>';

    // Subject cards
    if (subjects.length) {
        h += '<div class="m-card-title">' + t("subjects") + '</div>';
        subjects.forEach(function(s) {
            var pct = calcSubjPct(data, s);
            var pctR = Math.round(pct * 100);
            var barCl = pct >= 0.75 ? "var(--hsg-green)" : pct >= 0.25 ? "#d4a843" : "var(--hsg-danger)";
            var done = 0, total = s.topics.length;
            s.topics.forEach(function(topic, ti) {
                if (calcTopicPct(data, s.id, ti, s.categories) >= 1) done++;
            });
            h += '<div class="m-subj-card" data-sid="' + s.id + '">';
            h += '<div class="m-subj-info">';
            h += '<div class="m-subj-name">' + esc(s.name) + '</div>';
            h += '<div class="m-subj-meta">' + done + '/' + total + ' ' + t("topics") + '</div>';
            if (s.examDate) {
                var ct = countdownText(s.examDate);
                var cc = countdownCls(s.examDate);
                if (ct) h += '<span class="m-subj-exam ' + cc + '">' + ct + '</span>';
            }
            h += '<div class="m-subj-bar"><div class="m-subj-bar-fill" style="width:' + pctR + '%;background:' + barCl + '"></div></div>';
            h += '</div>';
            h += '<div class="m-subj-pct">' + pctR + '%</div>';
            h += '</div>';
        });
    } else {
        h += '<div class="m-empty">';
        h += '<div class="m-empty-icon">\ud83d\udcda</div>';
        h += '<div class="m-empty-text">' + t("welcome.text") + '</div>';
        h += '</div>';
    }

    view.innerHTML = h;
    view.scrollTop = 0;

    // Attach subject card taps
    view.querySelectorAll(".m-subj-card").forEach(function(card) {
        card.onclick = function() {
            mobileTab = "subjects";
            mobileSubjectView = card.dataset.sid;
            renderMobileAll();
        };
    });
}

// ---- SUBJECTS LIST ----
function renderMobileSubjects(view) {
    var subjects = loadSubjects();
    var data = loadStatuses();

    var h = '<div class="m-header">';
    h += '<div class="m-header-title">' + t("subjects") + '</div>';
    h += '</div>';

    if (subjects.length) {
        subjects.forEach(function(s) {
            var pct = calcSubjPct(data, s);
            var pctR = Math.round(pct * 100);
            var barCl = pct >= 0.75 ? "var(--hsg-green)" : pct >= 0.25 ? "#d4a843" : "var(--hsg-danger)";
            var done = 0;
            s.topics.forEach(function(topic, ti) {
                if (calcTopicPct(data, s.id, ti, s.categories) >= 1) done++;
            });
            h += '<div class="m-subj-card" data-sid="' + s.id + '">';
            h += '<div class="m-subj-info">';
            h += '<div class="m-subj-name">' + esc(s.name) + '</div>';
            h += '<div class="m-subj-meta">' + done + '/' + s.topics.length + ' ' + t("topics");
            if (s.examDate) {
                var ct = countdownText(s.examDate);
                if (ct) h += ' \u2022 ' + ct;
            }
            h += '</div>';
            h += '<div class="m-subj-bar"><div class="m-subj-bar-fill" style="width:' + pctR + '%;background:' + barCl + '"></div></div>';
            h += '</div>';
            h += '<div class="m-subj-pct">' + pctR + '%</div>';
            h += '</div>';
        });
    } else {
        h += '<div class="m-empty">';
        h += '<div class="m-empty-icon">\ud83d\udcda</div>';
        h += '<div class="m-empty-text">' + t("welcome.text") + '</div>';
        h += '</div>';
    }

    h += '<button class="m-fab" onclick="showAddSubjectModal()">+</button>';

    view.innerHTML = h;
    view.scrollTop = 0;

    view.querySelectorAll(".m-subj-card").forEach(function(card) {
        card.onclick = function() {
            mobileSubjectView = card.dataset.sid;
            renderMobileAll();
        };
    });
}

// ---- SUBJECT DETAIL ----
function renderMobileSubjectDetail(view, subjectId) {
    var subjects = loadSubjects();
    var subj = subjects.find(function(s) { return s.id === subjectId; });
    if (!subj) { mobileSubjectView = null; renderMobileSubjects(view); return; }

    var data = loadStatuses();
    var pct = calcSubjPct(data, subj);
    var pctR = Math.round(pct * 100);

    var h = '<div class="m-detail m-slide-in">';

    // Header
    h += '<div class="m-detail-header">';
    h += '<button class="m-back-btn" id="m-back">' + M_ICONS.back + ' ' + t("subjects") + '</button>';
    h += '<div class="m-detail-title">' + esc(subj.name) + '</div>';
    h += '</div>';

    // Body
    h += '<div class="m-detail-body">';

    // Progress bar
    h += '<div class="m-detail-progress"><div class="m-detail-progress-fill" style="width:' + pctR + '%"></div></div>';

    // Exam
    if (subj.examDate) {
        var ct = countdownText(subj.examDate);
        var cc = countdownCls(subj.examDate);
        if (ct) h += '<div style="margin-bottom:16px"><span class="m-subj-exam ' + cc + '">' + t("exam") + ': ' + ct + ' (' + subj.examDate + ')</span></div>';
    }

    // Stats
    var doneCount = 0, progCount = 0;
    subj.topics.forEach(function(topic, ti) {
        var tp = calcTopicPct(data, subj.id, ti, subj.categories);
        if (tp >= 1) doneCount++;
        else if (tp > 0) progCount++;
    });
    h += '<div class="m-stats-row">';
    h += '<div class="m-stat-card"><div class="m-stat-num" style="color:var(--hsg-green)">' + doneCount + '</div><div class="m-stat-label">' + t("done") + '</div></div>';
    h += '<div class="m-stat-card"><div class="m-stat-num" style="color:#d4a843">' + progCount + '</div><div class="m-stat-label">' + t("in.progress") + '</div></div>';
    h += '<div class="m-stat-card"><div class="m-stat-num">' + (subj.topics.length - doneCount - progCount) + '</div><div class="m-stat-label">' + t("not.started") + '</div></div>';
    h += '<div class="m-stat-card"><div class="m-stat-num" style="color:var(--hsg-green)">' + pctR + '%</div><div class="m-stat-label">' + t("total") + '</div></div>';
    h += '</div>';

    // Topics
    if (!subj.topics.length) {
        h += '<div class="m-empty"><div class="m-empty-text">' + t("no.topics") + '</div></div>';
    }

    subj.topics.forEach(function(topic, ti) {
        var topicPct = calcTopicPct(data, subj.id, ti, subj.categories);
        h += '<div class="m-topic">';
        h += '<div class="m-topic-header">';
        h += '<div class="m-topic-name">' + esc(topic) + '</div>';
        h += '<div class="m-topic-pct">' + Math.round(topicPct * 100) + '%</div>';
        h += '</div>';
        h += '<div class="m-topic-chips">';
        subj.categories.forEach(function(cat, ci) {
            var st = getStatus(data, subj.id, ti, cat);
            var activeClass = st !== "none" ? " active-" + st : "";
            h += '<div class="m-status-chip' + activeClass + '" data-sid="' + subj.id + '" data-ti="' + ti + '" data-cat="' + esc(cat) + '">';
            h += '<span class="m-chip-dot s-' + st + '"></span>';
            h += esc(cat);
            h += '</div>';
        });
        h += '</div></div>';
    });

    h += '</div></div>'; // close body + detail

    view.innerHTML = h;

    // Back button
    var backBtn = document.getElementById("m-back");
    if (backBtn) {
        backBtn.onclick = function() {
            var detail = view.querySelector(".m-detail");
            if (detail) {
                detail.classList.remove("m-slide-in");
                detail.classList.add("m-slide-out");
                setTimeout(function() {
                    mobileSubjectView = null;
                    renderMobileAll();
                }, 250);
            }
        };
    }

    // Status chip — show dropdown
    view.querySelectorAll(".m-status-chip").forEach(function(chip) {
        chip.onclick = function(e) {
            e.stopPropagation();
            showMobileStatusDropdown(chip, subjectId, view);
        };
    });

    // Swipe-back from left edge
    var touchStartX = 0, touchStartY = 0;
    var detailBody = view.querySelector(".m-detail-body");
    if (detailBody) {
        detailBody.addEventListener("touchstart", function(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        detailBody.addEventListener("touchend", function(e) {
            var dx = e.changedTouches[0].clientX - touchStartX;
            var dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
            if (dx > 80 && touchStartX < 40 && dy < 100) {
                var detail = view.querySelector(".m-detail");
                if (detail) {
                    detail.classList.remove("m-slide-in");
                    detail.classList.add("m-slide-out");
                    setTimeout(function() {
                        mobileSubjectView = null;
                        renderMobileAll();
                    }, 250);
                }
            }
        }, { passive: true });
    }
}

// ---- TO-DO ----
var mTodoFilter = "open"; // "all" | "open" | "done"

function renderMobileTodo(view) {
    var todos = loadTodos();
    var subjects = loadSubjects();

    var h = '<div class="m-header">';
    h += '<div class="m-header-title">' + t("todo") + '</div>';
    h += '</div>';

    // Filters
    h += '<div class="m-todo-filters">';
    ["open", "done", "all"].forEach(function(f) {
        var label = f === "open" ? t("open.tasks") : f === "done" ? t("done") : t("all");
        var count = f === "open" ? todos.filter(function(t2) { return !t2.done; }).length :
                    f === "done" ? todos.filter(function(t2) { return t2.done; }).length : todos.length;
        h += '<button class="m-todo-filter' + (mTodoFilter === f ? ' active' : '') + '" data-filter="' + f + '">' + label + ' (' + count + ')</button>';
    });
    h += '</div>';

    // Filter todos
    var filtered = todos;
    if (mTodoFilter === "open") filtered = todos.filter(function(t2) { return !t2.done; });
    else if (mTodoFilter === "done") filtered = todos.filter(function(t2) { return t2.done; });

    // Sort: priority desc, then due date asc
    filtered.sort(function(a, b) {
        if (a.done !== b.done) return a.done ? 1 : -1;
        var pa = { high: 3, medium: 2, low: 1 };
        var av = pa[a.priority] || 0, bv = pa[b.priority] || 0;
        if (av !== bv) return bv - av;
        if (a.due && b.due) return a.due < b.due ? -1 : 1;
        if (a.due) return -1;
        if (b.due) return 1;
        return 0;
    });

    if (!filtered.length) {
        h += '<div class="m-empty"><div class="m-empty-icon">\u2705</div><div class="m-empty-text">' + t("no.todos") + '</div></div>';
    }

    filtered.forEach(function(todo) {
        var subj = subjects.find(function(s) { return s.id === todo.subject; });
        h += '<div class="m-todo-item" data-todo-id="' + todo.id + '">';
        h += '<div class="m-todo-check' + (todo.done ? ' checked' : '') + '" data-todo-id="' + todo.id + '">' + (todo.done ? '\u2713' : '') + '</div>';
        h += '<div class="m-todo-info">';
        h += '<div class="m-todo-title' + (todo.done ? ' done' : '') + '">' + esc(todo.text) + '</div>';
        h += '<div class="m-todo-meta">';
        if (todo.priority) h += '<span class="m-todo-badge prio-' + todo.priority + '">' + t(todo.priority) + '</span>';
        if (todo.due) h += '<span>' + todo.due + '</span>';
        if (subj) h += '<span>' + esc(subj.name) + '</span>';
        h += '</div></div></div>';
    });

    h += '<button class="m-fab" id="m-add-todo">+</button>';

    view.innerHTML = h;
    view.scrollTop = 0;

    // Filter clicks
    view.querySelectorAll(".m-todo-filter").forEach(function(btn) {
        btn.onclick = function() {
            mTodoFilter = btn.dataset.filter;
            renderMobileTodo(view);
        };
    });

    // Check/uncheck
    view.querySelectorAll(".m-todo-check").forEach(function(chk) {
        chk.onclick = function(e) {
            e.stopPropagation();
            var todos2 = loadTodos();
            var todo = todos2.find(function(t2) { return t2.id === chk.dataset.todoId; });
            if (todo) {
                todo.done = !todo.done;
                saveTodos(todos2);
                renderMobileTodo(view);
            }
        };
    });

    // Add todo
    var addBtn = document.getElementById("m-add-todo");
    if (addBtn) {
        addBtn.onclick = function() {
            if (typeof showAddTodoModal === "function") showAddTodoModal();
            else if (typeof openTodoModal === "function") openTodoModal();
        };
    }
}

// ---- SETTINGS ----
function renderMobileSettings(view) {
    var user = currentUser;
    var isDark = document.body.classList.contains("dark");
    var lang = APP_LANG;

    var h = '<div class="m-header">';
    h += '<div class="m-header-title">' + t("settings") + '</div>';
    h += '</div>';

    // Account
    if (user) {
        h += '<div class="m-card-title">' + t("account") + '</div>';
        h += '<div class="m-settings-group">';
        h += '<div class="m-settings-row"><span class="m-settings-label">' + esc(user.displayName || "User") + '</span><span class="m-settings-value">' + esc(user.email) + '</span></div>';
        h += '<div class="m-settings-row danger" id="m-logout"><span class="m-settings-label">' + t("logout") + '</span></div>';
        h += '</div>';
    }

    // Appearance
    h += '<div class="m-card-title">' + t("appearance") + '</div>';
    h += '<div class="m-settings-group">';
    h += '<div class="m-settings-row" id="m-dark-toggle"><span class="m-settings-label">' + t("dark.mode") + '</span><button class="m-toggle' + (isDark ? ' on' : '') + '"></button></div>';
    h += '<div class="m-settings-row" id="m-lang-toggle"><span class="m-settings-label">Language</span><span class="m-settings-value">' + (lang === "de" ? "Deutsch" : "English") + '</span></div>';
    var rc = loadRepCount();
    var repLabel = rc === 0 ? t("repetitions.off") : rc.toString();
    h += '<div class="m-settings-row" id="m-rep-toggle"><span class="m-settings-label">' + t("repetitions") + '</span><span class="m-settings-value">' + repLabel + '</span></div>';
    h += '</div>';

    // Data
    h += '<div class="m-card-title">' + t("data") + '</div>';
    h += '<div class="m-settings-group">';
    h += '<div class="m-settings-row" id="m-presets"><span class="m-settings-label">\ud83d\udcda ' + t("presets") + '</span></div>';
    h += '<div class="m-settings-row danger" id="m-reset"><span class="m-settings-label">' + t("reset.semester") + '</span></div>';
    h += '</div>';

    view.innerHTML = h;
    view.scrollTop = 0;

    // Dark mode toggle
    var darkRow = document.getElementById("m-dark-toggle");
    if (darkRow) {
        darkRow.onclick = function() {
            document.body.classList.toggle("dark");
            localStorage.setItem("lf_darkmode", document.body.classList.contains("dark"));
            renderMobileSettings(view);
        };
    }

    // Language toggle
    var langRow = document.getElementById("m-lang-toggle");
    if (langRow) {
        langRow.onclick = function() {
            APP_LANG = APP_LANG === "de" ? "en" : "de";
            localStorage.setItem("st_lang", APP_LANG);
            if (typeof applyLang === "function") applyLang(APP_LANG);
            renderMobileAll();
        };
    }

    // Repetitions toggle (cycle 0 → 1 → 2 → 3 → 0)
    var repRow = document.getElementById("m-rep-toggle");
    if (repRow) {
        repRow.onclick = function() {
            var cur = loadRepCount();
            saveRepCount(cur >= 3 ? 0 : cur + 1);
            renderMobileSettings(view);
        };
    }

    // Presets
    var presetsRow = document.getElementById("m-presets");
    if (presetsRow) presetsRow.onclick = function() { showPresetLibrary(); };

    // Reset
    var resetRow = document.getElementById("m-reset");
    if (resetRow) resetRow.onclick = function() { if (typeof resetSemester === "function") resetSemester(); };

    // Logout
    var logoutRow = document.getElementById("m-logout");
    if (logoutRow) logoutRow.onclick = function() { auth.signOut(); };
}

// ---- Mobile Status Dropdown ----
function showMobileStatusDropdown(chip, subjectId, view) {
    // Remove any existing dropdown
    closeMobileDropdown();

    var sid = chip.dataset.sid;
    var ti = Number(chip.dataset.ti);
    var cat = chip.dataset.cat;
    var d = loadStatuses();
    var cur = getStatus(d, sid, ti, cat);

    var options = [
        { status: "done", label: t("done"), icon: "\u2713", color: "#00b87a" },
        { status: "progress", label: t("in.progress"), icon: "\u270F", color: "#d4a843" },
        { status: "review", label: t("review"), icon: "\u21BA", color: "#a78bfa" }
    ];
    var rn = loadRepCount();
    if (rn >= 1) options.push({ status: "rep1", label: t("rep1"), icon: "\u2781", color: "#2563eb" });
    if (rn >= 2) options.push({ status: "rep2", label: t("rep2"), icon: "\u2782", color: "#0ea5e9" });
    if (rn >= 3) options.push({ status: "rep3", label: t("rep3"), icon: "\u2783", color: "#06b6d4" });
    options.push({ status: "none", label: t("not.started"), icon: "\u2014", color: "#666" });

    // Backdrop
    var backdrop = document.createElement("div");
    backdrop.className = "m-dropdown-backdrop";
    backdrop.onclick = closeMobileDropdown;
    document.body.appendChild(backdrop);

    // Dropdown sheet
    var dd = document.createElement("div");
    dd.className = "m-dropdown-sheet";
    var title = document.createElement("div");
    title.className = "m-dropdown-title";
    title.textContent = cat;
    dd.appendChild(title);

    options.forEach(function(o) {
        var opt = document.createElement("div");
        opt.className = "m-dropdown-option" + (o.status === cur ? " m-dropdown-selected" : "");
        opt.innerHTML = '<span class="m-dropdown-icon" style="color:' + o.color + '">' + o.icon + '</span>' +
                        '<span class="m-dropdown-label">' + o.label + '</span>' +
                        (o.status === cur ? '<span class="m-dropdown-check">\u2713</span>' : '');
        opt.onclick = function() {
            var d2 = loadStatuses();
            var prev = getStatus(d2, sid, ti, cat);
            setStatus(d2, sid, ti, cat, o.status);
            saveStatuses(d2);
            if ((o.status === "done" || o.status === "rep1" || o.status === "rep2" || o.status === "rep3") && prev !== o.status) logCompletion(sid, ti, cat);
            closeMobileDropdown();
            renderMobileSubjectDetail(view, subjectId);
        };
        dd.appendChild(opt);
    });

    document.body.appendChild(dd);
    // Animate in
    requestAnimationFrame(function() { dd.classList.add("m-dropdown-visible"); });
}

function closeMobileDropdown() {
    var bd = document.querySelector(".m-dropdown-backdrop");
    var dd = document.querySelector(".m-dropdown-sheet");
    if (bd) bd.remove();
    if (dd) dd.remove();
}

// ============================================================
// Lernfortschritt Tracker — HSG
// ============================================================

// ---- DEBUG: Date override (remove for production) ----
(function(){
    var _OrigDate=Date;
    var _offset=0;
    window.__setDebugDate=function(isoStr){
        if(!isoStr){_offset=0;return;}
        var fake=new _OrigDate(isoStr+"T12:00:00");
        var now=new _OrigDate();
        _offset=fake.getTime()-now.getTime();
    };
    window.Date=function(){
        if(arguments.length===0) return new _OrigDate(_OrigDate.now()+_offset);
        if(arguments.length===1) return new _OrigDate(arguments[0]);
        return new _OrigDate(arguments[0],arguments[1],arguments[2]||1,arguments[3]||0,arguments[4]||0,arguments[5]||0,arguments[6]||0);
    };
    window.Date.prototype=_OrigDate.prototype;
    window.Date.now=function(){return _OrigDate.now()+_offset;};
    window.Date.parse=_OrigDate.parse;
    window.Date.UTC=_OrigDate.UTC;
})();

// ---- Firebase Init ----
firebase.initializeApp({
    apiKey: "AIzaSyDAJ2aFNR09A3eK3amQjiAtfBfvG2NWxRI",
    authDomain: "study-tracker.org",
    projectId: "studytracker-deb23",
    storageBucket: "studytracker-deb23.firebasestorage.app",
    messagingSenderId: "215256055720",
    appId: "1:215256055720:web:ae3bdce0137d128d14279d"
});
var appCheck = firebase.appCheck();
appCheck.activate('6LciAo8sAAAAAGN4nmyjp-w0Zbqb4w1Qe0WMapui', true);
var auth = firebase.auth();
var db = firebase.firestore();
var currentUser = null;
var studyNextDismissed = false;
var isDemoMode = false;

// ---- Mobile Detection ----
var _isMobile = null;
function isMobile() {
    if (_isMobile !== null) return _isMobile;
    var mq = window.matchMedia("(max-width: 640px)");
    _isMobile = mq.matches;
    mq.addEventListener("change", function(e) {
        var wasMobile = _isMobile;
        _isMobile = e.matches;
        if (wasMobile !== _isMobile) renderAll();
    });
    return _isMobile;
}

// ---- App Translations ----
var APP_LANG = localStorage.getItem('st_lang') || 'de';
var APP_T = {
    de: {
        'overview': '\u00dcbersicht',
        'progress': 'Fortschritt',
        'progress.over.time': 'Fortschritt \u00fcber Zeit',
        'total.progress': 'GESAMT FORTSCHRITT',
        'total': 'Gesamt',
        'open': 'Offen',
        'stats.title': 'Abgeschlossene Themen',
        'subject': 'Fach',
        'subjects': 'F\u00e4cher',
        'topic': 'Thema',
        'topics': 'Themen',
        'exam': 'Pr\u00fcfung',
        'categories': 'Kategorien',
        'add.topic': '+ Thema hinzuf\u00fcgen',
        'add.category': '+ Kategorie',
        'add.subject': '+ Fach hinzuf\u00fcgen',
        'delete.subject': 'Fach l\u00f6schen',
        'no.topics': 'Noch keine Themen.',
        'no.data': 'Noch keine Daten vorhanden.',
        'no.data.hint': 'Noch keine Daten vorhanden. Markiere Themen als erledigt, um den Fortschritt zu sehen.',
        'done': 'Fertig',
        'in.progress': 'In Arbeit',
        'review': 'Wiederholen',
        'not.started': 'Noch nicht begonnen',
        'rep1': '1. Repetition',
        'rep2': '2. Repetition',
        'all.done': 'Alle: Fertig',
        'all.progress': 'Alle: In Arbeit',
        'all.review': 'Alles: Wiederholen',
        'all.rep1': 'Alle: 1. Repetition',
        'all.rep2': 'Alle: 2. Repetition',
        'all.reset': 'Alle zur\u00fccksetzen',
        'topic.all.done': 'Alles: Fertig',
        'topic.all.progress': 'Alles: In Arbeit',
        'topic.all.review': 'Alles: Wiederholen',
        'topic.all.rep1': 'Alles: 1. Repetition',
        'topic.all.rep2': 'Alles: 2. Repetition',
        'topic.reset': 'Zur\u00fccksetzen',
        'edit': 'Bearbeiten',
        'drag.hint': 'Ziehen zum Verschieben',
        'bulk.hint': 'Klicken: alle setzen',
        'cat.drag.hint': 'Klicken: alle setzen | Ziehen: Reihenfolge \u00e4ndern',
        'topic.bulk.hint': 'Ganzes Thema setzen',
        'study.next': 'Jetzt lernen',
        'study.next.desc': 'hat den niedrigsten Fortschritt.',
        'study.next.dismiss': 'Sp\u00e4ter',
        'study.next.go': 'Jetzt lernen \u2192',
        'logged.in.as': 'Angemeldet als',
        'presets': 'Vorlagen',
        'dark.mode': 'Dark Mode',
        'login': 'Anmelden \u2601',
        'logout': 'Abmelden',
        'daily.goal': 'Tagesziel',
        'daily.goal.set': 'Ziel setzen',
        'completed.today': 'heute geschafft',
        'goal.reached': 'Tagesziel erreicht!',
        'open.tasks': 'Offene Aufgaben',
        'todo': 'To-Do',
        'todos': 'Aufgaben',
        'add.todo': '+ Aufgabe',
        'no.todos': 'Keine offenen Aufgaben.',
        'priority': 'Priorit\u00e4t',
        'due': 'F\u00e4llig',
        'high': 'Hoch',
        'medium': 'Mittel',
        'low': 'Niedrig',
        'reset.semester': 'Semester zur\u00fccksetzen',
        'preset.library': 'Vorlage laden',
        'imported': 'importiert',
        'days': 'Tage',
        'tomorrow': 'Morgen',
        'today': 'Heute',
        'yesterday': 'Gestern',
        'overdue': '\u00dcberf\u00e4llig',
        'planner': 'Wochenplaner',
        'lang.btn': '\ud83c\udf10 EN',
        'welcome.title': 'Willkommen im Lerntracker',
        'welcome.text': 'F\u00fcge dein erstes Fach hinzu oder lade eine fertige Vorlage.',
        'onboarding.title': 'Willkommen bei Studytracker!',
        'onboarding.subtitle': 'Dein pers\u00f6nlicher Lernfortschritt-Tracker \u2014 einfach, \u00fcbersichtlich und auf all deinen Ger\u00e4ten synchronisiert.',
        'onboarding.track': 'Fortschritt tracken',
        'onboarding.track.desc': 'Behalte den \u00dcberblick \u00fcber alle F\u00e4cher, Themen und Lernkategorien. Markiere Themen als \u201eFertig\u201c, \u201eIn Arbeit\u201c oder \u201eOffen\u201c.',
        'onboarding.todo': 'To-Do Liste',
        'onboarding.todo.desc': 'Erstelle Aufgaben mit Priorit\u00e4t, F\u00e4lligkeitsdatum und Fach-Zuordnung \u2014 alles an einem Ort.',
        'onboarding.sync': 'Cloud-Sync',
        'onboarding.sync.desc': 'Deine Daten werden automatisch synchronisiert \u2014 auf jedem Ger\u00e4t, immer aktuell.',
        'onboarding.goal': 'Tagesziel',
        'onboarding.goal.desc': 'Setze ein t\u00e4gliches Lernziel und verfolge deinen Fortschritt mit dem Daily Dopamine Boost.',
        'onboarding.how': 'Wie m\u00f6chtest du starten?',
        'onboarding.add': 'Fach hinzuf\u00fcgen',
        'onboarding.add.desc': 'Erstelle deine F\u00e4cher manuell \u2014 du bestimmst Name, Kategorien und Themen selbst. Ideal wenn du ein individuelles Setup brauchst.',
        'onboarding.preset': 'Vorlage laden',
        'onboarding.preset.desc': 'Lade eine fertige Vorlage von anderen Studierenden \u2014 mit allen F\u00e4chern, Themen und Kategorien. In Sekunden startklar.',
        'settings': 'Einstellungen',
        'account': 'Konto',
        'appearance': 'Darstellung',
        'data': 'Daten',
        'all': 'Alle',
        'sort.by': 'Sortieren nach:',
        'add.task': '+ Aufgabe',
        'day.sun': 'Sonntag', 'day.mon': 'Montag', 'day.tue': 'Dienstag', 'day.wed': 'Mittwoch', 'day.thu': 'Donnerstag', 'day.fri': 'Freitag', 'day.sat': 'Samstag',
        'mon.jan': 'Januar', 'mon.feb': 'Februar', 'mon.mar': 'M\u00e4rz', 'mon.apr': 'April', 'mon.may': 'Mai', 'mon.jun': 'Juni', 'mon.jul': 'Juli', 'mon.aug': 'August', 'mon.sep': 'September', 'mon.oct': 'Oktober', 'mon.nov': 'November', 'mon.dec': 'Dezember',
        'prio.select': 'Priorit\u00e4t w\u00e4hlen\u2026',
        'prio.high': '\ud83d\udd34 Hoch',
        'prio.medium': '\ud83d\udfe1 Mittel',
        'prio.low': '\ud83d\udfe2 Niedrig'
    },
    en: {
        'overview': 'Overview',
        'progress': 'Progress',
        'progress.over.time': 'Progress over time',
        'total.progress': 'TOTAL PROGRESS',
        'total': 'Total',
        'open': 'Open',
        'stats.title': 'Completed Topics',
        'subject': 'Subject',
        'subjects': 'Subjects',
        'topic': 'Topic',
        'topics': 'Topics',
        'exam': 'Exam',
        'categories': 'Categories',
        'add.topic': '+ Add topic',
        'add.category': '+ Category',
        'add.subject': '+ Add subject',
        'delete.subject': 'Delete subject',
        'no.topics': 'No topics yet.',
        'no.data': 'No data available yet.',
        'no.data.hint': 'No data available yet. Mark topics as done to see progress.',
        'done': 'Done',
        'in.progress': 'In progress',
        'review': 'Review',
        'not.started': 'Not started',
        'rep1': '1st Repetition',
        'rep2': '2nd Repetition',
        'all.done': 'All: Done',
        'all.progress': 'All: In progress',
        'all.review': 'All: Review',
        'all.rep1': 'All: 1st Repetition',
        'all.rep2': 'All: 2nd Repetition',
        'all.reset': 'Reset all',
        'topic.all.done': 'All: Done',
        'topic.all.progress': 'All: In progress',
        'topic.all.review': 'All: Review',
        'topic.all.rep1': 'All: 1st Repetition',
        'topic.all.rep2': 'All: 2nd Repetition',
        'topic.reset': 'Reset',
        'edit': 'Edit',
        'drag.hint': 'Drag to reorder',
        'bulk.hint': 'Click: set all',
        'cat.drag.hint': 'Click: set all | Drag: reorder',
        'topic.bulk.hint': 'Set entire topic',
        'study.next': 'Study now',
        'study.next.desc': 'has the lowest progress.',
        'study.next.dismiss': 'Later',
        'study.next.go': 'Study now \u2192',
        'logged.in.as': 'Logged in as',
        'presets': 'Templates',
        'dark.mode': 'Dark Mode',
        'login': 'Sign in \u2601',
        'logout': 'Sign out',
        'daily.goal': 'Daily goal',
        'daily.goal.set': 'Set goal',
        'completed.today': 'completed today',
        'goal.reached': 'Daily goal reached!',
        'open.tasks': 'Open tasks',
        'todo': 'To-Do',
        'todos': 'Tasks',
        'add.todo': '+ Task',
        'no.todos': 'No open tasks.',
        'priority': 'Priority',
        'due': 'Due',
        'high': 'High',
        'medium': 'Medium',
        'low': 'Low',
        'reset.semester': 'Reset semester',
        'preset.library': 'Load template',
        'imported': 'imported',
        'days': 'days',
        'tomorrow': 'Tomorrow',
        'today': 'Today',
        'yesterday': 'Yesterday',
        'overdue': 'Overdue',
        'planner': 'Weekly planner',
        'lang.btn': '\ud83c\udf10 DE',
        'welcome.title': 'Welcome to Studytracker',
        'welcome.text': 'Add your first subject or load a ready-made template.',
        'onboarding.title': 'Welcome to Studytracker!',
        'onboarding.subtitle': 'Your personal study progress tracker \u2014 simple, clear, and synced across all your devices.',
        'onboarding.track': 'Track progress',
        'onboarding.track.desc': 'Keep an overview of all subjects, topics and study categories. Mark topics as \u201cDone\u201d, \u201cIn progress\u201d or \u201cOpen\u201d.',
        'onboarding.todo': 'To-Do List',
        'onboarding.todo.desc': 'Create tasks with priority, due date and subject assignment \u2014 all in one place.',
        'onboarding.sync': 'Cloud Sync',
        'onboarding.sync.desc': 'Your data is automatically synced \u2014 on every device, always up to date.',
        'onboarding.goal': 'Daily Goal',
        'onboarding.goal.desc': 'Set a daily study goal and track your progress with the Daily Dopamine Boost.',
        'onboarding.how': 'How would you like to start?',
        'onboarding.add': 'Add subject',
        'onboarding.add.desc': 'Create your subjects manually \u2014 you decide the name, categories and topics. Ideal for a custom setup.',
        'onboarding.preset': 'Load template',
        'onboarding.preset.desc': 'Load a ready-made template from other students \u2014 with all subjects, topics and categories. Ready in seconds.',
        'settings': 'Settings',
        'account': 'Account',
        'appearance': 'Appearance',
        'data': 'Data',
        'all': 'All',
        'sort.by': 'Sort by:',
        'add.task': '+ Task',
        'day.sun': 'Sunday', 'day.mon': 'Monday', 'day.tue': 'Tuesday', 'day.wed': 'Wednesday', 'day.thu': 'Thursday', 'day.fri': 'Friday', 'day.sat': 'Saturday',
        'mon.jan': 'January', 'mon.feb': 'February', 'mon.mar': 'March', 'mon.apr': 'April', 'mon.may': 'May', 'mon.jun': 'June', 'mon.jul': 'July', 'mon.aug': 'August', 'mon.sep': 'September', 'mon.oct': 'October', 'mon.nov': 'November', 'mon.dec': 'December',
        'prio.select': 'Select priority\u2026',
        'prio.high': '\ud83d\udd34 High',
        'prio.medium': '\ud83d\udfe1 Medium',
        'prio.low': '\ud83d\udfe2 Low'
    }
};
function t(key) { return (APP_T[APP_LANG] && APP_T[APP_LANG][key]) || key; }

// ---- Cloud Sync ----
var syncTimer = null;
var SYNC_DELAY = 1500; // debounce: wait 1.5s after last change before syncing

function setSyncStatus(state) {
    var el = document.getElementById("sync-status");
    if (!el) return;
    var online = navigator.onLine;
    var configs = {
        idle:    { text: online ? "\u2713 Online \u00b7 Synchronisiert" : "\u26a1 Offline", cls: online ? "synced" : "offline" },
        pending: { text: "\u25cf Nicht gespeichert", cls: "pending" },
        saving:  { text: "\u21bb Speichern\u2026",      cls: "saving" },
        saved:   { text: "\u2713 Gespeichert",      cls: "saved" },
        offline: { text: "\u26a1 Offline",          cls: "offline" },
        error:   { text: "\u26a0 Sync-Fehler",      cls: "error" }
    };
    var c = configs[state] || configs.idle;
    el.textContent = c.text;
    el.className = "sync-status sync-status--" + c.cls;
}

function scheduleSync() {
    if (!currentUser) return;
    setSyncStatus("pending");
    clearTimeout(syncTimer);
    syncTimer = setTimeout(pushToCloud, SYNC_DELAY);
}

function pushToCloud() {
    if (!currentUser) return;
    setSyncStatus("saving");
    var data = {
        subjects: loadSubjects(),
        statuses: loadStatuses(),
        notes: loadNotes(),
        todos: loadTodos(),
        log: loadStudyLog(),
        dailyGoal: loadDailyGoal(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    db.collection("users").doc(currentUser.uid).set(data, {merge:true})
      .then(function() {
          setSyncStatus("saved");
          setTimeout(function() { setSyncStatus("idle"); }, 2500);
      })
      .catch(function(err) {
          console.error("Sync error:", err);
          setSyncStatus(navigator.onLine ? "error" : "offline");
      });
}

window.addEventListener("online",  function() { setSyncStatus("idle"); if(currentUser) pushToCloud(); });
window.addEventListener("offline", function() { setSyncStatus("offline"); });

var isFirstLogin = false;
function pullFromCloud(callback) {
    if (!currentUser) { if(callback) callback(); return; }
    db.collection("users").doc(currentUser.uid).get().then(function(doc) {
        if (doc.exists) {
            var d = doc.data();
            if (d.subjects) localStorage.setItem("lf_subjects", JSON.stringify(d.subjects));
            if (d.statuses) localStorage.setItem("lf_statuses", JSON.stringify(d.statuses));
            if (d.notes) localStorage.setItem("lf_notes", JSON.stringify(d.notes));
            if (d.todos) localStorage.setItem("lf_todos", JSON.stringify(d.todos));
            if (d.log) localStorage.setItem("lf_studylog", JSON.stringify(d.log));
            if (d.dailyGoal) localStorage.setItem("lf_dailygoal", JSON.stringify(d.dailyGoal));
        } else {
            isFirstLogin = true;
            // Clear default subjects for fresh start
            localStorage.setItem("lf_subjects", JSON.stringify([]));
        }
        if (callback) callback();
    }).catch(function(err){ console.error("Pull error:", err); if(callback) callback(); });
}

// ---- Auth UI ----
function updateAuthUI() {
    var area = document.getElementById("auth-area");
    if (isDemoMode && !currentUser) {
        area.innerHTML = '<span class="auth-name">Demo-Modus</span>' +
            '<button class="header-btn auth-login-btn" id="demo-signin-btn" title="Anmelden">Anmelden</button>';
        document.getElementById("demo-signin-btn").onclick = function() {
            var provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider).catch(function(err) {
                if (err.code !== "auth/popup-closed-by-user") showToast("Anmeldung fehlgeschlagen: " + err.message);
            });
        };
        return;
    }
    if (currentUser) {
        var photo = currentUser.photoURL ? '<img class="auth-avatar" src="'+esc(currentUser.photoURL)+'" referrerpolicy="no-referrer">' : '';
        area.innerHTML = photo +
            '<span class="auth-name">' + esc(currentUser.displayName || currentUser.email) + '</span>' +
            '<button class="header-btn" id="logout-btn" title="Abmelden">Abmelden</button>';
        document.getElementById("logout-btn").onclick = function() {
            auth.signOut();
        };
    } else {
        area.innerHTML = '<button class="header-btn auth-login-btn" id="login-btn" title="Anmelden f\u00fcr ger\u00e4te\u00fcbergreifende Synchronisation">Anmelden \u2601</button>';
        document.getElementById("login-btn").onclick = function() {
            var provider = new firebase.auth.GoogleAuthProvider();
            var isCapacitor = window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();
            if (isCapacitor) {
                auth.signInWithRedirect(provider);
            } else {
                auth.signInWithPopup(provider).catch(function(err){
                    if (err.code !== "auth/popup-closed-by-user") showToast("Anmeldung fehlgeschlagen: " + err.message);
                });
            }
        };
    }
}

// ---- Demo Mode ----
function startDemoMode() {
    isDemoMode = true;
    // Save default subjects
    localStorage.setItem("lf_subjects", JSON.stringify(DEFAULT_SUBJECTS));
    // Generate realistic statuses (~40% done, 20% progress, 10% review, 30% none)
    var statuses = {};
    var rng = 1;
    DEFAULT_SUBJECTS.forEach(function(subj) {
        subj.topics.forEach(function(topic, ti) {
            subj.categories.forEach(function(cat, ci) {
                rng = (rng * 16807 + ti * 13 + ci * 7) % 2147483647;
                var r = (rng & 0xffff) / 0x10000;
                var st = "none";
                if (r < 0.40) st = "done";
                else if (r < 0.60) st = "progress";
                else if (r < 0.70) st = "review";
                statuses[subj.id + "." + ti + "." + cat] = st;
            });
        });
    });
    localStorage.setItem("lf_statuses", JSON.stringify(statuses));
    // Sample todos
    var now = new Date();
    var todos = [
        {id:"demo1", title:"Altklausur VWL durcharbeiten", priority:"hoch", due:new Date(now.getTime()+2*86400000).toISOString().slice(0,10), time:"", note:"", subjectId:"vwl", done:false, createdAt:now.toISOString(), completedAt:null},
        {id:"demo2", title:"Mathe \u00dcbungsserie 5 abgeben", priority:"hoch", due:new Date(now.getTime()+1*86400000).toISOString().slice(0,10), time:"14:00", note:"Abgabe per Studynet", subjectId:"mathe", done:false, createdAt:now.toISOString(), completedAt:null},
        {id:"demo3", title:"BWL Zusammenfassung Kapitel 3", priority:"mittel", due:new Date(now.getTime()+5*86400000).toISOString().slice(0,10), time:"", note:"", subjectId:"bwl", done:false, createdAt:now.toISOString(), completedAt:null},
        {id:"demo4", title:"Recht Vorlesung nachholen", priority:"niedrig", due:"", time:"", note:"", subjectId:"recht", done:false, createdAt:now.toISOString(), completedAt:null},
        {id:"demo5", title:"VWL Vorlesung Woche 2 nacharbeiten", priority:"mittel", due:new Date(now.getTime()-1*86400000).toISOString().slice(0,10), time:"", note:"", subjectId:"vwl", done:true, createdAt:now.toISOString(), completedAt:new Date(now.getTime()-1*86400000).toISOString()}
    ];
    localStorage.setItem("lf_todos", JSON.stringify(todos));
    // Sample study log (past 14 days of activity for charts)
    var log = [];
    var DAY = 86400000;
    for (var d = 13; d >= 0; d--) {
        var dayTs = now.getTime() - d * DAY + 36000000; // 10am each day
        // Vary activity per day (more on weekdays, less on weekends)
        var dayOfWeek = new Date(dayTs).getDay();
        var count = (dayOfWeek === 0 || dayOfWeek === 6) ? 1 : 2 + (d % 3);
        for (var c = 0; c < count; c++) {
            var si = (d + c) % DEFAULT_SUBJECTS.length;
            var subj = DEFAULT_SUBJECTS[si];
            log.push({subject: subj.id, topic: (d + c) % subj.topics.length, cat: subj.categories[c % subj.categories.length], ts: dayTs + c * 3600000});
        }
    }
    localStorage.setItem("lf_studylog", JSON.stringify(log));
    // Sample goals
    localStorage.setItem("lf_dailygoal", JSON.stringify({target:5}));
    localStorage.setItem("lf_weeklygoal", JSON.stringify({target:10}));
    // Show app
    var landing = document.getElementById("landing");
    var appWrapper = document.getElementById("app-wrapper");
    if (landing) landing.style.display = "none";
    if (appWrapper) appWrapper.style.display = "block";
    updateAuthUI();
    renderAll();
}

// Auth state listener
auth.onAuthStateChanged(function(user) {
    currentUser = user;
    var landing = document.getElementById("landing");
    var appWrapper = document.getElementById("app-wrapper");
    // Handle ?action=signin redirect from features/about pages
    var wantsSignin = new URLSearchParams(window.location.search).get("action") === "signin";
    if (wantsSignin) history.replaceState(null, "", window.location.pathname);
    if (user) {
        if (landing) landing.style.display = "none";
        if (appWrapper) appWrapper.style.display = "block";
        updateAuthUI();
        if (!wantsSignin) showToast(t('logged.in.as') + " " + (user.displayName || user.email));
        pullFromCloud(function() {
            if (isFirstLogin) { showOnboarding(); }
            else { renderAll(); }
        });
    } else {
        if (landing) landing.style.display = "block";
        if (appWrapper) appWrapper.style.display = "none";
        // Wire up landing page sign-in buttons
        ["lp-nav-signin","lp-hero-signin","lp-bottom-signin"].forEach(function(id) {
            var btn = document.getElementById(id);
            if (btn) btn.onclick = function() {
                var provider = new firebase.auth.GoogleAuthProvider();
                auth.signInWithPopup(provider).catch(function(err) {
                    if (err.code !== "auth/popup-closed-by-user") showToast("Anmeldung fehlgeschlagen: " + err.message);
                });
            };
        });
        // Wire up demo buttons
        ["lp-hero-demo","lp-bottom-demo"].forEach(function(id) {
            var btn = document.getElementById(id);
            if (btn) btn.onclick = startDemoMode;
        });
        // Show sign-in modal if redirected from features/about page
        if (wantsSignin) {
            setTimeout(function() {
                showModal('<h3 class="modal-title">Anmelden</h3><p class="modal-text">Melde dich mit deinem Google-Konto an, um deine Daten geräteübergreifend zu synchronisieren.</p><div class="modal-actions"><button class="btn btn-small modal-cancel">Abbrechen</button><button class="btn btn-add btn-small" id="modal-signin-btn">Mit Google anmelden</button></div>', function(md) {
                    md.querySelector(".modal-cancel").onclick = closeModal;
                    md.querySelector("#modal-signin-btn").onclick = function() {
                        closeModal();
                        var provider = new firebase.auth.GoogleAuthProvider();
                        auth.signInWithPopup(provider).catch(function(err) {
                            if (err.code !== "auth/popup-closed-by-user") showToast("Anmeldung fehlgeschlagen: " + err.message);
                        });
                    };
                });
            }, 500);
        }
        // Re-run scroll animations for landing
        document.querySelectorAll(".lp-animate").forEach(function(el) {
            el.classList.remove("lp-visible");
            setTimeout(function() { el.classList.add("lp-visible"); }, 100);
        });
    }
});

// ---- Default subjects (first-load seed) ----
var DEFAULT_SUBJECTS = [
    { id:"vwl", name:"VWL \u2013 Makro\u00f6konomie", categories:["Vorlesung","Ecoreps","\u00dcbungsserie","Altklausuren"], topics:["Einf\u00fchrung und VGR","Der G\u00fctermarkt","Der Finanzmarkt","IS-LM-Modell","Finanzm\u00e4rkte II: Das erweiterte IS-LM Modell","Arbeitsmarkt und Inflation","IS-LM-PC Modell","Offene Volkswirtschaft und internationale Makro\u00f6konomie","Langfristiges Wachstum \u2013 Das Solow Modell"] },
    { id:"mathe", name:"Mathematik", categories:["Vorlesung","Ecoreps","\u00dcbungsserie","Altklausuren"], topics:["Integrale","Anwendungen der Integralrechnung","Matrizen und Determinanten","Vektoren","Lineare Gleichungssysteme","Eigenwerte und Eigenvektoren","Differenzengleichungen","Anwendung der linearen Algebra","Anhang: Formelsammlung","Alte Kapitel"] },
    { id:"bwl", name:"BWL", categories:["Vorlesung","Ecoreps","\u00dcbungsserie","Altklausuren"], topics:["Einf\u00fchrung","Bilanz","Erfolgs- und Geldflussrechnung","Controlling","Performance Measurement","Finanzierung","Mergers & Acquisitions","Wirtschaftsethik"] },
    { id:"recht", name:"Bundesstaatsrecht", categories:["Vorlesung","\u00dcbungsserie","Altklausuren"], topics:["SW 1 \u2013 Was ist ein Staat?","SW 2 \u2013 Was ist eine Verfassung?","SW 3 \u2013 Was ist Recht?","SW 4 \u2013 Was ist der Rechtsstaat?","SW 5 \u2013 Wozu Bundesstaaten?","SW 6 \u2013 Wie funktioniert ein Bundesstaat?","SW 9 \u2013 Grundz\u00fcge des Regierungssystems; politische Rechte","SW 10 \u2013 Grundrechte I","SW 11 \u2013 Grundrechte II","SW 12 \u2013 Beh\u00f6rdenorganisation","SW 13 \u2013 Rechtsetzung; Verfassungsgerichtsbarkeit","SW 14 \u2013 Gastvortrag"] },
];

// ---- Persistence ----
function loadSubjects() {
    var r = localStorage.getItem("lf_subjects");
    if (r) return JSON.parse(r);
    saveSubjects(DEFAULT_SUBJECTS);
    return JSON.parse(JSON.stringify(DEFAULT_SUBJECTS));
}
function saveSubjects(l) { localStorage.setItem("lf_subjects", JSON.stringify(l)); scheduleSync(); }

function loadStatuses() { var r = localStorage.getItem("lf_statuses"); return r ? JSON.parse(r) : {}; }
function saveStatuses(d) { localStorage.setItem("lf_statuses", JSON.stringify(d)); scheduleSync(); }

function getStatus(d, sid, ti, cat) { return d[sid+"."+ti+"."+cat] || "none"; }
function setStatus(d, sid, ti, cat, v) { d[sid+"."+ti+"."+cat] = v; }

function loadNotes() { var r = localStorage.getItem("lf_notes"); return r ? JSON.parse(r) : {}; }
function saveNotes(d) { localStorage.setItem("lf_notes", JSON.stringify(d)); scheduleSync(); }
function getNoteKey(sid, ti) { return sid+"."+ti; }

function loadWeeklyGoal() { var r = localStorage.getItem("lf_weeklygoal"); return r ? JSON.parse(r) : {target:10}; }
function saveWeeklyGoal(g) { localStorage.setItem("lf_weeklygoal", JSON.stringify(g)); scheduleSync(); }

// Study log — capped at 500, keyed to prevent double-counting
var LOG_CAP = 500;
function loadStudyLog() { var r = localStorage.getItem("lf_studylog"); return r ? JSON.parse(r) : []; }
function saveStudyLog(l) { localStorage.setItem("lf_studylog", JSON.stringify(l)); scheduleSync(); }
function logCompletion(sid, ti, cat) {
    var log = loadStudyLog();
    var weekStart = getWeekStart();
    // Deduplicate: don't count same cell twice in same week
    var dup = log.some(function(e){ return e.subject===sid && e.topic===ti && e.cat===cat && e.ts>=weekStart; });
    if (dup) return;
    log.push({subject:sid, topic:ti, cat:cat, ts:Date.now()});
    if (log.length > LOG_CAP) log = log.slice(log.length - LOG_CAP);
    saveStudyLog(log);
}

function loadPlanner() { var r = localStorage.getItem("lf_planner"); return r ? JSON.parse(r) : []; }
function savePlanner(l) { localStorage.setItem("lf_planner", JSON.stringify(l)); scheduleSync(); }

function loadTodos() { var r = localStorage.getItem("lf_todos"); return r ? JSON.parse(r) : []; }
function saveTodos(l) { localStorage.setItem("lf_todos", JSON.stringify(l)); scheduleSync(); }

// ---- Helpers ----
var STATUS_CYCLE = ["none","progress","review","done","rep1","rep2"];
var STATUS_VALUE = {none:0, progress:0.25, review:0.5, done:0.75, rep1:0.9, rep2:1};

function genId() { return "s"+Date.now().toString(36)+Math.random().toString(36).slice(2,6); }
function esc(s) { var d=document.createElement("div"); d.textContent=s; return d.innerHTML; }

function getWeekStart() {
    var n=new Date(); var d=n.getDay(); var diff=d===0?6:d-1;
    var m=new Date(n); m.setDate(n.getDate()-diff); m.setHours(0,0,0,0);
    return m.getTime();
}
function getCompletionsThisWeek() {
    var log=loadStudyLog(), ws=getWeekStart();
    return log.filter(function(e){ return e.ts>=ws; });
}

// ---- Progress calc ----
function calcTopicPct(d,sid,ti,cats) {
    if(!cats.length) return 0;
    var s=0; cats.forEach(function(c){ s+=STATUS_VALUE[getStatus(d,sid,ti,c)]; });
    return s/cats.length;
}
function calcCatPct(d,sid,cat,n) {
    if(!n) return 0; var s=0;
    for(var i=0;i<n;i++) s+=STATUS_VALUE[getStatus(d,sid,i,cat)];
    return s/n;
}
function calcSubjPct(d,subj) {
    if(!subj.topics.length||!subj.categories.length) return 0;
    var t=0; for(var i=0;i<subj.topics.length;i++) t+=calcTopicPct(d,subj.id,i,subj.categories);
    return t/subj.topics.length;
}
function pctStr(v) { return Math.round(v*100)+"%"; }
function pctCls(v) { return v>=0.75?"pct-high":v>=0.25?"pct-mid":"pct-low"; }
function barCls(v) { return v>=0.75?"bar-high":v>=0.25?"bar-mid":"bar-low"; }
function progressBarHtml(v) {
    var p=Math.round(v*100);
    return '<div class="mini-bar"><div class="mini-bar-fill '+barCls(v)+'" style="width:'+p+'%"></div></div><span class="bar-label '+pctCls(v)+'">'+p+'%</span>';
}

// ---- Exam date helpers ----
function daysUntil(ds) {
    if(!ds) return null;
    var n=new Date(); n.setHours(0,0,0,0);
    return Math.ceil((new Date(ds+"T00:00:00")-n)/864e5);
}
function countdownText(ds) {
    var d=daysUntil(ds); if(d===null) return "";
    if(d<0) return t('overdue'); if(d===0) return t('today')+"!"; if(d===1) return t('tomorrow')+"!";
    return d+" "+t('days');
}
function countdownCls(ds) {
    var d=daysUntil(ds); if(d===null) return "";
    return d<=3?"countdown-urgent":d<=14?"countdown-soon":"countdown-ok";
}

// ---- Modal system (replaces prompt/confirm) ----
function showModal(html, onMount) {
    var bd = document.getElementById("modal-backdrop");
    var md = document.getElementById("modal");
    md.innerHTML = html;
    bd.style.display = "flex";
    if (onMount) onMount(md);
    // Close on backdrop click
    bd.onclick = function(e) { if(e.target===bd) closeModal(); };
    // Focus first input
    var fi = md.querySelector("input,select,textarea");
    if(fi) fi.focus();
}
function closeModal() {
    document.getElementById("modal-backdrop").style.display = "none";
    document.getElementById("modal").innerHTML = "";
}

function modalConfirm(title, msg, onYes) {
    var h = '<h3 class="modal-title">'+esc(title)+'</h3>';
    h += '<p class="modal-text">'+esc(msg)+'</p>';
    h += '<div class="modal-actions"><button class="btn btn-small modal-cancel">Abbrechen</button><button class="btn btn-small btn-danger modal-confirm-btn">L\u00f6schen</button></div>';
    showModal(h, function(md) {
        md.querySelector(".modal-cancel").onclick = closeModal;
        md.querySelector(".modal-confirm-btn").onclick = function(){ closeModal(); onYes(); };
    });
}

function modalPrompt(title, placeholder, defaultVal, onSubmit) {
    var h = '<h3 class="modal-title">'+esc(title)+'</h3>';
    h += '<input class="modal-input" type="text" placeholder="'+esc(placeholder)+'" value="'+esc(defaultVal||"")+'">';
    h += '<div class="modal-actions"><button class="btn btn-small modal-cancel">Abbrechen</button><button class="btn btn-small btn-add modal-ok">OK</button></div>';
    showModal(h, function(md) {
        var inp = md.querySelector(".modal-input");
        md.querySelector(".modal-cancel").onclick = closeModal;
        md.querySelector(".modal-ok").onclick = function(){ var v=inp.value.trim(); if(v){closeModal(); onSubmit(v);} };
        inp.onkeydown = function(e){ if(e.key==="Enter"){md.querySelector(".modal-ok").click();} if(e.key==="Escape") closeModal(); };
    });
}

// ---- Toast / Undo system ----
function showToast(msg, undoFn) {
    var tc = document.getElementById("toast-container");
    var t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = '<span>'+esc(msg)+'</span>';
    if (undoFn) {
        var btn = document.createElement("button");
        btn.className = "toast-undo";
        btn.textContent = "R\u00fcckg\u00e4ngig";
        btn.onclick = function() { undoFn(); t.remove(); };
        t.appendChild(btn);
    }
    tc.appendChild(t);
    setTimeout(function(){ t.classList.add("toast-fade"); setTimeout(function(){t.remove();},400); }, undoFn?5000:3000);
}

// ---- Dark mode ----
function updateDarkIcon() {
    var btn = document.getElementById("dark-mode-toggle"); if(!btn) return;
    var isDark = document.body.classList.contains("dark");
    btn.textContent = isDark ? "☀" : "🌙";
    btn.setAttribute("aria-label", isDark ? "Hellmodus aktivieren" : "Dunkelmodus aktivieren");
    btn.setAttribute("title", isDark ? "Hellmodus" : "Dunkelmodus");
}
function initDarkMode() {
    var saved = localStorage.getItem("lf_darkmode");
    if (saved==="true") document.body.classList.add("dark");
    updateDarkIcon();
    document.getElementById("dark-mode-toggle").addEventListener("click", function() {
        document.body.classList.toggle("dark");
        localStorage.setItem("lf_darkmode", document.body.classList.contains("dark"));
        updateDarkIcon();
    });
    var hPresetBtn = document.getElementById("header-preset-btn");
    if (hPresetBtn) hPresetBtn.addEventListener("click", function() { showPresetLibrary(); });
    // App language toggle
    var appLangBtn = document.getElementById("app-lang-toggle");
    function updateAppLangUI() {
        if (appLangBtn) appLangBtn.textContent = t('lang.btn');
        var presetBtn = document.getElementById("header-preset-btn");
        if (presetBtn) presetBtn.innerHTML = '\ud83d\udcda ' + t('presets');
    }
    if (appLangBtn) {
        updateAppLangUI();
        appLangBtn.addEventListener("click", function() {
            APP_LANG = APP_LANG === 'de' ? 'en' : 'de';
            localStorage.setItem('st_lang', APP_LANG);
            updateAppLangUI();
            // Also sync the landing page i18n
            if (typeof applyLang === 'function') applyLang(APP_LANG);
            renderAll();
        });
    }
}

// ---- Tab state ----
var activeTab = "overview";
function switchTab(id) {
    activeTab = id;
    document.querySelectorAll(".nav-tab").forEach(function(b){ b.classList.toggle("active",b.dataset.tab===id); });
    document.querySelectorAll(".tab-content").forEach(function(c){ c.classList.toggle("active",c.id==="tab-"+id); });
    // Re-render chart after tab is visible so canvas has width
    if(id==="overview"){
        renderProgressChart();
    } else {
        var subj=loadSubjects().find(function(s){return s.id===id;});
        if(subj) renderSubjectChart(subj);
    }
}

// ---- Render: Tabs ----
function renderTabs() {
    var subjects=loadSubjects(), nav=document.getElementById("nav-tabs");
    var h='<button class="nav-tab'+(activeTab==="overview"?" active":"")+'" data-tab="overview">'+t('overview')+'</button>';
    subjects.forEach(function(s){
        var l=s.name.length>16?s.name.slice(0,16)+"\u2026":s.name;
        h+='<button class="nav-tab'+(activeTab===s.id?" active":"")+'" data-tab="'+s.id+'">'+esc(l)+'</button>';
    });
    nav.innerHTML = h;
    nav.querySelectorAll(".nav-tab").forEach(function(b){ b.onclick=function(){switchTab(b.dataset.tab);}; });
}

// ---- Render: Content containers ----
function renderContainers() {
    var subjects=loadSubjects(), m=document.getElementById("tab-sections");
    var h='<section id="tab-overview" class="tab-content'+(activeTab==="overview"?" active":"")+'"></section>';
    subjects.forEach(function(s){ h+='<section id="tab-'+s.id+'" class="tab-content'+(activeTab===s.id?" active":"")+'"></section>'; });
    m.innerHTML = h;
}

// ---- Render: Study-Next suggestion ----
function renderStudyNext() {
    var card=document.getElementById("study-next-card");
    var subjects=loadSubjects(), data=loadStatuses();

    // Disabled permanently
    if(localStorage.getItem("lf_studynext_off")==="true") {
        card.innerHTML='<div class="study-next-disabled"><button class="study-next-reenable" id="studynext-reenable">📖 Lernvorschlag aktivieren</button></div>';
        card.querySelector("#studynext-reenable").onclick=function(){ localStorage.removeItem("lf_studynext_off"); studyNextDismissed=false; renderStudyNext(); };
        return;
    }
    // Dismissed for this session
    if(studyNextDismissed) { card.innerHTML=''; return; }

    if(!subjects.length){ card.innerHTML=''; return; }
    var best=null, bestScore=Infinity;
    subjects.forEach(function(subj){
        if(!subj.topics.length||!subj.categories.length) return;
        var sp=calcSubjPct(data,subj); if(sp>=1) return;
        var urg=1000;
        if(subj.examDate){var d=daysUntil(subj.examDate); if(d!==null&&d>=0) urg=d; else if(d!==null&&d<0) return;}
        for(var i=0;i<subj.topics.length;i++){
            var tp=calcTopicPct(data,subj.id,i,subj.categories);
            if(tp<1){
                var cat=null; subj.categories.forEach(function(c){var st=getStatus(data,subj.id,i,c);if(!cat&&st!=="done"&&st!=="rep1"&&st!=="rep2") cat=c;});
                var score=urg*10+tp*100;
                if(score<bestScore){ bestScore=score; best={sid:subj.id,sname:subj.name,ti:i,tname:subj.topics[i],cat:cat,tp:tp,exam:subj.examDate}; }
                break;
            }
        }
    });
    if(!best){ card.innerHTML='<div class="study-next study-next--done"><span class="study-next-icon">\u2705</span><div class="study-next-text"><strong>Alles erledigt!</strong></div></div>'; return; }
    var eh=""; if(best.exam){var d=daysUntil(best.exam); if(d!==null&&d>=0) eh=' <span class="study-next-exam '+countdownCls(best.exam)+'">Pr\u00fcfung in '+countdownText(best.exam)+'</span>';}
    var h='<div class="study-next"><span class="study-next-icon">📖</span><div class="study-next-text">';
    h+='<div class="study-next-label">'+t('study.next')+'</div><div class="study-next-title">'+esc(best.tname)+'</div>';
    h+='<div class="study-next-meta">'+esc(best.sname);
    if(best.cat) h+=' \u00b7 '+esc(best.cat);
    h+=' \u00b7 '+Math.round(best.tp*100)+'% erledigt'+eh+'</div></div>';
    h+='<button class="btn btn-add study-next-go" data-go="'+best.sid+'">Zum Fach</button>';
    h+='<div class="study-next-controls">';
    h+='<button class="study-next-close" id="studynext-close" title="Schliessen">\u00d7</button>';
    h+='<button class="study-next-disable" id="studynext-disable">Deaktivieren</button>';
    h+='</div></div>';
    card.innerHTML=h;
    card.querySelector(".study-next-go").onclick=function(){switchTab(this.dataset.go);};
    card.querySelector("#studynext-close").onclick=function(){ studyNextDismissed=true; renderStudyNext(); };
    card.querySelector("#studynext-disable").onclick=function(){ localStorage.setItem("lf_studynext_off","true"); renderStudyNext(); };
}

// ---- Render: Overview ----
function renderOverview() {
    var subjects=loadSubjects(), data=loadStatuses();
    var c=document.getElementById("tab-overview"); if(!c) return;
    var allCats=[]; subjects.forEach(function(s){s.categories.forEach(function(cat){if(allCats.indexOf(cat)===-1)allCats.push(cat);});});

    var h='<div class="overview-toolbar">';
    h+='<button class="btn btn-small btn-danger" id="btn-reset-semester">'+t('reset.semester')+'</button>';
    h+='<button class="btn btn-add" id="btn-add-subject">'+t('add.subject')+'</button>';
    h+='</div>';

    if(!subjects.length){
        h+='<div class="empty-state">';
        h+='<div class="empty-state-icon">\ud83d\udcda</div>';
        h+='<h2 class="empty-state-title">'+t('welcome.title')+'</h2>';
        h+='<p class="empty-state-text">'+t('welcome.text')+'</p>';
        h+='<div class="empty-state-actions">';
        h+='<button class="btn btn-add" id="btn-add-subject-empty">'+t('add.subject')+'</button>';
        h+='<button class="btn btn-small" id="btn-preset-library">\ud83d\udcda '+t('preset.library')+'</button>';
        h+='</div>';
        h+='</div>';
        c.innerHTML=h; attachOverviewActions(); return;
    }

    // Stats summary
    var totalTopics=0, doneTopics=0, progressTopics=0;
    subjects.forEach(function(subj){
        subj.topics.forEach(function(_,ti){
            totalTopics++;
            var p=calcTopicPct(data,subj.id,ti,subj.categories);
            if(p>=1) doneTopics++;
            else if(p>0) progressTopics++;
        });
    });
    var notStarted=totalTopics-doneTopics-progressTopics;
    var overallPct=totalTopics?Math.round(doneTopics/totalTopics*100):0;
    h+='<div class="overview-stats-title">'+t('stats.title')+'</div>';
    h+='<div class="overview-stats">';
    h+='<div class="stat-card"><div class="stat-num pct-high">'+doneTopics+'</div><div class="stat-label">'+t('done')+'</div></div>';
    h+='<div class="stat-card"><div class="stat-num pct-mid">'+progressTopics+'</div><div class="stat-label">'+t('in.progress')+'</div></div>';
    h+='<div class="stat-card"><div class="stat-num pct-low">'+notStarted+'</div><div class="stat-label">'+t('open')+'</div></div>';
    h+='<div class="stat-card"><div class="stat-num">'+totalTopics+'</div><div class="stat-label">'+t('topics')+'</div></div>';
    h+='<div class="stat-card stat-card--main"><div class="stat-num '+pctCls(overallPct/100)+'">'+overallPct+'%</div><div class="stat-label">'+t('total')+'</div></div>';
    h+='</div>';

    h+='<table><thead><tr><th class="th-drag"></th><th></th><th>'+t('subject')+'</th><th>'+t('exam')+'</th>';
    allCats.forEach(function(cat){h+="<th>"+esc(cat)+"</th>";}); h+="<th>"+t('total')+"</th></tr></thead>";
    h+='<tbody id="overview-tbody">';

    var catTotals={},grandT=0; allCats.forEach(function(c){catTotals[c]={s:0,n:0};});
    subjects.forEach(function(subj,idx){
        var ov=calcSubjPct(data,subj); grandT+=ov;
        h+='<tr draggable="true" data-subj-idx="'+idx+'">';
        h+='<td class="drag-handle" title="Fach verschieben">&#9776;</td>';
        h+="<td>"+(idx+1)+"</td><td><strong class=\"overview-subj-link\" data-tab=\""+subj.id+"\">"+esc(subj.name)+"</strong></td>";
        if(subj.examDate){h+='<td class="exam-countdown '+countdownCls(subj.examDate)+'">'+countdownText(subj.examDate)+"</td>";}
        else{h+='<td class="exam-countdown exam-none">\u2014</td>';}
        allCats.forEach(function(cat){
            if(subj.categories.indexOf(cat)===-1){h+='<td class="no-category">\u2014</td>';} else {
                var v=calcCatPct(data,subj.id,cat,subj.topics.length); catTotals[cat].s+=v; catTotals[cat].n+=1;
                h+='<td class="bar-cell">'+progressBarHtml(v)+'</td>';
            }
        });
        h+='<td class="bar-cell">'+progressBarHtml(ov)+'</td>';
        h+="</tr>";
    });

    h+='</tbody><tfoot><tr><td></td><td></td><td>'+t('total.progress')+'</td><td></td>';
    allCats.forEach(function(cat){var t=catTotals[cat]; var v=t.n?t.s/t.n:0; h+='<td class="bar-cell">'+progressBarHtml(v)+'</td>';});
    var ga=subjects.length?grandT/subjects.length:0; h+='<td class="bar-cell">'+progressBarHtml(ga)+'</td></tr></tfoot></table>';

    // Daily Dopamine Boost + To-Do overview row
    h+='<div class="overview-top-row">';
    h+=renderDopamineCard(subjects);
    h+='<div id="todo-ov-container">'+renderTodoOverview()+'</div>';
    h+='</div>';

    // Progress chart
    h+='<div class="progress-chart-card card">';
    h+='<h2 class="card-title">'+t('progress.over.time')+'</h2>';
    h+='<div class="progress-chart-wrap"><canvas id="progress-chart"></canvas></div>';
    h+='<div id="progress-chart-legend" class="progress-chart-legend"></div>';
    h+='</div>';

    c.innerHTML=h;
    attachOverviewActions();
    initOverviewDragDrop();
    renderProgressChart();
    attachDopamineActions();
    attachTodoOverviewActions();
}

// ---- Daily Dopamine Boost ----
function loadDailyGoal() { var r=localStorage.getItem("lf_dailygoal"); return r ? JSON.parse(r) : {target:5}; }
function saveDailyGoal(g) { localStorage.setItem("lf_dailygoal",JSON.stringify(g)); scheduleSync(); }

function renderDopamineCard(subjects) {
    var log=loadStudyLog();
    var now=new Date(); now.setHours(0,0,0,0);
    var todayStart=now.getTime();
    var todayEnd=todayStart+86400000;
    var todayEntries=log.filter(function(e){ return e.ts>=todayStart && e.ts<todayEnd; });

    var goal=loadDailyGoal();
    var dailyTarget=Math.max(goal.target,1);
    var done=todayEntries.length;
    var pct=Math.min(done/dailyTarget,1);
    var pctNum=Math.round(pct*100);

    var r=34, cx=40, circ=2*Math.PI*r;
    var offset=circ-(pct*circ);

    var dayNames=[t('day.sun'),t('day.mon'),t('day.tue'),t('day.wed'),t('day.thu'),t('day.fri'),t('day.sat')];
    var monthNames=[t('mon.jan'),t('mon.feb'),t('mon.mar'),t('mon.apr'),t('mon.may'),t('mon.jun'),t('mon.jul'),t('mon.aug'),t('mon.sep'),t('mon.oct'),t('mon.nov'),t('mon.dec')];
    var d=new Date();
    var dateStr=dayNames[d.getDay()]+", "+d.getDate()+". "+monthNames[d.getMonth()];

    var h='<div class="dopamine-card">';
    // Header: title + ring
    h+='<div class="dopamine-header">';
    h+='<div class="dopamine-header-left">';
    h+='<h2>Daily Dopamine Boost <span class="dopamine-badge">'+done+' / '+dailyTarget+'</span></h2>';
    h+='<div class="dopamine-date">'+dateStr+(pct>=1?' \ud83c\udf89':'')+'</div>';
    h+='</div>';
    h+='<div class="dopamine-ring">';
    h+='<svg viewBox="0 0 80 80"><circle class="dopamine-ring-bg" cx="'+cx+'" cy="'+cx+'" r="'+r+'"/>';
    h+='<circle class="dopamine-ring-fill" cx="'+cx+'" cy="'+cx+'" r="'+r+'" stroke-dasharray="'+circ+'" stroke-dashoffset="'+offset+'"/></svg>';
    h+='<div class="dopamine-ring-text"><span class="dopamine-ring-pct">'+pctNum+'%</span><span class="dopamine-ring-label">HEUTE</span></div>';
    h+='</div></div>';

    // Goal + progress bar inline
    var cls=pct>=1?"bar-high":pct>=0.5?"bar-mid":"bar-low";
    h+='<div class="dopamine-goal">';
    h+='<span class="dopamine-goal-label">Ziel:</span>';
    h+='<input type="number" class="dopamine-goal-input" id="dopamine-goal-input" min="1" value="'+dailyTarget+'">';
    h+='<button class="dop-goal-save" id="dopamine-goal-save">\u2713</button>';
    h+='<div class="dopamine-bar-inline"><div class="dopamine-bar-fill '+cls+'" style="width:'+pctNum+'%"></div></div>';
    h+='</div>';

    // Scrollable item list
    if(!todayEntries.length){
        h+='<div class="dopamine-empty">Noch nichts erledigt heute.</div>';
    } else {
        h+='<div class="dopamine-items-wrap">';
        todayEntries.slice().reverse().forEach(function(e){
            var s=subjects.find(function(x){return x.id===e.subject;});
            var sn=s?s.name:e.subject;
            var tn=s&&s.topics[e.topic]?s.topics[e.topic]:"Thema "+(e.topic+1);
            var cat=e.cat||"";
            h+='<div class="dop-entry"><span class="dop-entry-check">\u2714</span><span class="dop-entry-name">'+esc(tn)+'</span><span class="dop-entry-meta">'+esc(sn)+(cat?" \u2013 "+esc(cat):"")+'</span></div>';
        });
        h+='</div>';
    }
    h+='</div>';
    return h;
}

var todoOvSort = 'priority'; // 'priority' | 'date'
var todoOvShowDone = false;

function refreshTodoCard() {
    var el = document.getElementById("todo-ov-container");
    if (!el) return;
    el.innerHTML = renderTodoOverview();
    attachTodoOverviewActions();
}

function renderTodoOverview() {
    var todos=loadTodos(), subjects=loadSubjects();
    var today=new Date(); today.setHours(0,0,0,0);
    var todayStr=today.toISOString().slice(0,10);
    var prioOrder={hoch:0,mittel:1,niedrig:2,'':3};

    var open=todos.filter(function(t){return !t.done;});
    function prio(t){var v=prioOrder[t.priority]; return v!==undefined?v:3;}
    if(todoOvSort==='date'){
        open.sort(function(a,b){
            if(a.due&&b.due) return a.due.localeCompare(b.due);
            if(a.due) return -1; if(b.due) return 1;
            return prio(a)-prio(b);
        });
    } else {
        open.sort(function(a,b){
            var pd=prio(a)-prio(b);
            if(pd!==0) return pd;
            if(a.due&&b.due) return a.due.localeCompare(b.due);
            if(a.due) return -1; if(b.due) return 1;
            return 0;
        });
    }

    var h='<div class="todo-overview-card">';
    h+='<div class="todo-ov-header">';
    h+='<h2>To-Do <span class="dopamine-badge" style="background:var(--hsg-text-secondary)">'+open.length+' offen</span></h2>';
    h+='<div class="todo-ov-actions">';
    h+='<div class="todo-ov-sort">';
    h+='<span class="todo-ov-sort-label">'+t('sort.by')+'</span>';
    h+='<button class="todo-ov-sort-btn'+(todoOvSort==='priority'?' active':'')+'" data-ovsort="priority">'+t('priority')+'</button>';
    h+='<button class="todo-ov-sort-btn'+(todoOvSort==='date'?' active':'')+'" data-ovsort="date">'+t('due')+'</button>';
    h+='</div>';
    h+='<button class="btn btn-add btn-small" id="todo-ov-add">'+t('add.task')+'</button>';
    h+='</div></div>';

    if(!open.length && !todoOvShowDone){
        h+='<div class="dopamine-empty"><div class="dopamine-empty-icon">\u2705</div>Keine offenen Aufgaben!</div>';
    } else if(!todoOvShowDone) {
        h+='<ul class="todo-overview-list">';
        open.forEach(function(t){
            var subj=t.subjectId?subjects.find(function(s){return s.id===t.subjectId;}):null;
            var overdue=t.due&&t.due<todayStr;
            var dueToday=t.due&&t.due===todayStr;
            h+='<li class="todo-ov-item">';
            h+='<button class="todo-ov-check" data-todo-ov-id="'+t.id+'"></button>';
            h+='<div class="todo-ov-info">';
            h+='<div class="todo-ov-title">'+esc(t.title)+'</div>';
            h+='<div class="todo-ov-meta">';
            if(t.priority) h+='<span class="todo-ov-prio todo-ov-prio--'+t.priority+'">'+({hoch:'Hoch',mittel:'Mittel',niedrig:'Niedrig'}[t.priority])+'</span>';
            if(subj) h+='<span class="todo-ov-subj">'+esc(subj.name)+'</span>';
            if(t.due) h+='<span class="todo-ov-due'+(overdue?' todo-ov-due--overdue':dueToday?' todo-ov-due--today':'')+'">'+(overdue?'\u00dcberf\u00e4llig: ':dueToday?'Heute: ':'')+formatDate(t.due)+'</span>';
            h+='</div>';
            if(t.note) h+='<div class="todo-ov-note">'+esc(t.note)+'</div>';
            h+='</div>';
            h+='<div class="todo-ov-btns">';
            h+='<button class="todo-ov-edit" data-todo-ov-id="'+t.id+'" title="Bearbeiten">\u270e</button>';
            h+='<button class="todo-ov-delete" data-todo-ov-id="'+t.id+'" title="L\u00f6schen">\u00d7</button>';
            h+='</div></li>';
        });
        h+='</ul>';
    }

    // Completed todos section
    var done=todos.filter(function(t){return t.done;});
    done.sort(function(a,b){return (b.completedAt||'').localeCompare(a.completedAt||'');});
    h+='<button class="todo-ov-toggle-done" id="todo-ov-toggle-done">'+(todoOvShowDone?'\u25B2 Erledigte ausblenden':'\u25BC Erledigte anzeigen ('+done.length+')')+'</button>';
    if(todoOvShowDone){
        if(!done.length){
            h+='<div class="dopamine-empty" style="padding:12px 0;"><div class="dopamine-empty-icon" style="font-size:1.2rem;">\ud83d\udcad</div>Noch keine erledigten Aufgaben.</div>';
        } else {
            h+='<ul class="todo-overview-list todo-overview-list--done">';
            done.forEach(function(t){
                var subj=t.subjectId?subjects.find(function(s){return s.id===t.subjectId;}):null;
                h+='<li class="todo-ov-item todo-ov-item--done">';
                h+='<button class="todo-ov-uncheck" data-todo-ov-id="'+t.id+'" title="R\u00fcckg\u00e4ngig">\u21A9</button>';
                h+='<div class="todo-ov-info">';
                h+='<div class="todo-ov-title">'+esc(t.title)+'</div>';
                h+='<div class="todo-ov-meta">';
                if(subj) h+='<span class="todo-ov-subj">'+esc(subj.name)+'</span>';
                if(t.completedAt) h+='<span class="todo-ov-due">Erledigt: '+formatDate(t.completedAt.slice(0,10))+'</span>';
                h+='</div>';
                h+='</div>';
                h+='<div class="todo-ov-btns">';
                h+='<button class="todo-ov-delete" data-todo-ov-id="'+t.id+'" title="L\u00f6schen">\u00d7</button>';
                h+='</div></li>';
            });
            h+='</ul>';
        }
    }
    h+='</div>';
    return h;
}

function attachTodoOverviewActions(){
    document.querySelectorAll(".todo-ov-check").forEach(function(btn){
        btn.onclick=function(){
            var ts=loadTodos();
            var t=ts.find(function(x){return x.id===btn.dataset.todoOvId;});
            if(t){
                var title=t.title;
                t.done=true;t.completedAt=new Date().toISOString();saveTodos(ts);renderOverview();
                showToast('\u2705 \"'+title+'\" erledigt',function(){
                    var ts2=loadTodos();
                    var t2=ts2.find(function(x){return x.id===btn.dataset.todoOvId;});
                    if(t2){t2.done=false;delete t2.completedAt;saveTodos(ts2);renderOverview();}
                });
            }
        };
    });
    document.querySelectorAll(".todo-ov-sort-btn").forEach(function(btn){
        btn.onclick=function(e){
            e.stopPropagation();
            e.preventDefault();
            todoOvSort=btn.dataset.ovsort;
            refreshTodoCard();
        };
    });
    var addBtn=document.getElementById("todo-ov-add");
    if(addBtn) addBtn.onclick=function(){openTodoModal(null);};
    document.querySelectorAll(".todo-ov-edit").forEach(function(btn){
        btn.onclick=function(){
            var t=loadTodos().find(function(x){return x.id===btn.dataset.todoOvId;});
            if(t) openTodoModal(t);
        };
    });
    document.querySelectorAll(".todo-ov-delete").forEach(function(btn){
        btn.onclick=function(){
            var ts=loadTodos().filter(function(x){return x.id!==btn.dataset.todoOvId;});
            saveTodos(ts);renderOverview();
        };
    });
    document.querySelectorAll(".todo-ov-uncheck").forEach(function(btn){
        btn.onclick=function(){
            var ts=loadTodos();
            var t=ts.find(function(x){return x.id===btn.dataset.todoOvId;});
            if(t){t.done=false;delete t.completedAt;saveTodos(ts);refreshTodoCard();}
        };
    });
    var toggleDone=document.getElementById("todo-ov-toggle-done");
    if(toggleDone) toggleDone.onclick=function(){todoOvShowDone=!todoOvShowDone;refreshTodoCard();};
}

function attachDopamineActions(){
    var btn=document.getElementById("dopamine-goal-save");
    if(btn) btn.onclick=function(){
        var v=Number(document.getElementById("dopamine-goal-input").value);
        if(v>0){saveDailyGoal({target:v});renderOverview();}
    };
}

var CHART_COLORS=["#006849","#d4a843","#3b82f6","#ef4444","#8b5cf6","#ec4899","#f97316","#14b8a6","#6366f1","#84cc16"];

function renderProgressChart() {
    var canvas=document.getElementById("progress-chart"); if(!canvas) return;
    var log=loadStudyLog();
    var subjects=loadSubjects();
    // Map subject IDs to names and total cells
    var subjMap={}, subjCells={}, totalAllCells=0;
    subjects.forEach(function(s){
        subjMap[s.id]=s.name;
        var cells=s.topics.length*s.categories.length;
        subjCells[s.id]=cells;
        totalAllCells+=cells;
    });

    var statuses=loadStatuses();
    if(!subjects.length||!totalAllCells){
        canvas.parentElement.innerHTML='<p style="text-align:center;color:var(--hsg-text-secondary);padding:24px 0;font-size:.875rem;">'+t('no.data.hint')+'</p>';
        return;
    }

    // Group log entries by date and subject
    var byDate={};
    log.forEach(function(e){
        var d=new Date(e.ts).toISOString().slice(0,10);
        var sid=e.subject;
        if(!byDate[d]) byDate[d]={};
        if(!byDate[d][sid]) byDate[d][sid]=0;
        byDate[d][sid]++;
    });

    // Fill date gaps
    var dates=Object.keys(byDate).sort();
    var today=new Date().toISOString().slice(0,10);
    var first=dates.length?new Date(dates[0]+"T00:00:00"):new Date();
    var last=new Date();
    var allDates=[];
    for(var dt=new Date(first);dt<=last;dt.setDate(dt.getDate()+1)){
        allDates.push(dt.toISOString().slice(0,10));
    }
    if(!allDates.length) allDates.push(today);

    // Use all subjects, not just logged ones
    var subjIds=[];
    subjects.forEach(function(s){subjIds.push(s.id);});

    // Build cumulative percentage data per subject + total
    var cumRaw={};
    subjIds.forEach(function(sid){cumRaw[sid]=0;});
    var chartData=[];
    allDates.forEach(function(d){
        var dayData=byDate[d]||{};
        subjIds.forEach(function(sid){cumRaw[sid]+=(dayData[sid]||0);});
        var vals={};
        var totalDone=0;
        subjIds.forEach(function(sid){
            var cells=subjCells[sid]||1;
            vals[sid]=Math.min((cumRaw[sid]/cells)*100,100);
            totalDone+=cumRaw[sid];
        });
        chartData.push({date:d,values:vals,total:Math.min((totalDone/totalAllCells)*100,100)});
    });

    // Override today with actual current progress from statuses
    var todaySubjVals={};
    var todayTotalDone=0;
    subjects.forEach(function(s){
        var subjDone=0;
        s.categories.forEach(function(cat){
            for(var ti=0;ti<s.topics.length;ti++) subjDone+=STATUS_VALUE[getStatus(statuses,s.id,ti,cat)];
        });
        var cells=subjCells[s.id]||1;
        todaySubjVals[s.id]=Math.min((subjDone/cells)*100,100);
        todayTotalDone+=subjDone;
    });
    var todayTotalPct=Math.min((todayTotalDone/totalAllCells)*100,100);
    if(chartData.length&&chartData[chartData.length-1].date===today){
        chartData[chartData.length-1].values=todaySubjVals;
        chartData[chartData.length-1].total=todayTotalPct;
    } else {
        chartData.push({date:today,values:todaySubjVals,total:todayTotalPct});
        allDates.push(today);
    }

    // Draw
    var maxY=100;
    var dpr=window.devicePixelRatio||1;
    var wrap=canvas.parentElement;
    var w=wrap.clientWidth, h=Math.min(280,Math.max(180,w*0.4));
    canvas.width=w*dpr; canvas.height=h*dpr;
    canvas.style.width=w+"px"; canvas.style.height=h+"px";
    var ctx=canvas.getContext("2d");
    ctx.scale(dpr,dpr);

    var pad={top:20,right:20,bottom:36,left:44};
    var cw=w-pad.left-pad.right, ch=h-pad.top-pad.bottom;
    var n=chartData.length;

    var colors={};
    subjIds.forEach(function(sid,i){colors[sid]=CHART_COLORS[i%CHART_COLORS.length];});
    var totalColor="#888";

    function gx(i){return pad.left+(i/(n-1||1))*cw;}
    function gy(v){return pad.top+ch-(v/maxY)*ch;}

    // Grid lines + Y labels (0%, 25%, 50%, 75%, 100%)
    var textColor=getComputedStyle(document.body).getPropertyValue("--hsg-text-secondary")||"#999";
    ctx.strokeStyle="rgba(128,128,128,.12)";
    ctx.lineWidth=1;
    for(var gi=0;gi<=4;gi++){
        var gv=gi*25;
        var yy=gy(gv);
        ctx.beginPath(); ctx.moveTo(pad.left,yy); ctx.lineTo(w-pad.right,yy); ctx.stroke();
        ctx.font="11px Source Sans 3,sans-serif";
        ctx.textAlign="right"; ctx.textBaseline="middle";
        ctx.fillStyle=textColor;
        ctx.fillText(gv+"%",pad.left-6,yy);
    }

    // 100% goal line
    ctx.beginPath();
    ctx.moveTo(pad.left,gy(100));
    ctx.lineTo(w-pad.right,gy(100));
    ctx.strokeStyle="rgba(0,180,100,.25)";
    ctx.lineWidth=2;
    ctx.setLineDash([4,4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Subject lines
    subjIds.forEach(function(sid){
        ctx.beginPath();
        for(var i=0;i<n;i++){
            var v=chartData[i].values[sid];
            if(i===0) ctx.moveTo(gx(i),gy(v)); else ctx.lineTo(gx(i),gy(v));
        }
        ctx.strokeStyle=colors[sid];
        ctx.lineWidth=2.5;
        ctx.lineJoin="round";
        ctx.stroke();
    });

    // Total line (dashed)
    ctx.beginPath();
    for(var ti=0;ti<n;ti++){
        if(ti===0) ctx.moveTo(gx(ti),gy(chartData[ti].total)); else ctx.lineTo(gx(ti),gy(chartData[ti].total));
    }
    ctx.strokeStyle=totalColor;
    ctx.lineWidth=2.5;
    ctx.setLineDash([6,4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // X axis labels
    ctx.fillStyle=textColor;
    ctx.font="11px Source Sans 3,sans-serif";
    ctx.textAlign="center"; ctx.textBaseline="top";
    var labelCount=Math.min(n,Math.floor(cw/60));
    var step=Math.max(1,Math.floor(n/labelCount));
    for(var li=0;li<n;li+=step){
        var dd=chartData[li].date.slice(5).split("-");
        ctx.fillText(dd[1]+"."+dd[0],gx(li),h-pad.bottom+8);
    }
    if(n>1){
        var lastD=chartData[n-1].date.slice(5).split("-");
        ctx.fillText(lastD[1]+"."+lastD[0],gx(n-1),h-pad.bottom+8);
    }

    // Legend — use current actual progress
    var legend=document.getElementById("progress-chart-legend");
    if(legend){
        var lh='';
        subjIds.forEach(function(sid){
            var pct=Math.round(todaySubjVals[sid]||0);
            lh+='<span class="progress-chart-legend-item"><span class="progress-chart-legend-color" style="background:'+colors[sid]+'"></span>'+esc(subjMap[sid]||sid)+' ('+pct+'%)</span>';
        });
        var totalPctLeg=Math.round(todayTotalPct);
        lh+='<span class="progress-chart-legend-item"><span class="progress-chart-legend-color" style="background:'+totalColor+';opacity:.7"></span>'+t('total')+' ('+totalPctLeg+'%)</span>';
        legend.innerHTML=lh;
    }
}

function attachOverviewActions() {
    var addBtn=document.getElementById("btn-add-subject"); if(addBtn) addBtn.onclick=showAddSubjectModal;
    var addBtnEmpty=document.getElementById("btn-add-subject-empty"); if(addBtnEmpty) addBtnEmpty.onclick=showAddSubjectModal;
    var rstBtn=document.getElementById("btn-reset-semester"); if(rstBtn) rstBtn.onclick=resetSemester;
    var presetBtn=document.getElementById("btn-preset-library"); if(presetBtn) presetBtn.onclick=showPresetLibrary;
    document.querySelectorAll(".overview-subj-link").forEach(function(el){
        el.onclick=function(){switchTab(el.dataset.tab);};
    });
}

function renderSubjectChart(subj) {
    var canvas=document.getElementById("subject-chart-"+subj.id); if(!canvas) return;
    var log=loadStudyLog();
    var subjLog=log.filter(function(e){return e.subject===subj.id;});
    var totalCells=subj.topics.length*subj.categories.length;
    var statuses=loadStatuses();
    if(!totalCells||(!subj.topics.length)||(!subj.categories.length)){
        canvas.parentElement.innerHTML='<p style="text-align:center;color:var(--hsg-text-secondary);padding:24px 0;font-size:.875rem;">'+t('no.data')+'</p>';
        return;
    }

    // Group by date and category
    var byDate={};
    subjLog.forEach(function(e){
        var d=new Date(e.ts).toISOString().slice(0,10);
        if(!byDate[d]) byDate[d]={_total:0};
        if(!byDate[d][e.cat]) byDate[d][e.cat]=0;
        byDate[d][e.cat]++;
        byDate[d]._total++;
    });

    // Fill date gaps
    var dates=Object.keys(byDate).sort();
    var today=new Date().toISOString().slice(0,10);
    var first=dates.length?new Date(dates[0]+"T00:00:00"):new Date();
    var last=new Date();
    var allDates=[];
    for(var dt=new Date(first);dt<=last;dt.setDate(dt.getDate()+1)){
        allDates.push(dt.toISOString().slice(0,10));
    }
    if(!allDates.length) allDates.push(today);

    // Collect categories: use all subject categories, not just logged ones
    var catsInLog=subj.categories.slice();

    // Build cumulative data: each cat as % of totalCells, plus overall total
    var cumCat={};
    catsInLog.forEach(function(cat){cumCat[cat]=0;});
    var cumTotal=0;
    var chartData=[];
    allDates.forEach(function(d){
        var dayData=byDate[d]||{};
        catsInLog.forEach(function(cat){cumCat[cat]+=(dayData[cat]||0);});
        cumTotal+=(dayData._total||0);
        var vals={};
        catsInLog.forEach(function(cat){vals[cat]=(cumCat[cat]/totalCells)*100;});
        chartData.push({date:d,values:vals,total:(cumTotal/totalCells)*100});
    });

    // Override today's data point with actual current progress from statuses
    var todayVals={};
    var todayTotal=0;
    subj.categories.forEach(function(cat){
        var catDone=0;
        for(var ti=0;ti<subj.topics.length;ti++){
            catDone+=STATUS_VALUE[getStatus(statuses,subj.id,ti,cat)];
        }
        todayVals[cat]=(catDone/subj.topics.length)*100;
        todayTotal+=catDone;
    });
    var todayTotalPct=(todayTotal/totalCells)*100;
    if(chartData.length&&chartData[chartData.length-1].date===today){
        chartData[chartData.length-1].values=todayVals;
        chartData[chartData.length-1].total=todayTotalPct;
    } else {
        chartData.push({date:today,values:todayVals,total:todayTotalPct});
        allDates.push(today);
    }

    // Draw
    var dpr=window.devicePixelRatio||1;
    var wrap=canvas.parentElement;
    var w=wrap.clientWidth, h=Math.min(260,Math.max(170,w*0.38));
    canvas.width=w*dpr; canvas.height=h*dpr;
    canvas.style.width=w+"px"; canvas.style.height=h+"px";
    var ctx=canvas.getContext("2d");
    ctx.scale(dpr,dpr);

    var pad={top:20,right:20,bottom:36,left:44};
    var cw=w-pad.left-pad.right, ch=h-pad.top-pad.bottom;
    var n=chartData.length;
    var maxY=100;

    var colors={};
    catsInLog.forEach(function(cat,i){colors[cat]=CHART_COLORS[i%CHART_COLORS.length];});
    var totalColor="#888";

    function gx(i){return pad.left+(i/(n-1||1))*cw;}
    function gy(v){return pad.top+ch-(v/maxY)*ch;}

    // Grid lines + Y labels
    var textColor=getComputedStyle(document.body).getPropertyValue("--hsg-text-secondary")||"#999";
    ctx.strokeStyle="rgba(128,128,128,.12)";
    ctx.lineWidth=1;
    for(var gi=0;gi<=4;gi++){
        var gv=gi*25;
        var yy=gy(gv);
        ctx.beginPath(); ctx.moveTo(pad.left,yy); ctx.lineTo(w-pad.right,yy); ctx.stroke();
        ctx.font="11px Source Sans 3,sans-serif";
        ctx.textAlign="right"; ctx.textBaseline="middle";
        ctx.fillStyle=textColor;
        ctx.fillText(gv+"%",pad.left-6,yy);
    }

    // 100% goal line
    ctx.beginPath();
    ctx.moveTo(pad.left,gy(100));
    ctx.lineTo(w-pad.right,gy(100));
    ctx.strokeStyle="rgba(0,180,100,.25)";
    ctx.lineWidth=2;
    ctx.setLineDash([4,4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Category lines
    catsInLog.forEach(function(cat){
        ctx.beginPath();
        for(var i=0;i<n;i++){
            var v=chartData[i].values[cat]||0;
            if(i===0) ctx.moveTo(gx(i),gy(v)); else ctx.lineTo(gx(i),gy(v));
        }
        ctx.strokeStyle=colors[cat];
        ctx.lineWidth=2;
        ctx.lineJoin="round";
        ctx.stroke();
        // Draw dots for single data point or at each point
        if(n<=3){
            for(var di=0;di<n;di++){
                var dv=chartData[di].values[cat]||0;
                ctx.beginPath();ctx.arc(gx(di),gy(dv),3,0,Math.PI*2);ctx.fillStyle=colors[cat];ctx.fill();
            }
        }
    });

    // Total line (dashed)
    ctx.beginPath();
    for(var ti=0;ti<n;ti++){
        if(ti===0) ctx.moveTo(gx(ti),gy(chartData[ti].total)); else ctx.lineTo(gx(ti),gy(chartData[ti].total));
    }
    ctx.strokeStyle=totalColor;
    ctx.lineWidth=2.5;
    ctx.setLineDash([6,4]);
    ctx.stroke();
    ctx.setLineDash([]);
    // Draw dot for total if few data points
    if(n<=3){
        for(var tdi=0;tdi<n;tdi++){
            ctx.beginPath();ctx.arc(gx(tdi),gy(chartData[tdi].total),3,0,Math.PI*2);ctx.fillStyle=totalColor;ctx.fill();
        }
    }

    // X axis labels
    ctx.fillStyle=textColor;
    ctx.font="11px Source Sans 3,sans-serif";
    ctx.textAlign="center"; ctx.textBaseline="top";
    var labelCount=Math.min(n,Math.floor(cw/60));
    var step=Math.max(1,Math.floor(n/labelCount));
    for(var li=0;li<n;li+=step){
        var dd=chartData[li].date.slice(5).split("-");
        ctx.fillText(dd[1]+"."+dd[0],gx(li),h-pad.bottom+8);
    }
    if(n>1){
        var lastD=chartData[n-1].date.slice(5).split("-");
        ctx.fillText(lastD[1]+"."+lastD[0],gx(n-1),h-pad.bottom+8);
    }

    // Legend — use current actual progress, not cumulative log
    var legend=document.getElementById("subject-chart-legend-"+subj.id);
    if(legend){
        var lh='';
        catsInLog.forEach(function(cat){
            var pct=Math.round(todayVals[cat]||0);
            lh+='<span class="progress-chart-legend-item"><span class="progress-chart-legend-color" style="background:'+colors[cat]+'"></span>'+esc(cat)+' ('+pct+'%)</span>';
        });
        var totalPctLeg=Math.round(todayTotalPct);
        lh+='<span class="progress-chart-legend-item"><span class="progress-chart-legend-color" style="background:'+totalColor+';opacity:.7"></span>'+t('total')+' ('+totalPctLeg+'%)</span>';
        legend.innerHTML=lh;
    }
}

// ---- Subject reordering in overview ----
function initOverviewDragDrop() {
    var tbody = document.getElementById("overview-tbody"); if(!tbody) return;
    var dragRow=null;
    tbody.querySelectorAll("tr[draggable]").forEach(function(row){
        row.onmousedown=function(e){row.setAttribute("draggable",e.target.classList.contains("drag-handle")?"true":"false");};
        row.ondragstart=function(e){dragRow=row;row.classList.add("dragging");e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("text/plain","");};
        row.ondragend=function(){row.classList.remove("dragging");dragRow=null;tbody.querySelectorAll("tr").forEach(function(r){r.classList.remove("drag-over-top","drag-over-bottom");});};
        row.ondragover=function(e){if(!dragRow||dragRow===row)return;e.preventDefault();e.dataTransfer.dropEffect="move";
            var rect=row.getBoundingClientRect(),mid=rect.top+rect.height/2;
            tbody.querySelectorAll("tr").forEach(function(r){r.classList.remove("drag-over-top","drag-over-bottom");});
            row.classList.add(e.clientY<mid?"drag-over-top":"drag-over-bottom");};
        row.ondragleave=function(){row.classList.remove("drag-over-top","drag-over-bottom");};
        row.ondrop=function(e){e.preventDefault();if(!dragRow||dragRow===row)return;
            var from=Number(dragRow.dataset.subjIdx),to=Number(row.dataset.subjIdx);
            var rect=row.getBoundingClientRect(),mid=rect.top+rect.height/2;
            if(e.clientY>=mid&&to<from)to++; if(e.clientY<mid&&to>from)to--;
            if(from===to) return;
            var subjects=loadSubjects(),moved=subjects.splice(from,1)[0];subjects.splice(to,0,moved);
            saveSubjects(subjects); renderAll();};
    });
}

// ---- Render: Subject tab ----
function renderSubject(subjectId) {
    var subjects=loadSubjects(), subj=subjects.find(function(s){return s.id===subjectId;});
    if(!subj) return;
    var data=loadStatuses(), notes=loadNotes();
    var c=document.getElementById("tab-"+subjectId); if(!c) return;
    var cats=subj.categories;

    // Toolbar
    var h='<div class="subject-toolbar">';
    h+='<span class="subject-header editable" data-field="name" data-id="'+subj.id+'">'+esc(subj.name)+'</span>';
    h+='<button class="edit-btn" title="Bearbeiten">✏</button>';
    h+='<div class="subject-toolbar-actions">';
    h+='<div class="exam-date-picker"><label class="exam-label">'+t('exam')+':</label>';
    h+='<input type="date" class="exam-input" data-id="'+subj.id+'" value="'+(subj.examDate||"")+'">';
    if(subj.examDate) h+='<span class="exam-badge '+countdownCls(subj.examDate)+'">'+countdownText(subj.examDate)+'</span>';
    h+='</div>';
    h+='<button class="btn btn-small btn-danger" data-action="delete-subject" data-id="'+subj.id+'">'+t('delete.subject')+'</button>';
    h+='</div></div>';

    // Category pills
    h+='<div class="category-bar"><span class="category-bar-label">'+t('categories')+':</span>';
    cats.forEach(function(cat,ci){
        h+='<span class="cat-pill"><span class="cat-pill-text editable" data-field="category" data-id="'+subj.id+'" data-ci="'+ci+'">'+esc(cat)+'</span>';
        h+='<button class="cat-pill-remove" data-action="delete-category" data-id="'+subj.id+'" data-ci="'+ci+'">\u00d7</button></span>';
    });
    h+='<button class="btn btn-tiny btn-add" data-action="add-category" data-id="'+subj.id+'">'+t('add.category')+'</button></div>';

    // Table
    h+='<table><thead><tr><th class="th-drag"></th><th>#</th><th>'+t('topic')+'</th>';
    cats.forEach(function(cat,ci){h+='<th class="bulk-header" draggable="true" data-bulk-subject="'+subj.id+'" data-bulk-cat="'+esc(cat)+'" data-cat-idx="'+ci+'" title="Klicken: alle setzen | Ziehen: Reihenfolge \u00e4ndern" style="cursor:grab">'+esc(cat)+'</th>';});
    h+='<th>'+t('progress')+'</th></tr></thead><tbody data-subject="'+subj.id+'">';

    var totalCols=cats.length+4;
    if(!subj.topics.length) h+='<tr><td colspan="'+totalCols+'" class="empty-msg">'+t('no.topics')+'</td></tr>';

    subj.topics.forEach(function(topic,i){
        var nk=getNoteKey(subj.id,i), nt=notes[nk]||"", hn=nt.length>0;
        h+='<tr draggable="true" data-idx="'+i+'">';
        h+='<td class="drag-handle" title="Ziehen zum Verschieben">&#9776;</td>';
        h+='<td>'+(i+1)+'</td>';
        h+='<td class="topic-name-cell"><span class="editable" data-field="topic" data-id="'+subj.id+'" data-ti="'+i+'">'+esc(topic)+'</span>';
        h+='<button class="edit-btn" title="Bearbeiten">✏</button>';
        h+='<button class="row-delete" data-action="delete-topic" data-id="'+subj.id+'" data-ti="'+i+'">\u00d7</button></td>';
        cats.forEach(function(cat){
            var st=getStatus(data,subj.id,i,cat);
            h+='<td class="status-cell s-'+st+'" data-subject="'+subj.id+'" data-topic="'+i+'" data-cat="'+cat+'"></td>';
        });
        h+='<td class="progress-cell topic-bulk '+pctCls(calcTopicPct(data,subj.id,i,cats))+'" data-subject="'+subj.id+'" data-topic="'+i+'" title="Ganzes Thema setzen">'+pctStr(calcTopicPct(data,subj.id,i,cats))+'</td></tr>';
    });

    if(subj.topics.length){
        h+='</tbody><tfoot><tr><td></td><td></td><td>'+t('total.progress')+'</td>';
        cats.forEach(function(cat){var v=calcCatPct(data,subj.id,cat,subj.topics.length); h+='<td class="'+pctCls(v)+'">'+pctStr(v)+'</td>';});
        h+='<td class="'+pctCls(calcSubjPct(data,subj))+'">'+pctStr(calcSubjPct(data,subj))+'</td></tr></tfoot>';
    } else h+='</tbody>';
    h+='</table><div class="add-topic-bar"><button class="btn btn-add" data-action="add-topic" data-id="'+subj.id+'">'+t('add.topic')+'</button></div>';

    // Subject progress chart
    h+='<div class="progress-chart-card card">';
    h+='<h2 class="card-title">'+t('progress.over.time')+'</h2>';
    h+='<div class="progress-chart-wrap"><canvas id="subject-chart-'+subj.id+'"></canvas></div>';
    h+='<div id="subject-chart-legend-'+subj.id+'" class="progress-chart-legend"></div>';
    h+='</div>';

    c.innerHTML=h;

    // ---- Event listeners ----
    c.querySelectorAll(".status-cell").forEach(function(cell){cell.onclick=function(e){e.stopPropagation();showStatusDropdown(cell);};});
    c.querySelectorAll(".editable").forEach(function(el){el.ondblclick=function(){startInlineEdit(el);};});
    c.querySelectorAll(".edit-btn").forEach(function(btn){btn.onclick=function(e){e.stopPropagation();startInlineEdit(btn.previousElementSibling);};});
    c.querySelectorAll("[data-action]").forEach(function(b){b.onclick=function(e){e.stopPropagation();handleAction(b.dataset.action,b.dataset);};});
    var ei=c.querySelector(".exam-input"); if(ei) ei.onchange=function(){
        var ss=loadSubjects(),s=ss.find(function(x){return x.id===ei.dataset.id;});
        if(s){s.examDate=ei.value||null;saveSubjects(ss);renderSubjectAndOverview(subjectId);}};
    c.querySelectorAll(".bulk-header").forEach(function(th){th.onclick=function(e){e.stopPropagation();showBulkDropdown(th,th.dataset.bulkSubject,th.dataset.bulkCat);};});
    c.querySelectorAll(".topic-bulk").forEach(function(cell){cell.onclick=function(e){e.stopPropagation();showTopicBulkDropdown(cell,cell.dataset.subject,Number(cell.dataset.topic));};});
    initTopicDragDrop(c,subjectId);
    initCategoryDragDrop(c,subjectId);
    renderSubjectChart(subj);
}

// ---- Selective render (perf fix) ----
function renderSubjectAndOverview(sid) {
    renderSubject(sid);
    renderOverview();
    renderStudyNext();
}

// ---- Topic drag & drop ----
function initTopicDragDrop(container,subjectId) {
    var tbody=container.querySelector("tbody[data-subject]"); if(!tbody) return;
    var dragRow=null;
    tbody.querySelectorAll("tr[draggable]").forEach(function(row){
        row.onmousedown=function(e){row.setAttribute("draggable",e.target.classList.contains("drag-handle")?"true":"false");};
        row.ondragstart=function(e){dragRow=row;row.classList.add("dragging");e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("text/plain","");};
        row.ondragend=function(){row.classList.remove("dragging");dragRow=null;tbody.querySelectorAll("tr").forEach(function(r){r.classList.remove("drag-over-top","drag-over-bottom");});};
        row.ondragover=function(e){if(!dragRow||dragRow===row)return;e.preventDefault();
            var rect=row.getBoundingClientRect(),mid=rect.top+rect.height/2;
            tbody.querySelectorAll("tr").forEach(function(r){r.classList.remove("drag-over-top","drag-over-bottom");});
            row.classList.add(e.clientY<mid?"drag-over-top":"drag-over-bottom");};
        row.ondragleave=function(){row.classList.remove("drag-over-top","drag-over-bottom");};
        row.ondrop=function(e){e.preventDefault();if(!dragRow||dragRow===row)return;
            var from=Number(dragRow.dataset.idx),to=Number(row.dataset.idx);
            var rect=row.getBoundingClientRect(),mid=rect.top+rect.height/2;
            if(e.clientY>=mid&&to<from)to++; if(e.clientY<mid&&to>from)to--;
            reorderTopic(subjectId,from,to);};
    });
}

function reorderTopic(sid,from,to) {
    if(from===to) return;
    var subjects=loadSubjects(),subj=subjects.find(function(s){return s.id===sid;}); if(!subj) return;
    var topic=subj.topics.splice(from,1)[0]; subj.topics.splice(to,0,topic);
    // Build permutation
    var order=[]; for(var i=0;i<=Math.max(from,to,subj.topics.length);i++) order.push(i);
    var mv=order.splice(from,1)[0]; order.splice(to,0,mv);
    // Remap statuses
    var st=loadStatuses(),pf=sid+".",old={};
    Object.keys(st).forEach(function(k){if(!k.startsWith(pf))return;var r=k.slice(pf.length),d=r.indexOf(".");var idx=Number(r.slice(0,d)),cat=r.slice(d+1);if(!old[idx])old[idx]={};old[idx][cat]=st[k];});
    var ns={}; Object.keys(st).forEach(function(k){if(!k.startsWith(pf))ns[k]=st[k];});
    for(var ni=0;ni<subj.topics.length;ni++){var oi=order[ni];if(old[oi])Object.keys(old[oi]).forEach(function(cat){ns[pf+ni+"."+cat]=old[oi][cat];});}
    saveStatuses(ns);
    // Remap notes
    var an=loadNotes(),np=sid+".",on={};
    Object.keys(an).forEach(function(k){if(k.startsWith(np)){on[Number(k.slice(np.length))]=an[k];delete an[k];}});
    for(var j=0;j<subj.topics.length;j++){if(on[order[j]]!==undefined) an[np+j]=on[order[j]];}
    saveNotes(an); saveSubjects(subjects); renderSubjectAndOverview(sid);
}

function initCategoryDragDrop(container,subjectId) {
    var thead=container.querySelector("thead"); if(!thead) return;
    var ths=thead.querySelectorAll("th[data-cat-idx]");
    var dragTh=null;
    ths.forEach(function(th){
        th.ondragstart=function(e){dragTh=th;th.style.opacity="0.4";e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("text/plain","");};
        th.ondragend=function(){th.style.opacity="";dragTh=null;ths.forEach(function(t){t.classList.remove("drag-over-left","drag-over-right");});};
        th.ondragover=function(e){if(!dragTh||dragTh===th)return;e.preventDefault();
            var rect=th.getBoundingClientRect(),mid=rect.left+rect.width/2;
            ths.forEach(function(t){t.classList.remove("drag-over-left","drag-over-right");});
            th.classList.add(e.clientX<mid?"drag-over-left":"drag-over-right");};
        th.ondragleave=function(){th.classList.remove("drag-over-left","drag-over-right");};
        th.ondrop=function(e){e.preventDefault();if(!dragTh||dragTh===th)return;
            var from=Number(dragTh.dataset.catIdx),to=Number(th.dataset.catIdx);
            var rect=th.getBoundingClientRect(),mid=rect.left+rect.width/2;
            if(e.clientX>=mid&&to<from)to++; if(e.clientX<mid&&to>from)to--;
            reorderCategory(subjectId,from,to);};
    });
}

function reorderCategory(sid,from,to) {
    if(from===to) return;
    var subjects=loadSubjects(),subj=subjects.find(function(s){return s.id===sid;}); if(!subj) return;
    var cat=subj.categories.splice(from,1)[0]; subj.categories.splice(to,0,cat);
    saveSubjects(subjects); renderSubjectAndOverview(sid);
}

// ---- Inline editing ----
function startInlineEdit(el) {
    if(el.querySelector("input")) return;
    var cur=el.textContent, inp=document.createElement("input");
    inp.type="text"; inp.className="inline-edit-input"; inp.value=cur;
    el.textContent=""; el.appendChild(inp); inp.focus(); inp.select();
    function commit(){var v=inp.value.trim();if(!v)v=cur;el.textContent=v;saveInlineEdit(el.dataset,v);}
    inp.onblur=commit;
    inp.onkeydown=function(e){if(e.key==="Enter")inp.blur();if(e.key==="Escape"){inp.value=cur;inp.blur();}};
}
function saveInlineEdit(ds,val) {
    var subjects=loadSubjects(),subj=subjects.find(function(s){return s.id===ds.id;}); if(!subj) return;
    if(ds.field==="name") subj.name=val;
    else if(ds.field==="topic") subj.topics[Number(ds.ti)]=val;
    else if(ds.field==="category"){
        var oldC=subj.categories[Number(ds.ci)]; subj.categories[Number(ds.ci)]=val;
        if(oldC!==val){var st=loadStatuses(),u={};Object.keys(st).forEach(function(k){var nk=k;if(k.startsWith(subj.id+".")&&k.endsWith("."+oldC))nk=k.slice(0,k.length-oldC.length)+val;u[nk]=st[k];});saveStatuses(u);}
    }
    saveSubjects(subjects); renderAll();
}

// ---- Actions (add/delete with modals + undo) ----
function handleAction(action,ds) {
    var subjects=loadSubjects(),subj,idx;
    if(ds.id){subj=subjects.find(function(s){return s.id===ds.id;});idx=subjects.indexOf(subj);}

    switch(action) {
    case "delete-subject":
        modalConfirm("Fach l\u00f6schen","\""+subj.name+"\" und alle Daten l\u00f6schen?",function(){
            var backup={subj:JSON.parse(JSON.stringify(subj)),idx:idx,statuses:{},notes:{}};
            var st=loadStatuses(),cl={},pf=subj.id+".";
            Object.keys(st).forEach(function(k){if(k.startsWith(pf)){backup.statuses[k]=st[k];}else{cl[k]=st[k];}});
            saveStatuses(cl);
            var no=loadNotes(),cn={};
            Object.keys(no).forEach(function(k){if(k.startsWith(pf)){backup.notes[k]=no[k];}else{cn[k]=no[k];}});
            saveNotes(cn);
            subjects.splice(idx,1); saveSubjects(subjects); activeTab="overview"; renderAll();
            showToast("Fach gel\u00f6scht",function(){
                var ss=loadSubjects(); ss.splice(backup.idx,0,backup.subj); saveSubjects(ss);
                var s2=loadStatuses(); Object.keys(backup.statuses).forEach(function(k){s2[k]=backup.statuses[k];}); saveStatuses(s2);
                var n2=loadNotes(); Object.keys(backup.notes).forEach(function(k){n2[k]=backup.notes[k];}); saveNotes(n2);
                activeTab=backup.subj.id; renderAll();
            });
        }); break;

    case "add-topic":
        modalPrompt("Neues Thema","Thema-Name","",function(v){
            var ss=loadSubjects(),s=ss.find(function(x){return x.id===ds.id;});
            s.topics.push(v); saveSubjects(ss); renderSubjectAndOverview(ds.id);
        }); break;

    case "delete-topic":
        var ti=Number(ds.ti), topicName=subj.topics[ti];
        modalConfirm("Thema l\u00f6schen","\""+topicName+"\" l\u00f6schen?",function(){
            // Backup for undo
            var backup={subj:subj.id,ti:ti,name:topicName,statuses:{},note:null};
            var st=loadStatuses(),ns={},pf=subj.id+".";
            Object.keys(st).forEach(function(k){if(!k.startsWith(pf)){ns[k]=st[k];return;}
                var r=k.slice(pf.length),d=r.indexOf("."),tidx=Number(r.slice(0,d)),cat=r.slice(d+1);
                if(tidx===ti){backup.statuses[cat]=st[k];return;}
                if(tidx>ti)tidx--; ns[pf+tidx+"."+cat]=st[k];});
            saveStatuses(ns);
            var an=loadNotes(),nn={},np=pf;
            Object.keys(an).forEach(function(k){if(!k.startsWith(np)){nn[k]=an[k];return;}
                var ni=Number(k.slice(np.length));
                if(ni===ti){backup.note=an[k];return;}
                if(ni>ti)ni--; nn[np+ni]=an[k];});
            saveNotes(nn);
            subj.topics.splice(ti,1); saveSubjects(loadSubjects().map(function(s){return s.id===subj.id?subj:s;}));
            renderSubjectAndOverview(subj.id);
            showToast("Thema gel\u00f6scht",function(){
                var ss=loadSubjects(),s=ss.find(function(x){return x.id===backup.subj;});
                // Shift statuses and notes back up
                var st2=loadStatuses(),ns2={};
                Object.keys(st2).forEach(function(k){if(!k.startsWith(pf)){ns2[k]=st2[k];return;}
                    var r=k.slice(pf.length),d=r.indexOf("."),tidx=Number(r.slice(0,d)),cat=r.slice(d+1);
                    if(tidx>=backup.ti) tidx++; ns2[pf+tidx+"."+cat]=st2[k];});
                Object.keys(backup.statuses).forEach(function(cat){ns2[pf+backup.ti+"."+cat]=backup.statuses[cat];});
                saveStatuses(ns2);
                var an2=loadNotes(),nn2={};
                Object.keys(an2).forEach(function(k){if(!k.startsWith(np)){nn2[k]=an2[k];return;}
                    var ni=Number(k.slice(np.length)); if(ni>=backup.ti) ni++; nn2[np+ni]=an2[k];});
                if(backup.note) nn2[np+backup.ti]=backup.note;
                saveNotes(nn2);
                s.topics.splice(backup.ti,0,backup.name); saveSubjects(ss);
                renderSubjectAndOverview(backup.subj);
            });
        }); break;

    case "add-category":
        modalPrompt("Neue Kategorie","Kategorie-Name","",function(v){
            var ss=loadSubjects(),s=ss.find(function(x){return x.id===ds.id;});
            s.categories.push(v); saveSubjects(ss); renderSubjectAndOverview(ds.id);
        }); break;

    case "delete-category":
        var ci=Number(ds.ci), catName=subj.categories[ci];
        modalConfirm("Kategorie l\u00f6schen","\""+catName+"\" l\u00f6schen?",function(){
            var st=loadStatuses(),ns={};
            Object.keys(st).forEach(function(k){if(k.startsWith(subj.id+".")&&k.endsWith("."+catName))return;ns[k]=st[k];});
            saveStatuses(ns); subj.categories.splice(ci,1);
            saveSubjects(loadSubjects().map(function(s){return s.id===subj.id?subj:s;}));
            renderSubjectAndOverview(subj.id);
        }); break;
    }
}

// ---- Add subject modal (with category setup) ----
function showAddSubjectModal() {
    var h='<h3 class="modal-title">Neues Fach hinzuf\u00fcgen</h3>';
    h+='<label class="modal-label">Name</label><input class="modal-input" id="new-subj-name" type="text" placeholder="z.B. Statistik">';
    h+='<label class="modal-label">Kategorien <span class="modal-hint">(kommagetrennt)</span></label>';
    h+='<input class="modal-input" id="new-subj-cats" type="text" placeholder="z.B. Vorlesung, \u00dcbungsserie, Altklausuren" value="Vorlesung, \u00dcbungsserie, Altklausuren">';
    h+='<div class="modal-actions"><button class="btn btn-small modal-cancel">Abbrechen</button><button class="btn btn-small btn-add" id="new-subj-ok">Hinzuf\u00fcgen</button></div>';
    showModal(h, function(md){
        md.querySelector(".modal-cancel").onclick=closeModal;
        md.querySelector("#new-subj-ok").onclick=function(){
            var name=document.getElementById("new-subj-name").value.trim();
            var catsRaw=document.getElementById("new-subj-cats").value;
            if(!name) return;
            var cats=catsRaw.split(",").map(function(c){return c.trim();}).filter(function(c){return c;});
            if(!cats.length) cats=["Vorlesung","\u00dcbungsserie","Altklausuren"];
            var subjects=loadSubjects();
            var ns={id:genId(),name:name,categories:cats,topics:[]};
            subjects.push(ns); saveSubjects(subjects); activeTab=ns.id; closeModal(); renderAll();
        };
        document.getElementById("new-subj-name").onkeydown=function(e){if(e.key==="Enter")md.querySelector("#new-subj-ok").click();};
    });
}

function markAllSubject(sid) {
    var subjects=loadSubjects(),subj=subjects.find(function(s){return s.id===sid;}); if(!subj) return;
    var data=loadStatuses(), ov=calcSubjPct(data,subj), target=ov>=1?"none":"done";
    for(var i=0;i<subj.topics.length;i++) subj.categories.forEach(function(cat){
        var prev=getStatus(data,subj.id,i,cat);
        setStatus(data,subj.id,i,cat,target);
        if((target==="done"||target==="rep1"||target==="rep2")&&prev!==target) logCompletion(subj.id,i,cat);
    });
    saveStatuses(data); renderAll();
}

// ---- Bulk mark column ----
function showBulkDropdown(anchor,sid,cat) {
    closeDropdown();
    var bd=document.createElement("div");bd.className="dropdown-backdrop";bd.onclick=closeDropdown;document.body.appendChild(bd);
    var dd=document.createElement("div");dd.className="status-dropdown";
    [{l:t('all.done'),s:"done",ic:"\u2713",c:"i-done"},{l:t('all.progress'),s:"progress",ic:"\u270F",c:"i-progress"},{l:t('all.rep1'),s:"rep1",ic:"\u2781",c:"i-rep1"},{l:t('all.rep2'),s:"rep2",ic:"\u2782",c:"i-rep2"},{l:t('all.reset'),s:"none",ic:"\u2014",c:"i-none"}].forEach(function(o){
        var opt=document.createElement("div");opt.className="dropdown-option";
        opt.innerHTML='<span class="option-icon '+o.c+'">'+o.ic+'</span><span>'+o.l+'</span>';
        opt.onclick=function(e){e.stopPropagation();bulkSetCat(sid,cat,o.s);closeDropdown();};
        dd.appendChild(opt);
    });
    document.body.appendChild(dd);
    var r=anchor.getBoundingClientRect(),dr=dd.getBoundingClientRect();
    var top=r.bottom+4,left=r.left+r.width/2-dr.width/2;
    if(left<8)left=8;if(left+dr.width>innerWidth-8)left=innerWidth-dr.width-8;
    if(top+dr.height>innerHeight-8)top=r.top-dr.height-4;
    dd.style.top=top+scrollY+"px";dd.style.left=left+scrollX+"px";
}
function bulkSetCat(sid,cat,status) {
    var subjects=loadSubjects(),subj=subjects.find(function(s){return s.id===sid;}); if(!subj) return;
    var d=loadStatuses();
    for(var i=0;i<subj.topics.length;i++){
        var prev=getStatus(d,subj.id,i,cat);
        setStatus(d,subj.id,i,cat,status);
        if((status==="done"||status==="rep1"||status==="rep2")&&prev!==status) logCompletion(subj.id,i,cat);
    }
    saveStatuses(d); renderSubjectAndOverview(sid);
}

// ---- Topic bulk dropdown (set whole topic row) ----
function showTopicBulkDropdown(anchor,sid,ti) {
    closeDropdown();
    var bd=document.createElement("div");bd.className="dropdown-backdrop";bd.onclick=closeDropdown;document.body.appendChild(bd);
    var dd=document.createElement("div");dd.className="status-dropdown";
    [{l:t('topic.all.done'),s:"done",ic:"\u2713",c:"i-done"},{l:t('topic.all.progress'),s:"progress",ic:"\u270F",c:"i-progress"},{l:t('topic.all.review'),s:"review",ic:"\u21BA",c:"i-review"},{l:t('topic.all.rep1'),s:"rep1",ic:"\u2781",c:"i-rep1"},{l:t('topic.all.rep2'),s:"rep2",ic:"\u2782",c:"i-rep2"},{l:t('topic.reset'),s:"none",ic:"\u2014",c:"i-none"}].forEach(function(o){
        var opt=document.createElement("div");opt.className="dropdown-option";
        opt.innerHTML='<span class="option-icon '+o.c+'">'+o.ic+'</span><span>'+o.l+'</span>';
        opt.onclick=function(e){e.stopPropagation();bulkSetTopic(sid,ti,o.s);closeDropdown();};
        dd.appendChild(opt);
    });
    document.body.appendChild(dd);
    var r=anchor.getBoundingClientRect(),dr=dd.getBoundingClientRect();
    var top=r.bottom+4,left=r.left+r.width/2-dr.width/2;
    if(left<8)left=8;if(left+dr.width>innerWidth-8)left=innerWidth-dr.width-8;
    if(top+dr.height>innerHeight-8)top=r.top-dr.height-4;
    dd.style.top=top+scrollY+"px";dd.style.left=left+scrollX+"px";
}
function bulkSetTopic(sid,ti,status) {
    var subjects=loadSubjects(),subj=subjects.find(function(s){return s.id===sid;}); if(!subj) return;
    var d=loadStatuses();
    subj.categories.forEach(function(cat){
        var prev=getStatus(d,subj.id,ti,cat);
        setStatus(d,subj.id,ti,cat,status);
        if((status==="done"||status==="rep1"||status==="rep2")&&prev!==status) logCompletion(subj.id,ti,cat);
    });
    saveStatuses(d); renderSubjectAndOverview(sid);
}

// ---- Status dropdown ----
function DLABELS_get(s){return{none:t('not.started'),progress:t('in.progress'),review:t('review'),done:t('done'),rep1:t('rep1'),rep2:t('rep2')}[s]||s;}
var DICONS={none:"\u2014",progress:"\u270F",review:"\u21BA",done:"\u2713",rep1:"\u2781",rep2:"\u2782"};
function closeDropdown(){var e=document.querySelector(".status-dropdown");if(e)e.remove();var b=document.querySelector(".dropdown-backdrop");if(b)b.remove();}

function showStatusDropdown(cell) {
    closeDropdown();
    var sk=cell.dataset.subject,ti=Number(cell.dataset.topic),cat=cell.dataset.cat;
    var d=loadStatuses(),cur=getStatus(d,sk,ti,cat);
    var bd=document.createElement("div");bd.className="dropdown-backdrop";bd.onclick=closeDropdown;document.body.appendChild(bd);
    var dd=document.createElement("div");dd.className="status-dropdown";
    STATUS_CYCLE.forEach(function(st){
        var opt=document.createElement("div");opt.className="dropdown-option"+(st===cur?" selected":"");
        opt.innerHTML='<span class="option-icon i-'+st+'">'+DICONS[st]+'</span><span>'+DLABELS_get(st)+'</span>';
        opt.onclick=function(e){e.stopPropagation();
            var d2=loadStatuses(),prev=getStatus(d2,sk,ti,cat);
            setStatus(d2,sk,ti,cat,st); saveStatuses(d2);
            if((st==="done"||st==="rep1"||st==="rep2")&&prev!==st) logCompletion(sk,ti,cat);
            closeDropdown(); renderSubjectAndOverview(sk);};
        dd.appendChild(opt);
    });
    document.body.appendChild(dd);
    var r=cell.getBoundingClientRect(),dr=dd.getBoundingClientRect();
    var top=r.bottom+4,left=r.left+r.width/2-dr.width/2;
    if(left<8)left=8;if(left+dr.width>innerWidth-8)left=innerWidth-dr.width-8;
    if(top+dr.height>innerHeight-8)top=r.top-dr.height-4;
    dd.style.top=top+scrollY+"px";dd.style.left=left+scrollX+"px";
}


// ---- Reset semester ----
function resetSemester() {
    var iStyle = "width:100%;font-family:inherit;font-size:.95rem;padding:10px 12px;border:1px solid var(--hsg-border);border-radius:var(--hsg-radius);background:var(--hsg-white);color:var(--hsg-text);box-sizing:border-box;margin-bottom:16px;cursor:pointer;";
    var h = '<h3 class="modal-title">Semester zur\u00fccksetzen</h3>';
    h += '<p class="modal-text" style="margin-bottom:14px;">Was soll zur\u00fcckgesetzt werden?</p>';
    h += '<select id="reset-mode" style="'+iStyle+'">';
    h += '<option value="soft">Nur Eintr\u00e4ge l\u00f6schen \u2014 F\u00e4cher &amp; Themen bleiben</option>';
    h += '<option value="hard">Alles zur\u00fccksetzen \u2014 App komplett leeren</option>';
    h += '</select>';
    h += '<p id="reset-desc" class="modal-text" style="font-size:.82rem;color:#aaa;margin-bottom:18px;">Status, Notizen, Lernlog, Planer und To-Dos werden gel\u00f6scht. F\u00e4cher und Themen bleiben erhalten.</p>';
    h += '<div class="modal-actions"><button class="btn btn-small modal-cancel">Abbrechen</button><button class="btn btn-small btn-danger" id="reset-confirm-btn">Zur\u00fccksetzen</button></div>';
    showModal(h, function(md) {
        var sel = md.querySelector("#reset-mode");
        var desc = md.querySelector("#reset-desc");
        var descriptions = {
            soft: 'Status, Notizen, Lernlog, Planer und To-Dos werden gel\u00f6scht. F\u00e4cher und Themen bleiben erhalten.',
            hard: 'Alle Daten werden gel\u00f6scht \u2014 F\u00e4cher, Themen, Status, Notizen, Planer, To-Dos und Lernlog. Die App ist danach komplett leer.'
        };
        sel.onchange = function(){ desc.textContent = descriptions[sel.value]; };
        md.querySelector(".modal-cancel").onclick = closeModal;
        md.querySelector("#reset-confirm-btn").onclick = function(){
            var mode = sel.value;
            closeModal();
            if (mode === 'hard') {
                saveSubjects([]);
                saveStatuses({});
                saveNotes({});
                saveStudyLog([]);
                savePlanner([]);
                saveTodos([]);
                activeTab = 'overview';
                showToast("App komplett zur\u00fcckgesetzt");
                showOnboarding();
                return;
            } else {
                saveStatuses({});
                saveNotes({});
                saveStudyLog([]);
                savePlanner([]);
                saveTodos([]);
                showToast("Semester zur\u00fcckgesetzt");
            }
            renderAll();
        };
    });
}



// ============================================================
// TO-DO
// ============================================================

var todoFilter = 'all'; // 'all' | 'open' | 'done'

function renderTodos() {
    var c = document.getElementById("tab-todos"); if (!c) return;
    var todos = loadTodos();
    var subjects = loadSubjects();
    var today = new Date(); today.setHours(0,0,0,0);

    // Sort: open first (by priority then due), done last
    var prioOrder = {hoch:0, mittel:1, niedrig:2, '':3};
    var open = todos.filter(function(t){return !t.done;}).sort(function(a,b){
        var pd = (prioOrder[a.priority]||3)-(prioOrder[b.priority]||3);
        if (pd!==0) return pd;
        if (a.due && b.due) return a.due.localeCompare(b.due);
        if (a.due) return -1; if (b.due) return 1;
        return 0;
    });
    var done = todos.filter(function(t){return t.done;}).sort(function(a,b){
        return (b.completedAt||'').localeCompare(a.completedAt||'');
    });

    var visible = todoFilter==='open' ? open : todoFilter==='done' ? done : open.concat(done);

    var h = '<div class="card">';
    h += '<div class="todo-header">';
    h += '<h2 class="card-title" style="margin:0">To-Do</h2>';
    h += '<button class="btn btn-add" id="todo-add-btn">+ Aufgabe</button>';
    h += '</div>';

    // Filter pills
    h += '<div class="todo-filter-bar">';
    ['all','open','done'].forEach(function(f){
        var label = {all:'Alle ('+todos.length+')', open:'Offen ('+open.length+')', done:'Erledigt ('+done.length+')'}[f];
        h += '<button class="todo-filter-btn'+(todoFilter===f?' active':'')+'" data-filter="'+f+'">'+label+'</button>';
    });
    h += '</div>';

    if (!visible.length) {
        h += '<p class="todo-empty">'+(todoFilter==='done'?'Noch nichts erledigt.':'Keine offenen Aufgaben. 🎉')+'</p>';
    } else {
        h += '<ul class="todo-list">';
        visible.forEach(function(t){
            var subj = t.subjectId ? subjects.find(function(s){return s.id===t.subjectId;}) : null;
            var subjName = subj ? subj.name : '';
            var overdue = !t.done && t.due && t.due < today.toISOString().slice(0,10);
            var dueToday = !t.done && t.due === today.toISOString().slice(0,10);

            h += '<li class="todo-item'+(t.done?' todo-item--done':'')+'" data-id="'+t.id+'">';
            h += '<button class="todo-check'+(t.done?' todo-check--done':'')+'" data-id="'+t.id+'" title="'+(t.done?'Als offen markieren':'Erledigen')+'">';
            h += t.done ? '&#10003;' : '';
            h += '</button>';
            h += '<div class="todo-body">';
            h += '<div class="todo-title">'+esc(t.title)+'</div>';
            h += '<div class="todo-meta">';
            if (t.priority) h += '<span class="todo-prio todo-prio--'+t.priority+'">'+{hoch:'Hoch',mittel:'Mittel',niedrig:'Niedrig'}[t.priority]+'</span>';
            if (subjName) h += '<span class="todo-subject">'+esc(subjName)+'</span>';
            if (t.due) h += '<span class="todo-due'+(overdue?' todo-due--overdue':dueToday?' todo-due--today':'')+'">'+(overdue?'Überfällig: ':dueToday?'Heute: ':'')+formatDate(t.due)+(t.time?' '+esc(t.time):'')+'</span>';
            if (t.note) h += '<span class="todo-note">'+esc(t.note)+'</span>';
            h += '</div></div>';
            h += '<div class="todo-actions">';
            h += '<button class="todo-edit-btn" data-id="'+t.id+'" title="Bearbeiten">✎</button>';
            h += '<button class="todo-delete-btn" data-id="'+t.id+'" title="Löschen">×</button>';
            h += '</div>';
            h += '</li>';
        });
        h += '</ul>';
    }
    h += '</div>';
    c.innerHTML = h;

    document.getElementById("todo-add-btn").onclick = function(){ openTodoModal(null); };

    c.querySelectorAll(".todo-filter-btn").forEach(function(btn){
        btn.onclick = function(){ todoFilter = btn.dataset.filter; renderTodos(); };
    });
    c.querySelectorAll(".todo-check").forEach(function(btn){
        btn.onclick = function(){
            var ts = loadTodos();
            var t = ts.find(function(x){return x.id===btn.dataset.id;});
            if (!t) return;
            t.done = !t.done;
            t.completedAt = t.done ? new Date().toISOString() : null;
            saveTodos(ts); renderTodos();
        };
    });
    c.querySelectorAll(".todo-edit-btn").forEach(function(btn){
        btn.onclick = function(){
            var t = loadTodos().find(function(x){return x.id===btn.dataset.id;});
            if (t) openTodoModal(t);
        };
    });
    c.querySelectorAll(".todo-delete-btn").forEach(function(btn){
        btn.onclick = function(){
            var ts = loadTodos().filter(function(x){return x.id!==btn.dataset.id;});
            saveTodos(ts); renderTodos();
        };
    });
}

function formatDate(ds) {
    if (!ds) return '';
    var d = new Date(ds+'T00:00:00');
    return d.toLocaleDateString("de-CH",{day:"numeric",month:"short",year:"numeric"});
}

function openTodoModal(existing) {
    var subjects = loadSubjects();
    var iStyle = "width:100%;font-family:inherit;font-size:.95rem;padding:10px 12px;border:1px solid var(--hsg-border);border-radius:var(--hsg-radius);background:var(--hsg-white);color:var(--hsg-text);box-sizing:border-box;";

    var h = '<h3 style="margin-bottom:4px;font-size:1.1rem;">'+(existing?'Aufgabe bearbeiten':'Neue Aufgabe')+'</h3>';
    h += '<p style="font-size:.82rem;color:#aaa;margin-bottom:18px;">'+(existing?'Änderungen speichern':'Aufgabe hinzufügen')+'</p>';
    h += '<div style="display:flex;flex-direction:column;gap:10px;">';
    h += '<input type="text" id="tm-title" placeholder="Titel*" style="'+iStyle+'" value="'+esc(existing?existing.title:'')+'">';
    h += '<select id="tm-prio" style="'+iStyle+'">';
    ['','hoch','mittel','niedrig'].forEach(function(p){
        var label = p===''?t('prio.select'):{hoch:t('prio.high'),mittel:t('prio.medium'),niedrig:t('prio.low')}[p];
        h += '<option value="'+p+'"'+(existing&&existing.priority===p?' selected':'')+'>'+label+'</option>';
    });
    h += '</select>';
    h += '<select id="tm-subj" style="'+iStyle+'"><option value="">Fach (optional)</option>';
    subjects.forEach(function(s){ h += '<option value="'+s.id+'"'+(existing&&existing.subjectId===s.id?' selected':'')+'>'+esc(s.name)+'</option>'; });
    h += '</select>';
    h += '<div style="display:flex;gap:8px;">';
    h += '<input type="date" id="tm-due" style="'+iStyle+'flex:1;" value="'+(existing&&existing.due?existing.due:'')+'">';
    h += '<input type="time" id="tm-time" style="'+iStyle+'flex:1;" value="'+(existing&&existing.time?existing.time:'')+'">';
    h += '</div>';
    h += '<input type="text" id="tm-note" placeholder="Notiz (optional)" style="'+iStyle+'" value="'+esc(existing&&existing.note?existing.note:'')+'">';
    h += '<div class="modal-actions" style="margin-top:4px;">';
    h += '<button id="tm-cancel" class="btn btn-small modal-cancel">Abbrechen</button>';
    h += '<button id="tm-save" class="btn btn-small btn-add">'+(existing?'Speichern':'Hinzufügen')+'</button>';
    h += '</div>';
    h += '</div>';

    showModal(h, function(md) {
        md.querySelector("#tm-cancel").onclick = closeModal;
        md.querySelector("#tm-save").onclick = function(){
            var title = document.getElementById("tm-title").value.trim();
            if (!title) { document.getElementById("tm-title").style.borderColor="var(--hsg-danger)"; return; }
            var ts = loadTodos();
            if (existing) {
                var t = ts.find(function(x){return x.id===existing.id;});
                if (t) {
                    t.title = title;
                    t.priority = document.getElementById("tm-prio").value;
                    t.subjectId = document.getElementById("tm-subj").value;
                    t.due = document.getElementById("tm-due").value;
                    t.time = document.getElementById("tm-time").value;
                    t.note = document.getElementById("tm-note").value.trim();
                }
            } else {
                ts.push({
                    id: genId(),
                    title: title,
                    priority: document.getElementById("tm-prio").value,
                    subjectId: document.getElementById("tm-subj").value,
                    due: document.getElementById("tm-due").value,
                    time: document.getElementById("tm-time").value,
                    note: document.getElementById("tm-note").value.trim(),
                    done: false,
                    createdAt: new Date().toISOString(),
                    completedAt: null
                });
            }
            saveTodos(ts);
            closeModal();
            renderOverview();
        };
    });
}


// ---- Master render ----
function renderAll() {
    if (isMobile() && typeof renderMobileAll === 'function') {
        // Hide desktop, show mobile
        document.getElementById('mobile-app').style.display = 'flex';
        ['.hsg-header','.hsg-nav','.content','.hsg-footer'].forEach(function(s){var el=document.querySelector(s);if(el)el.style.display='none';});
        renderMobileAll();
        return;
    }
    // Desktop path — hide mobile, show desktop
    var mApp = document.getElementById('mobile-app');
    if (mApp) mApp.style.display = 'none';
    ['.hsg-header','.hsg-nav','.content','.hsg-footer'].forEach(function(s){var el=document.querySelector(s);if(el)el.style.display='';});
    renderTabs(); renderContainers(); renderStudyNext(); renderOverview();
    loadSubjects().forEach(function(s){renderSubject(s.id);});
    // Re-render active tab's chart after DOM is visible
    setTimeout(function(){
        if(activeTab==="overview"){
            renderProgressChart();
        } else {
            var subj=loadSubjects().find(function(s){return s.id===activeTab;});
            if(subj) renderSubjectChart(subj);
        }
    },50);
}

// ---- Onboarding ----
function showOnboarding() {
    var main = document.querySelector(".content");
    if (!main) return;

    var h = '<div class="onboarding">';
    h += '<div class="onboarding-hero">';
    h += '<div class="onboarding-icon">\ud83c\udf93</div>';
    h += '<h1 class="onboarding-title">'+t('onboarding.title')+'</h1>';
    h += '<p class="onboarding-subtitle">'+t('onboarding.subtitle')+'</p>';
    h += '</div>';

    h += '<div class="onboarding-features">';
    h += '<div class="onboarding-feature">';
    h += '<div class="onboarding-feature-icon">\ud83d\udcca</div>';
    h += '<h3>'+t('onboarding.track')+'</h3>';
    h += '<p>'+t('onboarding.track.desc')+'</p>';
    h += '</div>';
    h += '<div class="onboarding-feature">';
    h += '<div class="onboarding-feature-icon">\u2705</div>';
    h += '<h3>'+t('onboarding.todo')+'</h3>';
    h += '<p>'+t('onboarding.todo.desc')+'</p>';
    h += '</div>';
    h += '<div class="onboarding-feature">';
    h += '<div class="onboarding-feature-icon">\u2601\ufe0f</div>';
    h += '<h3>'+t('onboarding.sync')+'</h3>';
    h += '<p>'+t('onboarding.sync.desc')+'</p>';
    h += '</div>';
    h += '<div class="onboarding-feature">';
    h += '<div class="onboarding-feature-icon">\ud83c\udfaf</div>';
    h += '<h3>'+t('onboarding.goal')+'</h3>';
    h += '<p>'+t('onboarding.goal.desc')+'</p>';
    h += '</div>';
    h += '</div>';

    h += '<div class="onboarding-start">';
    h += '<h2>'+t('onboarding.how')+'</h2>';
    h += '<div class="onboarding-options">';

    h += '<div class="onboarding-option">';
    h += '<div class="onboarding-option-icon">\u2795</div>';
    h += '<h3>'+t('onboarding.add')+'</h3>';
    h += '<p>'+t('onboarding.add.desc')+'</p>';
    h += '<button class="btn btn-add onboarding-btn" id="onboarding-add">'+t('onboarding.add')+'</button>';
    h += '</div>';

    h += '<div class="onboarding-option">';
    h += '<div class="onboarding-option-icon">\ud83d\udcda</div>';
    h += '<h3>'+t('onboarding.preset')+'</h3>';
    h += '<p>'+t('onboarding.preset.desc')+'</p>';
    h += '<button class="btn btn-add onboarding-btn" id="onboarding-preset">'+t('onboarding.preset')+'</button>';
    h += '</div>';

    h += '</div></div></div>';

    // Create overlay on top of content
    var overlay = document.getElementById("onboarding-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "onboarding-overlay";
        main.parentNode.insertBefore(overlay, main);
    }
    overlay.innerHTML = h;
    overlay.style.display = "block";
    main.style.display = "none";

    // Hide nav tabs during onboarding
    var nav = document.querySelector(".hsg-nav");
    if (nav) nav.style.display = "none";
    var legend = main.querySelector(".legend");
    if (legend) legend.style.display = "none";

    document.getElementById("onboarding-add").onclick = function() { finishOnboarding(); showAddSubjectModal(); };
    document.getElementById("onboarding-preset").onclick = function() { finishOnboarding(); showPresetLibrary(); };
}

function finishOnboarding() {
    isFirstLogin = false;
    pushToCloud();
    var overlay = document.getElementById("onboarding-overlay");
    if (overlay) overlay.style.display = "none";
    var main = document.querySelector(".content");
    if (main) main.style.display = "";
    var nav = document.querySelector(".hsg-nav");
    if (nav) nav.style.display = "";
    var legend = main.querySelector(".legend");
    if (legend) legend.style.display = "";
    renderAll();
}

// ---- Initialize ----
initDarkMode();

// Debug panel
(function(){
    var toggle=document.getElementById("debug-toggle");
    var panel=document.getElementById("debug-panel");
    var inp=document.getElementById("debug-date");
    var rst=document.getElementById("debug-reset");
    var cur=document.getElementById("debug-current");
    if(!toggle||!panel||!inp) return;
    var unlocked=false;
    toggle.onclick=function(){
        if(panel.style.display==="none"||!panel.style.display){
            if(!unlocked){
                var pw=prompt("Passwort:");
                if(pw!=="1212") return;
                unlocked=true;
            }
            panel.style.display="block";
        } else {
            panel.style.display="none";
        }
    };
    function showCurrent(){cur.textContent="App-Datum: "+new Date().toLocaleDateString("de-CH",{weekday:"long",day:"numeric",month:"long",year:"numeric"});}
    showCurrent();
    inp.onchange=function(){
        if(inp.value){__setDebugDate(inp.value);} else {__setDebugDate(null);}
        showCurrent(); renderAll();
    };
    rst.onclick=function(){inp.value="";__setDebugDate(null);showCurrent();renderAll();};
    var obBtn=document.getElementById("debug-onboarding");
    if(obBtn) obBtn.onclick=function(){ showOnboarding(); };
})();

// renderAll() is called by onAuthStateChanged which fires on page load

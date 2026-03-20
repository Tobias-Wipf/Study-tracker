// ---- Preset Library (shared via Firestore) ----

// ---- Word filter ----
var BLOCKED_WORDS = [
    // German
    "arschloch","wichser","hurensohn","fotze","missgeburt","spast","behindert",
    "schlampe","hure","nutte","schwuchtel","bastard","drecksau","vollidiot",
    "idiot","depp","trottel","penner","assi","nazi","scheiße","scheisse",
    "fick","ficken","gefickt","wixxer","wixer","kackbratze","dummkopf",
    // English
    "fuck","shit","bitch","asshole","cunt","dick","pussy","nigger","nigga",
    "faggot","retard","retarded","whore","slut","bastard","motherfucker",
    "cocksucker","twat","wanker","prick"
];

function containsBadWords(text) {
    if (!text) return false;
    var lower = text.toLowerCase().replace(/[_\-\.0@!1|3]/g, function(c) {
        return {_:" ","-":" ",".":" ","0":"o","@":"a","!":"i","1":"i","|":"l","3":"e"}[c] || c;
    });
    for (var i = 0; i < BLOCKED_WORDS.length; i++) {
        if (lower.indexOf(BLOCKED_WORDS[i]) !== -1) return true;
    }
    return false;
}

function checkPresetContent(preset) {
    var fields = [preset.name, preset.description, preset.university, preset.authorName];
    if (preset.subjects) preset.subjects.forEach(function(s) {
        fields.push(s.name);
        s.topics.forEach(function(t) { fields.push(t); });
        s.categories.forEach(function(c) { fields.push(c); });
    });
    for (var i = 0; i < fields.length; i++) {
        if (containsBadWords(fields[i])) return true;
    }
    return false;
}

// ---- Report system ----
function reportPreset(presetId, callback) {
    if (!currentUser) { callback(new Error("Nicht angemeldet")); return; }
    var reportRef = db.collection("presets").doc(presetId).collection("reports").doc(currentUser.uid);
    reportRef.set({
        uid: currentUser.uid,
        reportedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(function() { callback(null); }).catch(function(err) { callback(err); });
}

var PRESET_LEVELS = [
    { id: "assessment", label: "Assessment" },
    { id: "bachelor", label: "Bachelor" },
    { id: "master", label: "Master" }
];

// ---- Built-in presets (always available, no cloud needed) ----
var BUILTIN_PRESETS = [];

// ---- Firestore preset functions ----
function loadPresetsFromCloud(callback) {
    db.collection("presets").orderBy("createdAt", "desc").get().then(function(snap) {
        var presets = [];
        snap.forEach(function(doc) {
            var d = doc.data();
            d._id = doc.id;
            // Only show approved presets (admins see all)
            var dominated = (d.reportCount || 0) >= 3;
            var pending = d.approved === false;
            if (!dominated && (!pending || isAdmin())) presets.push(d);
        });
        callback(presets);
    }).catch(function(err) {
        console.error("Failed to load presets:", err);
        callback([]);
    });
}

// Admin UIDs that can approve presets
var ADMIN_UIDS = ["5yMo1ANQR4gbyUXLBg0sy6d6o0I3"];
function isAdmin() { return currentUser && ADMIN_UIDS.indexOf(currentUser.uid) !== -1; }

function uploadPresetToCloud(preset, callback) {
    preset.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    preset.approved = false; // Requires admin approval before showing in library
    db.collection("presets").add(preset).then(function(ref) {
        callback(null, ref.id);
    }).catch(function(err) {
        callback(err);
    });
}

function deletePresetFromCloud(presetId, callback) {
    db.collection("presets").doc(presetId).delete().then(function() {
        callback(null);
    }).catch(function(err) {
        callback(err);
    });
}

// ---- Preset Library Modal ----
function showPresetLibrary() {
    var h = '<div class="preset-library">';
    h += '<h3 class="modal-title">Vorlagen-Bibliothek</h3>';
    h += '<div class="preset-tabs">';
    h += '<button class="preset-tab active" data-ptab="browse">Bibliothek</button>';
    h += '<button class="preset-tab" data-ptab="import">Importieren</button>';
    h += '<button class="preset-tab" data-ptab="share">Teilen</button>';
    h += '</div>';
    h += '<div id="preset-content"><div class="preset-loading">Laden...</div></div>';
    h += '</div>';

    showModal(h, function(md) {
        md.style.maxWidth = "560px";
        md.style.width = "95vw";

        // Tab switching
        md.querySelectorAll(".preset-tab").forEach(function(btn) {
            btn.onclick = function() {
                md.querySelectorAll(".preset-tab").forEach(function(b) { b.classList.remove("active"); });
                btn.classList.add("active");
                if (btn.dataset.ptab === "browse") renderPresetBrowse(md);
                else if (btn.dataset.ptab === "import") renderPresetImportFile(md);
                else renderPresetShare(md);
            };
        });

        renderPresetBrowse(md);
    });
}

function renderPresetBrowse(md) {
    var container = md.querySelector("#preset-content");
    container.innerHTML = '<div class="preset-loading">Laden...</div>';

    loadPresetsFromCloud(function(cloudPresets) {
        var presets = BUILTIN_PRESETS.concat(cloudPresets);
        var h = '<div class="preset-filters">';
        h += '<button class="preset-filter active" data-level="all">Alle</button>';
        PRESET_LEVELS.forEach(function(l) {
            h += '<button class="preset-filter" data-level="' + l.id + '">' + esc(l.label) + '</button>';
        });
        h += '</div>';
        h += '<div id="preset-list"></div>';
        container.innerHTML = h;

        var currentFilter = "all";

        function renderList() {
            var filtered = currentFilter === "all" ? presets : presets.filter(function(p) { return p.level === currentFilter; });
            var list = container.querySelector("#preset-list");

            if (!filtered.length) {
                list.innerHTML = '<div class="preset-empty">Keine Vorlagen gefunden.</div>';
                return;
            }

            var lh = '';
            filtered.forEach(function(p) {
                var subjCount = p.subjects ? p.subjects.length : 0;
                var topicCount = 0;
                if (p.subjects) p.subjects.forEach(function(s) { topicCount += s.topics.length; });
                var levelLabel = PRESET_LEVELS.find(function(l) { return l.id === p.level; });
                levelLabel = levelLabel ? levelLabel.label : p.level;
                var isOwn = currentUser && p.authorUid === currentUser.uid;
                var isBuiltin = !!p.builtin;

                lh += '<div class="preset-card' + (isBuiltin ? ' preset-card--builtin' : '') + '">';
                lh += '<div class="preset-card-header">';
                lh += '<div class="preset-card-title">' + esc(p.name) + (isBuiltin ? ' <span class="preset-card-badge">Vorlage</span>' : '') + '</div>';
                lh += '<span class="preset-card-level preset-card-level--' + esc(p.level) + '">' + esc(levelLabel) + '</span>';
                lh += '</div>';
                if (p.description) lh += '<div class="preset-card-desc">' + esc(p.description) + '</div>';
                if (p.university) lh += '<div class="preset-card-uni">' + esc(p.university) + '</div>';
                lh += '<div class="preset-card-meta">';
                var examCount = 0;
                if (p.subjects) p.subjects.forEach(function(s) { if (s.examDate) examCount++; });
                lh += '<span>' + subjCount + ' Fächer, ' + topicCount + ' Themen' + (examCount ? ', ' + examCount + ' Prüfungstermine' : '') + '</span>';
                lh += '<span>von ' + esc(p.authorName || 'Anonym') + '</span>';
                lh += '</div>';

                // Expandable subject preview
                lh += '<details class="preset-card-details"><summary>Fächer anzeigen</summary>';
                lh += '<div class="preset-card-subjects">';
                if (p.subjects) p.subjects.forEach(function(s) {
                    lh += '<div class="preset-subj">';
                    lh += '<strong>' + esc(s.name) + '</strong>';
                    if (s.examDate) lh += ' <span style="color:#d4a843;font-size:.82rem;">\ud83d\udcc5 ' + esc(s.examDate) + '</span>';
                    lh += '<div class="preset-subj-cats">' + s.categories.map(esc).join(', ') + '</div>';
                    lh += '<div class="preset-subj-topics">' + s.topics.length + ' Themen: ' + s.topics.map(esc).join(', ') + '</div>';
                    lh += '</div>';
                });
                lh += '</div></details>';

                // Pending badge for admin
                if (p.approved === false && isAdmin()) {
                    lh += '<div style="margin-bottom:8px"><span style="background:#422006;color:#eab308;font-size:.72rem;font-weight:700;padding:3px 8px;border-radius:6px;">\u23f3 Ausstehend</span></div>';
                }

                lh += '<div class="preset-card-actions">';
                if (p.approved !== false) {
                    lh += '<button class="btn btn-add btn-small preset-import-btn" data-preset-id="' + p._id + '">Importieren</button>';
                }
                if (isAdmin() && p.approved === false) {
                    lh += '<button class="btn btn-add btn-small preset-approve-btn" data-preset-id="' + p._id + '">\u2713 Freigeben</button>';
                    lh += '<button class="btn btn-small btn-danger preset-reject-btn" data-preset-id="' + p._id + '">\u2717 Ablehnen</button>';
                }
                if ((isOwn || isAdmin()) && !isBuiltin) lh += '<button class="btn btn-small btn-danger preset-delete-btn" data-preset-id="' + p._id + '">L\u00f6schen</button>';
                if (!isOwn && !isBuiltin && p.approved !== false) lh += '<button class="preset-report-btn" data-preset-id="' + p._id + '" title="Melden">\u26a0 Melden</button>';
                lh += '</div>';
                lh += '</div>';
            });
            list.innerHTML = lh;

            // Attach import handlers
            list.querySelectorAll(".preset-import-btn").forEach(function(btn) {
                btn.onclick = function() {
                    var p = filtered.find(function(x) { return x._id === btn.dataset.presetId; });
                    if (p) importPreset(p);
                };
            });

            // Attach delete handlers
            list.querySelectorAll(".preset-delete-btn").forEach(function(btn) {
                btn.onclick = function() {
                    var pid = btn.dataset.presetId;
                    btn.disabled = true;
                    btn.textContent = "...";
                    deletePresetFromCloud(pid, function(err) {
                        if (err) { showToast("Fehler beim L\u00f6schen"); btn.disabled = false; btn.textContent = "L\u00f6schen"; return; }
                        presets = presets.filter(function(x) { return x._id !== pid; });
                        renderList();
                        showToast("Vorlage gel\u00f6scht");
                    });
                };
            });

            // Attach report handlers
            list.querySelectorAll(".preset-report-btn").forEach(function(btn) {
                btn.onclick = function() {
                    if (!currentUser) { showToast("Bitte melde dich an"); return; }
                    btn.disabled = true;
                    btn.textContent = "...";
                    reportPreset(btn.dataset.presetId, function(err) {
                        if (err) { showToast("Fehler beim Melden"); btn.disabled = false; btn.textContent = "\u26a0 Melden"; return; }
                        btn.textContent = "\u2713 Gemeldet";
                        btn.classList.add("preset-report-btn--done");
                        showToast("Vorlage gemeldet. Danke!");
                    });
                };
            });

            // Attach approve handlers (admin only)
            list.querySelectorAll(".preset-approve-btn").forEach(function(btn) {
                btn.onclick = function() {
                    var pid = btn.dataset.presetId;
                    btn.disabled = true;
                    btn.textContent = "...";
                    db.collection("presets").doc(pid).update({ approved: true }).then(function() {
                        var p = presets.find(function(x) { return x._id === pid; });
                        if (p) p.approved = true;
                        renderList();
                        showToast("Vorlage freigegeben");
                    }).catch(function(err) {
                        showToast("Fehler: " + err.message);
                        btn.disabled = false;
                        btn.textContent = "\u2713 Freigeben";
                    });
                };
            });

            // Attach reject handlers (admin only — deletes the preset)
            list.querySelectorAll(".preset-reject-btn").forEach(function(btn) {
                btn.onclick = function() {
                    var pid = btn.dataset.presetId;
                    btn.disabled = true;
                    btn.textContent = "...";
                    deletePresetFromCloud(pid, function(err) {
                        if (err) { showToast("Fehler beim Ablehnen"); btn.disabled = false; btn.textContent = "\u2717 Ablehnen"; return; }
                        presets = presets.filter(function(x) { return x._id !== pid; });
                        renderList();
                        showToast("Vorlage abgelehnt und gel\u00f6scht");
                    });
                };
            });
        }

        // Filter buttons
        container.querySelectorAll(".preset-filter").forEach(function(btn) {
            btn.onclick = function() {
                container.querySelectorAll(".preset-filter").forEach(function(b) { b.classList.remove("active"); });
                btn.classList.add("active");
                currentFilter = btn.dataset.level;
                renderList();
            };
        });

        renderList();
    });
}

function renderPresetShare(md) {
    var container = md.querySelector("#preset-content");
    var subjects = loadSubjects();

    if (!currentUser) {
        container.innerHTML = '<div class="preset-empty">Bitte melde dich an, um Vorlagen zu teilen.</div>';
        return;
    }

    if (!subjects.length) {
        container.innerHTML = '<div class="preset-empty">Du hast noch keine F\u00e4cher, die du teilen k\u00f6nntest.</div>';
        return;
    }

    var h = '<div class="preset-share-form">';
    h += '<label class="modal-label">Dein Anzeigename</label>';
    h += '<input class="modal-input" id="preset-author" type="text" placeholder="Bhomas_Tieger, Bibcouple41, Anonym, ...." value="' + esc(localStorage.getItem("lf_preset_author") || "") + '">';
    h += '<label class="modal-label">Name der Vorlage</label>';
    h += '<input class="modal-input" id="preset-name" type="text" placeholder="z.B. Assessment HSG WiWi FS26">';
    h += '<label class="modal-label">Beschreibung <span class="modal-hint">(optional)</span></label>';
    h += '<input class="modal-input" id="preset-desc" type="text" placeholder="Kurze Beschreibung...">';
    h += '<label class="modal-label">Universit\u00e4t <span class="modal-hint">(optional)</span></label>';
    h += '<input class="modal-input" id="preset-uni" type="text" placeholder="z.B. Universit\u00e4t St. Gallen">';
    h += '<label class="modal-label">Stufe</label>';
    h += '<div class="preset-level-select">';
    PRESET_LEVELS.forEach(function(l) {
        h += '<button class="preset-level-btn" data-level="' + l.id + '">' + esc(l.label) + '</button>';
    });
    h += '</div>';

    h += '<label class="modal-label">F\u00e4cher zum Teilen</label>';
    h += '<div class="preset-subj-select" id="share-subj-list">';
    subjects.forEach(function(s, i) {
        h += '<button type="button" class="preset-subj-check active" data-idx="' + i + '">' + esc(s.name) + ' <span class="modal-hint">(' + s.topics.length + ' Themen' + (s.examDate ? ', Pr\u00fcfung: ' + esc(s.examDate) : '') + ')</span></button>';
    });
    h += '</div>';

    h += '<div class="modal-actions"><button class="btn btn-small modal-cancel">Abbrechen</button><button class="btn btn-add btn-small" id="preset-publish-btn">Ver\u00f6ffentlichen</button></div>';
    h += '</div>';
    container.innerHTML = h;

    // Level select
    var selectedLevel = "";
    container.querySelectorAll(".preset-level-btn").forEach(function(btn) {
        btn.onclick = function() {
            container.querySelectorAll(".preset-level-btn").forEach(function(b) { b.classList.remove("active"); });
            btn.classList.add("active");
            selectedLevel = btn.dataset.level;
        };
    });

    // Toggle subject selection on tap
    container.querySelectorAll(".preset-subj-check").forEach(function(btn) {
        btn.onclick = function() {
            btn.classList.toggle("active");
        };
    });

    container.querySelector(".modal-cancel").onclick = closeModal;

    container.querySelector("#preset-publish-btn").onclick = function() {
        var authorName = document.getElementById("preset-author").value.trim() || "Anonym";
        localStorage.setItem("lf_preset_author", authorName);
        var name = document.getElementById("preset-name").value.trim();
        if (!name) { showToast("Bitte gib einen Namen ein"); return; }
        if (!selectedLevel) { showToast("Bitte w\u00e4hle eine Stufe"); return; }

        var active = container.querySelectorAll(".preset-subj-check.active");
        if (!active.length) { showToast("W\u00e4hle mindestens ein Fach"); return; }

        var selectedSubjects = [];
        active.forEach(function(btn) {
            var s = subjects[parseInt(btn.dataset.idx)];
            var subj = {
                name: s.name,
                categories: s.categories.slice(),
                topics: s.topics.slice()
            };
            if (s.examDate) subj.examDate = s.examDate;
            selectedSubjects.push(subj);
        });

        var preset = {
            name: name,
            description: document.getElementById("preset-desc").value.trim(),
            university: document.getElementById("preset-uni").value.trim(),
            level: selectedLevel,
            subjects: selectedSubjects,
            authorName: authorName,
            authorUid: currentUser.uid,
            reportCount: 0
        };

        if (checkPresetContent(preset)) {
            showToast("Enth\u00e4lt unangemessene Inhalte. Bitte \u00e4ndere den Text.");
            return;
        }

        var btn = container.querySelector("#preset-publish-btn");
        btn.disabled = true;
        btn.textContent = "Wird hochgeladen...";

        uploadPresetToCloud(preset, function(err) {
            if (err) {
                showToast("Fehler beim Hochladen: " + err.message);
                btn.disabled = false;
                btn.textContent = "Ver\u00f6ffentlichen";
                return;
            }
            closeModal();
            showToast("Vorlage eingereicht! Sie wird nach Pr\u00fcfung freigeschaltet.");
        });
    };
}

// ---- File Import (Excel / Image OCR) ----

function renderPresetImportFile(md) {
    var container = md.querySelector("#preset-content");
    var h = '<div class="preset-import-file">';
    h += '<p class="preset-import-hint">Importiere Fächer aus einer Excel-Datei oder einem Bild (JPG/PNG) deines Lernplans.</p>';
    h += '<div class="preset-import-dropzone" id="import-dropzone">';
    h += '<div class="preset-import-dropzone-inner">';
    h += '<div class="preset-import-dropzone-icon">&#128196;</div>';
    h += '<div class="preset-import-dropzone-text">Datei hierher ziehen oder klicken</div>';
    h += '<div class="preset-import-dropzone-formats">.xlsx &middot; .xls &middot; .csv &middot; .jpg &middot; .jpeg &middot; .png</div>';
    h += '</div>';
    h += '<input type="file" id="import-file-input" accept=".xlsx,.xls,.csv,.jpg,.jpeg,.png" style="display:none">';
    h += '</div>';
    h += '<div id="import-preview" style="display:none"></div>';
    h += '</div>';
    container.innerHTML = h;

    var dropzone = container.querySelector("#import-dropzone");
    var fileInput = container.querySelector("#import-file-input");

    dropzone.onclick = function() { fileInput.click(); };
    dropzone.ondragover = function(e) { e.preventDefault(); dropzone.classList.add("preset-import-dropzone--hover"); };
    dropzone.ondragleave = function() { dropzone.classList.remove("preset-import-dropzone--hover"); };
    dropzone.ondrop = function(e) {
        e.preventDefault();
        dropzone.classList.remove("preset-import-dropzone--hover");
        if (e.dataTransfer.files.length) handleImportFile(e.dataTransfer.files[0], container);
    };
    fileInput.onchange = function() {
        if (fileInput.files.length) handleImportFile(fileInput.files[0], container);
    };
}

function handleImportFile(file, container) {
    var ext = file.name.split(".").pop().toLowerCase();
    var preview = container.querySelector("#import-preview");
    var dropzone = container.querySelector("#import-dropzone");

    if (["xlsx", "xls", "csv"].indexOf(ext) !== -1) {
        dropzone.style.display = "none";
        preview.style.display = "block";
        preview.innerHTML = '<div class="preset-loading">Datei wird gelesen...</div>';
        parseExcelFile(file, function(subjects) {
            renderImportPreview(subjects, preview, dropzone);
        });
    } else if (["jpg", "jpeg", "png"].indexOf(ext) !== -1) {
        dropzone.style.display = "none";
        preview.style.display = "block";
        preview.innerHTML = '<div class="preset-loading"><div>Bild wird analysiert (OCR)...</div><div class="preset-import-progress"><div class="preset-import-progress-bar" id="ocr-progress-bar"></div></div><div id="ocr-status" class="preset-import-status">Initialisiere...</div></div>';
        parseImageFile(file, container, function(subjects) {
            renderImportPreview(subjects, preview, dropzone);
        });
    } else {
        showToast("Nicht unterstütztes Format: ." + ext);
    }
}

function parseExcelFile(file, callback) {
    var reader = new FileReader();
    reader.onload = function(e) {
        try {
            var wb = XLSX.read(e.target.result, { type: "array" });
            var subjects = [];

            wb.SheetNames.forEach(function(sheetName) {
                var ws = wb.Sheets[sheetName];
                var data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
                if (!data.length) return;

                var topics = [];
                var categories = [];

                // Detect format: check if first row looks like categories or has "Themen"/"Kategorien" headers
                var firstRow = data[0].map(function(c) { return String(c).trim(); });
                var themenCol = -1, katCol = -1;

                for (var ci = 0; ci < firstRow.length; ci++) {
                    var h = firstRow[ci].toLowerCase();
                    if (h === "themen" || h === "topics" || h === "thema" || h === "topic") themenCol = ci;
                    if (h === "kategorien" || h === "categories" || h === "kategorie" || h === "category") katCol = ci;
                }

                if (themenCol !== -1) {
                    // Explicit header format
                    for (var r = 1; r < data.length; r++) {
                        var t = String(data[r][themenCol] || "").trim();
                        if (t) topics.push(t);
                        if (katCol !== -1) {
                            var k = String(data[r][katCol] || "").trim();
                            if (k && categories.indexOf(k) === -1) categories.push(k);
                        }
                    }
                } else {
                    // Auto-detect: first row = categories if multiple non-empty cells, else topics start at row 0
                    var nonEmpty = firstRow.filter(function(c) { return c !== ""; });
                    if (nonEmpty.length > 1 && data.length > 1) {
                        // First row = categories
                        categories = nonEmpty;
                        for (var r = 1; r < data.length; r++) {
                            var t = String(data[r][0] || "").trim();
                            if (t) topics.push(t);
                        }
                    } else {
                        // All rows in col A = topics
                        for (var r = 0; r < data.length; r++) {
                            var t = String(data[r][0] || "").trim();
                            if (t) topics.push(t);
                        }
                    }
                }

                if (topics.length || categories.length) {
                    subjects.push({
                        name: sheetName,
                        topics: topics,
                        categories: categories.length ? categories : ["Vorlesung", "Übung", "Selbststudium"]
                    });
                }
            });

            callback(subjects);
        } catch (err) {
            console.error("Excel parse error:", err);
            showToast("Fehler beim Lesen der Datei: " + err.message);
            callback([]);
        }
    };
    reader.readAsArrayBuffer(file);
}

function parseImageFile(file, container, callback) {
    var progressBar = container.querySelector("#ocr-progress-bar");
    var statusEl = container.querySelector("#ocr-status");

    Tesseract.recognize(file, "deu+eng", {
        logger: function(m) {
            if (m.status && statusEl) {
                var labels = {
                    "loading tesseract core": "Lade OCR-Engine...",
                    "initializing tesseract": "Initialisiere...",
                    "loading language traineddata": "Lade Sprachdaten...",
                    "initializing api": "Bereite Erkennung vor...",
                    "recognizing text": "Erkenne Text..."
                };
                statusEl.textContent = labels[m.status] || m.status;
            }
            if (typeof m.progress === "number" && progressBar) {
                progressBar.style.width = Math.round(m.progress * 100) + "%";
            }
        }
    }).then(function(result) {
        var text = result.data.text || "";
        renderOcrEditor(text, container, callback);
    }).catch(function(err) {
        console.error("OCR error:", err);
        showToast("OCR fehlgeschlagen: " + err.message);
        callback([]);
    });
}

function renderOcrEditor(text, container, callback) {
    var preview = container.querySelector("#import-preview");
    var h = '<div class="preset-import-ocr">';
    h += '<label class="modal-label">Erkannter Text — bearbeite ihn, falls nötig:</label>';
    h += '<div class="preset-import-ocr-help">Format: Fachname als Überschrift, dann Themen zeilenweise darunter. Kategorien mit "Kategorien:" angeben.</div>';
    h += '<textarea class="modal-input preset-import-textarea" id="ocr-text" rows="12">' + esc(text) + '</textarea>';
    h += '<div class="modal-actions">';
    h += '<button class="btn btn-small modal-cancel" id="ocr-back">Zurück</button>';
    h += '<button class="btn btn-add btn-small" id="ocr-parse">Weiter</button>';
    h += '</div>';
    h += '</div>';
    preview.innerHTML = h;

    container.querySelector("#ocr-back").onclick = function() {
        preview.style.display = "none";
        container.querySelector("#import-dropzone").style.display = "";
    };

    container.querySelector("#ocr-parse").onclick = function() {
        var parsed = parseOcrText(document.getElementById("ocr-text").value);
        callback(parsed);
    };
}

function parseOcrText(text) {
    var lines = text.split(/\n/).map(function(l) { return l.trim(); }).filter(function(l) { return l; });
    var subjects = [];
    var current = null;

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];

        // Detect category line
        if (current && /^(Kategorien|Categories|Kategorie)\s*:/i.test(line)) {
            var cats = line.replace(/^(Kategorien|Categories|Kategorie)\s*:\s*/i, "").split(/[,;]/).map(function(c) { return c.trim(); }).filter(function(c) { return c; });
            if (cats.length) current.categories = cats;
            continue;
        }

        // Detect subject header: line that is short, possibly bold/uppercase, no bullet, followed by topics
        // Heuristic: if line doesn't start with - or * or number, and is relatively short, treat as subject header
        var isBullet = /^[\-\*•]\s/.test(line) || /^\d+[\.\)]\s/.test(line);

        if (!isBullet && line.length <= 80 && (i === 0 || !current || (current.topics.length > 0 && !isBullet))) {
            // Check if next line looks like a topic (bullet or the pattern continues)
            var nextIsTopic = (i + 1 < lines.length) && (/^[\-\*•]\s/.test(lines[i + 1]) || /^\d+[\.\)]\s/.test(lines[i + 1]));

            if (i === 0 || nextIsTopic || (current && current.topics.length > 0)) {
                current = { name: line.replace(/^#+\s*/, ""), topics: [], categories: ["Vorlesung", "Übung", "Selbststudium"] };
                subjects.push(current);
                continue;
            }
        }

        // Otherwise treat as topic
        if (current) {
            var topic = line.replace(/^[\-\*•]\s*/, "").replace(/^\d+[\.\)]\s*/, "");
            if (topic) current.topics.push(topic);
        } else {
            // No subject yet — create a default one
            current = { name: "Importiert", topics: [], categories: ["Vorlesung", "Übung", "Selbststudium"] };
            subjects.push(current);
            var topic = line.replace(/^[\-\*•]\s*/, "").replace(/^\d+[\.\)]\s*/, "");
            if (topic) current.topics.push(topic);
        }
    }

    return subjects;
}

function renderImportPreview(subjects, preview, dropzone) {
    if (!subjects.length) {
        preview.innerHTML = '<div class="preset-empty">Keine Fächer erkannt.</div><div class="modal-actions"><button class="btn btn-small modal-cancel" id="import-retry">Zurück</button></div>';
        preview.querySelector("#import-retry").onclick = function() {
            preview.style.display = "none";
            dropzone.style.display = "";
        };
        return;
    }

    var h = '<div class="preset-import-preview-list">';
    h += '<label class="modal-label">Erkannte Fächer — bearbeite und wähle aus:</label>';

    subjects.forEach(function(s, si) {
        h += '<div class="preset-import-subject" data-idx="' + si + '">';
        h += '<div class="preset-import-subject-header">';
        h += '<input type="checkbox" class="import-subj-check" id="import-check-' + si + '" value="' + si + '" checked> ';
        h += '<input type="text" class="preset-import-name-input" value="' + esc(s.name) + '" data-field="name" data-idx="' + si + '">';
        h += '<span class="modal-hint">' + s.topics.length + ' Themen</span>';
        h += '</div>';
        h += '<details class="preset-card-details">';
        h += '<summary>Details bearbeiten</summary>';
        h += '<div class="preset-import-subject-body">';
        h += '<label class="modal-label modal-label--small">Kategorien <span class="modal-hint">(kommagetrennt)</span></label>';
        h += '<input type="text" class="modal-input import-cats-input" data-idx="' + si + '" value="' + esc(s.categories.join(", ")) + '">';
        h += '<label class="modal-label modal-label--small">Themen <span class="modal-hint">(eins pro Zeile)</span></label>';
        h += '<textarea class="modal-input preset-import-textarea--small import-topics-input" data-idx="' + si + '" rows="' + Math.min(Math.max(s.topics.length, 3), 10) + '">' + esc(s.topics.join("\n")) + '</textarea>';
        h += '</div></details>';
        h += '</div>';
    });

    h += '</div>';
    h += '<div class="modal-actions">';
    h += '<button class="btn btn-small modal-cancel" id="import-back">Zurück</button>';
    h += '<button class="btn btn-add btn-small" id="import-confirm">Importieren</button>';
    h += '</div>';
    preview.innerHTML = h;

    preview.querySelector("#import-back").onclick = function() {
        preview.style.display = "none";
        dropzone.style.display = "";
    };

    preview.querySelector("#import-confirm").onclick = function() {
        var checked = preview.querySelectorAll(".import-subj-check:checked");
        if (!checked.length) { showToast("Wähle mindestens ein Fach"); return; }

        var finalSubjects = [];
        checked.forEach(function(cb) {
            var idx = parseInt(cb.value);
            var nameInput = preview.querySelector('.preset-import-name-input[data-idx="' + idx + '"]');
            var catsInput = preview.querySelector('.import-cats-input[data-idx="' + idx + '"]');
            var topicsInput = preview.querySelector('.import-topics-input[data-idx="' + idx + '"]');

            var name = nameInput.value.trim() || subjects[idx].name;
            var cats = catsInput.value.split(",").map(function(c) { return c.trim(); }).filter(function(c) { return c; });
            var topics = topicsInput.value.split("\n").map(function(t) { return t.trim(); }).filter(function(t) { return t; });

            if (name && topics.length) {
                finalSubjects.push({ name: name, categories: cats.length ? cats : ["Vorlesung", "Übung", "Selbststudium"], topics: topics });
            }
        });

        if (!finalSubjects.length) { showToast("Keine gültigen Fächer zum Importieren"); return; }

        importPreset({ subjects: finalSubjects });
    };
}

function importPreset(preset) {
    if (!preset.subjects || !preset.subjects.length) { showToast("Vorlage ist leer"); return; }

    var subjects = loadSubjects();
    var added = 0;

    preset.subjects.forEach(function(ps) {
        // Check for duplicate by name
        var exists = subjects.find(function(s) { return s.name === ps.name; });
        if (exists) return;

        var newSubj = {
            id: genId(),
            name: ps.name,
            categories: ps.categories.slice(),
            topics: ps.topics.slice()
        };
        if (ps.examDate) newSubj.examDate = ps.examDate;
        subjects.push(newSubj);
        added++;
    });

    if (added === 0) {
        showToast("Alle F\u00e4cher sind bereits vorhanden");
        return;
    }

    saveSubjects(subjects);
    closeModal();
    // Finish onboarding if still active
    if (typeof finishOnboarding === "function" && document.getElementById("onboarding-overlay") && document.getElementById("onboarding-overlay").style.display !== "none") {
        finishOnboarding();
    }
    renderAll();
    showToast(added + " Fach" + (added > 1 ? "\u00fc" : "") + " importiert");
}

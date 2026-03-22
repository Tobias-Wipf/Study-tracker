(function () {
  var T = {
    de: {
      // NAV
      'nav.signin': 'Anmelden',
      'nav.lang': 'EN',

      // INDEX – Hero
      'i.hero.eyebrow': 'Für Studierende',
      'i.hero.headline': 'Progress, Simplified.',
      'i.hero.subhead': 'Verfolge deinen Lernfortschritt, verwalte deine Aufgaben und behalte alle Prüfungstermine im Blick — auf all deinen Geräten.',
      'i.hero.cta': 'Mit Google anmelden',
      // INDEX – Mockup
      'i.mock.done': 'Fertig', 'i.mock.prog': 'In Arbeit', 'i.mock.open': 'Offen',
      // INDEX – Features grid
      'i.fs.eyebrow': 'Funktionen',
      'i.fs.title': 'Alles, was du brauchst.',
      'i.f1.title': 'Fortschritt tracken',
      'i.f1.desc': 'Behalte den Überblick über alle Fächer, Themen und Lernkategorien auf einen Blick.',
      'i.f2.title': 'Überall dabei',
      'i.f2.desc': 'Deine Daten werden automatisch mit der Cloud synchronisiert — auf jedem Gerät, immer aktuell.',
      'i.f3.title': 'To-Do Liste',
      'i.f3.desc': 'Erstelle Aufgaben mit Priorität, Fälligkeitsdatum und Fach-Zuordnung — alles an einem Ort.',
      'i.f4.title': 'Tagesziel',
      'i.f4.desc': 'Setze ein tägliches Lernziel und verfolge deinen Fortschritt mit dem Daily Dopamine Boost.',
      'i.f5.title': 'Prüfungs-Countdown',
      'i.f5.desc': 'Sieh auf einen Blick, wie viele Tage bis zur nächsten Prüfung noch bleiben.',
      'i.f6.title': 'Dark Mode',
      'i.f6.desc': 'Schone deine Augen bei langen Lernabenden mit dem eleganten Dunkelmodus.',
      'i.f7.title': 'Vorlagen teilen',
      'i.f7.desc': 'Teile deine Fächer-Struktur mit Kommilitonen oder importiere fertige Vorlagen — auch aus Excel-Dateien oder Bildern per OCR.',
      'i.f8.title': 'Fortschritt über Zeit',
      'i.f8.desc': 'Verfolge deinen Lernfortschritt mit interaktiven Charts — sieh genau, wie du dich über Tage und Wochen verbesserst.',
      'i.f9.title': 'Als App installieren',
      'i.f9.desc': 'Installiere Studytracker als App auf deinem iPhone — mit eigenem Icon, Vollbild und Offline-Zugriff.',
      'i.f10.title': 'Jetzt lernen',
      'i.f10.desc': 'Studytracker schlägt dir automatisch das Thema mit dem niedrigsten Fortschritt vor — damit du immer weisst, wo du anfangen sollst.',
      // INDEX – FAQ
      'i.faq.eyebrow': 'FAQ',
      'i.faq.title': 'Häufige Fragen.',
      'i.faq.q1': 'Ist Studytracker kostenlos?',
      'i.faq.a1': 'Ja, Studytracker ist vollständig kostenlos. Kein Abo, keine versteckten Kosten.',
      'i.faq.q2': 'Brauche ich ein Google-Konto?',
      'i.faq.a2': 'Ja, die Anmeldung erfolgt über Google. So sind deine Daten sicher gespeichert und auf allen Geräten synchronisiert.',
      'i.faq.q3': 'Werden meine Daten gespeichert?',
      'i.faq.a3': 'Ja. Deine Daten werden verschlüsselt in der Cloud gespeichert (Firebase von Google) und sind nur für dich sichtbar. Du kannst dich auf jedem Gerät anmelden und dein Fortschritt ist sofort da.',
      'i.faq.q4': 'Funktioniert Studytracker auf dem Handy?',
      'i.faq.a4': 'Ja. Auf dem iPhone kannst du Studytracker als App installieren — mit eigenem Icon, Vollbild-Modus und Offline-Zugriff. Öffne die Seite in Safari, tippe auf \u201eTeilen\u201c und dann \u201eZum Home-Bildschirm\u201c. Am Desktop funktioniert Studytracker direkt im Browser.',
      'i.faq.q5': 'Kann ich meine Fächer selbst anpassen?',
      'i.faq.a5': 'Ja. Du kannst Fächer, Themen und Kategorien frei hinzufügen, umbenennen und löschen — komplett auf dein Studium zugeschnitten.',
      'i.faq.q6': 'Gibt es eine To-Do-Funktion?',
      'i.faq.a6': 'Ja. Du kannst Aufgaben mit Priorität, Fälligkeitsdatum und Fach-Zuordnung erstellen. Offene und erledigte Aufgaben werden übersichtlich dargestellt.',
      'i.faq.q7': 'Was sind Vorlagen und wie funktionieren sie?',
      'i.faq.a7': 'Vorlagen sind fertige Fächer-Strukturen mit Themen, Kategorien und Prüfungsterminen, die du von anderen Studierenden übernehmen kannst. Du kannst auch eigene Vorlagen teilen, damit deine Kommilitonen nicht alles nochmal anlegen müssen. Zusätzlich kannst du Vorlagen aus Excel-Dateien oder sogar Bildern (per OCR) importieren.',
      'i.faq.q8': 'Wie installiere ich Studytracker auf dem iPhone?',
      'i.faq.a8': 'Öffne study-tracker.org in Safari, tippe auf das Teilen-Symbol (Quadrat mit Pfeil nach oben), scrolle nach unten und wähle \u201eZum Home-Bildschirm\u201c. Tippe auf \u201eHinzufügen\u201c — fertig! Die App erscheint als Icon auf deinem Home-Bildschirm und läuft im Vollbild wie eine native App.',
      // INDEX – CTA & footer
      'i.cta.title': 'Bereit anzufangen?',
      'i.cta.desc': 'Kostenlos. Open Source. Einfach anmelden und loslegen.',
      'i.cta.btn': 'Mit Google anmelden',
      'i.footer': '© 2026 Studytracker',

      // FEATURES PAGE – Hero
      'f.hero.eyebrow': 'Funktionen im Überblick',
      'f.hero.headline': 'Alles, was du für<br>erfolgreiches Studieren brauchst.',
      'f.hero.subhead': 'Studytracker vereint Lernfortschritt, Aufgabenverwaltung und Prüfungsmanagement in einem einfachen, schnellen Tool — kostenlos und ohne Installation.',
      'f.hero.cta': 'Kostenlos starten',
      // FEATURES PAGE – blocks
      'f.b1.tag': 'Kern-Feature', 'f.b1.title': 'Lernfortschritt auf einen Blick',
      'f.b1.p1': 'Für jedes Fach pflegst du eine Liste von Themen. Jedes Thema bekommt pro Lernkategorie (z.B. Vorlesung, Übung, Zusammenfassung) einen Status. So siehst du genau, was schon sitzt und wo noch Lücken sind.',
      'f.b1.p2': 'Vier Status-Stufen: <strong style="color:#555">Nicht begonnen</strong> → <strong style="color:#d4a843">In Arbeit</strong> → <strong style="color:#a78bfa">Wiederholen</strong> → <strong style="color:#00b87a">Fertig</strong>. Per Klick wechseln, kein Aufwand.',
      'f.b2.tag': 'Übersicht', 'f.b2.title': 'Alle Fächer auf einmal sehen',
      'f.b2.p1': 'Die Übersichtsseite zeigt dir den Gesamtfortschritt aller Fächer als Fortschrittsbalken — ideal, um schnell zu entscheiden, womit du als nächstes anfangen solltest.',
      'f.b2.p2': 'Die „Jetzt lernen"-Karte schlägt dir automatisch das Fach mit dem niedrigsten Fortschritt vor. Du kannst sie schließen oder dauerhaft deaktivieren.',
      'f.b3.tag': 'To-Do', 'f.b3.title': 'Aufgaben im Griff',
      'f.b3.p1': 'Erstelle Aufgaben mit Priorität (hoch, mittel, niedrig), Fälligkeitsdatum und optionaler Fach-Zuordnung. So weisst du immer, was als nächstes ansteht.',
      'f.b3.p2': 'Filtere nach offenen oder erledigten Aufgaben und sortiere nach Priorität oder Datum. Überfällige Aufgaben werden automatisch hervorgehoben.',
      'f.b4.tag': 'Motivation', 'f.b4.title': 'Daily Dopamine Boost',
      'f.b4.p1': 'Setze ein tägliches Lernziel und sieh mit einem animierten Fortschrittsring, wie weit du heute schon bist — ein einfacher, ehrlicher Motivations-Check.',
      'f.b4.p2': 'Jede abgeschlossene Lerneinheit wird automatisch gezählt. Der Fortschritt wird täglich zurückgesetzt — jeden Tag ein neuer Start.',
      'f.b5.tag': 'Prüfungen', 'f.b5.title': 'Prüfungs-Countdown',
      'f.b5.p1': 'Trage deine Prüfungstermine ein und sieh auf einen Blick, wie viele Tage noch bleiben. Je näher die Prüfung rückt, desto auffälliger die Anzeige — damit du nie unvorbereitet in eine Prüfung gehst.',
      'f.b5.p2': 'Die Prüfungen werden nach Datum sortiert. Die nächste Prüfung steht immer oben.',
      'f.b6.tag': 'Cloud Sync', 'f.b6.title': 'Deine Daten. Überall.',
      'f.b6.p1': 'Alle Änderungen werden automatisch in der Cloud gespeichert (Firebase von Google). Öffne Studytracker auf dem Laptop in der Bibliothek und auf dem Handy zu Hause — dein Fortschritt ist immer aktuell.',
      'f.b6.p2': 'Eine Statusanzeige im Header zeigt dir, ob gerade gespeichert wird oder ob alles synchron ist. Auch offline funktioniert die App — Änderungen werden synchronisiert, sobald du wieder online bist.',
      'f.b7.tag': 'Neu', 'f.b7.title': 'Vorlagen teilen & importieren',
      'f.b7.p1': 'Du musst nicht alles selbst anlegen. Exportiere deine Fächer, Themen und Kategorien als Vorlage und teile sie mit Kommilitonen — oder importiere eine fertige Vorlage mit einem Klick.',
      'f.b7.p2': 'Ideal für den Semesterstart: Eine Person legt die Struktur an, alle anderen profitieren. So spart ihr euch doppelte Arbeit und startet sofort mit dem Lernen.',
      // FEATURES PAGE – Setup
      'f.setup.label': 'Einrichtung', 'f.setup.title': 'In 3 Schritten startklar.',
      'f.setup.sub': 'Keine Installation, kein Abo. Einfach anmelden und loslegen.',
      'f.step1.title': 'Mit Google anmelden',
      'f.step1.desc': 'Klicke auf „Mit Google anmelden" auf der Startseite. Du benötigst nur ein Google-Konto — das wars. Keine E-Mail, kein Passwort, keine Bestätigungs-Mail.',
      'f.step2.title': 'Fächer & Themen anlegen',
      'f.step2.desc': 'Lege deine Fächer an (z.B. VWL, Mathe, Recht) und füge pro Fach die Themen deines Semesters hinzu. Du kannst jederzeit Themen hinzufügen oder umbenennen — mit Klick auf das ✏-Symbol.',
      'f.step3.title': 'Lernkategorien festlegen',
      'f.step3.desc': 'Wähle, welche Lernkategorien du tracken möchtest (z.B. Vorlesung, Übung, Zusammenfassung, Altklausur). Diese werden als Spalten in der Tabelle angezeigt.',
      // FEATURES PAGE – CTA & footer
      'f.cta.title': 'Bereit loszulegen?', 'f.cta.desc': 'Kostenlos. Keine Installation. Einfach anmelden und loslegen.',
      'f.cta.btn': 'Mit Google anmelden', 'f.footer': '© 2026 Studytracker',

      // ABOUT PAGE – Hero
      'a.hero.eyebrow': 'Über Studytracker',
      'a.hero.headline': 'Gebaut von Studierenden.<br>Für Studierende.',
      'a.hero.subhead': 'Studytracker entstand aus dem echten Alltag des Studiums — zu viele Tools, zu wenig Überblick.',
      // ABOUT PAGE – Story
      'a.story.label': 'Die Geschichte', 'a.story.title': 'Warum Studytracker?',
      'a.story.p1': 'Am Anfang jedes Semesters dasselbe Chaos: Welche Themen muss ich für VWL noch lernen? Habe ich die Übungsblätter für Mathe schon durch? Wann ist eigentlich die nächste Prüfung? Spreadsheets wurden zu unübersichtlich, andere Tools zu komplex.',
      'a.story.p2': 'Studytracker wurde gebaut, um genau dieses Problem zu lösen — ein einfaches, schnelles Tool, das den Lernfortschritt pro Fach und Thema sichtbar macht, ohne unnötigen Overhead. Kein Abo, keine App-Installation, keine Lernkurve.',
      'a.story.p3': 'Heute nutzen Studierende Studytracker, um ihre Semestervorbereitung zu strukturieren, Aufgaben zu verwalten und Prüfungstermine im Blick zu behalten — alles an einem Ort, automatisch in der Cloud synchronisiert.',
      // ABOUT PAGE – Values
      'a.val.label': 'Prinzipien', 'a.val.title': 'Was uns antreibt.',
      'a.v1.title': 'Einfachheit zuerst', 'a.v1.desc': 'Kein Feature, das nicht wirklich gebraucht wird. Studytracker soll in Sekunden verstanden und genutzt werden können.',
      'a.v2.title': 'Datenschutz', 'a.v2.desc': 'Deine Lerndaten gehören dir. Sie werden sicher verschlüsselt gespeichert und niemals weitergegeben oder verkauft.',
      'a.v3.title': 'Überall verfügbar', 'a.v3.desc': 'Kein Download, kein Setup. Studytracker läuft im Browser — auf dem Laptop in der Bibliothek genauso wie auf dem Handy unterwegs.',
      'a.v4.title': 'Kostenlos', 'a.v4.desc': 'Studytracker ist und bleibt kostenlos. Kein Freemium, kein Abo, keine versteckten Kosten.',
      // ABOUT PAGE – Tech
      'a.tech.label': 'Technologie', 'a.tech.title': 'Womit Studytracker gebaut ist.',
      'a.tech.desc': 'Studytracker ist bewusst schlank gehalten — kein Framework-Overhead, nur das, was wirklich gebraucht wird.',
      // ABOUT PAGE – About me
      'a.me.label': '\u00dcber uns', 'a.me.title': 'Die Entwickler',
      'a.me.p1': 'Studytracker ist aus einem echten Problem entstanden: Im Assessmentjahr jongliert man gleichzeitig mit mehreren F\u00e4chern, Pr\u00fcfungsterminen und Lernstoff \u2013 und verliert dabei schnell den \u00dcberblick. Bestehende Tools haben uns nie wirklich \u00fcberzeugt. Also haben wir kurzerhand selbst eine L\u00f6sung gebaut.',
      'a.me.p2': 'Das Ergebnis ist Studytracker: ein schlankes, intuitives Tool, das genau das macht, was Studierende brauchen. Kein unn\u00f6tiger Overhead, keine Kosten, kein Schnickschnack \u2013 nur klarer Fokus auf den Lernfortschritt.',
      'a.me.p3': 'Wir entwickeln Studytracker neben dem Studium und freuen uns \u00fcber jedes Feedback, das die App noch besser macht.',
      // ABOUT PAGE – Feedback
      'a.fb.label': 'Feedback', 'a.fb.title': 'Wir freuen uns \u00fcber deine Meinung.',
      'a.fb.desc': 'Studytracker ist ein Nebenprojekt, das wir aktiv weiterentwickeln. Konstruktive Kritik, Verbesserungsvorschl\u00e4ge und ehrliches Feedback sind herzlich willkommen \u2014 nur so wird das Tool besser. Was fehlt dir? Was nervt dich? Schreib uns gerne.',
      'a.fb.name': 'Dein Name', 'a.fb.email': 'Deine E-Mail-Adresse',
      'a.fb.message': 'Deine Nachricht oder dein Feedback...', 'a.fb.send': 'Nachricht senden',
      // ABOUT PAGE – CTA & footer
      'a.cta.title': 'Bereit loszulegen?', 'a.cta.desc': 'Kostenlos. Keine Installation. Einfach anmelden und loslegen.',
      'a.cta.btn': 'Mit Google anmelden', 'a.footer': '© 2026 Studytracker',
    },

    en: {
      // NAV
      'nav.signin': 'Sign in',
      'nav.lang': 'DE',

      // INDEX – Hero
      'i.hero.eyebrow': 'For Students',
      'i.hero.headline': 'Progress, Simplified.',
      'i.hero.subhead': 'Track your study progress, manage your tasks and keep all exam dates in view — on all your devices.',
      'i.hero.cta': 'Sign in with Google',
      // INDEX – Mockup
      'i.mock.done': 'Done', 'i.mock.prog': 'In progress', 'i.mock.open': 'Open',
      // INDEX – Features grid
      'i.fs.eyebrow': 'Features',
      'i.fs.title': 'Everything you need.',
      'i.f1.title': 'Track progress', 'i.f1.desc': 'Keep an overview of all subjects, topics and study categories at a glance.',
      'i.f2.title': 'Available everywhere', 'i.f2.desc': 'Your data is automatically synced to the cloud — on every device, always up to date.',
      'i.f3.title': 'To-do list', 'i.f3.desc': 'Create tasks with priority, due date and subject assignment — everything in one place.',
      'i.f4.title': 'Daily goal', 'i.f4.desc': 'Set a daily study goal and track your progress with the Daily Dopamine Boost.',
      'i.f5.title': 'Exam countdown', 'i.f5.desc': 'See at a glance how many days remain until the next exam.',
      'i.f6.title': 'Dark mode', 'i.f6.desc': 'Protect your eyes during long study sessions with the elegant dark mode.',
      'i.f7.title': 'Share templates', 'i.f7.desc': 'Share your subject structure with classmates or import ready-made templates — including from Excel files or images via OCR.',
      'i.f8.title': 'Progress over time', 'i.f8.desc': 'Track your study progress with interactive charts — see exactly how you improve over days and weeks.',
      'i.f9.title': 'Install as app', 'i.f9.desc': 'Install Studytracker as an app on your iPhone — with its own icon, full-screen mode and offline access.',
      'i.f10.title': 'Study now', 'i.f10.desc': 'Studytracker automatically suggests the topic with the lowest progress — so you always know where to start.',
      // INDEX – FAQ
      'i.faq.eyebrow': 'FAQ',
      'i.faq.title': 'Frequently asked questions.',
      'i.faq.q1': 'Is Studytracker free?', 'i.faq.a1': 'Yes, Studytracker is completely free. No subscription, no hidden costs.',
      'i.faq.q2': 'Do I need a Google account?', 'i.faq.a2': 'Yes, sign-in is done via Google. This keeps your data securely stored and synced across all devices.',
      'i.faq.q3': 'Is my data saved?', 'i.faq.a3': 'Yes. Your data is encrypted and stored in the cloud (Firebase by Google) and is only visible to you. Sign in on any device and your progress is instantly there.',
      'i.faq.q4': 'Does Studytracker work on mobile?', 'i.faq.a4': 'Yes. On iPhone you can install Studytracker as an app — with its own icon, full-screen mode and offline access. Open the site in Safari, tap "Share" then "Add to Home Screen". On desktop, Studytracker works directly in the browser.',
      'i.faq.q5': 'Can I customise my subjects?', 'i.faq.a5': 'Yes. You can freely add, rename and delete subjects, topics and categories — fully tailored to your studies.',
      'i.faq.q6': 'Is there a to-do feature?', 'i.faq.a6': 'Yes. You can create tasks with priority, due date and subject assignment. Open and completed tasks are clearly displayed.',
      'i.faq.q7': 'What are templates and how do they work?', 'i.faq.a7': 'Templates are ready-made subject structures with topics, categories and exam dates that you can import from other students. You can also share your own templates so your classmates don\'t have to set everything up again. You can even import templates from Excel files or images (via OCR).',
      'i.faq.q8': 'How do I install Studytracker on iPhone?', 'i.faq.a8': 'Open study-tracker.org in Safari, tap the Share icon (square with upward arrow), scroll down and choose "Add to Home Screen". Tap "Add" — done! The app appears as an icon on your home screen and runs in full-screen like a native app.',
      // INDEX – CTA & footer
      'i.cta.title': 'Ready to get started?', 'i.cta.desc': 'Free. Open source. Just sign in and go.',
      'i.cta.btn': 'Sign in with Google', 'i.footer': '© 2026 Studytracker',

      // FEATURES PAGE – Hero
      'f.hero.eyebrow': 'Feature overview',
      'f.hero.headline': 'Everything you need for<br>successful studying.',
      'f.hero.subhead': 'Studytracker combines study progress, task management and exam management in one simple, fast tool — free and without installation.',
      'f.hero.cta': 'Get started for free',
      // FEATURES PAGE – blocks
      'f.b1.tag': 'Core feature', 'f.b1.title': 'Study progress at a glance',
      'f.b1.p1': 'For each subject you maintain a list of topics. Each topic gets a status per study category (e.g. lecture, exercise, summary). This way you can see exactly what you have mastered and where gaps remain.',
      'f.b1.p2': 'Four status levels: <strong style="color:#555">Not started</strong> → <strong style="color:#d4a843">In progress</strong> → <strong style="color:#a78bfa">Review</strong> → <strong style="color:#00b87a">Done</strong>. Switch with a click, no effort.',
      'f.b2.tag': 'Overview', 'f.b2.title': 'See all subjects at once',
      'f.b2.p1': 'The overview page shows the overall progress of all subjects as progress bars — ideal for quickly deciding what to focus on next.',
      'f.b2.p2': 'The "Study now" card automatically suggests the subject with the lowest progress. You can close it or permanently disable it.',
      'f.b3.tag': 'To-do', 'f.b3.title': 'Stay on top of tasks',
      'f.b3.p1': 'Create tasks with priority (high, medium, low), due date and optional subject assignment. You always know what needs to be done next.',
      'f.b3.p2': 'Filter by open or completed tasks and sort by priority or date. Overdue tasks are automatically highlighted.',
      'f.b4.tag': 'Motivation', 'f.b4.title': 'Daily Dopamine Boost',
      'f.b4.p1': 'Set a daily study goal and see with an animated progress ring how far you have come today — a simple, honest motivation check.',
      'f.b4.p2': 'Every completed study unit is automatically counted. Progress resets daily — a fresh start every day.',
      'f.b5.tag': 'Exams', 'f.b5.title': 'Exam countdown',
      'f.b5.p1': 'Enter your exam dates and see at a glance how many days remain. The closer the exam, the more prominent the display — so you never walk into an exam unprepared.',
      'f.b5.p2': 'Exams are sorted by date. The next exam is always at the top.',
      'f.b6.tag': 'Cloud sync', 'f.b6.title': 'Your data. Everywhere.',
      'f.b6.p1': 'All changes are automatically saved to the cloud (Firebase by Google). Open Studytracker on your laptop at the library and on your phone at home — your progress is always up to date.',
      'f.b6.p2': 'A status indicator in the header shows whether data is being saved or everything is in sync. The app also works offline — changes are synced once you are back online.',
      'f.b7.tag': 'New', 'f.b7.title': 'Share & import templates',
      'f.b7.p1': 'You don\'t have to set up everything yourself. Export your subjects, topics and categories as a template and share them with classmates — or import a ready-made template with one click.',
      'f.b7.p2': 'Perfect for the start of the semester: one person creates the structure, everyone else benefits. Save yourself the double work and start studying right away.',
      // FEATURES PAGE – Setup
      'f.setup.label': 'Setup', 'f.setup.title': 'Ready in 3 steps.',
      'f.setup.sub': 'No installation, no subscription. Just sign in and go.',
      'f.step1.title': 'Sign in with Google', 'f.step1.desc': 'Click "Sign in with Google" on the home page. All you need is a Google account — that\'s it. No email, no password, no confirmation email.',
      'f.step2.title': 'Add subjects & topics', 'f.step2.desc': 'Create your subjects (e.g. Economics, Maths, Law) and add the topics for your semester to each. You can add or rename topics at any time — by clicking the ✏ icon.',
      'f.step3.title': 'Define study categories', 'f.step3.desc': 'Choose which study categories you want to track (e.g. lecture, exercise, summary, past exams). These appear as columns in the table.',
      // FEATURES PAGE – CTA & footer
      'f.cta.title': 'Ready to get started?', 'f.cta.desc': 'Free. No installation. Just sign in and go.',
      'f.cta.btn': 'Sign in with Google', 'f.footer': '© 2026 Studytracker',

      // ABOUT PAGE – Hero
      'a.hero.eyebrow': 'About Studytracker',
      'a.hero.headline': 'Built by students.<br>For students.',
      'a.hero.subhead': 'Studytracker grew out of the real day-to-day of university life — too many tools, too little overview.',
      // ABOUT PAGE – Story
      'a.story.label': 'The story', 'a.story.title': 'Why Studytracker?',
      'a.story.p1': 'The same chaos at the start of every semester: Which topics do I still need to study for Economics? Have I finished the exercise sheets for Maths? When is the next exam anyway? Spreadsheets got too messy, other tools too complex.',
      'a.story.p2': 'Studytracker was built to solve exactly this problem — a simple, fast tool that makes study progress visible per subject and topic, without unnecessary overhead. No subscription, no app install, no learning curve.',
      'a.story.p3': 'Today students use Studytracker to structure their semester preparation, manage their tasks and keep exam dates in view — all in one place, automatically synced to the cloud.',
      // ABOUT PAGE – Values
      'a.val.label': 'Principles', 'a.val.title': 'What drives us.',
      'a.v1.title': 'Simplicity first', 'a.v1.desc': 'No feature that isn\'t really needed. Studytracker should be understood and used within seconds.',
      'a.v2.title': 'Privacy', 'a.v2.desc': 'Your study data belongs to you. It is securely encrypted and never shared or sold.',
      'a.v3.title': 'Available everywhere', 'a.v3.desc': 'No download, no setup. Studytracker runs in the browser — on a laptop at the library just as well as on a phone on the go.',
      'a.v4.title': 'Free', 'a.v4.desc': 'Studytracker is and will remain free. No freemium, no subscription, no hidden costs.',
      // ABOUT PAGE – Tech
      'a.tech.label': 'Technology', 'a.tech.title': 'What Studytracker is built with.',
      'a.tech.desc': 'Studytracker is intentionally lean — no framework overhead, only what is really needed.',
      // ABOUT PAGE – About me
      'a.me.label': 'About us', 'a.me.title': 'The developers',
      'a.me.p1': 'Studytracker was born from a real problem: during the assessment year, you\'re juggling multiple subjects, exam dates, and study material all at once \u2013 and you quickly lose track. Existing tools never really convinced us. So we decided to build our own solution.',
      'a.me.p2': 'The result is Studytracker: a lean, intuitive tool that does exactly what students need. No unnecessary overhead, no costs, no bells and whistles \u2013 just a clear focus on learning progress.',
      'a.me.p3': 'We develop Studytracker alongside our studies and welcome any feedback that makes the app even better.',
      // ABOUT PAGE – Feedback
      'a.fb.label': 'Feedback', 'a.fb.title': 'We welcome your opinion.',
      'a.fb.desc': 'Studytracker is a side project we actively develop. Constructive criticism, suggestions for improvement and honest feedback are very welcome \u2014 that\'s the only way the tool gets better. What\'s missing? What annoys you? Feel free to write to us.',
      'a.fb.name': 'Your name', 'a.fb.email': 'Your email address',
      'a.fb.message': 'Your message or feedback...', 'a.fb.send': 'Send message',
      // ABOUT PAGE – CTA & footer
      'a.cta.title': 'Ready to get started?', 'a.cta.desc': 'Free. No installation. Just sign in and go.',
      'a.cta.btn': 'Sign in with Google', 'a.footer': '© 2026 Studytracker',
    }
  };

  function applyLang(lang) {
    var t = T[lang];
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (t[k] !== undefined) el.textContent = t[k];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-html');
      if (t[k] !== undefined) el.innerHTML = t[k];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-placeholder');
      if (t[k] !== undefined) el.placeholder = t[k];
    });
    var btn = document.getElementById('lang-toggle');
    if (btn && t['nav.lang']) btn.textContent = t['nav.lang'];
    localStorage.setItem('st_lang', lang);
    document.documentElement.lang = lang;
  }

  function initLang() {
    var saved = localStorage.getItem('st_lang') || 'de';
    applyLang(saved);
    var btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        applyLang((localStorage.getItem('st_lang') || 'de') === 'de' ? 'en' : 'de');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLang);
  } else {
    initLang();
  }
})();

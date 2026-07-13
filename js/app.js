// Main Application Controller & Router for Learning Machine
class AppController {
  constructor() {
    this.currentRenderedLessonId = null;
    this.currentRenderedView = null;
    this.init();
  }

  init() {
    this.renderSidebar();
    this.attachTabListeners();
    
    // Subscribe to state store changes (only update navbar & sidebar, avoid destroying active views)
    store.subscribe(() => {
      this.updateNavbarProgress();
      this.renderSidebar();
      this.syncActiveView();
    });

    // Initial render
    this.updateNavbarProgress();
    store.setActiveLesson(101);
  }

  renderSidebar() {
    const container = document.getElementById('sidebarModulesContainer');
    if (!container) return;

    container.innerHTML = COURSE_DATA.modules.map(mod => {
      const isQuizPassed = store.state.quizProgress[mod.id]?.passed;

      return `
        <div class="module-group">
          <div class="module-header">
            <span>${mod.title}</span>
            <span class="status-indicator ${isQuizPassed ? 'completed' : ''}" title="${isQuizPassed ? 'Module Quiz Passed' : 'In Progress'}">
              ${isQuizPassed ? '✔' : '•'}
            </span>
          </div>

          <div class="lesson-list">
            ${mod.lessons.map(lesson => {
              const prog = store.state.lessonProgress[lesson.id] || {};
              const isActive = store.state.activeLessonId === lesson.id;
              const isCompleted = prog.isCompleted;

              return `
                <div class="lesson-item ${isActive ? 'active' : ''}" onclick="store.setActiveLesson(${lesson.id})">
                  <div class="status-indicator ${isCompleted ? 'completed' : (prog.currentSeconds > 0 ? 'in-progress' : '')}">
                    ${isCompleted ? '✔' : ''}
                  </div>
                  <span style="flex-grow: 1;">${lesson.title}</span>
                </div>
              `;
            }).join('')}

            <div class="lesson-item ${store.state.activeView === 'quiz' && store.state.activeModuleId === mod.id ? 'active' : ''}"
                 style="margin-top: 0.2rem; border-top: 1px dashed rgba(255,255,255,0.06);"
                 onclick="window.appController.openModuleQuiz(${mod.id})">
              <div class="status-indicator ${isQuizPassed ? 'completed' : ''}">
                ${isQuizPassed ? '🏆' : '?'}
              </div>
              <span style="flex-grow: 1; font-weight: 600; color: ${isQuizPassed ? '#34d399' : 'var(--text-secondary)'};">
                📝 Module ${mod.id} Quiz
              </span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  attachTabListeners() {
    const tabLesson = document.getElementById('tabLessonBtn');
    const tabExplainer = document.getElementById('tabExplainerBtn');
    const tabSandbox = document.getElementById('tabSandboxBtn');
    const tabQuiz = document.getElementById('tabQuizBtn');

    if (tabLesson) tabLesson.onclick = () => store.setActiveView('lesson');
    if (tabExplainer) tabExplainer.onclick = () => store.setActiveView('explainer');
    if (tabSandbox) tabSandbox.onclick = () => store.setActiveView('sandbox');
    if (tabQuiz) tabQuiz.onclick = () => {
      store.setActiveView('quiz');
      if (window.quizSystem) {
        window.quizSystem.startQuizForModule(store.state.activeModuleId);
      }
    };
  }

  openModuleQuiz(moduleId) {
    store.state.activeModuleId = moduleId;
    store.setActiveView('quiz');
  }

  updateNavbarProgress() {
    const pct = store.getOverallProgressPercentage();
    const fill = document.getElementById('overallProgressFill');
    const text = document.getElementById('overallProgressText');
    const certBadge = document.getElementById('certNavBadge');

    if (fill) fill.style.width = `${pct}%`;
    if (text) text.innerText = `${pct}%`;

    if (certBadge) {
      if (store.state.certificate.unlocked) {
        certBadge.className = 'cert-badge unlocked';
        certBadge.innerHTML = '🎓 Certificate Unlocked (View)';
        certBadge.onclick = () => window.certificateSystem.openModal();
      } else {
        certBadge.className = 'cert-badge locked';
        certBadge.innerHTML = '🔒 Certificate Locked';
        certBadge.onclick = null;
      }
    }
  }

  syncActiveView() {
    const view = store.state.activeView;
    const lessonId = store.state.activeLessonId;

    // Show/hide view containers
    const videoC = document.getElementById('videoSystemContainer');
    const explainerC = document.getElementById('visualExplainerContainer');
    const sandboxC = document.getElementById('sandboxSystemContainer');
    const quizC = document.getElementById('quizSystemContainer');
    const tabsC = document.getElementById('systemTabsContainer');

    if (view === 'verification') {
      if (tabsC) tabsC.style.display = 'none';
      return;
    } else {
      if (tabsC) tabsC.style.display = 'flex';
    }

    if (videoC) videoC.style.display = view === 'lesson' ? 'block' : 'none';
    if (explainerC) explainerC.style.display = view === 'explainer' ? 'block' : 'none';
    if (sandboxC) sandboxC.style.display = view === 'sandbox' ? 'block' : 'none';
    if (quizC) quizC.style.display = view === 'quiz' ? 'block' : 'none';

    // Update tab button styling
    const tabLesson = document.getElementById('tabLessonBtn');
    const tabExplainer = document.getElementById('tabExplainerBtn');
    const tabSandbox = document.getElementById('tabSandboxBtn');
    const tabQuiz = document.getElementById('tabQuizBtn');

    const setActiveBtn = (activeEl, others) => {
      if (activeEl) activeEl.className = 'btn btn-primary';
      others.forEach(el => {
        if (el) el.className = 'btn btn-secondary';
      });
    };

    // Only re-render component if the view or lesson actually changed!
    const needsRender = (this.currentRenderedView !== view) || (this.currentRenderedLessonId !== lessonId);

    if (view === 'lesson') {
      setActiveBtn(tabLesson, [tabExplainer, tabSandbox, tabQuiz]);
      if (needsRender) {
        const lesson = store.findLessonById(lessonId);
        if (lesson && window.videoSystem) window.videoSystem.renderLesson(lesson);
      }
    } else if (view === 'explainer') {
      setActiveBtn(tabExplainer, [tabLesson, tabSandbox, tabQuiz]);
      if (needsRender) {
        const lesson = store.findLessonById(lessonId);
        if (lesson && window.visualExplainer) window.visualExplainer.renderExplainer(lesson.explainerType);
      }
    } else if (view === 'sandbox') {
      setActiveBtn(tabSandbox, [tabLesson, tabExplainer, tabQuiz]);
      if (needsRender) {
        const lesson = store.findLessonById(lessonId);
        if (lesson && window.sandboxSystem) window.sandboxSystem.renderSandbox(lesson);
      }
    } else if (view === 'quiz') {
      setActiveBtn(tabQuiz, [tabLesson, tabExplainer, tabSandbox]);
      if (needsRender) {
        if (window.quizSystem) window.quizSystem.startQuizForModule(store.state.activeModuleId);
      }
    }

    this.currentRenderedView = view;
    this.currentRenderedLessonId = lessonId;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.appController = new AppController();
});

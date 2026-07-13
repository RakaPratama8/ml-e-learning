// System 3: Question Bank Quiz Engine with Instant Pedagogical Feedback Loops
class QuizSystem {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentModuleId = 1;
    this.questions = [];
    this.currentIndex = 0;
    this.userAnswers = {};
    this.isCompleted = false;
  }

  startQuizForModule(moduleId) {
    this.currentModuleId = moduleId;
    // Filter questions belonging to this module
    const pool = COURSE_DATA.questions.filter(q => q.moduleId === moduleId);

    // Randomize order (or use available pool)
    this.questions = [...pool].sort(() => 0.5 - Math.random());
    this.currentIndex = 0;
    this.userAnswers = {};
    this.isCompleted = false;

    this.renderCurrentQuestion();
  }

  renderCurrentQuestion() {
    if (!this.container) return;
    const q = this.questions[this.currentIndex];

    if (!q) {
      this.renderQuizResults();
      return;
    }

    const selectedIndex = this.userAnswers[q.id];
    const isAnswered = selectedIndex !== undefined;
    const isCorrect = isAnswered && selectedIndex === q.correctIndex;

    const formatTime = (secs) => {
      const m = Math.floor(secs / 60).toString().padStart(2, '0');
      const s = Math.floor(secs % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    };

    this.container.innerHTML = `
      <div class="glass-card quiz-card">
        <div class="card-header">
          <div>
            <h3 style="margin-top: 0.2rem; font-size: 1.35rem;">
              Module ${this.currentModuleId} Knowledge Check (Question ${this.currentIndex + 1} of ${this.questions.length})
            </h3>
          </div>
          <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-secondary);">
            Question ${this.currentIndex + 1} / ${this.questions.length}
          </span>
        </div>

        <h4 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--text-primary); line-height: 1.5;">
          ${q.questionText}
        </h4>

        <div id="optionsContainer">
          ${q.options.map((opt, idx) => {
            let optionClass = "option-btn";
            if (isAnswered) {
              if (idx === q.correctIndex) {
                optionClass += " correct";
              } else if (idx === selectedIndex && !isCorrect) {
                optionClass += " incorrect";
              }
            }
            return `
              <button class="${optionClass}" 
                      onclick="window.quizSystem.selectAnswer('${q.id}', ${idx})"
                      ${isAnswered ? 'disabled' : ''}>
                <span style="font-weight: 700; margin-right: 0.6rem;">${String.fromCharCode(65 + idx)}.</span>
                ${opt}
              </button>
            `;
          }).join('')}
        </div>

        ${isAnswered ? `
          <div class="remediation-box" style="border-left-color: ${isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)'};">
            <div style="font-weight: 800; font-size: 1.05rem; margin-bottom: 0.4rem; color: ${isCorrect ? '#34d399' : '#f87171'};">
              ${isCorrect ? '✅ Correct Explanation' : '❌ Incorrect — Immediate Remediation Feedback'}
            </div>
            <p style="color: var(--text-primary); font-size: 0.93rem; margin-bottom: 0.6rem;">
              ${q.explanation}
            </p>
            ${!isCorrect ? `
              <div class="timestamp-link" onclick="window.quizSystem.jumpToRemediationVideo(${q.lessonId}, ${q.videoTimestampSec})">
                🎬 Jump directly to Video Lesson #${q.lessonId} at [${formatTime(q.videoTimestampSec)}] to review this concept →
              </div>
            ` : ''}
          </div>
        ` : ''}

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; padding-top: 1.25rem; border-top: 1px solid var(--border-glass);">
          <span style="font-size: 0.85rem; color: var(--text-muted);">
            Questions are randomly sampled from the Module Question Bank
          </span>

          <button class="btn btn-primary" 
                  onclick="window.quizSystem.nextQuestion()"
                  ${!isAnswered ? 'disabled' : ''}>
            ${this.currentIndex < this.questions.length - 1 ? 'Next Question →' : 'View Module Score & Certificate Check →'}
          </button>
        </div>
      </div>
    `;
  }

  selectAnswer(questionId, optionIndex) {
    if (this.userAnswers[questionId] !== undefined) return;
    this.userAnswers[questionId] = optionIndex;
    this.renderCurrentQuestion();
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex += 1;
      this.renderCurrentQuestion();
    } else {
      this.renderQuizResults();
    }
  }

  jumpToRemediationVideo(lessonId, timestampSec) {
    store.setActiveLesson(lessonId);
    setTimeout(() => {
      if (window.videoSystem) {
        window.videoSystem.seekTo(timestampSec);
      }
    }, 150);
  }

  renderQuizResults() {
    let correctCount = 0;
    this.questions.forEach(q => {
      if (this.userAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const total = this.questions.length;
    const pct = Math.round((correctCount / total) * 100);
    const passed = pct >= 60;

    if (passed) {
      store.recordQuizPassed(this.currentModuleId, pct);
    }

    this.container.innerHTML = `
      <div class="glass-card quiz-card" style="text-align: center; padding: 3rem 2rem;">
        <div style="font-size: 3.5rem; margin-bottom: 1rem;">
          ${passed ? '🏆' : '📚'}
        </div>
        <h3 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 0.5rem; color: ${passed ? '#34d399' : '#f87171'};">
          ${passed ? 'Module Quiz Passed!' : 'Quiz Needs Review'}
        </h3>
        <p style="font-size: 1.15rem; color: var(--text-secondary); margin-bottom: 2rem;">
          You scored <strong style="color: var(--text-primary);">${correctCount} of ${total} (${pct}%)</strong> on this assessment.
        </p>

        <div style="max-width: 500px; margin: 0 auto 2rem; background: rgba(0,0,0,0.3); padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border-glass);">
          ${passed 
            ? '🎉 Great job! Your progress record has been verified. Check your top navigation bar to see if your Certificate of Completion has unlocked!'
            : '💡 Tip: Review the lesson videos and hands-on Pyodide exercises, then retry the quiz.'}
        </div>

        <div style="display: flex; justify-content: center; gap: 1rem;">
          <button class="btn btn-secondary" onclick="window.quizSystem.startQuizForModule(${this.currentModuleId})">
            ↺ Retake Quiz
          </button>
          <button class="btn btn-primary" onclick="store.setActiveLesson(101)">
            Return to Curriculum
          </button>
          ${store.state.certificate.unlocked ? `
            <button class="btn" style="background: linear-gradient(135deg, #10b981, #00f2fe); color: #000; font-weight: 800;" onclick="window.certificateSystem.openModal()">
              🎓 View Certificate
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }
}

window.quizSystem = new QuizSystem('quizSystemContainer');

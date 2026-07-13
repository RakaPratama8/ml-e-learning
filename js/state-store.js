// Simple Reactive State Store for Learning Machine
class StateStore {
  constructor() {
    this.state = {
      activeModuleId: 1,
      activeLessonId: 101,
      activeView: 'lesson', // 'lesson', 'sandbox', 'quiz', 'certificate'
      
      // Map of lessonId -> { currentSeconds: 0, maxSeconds: 0, isCompleted: false }
      lessonProgress: {
        101: { currentSeconds: 0, maxSeconds: 0, isCompleted: false },
        102: { currentSeconds: 0, maxSeconds: 0, isCompleted: false },
        201: { currentSeconds: 0, maxSeconds: 0, isCompleted: false },
        301: { currentSeconds: 0, maxSeconds: 0, isCompleted: false }
      },

      // Map of moduleId -> { passed: false, score: 0 }
      quizProgress: {
        1: { passed: false, score: 0 },
        2: { passed: false, score: 0 },
        3: { passed: false, score: 0 }
      },

      // Certificate State
      certificate: {
        unlocked: false,
        id: "LM-2026-M9X2A8",
        recipientName: "Muhamad Raka Pratama",
        issueDate: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
      }
    };

    this.listeners = [];
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => cb(this.state));
  }

  setActiveLesson(lessonId) {
    const lesson = this.findLessonById(lessonId);
    if (lesson) {
      this.state.activeLessonId = lessonId;
      this.state.activeModuleId = this.findModuleIdByLessonId(lessonId);
      this.state.activeView = 'lesson';
      this.notify();
    }
  }

  setActiveView(viewName) {
    this.state.activeView = viewName;
    this.notify();
  }

  updateVideoProgress(lessonId, currentSeconds, maxSeconds, durationSeconds) {
    const prog = this.state.lessonProgress[lessonId] || { currentSeconds: 0, maxSeconds: 0, isCompleted: false };
    prog.currentSeconds = Math.round(currentSeconds);
    prog.maxSeconds = Math.max(prog.maxSeconds, Math.round(maxSeconds));

    // Completion Gate: 95% threshold OR explicit completion
    if (prog.maxSeconds >= durationSeconds * 0.95) {
      prog.isCompleted = true;
    }
    this.state.lessonProgress[lessonId] = prog;
    this.checkCourseCompletion();
    this.notify();
  }

  markLessonCompleted(lessonId) {
    if (this.state.lessonProgress[lessonId]) {
      this.state.lessonProgress[lessonId].isCompleted = true;
      this.checkCourseCompletion();
      this.notify();
    }
  }

  recordQuizPassed(moduleId, scorePercent) {
    this.state.quizProgress[moduleId] = {
      passed: true,
      score: scorePercent
    };
    // Also auto-complete the lessons in that module if not already completed
    const mod = COURSE_DATA.modules.find(m => m.id === moduleId);
    if (mod) {
      mod.lessons.forEach(l => {
        if (this.state.lessonProgress[l.id]) {
          this.state.lessonProgress[l.id].isCompleted = true;
        }
      });
    }
    this.checkCourseCompletion();
    this.notify();
  }

  checkCourseCompletion() {
    const allLessonsCompleted = Object.values(this.state.lessonProgress).every(p => p.isCompleted);
    const allQuizzesPassed = Object.values(this.state.quizProgress).every(q => q.passed);
    
    if (allLessonsCompleted && allQuizzesPassed && !this.state.certificate.unlocked) {
      this.state.certificate.unlocked = true;
      console.log("🎉 All modules & quizzes completed! Certificate Unlocked!");
    }
  }

  // Quick helper to unlock everything for demo/testing
  unlockAllForDemo() {
    Object.keys(this.state.lessonProgress).forEach(id => {
      this.state.lessonProgress[id].isCompleted = true;
      this.state.lessonProgress[id].currentSeconds = 120;
      this.state.lessonProgress[id].maxSeconds = 180;
    });
    Object.keys(this.state.quizProgress).forEach(id => {
      this.state.quizProgress[id] = { passed: true, score: 100 };
    });
    this.state.certificate.unlocked = true;
    this.notify();
  }

  findLessonById(lessonId) {
    for (const mod of COURSE_DATA.modules) {
      const found = mod.lessons.find(l => l.id === lessonId);
      if (found) return found;
    }
    return null;
  }

  findModuleIdByLessonId(lessonId) {
    for (const mod of COURSE_DATA.modules) {
      if (mod.lessons.some(l => l.id === lessonId)) {
        return mod.id;
      }
    }
    return 1;
  }

  getOverallProgressPercentage() {
    const totalLessons = Object.keys(this.state.lessonProgress).length;
    const completedLessons = Object.values(this.state.lessonProgress).filter(p => p.isCompleted).length;
    return Math.round((completedLessons / totalLessons) * 100);
  }
}

const store = new StateStore();

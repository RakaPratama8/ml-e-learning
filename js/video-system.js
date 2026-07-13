// Teaching Video System with Stable YouTube Embed Support & Completion Gates
class VideoSystem {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.isPlaying = false;
    this.currentLesson = null;
    this.currentTime = 0;
    this.timerInterval = null;
    this.useYouTube = false;
  }

  renderLesson(lesson) {
    this.stopPlayback();
    this.currentLesson = lesson;
    this.currentTime = 0;

    const progress = store.state.lessonProgress[lesson.id] || { currentSeconds: 0, maxSeconds: 0, isCompleted: false };
    const isCompleted = progress.isCompleted;
    this.useYouTube = Boolean(lesson.youtubeId);

    const formatTime = (secs) => {
      const m = Math.floor(secs / 60).toString().padStart(2, '0');
      const s = Math.floor(secs % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    };

    this.container.innerHTML = `
      <div class="video-player-wrapper">
        <div class="simulated-video-screen" id="simulatedScreen" style="padding: ${this.useYouTube ? '0' : '2rem'};">
          ${this.useYouTube ? `
            <div style="position: absolute; top: 1rem; left: 1.5rem; right: 1.5rem; z-index: 10; display: flex; justify-content: space-between; align-items: center; pointer-events: none;">
              <span class="tag tag-cyan" style="pointer-events: auto; background: rgba(10,14,23,0.85);">YouTube Video Engine — Lesson #${lesson.id}</span>
            </div>
            <div id="youtubePlayerContainer" style="width: 100%; height: 100%;"></div>
          ` : `
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <span class="tag tag-cyan">System 1: Video State Management</span>
              <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-secondary);">
                ID: #${lesson.id}
              </span>
            </div>

            <div class="video-screen-content">
              <div style="width: 72px; height: 72px; border-radius: 50%; background: rgba(0, 242, 254, 0.15); border: 2px solid var(--accent-cyan); display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem; cursor: pointer;" id="playCenterBtn">
                <span id="playCenterIcon" style="font-size: 1.8rem; color: var(--accent-cyan);">▶</span>
              </div>
              <h2 class="video-topic-title">${lesson.title}</h2>
              <p style="color: var(--text-secondary); max-width: 580px; margin: 0 auto 1.5rem;">
                ${lesson.videoTopic}
              </p>
            </div>
          `}
        </div>

        <div style="padding: 0.85rem 1.25rem; background: rgba(13, 18, 30, 0.95); border-top: 1px solid var(--border-glass); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); margin-right: 0.35rem;">📍 Jump to Concept:</span>
            ${lesson.keyTimestamps.map(t => `
              <button class="btn btn-secondary" style="padding: 0.3rem 0.75rem; font-size: 0.78rem;" onclick="window.videoSystem.seekTo(${t.time})">
                ${formatTime(t.time)} - ${t.label}
              </button>
            `).join('')}
          </div>

          <button class="btn btn-secondary" style="padding: 0.4rem 0.85rem; font-size: 0.8rem;" id="simCompleteBtn" title="Simulate finishing video for testing">
            ⏩ Skip to End (Demo)
          </button>
        </div>

        ${!this.useYouTube ? `
          <div class="video-controls">
            <button class="btn btn-primary" style="padding: 0.45rem 1rem;" id="playPauseBtn">
              ▶ Play
            </button>

            <span style="font-family: var(--font-mono); font-size: 0.85rem; min-width: 95px;" id="timeDisplay">
              00:00 / ${formatTime(lesson.durationSeconds)}
            </span>

            <div class="seek-bar-container" id="seekBar">
              <div class="seek-bar-progress" id="seekProgress" style="width: 0%;"></div>
            </div>
          </div>
        ` : ''}
      </div>

      <div class="completion-gate-banner ${isCompleted ? 'completed' : ''}" id="gateBanner">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-size: 1.3rem;" id="gateBannerIcon">${isCompleted ? '✅' : '🔒'}</span>
          <div>
            <div style="font-weight: 700;" id="gateBannerTitle">
              ${isCompleted ? 'Lesson Completed! Completion Gate Unlocked' : 'Completion Gate Locked'}
            </div>
            <div style="font-size: 0.82rem; opacity: 0.9;" id="gateBannerSub">
              ${isCompleted 
                ? 'You have completed this video lesson. You can proceed to the interactive sandbox & quiz.' 
                : 'Watch until the end (or click Skip to End for testing) to unlock Mark as Complete.'}
            </div>
          </div>
        </div>

        <button class="btn ${isCompleted ? 'btn-primary' : 'btn-secondary'}" 
                id="markCompleteBtn" 
                ${isCompleted ? '' : 'disabled'}>
          ${isCompleted ? 'Next Step: Sandbox →' : 'Complete Video First'}
        </button>
      </div>
    `;

    if (this.useYouTube) {
      this.initYouTubePlayer(lesson.youtubeId);
    }

    this.attachEventListeners();
  }

  initYouTubePlayer(youtubeId) {
    const container = document.getElementById('youtubePlayerContainer');
    if (!container) return;

    const embedUrl = `https://www.youtube.com/embed/${youtubeId}?rel=0`;

    container.innerHTML = `
      <iframe id="ytIframe_${this.currentLesson.id}"
              src="${embedUrl}" 
              style="width: 100%; height: 100%; border: none;" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
      </iframe>
    `;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    // Progress tracker for completion gate without re-rendering DOM
    this.timerInterval = setInterval(() => {
      if (!this.currentLesson) return;
      if (this.currentTime < this.currentLesson.durationSeconds) {
        this.currentTime += 1;
        store.updateVideoProgress(
          this.currentLesson.id,
          this.currentTime,
          this.currentTime,
          this.currentLesson.durationSeconds
        );

        this.syncGateBannerDOM();
      }
    }, 1000);
  }

  syncGateBannerDOM() {
    if (!this.currentLesson) return;
    const prog = store.state.lessonProgress[this.currentLesson.id];
    if (prog && prog.isCompleted) {
      const banner = document.getElementById('gateBanner');
      if (banner && !banner.classList.contains('completed')) {
        banner.classList.add('completed');
        const icon = document.getElementById('gateBannerIcon');
        const title = document.getElementById('gateBannerTitle');
        const sub = document.getElementById('gateBannerSub');
        const btn = document.getElementById('markCompleteBtn');

        if (icon) icon.innerText = '✅';
        if (title) title.innerText = 'Lesson Completed! Completion Gate Unlocked';
        if (sub) sub.innerText = 'You have completed this video lesson. You can proceed to the interactive sandbox & quiz.';
        if (btn) {
          btn.className = 'btn btn-primary';
          btn.removeAttribute('disabled');
          btn.innerText = 'Next Step: Sandbox →';
        }
      }
    }
  }

  attachEventListeners() {
    const playBtn = document.getElementById('playPauseBtn');
    const centerBtn = document.getElementById('playCenterBtn');
    const seekBar = document.getElementById('seekBar');
    const simCompleteBtn = document.getElementById('simCompleteBtn');
    const markCompleteBtn = document.getElementById('markCompleteBtn');

    const togglePlay = () => {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    };

    if (playBtn) playBtn.onclick = togglePlay;
    if (centerBtn) centerBtn.onclick = togglePlay;

    if (seekBar) {
      seekBar.onclick = (e) => {
        const rect = seekBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, clickX / rect.width));
        const targetTime = pct * this.currentLesson.durationSeconds;
        this.seekTo(targetTime);
      };
    }

    if (simCompleteBtn) {
      simCompleteBtn.onclick = () => {
        this.currentTime = this.currentLesson.durationSeconds;
        store.markLessonCompleted(this.currentLesson.id);
        this.syncGateBannerDOM();
      };
    }

    if (markCompleteBtn) {
      markCompleteBtn.onclick = () => {
        store.markLessonCompleted(this.currentLesson.id);
        store.setActiveView('sandbox');
      };
    }
  }

  play() {
    if (!this.currentLesson || this.useYouTube) return;
    this.isPlaying = true;
    this.updatePlayPauseUI();

    this.timerInterval = setInterval(() => {
      if (this.currentTime < this.currentLesson.durationSeconds) {
        this.currentTime += 1;
        this.updateProgressUI();

        store.updateVideoProgress(
          this.currentLesson.id,
          this.currentTime,
          this.currentTime,
          this.currentLesson.durationSeconds
        );

        this.syncGateBannerDOM();
      } else {
        this.pause();
      }
    }, 1000);
  }

  pause() {
    this.isPlaying = false;
    this.updatePlayPauseUI();
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  stopPlayback() {
    this.pause();
  }

  seekTo(targetSeconds) {
    if (!this.currentLesson) return;
    this.currentTime = Math.min(this.currentLesson.durationSeconds, Math.max(0, targetSeconds));
    store.updateVideoProgress(
      this.currentLesson.id,
      this.currentTime,
      this.currentTime,
      this.currentLesson.durationSeconds
    );

    if (this.useYouTube) {
      const iframe = document.getElementById(`ytIframe_${this.currentLesson.id}`);
      if (iframe) {
        iframe.src = `https://www.youtube.com/embed/${this.currentLesson.youtubeId}?start=${Math.round(targetSeconds)}&autoplay=1&rel=0`;
      }
    } else {
      this.updateProgressUI();
    }

    this.syncGateBannerDOM();
  }

  updatePlayPauseUI() {
    const playBtn = document.getElementById('playPauseBtn');
    const icon = document.getElementById('playCenterIcon');
    if (playBtn) playBtn.innerHTML = this.isPlaying ? '❚❚ Pause' : '▶ Play';
    if (icon) icon.innerHTML = this.isPlaying ? '❚❚' : '▶';
  }

  updateProgressUI() {
    if (!this.currentLesson || this.useYouTube) return;
    const formatTime = (secs) => {
      const m = Math.floor(secs / 60).toString().padStart(2, '0');
      const s = Math.floor(secs % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    };

    const timeDisp = document.getElementById('timeDisplay');
    const seekProg = document.getElementById('seekProgress');

    if (timeDisp) {
      timeDisp.innerText = `${formatTime(this.currentTime)} / ${formatTime(this.currentLesson.durationSeconds)}`;
    }
    if (seekProg) {
      const pct = (this.currentTime / this.currentLesson.durationSeconds) * 100;
      seekProg.style.width = `${pct}%`;
    }
  }
}

window.videoSystem = new VideoSystem('videoSystemContainer');

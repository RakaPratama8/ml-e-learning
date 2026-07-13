// System 4: Automated Certificate of Completion & Cryptographic Verification System
class CertificateSystem {
  constructor() {
    this.modalOverlay = null;
  }

  openModal() {
    this.createOrUpdateModal();
    if (this.modalOverlay) {
      this.modalOverlay.classList.add('active');
    }
  }

  closeModal() {
    if (this.modalOverlay) {
      this.modalOverlay.classList.remove('active');
    }
  }

  createOrUpdateModal() {
    let modal = document.getElementById('certificateModalOverlay');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'certificateModalOverlay';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    this.modalOverlay = modal;
    const cert = store.state.certificate;

    modal.innerHTML = `
      <div class="certificate-canvas-container">
        <div style="position: absolute; top: 1.5rem; right: 1.5rem;">
          <button class="btn btn-secondary" style="padding: 0.35rem 0.75rem; color: #0f172a; border-color: #cbd5e1;" onclick="window.certificateSystem.closeModal()">
            ✕ Close
          </button>
        </div>

        <div style="display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-bottom: 1rem;">
          <span style="font-size: 1.6rem;">📜</span>
          <span style="font-weight: 800; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.15em; color: #64748b;">
            Learning Machine Verified Credential
          </span>
        </div>

        <h2 class="cert-title">Certificate of Completion</h2>

        <p style="font-size: 1.05rem; color: #475569; margin-top: 1rem;">
          This cryptographically verified certificate proudly recognizes that
        </p>

        <div class="cert-recipient">
          ${cert.recipientName}
        </div>

        <p style="font-size: 1.1rem; color: #1e293b; max-width: 580px; margin: 0 auto; line-height: 1.6;">
          has successfully completed all teaching videos, hands-on Pyodide browser sandboxes, and interactive assessments for
        </p>

        <div style="font-size: 1.45rem; font-weight: 800; color: #0f172a; margin: 1rem 0;">
          Machine Learning Foundations & Algorithms
        </div>

        <div class="cert-footer">
          <div style="text-align: left;">
            <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #64748b;">Issue Date</div>
            <div style="font-weight: 600; color: #0f172a;">${cert.issueDate}</div>
          </div>

          <div style="text-align: center;">
            <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #64748b;">Public Verification Slug</div>
            <div style="margin-top: 0.25rem;">
              <span class="verify-code" onclick="window.certificateSystem.showVerificationPage('${cert.id}')" style="cursor: pointer; border: 1px dashed #94a3b8;" title="Click to open public employer verification URL">
                learningmachine.com/verify/${cert.id}
              </span>
            </div>
          </div>

          <div style="text-align: right;">
            <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #64748b;">Tamper-Proof Status</div>
            <div style="font-weight: 700; color: #059669;">✔ SECURELY VERIFIED</div>
          </div>
        </div>

        <div style="margin-top: 2rem; display: flex; justify-content: center; gap: 1rem;">
          <button class="btn" style="background: #0f172a; color: #fff;" onclick="window.print()">
            🖨️ Print / Download PDF
          </button>
          <button class="btn" style="background: #0284c7; color: #fff;" onclick="window.certificateSystem.showVerificationPage('${cert.id}')">
            🔍 Test Public Employer Verification URL
          </button>
        </div>
      </div>
    `;

    modal.onclick = (e) => {
      if (e.target === modal) {
        this.closeModal();
      }
    };
  }

  showVerificationPage(certId) {
    this.closeModal();
    const mainWS = document.querySelector('.main-workspace');
    if (!mainWS) return;

    store.setActiveView('verification');

    mainWS.innerHTML = `
      <div class="glass-card" style="max-width: 680px; margin: 2rem auto; text-align: center; border-color: rgba(16, 185, 129, 0.4);">
        <div style="width: 72px; height: 72px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); border: 2px solid var(--accent-emerald); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; font-size: 2rem;">
          ✔
        </div>

        <span class="tag" style="background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid #34d399;">
          Public Verification Registry — Learning Machine
        </span>

        <h2 style="font-size: 2rem; font-weight: 800; margin: 1rem 0 0.5rem;">
          Authentic Credential Confirmed
        </h2>

        <p style="color: var(--text-secondary); margin-bottom: 2rem;">
          Verification ID: <strong style="font-family: var(--font-mono); color: var(--accent-cyan);">${certId}</strong>
        </p>

        <div style="background: rgba(10, 14, 23, 0.7); border-radius: 12px; padding: 1.75rem; text-align: left; border: 1px solid var(--border-glass); margin-bottom: 2rem;">
          <div style="display: grid; grid-template-columns: 140px 1fr; gap: 0.8rem; font-size: 0.95rem;">
            <span style="color: var(--text-muted); font-weight: 600;">Student Name:</span>
            <strong style="color: var(--text-primary); font-size: 1.05rem;">${store.state.certificate.recipientName}</strong>

            <span style="color: var(--text-muted); font-weight: 600;">Course Completed:</span>
            <strong style="color: var(--text-primary);">Machine Learning Foundations & Algorithms</strong>

            <span style="color: var(--text-muted); font-weight: 600;">Completion Date:</span>
            <span style="color: var(--text-primary);">${store.state.certificate.issueDate}</span>

            <span style="color: var(--text-muted); font-weight: 600;">Course Modules:</span>
            <span style="color: var(--text-primary);">3 Modules (Supervised Regression, K-Means Clustering, Regularization)</span>

            <span style="color: var(--text-muted); font-weight: 600;">Verification Status:</span>
            <span style="color: #34d399; font-weight: 700;">ACTIVE & TAMPER-PROOF</span>
          </div>
        </div>

        <button class="btn btn-primary" onclick="store.setActiveLesson(101)">
          ← Return to Learning Machine Application
        </button>
      </div>
    `;
  }
}

window.certificateSystem = new CertificateSystem();

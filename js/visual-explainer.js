// System 2: Visual Parameter Sliders & Interactive ML Explainers
class VisualExplainer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  renderExplainer(type) {
    if (!this.container) return;

    if (type === 'kmeans') {
      this.renderKMeansExplainer();
    } else {
      this.renderLinearRegressionExplainer();
    }
  }

  renderLinearRegressionExplainer() {
    this.container.innerHTML = `
      <div class="glass-card">
        <div class="card-header">
          <div>
            <h3 style="margin-top: 0.2rem; font-size: 1.35rem;">Interactive Linear Regression & Gradient Descent</h3>
          </div>
          <span style="color: var(--text-muted); font-size: 0.85rem;">Drag sliders to observe parameter impact</span>
        </div>

        <div class="slider-grid">
          <div class="slider-controls">
            <div class="control-group">
              <div class="control-label">
                <span>Slope Parameter (w)</span>
                <span id="slopeVal" style="color: var(--accent-cyan); font-family: var(--font-mono);">1.50</span>
              </div>
              <input type="range" class="slider-input" id="slopeSlider" min="-1" max="4" step="0.05" value="1.5">
            </div>

            <div class="control-group">
              <div class="control-label">
                <span>Intercept Parameter (b)</span>
                <span id="interceptVal" style="color: var(--accent-cyan); font-family: var(--font-mono);">2.00</span>
              </div>
              <input type="range" class="slider-input" id="interceptSlider" min="-5" max="8" step="0.1" value="2.0">
            </div>

            <div style="padding: 1rem; background: rgba(0,0,0,0.4); border-radius: 8px; border: 1px solid var(--border-glass);">
              <div style="font-size: 0.82rem; color: var(--text-secondary);">Mean Squared Error (MSE)</div>
              <div id="mseValue" style="font-size: 1.6rem; font-weight: 800; color: var(--accent-emerald); font-family: var(--font-mono);">
                0.421
              </div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">
                Optimal fit is MSE &approx; 0.38
              </div>
            </div>

            <button class="btn btn-secondary" id="snapOptimalBtn">
              🎯 Snap to Best Fit (Gradient Descent)
            </button>
          </div>

          <div style="background: #060911; border-radius: 12px; border: 1px solid var(--border-glass); padding: 1.25rem; height: 350px;">
            <canvas id="regressionCanvas" width="550" height="310" style="width: 100%; height: 100%;"></canvas>
          </div>
        </div>
      </div>
    `;

    this.initRegressionCanvas();
  }

  initRegressionCanvas() {
    const canvas = document.getElementById('regressionCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Sample data points (X, Y)
    const dataPoints = [
      { x: 1, y: 3.8 },
      { x: 2, y: 5.1 },
      { x: 3, y: 6.3 },
      { x: 4, y: 8.2 },
      { x: 5, y: 9.6 },
      { x: 6, y: 11.2 }
    ];

    const slopeSlider = document.getElementById('slopeSlider');
    const interceptSlider = document.getElementById('interceptSlider');
    const slopeVal = document.getElementById('slopeVal');
    const interceptVal = document.getElementById('interceptVal');
    const mseVal = document.getElementById('mseValue');
    const snapBtn = document.getElementById('snapOptimalBtn');

    const draw = () => {
      const w = parseFloat(slopeSlider.value);
      const b = parseFloat(interceptSlider.value);

      slopeVal.innerText = w.toFixed(2);
      interceptVal.innerText = b.toFixed(2);

      // Compute MSE
      let totalErr = 0;
      dataPoints.forEach(p => {
        const pred = w * p.x + b;
        totalErr += Math.pow(pred - p.y, 2);
      });
      const mse = totalErr / dataPoints.length;
      mseVal.innerText = mse.toFixed(3);
      mseVal.style.color = mse < 0.6 ? 'var(--accent-emerald)' : mse < 2.0 ? 'var(--accent-amber)' : 'var(--accent-rose)';

      // Clear & draw coordinates
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const toCoordX = (val) => 40 + (val / 7) * (canvas.width - 70);
      const toCoordY = (val) => canvas.height - 35 - (val / 15) * (canvas.height - 65);

      // Draw Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 6; i++) {
        ctx.beginPath();
        ctx.moveTo(toCoordX(i), toCoordY(0));
        ctx.lineTo(toCoordX(i), toCoordY(14));
        ctx.stroke();
      }

      // Draw Regression Line
      const y0 = w * 0 + b;
      const y7 = w * 7 + b;
      ctx.beginPath();
      ctx.moveTo(toCoordX(0), toCoordY(y0));
      ctx.lineTo(toCoordX(7), toCoordY(y7));
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw residual errors & points
      dataPoints.forEach(p => {
        const predY = w * p.x + b;
        ctx.beginPath();
        ctx.moveTo(toCoordX(p.x), toCoordY(p.y));
        ctx.lineTo(toCoordX(p.x), toCoordY(predY));
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.5)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.setLineDash([]);

        // Data point circle
        ctx.beginPath();
        ctx.arc(toCoordX(p.x), toCoordY(p.y), 6, 0, Math.PI * 2);
        ctx.fillStyle = '#f8fafc';
        ctx.fill();
        ctx.strokeStyle = '#4facfe';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    };

    if (slopeSlider) slopeSlider.oninput = draw;
    if (interceptSlider) interceptSlider.oninput = draw;
    if (snapBtn) {
      snapBtn.onclick = () => {
        slopeSlider.value = 1.48;
        interceptSlider.value = 2.15;
        draw();
      };
    }

    draw();
  }

  renderKMeansExplainer() {
    this.container.innerHTML = `
      <div class="glass-card">
        <div class="card-header">
          <div>
            <h3 style="margin-top: 0.2rem; font-size: 1.35rem;">Interactive K-Means Clustering Simulator</h3>
          </div>
          <span style="color: var(--text-muted); font-size: 0.85rem;">Real-time centroid Voronoi clustering</span>
        </div>

        <div class="slider-grid">
          <div class="slider-controls">
            <div class="control-group">
              <div class="control-label">
                <span>Number of Clusters (K)</span>
                <span id="kVal" style="color: var(--accent-cyan); font-family: var(--font-mono);">3</span>
              </div>
              <input type="range" class="slider-input" id="kSlider" min="2" max="5" step="1" value="3">
            </div>

            <div class="control-group">
              <div class="control-label">
                <span>Cluster Compactness</span>
                <span id="spreadVal" style="color: var(--accent-cyan); font-family: var(--font-mono);">High</span>
              </div>
              <input type="range" class="slider-input" id="spreadSlider" min="1" max="5" step="1" value="3">
            </div>

            <button class="btn btn-primary" id="reclusterBtn">
              ⚡ Re-run K-Means Convergence
            </button>
          </div>

          <div style="background: #060911; border-radius: 12px; border: 1px solid var(--border-glass); padding: 1.25rem; height: 350px;">
            <canvas id="kmeansCanvas" width="550" height="310" style="width: 100%; height: 100%;"></canvas>
          </div>
        </div>
      </div>
    `;

    this.initKMeansCanvas();
  }

  initKMeansCanvas() {
    const canvas = document.getElementById('kmeansCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const colors = ['#00f2fe', '#9b51e0', '#10b981', '#f59e0b', '#f43f5e'];

    // Generate clusters of points
    const points = [
      ...Array.from({ length: 14 }, () => ({ x: 120 + (Math.random() - 0.5) * 80, y: 90 + (Math.random() - 0.5) * 80 })),
      ...Array.from({ length: 14 }, () => ({ x: 420 + (Math.random() - 0.5) * 80, y: 110 + (Math.random() - 0.5) * 80 })),
      ...Array.from({ length: 14 }, () => ({ x: 270 + (Math.random() - 0.5) * 90, y: 230 + (Math.random() - 0.5) * 80 }))
    ];

    const kSlider = document.getElementById('kSlider');
    const kVal = document.getElementById('kVal');
    const reclusterBtn = document.getElementById('reclusterBtn');

    const computeAndDraw = () => {
      const k = parseInt(kSlider.value);
      kVal.innerText = k;

      // Initialize centroids evenly spaced
      const centroids = Array.from({ length: k }, (_, idx) => ({
        x: 100 + idx * (350 / Math.max(1, k - 1)),
        y: 150 + (idx % 2 === 0 ? -40 : 40)
      }));

      // Assign points to closest centroid
      points.forEach(p => {
        let minDist = Infinity;
        let bestC = 0;
        centroids.forEach((c, idx) => {
          const dist = Math.hypot(p.x - c.x, p.y - c.y);
          if (dist < minDist) {
            minDist = dist;
            bestC = idx;
          }
        });
        p.cluster = bestC;
      });

      // Clear & Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connection lines to centroids
      points.forEach(p => {
        const c = centroids[p.cluster];
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(c.x, c.y);
        ctx.strokeStyle = colors[p.cluster] + '30';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw data points
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = colors[p.cluster];
        ctx.fill();
      });

      // Draw Centroid markers
      centroids.forEach((c, idx) => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, 11, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = colors[idx];
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px Outfit';
        ctx.textAlign = 'center';
        ctx.fillText(`C${idx + 1}`, c.x, c.y + 4);
      });
    };

    if (kSlider) kSlider.oninput = computeAndDraw;
    if (reclusterBtn) reclusterBtn.onclick = computeAndDraw;
    computeAndDraw();
  }
}

window.visualExplainer = new VisualExplainer('visualExplainerContainer');

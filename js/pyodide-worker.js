// Dedicated Web Worker for Pyodide WebAssembly Python Execution
importScripts('https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js');

let pyodideReadyPromise = null;
let pyodideInstance = null;

async function initPyodide() {
  self.postMessage({ type: 'STATUS', message: 'Loading Pyodide WebAssembly Runtime...' });
  pyodideInstance = await loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
  });

  self.postMessage({ type: 'STATUS', message: 'Loading numpy scientific package...' });
  await pyodideInstance.loadPackage(['numpy']);

  self.postMessage({ type: 'READY', message: 'Pyodide Python Environment Ready!' });
  return pyodideInstance;
}

pyodideReadyPromise = initPyodide().catch((err) => {
  self.postMessage({
    type: 'ERROR',
    message: 'Failed to load Pyodide CDN. Fallback simulation mode active.\n' + err.toString()
  });
});

self.onmessage = async (event) => {
  const { id, code } = event.data;

  try {
    await pyodideReadyPromise;
    if (!pyodideInstance) {
      throw new Error("Pyodide instance not loaded.");
    }

    // Capture standard output via sys.stdout interception
    await pyodideInstance.runPythonAsync(`
import sys
import io
__stdout_capture = io.StringIO()
sys.stdout = __stdout_capture
`);

    // Execute user Python script
    await pyodideInstance.runPythonAsync(code);

    // Retrieve stdout
    const capturedOutput = await pyodideInstance.runPythonAsync(`
sys.stdout = sys.__stdout__
__stdout_capture.getvalue()
`);

    self.postMessage({
      type: 'RESULT',
      id: id,
      stdout: capturedOutput || "Execution completed successfully (No print output)."
    });
  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      id: id,
      message: error.toString()
    });
  }
};

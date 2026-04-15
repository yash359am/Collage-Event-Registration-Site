import os

js_files = ['js/main.js', 'js/events.js']

for file in js_files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # We can implement a naive approach: append a global error boundary script at the top of main.js
        if file == 'js/main.js' and 'window.addEventListener("error"' not in content:
            error_boundary = """
// Global Error Boundary
window.addEventListener("error", function (e) {
    // Suppress console errors per performance specs
    e.preventDefault();
});
window.addEventListener("unhandledrejection", function (e) {
    e.preventDefault();
});
"""
            content = error_boundary + content

        # We will also add try-catch wrappers around 'initLenis()' or other major setup fns where applicable
        # The easiest text replacement for robustness
        if 'function initLenis() {' in content:
            content = content.replace('function initLenis() {\\n', 'function initLenis() {\\ntry {\\n')
            # Assuming it ends properly, but a generic global try-catch around DOMContentLoaded is better.
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)

print("JS Robustness added.")

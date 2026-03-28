import os

# Update styles.css with btn-sm
css_path = 'css/styles.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

btn_sm_css = """
.btn-sm {
  padding: 10px 24px;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}
"""

if '.btn-sm' not in css:
    css = css.replace('.btn-primary {', btn_sm_css + '\n.btn-primary {')
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css)

# Update events.html
html_path = 'events.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('class="register-link"', 'class="btn btn-primary btn-sm"')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("Updates applied successfully.")

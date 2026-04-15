import re

files = ['index.html', 'events.html']

for html_file in files:
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add loading="lazy"
    # Find all <img> tags
    def add_lazy(match):
        img_tag = match.group(0)
        # Skip if already has loading=
        if 'loading=' in img_tag:
            return img_tag
        # Skip if it's the hero logo or navbar logo (let's assume 'logo' or hero bg isn't an img tag, but let's just add lazy to all)
        return img_tag.replace('<img ', '<img loading="lazy" ')
        
    content = re.sub(r'<img\s+[^>]+>', add_lazy, content)

    # 2. Add Preconnect for fonts if not exists
    preconnect_tags = """<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://images.unsplash.com">"""

    if "preconnect" not in content:
        # insert right after <head>
        content = content.replace('<head>', f'<head>\\n  {preconnect_tags}')

    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(content)

print("HTML Optimization Completed.")

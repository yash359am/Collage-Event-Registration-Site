files = ['index.html', 'events.html']
for fn in files:
    with open(fn, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('<script src="js/', '<script type="module" src="js/')
    with open(fn, 'w', encoding='utf-8') as f:
        f.write(content)
print("Added type module to scripts")

import re

html_file = 'events.html'

with open(html_file, 'r', encoding='utf-8') as f:
    orig_content = f.read()

# Replace all "Register Offline →" with "Register →"
content = orig_content.replace('Register Offline →', 'Register →')

# Now selectively target Cricket and Throw Ball and revert their specific links to "Register Offline →"
def revert_link(event_marker):
    global content
    parts = content.split(event_marker)
    if len(parts) < 2:
        print(f"Marker '{event_marker}' not found.")
        return
    
    pre = parts[0]
    post = parts[1]
    
    # Find the next Register button
    link_idx = post.find('Register →</a>')
    if link_idx == -1:
        print(f"Link not found after '{event_marker}'")
        return
        
    # Replace "Register →" with "Register Offline →" just for this occurrence
    new_post = post[:link_idx] + 'Register Offline →</a>' + post[link_idx + len('Register →</a>'):]
    content = pre + event_marker + new_post

revert_link("<!-- Event: Cricket (Men) -->")
revert_link("<!-- Event: Throw Ball (Women) -->")

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Links updated successfully!")

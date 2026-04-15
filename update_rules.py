import re

html_file = 'events.html'

with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

def replace_rules(event_comment_marker, new_rules_list):
    global content
    
    # Target structure: Look for the marker, then find the next `<ul class="rules-list">...</ul>`
    # and replace its inner contents.
    
    parts = content.split(event_comment_marker)
    if len(parts) < 2:
        print(f"Marker '{event_comment_marker}' not found.")
        return
    
    pre = parts[0]
    post = parts[1]
    
    ul_start = post.find('<ul class="rules-list">')
    if ul_start == -1:
        print(f"<ul> not found after '{event_comment_marker}'")
        return
        
    ul_start += len('<ul class="rules-list">')
    ul_end = post.find('</ul>', ul_start)
    
    new_ul_content = "\\n" + "\\n".join([f"                <li>{r}</li>" for r in new_rules_list]) + "\\n              "
    
    content = pre + event_comment_marker + post[:ul_start] + new_ul_content + post[ul_end:]


cricket_rules = [
    "Registration for this game will be offline only",
    "One team from one branch (team comprises 2nd, 3rd and 4th year students)",
    "One team from Basic Science & Humanities (team comprises students from all branches)",
    "Participants should make a team and get signature approval from their respective branch HOD",
    "Participants should bring bats and ball will be provided by the college",
    "The game will be 5 overs only"
]

throw_ball_rules = [
    "One team from one branch (team comprises 2nd, 3rd and 4th year students)",
    "One team from Basic Science & Humanities (team comprises students from all branches)",
    "Participants should make a team and get signature approval from their respective branch HOD",
    "Match format will be best of 3 sets"
]

carrom_rules = [
    "Participants should play in doubles",
    "Both participants should be from the same branch",
    "Match format will be best of 3 sets"
]


replace_rules("<!-- Event: Cricket (Men) -->", cricket_rules)
replace_rules("<!-- Event: Throw Ball (Women) -->", throw_ball_rules)
replace_rules("<!-- Event: Carrom (Men) -->", carrom_rules)
replace_rules("<!-- Event: Carrom (Women) -->", carrom_rules)

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Rules updated successfully.")

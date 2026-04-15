import json

html_file = 'events.html'

json_data = """{
  "sections": [
    {
      "title": "Indoor Games",
      "subSections": [
        {
          "title": "Men",
          "events": [
            { "name": "Chess", "participants": "Men", "type": "Individual", "icon": "chess", "rules": ["Open for men only", "Standard chess rules apply"] },
            { "name": "Carrom", "participants": "Men", "type": "Doubles", "icon": "carrom", "rules": ["Participants should play in doubles", "Both players must belong to the same branch", "Match format: Best of 3 sets"] },
            { "name": "Table Tennis", "participants": "Men", "type": "Doubles", "icon": "table-tennis", "rules": ["Team should have 2 members", "Both players must belong to same branch", "Match format: Best of 3 sets"] }
          ]
        },
        {
          "title": "Women",
          "events": [
            { "name": "Chess", "participants": "Women", "type": "Individual", "icon": "chess", "rules": ["Open for women only", "Standard chess rules apply"] },
            { "name": "Carrom", "participants": "Women", "type": "Doubles", "icon": "carrom", "rules": ["Participants should play in doubles", "Both players must belong to the same branch", "Match format: Best of 3 sets"] },
            { "name": "Table Tennis", "participants": "Women", "type": "Doubles", "icon": "table-tennis", "rules": ["Team should have 2 members", "Both players must belong to same branch", "Match format: Best of 3 sets"] }
          ]
        }
      ]
    },
    {
      "title": "Outdoor Games",
      "subSections": [
        {
          "title": "Men",
          "events": [
            { "name": "Cricket", "participants": "Men", "type": "Team Event", "icon": "cricket", "rules": ["Registration offline only", "One team per branch", "Match format: 5 overs only"] },
            { "name": "Tug of War", "participants": "Men", "type": "Team Event", "icon": "tug-of-war", "rules": ["Open for men only", "Standard rules apply"] },
            { "name": "Shot Put", "participants": "Men", "type": "Field Event", "icon": "shot-put", "rules": ["Field events as per college rules"] },
            { "name": "Javelin Throw", "participants": "Men", "type": "Field Event", "icon": "javelin", "rules": ["Field events as per college rules"] },
            { "name": "Discus Throw", "participants": "Men", "type": "Field Event", "icon": "discus", "rules": ["Field events as per college rules"] },
            { "name": "Sack Race", "participants": "Men", "type": "Field Event", "icon": "running", "rules": ["Field events as per college rules"] },
            { "name": "100m Running", "participants": "Men", "type": "Track Event", "icon": "sprint", "rules": ["Track events as per rules"] },
            { "name": "200m Running", "participants": "Men", "type": "Track Event", "icon": "sprint", "rules": ["Track events as per rules"] }
          ]
        },
        {
          "title": "Women",
          "events": [
            { "name": "Throw Ball", "participants": "Women", "type": "Team Event", "icon": "volleyball", "rules": ["One team per branch", "Match format: Best of 3 sets"] },
            { "name": "Tug of War", "participants": "Women", "type": "Team Event", "icon": "tug-of-war", "rules": ["Open for women only", "Standard rules apply"] },
            { "name": "Shot Put", "participants": "Women", "type": "Field Event", "icon": "shot-put", "rules": ["Field events as per college rules"] },
            { "name": "Javelin Throw", "participants": "Women", "type": "Field Event", "icon": "javelin", "rules": ["Field events as per college rules"] },
            { "name": "Discus Throw", "participants": "Women", "type": "Field Event", "icon": "discus", "rules": ["Field events as per college rules"] },
            { "name": "Sack Race", "participants": "Women", "type": "Field Event", "icon": "running", "rules": ["Field events as per college rules"] },
            { "name": "100m Running", "participants": "Women", "type": "Track Event", "icon": "sprint", "rules": ["Track events as per rules"] },
            { "name": "200m Running", "participants": "Women", "type": "Track Event", "icon": "sprint", "rules": ["Track events as per rules"] }
          ]
        }
      ]
    }
  ]
}"""

data = json.loads(json_data)

icon_map = {
    "chess": {"emoji": "♟️", "img": "https://images.unsplash.com/photo-1529699211952-734e80c4d440?q=80&w=1471"},
    "carrom": {"emoji": "🎯", "img": "https://images.unsplash.com/photo-1616238386341-2a07d4b4a3c1?q=80&w=1470"},
    "table-tennis": {"emoji": "🏓", "img": "https://images.unsplash.com/photo-1534158914592-062992fbe900?q=80&w=1499"},
    "cricket": {"emoji": "🏏", "img": "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1467"},
    "tug-of-war": {"emoji": "🪢", "img": "https://images.unsplash.com/photo-1628126235131-ab85b6b6070c?q=80&w=1470"},
    "shot-put": {"emoji": "🪨", "img": "https://images.unsplash.com/photo-1552667466-07770ae110d0?q=80&w=1470"},
    "javelin": {"emoji": "🗡️", "img": "https://images.unsplash.com/photo-1574102928643-c0cb41c76251?q=80&w=1470"},
    "discus": {"emoji": "💿", "img": "https://images.unsplash.com/photo-1574102928643-c0cb41c76251?q=80&w=1470"},
    "running": {"emoji": "🏃", "img": "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=1438"},
    "sprint": {"emoji": "👟", "img": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1470"},
    "volleyball": {"emoji": "🏐", "img": "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1467"}
}

type_emoji = {
    "Individual": "🥇",
    "Doubles": "🤝",
    "Team Event": "🏆",
    "Field Event": "🏅",
    "Track Event": "⚡"
}

events_html = []

rules_html = f'''
        <!-- Sports General Rules -->
        <div class="event-full-card" data-category="sports">
          <div class="card-banner">
            <img src="https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=1470&auto=format&fit=crop" alt="Sports Rules" class="card-banner-img">
            <div class="card-banner-overlay"></div>
          </div>
          <div class="card-header">
            <span class="event-emoji">📋</span>
            <div class="card-header-info">
              <h3>Sports General Rules</h3>
              <span class="card-category sports">Guidelines</span>
            </div>
          </div>
          <div class="card-body">
            <p>Important guidelines for all participants registering for track and field sports events.</p>
            <div class="event-rules">
              <h4 class="rules-title">📋 Rules & Limits</h4>
              <ul class="rules-list">
                <li>Participants can participate in <strong>2 Track Events</strong> and <strong>1 Field Event</strong></li>
                <li>Or participants can play in <strong>1 Track Event</strong> and <strong>2 Field Events</strong></li>
              </ul>
            </div>
          </div>
          <div class="card-footer">
            <div class="event-details">
              <span>📅 All Days</span>
              <span>⏰ Event Times</span>
              <span>👥 All Students</span>
            </div>
            <a href="#eventsGrid" class="register-link">Read Rules ↑</a>
          </div>
        </div>
'''
events_html.append(rules_html)

for section in data["sections"]:
    game_category = section["title"]
    
    for sub in section["subSections"]:
        gender = sub["title"]
        
        header_html = f'''
        <!-- Section Divider -->
        <div class="event-category-header" data-category="sports" style="grid-column: 1 / -1; margin: 40px 0 10px; width: 100%; border-bottom: 1px solid rgba(255,215,0,0.2); padding-bottom: 15px;">
          <h2 class="section-title" style="text-align: left; margin-bottom: 5px; font-size: 2.2rem;">{game_category}</h2>
          <h3 class="gradient-text" style="font-family: var(--font-accent); text-transform: uppercase; letter-spacing: 2px;">{gender}'s Events</h3>
        </div>
        '''
        events_html.append(header_html)
        
        for ev in sub["events"]:
            name = ev["name"]
            participants = ev["participants"]
            evt_type = ev["type"]
            icon_key = ev["icon"]
            rules = ev["rules"]
            
            emoji = icon_map.get(icon_key, {"emoji": "🏅"})["emoji"]
            img = icon_map.get(icon_key, {"img": "https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=1470"})["img"]
            type_symbol = type_emoji.get(evt_type, "🏅")
            
            rules_li = "".join([f"<li>{r}</li>\\n" for r in rules])
            
            card = f'''
        <!-- Event: {name} ({gender}) -->
        <div class="event-full-card" data-category="sports">
          <div class="card-banner">
            <img src="{img}&auto=format&fit=crop" alt="{name}" class="card-banner-img">
            <div class="card-banner-overlay"></div>
          </div>
          <div class="card-header">
            <span class="event-emoji">{emoji}</span>
            <div class="card-header-info">
              <h3>{name}</h3>
              <span class="card-category sports">{game_category}</span>
            </div>
          </div>
          <div class="card-body">
            <p>Join the exciting {name.lower()} tournament for {gender.lower()}.</p>
            <div class="event-rules">
              <h4 class="rules-title">📋 Rules</h4>
              <ul class="rules-list">
                {rules_li}              </ul>
            </div>
          </div>
          <div class="card-footer">
            <div class="event-details">
              <span>📅 TBA</span>
              <span>👥 {participants}</span>
              <span>{type_symbol} {evt_type.split(' ')[0]}</span>
            </div>
            <a href="#" class="register-link">Register Offline →</a>
          </div>
        </div>'''
            events_html.append(card)

new_html_block = "".join(events_html) + "\\n      </div>\\n    </div>\\n  </section>"

with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = "<!-- Sports General Rules -->"
end_marker = "  <!-- CTA -->"

if start_marker in content and end_marker in content:
    pre_part = content.split(start_marker)[0]
    post_part = "\\n\\n" + end_marker + content.split(end_marker, 1)[1]
    
    new_content = pre_part + new_html_block + post_part
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully replaced sports events with section headers!")
else:
    print("Markers not found!")

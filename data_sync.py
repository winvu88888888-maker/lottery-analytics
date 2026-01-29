import requests
from bs4 import BeautifulSoup
import json
import re

def scrape_vietlott(url, name):
    print(f"Syncing data source {name}...")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers, timeout=15)
        if response.status_code != 200:
            print(f"Failed to fetch {url} - Status: {response.status_code}")
            return []
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        # Potential fallback: if it's a DNS error, we could try an IP if known, 
        # but for now we'll just return empty.
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    table = soup.find('table', class_='table-mini-result')
    if not table:
        print(f"No table found for {name}")
        return []

    data = []
    rows = table.find('tbody').find_all('tr')
    for row in rows:
        cols = row.find_all('td')
        if not cols:
            continue
        
        date_str = cols[0].text.strip()
        # Numbers
        numbers = [span.text.strip() for span in cols[1].find_all('span', class_='home-mini-whiteball')]
        
        # Jackpot(s)
        if name == 'Mega 6/45':
            jp_span = cols[2].find('span', class_='hidden-xs')
            jackpot = jp_span.text.strip().replace('.', '') if jp_span else "0"
            data.append({
                'date': date_str,
                'numbers': numbers,
                'jackpot': int(jackpot) if jackpot.isdigit() else 0
            })
        else: # Power 6/55
            jp1_span = cols[2].find('span', class_='hidden-xs')
            jp2_span = cols[3].find('span', class_='hidden-xs')
            jp1 = jp1_span.text.strip().replace('.', '') if jp1_span else "0"
            jp2 = jp2_span.text.strip().replace('.', '') if jp2_span else "0"
            data.append({
                'date': date_str,
                'numbers': numbers[:6],
                'bonus': numbers[6] if len(numbers) > 6 else None,
                'jackpot1': int(jp1) if jp1.isdigit() else 0,
                'jackpot2': int(jp2) if jp2.isdigit() else 0
            })
            
    return data

# Note: The table might not show the DRAW ID. 
# But the URL query parameter datef=01-01-2016&datet=27-01-2026 should give us all data.
# We will sort by date and assign IDs.

def main():
    # Mega 6/45
    mega_url = "https://www.ketquadientoan.com/tat-ca-ky-xo-so-mega-6-45.html?datef=01-01-2016&datet=27-01-2026"
    mega_data = scrape_vietlott(mega_url, "Mega 6/45")
    
    # Power 6/55
    power_url = "https://www.ketquadientoan.com/tat-ca-ky-xo-so-power-655.html?datef=01-01-2016&datet=27-01-2026"
    power_data = scrape_vietlott(power_url, "Power 6/55")
    
    # Save to file
    result = {
        'mega': mega_data[::-1], # Oldest first
        'power': power_data[::-1]
    }
    
    with open('db_storage.json', 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print("Database synchronized successfully.")

if __name__ == "__main__":
    main()

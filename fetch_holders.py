import requests
import csv
import sys

contracts = {
    "Pudgy Penguins": "0xBd3531dA5CF5857e7CfAA92426877b022e612cf8",
    "BAYC": "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
    "Azuki": "0xED5AF388653567Af2F388E6224dC7C4b3241C544",
    "Milady": "0x5Af0D9827E0c53E4799BB226655A1de152A425a5"
}

all_owners = set()

url_template = "https://eth-mainnet.g.alchemy.com/nft/v3/demo/getOwnersForContract?contractAddress={}&withTokenBalances=false"

for name, contract in contracts.items():
    print(f"Fetching holders for {name}...")
    page_key = None
    
    while True:
        url = url_template.format(contract)
        if page_key:
            url += f"&pageKey={page_key}"
            
        try:
            res = requests.get(url)
            res.raise_for_status()
            data = res.json()
            owners = data.get("owners", [])
            for owner in owners:
                all_owners.add(owner)
                
            page_key = data.get("pageKey")
            if not page_key:
                break
        except Exception as e:
            print(f"Error fetching {name}: {e}")
            break

print(f"Total unique holders found: {len(all_owners)}")

output_file = "allowlist.csv"
with open(output_file, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Wallet address", "Custom mint limit (optional)", "Custom price in native token e.g. ETH (optional)"])
    for owner in all_owners:
        writer.writerow([owner, "", ""])

print(f"Successfully wrote holders to {output_file}")

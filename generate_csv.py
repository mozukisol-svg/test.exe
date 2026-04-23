import json
import os
import csv
from pathlib import Path

METADATA_DIR = "output/metadata"
OUTPUT_CSV = "output/opensea_metadata.csv"

def generate_csv():
    print("Reading JSON files...")
    all_data = []
    
    # Get all trait keys to create the CSV header
    trait_keys = set()
    
    for i in range(1, 5001):
        file_path = os.path.join(METADATA_DIR, f"{i}.json")
        if not os.path.exists(file_path):
            continue
            
        with open(file_path, "r") as f:
            data = json.load(f)
            
            row = {
                "file_name": f"{i}.png",
                "name": data["name"],
                "description": data["description"]
            }
            
            for attr in data["attributes"]:
                trait_type = attr["trait_type"]
                trait_keys.add(trait_type)
                row[trait_type] = attr["value"]
                
            all_data.append(row)
            
    # Sort trait keys for consistent columns
    trait_keys = sorted(list(trait_keys))
    
    # OpenSea wants trait columns to be named exactly as the trait type
    fieldnames = ["file_name", "name", "description"] + trait_keys
    
    print(f"Writing CSV to {OUTPUT_CSV}...")
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(all_data)
        
    print("Done! You can upload output/opensea_metadata.csv to OpenSea Studio.")

if __name__ == "__main__":
    generate_csv()

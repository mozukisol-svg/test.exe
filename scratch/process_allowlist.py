import csv
import os

input_file = r'c:\Users\lemue\OneDrive\Desktop\NFT project\allowlist.csv'
output_file = r'c:\Users\lemue\OneDrive\Desktop\NFT project\allowlist_new.csv'

zero_address = '0x0000000000000000000000000000000000000000'

with open(input_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

header = "Wallet address,Custom mint limit (optional),Custom price in native token e.g. ETH (optional)\n"

processed_lines = [header]

for line in lines[1:]: # Skip existing header
    addr = line.strip().split(',')[0] # Get address just in case there's already something
    if not addr:
        continue
    if addr.lower() == zero_address.lower():
        continue
    processed_lines.append(f"{addr},,\n")

with open(output_file, 'w', encoding='utf-8') as f:
    f.writelines(processed_lines)

os.replace(output_file, input_file)
print(f"Processed {len(processed_lines)-1} addresses.")

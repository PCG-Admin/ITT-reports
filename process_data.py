
import pandas as pd
import json
import numpy as np

def clean_value(val):
    if pd.isna(val):
        return 0
    if isinstance(val, str):
        # Remove spaces, % signs, comma to dot
        val = val.replace(' ', '').replace('%', '').replace(',', '.')
        try:
            return float(val)
        except:
            return 0
    return float(val)

def process_excel():
    try:
        # Load the file, skipping top header rows to get to the main table
        # Based on screenshot and json, the real headers are around row 5 or 6 (0-indexed)
        # But 'data_summary.json' showed "Unnamed: 0" etc, so I'll read with header=None and map manually
        df = pd.read_excel('Parcel Perfect Daily Summary.XLS', header=None)
        
        # Locate the header row containing "Region" or "Total"
        header_row_idx = -1
        for idx, row in df.iterrows():
            if str(row[0]).strip() == "Region":
                header_row_idx = idx
                break
        
        if header_row_idx == -1:
            # Fallback based on visual inspection of previous json output
            header_row_idx = 6 
            
        print(f"Found header at row {header_row_idx}")
        
        # Slice data starting from the row after header
        data_df = df.iloc[header_row_idx+1:].copy()
        
        # Define column mapping based on our analysis
        # 0: Name (Region/Branch)
        # 1: Total Verbals
        # 2: Actual Verbals Outstanding
        # 3: % Collected Verbals
        # 4: Actual PODs Outstanding
        # 5: % Collected PODs
        # 6: Failtypes
        # 7: Total Returns
        # 8: Total Fails
        # 9: Fail %
        # 10: Waybills Collected
        # 11: Total Activities
        # 12: PODs Outstanding (1 week)
        # 13: Age Analysis
        # 14: Trip Sheets Total
        # 15: Trip Sheets Open
        # 16: Manifests Total
        # 17: Manifests Open
        # 18: Total KGs per Trip Sheet
        # 19: Total KGs per Manifest
        # 20: Total KGs Handled

        col_map = {
            0: "name",
            1: "total_verbals",
            2: "verbals_outstanding",
            3: "verbals_collected_pct",
            4: "pods_outstanding",
            5: "pods_collected_pct",
            6: "failtypes",
            7: "total_returns",
            8: "total_fails",
            9: "fail_pct",
            10: "waybills_collected",
            11: "total_activities",
            12: "pods_outstanding_1week",
            13: "age_analysis",
            14: "trip_sheets_total",
            15: "trip_sheets_open",
            16: "manifests_total",
            17: "manifests_open",
            18: "kgs_per_tripsheet",
            19: "kgs_per_manifest",
            20: "total_kgs"
        }

        records = []
        current_region = "Unknown"
        
        # known regions from screenshot to help identify hierarchy
        known_regions = ["Eastern Cape", "Eastern Cape 2", "Gauteng", "Western Cape", "Western Cape 2", "TOTAL"]

        for idx, row in data_df.iterrows():
            name = str(row[0]).strip()
            if not name or name == 'nan':
                continue
                
            # Create record
            record = {}
            for col_idx, field_name in col_map.items():
                if col_idx == 0:
                    record[field_name] = name
                else:
                    record[field_name] = clean_value(row[col_idx])

            # Classify as Region or Branch
            # If name is in known regions, it's a Region (Category)
            # Or if it's "TOTAL"
            if name in known_regions:
                record['type'] = 'Region'
                current_region = name # Update current region context if we were nesting, but flat is fine
            else:
                record['type'] = 'Branch'
                record['region_group'] = current_region

            records.append(record)

        # Output to JSON
        with open('dashboard_data.json', 'w', encoding='utf-8') as f:
            json.dump(records, f, indent=2)
            
        print(f"Successfully processed {len(records)} records.")

    except Exception as e:
        print(f"Error processing data: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    process_excel()

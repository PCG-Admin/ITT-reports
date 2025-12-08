
import pandas as pd
import json

try:
    # Try reading with default engine first, then specific engines if needed
    try:
        df = pd.read_excel('Parcel Perfect Daily Summary.XLS')
    except Exception as e:
        # Fallback for old XLS
        import xlrd
        df = pd.read_excel('Parcel Perfect Daily Summary.XLS', engine='xlrd')

    with open('data_summary.json', 'w', encoding='utf-8') as f:
        summary = {
            "columns": df.columns.tolist(),
            "first_rows": df.head().to_dict(orient='records'),
            "dtypes": df.dtypes.astype(str).to_dict(),
            "stats": df.describe().to_dict()
        }
        json.dump(summary, f, default=str, indent=2)

except Exception as e:
    print(f"Error reading excel: {e}")

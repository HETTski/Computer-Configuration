import subprocess
import json
import time

while True:
    result = subprocess.run(['wmic', 'product', 'get', 'name'], stdout=subprocess.PIPE, text=True)
    installed_apps = result.stdout.strip().split('\n')[1:]
    formatted_apps = [app.strip() for app in installed_apps]

    apps_info = {'installedApps': formatted_apps}

    # Convert the dictionary to a JSON string
    json_apps_info = json.dumps(apps_info)

    # Write the JSON data to a file
    with open('installedAppsData.json', 'w') as file:
        file.write(json_apps_info)

    print(json_apps_info)

    # Wait for 10 seconds before the next iteration
    time.sleep(10)

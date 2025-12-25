# **App Name**: RoboPilot

## Core Features:

- MQTT Connection Management: Automatically connect to the MQTT broker (wss://mqtt.dev.icam.school:443/mqtt) and subscribe to the vehicle's topic (bzh/iot/voiture/{NOM_VEHICULE}/#). Display connection status (connected/disconnected) and vehicle status (online/offline).
- Vehicle Identification: Generate a unique, user-modifiable vehicle name (camelCase, no accents or spaces) stored locally.  Reconnect to MQTT with the new topic upon name change.
- Directional Control: Implement a touch-based directional control to manage direction and speed (30000-65535) of the vehicle. Support 8 directions (forward, backward, left, right, and diagonals) and send 'stop' on release. Send commands to the .../cmd topic and speed values to the .../vitesse topic.
- Distance display: Show the data of the front distance sensor. The data are delivered through the topic: bzh/iot/voiture/{NOM_VEHICULE}/distance
- MQTT Message Logging: Log MQTT messages (sent, received, system) in real-time with timestamps.  Include a scrollable display, clear button, and the ability to collapse/expand the console.

## Style Guidelines:

- Primary color: Dark indigo (#3F51B5) for a high-tech, serious feel, avoiding cliches while hinting at automotive dashboards.
- Background color: Very dark blue-gray (#22293D), desaturated and dark for a modern cockpit aesthetic.
- Accent color: Cyan (#00BCD4), analogous to indigo but with high brightness and saturation for clear highlighting.
- Font pairing: 'Space Grotesk' for headlines (sans-serif) and 'Inter' for body text (sans-serif) to combine a techy feel with readability.
- Use sharp, vector-based icons that are suitable for both light and dark backgrounds.
- Mobile-first layout optimized for portrait mode. Main controls should be easily accessible with thumbs. Display vehicle data in a clear, hierarchical manner.
- Use subtle animations to provide feedback on user interactions (e.g., button presses, state changes). Aim for 60fps for smooth performance.
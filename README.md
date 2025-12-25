# RoboPilot

RoboPilot is a web-based remote control interface for your robotic vehicle. It uses MQTT to send commands and receive data in real-time.

## ✨ Features

- **Directional Control**: A simple directional pad to command your robot (forward, backward, left turn, right turn, and stop).
- **Real-time Sensor Data**: Displays the front distance measured by the robot's sensor.
- **Connection Status**: Visual indicators for the MQTT broker and vehicle connection status.
- **Customizable Vehicle Name**: Easily set and change the name of your vehicle.
- **Debug Console**: A collapsible console to monitor sent and received MQTT messages for easy debugging.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Communication Protocol**: [MQTT](https://mqtt.org/)

## 🔧 Getting Started

### 1. Set your Vehicle Name

The application will generate a random vehicle name for you (e.g., `fauconAgile`). You can edit this name by clicking the pencil icon next to it. This name is used to create the MQTT topics for communication.

For example, if your vehicle name is `myRobot`, the application will subscribe to `bzh/iot/voiture/myRobot/#` and publish commands to topics like `bzh/iot/voiture/myRobot/cmd`.

### 2. Control Your Robot

Use the on-screen directional pad to send movement commands to your robot.
- **Arrows**: Press and hold to move in the corresponding direction. Release to stop.
- **Stop Button**: Immediately stops any movement.

### 3. Monitor Your Robot

- The **Front Distance** card shows the distance in centimeters reported by your robot's front sensor.
- The **Debug Console** at the bottom shows all MQTT messages being sent and received. This is useful for checking if your commands are being sent correctly and what data your robot is publishing.

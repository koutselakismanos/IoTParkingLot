#include <WiFi.h>
#include <PubSubClient.h>

#define BAUD 9600

#define MQTT_SERVER "10.0.26.139"
#define MQTT_PORT 1883

#define SSID "microelectronics"
#define SSID_PASSWORD "microelectronics2018"

#define PARKING_LOT_ID "1"

#define PARKING_SPOT_STATE "parking_spot_state"
#define PARKING_LOT "parking_lot"
#define OCCUPIED "OCCUPIED"
#define FREE "FREE"
#define ENTRY "ENTRY"
#define DEPARTURE "DEPARTURE"
#define A1 "A1"
#define A2 "A2"

#define ENTRY_PIN 18
#define EXIT_PIN 17
#define A1_PIN 27
#define A2_PIN 26

bool entryPreviousState = false;

unsigned long last = 0;

String message;
bool state = false;

WiFiClient espClient;
PubSubClient client(espClient);

struct Sensor {
  const int pin;
  bool state;
};

Sensor entrySensor = { ENTRY_PIN, false };
Sensor exitSensor = { EXIT_PIN, false };
Sensor a1Sensor = { A1_PIN, false };
Sensor a2Sensor = { A2_PIN, false };

void setup() {
  Serial.begin(BAUD);

  pinMode(ENTRY_PIN, INPUT_PULLUP);
  pinMode(EXIT_PIN, INPUT_PULLUP);
  pinMode(A1_PIN, INPUT_PULLUP);
  pinMode(A2_PIN, INPUT_PULLUP);

  // Connect to WiFi
  WiFi.begin(SSID, SSID_PASSWORD);
  Serial.print("Connecting to wifi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.print("\nWiFi connected - IP address: ");
  Serial.println(WiFi.localIP());
  delay(500);

  client.setServer(MQTT_SERVER, MQTT_PORT);
  client.setCallback(mqtt_callback);
}

void entry() {
  Serial.print("ENTRY\n");
}

void mqtt_callback(char* topic, byte* payload, unsigned int length) {
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.print("Message arrived [");
  Serial.print(String(topic));
  Serial.print("/");
  Serial.print(String(message));
  Serial.println("] ");

  message = "";
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.println("Attempting MQTT connection...");
    if (client.connect("ESP32Client")) {
      Serial.println("Connected");
    } else {
      Serial.print(client.state());
      Serial.println("Failed - Try again in 5 seconds");
      delay(5000);
    }
  }
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }

  // boolean loop ()
  // This should be called regularly to allow the client to process
  // incoming messages and maintain its connection to the server.
  client.loop();



  if (millis() > last + 200) {
    last = millis();

    if (digitalRead(entrySensor.pin) == 0 && !entrySensor.state) {
      entrySensor.state = true;
      publish_parking_lot_event(ENTRY);
    }
    if (digitalRead(entrySensor.pin) == 1) {
      entrySensor.state = false;
    }

    if (digitalRead(exitSensor.pin) == 0 && !exitSensor.state) {
      exitSensor.state = true;
      publish_parking_lot_event(DEPARTURE);
    }
    if (digitalRead(exitSensor.pin) == 1) {
      exitSensor.state = false;
    }

    if (digitalRead(a1Sensor.pin) == 0 && !a1Sensor.state) {
      a1Sensor.state = true;
      publish_parking_spot_state(A1, OCCUPIED);
    }
    if (digitalRead(a1Sensor.pin) == 1 && a1Sensor.state) {
      a1Sensor.state = false;
      publish_parking_spot_state(A1, FREE);
    }

    if (digitalRead(a2Sensor.pin) == 0 && !a2Sensor.state) {
      a2Sensor.state = true;
      publish_parking_spot_state(A2, OCCUPIED);
    }
    if (digitalRead(a2Sensor.pin) == 1 && a2Sensor.state) {
      publish_parking_spot_state(A2, FREE);
      a2Sensor.state = false;
    }
  }
}

void publish_parking_lot_event(char* event) {
  char message[40];
  sprintf(message, "%s|%s", PARKING_LOT_ID, event);
  client.publish(PARKING_LOT, message);
}

void publish_parking_spot_state(char* parking_spot_name, char* state) {
  char message[40];
  sprintf(message, "%s|%s|%s", PARKING_LOT_ID, parking_spot_name, state);
  client.publish(PARKING_SPOT_STATE, message);
}
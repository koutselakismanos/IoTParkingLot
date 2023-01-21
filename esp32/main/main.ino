#include <WiFi.h>
#include <PubSubClient.h>
// #include <analogWrite.h>

#define BAUD 9600

#define MQTT_SERVER "192.168.1.102"
#define MQTT_PORT 1883

#define SSID "PizzaDelivery"
#define SSID_PASSWORD "pizzadoros"

#define PARKING_SPOT_STATE "parking_spot_state"
#define PARKING_LOT "parking_lot"

#define PARKING_LOT_ID 1

unsigned long last = 0;

String message;
bool state = false;

WiFiClient espClient;
PubSubClient client(espClient);

// // setting PWM properties
// const int freq = 5000;
// const int resolution = 8;

void setup(){
  Serial.begin(BAUD);

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

void mqtt_callback(char* topic, byte* payload, unsigned int length) {
  for (int i = 0; i < length; i++){
    message += (char)payload[i];
  }
  Serial.print("Message arrived [");
  Serial.print(String(topic));
  Serial.print("/");
  Serial.print(String(message));
  Serial.println("] ");
  
  // if (String(topic) == PARKING_LOT) {
    
  // } else if (String(topic) == PARKING_SPOT_STATE) {

  // }
//     if (message == "on") {
//       digitalWrite(ledPin, HIGH);
// //      state = true;
//     }
//     else if (message == "off"){
//       digitalWrite(ledPin, LOW);
// //      state = false;
//     }
  // }
  // else if (String(topic) == "esp32/pwm"){
  //   // ledcWrite(ledChannel, message.toInt());
  // }
  message = "";
}

void reconnect(){
  // Loop until we're reconnected
  while (!client.connected()){
    Serial.println("Attempting MQTT connection...");
    if (client.connect("ESP32Client")){
      Serial.println("Connected");
      // client.subscribe("esp32/out");
      // client.subscribe("esp32/pwm");
    }
    else{
      Serial.print(client.state());
      Serial.println("Failed - Try again in 5 seconds");
      delay(5000);
    }
  }
}

void loop(){
  if (!client.connected()) {
    reconnect();
  }


  // boolean loop ()
  // This should be called regularly to allow the client to process 
  // incoming messages and maintain its connection to the server.
  client.loop();
  
  if (millis() > last + 200){
    last = millis();
    delay(2000);
    char message[100];

    sprintf(message, "%s|%s", "1", "ENTRY");
    client.publish(PARKING_LOT, message);
    delay(2000);
    sprintf(message, "%s|%s|%s", "1", "A2", "OCCUPIED");
    client.publish(PARKING_SPOT_STATE, message);
    delay(2000);
    sprintf(message, "%s|%s|%s", "1", "A2", "FREE");
    client.publish(PARKING_SPOT_STATE, message);
    delay(2000);
    sprintf(message, "%s|%s", "1", "DEPARTURE");
    client.publish(PARKING_LOT, message);
    
  }
}
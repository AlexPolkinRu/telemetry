#include <Arduino.h>
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <DHT.h>

// В этом файле определяем
// const char* ssid;
// const char* pass;
// const char* key;
#include "secret.h"

#define USE_SERIAL Serial
#define DHTPIN 3
#define DHTTYPE DHT11

// Частота обновления в милисекундах
#define PERIOD_UPDATE 60 * 1000

DHT dht(DHTPIN, DHTTYPE);

uint32_t delayMS;

// переменная для интервала измерений
unsigned long millis_int = 0;

void setup() {
  USE_SERIAL.begin(115200);
  dht.begin();

  USE_SERIAL.println();
  USE_SERIAL.println();
  USE_SERIAL.println("----- Start ESP8266 -----");

  WiFi.begin(ssid, pass);

  while (WiFi.status() != WL_CONNECTED) {
    USE_SERIAL.print(".");
    delay(500);
  }

  USE_SERIAL.println();
  USE_SERIAL.println("Wi-Fi connected");

  httpPOST();
}

void loop() {
  // ждем заданный интервал
  if  (millis() - millis_int >= PERIOD_UPDATE) {
    httpPOST();
    millis_int = millis();
  }
}

void httpPOST(){
  String url = "http://alexpolkin.tech/monitor/";

  HTTPClient http;
  WiFiClient client;
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Accept", "application/json");

  DynamicJsonDocument postMessage(2048);
  postMessage["key"] = key;
  postMessage["t"] = round(dht.readTemperature() * 10) / 10;
  postMessage["h"] = (int)dht.readHumidity();
  
  String jsonBody;
  serializeJson(postMessage, jsonBody);

  http.begin(client, url);
  int resCode = http.POST(jsonBody);
  USE_SERIAL.print("Response code: "); 
  USE_SERIAL.println(resCode);
  
  String res = http.getString();
  USE_SERIAL.println(res);

  http.end();
}
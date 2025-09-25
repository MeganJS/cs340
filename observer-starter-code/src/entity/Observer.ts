import { Flight } from "./Flight";


export abstract class Observer {
    abstract update(flight: Flight): void;
}

export class StatusObserver extends Observer {
    update(flight: Flight): void {
        //console.log("wow it's a flight! let's give a status");
        console.log(`Flight Status: 
            ICAO24: ${flight.icao24}
            Callsign: ${flight.callsign}
            Country of Origin: ${flight.origin_country}
            Longitude: ${flight.longitude}
            Latitude: ${flight.latitude}
            Velocity: ${flight.velocity}
            Altitude (Geometric, Barometric): ${flight.geo_altitude}, ${flight.baro_altitude}`);
    }
}

export class DeltaObserver extends Observer {
    prev_flight: Flight = new Flight;
    update(flight: Flight): void {
        //console.log("okay here's what's different");
        if (this.prev_flight.icao24 == ""){
            console.log("This is our first update, so we have nothing to compare with.")
        }
        console.log(`Change in Longitude: ${flight.longitude - this.prev_flight.longitude}`)
        console.log(`Change in Latitude: ${flight.latitude - this.prev_flight.latitude}`)
        console.log(`Change in Velocity: ${flight.velocity - this.prev_flight.velocity}`)
        console.log(`Change in Geo_Altitude: ${flight.geo_altitude - this.prev_flight.geo_altitude}`)
        console.log(`Change in Baro_Altitude: ${flight.baro_altitude - this.prev_flight.baro_altitude}`)
        this.prev_flight = flight;
    }
}
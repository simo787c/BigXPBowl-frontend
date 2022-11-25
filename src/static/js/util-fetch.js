'use strict'

class UtilFetch {
    //constructor
    constructor(data){
        this.data = data;
        this.url = "http://localhost:8080/api/v1/"
    }
    // async fetch, await response 
    async operationData(endpoint, id, formData, methodType) {
        if (methodType == "GET") {
            this.settings = null;
        } else {
            this.settings = {
                method: methodType,
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify(formData)
            }
        }
        try {
            let response = await fetch(this.url + endpoint + id, this.settings);
            this.data = await response.json();
            return this.data;
        } catch (error) {
            // Could not connect, try using the last data, we saved last time we were connected to remote endpoint.
            console.log(`Failed getting data from remote endpoint ${endpoint + id}.`);
        }
    }  
}
var utilFetch = new UtilFetch();
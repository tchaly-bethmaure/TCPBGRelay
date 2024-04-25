class GBWebsocket {
    constructor(url)
    {
        this.ws = new WebSocket(url);
        this.ws.onmessage = (function(event){
            console.log(this);
            this.onMessage(event);
        }).bind(this);

        this.waitForConnection();
    }

    waitForConnection() 
    {
        if(this.ws.readyState === 1)
        {
            console.log("Connection ready");
            
        } else 
        {
            setTimeout(
                this.waitForConnection.bind(this),
                100
            )
        }
    }

    onMessage(event)
    {
        console.log(event);
        var message = JSON.parse(event.data);
        
    }

    send(data)
    {
        this.ws.send(data);        
    }

    read()
    {
        return this.ws.read();
    }


}
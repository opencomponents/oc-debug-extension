export default chrome.extension || {
    connect: function() {
        return {
            onMessage: {
                addListener: function() {
                    return;
                }
            }
        };
    },
    sendMessage: function() {
        return;
    }
}


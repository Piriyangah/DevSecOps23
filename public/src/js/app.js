function configurePushSubscription() {
    if(!('serviceWorker' in navigator)) {
        return
    }

    let swReg;
    navigator.serviceWorker.ready
        .then( sw => {
            swReg = sw;
            return sw.pushManager.getSubscription();
        })
        .then( sub => {
            if(sub === null) {
                // create a new subscription
                let vapidPublicKey = 'BHDDsODPJZ4MhNc9BHMb5DqRaJv4_7AMta8u_CoZXl2HU87y4rMWOeM7cI6OB2yp3Ho1ULSA7fZN_fH_DOjU3tQ';
                swReg.pushManager.subscribe({
                    userVisibleOnly: true,
                });
            } else {
                // already subscribed
            }
        });
}
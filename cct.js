window.CCTools = (function(game) {

    // définitions des attributs
    return {
        // constantes
        CURSOR: 0,
        GRANDMA: 1,
        FARM: 2,
        FACTORY: 3,
        MINE: 4,
        SHIPMENT: 5,
        ALCHEMYLAB: 6,
        PORTAL: 7,
        TIMEMACHINE: 8,
        CONDENSER: 9,

        // variables
        Game: game,
        me: null,

        goldenCookieWatchInterval: null,

        // buy auto
        buyAnyObjectWhenReadyInterval: null,
        nextObject: null,


        startGoldenCookieWatch: function() {
            if(!this.goldenCookieWatchInterval)
                this.goldenCookieWatchInterval = setInterval(this.goldenCookieWatch, 1000);
        },

        stopGoldenCookieWatch: function() {
            if(this.goldenCookieWatchInterval) {
                clearInterval(this.goldenCookieWatchInterval);
                this.goldenCookieWatchInterval = null;
            }
        },

        goldenCookieWatch: function() {
            var c = "\u229b";
            if(this.Game.goldenCookie.life > 0 && document.title.indexOf(c) === -1)
                document.title = c + " " + document.title;
        },

        howLong: function(desired) {
            return new Date((desired-this.Game.cookies)/this.Game.cookiesPs*1000+Date.now());
        },

        howLongNextObjectLevel: function(idObj) {
            if(idObj >= 0 && idObj <= 9)
                return this.howLong(this.Game.ObjectsById[idObj].price);
            else
                return null;
        },

        howLongObjectLevel: function(idObj, level) {
            var x = Game.ObjectsById[idObj].price;
            var p = 1.15;
            var n = level - this.Game.ObjectsById[idObj].bought;

            return this.howLong(x*(1+p*((1-Math.pow(p, n))/(1-p))));
        },

        calculatePrestige: function() {
            var cookies = this.Game.cookiesReset + this.Game.cookiesEarned;
            var prestige = cookies/1000000000000;
            var chips = Math.max(0,Math.floor((-1+Math.pow(1+8*prestige,0.5))/2));
            return chips;
        },

        chipsCost: function(nb) {
            return (Math.pow(2*nb+1, 2)-1)/8*1000000000000;
        },

        nextChipCost: function() {
            var chips = this.calculatePrestige() + 1;
            return this.chipsCost(chips)-this.Game.cookiesReset;
        },

        unlockUncannyClicker: function() {
            var n = 0;
            while(n < 6) {
                this.Game.ClickCookie();
                console.log(this.Game.autoclickerDetected);
                n++;

                // wait for the good moment to reclick
                while(Date.now()-this.Game.lastClick<5) {
                    // do nothing
                }
            }
        },

        startBuyAnyObjectWhenReady: function() {
            if(!this.buyAnyObjectWhenReadyInterval) {
                CCTools.me = this;
                this.buyAnyObjectWhenReadyInterval = setInterval(this.buyAnyObjectWhenReady, 1000);
            }
        },

        stopBuyAnyObjectWhenReady: function() {
            if(this.buyAnyObjectWhenReadyInterval) {
                clearInterval(this.buyAnyObjectWhenReadyInterval);
                this.buyAnyObjectWhenReadyInterval = null;
            }
        },

        buyAnyObjectWhenReady: function() {
            var me = CCTools.me;
            var rawList = me.Game.UpgradesInStore.concat(me.Game.ObjectsById);

            if(me.nextObject) {
                if(me.Game.cookies >= me.nextObject.price) {
                    me.nextObject.obj.buy();
                    me.nextObject = null;
                }
            }

            if(!me.nextObject) {
                me.nextObject = {
                    obj: null,
                    price: Infinity
                };

                for(var i = 0, ii = rawList.length; i < ii; i++) {
                    if(rawList[i] instanceof Game.Object) {
                        if(rawList[i].price < me.nextObject.price) {
                            me.nextObject.obj = rawList[i];
                            me.nextObject.price = rawList[i].price;
                        }
                    }

                    if(rawList[i] instanceof Game.Upgrade) {
                        if(rawList[i].basePrice < me.nextObject.price) {
                            me.nextObject.obj = rawList[i];
                            me.nextObject.price = rawList[i].basePrice;
                        }
                    }
                }
            }
        },
    };

})(Game);
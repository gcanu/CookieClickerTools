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

        nextGoldenCookie: function() {
            return new Date(Date.now()+(this.Game.goldenCookie.delay/this.Game.fps*1000));
        },

        howLong: function(desired) {
            return new Date((desired-this.Game.cookies)/this.Game.cookiesPs*1000+Date.now());
        },

        howLongNextObjectLevel: function(idObj) {
            if(idObj >= 0 || idObj <= 9)
                return this.reach(this.Game.ObjectsById[9].price);
            else
                return null;
        },

        howLongObjectLevel: function(idObj, level) {
            var x = Game.ObjectsById[idObj].price;
            var p = 1.15;
            var n = level - this.Game.ObjectsById[idObj].bought;

            return this.reach(x*(1+p*((1-Math.pow(p, n))/(1-p))));
        }
    };

})(Game);
var Game = cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        starsLayer: {
            default: null,
            type: cc.Node
        },
        starsLabel: {
            default: null,
            type: cc.Label
        },
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        maxStars: 6000,
        starsCountOffset: 40,   // 每批增减的个数
        stepsCount: 50,         // 数量增减速度
        steps: 250,             // 初始数量
    },

    statics: {
        instance: null
    },

    initPool: function () {
        for (var i = 0; i < this.maxStars; ++i) {
            var star = cc.instantiate(this.starPrefab);
            cc.pool.putInPool(star);
        }
    },

    // use this for initialization
    onLoad: function () {
        Game.instance = this;

        this.initPool();

        this.offsetCount = 60;
        this.offsets = [];
        for (var i = 0; i < this.offsetCount; i++) {
            this.offsets[i] = {
                x: Math.sin(i * 6 * Math.PI / 180) * 4,
                y: Math.cos(i * 6 * Math.PI / 180) * 4
            };
        }

        this.stars = [];
        
        cc.director.setDisplayStats(true);
    },

    addStars:function (count) {
        var size = cc.winSize;
        var Star = require('Star');
        for (var i = 0; i < count; i++) {
            var starNode;
            if (cc.pool.hasObject(cc.Node)) {
                starNode = cc.pool.getFromPool(cc.Node);
            } else {
                starNode = cc.instantiate(this.starPrefab);
            }
            var star = starNode.getComponent(Star);
            star.x = (Math.random() - 0.5) * size.width;
            star.y = (Math.random() - 0.5) * size.height;
            star.i = (Math.random() * this.offsetCount) | 0;
            star.o = (Math.random() * 256) | 0;     // 透明度
            star.oi = 1;

            starNode.parent = this.starsLayer;

            this.stars.push(star);
        }
        if (this.stars.length >= this.maxStars) {
            this.starsCountOffset = -this.starsCountOffset;
        }
    },

    removeStars:function (count) {
        while (count > 0 && this.stars.length > 0) {
            var star = this.stars.pop();
            star.node.parent = null;
            cc.pool.putInPool(star);
            count--;
        }

        if (this.stars.length <= 0) {
            this.starsCountOffset = -this.starsCountOffset;
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        ++this.steps;
        if (this.steps >= this.stepsCount) {
            if (this.starsCountOffset > 0) {
                this.addStars(this.starsCountOffset);
            } else {
                this.removeStars(-this.starsCountOffset);
            }
            this.steps -= this.stepsCount;
            if (this.starsLabel) {
                this.starsLabel.string = this.stars.length.toString() + " stars";
            }
            else {
                cc.log(this.stars.length);
            }
        }
    }
});

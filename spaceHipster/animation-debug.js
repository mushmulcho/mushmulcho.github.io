var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Created by syncho on 16.5.2018 г..
 */
var spaceHipster;
(function (spaceHipster) {
    var scenes;
    (function (scenes) {
        var BootScene = /** @class */ (function (_super) {
            __extends(BootScene, _super);
            function BootScene() {
                return _super.call(this, { key: "BootScene" }) || this;
            }
            BootScene.prototype.preload = function () {
                this.load.image('preloadBar', 'res/images/preloader-bar.png');
            };
            BootScene.prototype.create = function () {
            };
            BootScene.prototype.update = function () {
                this.scene.start('PreloadScene');
            };
            return BootScene;
        }(Phaser.Scene));
        scenes.BootScene = BootScene;
    })(scenes = spaceHipster.scenes || (spaceHipster.scenes = {}));
})(spaceHipster || (spaceHipster = {}));
/**
 * Created by syncho on 18.5.2018 г..
 */
var spaceHipster;
(function (spaceHipster) {
    var objects;
    (function (objects) {
        var Bullet = /** @class */ (function (_super) {
            __extends(Bullet, _super);
            function Bullet(scene, x, y, rotation, texture, frame) {
                var _this = _super.call(this, scene, x, y, texture, frame) || this;
                _this.currentScene = scene;
                _this.speed = 1000;
                _this.lifeSpan = 200;
                _this.currentScene.physics.world.enable(_this);
                _this.setBlendMode(1);
                _this.setDepth(1);
                _this.rotation = rotation + ((rotation <= 0 ? -Math.PI : Math.PI) / 2);
                _this.setPosition(x, y);
                _this.body.reset(x, y);
                _this.scene.physics.velocityFromRotation(rotation, _this.speed, _this.body.velocity);
                _this.body.velocity.x *= 2;
                _this.body.velocity.y *= 2;
                _this.currentScene.add.existing(_this);
                return _this;
            }
            Bullet.prototype.update = function () {
                if (this.lifeSpan <= 0)
                    this.setActive(false);
                else
                    this.lifeSpan--;
            };
            return Bullet;
        }(Phaser.Physics.Arcade.Sprite));
        objects.Bullet = Bullet;
    })(objects = spaceHipster.objects || (spaceHipster.objects = {}));
})(spaceHipster || (spaceHipster = {}));
/**
 * Created by syncho on 18.5.2018 г..
 */
var spaceHipster;
(function (spaceHipster) {
    var objects;
    (function (objects) {
        var Bullet = spaceHipster.objects.Bullet;
        var Ship = /** @class */ (function (_super) {
            __extends(Ship, _super);
            function Ship(scene, x, y, texture, frame, bulletConfig, explosionConfig) {
                var _this = _super.call(this, scene, x, y, texture, frame) || this;
                _this.currentScene = scene;
                _this.isShooting = false;
                _this.destroyed = false;
                _this.explosionComplete = false;
                _this._bullets = [];
                _this.bulletsGroup = _this.currentScene.add.group({ classType: Bullet });
                _this.bulletConfig = bulletConfig;
                _this.explosionConfig = explosionConfig;
                //add physics
                _this.currentScene.physics.world.enable(_this);
                _this.setDepth(2);
                _this.setDrag(300);
                _this.setAngularDrag(400);
                _this.setMaxVelocity(600);
                //add to the world
                _this.currentScene.add.existing(_this);
                return _this;
            }
            Object.defineProperty(Ship.prototype, "bullets", {
                //Public
                get: function () {
                    return this.bulletsGroup;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Ship.prototype, "isShipDestroyed", {
                get: function () {
                    return this.destroyed;
                },
                set: function (result) {
                    if (this.destroyed == result)
                        return;
                    this.destroyed = result;
                    if (result)
                        this.createExplosion();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Ship.prototype, "isExplosionComplete", {
                get: function () {
                    return this.explosionComplete;
                },
                enumerable: true,
                configurable: true
            });
            Ship.prototype.shoot = function () {
                var bullet = new Bullet(this.currentScene, this.x, this.y, this.rotation, this.bulletConfig.texture, this.bulletConfig.frame);
                this.bulletsGroup.add(bullet);
            };
            Ship.prototype.update = function () {
            };
            Ship.prototype.dispose = function () {
                this.bulletsGroup.destroy(true);
                this.isShooting = false;
                this.destroyed = false;
                this.bulletConfig = null;
                this.explosionConfig = null;
                this.destroy();
            };
            //Private
            Ship.prototype.createExplosion = function () {
                var _this = this;
                this.explosionComplete = false;
                this.setActive(false);
                this.setVisible(false);
                var explosion = this.currentScene.add.sprite(this.x, this.y, this.explosionConfig.texture, this.explosionConfig.frame).setScale(0.1).setBlendMode(1);
                this.currentScene.tweens.add({
                    targets: explosion,
                    props: {
                        scaleX: { value: 1, ease: 'Power1' },
                        scaleY: { value: 1, ease: 'Power1' },
                        alpha: { value: 0 }
                    },
                    duration: 2000,
                    yoyo: false,
                    onCompleteScope: this,
                    onComplete: function () {
                        _this.explosionComplete = true;
                        explosion.destroy();
                    }
                });
            };
            return Ship;
        }(Phaser.Physics.Arcade.Image));
        objects.Ship = Ship;
    })(objects = spaceHipster.objects || (spaceHipster.objects = {}));
})(spaceHipster || (spaceHipster = {}));
/**
 * Created by syncho on 12.6.2018 г..
 */
var spaceHipster;
(function (spaceHipster) {
    var objects;
    (function (objects) {
        var Asteroid = /** @class */ (function (_super) {
            __extends(Asteroid, _super);
            function Asteroid(scene, x, y, spriteName, velocity, ship, explosionConfig) {
                var _this = _super.call(this, scene, x, y, spriteName) || this;
                _this.currentScene = scene;
                _this.ship = ship;
                _this.dead = false;
                _this.shooted = false;
                _this.score = 10 * velocity;
                _this.explosionConfig = explosionConfig;
                _this.velocity = _this.getRandomVelocity(velocity + 1, velocity + 5);
                //physics
                _this.currentScene.physics.world.enable(_this);
                _this.body.allowGravity = false;
                _this.currentScene.add.existing(_this);
                return _this;
            }
            Object.defineProperty(Asteroid.prototype, "getScore", {
                get: function () {
                    return this.score;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Asteroid.prototype, "isDead", {
                get: function () {
                    return this.dead;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Asteroid.prototype, "isShoot", {
                get: function () {
                    return this.shooted;
                },
                set: function (shooted) {
                    this.shooted = shooted;
                },
                enumerable: true,
                configurable: true
            });
            Asteroid.prototype.getRandomVelocity = function (aMin, aMax) {
                return new Phaser.Math.Vector2(Phaser.Math.RND.between(this.getRndNumber(aMin, aMax), this.getRndNumber(aMin, aMax)), Phaser.Math.RND.between(this.getRndNumber(aMin, aMax), this.getRndNumber(aMin, aMax)));
            };
            Asteroid.prototype.getRndNumber = function (aMin, aMax) {
                var num = Math.floor(Math.random() * aMax) + aMin;
                num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
                return num;
            };
            Asteroid.prototype.update = function () {
                this.applyForce();
                if (!this.dead)
                    this.checkIfOffScreen();
            };
            Asteroid.prototype.checkIfOffScreen = function () {
                if (this.x > (this.currentScene.sys.canvas.width * 2) + this.ship.x ||
                    this.x < this.ship.x - (this.currentScene.sys.canvas.width * 2)) {
                    this.dead = true;
                }
            };
            Asteroid.prototype.dispose = function () {
                if (this.isShoot)
                    this.createExplosion();
                this.shooted = false;
                this.explosionConfig = null;
                this.dead = false;
                this.destroy();
            };
            Asteroid.prototype.createExplosion = function () {
                var explosion = this.currentScene.add.sprite(this.x, this.y, this.explosionConfig.texture, this.explosionConfig.frame).setScale(0.1);
                this.currentScene.tweens.add({
                    targets: explosion,
                    props: {
                        scaleX: { value: 1, ease: 'Power1' },
                        scaleY: { value: 1, ease: 'Power1' }
                    },
                    duration: 150,
                    yoyo: true,
                    repeat: 0,
                    onCompleteScope: this,
                    onComplete: function () {
                        explosion.destroy();
                    }
                });
            };
            Asteroid.prototype.applyForce = function () {
                this.x += this.velocity.x;
                this.y += this.velocity.y;
            };
            return Asteroid;
        }(Phaser.Physics.Arcade.Sprite));
        objects.Asteroid = Asteroid;
    })(objects = spaceHipster.objects || (spaceHipster.objects = {}));
})(spaceHipster || (spaceHipster = {}));
/**
 * Created by syncho on 16.5.2018 г..
 */
var spaceHipster;
(function (spaceHipster) {
    var scenes;
    (function (scenes) {
        var PreloadScene = /** @class */ (function (_super) {
            __extends(PreloadScene, _super);
            function PreloadScene() {
                return _super.call(this, { key: 'PreloadScene' }) || this;
            }
            PreloadScene.prototype.preload = function () {
                var _this = this;
                this._preloadBar = this.add.sprite(0, 0, 'preloadBar').setOrigin(0, 0);
                Phaser.Display.Align.In.Center(this._preloadBar, this.add.zone(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.sys.canvas.width, this.sys.canvas.height));
                this.load.on('progress', function (value) { return _this._preloadBar.setScale(value, 1).setOrigin(0, 0); });
                this.load.on('complete', function () {
                    _this.add.text(100, 100, "Loading Complete");
                });
                //load game assets
                this.load.image('background', 'res/images/nebula.jpg');
                this.load.image('stars', 'res/images/stars.png');
                this.load.atlas('space', 'res/images/space.png', 'res/images/space.json');
                this.load.atlas('enemyShips', 'res/images/EnemyShips.png', 'res/images/EnemyShips.json');
                this.load.audio('collect', 'res/audio/collect.ogg');
                this.load.audio('explosion', 'res/audio/explosion.ogg');
                this.load.audio('laser', 'res/audio/laser.mp3');
                this.load.audio('asteroidExplosion', 'res/audio/asteroidExplosion.mp3');
            };
            PreloadScene.prototype.create = function () {
                this.scene.start('MainMenuScene');
            };
            return PreloadScene;
        }(Phaser.Scene));
        scenes.PreloadScene = PreloadScene;
    })(scenes = spaceHipster.scenes || (spaceHipster.scenes = {}));
})(spaceHipster || (spaceHipster = {}));
/**
 * Created by syncho on 16.5.2018 г..
 */
var spaceHipster;
(function (spaceHipster) {
    var scenes;
    (function (scenes) {
        // import PlayerStats = spaceHipster.const.PLAYER;
        var MainMenuScene = /** @class */ (function (_super) {
            __extends(MainMenuScene, _super);
            function MainMenuScene() {
                return _super.call(this, { key: 'MainMenuScene' }) || this;
            }
            MainMenuScene.prototype.create = function () {
                if (MainMenuScene.SCORE > MainMenuScene.HIGH_SCORE)
                    MainMenuScene.HIGH_SCORE = MainMenuScene.SCORE;
                MainMenuScene.SCORE = 0;
                this._background = this.add.tileSprite(0, 0, this.sys.canvas.width, this.sys.canvas.height, 'background').setOrigin(0);
                var text = 'Tap to begin';
                var style = { font: "30px Arial", fill: "#fff", align: "center" };
                var field = this.add.text(0, 0, text, style);
                field.setPosition((this.sys.canvas.width / 2) - (field.width) / 2, (this.sys.canvas.height / 2) - (field.height) / 2);
                text = "Highest score: " + MainMenuScene.HIGH_SCORE;
                style = { font: "15px Arial", fill: "#fff", align: "center" };
                field = this.add.text(0, 0, text, style);
                field.setPosition((this.sys.canvas.width / 2) - (field.width) / 2, (this.sys.canvas.height / 2) - (field.height) / 2 + 50);
                console.log("MainMenuScene.HIGH_SCORE:", MainMenuScene.HIGH_SCORE); // TODO:remove
            };
            MainMenuScene.prototype.update = function () {
                if (this.input.activePointer.justDown) {
                    this.scene.start('GameScene');
                }
                this._background.tilePositionX += 0.5;
            };
            MainMenuScene.SCORE = 0;
            MainMenuScene.HIGH_SCORE = 0;
            return MainMenuScene;
        }(Phaser.Scene));
        scenes.MainMenuScene = MainMenuScene;
    })(scenes = spaceHipster.scenes || (spaceHipster.scenes = {}));
})(spaceHipster || (spaceHipster = {}));
/**
 * Created by syncho on 16.5.2018 г..
 */
var spaceHipster;
(function (spaceHipster) {
    var scenes;
    (function (scenes) {
        var Asteroid = spaceHipster.objects.Asteroid;
        var Ship = spaceHipster.objects.Ship;
        var GameScene = /** @class */ (function (_super) {
            __extends(GameScene, _super);
            function GameScene() {
                var _this = _super.call(this, { key: 'GameScene' }) || this;
                _this._lastFired = 0;
                _this.audio = {};
                //this.config = new Config();
                //this.animationConfig = this.config.animations;
                _this.animationConfig = [
                    {
                        key: 'mine-sheet',
                        atlas: 'space',
                        frame: 'mine',
                        frameWidth: 64,
                        animKey: 'mine-anim',
                        start: 0,
                        end: 15,
                        frameRate: 20
                    },
                    {
                        key: 'asteroid1-sheet',
                        atlas: 'space',
                        frame: 'asteroid1',
                        frameWidth: 96,
                        animKey: 'asteroid1-anim',
                        start: 0,
                        end: 24,
                        frameRate: 20
                    },
                    {
                        key: 'asteroid2-sheet',
                        atlas: 'space',
                        frame: 'asteroid2',
                        frameWidth: 96,
                        animKey: 'asteroid2-anim',
                        start: 0,
                        end: 24,
                        frameRate: 20
                    },
                    {
                        key: 'asteroid3-sheet',
                        atlas: 'space',
                        frame: 'asteroid3',
                        frameWidth: 96,
                        animKey: 'asteroid3-anim',
                        start: 0,
                        end: 24,
                        frameRate: 20
                    },
                    {
                        key: 'asteroid4-sheet',
                        atlas: 'space',
                        frame: 'asteroid4',
                        frameWidth: 64,
                        animKey: 'asteroid4-anim',
                        start: 0,
                        end: 24,
                        frameRate: 20
                    },
                ];
                return _this;
            }
            GameScene.prototype.create = function () {
                var _this = this;
                this.asteroidGroup = this.add.group();
                var len = this.animationConfig.length;
                for (var i_1 = 0; i_1 < len; i_1++) {
                    var texture = this.animationConfig[i_1];
                    if (this.textures.list.hasOwnProperty(texture.key))
                        continue;
                    this.textures.addSpriteSheetFromAtlas(texture.key, {
                        atlas: texture.atlas,
                        frame: texture.frame,
                        frameWidth: texture.frameWidth
                    });
                    this.anims.create({
                        key: texture.animKey,
                        frames: this.anims.generateFrameNumbers(texture.key, { start: texture.start, end: texture.end }),
                        frameRate: 20,
                        repeat: -1
                    });
                }
                this._background = this.add.tileSprite(400, 300, 1800, 860, 'background').setScrollFactor(0);
                //Planets
                this.add.image(512, 680, 'space', 'blue-planet').setOrigin(0).setScrollFactor(0.6);
                this.add.image(2833, 1246, 'space', 'brown-planet').setOrigin(0).setScrollFactor(0.6);
                this.add.image(3875, 531, 'space', 'sun').setOrigin(0).setScrollFactor(0.6);
                this.add.image(5345 + 1024, 327 + 1024, 'space', 'galaxy').setBlendMode(1).setScrollFactor(0.6);
                this.add.image(908, 3922, 'space', 'gas-giant').setOrigin(0).setScrollFactor(0.6);
                this.add.image(3140, 2974, 'space', 'brown-planet').setOrigin(0).setScrollFactor(0.6);
                this.add.image(6052, 4280, 'space', 'purple-planet').setOrigin(0).setScrollFactor(0.6);
                for (var i = 0; i < 8; i++) {
                    this.add.image(Phaser.Math.Between(0, 8000), Phaser.Math.Between(0, 6000), 'space', 'eyes').setBlendMode(1);
                }
                this._stars = this.add.tileSprite(400, 300, 1024, 1024, 'stars').setScrollFactor(0);
                //Audio
                this.audio.collect = this.sound.add('collect');
                this.audio.explosion = this.sound.add('explosion');
                this.audio.laser = this.sound.add('laser');
                this.audio.asteroidExplosion = this.sound.add('asteroidExplosion');
                //Ship
                this._ship = new Ship(this, 4000, 3000, 'space', 'ship', {
                    texture: 'space',
                    frame: 'blaster'
                }, { texture: 'space', frame: 'blastwave1' });
                //Ship Fire Emitter
                var ship = this._ship;
                var emitConfig = {
                    frame: 'blue',
                    speed: 100,
                    lifespan: {
                        onEmit: function (particle, key, t, value) {
                            return Phaser.Math.Percent(ship.body.speed, 0, 300) * 2000;
                        }
                    },
                    alpha: {
                        onEmit: function (particle, key, t, value) {
                            return Phaser.Math.Percent(ship.body.speed, 0, 300);
                        }
                    },
                    angle: {
                        onEmit: function (particle, key, t, value) {
                            var v = Phaser.Math.Between(-10, 10);
                            return (ship.angle - 180) + v;
                        }
                    },
                    scale: { start: 0.6, end: 0 }, blendMode: 'ADD'
                };
                this._particles = this.add.particles('space');
                var emitter = this._particles.createEmitter(emitConfig);
                emitter.startFollow(this._ship);
                this.cameras.main.startFollow(this._ship);
                this._cursor = this.input.keyboard.createCursorKeys();
                this._fire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
                this.spawnAsteroids(20);
                this.add.sprite(4100, 3000, 'enemyShips', 'ship2_1.png').setScale(0.6);
                this.physics.add.overlap(this._ship.bullets, this.asteroidGroup, this.asteroidIsShoot, null, this);
                this.physics.add.overlap(this._ship, this.asteroidGroup, function (ship) {
                    if (!ship.isShipDestroyed) {
                        ship.isShipDestroyed = true;
                        _this.audio.explosion.play();
                    }
                }, null, this);
            };
            GameScene.prototype.asteroidIsShoot = function (bullet, asteroid) {
                this.audio.asteroidExplosion.play();
                bullet.destroy();
                asteroid.isShoot = true;
                scenes.MainMenuScene.SCORE += (asteroid.getScore * GameScene.LEVEL);
                asteroid.dispose();
                this.spawnAsteroids(1);
            };
            GameScene.prototype.spawnAsteroids = function (amount) {
                for (var i = 0; i < amount; i++) {
                    var x = this.getRandomSpawnPostion(this.sys.canvas.width) + this._ship.x;
                    var y = this.getRandomSpawnPostion(this.sys.canvas.height) + this._ship.y;
                    var num = Phaser.Math.RND.between(1, 4);
                    var texture = 'asteroid' + num + '-anim';
                    var asteroid = new Asteroid(this, x, y, texture, num, this._ship, {
                        texture: 'space',
                        frame: 'muzzleflash7'
                    });
                    asteroid.play(texture);
                    this.asteroidGroup.add(asteroid);
                }
            };
            GameScene.prototype.getRandomSpawnPostion = function (aScreenSize) {
                var rndPos = Phaser.Math.RND.between(aScreenSize / 2, aScreenSize);
                while (rndPos > aScreenSize / 3 && rndPos < aScreenSize * 2 / 3)
                    rndPos = Phaser.Math.RND.between(aScreenSize / 2, aScreenSize);
                return Phaser.Math.RND.between(0, 1) ? rndPos : -rndPos;
            };
            GameScene.prototype.update = function (time, delta) {
                this._background.tilePositionX += 0.3;
                if (!this._ship.isShipDestroyed) {
                    if (this._cursor.left.isDown)
                        this._ship.setAngularVelocity(-150);
                    else if (this._cursor.right.isDown)
                        this._ship.setAngularVelocity(150);
                    else
                        this._ship.setAngularVelocity(0);
                    if (this._cursor.up.isDown)
                        this.physics.velocityFromRotation(this._ship.rotation, 600, this._ship.body.acceleration);
                    else
                        this._ship.setAcceleration(0);
                    if (this._fire.isDown && time > this._lastFired) {
                        this._ship.shoot();
                        this._lastFired = time + 100;
                        this.audio.laser.play();
                    }
                    this._background.tilePositionX += this._ship.body.deltaX() * 0.5;
                    this._background.tilePositionY += this._ship.body.deltaY() * 0.5;
                    this._stars.tilePositionX += this._ship.body.deltaX() * 2;
                    this._stars.tilePositionY += this._ship.body.deltaY() * 2;
                }
                else {
                    this._ship.setAcceleration(0);
                    this._ship.body.speed = 0;
                }
                var len = this.asteroidGroup.children.size;
                for (var i = 0; i < len; i++) {
                    var asteroid = this.asteroidGroup.children.entries[i];
                    asteroid.update();
                    if (asteroid.isDead || asteroid.isShoot) {
                        asteroid.dispose();
                        this.spawnAsteroids(1);
                    }
                }
                if (this._ship.isShipDestroyed && this._ship.isExplosionComplete) {
                    this._ship.dispose();
                    this.asteroidGroup.destroy(true);
                    this.scene.start("MainMenuScene");
                }
            };
            GameScene.LEVEL = 1;
            return GameScene;
        }(Phaser.Scene));
        scenes.GameScene = GameScene;
    })(scenes = spaceHipster.scenes || (spaceHipster.scenes = {}));
})(spaceHipster || (spaceHipster = {}));
///<reference path="const/const.ts">
///<reference path="models/Config.ts">
///<reference path="scenes/BootScene.ts"/>
///<reference path="objects/Bullet.ts"/>
///<reference path="objects/Ship.ts"/>
///<reference path="objects/Asteroid.ts"/>
///<reference path="scenes/PreloadScene.ts"/>
///<reference path="scenes/MainMenuScene.ts"/>
///<reference path="scenes/GameScene.ts"/>
var spaceHipster;
(function (spaceHipster) {
    var BootScene = spaceHipster.scenes.BootScene;
    var PreloadScene = spaceHipster.scenes.PreloadScene;
    var MainMenuScene = spaceHipster.scenes.MainMenuScene;
    var GameScene = spaceHipster.scenes.GameScene;
    var Main = /** @class */ (function (_super) {
        __extends(Main, _super);
        function Main(config) {
            var _this = this;
            config.scene = [BootScene, PreloadScene, MainMenuScene, GameScene];
            _this = _super.call(this, config) || this;
            return _this;
        }
        Main.prototype.dispose = function () { };
        return Main;
    }(Phaser.Game));
    spaceHipster.Main = Main;
})(spaceHipster || (spaceHipster = {}));
/**
 * Created by syncho on 12.6.2018 г..
 */
// namespace spaceHipster.const{
//     // export let PLAYER = {
//     //
//     // }
//
//     export class PLAYER {
//         static SCORE:number =  0;
//         static HIGH_SCORE:number =  0;
//         static LEVEL:number = 0;
//         static LIVES:number = 3;
//     }
//     export class ASTEROID {
//         static LARGE:any ={
//             SCORE: 100,
//             SPEED: 3,
//         };
//         static MEDIUM:any = {
//             SCORE: 75,
//             SPEED: 4,
//         };
//         static SMALL:any ={
//             SCORE: 50,
//             SPEED: 5,
//         };
//     }
// }
/**
 * Created by syncho on 21.6.2018 г..
 */
var spaceHipster;
(function (spaceHipster) {
    var models;
    (function (models) {
        var Config = /** @class */ (function () {
            function Config() {
                this.animations = [
                    {
                        key: 'mine-sheet',
                        atlas: 'space',
                        frame: 'mine',
                        frameWidth: 64,
                        animKey: 'mine-anim',
                        start: 0,
                        end: 15,
                        frameRate: 20
                    },
                    {
                        key: 'asteroid1-sheet',
                        atlas: 'space',
                        frame: 'asteroid1',
                        frameWidth: 96,
                        animKey: 'asteroid1-anim',
                        start: 0,
                        end: 24,
                        frameRate: 20
                    },
                    {
                        key: 'asteroid2-sheet',
                        atlas: 'space',
                        frame: 'asteroid2',
                        frameWidth: 96,
                        animKey: 'asteroid2-anim',
                        start: 0,
                        end: 24,
                        frameRate: 20
                    },
                    {
                        key: 'asteroid3-sheet',
                        atlas: 'space',
                        frame: 'asteroid3',
                        frameWidth: 96,
                        animKey: 'asteroid3-anim',
                        start: 0,
                        end: 24,
                        frameRate: 20
                    },
                    {
                        key: 'asteroid4-sheet',
                        atlas: 'space',
                        frame: 'asteroid4',
                        frameWidth: 64,
                        animKey: 'asteroid4-anim',
                        start: 0,
                        end: 24,
                        frameRate: 20
                    },
                ];
            }
            return Config;
        }());
        models.Config = Config;
    })(models = spaceHipster.models || (spaceHipster.models = {}));
})(spaceHipster || (spaceHipster = {}));
/**
 * Created by syncho on 20.6.2018 г..
 */
var spaceHipster;
(function (spaceHipster) {
    var objects;
    (function (objects) {
        var Ship = spaceHipster.objects.Ship;
        var EnemyShip = /** @class */ (function (_super) {
            __extends(EnemyShip, _super);
            function EnemyShip(scene, x, y, texture, frame, bulletConfig, explosionConfig) {
                var _this = _super.call(this, scene, x, y, texture, frame, bulletConfig, explosionConfig) || this;
                _this.autoFire = false;
                _this.delayBetweenShoots = 5000;
                return _this;
            }
            return EnemyShip;
        }(Ship));
        objects.EnemyShip = EnemyShip;
    })(objects = spaceHipster.objects || (spaceHipster.objects = {}));
})(spaceHipster || (spaceHipster = {}));
//# sourceMappingURL=animation-debug.js.map
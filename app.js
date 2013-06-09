var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ttrs;
(function (ttrs) {
    (function (utils) {
        var EventEmitter = (function () {
            function EventEmitter() {
                this.callbacks = {
                };
            }
            EventEmitter.prototype.on = function (event, callback) {
                this.callbacks[event] = this.callbacks[event] || [];
                this.callbacks[event].push(callback);
            };
            EventEmitter.prototype.off = function (event, callback) {
                this.callbacks[event] = this.callbacks[event].filter(function (c) {
                    return callback !== c;
                });
            };
            EventEmitter.prototype.emit = function (eventName, data) {
                if(eventName != 'tick') {
                    console.log(data.toString());
                }
                if(!this.callbacks[eventName]) {
                    return;
                }
                var callbacks = this.callbacks[eventName].slice(0);
                for(var i = 0, l = callbacks.length; i < l; i++) {
                    callbacks[i](data);
                }
            };
            return EventEmitter;
        })();
        utils.EventEmitter = EventEmitter;        
        function throttle(callback, skip) {
            var count = 0;
            return function () {
                count++;
                var callsToSkip = typeof skip == 'function' ? skip() : skip;
                if(count == callsToSkip) {
                    count = 0;
                    return callback();
                }
                return (function () {
                })();
            };
        }
        utils.throttle = throttle;
    })(ttrs.utils || (ttrs.utils = {}));
    var utils = ttrs.utils;
})(ttrs || (ttrs = {}));
var ttrs;
(function (ttrs) {
    function play(controller) {
        return new Game(controller);
    }
    ttrs.play = play;
    var RenderEvent = (function () {
        function RenderEvent(elapsed) {
            this.elapsed = elapsed;
        }
        RenderEvent.prototype.toString = function () {
            return 'rendered in ' + this.elapsed + 'ms';
        };
        return RenderEvent;
    })();
    ttrs.RenderEvent = RenderEvent;    
    var ttrs;
    (function (ttrs) {
        (function (utils) {
            var EventEmitter = (function () {
                function EventEmitter() {
                    this.callbacks = {
                    };
                }
                EventEmitter.prototype.on = function (event, callback) {
                    this.callbacks[event] = this.callbacks[event] || [];
                    this.callbacks[event].push(callback);
                };
                EventEmitter.prototype.off = function (event, callback) {
                    this.callbacks[event] = this.callbacks[event].filter(function (c) {
                        return callback !== c;
                    });
                };
                EventEmitter.prototype.emit = function (eventName, data) {
                    if(eventName != 'tick') {
                        console.log(data.toString());
                    }
                    if(!this.callbacks[eventName]) {
                        return;
                    }
                    var callbacks = this.callbacks[eventName].slice(0);
                    for(var i = 0, l = callbacks.length; i < l; i++) {
                        callbacks[i](data);
                    }
                };
                return EventEmitter;
            })();
            utils.EventEmitter = EventEmitter;            
            function throttle(callback, skip) {
                var count = 0;
                return function () {
                    count++;
                    var callsToSkip = typeof skip == 'function' ? skip() : skip;
                    if(count == callsToSkip) {
                        count = 0;
                        return callback();
                    }
                    return (function () {
                    })();
                };
            }
            utils.throttle = throttle;
        })(ttrs.utils || (ttrs.utils = {}));
        var utils = ttrs.utils;
    })(ttrs || (ttrs = {}));
    var ReleaseEvent = (function () {
        function ReleaseEvent(releasedAt) {
            this.releasedAt = releasedAt;
        }
        return ReleaseEvent;
    })();
    ttrs.ReleaseEvent = ReleaseEvent;    
    var GameStartedEvent = (function () {
        function GameStartedEvent(board, figure, position) {
            this.board = board;
            this.figure = figure;
            this.figurePosition = position;
        }
        GameStartedEvent.prototype.toString = function () {
            return 'game started';
        };
        return GameStartedEvent;
    })();
    ttrs.GameStartedEvent = GameStartedEvent;    
    var ControllerEvent = (function () {
        function ControllerEvent(action) {
            this.action = action;
        }
        ControllerEvent.prototype.toString = function () {
            return "controller action " + this.action;
        };
        return ControllerEvent;
    })();
    ttrs.ControllerEvent = ControllerEvent;    
    var SpeedChangeEvent = (function () {
        function SpeedChangeEvent(oldSpeed, newSpeed) {
            this.oldSpeed = oldSpeed;
            this.newSpeed = newSpeed;
        }
        return SpeedChangeEvent;
    })();
    ttrs.SpeedChangeEvent = SpeedChangeEvent;    
    var TickEvent = (function () {
        function TickEvent(time) {
            this.time = time;
        }
        TickEvent.prototype.toString = function () {
            return "clock tick " + this.time;
        };
        return TickEvent;
    })();    
    var MoveEvent = (function () {
        function MoveEvent(movedFrom, direction, movedTo) {
            this.direction = direction;
            this.movedFrom = movedFrom;
            this.movedTo = movedTo;
        }
        MoveEvent.prototype.toString = function () {
            return 'moved from ' + this.movedFrom + ' by ' + this.direction + ' to ' + this.movedTo;
        };
        return MoveEvent;
    })();
    ttrs.MoveEvent = MoveEvent;    
    var DropEvent = (function () {
        function DropEvent(figure, position) {
            this.figure = figure;
            this.figurePosition = position;
        }
        DropEvent.prototype.toString = function () {
            return 'dropped ' + this.figure;
        };
        return DropEvent;
    })();
    ttrs.DropEvent = DropEvent;    
    var RotateEvent = (function () {
        function RotateEvent(figure, direction) {
            this.figure = figure;
            this.direction = direction;
        }
        RotateEvent.prototype.toString = function () {
            return 'rotated ' + this.direction;
        };
        return RotateEvent;
    })();
    ttrs.RotateEvent = RotateEvent;    
    var FixEvent = (function () {
        function FixEvent(figure, position, board) {
            this.figure = figure;
            this.position = position;
            this.board = board;
        }
        FixEvent.prototype.toString = function () {
            return 'fixed ' + this.figure + ' at ' + this.position;
        };
        return FixEvent;
    })();
    ttrs.FixEvent = FixEvent;    
    var GameOverEvent = (function () {
        function GameOverEvent(score) {
            this.score = score;
        }
        GameOverEvent.prototype.toString = function () {
            return 'game over! score = ' + this.score;
        };
        return GameOverEvent;
    })();
    ttrs.GameOverEvent = GameOverEvent;    
    var ScoreChangeEvent = (function () {
        function ScoreChangeEvent(score) {
            this.score = score;
        }
        ScoreChangeEvent.prototype.toString = function () {
            return 'score changed ' + this.score;
        };
        return ScoreChangeEvent;
    })();
    ttrs.ScoreChangeEvent = ScoreChangeEvent;    
    var LineClearEvent = (function () {
        function LineClearEvent(line, board) {
            this.line = line;
            this.board = board;
        }
        LineClearEvent.prototype.toString = function () {
            return 'line ' + this.line + ' cleared';
        };
        return LineClearEvent;
    })();
    ttrs.LineClearEvent = LineClearEvent;    
    var Clock = (function (_super) {
        __extends(Clock, _super);
        function Clock(delay) {
                _super.call(this);
            this.time = 0;
            this.delay = 100;
            this.ticking = false;
            this.delay = delay;
        }
        Clock.prototype.start = function () {
            this.ticking = true;
            this.tick();
        };
        Clock.prototype.stop = function () {
            this.ticking = false;
        };
        Clock.prototype.onTick = function (callback) {
            this.on('tick', callback);
        };
        Clock.prototype.isTicking = function () {
            return this.ticking;
        };
        Clock.prototype.tick = function () {
            var _this = this;
            this.time++;
            this.emit('tick', new TickEvent(this.time));
            if(this.ticking) {
                setTimeout(function () {
                    _this.tick();
                }, this.delay);
            }
        };
        return Clock;
    })(ttrs.utils.EventEmitter);    
    (function (RotationDirection) {
        RotationDirection._map = [];
        RotationDirection._map[0] = "left";
        RotationDirection.left = 0;
        RotationDirection._map[1] = "right";
        RotationDirection.right = 1;
    })(ttrs.RotationDirection || (ttrs.RotationDirection = {}));
    var RotationDirection = ttrs.RotationDirection;
    (function (GameAction) {
        GameAction._map = [];
        GameAction._map[0] = "moveLeft";
        GameAction.moveLeft = 0;
        GameAction._map[1] = "moveRight";
        GameAction.moveRight = 1;
        GameAction._map[2] = "rotateLeft";
        GameAction.rotateLeft = 2;
        GameAction._map[3] = "rotateRight";
        GameAction.rotateRight = 3;
        GameAction._map[4] = "release";
        GameAction.release = 4;
        GameAction._map[5] = "pauseResume";
        GameAction.pauseResume = 5;
    })(ttrs.GameAction || (ttrs.GameAction = {}));
    var GameAction = ttrs.GameAction;
    //TODO perf refactor
    var setIntersect = function (a, b) {
        return a.filter(function (pa) {
            return b.some(function (pb) {
                return pb.equals(pa);
            });
        });
    };
    //TODO perf refactor
    var setUnion = function (a, b) {
        var intersection = setIntersect(a, b);
        if(intersection.length == 0) {
            return a.concat(b);
        }
        return a.concat(b).filter(function (pu) {
            return intersection.some(function (pi) {
                return pi.equals(pu);
            });
        });
    };
    var move = function (points, vector) {
        return points.map(function (p) {
            return p.add(vector);
        });
    };
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        Point.prototype.equals = function (other) {
            return this.x == other.x && this.y == other.y;
        };
        Point.prototype.clone = function () {
            return new Point(this.x, this.y);
        };
        Point.prototype.add = function (other) {
            return new Point(this.x + other.x, this.y + other.y);
        };
        Point.prototype.toString = function () {
            return '[' + this.x + ',' + this.y + ']';
        };
        return Point;
    })();
    ttrs.Point = Point;    
    var RGBColor = (function () {
        function RGBColor(r, g, b) {
            this.r = r;
            this.g = g;
            this.b = b;
        }
        RGBColor.prototype.toString = function () {
            return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
        };
        return RGBColor;
    })();
    ttrs.RGBColor = RGBColor;    
    var Figure = (function () {
        function Figure(rotations, color) {
            this.currentRotation = 0;
            this.rotations = rotations;
            this.color = color;
        }
        Figure.prototype.rotate = function (direction) {
            var clone = this.clone();
            if(direction == RotationDirection.left) {
                clone.currentRotation = (this.currentRotation == 0) ? this.rotations.length - 1 : this.currentRotation - 1;
            } else {
                clone.currentRotation = (this.currentRotation + 1) % this.rotations.length;
            }
            return clone;
        };
        Figure.prototype.getPoints = function () {
            return this.rotations[this.currentRotation];
        };
        Figure.prototype.getWidth = function () {
            var width = 0;
            this.getPoints().forEach(function (p) {
                if((p.x + 1) > width) {
                    width = p.x + 1;
                }
            });
            return width;
        };
        Figure.prototype.getColor = function () {
            return this.color;
        };
        Figure.prototype.getHeight = function () {
            var height = 0;
            this.getPoints().forEach(function (p) {
                if((p.y + 1) > height) {
                    height = p.y + 1;
                }
            });
            return height;
        };
        Figure.prototype.clone = function () {
            return this;//TODO fix
            
        };
        return Figure;
    })();    
    var I = (function (_super) {
        __extends(I, _super);
        function I() {
                _super.call(this, [
        [
            new Point(0, 0), 
            new Point(1, 0), 
            new Point(2, 0), 
            new Point(3, 0)
        ], 
        [
            new Point(0, 0), 
            new Point(0, 1), 
            new Point(0, 2), 
            new Point(0, 3)
        ]
    ], new RGBColor(0, 255, 255));
        }
        I.prototype.toString = function () {
            return "I";
        };
        return I;
    })(Figure);    
    var L = (function (_super) {
        __extends(L, _super);
        function L() {
                _super.call(this, [
        [
            new Point(0, 0), 
            new Point(0, 1), 
            new Point(0, 2), 
            new Point(1, 2)
        ], 
        [
            new Point(0, 0), 
            new Point(1, 0), 
            new Point(2, 0), 
            new Point(0, 1)
        ], 
        [
            new Point(0, 0), 
            new Point(1, 0), 
            new Point(1, 1), 
            new Point(1, 2)
        ], 
        [
            new Point(0, 1), 
            new Point(1, 1), 
            new Point(2, 1), 
            new Point(2, 0)
        ]
    ], new RGBColor(255, 127, 0));
        }
        L.prototype.toString = function () {
            return "L";
        };
        return L;
    })(Figure);    
    var S = (function (_super) {
        __extends(S, _super);
        function S() {
                _super.call(this, [
        [
            new Point(0, 1), 
            new Point(1, 1), 
            new Point(1, 0), 
            new Point(2, 0)
        ], 
        [
            new Point(0, 0), 
            new Point(0, 1), 
            new Point(1, 1), 
            new Point(1, 2)
        ]
    ], new RGBColor(0, 255, 0));
        }
        S.prototype.toString = function () {
            return "S";
        };
        return S;
    })(Figure);    
    var Z = (function (_super) {
        __extends(Z, _super);
        function Z() {
                _super.call(this, [
        [
            new Point(0, 0), 
            new Point(1, 0), 
            new Point(1, 1), 
            new Point(2, 1)
        ], 
        [
            new Point(1, 0), 
            new Point(1, 1), 
            new Point(0, 1), 
            new Point(0, 2)
        ]
    ], new RGBColor(255, 0, 0));
        }
        Z.prototype.toString = function () {
            return "Z";
        };
        return Z;
    })(Figure);    
    var O = (function (_super) {
        __extends(O, _super);
        function O() {
                _super.call(this, [
        [
            new Point(0, 0), 
            new Point(1, 0), 
            new Point(0, 1), 
            new Point(1, 1)
        ]
    ], new RGBColor(255, 255, 0));
        }
        O.prototype.toString = function () {
            return "O";
        };
        return O;
    })(Figure);    
    var T = (function (_super) {
        __extends(T, _super);
        function T() {
                _super.call(this, [
        [
            new Point(0, 1), 
            new Point(1, 1), 
            new Point(2, 1), 
            new Point(1, 0)
        ], 
        [
            new Point(0, 0), 
            new Point(0, 1), 
            new Point(0, 2), 
            new Point(1, 1)
        ], 
        [
            new Point(0, 0), 
            new Point(1, 0), 
            new Point(2, 0), 
            new Point(1, 1)
        ], 
        [
            new Point(0, 1), 
            new Point(1, 0), 
            new Point(1, 1), 
            new Point(1, 2)
        ]
    ], new RGBColor(127, 0, 255));
        }
        T.prototype.toString = function () {
            return "T";
        };
        return T;
    })(Figure);    
    var J = (function (_super) {
        __extends(J, _super);
        function J() {
                _super.call(this, [
        [
            new Point(0, 0), 
            new Point(1, 0), 
            new Point(2, 0), 
            new Point(2, 1)
        ], 
        [
            new Point(0, 2), 
            new Point(1, 0), 
            new Point(1, 1), 
            new Point(1, 2)
        ], 
        [
            new Point(0, 0), 
            new Point(0, 1), 
            new Point(1, 1), 
            new Point(2, 1)
        ], 
        [
            new Point(0, 0), 
            new Point(0, 1), 
            new Point(0, 2), 
            new Point(1, 0)
        ]
    ], new RGBColor(0, 0, 255));
        }
        J.prototype.toString = function () {
            return "J";
        };
        return J;
    })(Figure);    
    var randomFigure = function () {
        var figures = [
            new I(), 
            new L(), 
            new S(), 
            new Z(), 
            new O(), 
            new T(), 
            new J()
        ];
        return figures[Math.floor(Math.random() * (figures.length))];
    };
    var Board = (function (_super) {
        __extends(Board, _super);
        function Board(width, height) {
                _super.call(this);
            this.color = new RGBColor(255, 255, 255);
            this.width = width;
            this.height = height;
            this.points = new Array();
        }
        Board.prototype.fix = function (figure, atPosition) {
            var result = this.clone();
            result.points = setUnion(result.points, move(figure.getPoints(), atPosition));
            return result;
        };
        Board.prototype.overlapsWith = function (figure, atPosition) {
            return setIntersect(this.clone().points, move(figure.getPoints(), atPosition)).length > 0;
        };
        Board.prototype.getPoints = function () {
            return this.points;
        };
        Board.prototype.getWidth = function () {
            return this.width;
        };
        Board.prototype.getHeight = function () {
            return this.height;
        };
        Board.prototype.getColor = function () {
            return this.color;
        };
        Board.prototype.getFilledLines = function () {
            var filledLines = new Array();
            for(var line = 0; line < this.height; line++) {
                if(this.points.filter(function (p) {
                    return p.y == line;
                }).length == this.width) {
                    //?
                    filledLines.push(line);
                }
            }
            return filledLines;
        };
        Board.prototype.clearLine = function (line) {
            var clone = this.clone();
            clone.points = this.points.filter(function (p) {
                return p.y != line;
            }).map(function (p) {
                if(p.y > line) {
                    return p.clone();
                }
                return p.add(new Point(0, 1));
            });
            return clone;
        };
        Board.prototype.isFilled = function () {
            return this.points.some(function (p) {
                return p.y == 0;
            });
        };
        Board.prototype.clone = function () {
            var b = new Board(this.width, this.height);
            b.points = this.points.map(function (p) {
                return p.clone();
            });
            return b;
        };
        return Board;
    })(ttrs.utils.EventEmitter);    
    var Controller = (function (_super) {
        __extends(Controller, _super);
        function Controller() {
            _super.apply(this, arguments);

        }
        Controller.prototype.onAction = function (callback) {
            this.on('Controller', callback);
        };
        return Controller;
    })(ttrs.utils.EventEmitter);    
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game(controller) {
            var _this = this;
                _super.call(this);
            this.score = 0;
            this.speed = 1;
            this.maxSpeed = 20;
            this.acceleration = 2000;
            this.clock = new Clock(40);
            this.figure = randomFigure();
            this.nextFigure = randomFigure();
            this.figurePosition = new Point(0, 0);
            this.board = new Board(10, 20);
            controller.onAction(function (event) {
                _this.onAction(event.action);
            });
        }
        Game.prototype.onAction = function (action) {
            var _this = this;
            var mapping = {
            };
            mapping[GameAction.moveLeft] = function () {
                return _this.tryMove(new Point(-1, 0));
            };
            mapping[GameAction.moveRight] = function () {
                return _this.tryMove(new Point(1, 0));
            };
            mapping[GameAction.rotateLeft] = function () {
                return _this.tryRotate(RotationDirection.left);
            };
            mapping[GameAction.rotateRight] = function () {
                return _this.tryRotate(RotationDirection.right);
            };
            mapping[GameAction.release] = function () {
                return _this.release();
            };
            var handler = mapping[action];
            if(handler) {
                handler();
            }
        };
        Game.prototype.release = function () {
            var _this = this;
            var fall = function () {
                return _this.tryMove(new Point(0, 1));
            };
            this.clock.onTick(fall);
            this.onFix(function (event) {
                return _this.clock.off('tick', fall);
            });
            this.emit('release', new ReleaseEvent(this.figurePosition));
        };
        Game.prototype.pauseResume = function () {
            if(this.clock.isTicking()) {
                this.clock.stop();
            } else {
                this.clock.start();
            }
        };
        Game.prototype.drop = function () {
            this.figure = this.nextFigure;
            this.nextFigure = randomFigure();
            this.figurePosition = new Point(Math.floor(Math.random() * (this.board.getWidth() - this.figure.getWidth())), -1 * this.figure.getHeight());
            this.emit('drop', new DropEvent(this.figure, this.figurePosition));
        };
        Game.prototype.fix = function () {
            this.board = this.board.fix(this.figure, this.figurePosition);
            this.emit('fix', new FixEvent(this.figure, this.figurePosition, this.board));
        };
        Game.prototype.tick = function () {
            var _this = this;
            var bonus = 0;
            this.board.getFilledLines().forEach(function (l) {
                _this.board = _this.board.clearLine(l);
                _this.emit('lineClear', new LineClearEvent(l, _this.board));
                _this.score += (Math.pow(2, bonus++));
                _this.emit('scoreChange', new ScoreChangeEvent(_this.score));
            });
            if(this.board.isFilled()) {
                this.clock.stop();
                this.emit('gameOver', new GameOverEvent(this.score));
                return;
            }
            this.tryMove(new Point(0, 1));
        };
        Game.prototype.tryMove = function (direction) {
            var nextFigurePosition = this.figurePosition.add(direction);
            if(nextFigurePosition.x < 0 || nextFigurePosition.x > (this.board.getWidth() - this.figure.getWidth())) {
                return;
            }
            if(this.board.overlapsWith(this.figure, nextFigurePosition) || this.figurePosition.y + this.figure.getHeight() == this.board.getHeight()) {
                this.fix();
                this.drop();
            } else {
                var previuosFigurePosition = this.figurePosition;
                this.figurePosition = nextFigurePosition;
                this.emit('move', new MoveEvent(previuosFigurePosition, direction, this.figurePosition));
            }
        };
        Game.prototype.tryRotate = function (direction) {
            var rotatedFigure = this.figure.rotate(direction);
            if(this.figurePosition.x < 0 || this.figurePosition.x > (this.board.getWidth() - rotatedFigure.getWidth()) || this.figurePosition.y < 0 || this.figurePosition.y > this.board.getWidth() - rotatedFigure.getHeight()) {
                return;
            }
            if(this.board.overlapsWith(rotatedFigure, this.figurePosition)) {
                return;
            }
            this.figure = rotatedFigure;
            this.emit('rotate', new RotateEvent(this.figure, direction));
        };
        Game.prototype.increaseSpeed = function () {
            var previousSpeed = this.speed;
            this.speed = this.speed++ % this.maxSpeed;
            this.emit('speedChange', new SpeedChangeEvent(previousSpeed, this.speed));
        };
        Game.prototype.start = function () {
            var _this = this;
            this.clock.onTick(ttrs.utils.throttle(function (event) {
                return _this.tick();
            }, function () {
                return _this.maxSpeed - _this.speed;
            }));
            this.clock.onTick(ttrs.utils.throttle(this.increaseSpeed, this.acceleration));
            this.clock.start();
            this.emit('start', new GameStartedEvent(this.board, this.figure, this.figurePosition));
            this.drop();
        };
        Game.prototype.onDrop = function (callback) {
            this.on('drop', callback);
        };
        Game.prototype.onFix = function (callback) {
            this.on('fix', callback);
        };
        Game.prototype.onSpeedChange = function (callback) {
            this.on('speedChange', callback);
        };
        Game.prototype.onMoved = function (callback) {
            this.on('move', callback);
        };
        Game.prototype.onRotate = function (callback) {
            this.on('rotate', callback);
        };
        Game.prototype.onScoreChange = function (callback) {
            this.on('scoreChange', callback);
        };
        Game.prototype.onGameOver = function (callback) {
            this.on('gameOver', callback);
        };
        Game.prototype.onLineClear = function (callback) {
            this.on('lineClear', callback);
        };
        Game.prototype.onGameStart = function (callback) {
            this.on('start', callback);
        };
        return Game;
    })(ttrs.utils.EventEmitter);    
})(ttrs || (ttrs = {}));
var ttrs;
(function (ttrs) {
    (function (renders) {
        var Canvas2DRenderer = (function (_super) {
            __extends(Canvas2DRenderer, _super);
            function Canvas2DRenderer(context, game) {
                var _this = this;
                        _super.call(this);
                this.score = 0;
                this.backgound = new ttrs.RGBColor(0, 0, 0);
                this.context = context;
                game.onDrop(function (event) {
                    _this.figure = event.figure;
                    _this.figurePosition = event.figurePosition;
                    _this.drawEverything();
                });
                game.onFix(function (event) {
                    _this.board = event.board;
                    _this.drawEverything();
                });
                game.onLineClear(function (event) {
                    _this.board = event.board;
                    _this.drawEverything();
                });
                game.onMoved(function (event) {
                    _this.figurePosition = event.movedTo;
                    _this.drawEverything();
                });
                game.onRotate(function (event) {
                    _this.figure = event.figure;
                    _this.drawEverything();
                });
                game.onGameStart(function (event) {
                    _this.figure = event.figure;
                    _this.board = event.board;
                    _this.figurePosition = event.figurePosition;
                });
                game.onScoreChange(function (event) {
                    _this.score = event.score;
                });
            }
            Canvas2DRenderer.prototype.getWidth = function () {
                return this.context.canvas.width;
            };
            Canvas2DRenderer.prototype.getHeight = function () {
                return this.context.canvas.height;
            };
            Canvas2DRenderer.prototype.getBlockWidth = function () {
                return this.board ? this.getWidth() / this.board.getWidth() : this.getWidth() / 10;
            };
            Canvas2DRenderer.prototype.getBlockHeight = function () {
                return this.board ? this.getHeight() / this.board.getHeight() : this.getHeight() / 20;
            };
            Canvas2DRenderer.prototype.drawBlock = function (position, color) {
                this.context.fillStyle = color.toString();
                this.context.fillRect(position.x * this.getBlockWidth() + this.getBlockWidth() * 0.05, position.y * this.getBlockHeight() + this.getBlockHeight() * 0.05, this.getBlockWidth() * 0.9, this.getBlockHeight() * 0.9);
            };
            Canvas2DRenderer.prototype.eraseEverything = function () {
                this.context.fillStyle = this.backgound.toString();
                this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
            };
            Canvas2DRenderer.prototype.drawEverything = function () {
                var start = new Date().getMilliseconds();
                this.eraseEverything();
                this.drawBoard();
                this.drawFigure();
                this.drawScore();
                var end = new Date().getMilliseconds();
                this.emit('rendered', new ttrs.RenderEvent(end - start));
            };
            Canvas2DRenderer.prototype.drawScore = function () {
                this.context.fillStyle = 'rgb(255,255,255)';
                this.context.font = "18px sans-serif";
                this.context.fillText(this.score.toString(), 10, 20);
            };
            Canvas2DRenderer.prototype.drawBoard = function () {
                if(this.board) {
                    var board = this.board.getPoints();
                    for(var i = 0, l = board.length; i < l; i++) {
                        this.drawBlock(board[i], this.board.getColor());
                    }
                }
            };
            Canvas2DRenderer.prototype.drawFigure = function () {
                if(this.figure && this.figurePosition) {
                    var figure = this.figure.getPoints();
                    for(var i = 0, l = figure.length; i < l; i++) {
                        this.drawBlock(figure[i].add(this.figurePosition), this.figure.getColor());
                    }
                }
            };
            Canvas2DRenderer.prototype.onRendered = function (callback) {
                this.on('rendered', callback);
            };
            return Canvas2DRenderer;
        })(ttrs.utils.EventEmitter);
        renders.Canvas2DRenderer = Canvas2DRenderer;        
    })(ttrs.renders || (ttrs.renders = {}));
    var renders = ttrs.renders;
})(ttrs || (ttrs = {}));
var ttrs;
(function (ttrs) {
    (function (controllers) {
        var KeyboardController = (function (_super) {
            __extends(KeyboardController, _super);
            function KeyboardController(eventSource, keyMap) {
                var _this = this;
                        _super.call(this);
                this.keyMap = {
                    17: ttrs.GameAction.release,
                    32: ttrs.GameAction.pauseResume,
                    37: ttrs.GameAction.moveLeft,
                    38: ttrs.GameAction.rotateRight,
                    39: ttrs.GameAction.moveRight,
                    40: ttrs.GameAction.rotateLeft
                };
                this.keyMap = this.keyMap || keyMap;
                eventSource.addEventListener('keydown', function (e) {
                    console.log(e.keyCode);
                    var action = _this.keyMap[e.keyCode];
                    if(typeof action != 'undefined') {
                        _this.emit('action', new ttrs.ControllerEvent(action));
                        return false;
                    }
                }, false);
            }
            KeyboardController.prototype.onAction = function (callback) {
                this.on('action', callback);
            };
            return KeyboardController;
        })(ttrs.utils.EventEmitter);
        controllers.KeyboardController = KeyboardController;        
    })(ttrs.controllers || (ttrs.controllers = {}));
    var controllers = ttrs.controllers;
})(ttrs || (ttrs = {}));
//@ sourceMappingURL=app.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ttrs;
(function (ttrs) {
    (function (utils) {
        //TODO perf refactor
        function setIntersect(a, b) {
            return a.filter(function (pa) {
                return b.some(function (pb) {
                    return pb.equals(pa);
                });
            });
        }
        utils.setIntersect = setIntersect;

        //TODO perf refactor
        function setUnion(a, b) {
            var intersection = setIntersect(a, b);
            if (intersection.length == 0)
                return a.concat(b);

            return a.concat(b).filter(function (pu) {
                return intersection.some(function (pi) {
                    return pi.equals(pu);
                });
            });
        }
        utils.setUnion = setUnion;

        function move(points, vector) {
            return points.map(function (p) {
                return p.add(vector);
            });
        }
        utils.move = move;

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
                return new utils.Point(this.x + other.x, this.y + other.y);
            };

            Point.prototype.toString = function () {
                return '[' + this.x + ',' + this.y + ']';
            };
            return Point;
        })();
        utils.Point = Point;

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
        utils.RGBColor = RGBColor;

        var EventEmitter = (function () {
            function EventEmitter() {
                this.callbacks = {};
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
                if (eventName != 'tick')
                    console.log(data.toString());
                if (!this.callbacks[eventName])
                    return;

                var callbacks = this.callbacks[eventName].slice(0);
                for (var i = 0, l = callbacks.length; i < l; i++)
                    callbacks[i](data);
            };
            return EventEmitter;
        })();
        utils.EventEmitter = EventEmitter;

        var EventDispatcher = (function () {
            function EventDispatcher() {
                this.handlers = [];
            }
            EventDispatcher.prototype.add = function (handler) {
                this.handlers.push(handler);
            };

            EventDispatcher.prototype.remove = function (handler) {
                this.handlers = this.handlers.filter(function (h) {
                    return h !== handler;
                });
            };

            EventDispatcher.prototype.dispatch = function (event) {
                for (var i = 0, l = this.handlers.length; i < l; i++)
                    if (this.handlers[i] && typeof this.handlers[i] === 'function')
                        this.handlers[i](event);
            };
            return EventDispatcher;
        })();
        utils.EventDispatcher = EventDispatcher;

        function throttle(callback, skip) {
            var count = 0;
            return function () {
                count++;
                var callsToSkip = typeof skip == 'function' ? skip() : skip;
                if (count == callsToSkip) {
                    count = 0;
                    return callback();
                }
                return (function () {
                })();
            };
        }
        utils.throttle = throttle;

        var Clock = (function () {
            function Clock(delay) {
                this.onTick = new EventDispatcher();
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

            Clock.prototype.isTicking = function () {
                return this.ticking;
            };

            Clock.prototype.tick = function () {
                var _this = this;
                this.time++;
                this.onTick.dispatch(new TickEvent(this.time));

                if (this.ticking)
                    setTimeout(function () {
                        _this.tick();
                    }, this.delay);
            };
            return Clock;
        })();
        utils.Clock = Clock;

        var TickEvent = (function () {
            function TickEvent(time) {
                this.time = time;
            }
            TickEvent.prototype.toString = function () {
                return "clock tick " + this.time;
            };
            return TickEvent;
        })();
        utils.TickEvent = TickEvent;
    })(ttrs.utils || (ttrs.utils = {}));
    var utils = ttrs.utils;
})(ttrs || (ttrs = {}));

var ttrs;
(function (ttrs) {
    (function (game) {
        function play(controller) {
            return new Game(controller);
        }
        game.play = play;

        var ReleaseEvent = (function () {
            function ReleaseEvent(releasedAt) {
                this.releasedAt = releasedAt;
            }
            return ReleaseEvent;
        })();
        game.ReleaseEvent = ReleaseEvent;

        var GameStartedEvent = (function () {
            function GameStartedEvent(board, piece, position) {
                this.board = board;
                this.piece = piece;
                this.piecePosition = position;
            }
            GameStartedEvent.prototype.toString = function () {
                return 'game started';
            };
            return GameStartedEvent;
        })();
        game.GameStartedEvent = GameStartedEvent;

        var SpeedChangeEvent = (function () {
            function SpeedChangeEvent(oldSpeed, newSpeed) {
                this.oldSpeed = oldSpeed;
                this.newSpeed = newSpeed;
            }
            return SpeedChangeEvent;
        })();
        game.SpeedChangeEvent = SpeedChangeEvent;

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
        game.MoveEvent = MoveEvent;

        var DropEvent = (function () {
            function DropEvent(piece, position) {
                this.piece = piece;
                this.piecePosition = position;
            }
            DropEvent.prototype.toString = function () {
                return 'dropped ' + this.piece;
            };
            return DropEvent;
        })();
        game.DropEvent = DropEvent;

        var RotateEvent = (function () {
            function RotateEvent(piece, direction) {
                this.piece = piece;
                this.direction = direction;
            }
            RotateEvent.prototype.toString = function () {
                return 'rotated ' + this.direction;
            };
            return RotateEvent;
        })();
        game.RotateEvent = RotateEvent;

        var FixEvent = (function () {
            function FixEvent(piece, position, board) {
                this.piece = piece;
                this.position = position;
                this.board = board;
            }
            FixEvent.prototype.toString = function () {
                return 'fixed ' + this.piece + ' at ' + this.position;
            };
            return FixEvent;
        })();
        game.FixEvent = FixEvent;

        var GameOverEvent = (function () {
            function GameOverEvent(score) {
                this.score = score;
            }
            GameOverEvent.prototype.toString = function () {
                return 'game over! score = ' + this.score;
            };
            return GameOverEvent;
        })();
        game.GameOverEvent = GameOverEvent;

        var ScoreChangeEvent = (function () {
            function ScoreChangeEvent(score) {
                this.score = score;
            }
            ScoreChangeEvent.prototype.toString = function () {
                return 'score changed ' + this.score;
            };
            return ScoreChangeEvent;
        })();
        game.ScoreChangeEvent = ScoreChangeEvent;

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
        game.LineClearEvent = LineClearEvent;

        (function (RotationDirection) {
            RotationDirection[RotationDirection["left"] = 0] = "left";

            RotationDirection[RotationDirection["right"] = 1] = "right";
        })(game.RotationDirection || (game.RotationDirection = {}));
        var RotationDirection = game.RotationDirection;

        (function (GameAction) {
            GameAction[GameAction["moveLeft"] = 0] = "moveLeft";
            GameAction[GameAction["moveRight"] = 1] = "moveRight";
            GameAction[GameAction["rotateLeft"] = 2] = "rotateLeft";
            GameAction[GameAction["rotateRight"] = 3] = "rotateRight";
            GameAction[GameAction["release"] = 4] = "release";

            GameAction[GameAction["pauseResume"] = 5] = "pauseResume";
        })(game.GameAction || (game.GameAction = {}));
        var GameAction = game.GameAction;

        var Piece = (function () {
            function Piece(rotations, color) {
                this.currentRotation = 0;
                this.rotations = rotations;
                this.color = color;
            }
            Piece.prototype.rotate = function (direction) {
                var clone = this.clone();
                if (direction == RotationDirection.left)
                    clone.currentRotation = (this.currentRotation == 0) ? this.rotations.length - 1 : this.currentRotation - 1; else
                    clone.currentRotation = (this.currentRotation + 1) % this.rotations.length;

                return clone;
            };

            Piece.prototype.getPoints = function () {
                return this.rotations[this.currentRotation];
            };

            Piece.prototype.getWidth = function () {
                var width = 0;
                this.getPoints().forEach(function (p) {
                    if ((p.x + 1) > width)
                        width = p.x + 1;
                });
                return width;
            };

            Piece.prototype.getColor = function () {
                return this.color;
            };

            Piece.prototype.getHeight = function () {
                var height = 0;
                this.getPoints().forEach(function (p) {
                    if ((p.y + 1) > height)
                        height = p.y + 1;
                });
                return height;
            };

            Piece.prototype.clone = function () {
                var clone = new Piece(this.rotations, this.color);
                clone.currentRotation = this.currentRotation;
                return clone;
            };
            return Piece;
        })();

        var I = (function (_super) {
            __extends(I, _super);
            function I() {
                _super.call(this, [[new ttrs.utils.Point(0, 0), new ttrs.utils.Point(1, 0), new ttrs.utils.Point(2, 0), new ttrs.utils.Point(3, 0)], [new ttrs.utils.Point(0, 0), new ttrs.utils.Point(0, 1), new ttrs.utils.Point(0, 2), new ttrs.utils.Point(0, 3)]], new ttrs.utils.RGBColor(0, 255, 255));
            }
            I.prototype.toString = function () {
                return "I";
            };
            return I;
        })(Piece);

        var L = (function (_super) {
            __extends(L, _super);
            function L() {
                _super.call(this, [[new ttrs.utils.Point(0, 0), new ttrs.utils.Point(0, 1), new ttrs.utils.Point(0, 2), new ttrs.utils.Point(1, 2)], [new ttrs.utils.Point(0, 0), new ttrs.utils.Point(1, 0), new ttrs.utils.Point(2, 0), new ttrs.utils.Point(0, 1)], [new ttrs.utils.Point(0, 0), new ttrs.utils.Point(1, 0), new ttrs.utils.Point(1, 1), new ttrs.utils.Point(1, 2)], [new ttrs.utils.Point(0, 1), new ttrs.utils.Point(1, 1), new ttrs.utils.Point(2, 1), new ttrs.utils.Point(2, 0)]], new ttrs.utils.RGBColor(255, 127, 0));
            }
            L.prototype.toString = function () {
                return "L";
            };
            return L;
        })(Piece);

        var S = (function (_super) {
            __extends(S, _super);
            function S() {
                _super.call(this, [[new ttrs.utils.Point(0, 1), new ttrs.utils.Point(1, 1), new ttrs.utils.Point(1, 0), new ttrs.utils.Point(2, 0)], [new ttrs.utils.Point(0, 0), new ttrs.utils.Point(0, 1), new ttrs.utils.Point(1, 1), new ttrs.utils.Point(1, 2)]], new ttrs.utils.RGBColor(0, 255, 0));
            }
            S.prototype.toString = function () {
                return "S";
            };
            return S;
        })(Piece);

        var Z = (function (_super) {
            __extends(Z, _super);
            function Z() {
                _super.call(this, [[new ttrs.utils.Point(0, 0), new ttrs.utils.Point(1, 0), new ttrs.utils.Point(1, 1), new ttrs.utils.Point(2, 1)], [new ttrs.utils.Point(1, 0), new ttrs.utils.Point(1, 1), new ttrs.utils.Point(0, 1), new ttrs.utils.Point(0, 2)]], new ttrs.utils.RGBColor(255, 0, 0));
            }
            Z.prototype.toString = function () {
                return "Z";
            };
            return Z;
        })(Piece);

        var O = (function (_super) {
            __extends(O, _super);
            function O() {
                _super.call(this, [[new ttrs.utils.Point(0, 0), new ttrs.utils.Point(1, 0), new ttrs.utils.Point(0, 1), new ttrs.utils.Point(1, 1)]], new ttrs.utils.RGBColor(255, 255, 0));
            }
            O.prototype.toString = function () {
                return "O";
            };
            return O;
        })(Piece);

        var T = (function (_super) {
            __extends(T, _super);
            function T() {
                _super.call(this, [[new ttrs.utils.Point(0, 1), new ttrs.utils.Point(1, 1), new ttrs.utils.Point(2, 1), new ttrs.utils.Point(1, 0)], [new ttrs.utils.Point(0, 0), new ttrs.utils.Point(0, 1), new ttrs.utils.Point(0, 2), new ttrs.utils.Point(1, 1)], [new ttrs.utils.Point(0, 0), new ttrs.utils.Point(1, 0), new ttrs.utils.Point(2, 0), new ttrs.utils.Point(1, 1)], [new ttrs.utils.Point(0, 1), new ttrs.utils.Point(1, 0), new ttrs.utils.Point(1, 1), new ttrs.utils.Point(1, 2)]], new ttrs.utils.RGBColor(127, 0, 255));
            }
            T.prototype.toString = function () {
                return "T";
            };
            return T;
        })(Piece);

        var J = (function (_super) {
            __extends(J, _super);
            function J() {
                _super.call(this, [[new ttrs.utils.Point(0, 0), new ttrs.utils.Point(1, 0), new ttrs.utils.Point(2, 0), new ttrs.utils.Point(2, 1)], [new ttrs.utils.Point(0, 2), new ttrs.utils.Point(1, 0), new ttrs.utils.Point(1, 1), new ttrs.utils.Point(1, 2)], [new ttrs.utils.Point(0, 0), new ttrs.utils.Point(0, 1), new ttrs.utils.Point(1, 1), new ttrs.utils.Point(2, 1)], [new ttrs.utils.Point(0, 0), new ttrs.utils.Point(0, 1), new ttrs.utils.Point(0, 2), new ttrs.utils.Point(1, 0)]], new ttrs.utils.RGBColor(0, 0, 255));
            }
            J.prototype.toString = function () {
                return "J";
            };
            return J;
        })(Piece);

        var randomPiece = function () {
            var pieces = [new I(), new L(), new S(), new Z(), new O(), new T(), new J()];
            return pieces[Math.floor(Math.random() * (pieces.length))];
        };

        var Board = (function () {
            function Board(width, height) {
                this.color = new ttrs.utils.RGBColor(255, 255, 255);
                this.width = width;
                this.height = height;
                this.points = [];
            }
            Board.prototype.fix = function (piece, atPosition) {
                var result = this.clone();
                result.points = ttrs.utils.setUnion(result.points, ttrs.utils.move(piece.getPoints(), atPosition));
                return result;
            };

            Board.prototype.overlapsWith = function (piece, atPosition) {
                return ttrs.utils.setIntersect(this.clone().points, ttrs.utils.move(piece.getPoints(), atPosition)).length > 0;
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

                for (var line = 0; line < this.height; line++)
                    if (this.points.filter(function (p) {
                        return p.y == line;
                    }).length == this.width)
                        filledLines.push(line);

                return filledLines;
            };

            Board.prototype.clearLine = function (line) {
                var clone = this.clone();
                clone.points = this.points.filter(function (p) {
                    return p.y != line;
                }).map(function (p) {
                    if (p.y > line)
                        return p.clone();

                    return p.add(new ttrs.utils.Point(0, 1));
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
        })();

        var Game = (function () {
            function Game(controller) {
                var _this = this;
                this.onDrop = new ttrs.utils.EventDispatcher();
                this.onFix = new ttrs.utils.EventDispatcher();
                this.onSpeedChange = new ttrs.utils.EventDispatcher();
                this.onMoved = new ttrs.utils.EventDispatcher();
                this.onRotate = new ttrs.utils.EventDispatcher();
                this.onScoreChange = new ttrs.utils.EventDispatcher();
                this.onGameOver = new ttrs.utils.EventDispatcher();
                this.onLineClear = new ttrs.utils.EventDispatcher();
                this.onGameStart = new ttrs.utils.EventDispatcher();
                this.onRelease = new ttrs.utils.EventDispatcher();
                this.score = 0;
                this.speed = 1;
                this.maxSpeed = 20;
                this.acceleration = 2000;
                this.clock = new ttrs.utils.Clock(40);
                this.piece = randomPiece();
                this.nextPiece = randomPiece();
                this.piecePosition = new ttrs.utils.Point(0, 0);
                this.board = new Board(10, 20);
                controller.onAction.add(function (event) {
                    _this.onAction(event.action);
                });
            }
            Game.prototype.onAction = function (action) {
                var _this = this;
                var mapping = {};
                mapping[GameAction.moveLeft] = function () {
                    return _this.tryMove(new ttrs.utils.Point(-1, 0));
                };
                mapping[GameAction.moveRight] = function () {
                    return _this.tryMove(new ttrs.utils.Point(1, 0));
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
                if (handler)
                    handler();
            };

            Game.prototype.release = function () {
                var _this = this;
                var fall = function () {
                    return _this.tryMove(new ttrs.utils.Point(0, 1));
                };
                this.clock.onTick.add(fall);
                this.onFix.add(function (event) {
                    return _this.clock.onTick.remove(fall);
                });

                this.onRelease.dispatch(new ReleaseEvent(this.piecePosition));
            };

            Game.prototype.pauseResume = function () {
                if (this.clock.isTicking())
                    this.clock.stop(); else
                    this.clock.start();
            };

            Game.prototype.drop = function () {
                this.piece = this.nextPiece;
                this.nextPiece = randomPiece();
                this.piecePosition = new ttrs.utils.Point(Math.floor(Math.random() * (this.board.getWidth() - this.piece.getWidth())), -1 * this.piece.getHeight());
                this.onDrop.dispatch(new DropEvent(this.piece, this.piecePosition));
            };

            Game.prototype.fix = function () {
                this.board = this.board.fix(this.piece, this.piecePosition);
                this.onFix.dispatch(new FixEvent(this.piece, this.piecePosition, this.board));
            };

            Game.prototype.tick = function () {
                var _this = this;
                var bonus = 0;
                this.board.getFilledLines().forEach(function (l) {
                    _this.board = _this.board.clearLine(l);
                    _this.onLineClear.dispatch(new LineClearEvent(l, _this.board));
                    _this.score += (Math.pow(2, bonus++));
                    _this.onScoreChange.dispatch(new ScoreChangeEvent(_this.score));
                });

                if (this.board.isFilled()) {
                    this.clock.stop();
                    this.onGameOver.dispatch(new GameOverEvent(this.score));
                    return;
                }

                this.tryMove(new ttrs.utils.Point(0, 1));
            };

            Game.prototype.tryMove = function (direction) {
                var nextPiecePosition = this.piecePosition.add(direction);

                if (nextPiecePosition.x < 0 || nextPiecePosition.x > (this.board.getWidth() - this.piece.getWidth()))
                    return;

                if (this.board.overlapsWith(this.piece, nextPiecePosition) || this.piecePosition.y + this.piece.getHeight() == this.board.getHeight()) {
                    this.fix();
                    this.drop();
                } else {
                    var previuosPiecePosition = this.piecePosition;
                    this.piecePosition = nextPiecePosition;
                    this.onMoved.dispatch(new MoveEvent(previuosPiecePosition, direction, this.piecePosition));
                }
            };

            Game.prototype.tryRotate = function (direction) {
                var rotatedPiece = this.piece.rotate(direction);

                if (this.piecePosition.x < 0 || this.piecePosition.x > (this.board.getWidth() - rotatedPiece.getWidth()) || this.piecePosition.y < 0 || this.piecePosition.y > this.board.getWidth() - rotatedPiece.getHeight())
                    return;

                if (this.board.overlapsWith(rotatedPiece, this.piecePosition))
                    return;

                this.piece = rotatedPiece;
                this.onRotate.dispatch(new RotateEvent(this.piece, direction));
            };

            Game.prototype.increaseSpeed = function () {
                var previousSpeed = this.speed;
                this.speed = this.speed++ % this.maxSpeed;
                this.onSpeedChange.dispatch(new SpeedChangeEvent(previousSpeed, this.speed));
            };

            Game.prototype.start = function () {
                var _this = this;
                this.clock.onTick.add(ttrs.utils.throttle(function (event) {
                    return _this.tick();
                }, function () {
                    return _this.maxSpeed - _this.speed;
                }));
                this.clock.onTick.add(ttrs.utils.throttle(this.increaseSpeed, this.acceleration));

                this.clock.start();
                this.onGameStart.dispatch(new GameStartedEvent(this.board, this.piece, this.piecePosition));
                this.drop();
            };
            return Game;
        })();
    })(ttrs.game || (ttrs.game = {}));
    var game = ttrs.game;
})(ttrs || (ttrs = {}));

var ttrs;
(function (ttrs) {
    (function (renders) {
        var RenderEvent = (function () {
            function RenderEvent(elapsed) {
                this.elapsed = elapsed;
            }
            RenderEvent.prototype.toString = function () {
                return 'rendered in ' + this.elapsed + 'ms';
            };
            return RenderEvent;
        })();
        renders.RenderEvent = RenderEvent;

        var Canvas2DRenderer = (function () {
            function Canvas2DRenderer(context, game) {
                var _this = this;
                this.onRendered = new ttrs.utils.EventDispatcher();
                this.score = 0;
                this.backgound = new ttrs.utils.RGBColor(0, 0, 0);
                this.context = context;

                game.onDrop.add(function (event) {
                    _this.piece = event.piece;
                    _this.piecePosition = event.piecePosition;
                    _this.drawEverything();
                });

                game.onFix.add(function (event) {
                    _this.board = event.board;
                    _this.drawEverything();
                });

                game.onLineClear.add(function (event) {
                    _this.board = event.board;
                    _this.drawEverything();
                });

                game.onMoved.add(function (event) {
                    _this.piecePosition = event.movedTo;
                    _this.drawEverything();
                });

                game.onRotate.add(function (event) {
                    _this.piece = event.piece;
                    _this.drawEverything();
                });

                game.onGameStart.add(function (event) {
                    _this.piece = event.piece;
                    _this.board = event.board;
                    _this.piecePosition = event.piecePosition;
                });

                game.onScoreChange.add(function (event) {
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
                this.drawPiece();
                this.drawScore();

                var end = new Date().getMilliseconds();

                this.onRendered.dispatch(new RenderEvent(end - start));
            };

            Canvas2DRenderer.prototype.drawScore = function () {
                this.context.fillStyle = 'rgb(255,255,255)';
                this.context.font = "18px sans-serif";
                this.context.fillText(this.score.toString(), 10, 20);
            };

            Canvas2DRenderer.prototype.drawBoard = function () {
                if (this.board) {
                    var board = this.board.getPoints();
                    for (var i = 0, l = board.length; i < l; i++)
                        this.drawBlock(board[i], this.board.getColor());
                }
            };

            Canvas2DRenderer.prototype.drawPiece = function () {
                if (this.piece && this.piecePosition) {
                    var piece = this.piece.getPoints();
                    for (var i = 0, l = piece.length; i < l; i++)
                        this.drawBlock(piece[i].add(this.piecePosition), this.piece.getColor());
                }
            };
            return Canvas2DRenderer;
        })();
        renders.Canvas2DRenderer = Canvas2DRenderer;
    })(ttrs.renders || (ttrs.renders = {}));
    var renders = ttrs.renders;
})(ttrs || (ttrs = {}));

var ttrs;
(function (ttrs) {
    (function (controllers) {
        var ControllerEvent = (function () {
            function ControllerEvent(action) {
                this.action = action;
            }
            ControllerEvent.prototype.toString = function () {
                return "controller action " + this.action;
            };
            return ControllerEvent;
        })();
        controllers.ControllerEvent = ControllerEvent;

        var KeyboardController = (function () {
            function KeyboardController(eventSource, keyMap) {
                var _this = this;
                this.onAction = new ttrs.utils.EventDispatcher();
                this.keyMap = {
                    17: ttrs.game.GameAction.release,
                    32: ttrs.game.GameAction.pauseResume,
                    37: ttrs.game.GameAction.moveLeft,
                    38: ttrs.game.GameAction.rotateRight,
                    39: ttrs.game.GameAction.moveRight,
                    40: ttrs.game.GameAction.rotateLeft
                };
                this.keyMap = this.keyMap || keyMap;
                eventSource.addEventListener('keydown', function (e) {
                    console.log(e.keyCode);
                    var action = _this.keyMap[e.keyCode];
                    if (typeof action != 'undefined') {
                        _this.onAction.dispatch(new ControllerEvent(action));
                        return false;
                    }
                }, false);
            }
            return KeyboardController;
        })();
        controllers.KeyboardController = KeyboardController;
    })(ttrs.controllers || (ttrs.controllers = {}));
    var controllers = ttrs.controllers;
})(ttrs || (ttrs = {}));
//@ sourceMappingURL=app.js.map

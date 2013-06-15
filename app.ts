module ttrs.utils {
    //TODO perf refactor
    export function setIntersect(a: Point[], b: Point[]) {
        return a.filter(pa => b.some(pb => pb.equals(pa)));
    }

    //TODO perf refactor
    export function setUnion(a: Point[], b: Point[]) {
        var intersection = setIntersect(a, b);
        if (intersection.length == 0)
            return a.concat(b);

        return a.concat(b).filter(pu => intersection.some(pi => pi.equals(pu)));
    }

    export function move(points: Point[], vector: Point) {
        return points.map(p => p.add(vector));
    }

    export class Point implements ttrs.utils.IClonable {
        x: number;
        y: number;
        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        equals(other: Point) {
            return this.x == other.x && this.y == other.y;
        }

        clone() {
            return new Point(this.x, this.y);
        }

        add(other: Point) {
            return new utils.Point(this.x + other.x, this.y + other.y);
        }

        toString() {
            return '[' + this.x + ',' + this.y + ']';
        }
    }

    export class RGBColor {
        r: number;
        g: number;
        b: number;

        constructor(r: number, g: number, b: number) {
            this.r = r;
            this.g = g;
            this.b = b;
        }

        toString() {
            return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
        }
    }

    export interface IClonable {
        clone(): IClonable;
    }

    export class EventEmitter {
        private callbacks = {};

        on(event: string, callback: (any) => void ) {
            this.callbacks[event] = this.callbacks[event] || [];
            this.callbacks[event].push(callback);
        }

        off(event: string, callback) {
            this.callbacks[event] = this.callbacks[event].filter(function (c) {
                return callback !== c;
            });
        }

        emit(eventName: string, data: Event) {
            if (eventName != 'tick')
                console.log(data.toString());
            if (!this.callbacks[eventName])
                return;

            var callbacks = this.callbacks[eventName].slice(0);
            for (var i = 0, l = callbacks.length; i < l; i++)
                callbacks[i](data);
        }
    }

    export class EventDispatcher<T> {
        private handlers = [];

        public add(handler: (T) => void ) {
            this.handlers.push(handler);
        }

        public remove(handler: (T) => void ) {
            this.handlers = this.handlers.filter(function (h) {
                return h !== handler;
            });
        }

        public dispatch(event: T) {
            for (var i = 0, l = this.handlers.length; i < l; i++)
                if ( this.handlers[i] && typeof this.handlers[i] === 'function')
                    this.handlers[i](event);
        }
    }

    export function throttle(callback, skip) {
        var count = 0;
        return function () {
            count++;
            var callsToSkip = typeof skip == 'function' ? skip() : skip;
            if (count == callsToSkip) {
                count = 0;
                return callback()
            }
            return function () { } ();
        };
    }

    export class Clock {
        public onTick: EventDispatcher<TickEvent> = new EventDispatcher<TickEvent>();
        private time = 0;
        private delay: number = 100;
        private ticking = false;

        constructor(delay: number) {
            this.delay = delay;
        }

        start() {
            this.ticking = true;
            this.tick();
        }

        stop() {
            this.ticking = false;
        }

        isTicking() {
            return this.ticking;
        }

        private tick() {
            this.time++;
            this.onTick.dispatch(new TickEvent(this.time));

            if (this.ticking)
                setTimeout(() => { this.tick(); }, this.delay);
        }
    }

    export class TickEvent {
        time: number;

        constructor(time: number) {
            this.time = time;
        }

        toString() {
            return "clock tick " + this.time;
        }
    }
}

module ttrs.game {

    export function play(controller: controllers.IController): IGame {
        return new Game(controller);
    }
    
    export class ReleaseEvent {
        releasedAt: utils.Point;

        constructor(releasedAt: utils.Point) {
            this.releasedAt = releasedAt;
        }
    }

    export class GameStartedEvent {
        board: IPiece;
        piece: IPiece;
        piecePosition: utils.Point;

        constructor(board: IPiece, piece: IPiece, position: utils.Point) {
            this.board = board;
            this.piece = piece;
            this.piecePosition = position;
        }

        toString() {
            return 'game started';
        }
    }

    export class SpeedChangeEvent {
        oldSpeed: Number;
        newSpeed: Number;

        constructor(oldSpeed: Number, newSpeed: Number) {
            this.oldSpeed = oldSpeed;
            this.newSpeed = newSpeed;
        }
    }

    export class MoveEvent {
        direction: utils.Point;
        movedFrom: utils.Point;
        movedTo: utils.Point;

        constructor(movedFrom: utils.Point, direction: utils.Point, movedTo: utils.Point) {
            this.direction = direction;
            this.movedFrom = movedFrom;
            this.movedTo = movedTo;
        }

        toString() {
            return 'moved from ' + this.movedFrom + ' by ' + this.direction + ' to ' + this.movedTo;
        }
    }

    export class DropEvent {
        piece: IPiece;
        piecePosition: utils.Point;

        constructor(piece: IPiece, position: utils.Point) {
            this.piece = piece;
            this.piecePosition = position;
        }

        toString() {
            return 'dropped ' + this.piece;
        }
    }

    export class RotateEvent {
        piece: IPiece;
        direction: RotationDirection;

        constructor(piece: IPiece, direction: RotationDirection) {
            this.piece = piece;
            this.direction = direction;
        }

        toString() {
            return 'rotated ' + this.direction;
        }
    }

    export class FixEvent {
        piece: IPiece;
        position: utils.Point;
        board: IPiece;

        constructor(piece, position, board) {
            this.piece = piece;
            this.position = position;
            this.board = board;
        }

        toString() {
            return 'fixed ' + this.piece + ' at ' + this.position;
        }
    }

    export class GameOverEvent {
        score: number;

        constructor(score: number) {
            this.score = score;
        }

        toString() {
            return 'game over! score = ' + this.score;
        }
    }

    export class ScoreChangeEvent {
        score: number;

        constructor(score: number) {
            this.score = score;
        }

        toString() {
            return 'score changed ' + this.score;
        }
    }

    export class LineClearEvent {
        line: Number;
        board: IPiece;

        constructor(line: Number, board: IBoard) {
            this.line = line;
            this.board = board;
        }

        toString() {
            return 'line ' + this.line + ' cleared';
        }
    }

    export enum RotationDirection {
        left,
        right
    }

    export enum GameAction {
        moveLeft,
        moveRight,
        rotateLeft,
        rotateRight,
        release,
        pauseResume
    }

    class Piece implements IPiece {
        private rotations: utils.Point[][];
        private currentRotation: number = 0;
        private color: utils.RGBColor;

        constructor(rotations: utils.Point[][], color: utils.RGBColor) {
            this.rotations = rotations;
            this.color = color;
        }

        rotate(direction: RotationDirection) {
            var clone = this.clone();
            if (direction == RotationDirection.left)
                clone.currentRotation = (this.currentRotation == 0) ? this.rotations.length - 1 : this.currentRotation - 1;
            else
                clone.currentRotation = (this.currentRotation + 1) % this.rotations.length;

            return clone;
        }

        getPoints() {
            return this.rotations[this.currentRotation];
        }

        getWidth() {
            var width = 0;
            this.getPoints().forEach(p => { if ((p.x + 1) > width) width = p.x + 1 });
            return width;
        }

        getColor() {
            return this.color;
        }

        getHeight() {
            var height = 0;
            this.getPoints().forEach(p => { if ((p.y + 1) > height) height = p.y + 1 });
            return height;
        }

        clone() {
            var clone = new Piece(this.rotations, this.color);
            clone.currentRotation = this.currentRotation;
            return clone;
        }
    }

    class I extends Piece {
        constructor() {
            super([[new utils.Point(0, 0), new utils.Point(1, 0), new utils.Point(2, 0), new utils.Point(3, 0)], [new utils.Point(0, 0), new utils.Point(0, 1), new utils.Point(0, 2), new utils.Point(0, 3)]], new utils.RGBColor(0, 255, 255))
        }

        toString() {
            return "I";
        }
    }

    class L extends Piece {
        constructor() {
            super([[new utils.Point(0, 0), new utils.Point(0, 1), new utils.Point(0, 2), new utils.Point(1, 2)], [new utils.Point(0, 0), new utils.Point(1, 0), new utils.Point(2, 0), new utils.Point(0, 1)], [new utils.Point(0, 0), new utils.Point(1, 0), new utils.Point(1, 1), new utils.Point(1, 2)], [new utils.Point(0, 1), new utils.Point(1, 1), new utils.Point(2, 1), new utils.Point(2, 0)]], new utils.RGBColor(255, 127, 0))
        }
        toString() {
            return "L";
        }
    }

    class S extends Piece {
        constructor() {
            super([[new utils.Point(0, 1), new utils.Point(1, 1), new utils.Point(1, 0), new utils.Point(2, 0)], [new utils.Point(0, 0), new utils.Point(0, 1), new utils.Point(1, 1), new utils.Point(1, 2)]], new utils.RGBColor(0, 255, 0))
        }
        toString() {
            return "S";
        }
    }

    class Z extends Piece {
        constructor() {
            super([[new utils.Point(0, 0), new utils.Point(1, 0), new utils.Point(1, 1), new utils.Point(2, 1)], [new utils.Point(1, 0), new utils.Point(1, 1), new utils.Point(0, 1), new utils.Point(0, 2)]], new utils.RGBColor(255, 0, 0))
        }
        toString() {
            return "Z";
        }
    }

    class O extends Piece {
        constructor() {
            super([[new utils.Point(0, 0), new utils.Point(1, 0), new utils.Point(0, 1), new utils.Point(1, 1)]], new utils.RGBColor(255, 255, 0))
        }
        toString() {
            return "O";
        }
    }

    class T extends Piece {
        constructor() {
            super([[new utils.Point(0, 1), new utils.Point(1, 1), new utils.Point(2, 1), new utils.Point(1, 0)], [new utils.Point(0, 0), new utils.Point(0, 1), new utils.Point(0, 2), new utils.Point(1, 1)], [new utils.Point(0, 0), new utils.Point(1, 0), new utils.Point(2, 0), new utils.Point(1, 1)], [new utils.Point(0, 1), new utils.Point(1, 0), new utils.Point(1, 1), new utils.Point(1, 2)]], new utils.RGBColor(127, 0, 255))
        }
        toString() {
            return "T";
        }
    }

    class J extends Piece {
        constructor() {
            super([[new utils.Point(0, 0), new utils.Point(1, 0), new utils.Point(2, 0), new utils.Point(2, 1)], [new utils.Point(0, 2), new utils.Point(1, 0), new utils.Point(1, 1), new utils.Point(1, 2)], [new utils.Point(0, 0), new utils.Point(0, 1), new utils.Point(1, 1), new utils.Point(2, 1)], [new utils.Point(0, 0), new utils.Point(0, 1), new utils.Point(0, 2), new utils.Point(1, 0)]], new utils.RGBColor(0, 0, 255))
        }
        toString() {
            return "J";
        }
    }

    var randomPiece = function () {
        var pieces: Piece[] = [new I, new L, new S, new Z, new O, new T, new J];
        return pieces[Math.floor(Math.random() * (pieces.length))];
    }

    export interface IPiece extends ttrs.utils.IClonable {
        getPoints(): utils.Point[];
        getWidth(): number;
        getHeight(): number;
        getColor(): utils.RGBColor;
    }

    export interface IBoard extends IPiece {
        fix(piece: IPiece, atPosition: utils.Point): IBoard;
        getFilledLines(): Number[];
        clearLine(line: Number): IBoard;
        isFilled(): bool;
    }

    class Board implements IBoard {
        private width: number;
        private height: number;
        private points: utils.Point[];
        private color: utils.RGBColor = new utils.RGBColor(255, 255, 255);

        constructor(width: number, height: number) {
            this.width = width; this.height = height;
            this.points = [];
        }

        fix(piece: Piece, atPosition: utils.Point) {
            var result = this.clone();
            result.points = utils.setUnion(result.points, utils.move(piece.getPoints(), atPosition));
            return result;
        }

        overlapsWith(piece: Piece, atPosition: utils.Point) {
            return utils.setIntersect(this.clone().points, utils.move(piece.getPoints(), atPosition)).length > 0;
        }

        getPoints() {
            return this.points;
        }

        getWidth() {
            return this.width;
        }

        getHeight() {
            return this.height;
        }

        getColor() {
            return this.color;
        }

        getFilledLines() {
            var filledLines = new Array<Number>();

            for (var line = 0; line < this.height; line++)
                if (this.points.filter(p => p.y == line).length == this.width) //?
                    filledLines.push(line);

            return filledLines;
        }

        clearLine(line: Number) {
            var clone = this.clone();
            clone.points = this.points.filter(p => p.y != line).map(p => {
                if (p.y > line)
                    return p.clone();

                return p.add(new utils.Point(0, 1));
            });

            return clone;
        }

        isFilled() {
            return this.points.some(p => p.y == 0);
        }

        clone() {
            var b = new Board(this.width, this.height);
            b.points = this.points.map(p => p.clone());
            return b;
        }
    }

    export interface IGame {
        onDrop: utils.EventDispatcher<DropEvent>;
        onFix: utils.EventDispatcher<FixEvent>;
        onSpeedChange: utils.EventDispatcher<SpeedChangeEvent>;
        onMoved: utils.EventDispatcher<MoveEvent>;
        onRotate: utils.EventDispatcher<RotateEvent>;
        onScoreChange: utils.EventDispatcher<ScoreChangeEvent>;
        onGameOver: utils.EventDispatcher<GameOverEvent>;
        onLineClear: utils.EventDispatcher<LineClearEvent>;
        onGameStart: utils.EventDispatcher<GameStartedEvent>;
        onRelease: utils.EventDispatcher<ReleaseEvent>;
    }

    class Game implements IGame {
        public onDrop: utils.EventDispatcher<DropEvent> = new utils.EventDispatcher<DropEvent>();
        public onFix: utils.EventDispatcher<FixEvent> = new utils.EventDispatcher<FixEvent>();
        public onSpeedChange: utils.EventDispatcher<SpeedChangeEvent> = new utils.EventDispatcher<SpeedChangeEvent>();
        public onMoved: utils.EventDispatcher<MoveEvent> = new utils.EventDispatcher<MoveEvent>();
        public onRotate: utils.EventDispatcher<RotateEvent> = new utils.EventDispatcher<RotateEvent>();
        public onScoreChange: utils.EventDispatcher<ScoreChangeEvent> = new utils.EventDispatcher<ScoreChangeEvent>();
        public onGameOver: utils.EventDispatcher<GameOverEvent> = new utils.EventDispatcher<GameOverEvent>();
        public onLineClear: utils.EventDispatcher<LineClearEvent> = new utils.EventDispatcher<LineClearEvent>();
        public onGameStart: utils.EventDispatcher<GameStartedEvent> = new utils.EventDispatcher<GameStartedEvent>();
        public onRelease: utils.EventDispatcher<ReleaseEvent> = new utils.EventDispatcher<ReleaseEvent>();

        private score: number = 0;

        private speed: number = 1;
        private maxSpeed: number = 20;
        private acceleration: number = 2000;
        private clock: utils.Clock = new utils.Clock(40);

        private piece: Piece = randomPiece();
        private nextPiece: Piece = randomPiece();
        private piecePosition: utils.Point = new utils.Point(0, 0);
        private board: Board = new Board(10, 20);


        constructor(controller: controllers.IController) {
            controller.onAction.add(event => {
                this.onAction(event.action);
            });
        }

        private onAction(action: GameAction) {
            var mapping = {}
            mapping[GameAction.moveLeft] = () => this.tryMove(new utils.Point(-1, 0));
            mapping[GameAction.moveRight] = () => this.tryMove(new utils.Point(1, 0));
            mapping[GameAction.rotateLeft] = () => this.tryRotate(RotationDirection.left);
            mapping[GameAction.rotateRight] = () => this.tryRotate(RotationDirection.right);
            mapping[GameAction.release] = () => this.release();

            var handler = mapping[action];
            if (handler)
                handler();
        }

        private release() {
            var fall = () => this.tryMove(new utils.Point(0, 1));
            this.clock.onTick.add(fall);
            this.onFix.add(event => this.clock.onTick.remove(fall));

            this.onRelease.dispatch(new ReleaseEvent(this.piecePosition))
        }

        private pauseResume() {
            if (this.clock.isTicking())
                this.clock.stop();
            else
                this.clock.start();
        }

        private drop() {
            this.piece = this.nextPiece;
            this.nextPiece = randomPiece();
            this.piecePosition = new utils.Point(Math.floor(Math.random() * (this.board.getWidth() - this.piece.getWidth())), -1 * this.piece.getHeight());
            this.onDrop.dispatch(new DropEvent(this.piece, this.piecePosition));
        }

        private fix() {
            this.board = this.board.fix(this.piece, this.piecePosition);
            this.onFix.dispatch(new FixEvent(this.piece, this.piecePosition, this.board));
        }

        private tick() {

            var bonus = 0;
            this.board.getFilledLines().forEach(l => {
                this.board = this.board.clearLine(l);
                this.onLineClear.dispatch(new LineClearEvent(l, this.board));
                this.score += (Math.pow(2, bonus++));
                this.onScoreChange.dispatch(new ScoreChangeEvent(this.score));
            });

            if (this.board.isFilled()) {
                this.clock.stop();
                this.onGameOver.dispatch(new GameOverEvent(this.score));
                return;
            }

            this.tryMove(new utils.Point(0, 1));
        }

        private tryMove(direction: utils.Point) {
            var nextPiecePosition = this.piecePosition.add(direction);

            if (nextPiecePosition.x < 0 || nextPiecePosition.x > (this.board.getWidth() - this.piece.getWidth()))
                return;

            if (this.board.overlapsWith(this.piece, nextPiecePosition) || this.piecePosition.y + this.piece.getHeight() == this.board.getHeight()) {
                this.fix();
                this.drop();
            }
            else {
                var previuosPiecePosition = this.piecePosition;
                this.piecePosition = nextPiecePosition;
                this.onMoved.dispatch(new MoveEvent(previuosPiecePosition, direction, this.piecePosition));
            }
        }

        private tryRotate(direction: RotationDirection) {
            var rotatedPiece = this.piece.rotate(direction);

            if (this.piecePosition.x < 0 || this.piecePosition.x > (this.board.getWidth() - rotatedPiece.getWidth()) || this.piecePosition.y < 0 || this.piecePosition.y > this.board.getWidth() - rotatedPiece.getHeight())
                return;

            if (this.board.overlapsWith(rotatedPiece, this.piecePosition))
                return;

            this.piece = rotatedPiece;
            this.onRotate.dispatch(new RotateEvent(this.piece, direction));
        }

        private increaseSpeed() {
            var previousSpeed = this.speed;
            this.speed = this.speed++ % this.maxSpeed;
            this.onSpeedChange.dispatch(new SpeedChangeEvent(previousSpeed, this.speed));
        }

        start() {
            this.clock.onTick.add(ttrs.utils.throttle(event => this.tick(), () => { return this.maxSpeed - this.speed; }));
            this.clock.onTick.add(ttrs.utils.throttle(this.increaseSpeed, this.acceleration));

            this.clock.start();
            this.onGameStart.dispatch(new GameStartedEvent(this.board, this.piece, this.piecePosition));
            this.drop();
        }
    }
}

module ttrs.renders {
    export interface IRenderer {
        onRendered: utils.EventDispatcher<RenderEvent>;
    }

    export class RenderEvent {
        elapsed: Number;

        constructor(elapsed: Number) {
            this.elapsed = elapsed;
        }

        toString() {
            return 'rendered in ' + this.elapsed + 'ms';
        }
    }

    export class Canvas2DRenderer implements IRenderer {
        onRendered: utils.EventDispatcher<RenderEvent> = new utils.EventDispatcher<RenderEvent>();
        context: CanvasRenderingContext2D;
        board: game.IPiece;
        piece: game.IPiece;
        piecePosition: utils.Point;
        score: Number = 0;

        backgound = new utils.RGBColor(0, 0, 0);

        constructor(context: CanvasRenderingContext2D, game: game.IGame) {
            this.context = context;

            game.onDrop.add(event => {
                this.piece = event.piece;
                this.piecePosition = event.piecePosition;
                this.drawEverything();
            });

            game.onFix.add(event => {
                this.board = event.board;
                this.drawEverything();
            });

            game.onLineClear.add(event => {
                this.board = event.board;
                this.drawEverything();
            });

            game.onMoved.add(event => {
                this.piecePosition = event.movedTo;
                this.drawEverything();
            });

            game.onRotate.add(event => {
                this.piece = event.piece;
                this.drawEverything();
            });

            game.onGameStart.add(event => {
                this.piece = event.piece;
                this.board = event.board;
                this.piecePosition = event.piecePosition;
            });

            game.onScoreChange.add(event => {
                this.score = event.score;
            });
        }

        getWidth() {
            return this.context.canvas.width;
        }

        getHeight() {
            return this.context.canvas.height;
        }

        getBlockWidth() {
            return this.board ? this.getWidth() / this.board.getWidth() : this.getWidth() / 10;
        }

        getBlockHeight() {
            return this.board ? this.getHeight() / this.board.getHeight() : this.getHeight() / 20;
        }

        drawBlock(position: utils.Point, color: utils.RGBColor) {
            this.context.fillStyle = color.toString();
            this.context.fillRect(
                position.x * this.getBlockWidth() + this.getBlockWidth() * 0.05,
                position.y * this.getBlockHeight() + this.getBlockHeight() * 0.05,
                this.getBlockWidth() * 0.9,
                this.getBlockHeight() * 0.9
                );
        }

        eraseEverything() {
            this.context.fillStyle = this.backgound.toString();
            this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        }

        drawEverything() {

            var start = new Date().getMilliseconds();

            this.eraseEverything();
            this.drawBoard();
            this.drawPiece();
            this.drawScore();

            var end = new Date().getMilliseconds();

            this.onRendered.dispatch(new RenderEvent(end - start));
        }

        drawScore() {
            this.context.fillStyle = 'rgb(255,255,255)';
            this.context.font = "18px sans-serif";
            this.context.fillText(this.score.toString(), 10, 20);
        }

        drawBoard() {
            if (this.board) {
                var board = this.board.getPoints();
                for (var i = 0, l = board.length; i < l; i++)
                    this.drawBlock(board[i], this.board.getColor());
            }
        }

        drawPiece() {
            if (this.piece && this.piecePosition) {
                var piece = this.piece.getPoints();
                for (var i = 0, l = piece.length; i < l; i++)
                    this.drawBlock(piece[i].add(this.piecePosition), this.piece.getColor());
            }
        }
    }
}

module ttrs.controllers {
    export interface IController {
        onAction: utils.EventDispatcher<ControllerEvent>;
    }

    export class ControllerEvent {
        action: game.GameAction;

        constructor(action: game.GameAction) {
            this.action = action;
        }

        toString() {
            return "controller action " + this.action;
        }
    }

    export class KeyboardController implements IController {
        onAction: utils.EventDispatcher<ControllerEvent> = new utils.EventDispatcher<ControllerEvent>();

        keyMap = {
            17: game.GameAction.release,
            32: game.GameAction.pauseResume,
            37: game.GameAction.moveLeft,
            38: game.GameAction.rotateRight,
            39: game.GameAction.moveRight,
            40: game.GameAction.rotateLeft
        }

        constructor(eventSource: HTMLElement, keyMap) {
            this.keyMap = this.keyMap || keyMap;
            eventSource.addEventListener('keydown', (e: KeyboardEvent) => {
                console.log(e.keyCode);
                var action = this.keyMap[e.keyCode];
                if (typeof action != 'undefined') {
                    this.onAction.dispatch(new ControllerEvent(action));
                    return false;
                }
            }, false);
        }
    }
}

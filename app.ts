module ttrs.utils {
    export interface IClonable {
        clone(): IClonable;
    }

    export class EventEmitter {
        callbacks = {};

        on(event: string, callback: (Event) => void ) {
            this.callbacks[event] = this.callbacks[event] || [];
            this.callbacks[event].push(callback);
        }

        off(event: string, callback) {
            this.callbacks[event] = this.callbacks[event].filter(function (c) {
                return callback !== c;
            });
        }

        emit(eventName: string, data: Event) {
            if (eventName != 'tick' )
                console.log(data.toString());
            if (!this.callbacks[eventName])
                return;

            var callbacks = this.callbacks[eventName].slice(0);            
            for (var i = 0, l = callbacks.length; i < l; i++)
                callbacks[i](data);
        }
    }

    export interface Event {
        toString(): string;
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
}

module ttrs{

    export function play( controller: IController): IGame {
        return new Game(controller);
    }

    export class RenderEvent implements ttrs.utils.Event {
        elapsed: Number;
        constructor(elapsed: Number) {
            this.elapsed = elapsed;
        }
        toString() {
            return 'rendered in ' + this.elapsed + 'ms';
        }
    }
    module ttrs.utils {
        export interface IClonable {
            clone(): IClonable;
        }

        export class EventEmitter {
            callbacks = {};

            on(event: string, callback: (Event) => void ) {
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

        export interface Event {
            toString(): string;
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
                return function() { } ();
            };
        }
    }
    
    export class ReleaseEvent implements ttrs.utils.Event{
        releasedAt: Point;
        constructor(releasedAt: Point) {
            this.releasedAt = releasedAt;
        }
    }

    export class GameStartedEvent implements ttrs.utils.Event{
        board: IFigure;
        figure: IFigure;
        figurePosition: Point;
        constructor(board: IFigure, figure: IFigure, position: Point) {
            this.board = board;
            this.figure = figure;
            this.figurePosition = position;
        }
        toString() {
            return 'game started';
        }
    }

    export class ControllerEvent implements ttrs.utils.Event{
        action: GameAction;
        constructor(action: GameAction) {
            this.action = action;
        }
        toString() {
            return "controller action " + this.action;
        }
    }

    export class SpeedChangeEvent implements ttrs.utils.Event{
        oldSpeed: Number;
        newSpeed: Number;
        constructor(oldSpeed: Number, newSpeed: Number) {
            this.oldSpeed = oldSpeed;
            this.newSpeed = newSpeed;
        }
    }

    class TickEvent implements ttrs.utils.Event{
        time: number;
        constructor(time: number) {
            this.time = time;
        }
        toString() {
            return "clock tick " + this.time;
        }
    }

    export class MoveEvent implements ttrs.utils.Event{
        direction: Point;
        movedFrom: Point;
        movedTo: Point;
        constructor(movedFrom: Point, direction: Point, movedTo: Point) {
            this.direction = direction;
            this.movedFrom = movedFrom;
            this.movedTo = movedTo;
        }
        toString() {
            return 'moved from ' + this.movedFrom + ' by ' + this.direction + ' to ' + this.movedTo;
        }
    }

    export class DropEvent implements ttrs.utils.Event{
        figure: IFigure;
        figurePosition: Point;
        constructor(figure: IFigure, position: Point) {
            this.figure = figure;
            this.figurePosition = position;
        }
        toString() {
            return 'dropped ' + this.figure;
        }
    }

    export class RotateEvent implements ttrs.utils.Event{
        figure: IFigure;
        direction: RotationDirection;
        constructor(figure: IFigure, direction: RotationDirection) {
            this.figure = figure;
            this.direction = direction;
        }
        toString() {
            return 'rotated ' + this.direction;
        }
    }

    export class FixEvent implements ttrs.utils.Event{
        figure: IFigure;
        position: Point;
        board: IFigure;
        constructor(figure: IFigure, position: Point, board: IFigure) {
            this.figure = figure;
            this.position = position;
            this.board = board;
        }
        
        toString() {
            return 'fixed ' + this.figure + ' at ' + this.position;
        }
    }

    export class GameOverEvent implements ttrs.utils.Event{
        score: number;
        constructor(score: number) {
            this.score = score;
        }
        toString() {
            return 'game over! score = ' + this.score;
        }
    }

    export class ScoreChangeEvent implements ttrs.utils.Event {
        score: number;
        constructor(score: number) {
            this.score = score;
        }
        toString() {
            return 'score changed ' + this.score;
        }
    }

    export class LineClearEvent implements ttrs.utils.Event{
        line: Number;
        board: IFigure;
        constructor(line: Number, board: IBoard) {
            this.line = line;
            this.board = board;
        }
        toString() {
            return 'line ' + this.line + ' cleared';
        }
    }
    
    class Clock extends ttrs.utils.EventEmitter{
        private time: number = 0;
        private delay: number = 100;
        private ticking: Boolean = false;
        constructor(delay: number) {
            super();
            this.delay = delay;
        }

        start() {
            this.ticking = true;
            this.tick();
        }

        stop() {
            this.ticking = false;
        }

        onTick(callback: (TickEvent) => void ) {
            this.on('tick', callback);
        }

        isTicking() {
            return this.ticking;
        }

        private tick() {
            this.time++;
            this.emit('tick', new TickEvent(this.time));

            if ( this.ticking )
                setTimeout(() => {
                    this.tick();
                }, this.delay);
        }
    }

    export enum RotationDirection{
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

    //TODO perf refactor
    var setIntersect = function (a: Point[], b: Point[]) {
        return a.filter(pa => b.some(pb => pb.equals(pa)));
    }

    //TODO perf refactor
    var setUnion = function (a: Point[], b: Point[]) {
        var intersection = setIntersect(a, b);
        if (intersection.length == 0)
            return a.concat(b);

        return a.concat(b).filter(pu => intersection.some(pi => pi.equals(pu)));
    }

    var move = function (points: Point[], vector: Point) {
        return points.map(p => p.add(vector));
    }

    export class Point implements ttrs.utils.IClonable{
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
            return new Point(this.x + other.x, this.y + other.y);
        }
        toString() {
            return '[' + this.x + ',' + this.y + ']';
        }
    }

    export class RGBColor{
        r: number;
        g: number;
        b: number;
        constructor(r: number, g: number, b: number) {
            this.r = r;
            this.g = g;
            this.b = b;
        }
        toString() {
            return 'rgb('+ this.r +','+ this.g +','+ this.b +')';
        }
    }

    class Figure implements IFigure {
        private rotations: Point[][];
        private currentRotation: number = 0;
        private color: RGBColor;
        constructor(rotations: Point[][], color: RGBColor) {
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
            return this; //TODO fix
        }
    }

    class I extends Figure {
        constructor() {
            super([[new Point(0, 0), new Point(1, 0), new Point(2, 0), new Point(3, 0)], [new Point(0, 0), new Point(0, 1), new Point(0, 2), new Point(0, 3)]], new RGBColor(0,255,255))
        }

        toString() {
            return "I";
        }
    }
    class L extends Figure {
        constructor() {
            super([[new Point(0, 0), new Point(0, 1), new Point(0, 2), new Point(1, 2)], [new Point(0, 0), new Point(1, 0), new Point(2, 0), new Point(0, 1)], [new Point(0, 0), new Point(1, 0), new Point(1, 1), new Point(1, 2)], [new Point(0, 1), new Point(1, 1), new Point(2, 1), new Point(2, 0)]], new RGBColor(255,127,0))
        }
        toString() {
            return "L";
        }
    }

    class S extends Figure {
        constructor() {
            super([[new Point(0, 1), new Point(1, 1), new Point(1, 0), new Point(2, 0)], [new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(1, 2)]], new RGBColor(0, 255, 0))
        }
        toString() {
            return "S";
        }
    }

    class Z extends Figure {
        constructor() {
            super([[new Point(0, 0), new Point(1, 0), new Point(1, 1), new Point(2, 1)], [new Point(1, 0), new Point(1, 1), new Point(0, 1), new Point(0, 2)]], new RGBColor(255, 0, 0))
        }
        toString() {
            return "Z";
        }
    }

    class O extends Figure {
        constructor() {
            super([[new Point(0, 0), new Point(1, 0), new Point(0, 1), new Point(1, 1)]], new RGBColor(255, 255, 0))
        }
        toString() {
            return "O";
        }
    }

    class T extends Figure {
        constructor() {
            super([[new Point(0, 1), new Point(1, 1), new Point(2, 1), new Point(1, 0)], [new Point(0, 0), new Point(0, 1), new Point(0, 2), new Point(1, 1)], [new Point(0, 0), new Point(1, 0), new Point(2, 0), new Point(1, 1)], [new Point(0, 1), new Point(1, 0), new Point(1, 1), new Point(1, 2)]], new RGBColor(127, 0, 255))
        }
        toString() {
            return "T";
        }
    }

    class J extends Figure {
        constructor() {
            super([[new Point(0, 0), new Point(1, 0), new Point(2, 0), new Point(2, 1)], [new Point(0, 2), new Point(1, 0), new Point(1, 1), new Point(1, 2)], [new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(2, 1)], [new Point(0, 0), new Point(0, 1), new Point(0, 2), new Point(1, 0)]], new RGBColor(0, 0, 255))
        }
        toString() {
            return "J";
        }
    }

    var randomFigure = function () {
        var figures: Figure[] = [new I, new L, new S, new Z, new O, new T, new J];
        return figures[Math.floor(Math.random() * (figures.length))];
    }

    export interface IFigure extends ttrs.utils.IClonable {
        getPoints(): Point[];
        getWidth(): number;
        getHeight(): number;
        getColor(): RGBColor;
    }

    export interface IBoard extends IFigure {
        fix(figure: IFigure, atPosition: Point): IBoard;
        getFilledLines(): Number[];
        clearLine(line: Number): IBoard;
        isFilled(): bool;
    }

    class Board extends ttrs.utils.EventEmitter implements IBoard {
        private width: number;
        private height: number;
        private points: Point[];
        private color: RGBColor = new RGBColor(255, 255, 255);

        constructor(width: number, height: number) {
            super();
            this.width = width; this.height = height;
            this.points = new Point[];
        }
        fix(figure: Figure, atPosition: Point) {
            var result = this.clone();
            result.points = setUnion(result.points, move(figure.getPoints(), atPosition));
            return result;
        }
        overlapsWith(figure: Figure, atPosition: Point) {
            return setIntersect(this.clone().points, move(figure.getPoints(), atPosition)).length > 0;
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
            var filledLines = new Number[];

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
                
                return p.add(new Point(0, 1));
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

    export interface IController{
        onAction(callback: (ControllerEvent) => void ): void;
    }

    class Controller extends ttrs.utils.EventEmitter implements IController{
        onAction(callback: (ControllerEvent) => void ) {
            this.on('Controller', callback);
        }
    }

    export interface IRenderer{
        onRendered(callback);
    }

    export interface IGame {
        onDrop(callback: (DropEvent) => void);
        onFix(callback: (FixEvent) => void );
        onSpeedChange(callback: (SpeedChangeEvent) => void );
        onMoved(callback: (MoveEvent) => void );
        onRotate(callback: (RotateEvent) => void );
        onScoreChange(callback: (ScoreEvent) => void );
        onGameOver(callback: (GameOverEvent) => void );
        onLineClear(callback: (LineClearEvent) => void );
        onGameStart(callbal: (GameStartedEvent) => void );
    }

    class Game extends ttrs.utils.EventEmitter implements IGame {
        private score: number = 0;

        private speed: number = 1;
        private maxSpeed: number = 20;
        private acceleration: number = 2000;
        private clock: Clock = new Clock(40);

        private figure: Figure = randomFigure();
        private nextFigure: Figure = randomFigure();
        private figurePosition: Point = new Point(0,0);
        private board: Board = new Board(10, 20);


        constructor(controller: IController) {
            super();
            controller.onAction(event => {
                this.onAction(event.action);
            });
        }

        private onAction(action: GameAction) {
            var mapping = {}
            mapping[GameAction.moveLeft] = () => this.tryMove(new Point(-1, 0));
            mapping[GameAction.moveRight] = () => this.tryMove(new Point(1, 0));
            mapping[GameAction.rotateLeft] = () => this.tryRotate(RotationDirection.left);
            mapping[GameAction.rotateRight] = () => this.tryRotate(RotationDirection.right);
            mapping[GameAction.release] = () => this.release();

            var handler = mapping[action];
            if (handler)
                handler();
        }

        private release() {
            var fall = () => this.tryMove(new Point(0, 1));
            this.clock.onTick(fall);
            this.onFix(event => this.clock.off('tick', fall));

            this.emit('release', new ReleaseEvent(this.figurePosition))
        }
        
        private pauseResume() {
            if (this.clock.isTicking())
                this.clock.stop();
            else
                this.clock.start();
        }

        private drop() {
            this.figure = this.nextFigure;
            this.nextFigure = randomFigure();
            this.figurePosition = new Point(Math.floor(Math.random() * (this.board.getWidth() - this.figure.getWidth())), -1 * this.figure.getHeight());
            this.emit('drop', new DropEvent(this.figure, this.figurePosition));
        }

        private fix() {
            this.board = this.board.fix(this.figure, this.figurePosition);
            this.emit('fix', new FixEvent(this.figure, this.figurePosition, this.board));
        }

        private tick() {

            var bonus = 0;
            this.board.getFilledLines().forEach(l => {
                this.board = this.board.clearLine(l);
                this.emit('lineClear', new LineClearEvent(l, this.board));
                this.score += (Math.pow(2, bonus++));
                this.emit('scoreChange', new ScoreChangeEvent(this.score));
            });

            if (this.board.isFilled()) {
                this.clock.stop();
                this.emit('gameOver', new GameOverEvent(this.score));
                return;
            }

            this.tryMove(new Point(0, 1));
        }

        private tryMove(direction: Point) {
            var nextFigurePosition = this.figurePosition.add(direction);

            if (nextFigurePosition.x < 0 || nextFigurePosition.x > (this.board.getWidth() - this.figure.getWidth()))
                return;

            if (this.board.overlapsWith(this.figure, nextFigurePosition) || this.figurePosition.y + this.figure.getHeight() == this.board.getHeight() ) {
                this.fix();
                this.drop();
            }
            else {
                var previuosFigurePosition = this.figurePosition;
                this.figurePosition = nextFigurePosition;
                this.emit('move', new MoveEvent(previuosFigurePosition, direction, this.figurePosition));
            }
        }

        private tryRotate(direction: RotationDirection) {
            var rotatedFigure = this.figure.rotate(direction);

            if (this.figurePosition.x < 0 || this.figurePosition.x > (this.board.getWidth() - rotatedFigure.getWidth()) || this.figurePosition.y < 0 || this.figurePosition.y > this.board.getWidth() - rotatedFigure.getHeight())
                return;

            if (this.board.overlapsWith(rotatedFigure, this.figurePosition))
                return;

            this.figure = rotatedFigure;
            this.emit('rotate', new RotateEvent(this.figure, direction));
        }

        private increaseSpeed() {
            
            var previousSpeed = this.speed;
            this.speed = this.speed++ % this.maxSpeed;
            this.emit('speedChange', new SpeedChangeEvent(previousSpeed, this.speed));
        }

        start() {
            this.clock.onTick(ttrs.utils.throttle(event => this.tick(), () => { return this.maxSpeed - this.speed; }));
            this.clock.onTick(ttrs.utils.throttle(this.increaseSpeed, this.acceleration));

            this.clock.start();
            this.emit('start', new GameStartedEvent(this.board, this.figure, this.figurePosition));
            this.drop();
        }

        onDrop(callback: (event:DropEvent) => void ) {
            this.on('drop', callback);
        }
        onFix(callback: (event:FixEvent) => void ) {
            this.on('fix', callback);
        }
        onSpeedChange(callback: (event: SpeedChangeEvent) => void ) {
            this.on('speedChange', callback);
        }
        onMoved(callback: (event: MoveEvent) => void ) {
            this.on('move', callback);
        }
        onRotate(callback: (event: RotateEvent) => void ) {
            this.on('rotate', callback);
        }
        onScoreChange(callback: (event: ScoreChangeEvent) => void ) {
            this.on('scoreChange', callback);
        }
        onGameOver(callback: (event: GameOverEvent) => void ) {
            this.on('gameOver', callback);
        }
        onLineClear(callback: (event: LineClearEvent) => void ) {
            this.on('lineClear', callback);
        }
        onGameStart(callback: (event: GameStartedEvent) => void ) {
            this.on('start', callback);
        }
    }
}

module ttrs.renders{
    export class Canvas2DRenderer implements IRenderer extends ttrs.utils.EventEmitter {

        context: CanvasRenderingContext2D;
        board: IFigure;
        figure: IFigure;
        figurePosition: Point;
        score: Number = 0;

        backgound = new RGBColor(0,0,0);

        constructor(context: CanvasRenderingContext2D, game: IGame) {
            super();
            this.context = context;

            game.onDrop( event => {
                this.figure = event.figure;
                this.figurePosition = event.figurePosition;
                this.drawEverything();
            });

            game.onFix( event => {
                this.board = event.board;
                this.drawEverything();
            });
            game.onLineClear( event => {
                this.board = event.board;
                this.drawEverything();
            });
            game.onMoved( event => {
                this.figurePosition = event.movedTo;
                this.drawEverything();
            });
            game.onRotate( event => {
                this.figure = event.figure;
                this.drawEverything();
            });
            game.onGameStart(event => {
                this.figure = event.figure;
                this.board = event.board;
                this.figurePosition = event.figurePosition;
            });
            game.onScoreChange(event => {
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

        drawBlock(position: Point, color:RGBColor) {
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
            this.context.fillRect(0,0, this.context.canvas.width, this.context.canvas.height);
        }

        drawEverything() {

            var start = new Date().getMilliseconds();

            this.eraseEverything();
            this.drawBoard();
            this.drawFigure();
            this.drawScore();

            var end = new Date().getMilliseconds();
            
            this.emit('rendered', new RenderEvent(end - start));
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

        drawFigure() {
            if (this.figure && this.figurePosition) {
                var figure = this.figure.getPoints();
                for (var i = 0, l = figure.length; i < l; i++)
                    this.drawBlock(figure[i].add(this.figurePosition), this.figure.getColor());
            }
        }

        onRendered(callback: any) {
            this.on('rendered', callback);
        }
    }
}

module ttrs.controllers{
    export class KeyboardController extends ttrs.utils.EventEmitter implements IController {
        keyMap = {
            17: GameAction.release,
            32: GameAction.pauseResume,
            37: GameAction.moveLeft,
            38: GameAction.rotateRight,
            39: GameAction.moveRight,
            40: GameAction.rotateLeft
        }

        constructor(eventSource: HTMLElement, keyMap) {
            super();
            this.keyMap = this.keyMap || keyMap;
            eventSource.addEventListener('keydown', (e:KeyboardEvent) => {
                console.log(e.keyCode);
                var action = this.keyMap[e.keyCode];
                if (typeof action != 'undefined') {
                    this.emit('action', new ControllerEvent(action));
                    return false;
                }
            }, false);
        }

        onAction(callback: (ControllerEvent) => void ) {
            this.on('action', callback);
        }
    }
}
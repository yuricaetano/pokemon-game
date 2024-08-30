import Circle from '/src/geometries/Circle.js';
import { loadImage } from "/src/js/loaderAssets.js";

export default class Pikachu extends Circle {
    constructor(x, y, velocity = 10, width, height, FRAMES = 60) {
        super(x, y, 0);
        loadImage('public/assets/imgs/pikachu.png').then(img => this.img = img);
        
        this.cellWidth = 64; 
        this.cellHeight = 64;
        this.cellX = 0;
        this.cellY = 0;
        
        this.totalSprites = 4; 
        this.spriteSpeed = 1;
        this.setSprites();
        this.controlSprite(FRAMES);

        this.width = width;
        this.height = height;
        this.size = this.width / 2;

        this.speed = velocity;
        this.status = 'down';
        
        this.showHit = false;
        this.setHit();

        this.setControlsKeys();
    }

    controlSprite(FRAMES) {
        setInterval(() => {
            this.cellX = this.cellX < this.totalSprites - 1 ? this.cellX + 1 : 0;
        }, 1000 / (FRAMES * this.spriteSpeed / 10));
    }

    draw(CTX) {
        if(!this.img){
            return;
        }
        this.cellY = this.sprites[this.status];

        CTX.drawImage(
            this.img,
            this.cellX * this.cellWidth,
            this.cellY,
            this.cellWidth,
            this.cellHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );

        if (this.showHit) {
            this.hit.draw(CTX);
        }
    }

    setHit() {
        this.hit = new Circle(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.size * 0.4,
			5,
            "rgba(0,0,255,0)" 
        );
    }

    setSprites() {
        this.sprites = {
            'down': 0,
            'up': this.cellHeight * 3,
            'left': this.cellHeight * 1,
            'right': this.cellHeight * 2
        };
    }

    setControlsKeys() {
        this.controls = {
            "s": "down",
            "w": "up",
            "a": "left",
            "d": "right"
        };

        this.activeKey = null;

        window.addEventListener('keydown', (e) => {
            if (this.controls[e.key]) {
                this.activeKey = e.key;
                this.status = this.controls[e.key];
            }
        });

        window.addEventListener('keyup', (e) => {
            if (this.controls[e.key]) {
                if (e.key === this.activeKey) {
                    this.activeKey = null;
                }
            }
        });
    }

    move(limits) {
        if (this.activeKey) {
            this.setMovements();

            let newX = this.movements[this.status]?.x;
            let newY = this.movements[this.status]?.y;
            
            // Atualiza a posição com base nos novos valores
            this.x = newX !== undefined ? newX : this.x;
            this.y = newY !== undefined ? newY : this.y;

            // Restringir o Pikachu dentro dos limites do canvas
            this.x = Math.max(0, Math.min(this.x, limits.width - this.width));
            this.y = Math.max(0, Math.min(this.y, limits.height - this.height));

            this.limits(limits);
            this.update();
        }
    }

    setMovements() {
        this.movements = {
            'down': { y: this.y + this.speed },
            'up': { y: this.y - this.speed },
            'left': { x: this.x - this.speed },
            'right': { x: this.x + this.speed }
        };
    }

    update() {
        this.hit.x = this.x + this.width / 2;
        this.hit.y = this.y + this.height / 2;
    }

    colide(other) {
        return this.hit.colide(other.hitbox);
    }
}

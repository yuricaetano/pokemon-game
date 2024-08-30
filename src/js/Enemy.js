import { loadImage } from '/src/js/loaderAssets.js';
import Circle from '/src/geometries/Circle.js';

export default class Enemy {
    constructor(x, y, width, height, speed = 10, spritePath) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.spritePath = spritePath;
        this.img = null;
        this.hasPassed = false; 
        this.hasPlayedPassSound = false;

        this.hitbox = new Circle(x + width / 2, y + height / 2, Math.max(width, height) / 2, 1, 'rgba(0, 0, 255, 0.0)');

        loadImage(spritePath).then(img => {
            this.img = img;
        }).catch(error => {
            console.error('Erro ao carregar a imagem:', error);
        });
    }

    draw(CTX) {
        if (this.img) {
            CTX.drawImage(this.img, this.x, this.y, this.width, this.height);
        } else {
            CTX.fillStyle = 'red';
            CTX.fillRect(this.x, this.y, this.width, this.height);
        }
        this.hitbox.draw(CTX);
    }

    move(limits) {
        this.y += this.speed;
        this.checkIfPassed(limits);
        this.limits(limits);
        this.updateHitbox();
    }

    checkIfPassed(limits) {
        if (this.y > limits.height) {
            if (!this.hasPassed) {
                this.hasPassed = true;
                this.hasPlayedPassSound = false; 
            }
        } else {
            this.hasPassed = false;
        }
    }

    limits(limits) {
        const margin = 200;
        if (this.y - this.height > limits.height) {
            this.y = -this.height;
            this.x = Math.random() * (limits.width - 2 * margin) + margin;
        }
    }

    updateHitbox() {
        this.hitbox.x = this.x + this.width / 2;
        this.hitbox.y = this.y + this.height / 2;
    }

    collide(other) {
        return this.hitbox.collide(other.hit);
    }
}

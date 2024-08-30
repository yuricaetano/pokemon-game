import { loadImage } from '/src/js/loaderAssets.js';
import Circle from '/src/geometries/Circle.js';

export default class Thunder {
    constructor(x, y, width, height, spritePath) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.spritePath = spritePath;
        this.img = null;

        this.hitbox = new Circle(x + width / 2, y + height / 2, Math.max(width, height) / 2, 1, 'rgba(255, 255, 0, 0)');

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
            CTX.fillStyle = 'rgba(255, 255, 0, 0)';
            CTX.fillRect(this.x, this.y, this.width, this.height);
        }
        this.hitbox.draw(CTX);
    }

    collide(other) {
        return this.hitbox.collide(other.hit);
    }
}

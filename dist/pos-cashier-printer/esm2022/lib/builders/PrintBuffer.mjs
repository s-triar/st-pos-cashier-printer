// Hat-tip to Håvard Lian @ https://github.com/haavardlian/escpos
export class PrintBuffer {
    constructor(size = 1024) {
        this.buffer = new Uint8Array(size);
        this.size = 0;
    }
    clear() {
        this.size = 0;
    }
    flush() {
        const buffer = new Uint8Array(this.buffer.slice(0, this.size));
        this.size = 0;
        return buffer;
    }
    write(data) {
        this.resize(data.length);
        this.buffer.set(data, this.size);
        this.size += data.length;
        return this;
    }
    writeUInt8(value) {
        this.resize(1);
        this.buffer[this.size++] = value & 0xFF;
        return this;
    }
    resize(need) {
        const remaining = this.buffer.length - this.size;
        if (remaining < need) {
            const oldBuffer = this.buffer;
            const factor = Math.ceil((need - remaining) / oldBuffer.length) + 1;
            this.buffer = new Uint8Array(oldBuffer.length * factor);
            this.buffer.set(oldBuffer, 0);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJpbnRCdWZmZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9wb3MtY2FzaGllci1wcmludGVyL3NyYy9saWIvYnVpbGRlcnMvUHJpbnRCdWZmZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsaUVBQWlFO0FBQ2pFLE1BQU0sT0FBTyxXQUFXO0lBSXBCLFlBQVksT0FBZSxJQUFJO1FBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7SUFDbEIsQ0FBQztJQUVELEtBQUs7UUFDRCxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNsQixDQUFDO0lBRUQsS0FBSztRQUNELE1BQU0sTUFBTSxHQUFHLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMvRCxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNkLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBdUI7UUFDekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDekIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUdELFVBQVUsQ0FBQyxLQUFhO1FBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDeEMsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVPLE1BQU0sQ0FBQyxJQUFZO1FBQ3ZCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDakQsSUFBSSxTQUFTLEdBQUcsSUFBSSxFQUFFO1lBQ2xCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDOUIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3BFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxVQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQztZQUN4RCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDakM7SUFDTCxDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBIYXQtdGlwIHRvIEjDpXZhcmQgTGlhbiBAIGh0dHBzOi8vZ2l0aHViLmNvbS9oYWF2YXJkbGlhbi9lc2Nwb3NcclxuZXhwb3J0IGNsYXNzIFByaW50QnVmZmVyIHtcclxuICAgIHByaXZhdGUgYnVmZmVyOiBVaW50OEFycmF5O1xyXG4gICAgcHJpdmF0ZSBzaXplOiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2l6ZTogbnVtYmVyID0gMTAyNCkge1xyXG4gICAgICAgIHRoaXMuYnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoc2l6ZSk7XHJcbiAgICAgICAgdGhpcy5zaXplID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhcigpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnNpemUgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGZsdXNoKCk6IFVpbnQ4QXJyYXkge1xyXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KHRoaXMuYnVmZmVyLnNsaWNlKDAsIHRoaXMuc2l6ZSkpO1xyXG4gICAgICAgIHRoaXMuc2l6ZSA9IDA7XHJcbiAgICAgICAgcmV0dXJuIGJ1ZmZlcjtcclxuICAgIH1cclxuXHJcbiAgICB3cml0ZShkYXRhOiBBcnJheUxpa2U8bnVtYmVyPik6IFByaW50QnVmZmVyIHtcclxuICAgICAgICB0aGlzLnJlc2l6ZShkYXRhLmxlbmd0aCk7XHJcbiAgICAgICAgdGhpcy5idWZmZXIuc2V0KGRhdGEsIHRoaXMuc2l6ZSk7XHJcbiAgICAgICAgdGhpcy5zaXplICs9IGRhdGEubGVuZ3RoO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB3cml0ZVVJbnQ4KHZhbHVlOiBudW1iZXIpOiBQcmludEJ1ZmZlciB7XHJcbiAgICAgICAgdGhpcy5yZXNpemUoMSk7XHJcbiAgICAgICAgdGhpcy5idWZmZXJbdGhpcy5zaXplKytdID0gdmFsdWUgJiAweEZGO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVzaXplKG5lZWQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHJlbWFpbmluZyA9IHRoaXMuYnVmZmVyLmxlbmd0aCAtIHRoaXMuc2l6ZTtcclxuICAgICAgICBpZiAocmVtYWluaW5nIDwgbmVlZCkge1xyXG4gICAgICAgICAgICBjb25zdCBvbGRCdWZmZXIgPSB0aGlzLmJ1ZmZlcjtcclxuICAgICAgICAgICAgY29uc3QgZmFjdG9yID0gTWF0aC5jZWlsKChuZWVkIC0gcmVtYWluaW5nKSAvIG9sZEJ1ZmZlci5sZW5ndGgpICsgMTtcclxuICAgICAgICAgICAgdGhpcy5idWZmZXIgPSBuZXcgVWludDhBcnJheShvbGRCdWZmZXIubGVuZ3RoICogZmFjdG9yKTtcclxuICAgICAgICAgICAgdGhpcy5idWZmZXIuc2V0KG9sZEJ1ZmZlciwgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19
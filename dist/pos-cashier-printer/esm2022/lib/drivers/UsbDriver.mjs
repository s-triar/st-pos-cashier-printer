/// <reference types="w3c-web-usb" />
import { BehaviorSubject, Observable } from 'rxjs';
import { PrintDriver } from "./PrintDriver";
export class UsbDriver extends PrintDriver {
    constructor(vendorId, productId) {
        super();
        this.isConnected = new BehaviorSubject(false);
        this.vendorId = vendorId;
        this.productId = productId;
    }
    connect() {
        navigator.usb.getDevices().then((devices) => {
            this.device = devices.find((device) => {
                return device.vendorId === this.vendorId && device.productId === this.productId;
            });
            console.log(this.device);
            return this.device.open();
        })
            .then(() => {
            let result = this.device.selectConfiguration(1);
            return result;
        })
            .then(() => {
            let result = this.device.claimInterface(0);
            return result;
        }).then((result) => {
            const endPoints = this.device.configuration?.interfaces[0].alternate.endpoints;
            this.endPoint = endPoints.find((endPoint) => endPoint.direction === 'out');
            this.isConnected.next(true);
            this.listenForUsbConnections();
        }).catch((result) => {
            this.isConnected.next(false);
        });
    }
    /**
     * Request a USB device through the browser
     * return Observable<USBDevice>
     */
    requestUsb() {
        return new Observable(observer => {
            navigator.usb.requestDevice({ filters: [] })
                .then((result) => {
                this.vendorId = result.vendorId;
                this.productId = result.productId;
                return observer.next(result);
            }).catch((error) => {
                return observer.error(error);
            });
        });
    }
    async write(data) {
        this.device.transferOut(this.endPoint.endpointNumber, data);
    }
    listenForUsbConnections() {
        navigator.usb.addEventListener('disconnect', () => {
            this.isConnected.next(false);
        });
        navigator.usb.addEventListener('connect', () => {
            this.isConnected.next(true);
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNiRHJpdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvcG9zLWNhc2hpZXItcHJpbnRlci9zcmMvbGliL2RyaXZlcnMvVXNiRHJpdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHFDQUFxQztBQUNyQyxPQUFPLEVBQUUsZUFBZSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNuRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSTVDLE1BQU0sT0FBTyxTQUFVLFNBQVEsV0FBVztJQU90QyxZQUFZLFFBQWlCLEVBQUUsU0FBa0I7UUFDN0MsS0FBSyxFQUFFLENBQUM7UUFITCxnQkFBVyxHQUE2QixJQUFJLGVBQWUsQ0FBVSxLQUFLLENBQUMsQ0FBQztRQUkvRSxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUMvQixDQUFDO0lBRU0sT0FBTztRQUNWLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBb0IsRUFBRSxFQUFFO1lBQ3JELElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQWlCLEVBQUUsRUFBRTtnQkFDN0MsT0FBTyxNQUFNLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLFNBQVMsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ3BGLENBQUMsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDekIsT0FBTyxJQUFJLENBQUMsTUFBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQy9CLENBQUMsQ0FBQzthQUNHLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDUCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pELE9BQU8sTUFBTSxDQUFDO1FBQ2xCLENBQUMsQ0FBQzthQUNELElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDUCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QyxPQUFPLE1BQU0sQ0FBQztRQUNsQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFZLEVBQUUsRUFBRTtZQUNyQixNQUFNLFNBQVMsR0FBOEIsSUFBSSxDQUFDLE1BQU8sQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUM7WUFDM0csSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBYSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsU0FBUyxLQUFLLEtBQUssQ0FBQyxDQUFDO1lBQ2pGLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBRSxDQUFDLE1BQVcsRUFBRSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUdEOzs7T0FHRztJQUNJLFVBQVU7UUFDYixPQUFPLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQzdCLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDO2lCQUN2QyxJQUFJLENBQUMsQ0FBQyxNQUFpQixFQUFFLEVBQUU7Z0JBQ3hCLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztnQkFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO2dCQUNsQyxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDakMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBVSxFQUFFLEVBQUU7Z0JBQ3BCLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNqQyxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBZ0I7UUFDL0IsSUFBSSxDQUFDLE1BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVMsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVPLHVCQUF1QjtRQUMzQixTQUFTLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7WUFDOUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDaEMsQ0FBQyxDQUFDLENBQUM7UUFDSCxTQUFTLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7WUFDM0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInczYy13ZWItdXNiXCIgLz5cclxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IFByaW50RHJpdmVyIH0gZnJvbSBcIi4vUHJpbnREcml2ZXJcIjtcclxuXHJcbmRlY2xhcmUgdmFyIG5hdmlnYXRvcjogYW55O1xyXG5cclxuZXhwb3J0IGNsYXNzIFVzYkRyaXZlciBleHRlbmRzIFByaW50RHJpdmVyIHtcclxuICAgIHByaXZhdGUgZGV2aWNlOiBVU0JEZXZpY2UgfCB1bmRlZmluZWQ7XHJcbiAgICBwcml2YXRlIGVuZFBvaW50OiBVU0JFbmRwb2ludCB8IHVuZGVmaW5lZDtcclxuICAgIHByaXZhdGUgdmVuZG9ySWQ6IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgIHByaXZhdGUgcHJvZHVjdElkOiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBwdWJsaWMgaXNDb25uZWN0ZWQ6IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHZlbmRvcklkPzogbnVtYmVyLCBwcm9kdWN0SWQ/OiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMudmVuZG9ySWQgPSB2ZW5kb3JJZDtcclxuICAgICAgICB0aGlzLnByb2R1Y3RJZCA9IHByb2R1Y3RJZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29ubmVjdCgpIHtcclxuICAgICAgICBuYXZpZ2F0b3IudXNiLmdldERldmljZXMoKS50aGVuKChkZXZpY2VzOiBVU0JEZXZpY2VbXSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmRldmljZSA9IGRldmljZXMuZmluZCgoZGV2aWNlOiBVU0JEZXZpY2UpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkZXZpY2UudmVuZG9ySWQgPT09IHRoaXMudmVuZG9ySWQgJiYgZGV2aWNlLnByb2R1Y3RJZCA9PT0gdGhpcy5wcm9kdWN0SWQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmRldmljZSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRldmljZSEub3BlbigpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSB0aGlzLmRldmljZSEuc2VsZWN0Q29uZmlndXJhdGlvbigxKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSB0aGlzLmRldmljZSEuY2xhaW1JbnRlcmZhY2UoMCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB9KS50aGVuKChyZXN1bHQ6IHZvaWQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVuZFBvaW50czogVVNCRW5kcG9pbnRbXSB8IHVuZGVmaW5lZCA9IHRoaXMuZGV2aWNlIS5jb25maWd1cmF0aW9uPy5pbnRlcmZhY2VzWzBdLmFsdGVybmF0ZS5lbmRwb2ludHM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuZFBvaW50ID0gZW5kUG9pbnRzIS5maW5kKChlbmRQb2ludDogYW55KSA9PiBlbmRQb2ludC5kaXJlY3Rpb24gPT09ICdvdXQnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNDb25uZWN0ZWQubmV4dCh0cnVlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGlzdGVuRm9yVXNiQ29ubmVjdGlvbnMoKTtcclxuICAgICAgICAgICAgfSkuY2F0Y2goIChyZXN1bHQ6dm9pZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc0Nvbm5lY3RlZC5uZXh0KGZhbHNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVxdWVzdCBhIFVTQiBkZXZpY2UgdGhyb3VnaCB0aGUgYnJvd3NlclxyXG4gICAgICogcmV0dXJuIE9ic2VydmFibGU8VVNCRGV2aWNlPlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVxdWVzdFVzYigpOiBPYnNlcnZhYmxlPFVTQkRldmljZT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XHJcbiAgICAgICAgICAgIG5hdmlnYXRvci51c2IucmVxdWVzdERldmljZSh7IGZpbHRlcnM6IFtdIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0OiBVU0JEZXZpY2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZlbmRvcklkID0gcmVzdWx0LnZlbmRvcklkO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZHVjdElkID0gcmVzdWx0LnByb2R1Y3RJZDtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JzZXJ2ZXIubmV4dChyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycm9yOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JzZXJ2ZXIuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIHdyaXRlKGRhdGE6IFVpbnQ4QXJyYXkpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICB0aGlzLmRldmljZSEudHJhbnNmZXJPdXQodGhpcy5lbmRQb2ludCEuZW5kcG9pbnROdW1iZXIsIGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbGlzdGVuRm9yVXNiQ29ubmVjdGlvbnMoKTogdm9pZCB7XHJcbiAgICAgICAgbmF2aWdhdG9yLnVzYi5hZGRFdmVudExpc3RlbmVyKCdkaXNjb25uZWN0JywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmlzQ29ubmVjdGVkLm5leHQoZmFsc2UpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbmF2aWdhdG9yLnVzYi5hZGRFdmVudExpc3RlbmVyKCdjb25uZWN0JywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmlzQ29ubmVjdGVkLm5leHQodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iXX0=
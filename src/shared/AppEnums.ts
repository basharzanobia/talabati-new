import { OrderStatusType } from './service-proxies/service-proxies';


export class AppOrderStatusType {
    static Pending: number = OrderStatusType._1;
    static InTransit: number = OrderStatusType._2;
    static Failed: number = OrderStatusType._3;
    static Delivered: number = OrderStatusType._4;
    static Returned: number = OrderStatusType._5;
    static Temp: number = OrderStatusType._6;
    static getName(val: OrderStatusType) {
        switch (val) {
            case OrderStatusType._1:
                return 'بالانتظار';
            case OrderStatusType._2:
                return 'في النقل';
            case OrderStatusType._3:
                return 'فشل';
            case OrderStatusType._4:
                return 'تم التسليم';
            case OrderStatusType._5:
                return 'تم الإعادة';
            case OrderStatusType._6:
                return 'مؤقت';
            default:
                return '';
        }
    };
}


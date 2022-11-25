import { OrderStatusType } from './service-proxies/service-proxies';


export class AppOrderStatusType {
    static Pending: number = OrderStatusType.Pending;
    static InTransit: number = OrderStatusType.InTransit;
    static Failed: number = OrderStatusType.Failed;
    static Delivered: number = OrderStatusType.Delivered;
    static Returned: number = OrderStatusType.Returned;
    static Temp: number = OrderStatusType.Temp;
    static getName(val: OrderStatusType) {
        switch (val) {
            case OrderStatusType.Pending:
                return 'بالانتظار';
            case OrderStatusType.InTransit:
                return 'في النقل';
            case OrderStatusType.Failed:
                return 'فشل';
            case OrderStatusType.Delivered:
                return 'تم التسليم';
            case OrderStatusType.Returned:
                return 'تم الإعادة';
            case OrderStatusType.Temp:
                return 'مؤقت';
            default:
                return '';
        }
    };
}


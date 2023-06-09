import { OrderStatusType } from './service-proxies/service-proxies';
import { PaymentModeType } from './service-proxies/service-proxies';
export class AppPaymentModeType {
    static getName(val: PaymentModeType) {
        switch (val) {
            case PaymentModeType.COD:
                return 'دفع عند الاستلام';
            case PaymentModeType.Online:
                return 'دفع عبر البطاقة';
            case PaymentModeType.EWallet:
                return 'دفع عبر المحفظة';
            default:
               return '';
        }
    }
}
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
                case OrderStatusType.TransmittedToVendor:
                    return 'بالانتظار';
                    case OrderStatusType.AcceptedByVendor:
                        return 'بالانتظار';
                        case OrderStatusType.InProcess:
                            return 'يتم التحضير';
                case OrderStatusType.TransmittedToDriver:
                    return 'في النقل';
                    case OrderStatusType.AcceptedByDriver:
                        return 'في النقل';
                        case OrderStatusType.RejectedByDriver:
                            return 'في النقل';
                            case OrderStatusType.ReTransmittedToDriver:
                                return 'في النقل';
                                case OrderStatusType.WaitingForDriver:
                                    return 'في النقل';
                                    case OrderStatusType.HandeledToDriver:
                                        return 'في النقل';
            case OrderStatusType.InTransit:
                return 'في النقل';
            case OrderStatusType.Failed:
                return 'فشل';
                case OrderStatusType.UnDelivered:
                    return 'لم يتم التسليم';
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


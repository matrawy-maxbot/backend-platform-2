import { PermissionFLAGS } from "./flags.js";

class Permissions {

    constructor(permissionNumber = 0) {
        this.permissions = permissionNumber;
    }

    // ✅ تحويل الإدخال (رقم أو اسم) إلى قيمة صحيحة
    static resolvePermissions(input) {
        if (!Array.isArray(input)) input = [input]; // تأكد إنه مصفوفة
        return input
            .map(perm => (typeof perm === "number" ? perm : PermissionFLAGS[perm] || 0))
            .reduce((acc, perm) => acc | perm, 0);
    }

    // ✅ التحقق إذا عنده **كل** الأذونات المطلوبة
    has(...permissions) {
        const checkPerms = Permissions.resolvePermissions(permissions.flat());
        return (this.permissions & checkPerms) === checkPerms;
    }

    // ✅ التحقق إذا عنده **أي** إذن من المجموعة
    any(...permissions) {
        const checkPerms = Permissions.resolvePermissions(permissions.flat());
        return (this.permissions & checkPerms) !== 0;
    }

    // ✅ تعيين الأذونات الجديدة بدل القديمة
    set(...permissions) {
        this.permissions = Permissions.resolvePermissions(permissions.flat());
        return this;
    }

    // ✅ إضافة أذونات متعددة
    add(...permissions) {
        this.permissions |= Permissions.resolvePermissions(permissions.flat());
        return this;
    }

    // ✅ حذف أذونات متعددة
    remove(...permissions) {
        this.permissions &= ~Permissions.resolvePermissions(permissions.flat());
        return this;
    }

    // ✅ إرجاع كل الأذونات في مصفوفة مفهومة
    getPermissionsList() {
        return Object.keys(PermissionFLAGS).filter(
            perm => (this.permissions & PermissionFLAGS[perm]) === PermissionFLAGS[perm]
        );
    }

    // ✅ تحويل مصفوفة أذونات إلى رقم واحد
    static fromArray(permissionsArray) {
        return Permissions.resolvePermissions(permissionsArray);
    }

    // ✅ طباعة الأذونات الحالية (للمساعدة في الديبج)
    toString() {
        return `Permissions: ${this.permissions} (${this.getPermissionsList().join(", ")})`;
    }
}

export default Permissions;

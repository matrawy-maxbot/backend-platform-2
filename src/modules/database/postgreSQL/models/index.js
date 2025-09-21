import sequelize from '../config/db.config.js';
import User from './User.model.js';
import Vendor from './Vendor.model.js';
import VendorSiteSetting from './VendorSiteSetting.model.js';
import Category from './Category.model.js';
import Product from './Product.model.js';
import ProductVariant from './ProductVariant.model.js';
import Inventory from './Inventory.model.js';
import Address from './Address.model.js';
import Coupon from './Coupon.model.js';
import Order from './Order.model.js';
import OrderItem from './OrderItem.model.js';
import Payment from './Payment.model.js';
import Role from './Role.model.js';
import StaffUser from './StaffUser.model.js';
import PermissionCategory from './PermissionCategory.model.js';
import Permission from './Permission.model.js';
import SubscriptionPlan from './SubscriptionPlan.model.js';
import VendorSubscription from './VendorSubscription.model.js';
import VendorPayment from './VendorPayment.model.js';
import Admins from './Admins.model.js';

// تعريف العلاقات بين الـ Models

// علاقات User مع Vendor
User.hasMany(Vendor, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Vendor.belongsTo(User, {
  foreignKey: 'user_id'
});

Vendor.belongsTo(User, {
  foreignKey: 'approved_by',
  as: 'ApprovedBy'
});

// العلاقة بين Vendor و VendorSiteSettings (One-to-One)
Vendor.hasOne(VendorSiteSetting, {
  foreignKey: 'vendor_id',
  onDelete: 'CASCADE'
});

VendorSiteSetting.belongsTo(Vendor, {
  foreignKey: 'vendor_id'
});

// العلاقة بين Product و ProductVariant (One-to-Many)
Product.hasMany(ProductVariant, {
  foreignKey: 'product_id',
  onDelete: 'CASCADE'
});

ProductVariant.belongsTo(Product, {
  foreignKey: 'product_id'
});

// العلاقات الجديدة المطلوبة

// العلاقة بين VendorSiteSetting والجداول الجديدة
VendorSiteSetting.hasMany(Category, {
  foreignKey: 'site_id',
  onDelete: 'CASCADE'
});
Category.belongsTo(VendorSiteSetting, {
  foreignKey: 'site_id'
});

VendorSiteSetting.hasMany(Product, {
  foreignKey: 'site_id',
  onDelete: 'CASCADE'
});
Product.belongsTo(VendorSiteSetting, {
  foreignKey: 'site_id'
});

VendorSiteSetting.hasMany(ProductVariant, {
  foreignKey: 'site_id',
  onDelete: 'CASCADE'
});
ProductVariant.belongsTo(VendorSiteSetting, {
  foreignKey: 'site_id'
});

VendorSiteSetting.hasMany(Inventory, {
  foreignKey: 'site_id',
  onDelete: 'CASCADE'
});
Inventory.belongsTo(VendorSiteSetting, {
  foreignKey: 'site_id'
});

// العلاقة بين Vendor و Product
Vendor.hasMany(Product, {
  foreignKey: 'vendor_id',
  onDelete: 'CASCADE'
});
Product.belongsTo(Vendor, {
  foreignKey: 'vendor_id'
});

// العلاقة بين Category و Product
Category.hasMany(Product, {
  foreignKey: 'category_id',
  onDelete: 'SET NULL'
});
Product.belongsTo(Category, {
  foreignKey: 'category_id'
});

// العلاقة بين Category ونفسها (التصنيفات الفرعية)
Category.hasMany(Category, {
  foreignKey: 'parent_id',
  as: 'subcategories',
  onDelete: 'CASCADE'
});
Category.belongsTo(Category, {
  foreignKey: 'parent_id',
  as: 'parent'
});

// العلاقة بين ProductVariant و Inventory (One-to-One)
ProductVariant.hasOne(Inventory, {
  foreignKey: 'product_variant_id',
  onDelete: 'CASCADE'
});
Inventory.belongsTo(ProductVariant, {
  foreignKey: 'product_variant_id'
});

// العلاقة بين User و Address (One-to-Many)
User.hasMany(Address, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});
Address.belongsTo(User, {
  foreignKey: 'user_id'
});

// العلاقة بين VendorSiteSetting و Address (One-to-Many)
VendorSiteSetting.hasMany(Address, {
  foreignKey: 'site_id',
  onDelete: 'CASCADE'
});
Address.belongsTo(VendorSiteSetting, {
  foreignKey: 'site_id'
});

// العلاقة بين VendorSiteSetting و Coupon (One-to-Many)
VendorSiteSetting.hasMany(Coupon, {
  foreignKey: 'site_id',
  onDelete: 'CASCADE'
});
Coupon.belongsTo(VendorSiteSetting, {
  foreignKey: 'site_id'
});

// العلاقة بين User و Order (One-to-Many)
User.hasMany(Order, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});
Order.belongsTo(User, {
  foreignKey: 'user_id'
});

// العلاقة بين VendorSiteSetting و Order (One-to-Many)
VendorSiteSetting.hasMany(Order, {
  foreignKey: 'site_id',
  onDelete: 'CASCADE'
});
Order.belongsTo(VendorSiteSetting, {
  foreignKey: 'site_id'
});

// العلاقة بين Address و Order (One-to-Many) - عنوان الشحن
Address.hasMany(Order, {
  foreignKey: 'shipping_address_id',
  as: 'ShippingOrders',
  onDelete: 'SET NULL'
});
Order.belongsTo(Address, {
  foreignKey: 'shipping_address_id',
  as: 'ShippingAddress'
});

// العلاقة بين Address و Order (One-to-Many) - عنوان الفوترة
Address.hasMany(Order, {
  foreignKey: 'billing_address_id',
  as: 'BillingOrders',
  onDelete: 'SET NULL'
});
Order.belongsTo(Address, {
  foreignKey: 'billing_address_id',
  as: 'BillingAddress'
});

// العلاقة بين Coupon و Order (One-to-Many)
Coupon.hasMany(Order, {
  foreignKey: 'coupon_id',
  onDelete: 'SET NULL'
});
Order.belongsTo(Coupon, {
  foreignKey: 'coupon_id'
});

// العلاقة بين Order و Payment (One-to-Many)
Order.hasMany(Payment, {
  foreignKey: 'order_id',
  onDelete: 'CASCADE'
});
Payment.belongsTo(Order, {
  foreignKey: 'order_id'
});

// العلاقة بين VendorSiteSetting و Payment (One-to-Many)
VendorSiteSetting.hasMany(Payment, {
  foreignKey: 'site_id',
  onDelete: 'CASCADE'
});
Payment.belongsTo(VendorSiteSetting, {
  foreignKey: 'site_id'
});

// العلاقة بين Order و OrderItem (One-to-Many)
Order.hasMany(OrderItem, {
  foreignKey: 'order_id',
  onDelete: 'CASCADE'
});
OrderItem.belongsTo(Order, {
  foreignKey: 'order_id'
});

// العلاقة بين VendorSiteSetting و OrderItem (One-to-Many)
VendorSiteSetting.hasMany(OrderItem, {
  foreignKey: 'site_id',
  onDelete: 'CASCADE'
});
OrderItem.belongsTo(VendorSiteSetting, {
  foreignKey: 'site_id'
});

// العلاقة بين Product و OrderItem (One-to-Many)
Product.hasMany(OrderItem, {
  foreignKey: 'product_id',
  onDelete: 'CASCADE'
});
OrderItem.belongsTo(Product, {
  foreignKey: 'product_id'
});

// العلاقة بين ProductVariant و OrderItem (One-to-Many)
ProductVariant.hasMany(OrderItem, {
  foreignKey: 'product_variant_id',
  onDelete: 'SET NULL'
});
OrderItem.belongsTo(ProductVariant, {
  foreignKey: 'product_variant_id'
});

// العلاقات الخاصة بـ Role و StaffUser

// العلاقة بين VendorSiteSetting و Role (One-to-Many)
VendorSiteSetting.hasMany(Role, {
  foreignKey: 'site_id',
  onDelete: 'CASCADE'
});
Role.belongsTo(VendorSiteSetting, {
  foreignKey: 'site_id'
});

// العلاقة بين VendorSiteSetting و StaffUser (One-to-Many)
VendorSiteSetting.hasMany(StaffUser, {
  foreignKey: 'site_id',
  onDelete: 'CASCADE'
});
StaffUser.belongsTo(VendorSiteSetting, {
  foreignKey: 'site_id'
});

// العلاقة بين Role و StaffUser (One-to-Many)
Role.hasMany(StaffUser, {
  foreignKey: 'role_id',
  onDelete: 'SET NULL'
});
StaffUser.belongsTo(Role, {
  foreignKey: 'role_id'
});

// العلاقة بين User و StaffUser (One-to-Many)
User.hasMany(StaffUser, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});
StaffUser.belongsTo(User, {
  foreignKey: 'user_id'
});

// العلاقات الخاصة بـ PermissionCategory و Permission

// العلاقة بين VendorSiteSetting و PermissionCategory (One-to-Many)
VendorSiteSetting.hasMany(PermissionCategory, {
  foreignKey: 'site_id',
  onDelete: 'CASCADE'
});
PermissionCategory.belongsTo(VendorSiteSetting, {
  foreignKey: 'site_id'
});

// العلاقة بين VendorSiteSetting و Permission (One-to-Many)
VendorSiteSetting.hasMany(Permission, {
  foreignKey: 'site_id',
  onDelete: 'CASCADE'
});
Permission.belongsTo(VendorSiteSetting, {
  foreignKey: 'site_id'
});

// العلاقة بين PermissionCategory و Permission (One-to-Many)
PermissionCategory.hasMany(Permission, {
  foreignKey: 'category_id',
  onDelete: 'SET NULL'
});
Permission.belongsTo(PermissionCategory, {
  foreignKey: 'category_id'
});

// العلاقات الخاصة بنماذج الاشتراكات - Subscription Models Relationships

// العلاقة بين SubscriptionPlan و VendorSubscription (One-to-Many)
SubscriptionPlan.hasMany(VendorSubscription, {
  foreignKey: 'plan_id',
  onDelete: 'CASCADE'
});
VendorSubscription.belongsTo(SubscriptionPlan, {
  foreignKey: 'plan_id'
});

// العلاقة بين Vendor و VendorSubscription (One-to-Many)
Vendor.hasMany(VendorSubscription, {
  foreignKey: 'vendor_id',
  onDelete: 'CASCADE'
});
VendorSubscription.belongsTo(Vendor, {
  foreignKey: 'vendor_id'
});

// العلاقة بين VendorSiteSetting و VendorSubscription (One-to-Many)
VendorSiteSetting.hasMany(VendorSubscription, {
  foreignKey: 'site_id',
  onDelete: 'CASCADE'
});
VendorSubscription.belongsTo(VendorSiteSetting, {
  foreignKey: 'site_id'
});

// العلاقة بين VendorSubscription و VendorPayment (One-to-Many)
VendorSubscription.hasMany(VendorPayment, {
  foreignKey: 'subscription_id',
  onDelete: 'CASCADE'
});
VendorPayment.belongsTo(VendorSubscription, {
  foreignKey: 'subscription_id'
});

// العلاقة بين Vendor و VendorPayment (One-to-Many)
Vendor.hasMany(VendorPayment, {
  foreignKey: 'vendor_id',
  onDelete: 'CASCADE'
});
VendorPayment.belongsTo(Vendor, {
  foreignKey: 'vendor_id'
});

// العلاقة بين VendorSiteSetting و VendorPayment (One-to-Many)
VendorSiteSetting.hasMany(VendorPayment, {
  foreignKey: 'site_id',
  onDelete: 'CASCADE'
});
VendorPayment.belongsTo(VendorSiteSetting, {
  foreignKey: 'site_id'
});

sequelize.sync().then(() => {
  console.log('All models were synchronized successfully.');
});

export { 
  User,
  Vendor,
  VendorSiteSetting,
  Category,
  Product,
  ProductVariant,
  Inventory,
  Address,
  Coupon,
  Order,
  OrderItem,
  Payment,
  Role,
  StaffUser,
  PermissionCategory,
  Permission,
  SubscriptionPlan,
  VendorSubscription,
  VendorPayment,
  Admins
};
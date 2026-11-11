# ربط متجر زد بحساب TikTok الإعلاني: Pixel وCAPI والكتالوج

- **المتجر (زد):** Store ID `3147067`
- **الحساب الإعلاني (TikTok):** Advertiser ID `7695311789071826996`

> ملاحظة: الربط يجب أن يتم من داخل لوحتي زد وTikTok بحساب صاحب المتجر/مدير الحساب الإعلاني.
> أسماء القوائم قد تختلف قليلاً حسب تحديثات المنصتين.

---

## 1) ترتيب العمل

1. التأكد من أن الحساب الإعلاني داخل **TikTok Business Center** وأنك Admin عليه.
2. تثبيت تطبيق **TikTok** من متجر تطبيقات زد (الطريقة الرسمية). هذه الطريقة تربط Pixel وEvents API (CAPI) والكتالوج دفعة واحدة.
3. التحقق من الأحداث في **Events Manager**.
4. إنشاء الكتالوج ومجموعات المنتجات (Product Sets) حسب تصنيفات المتجر.
5. ربط الكتالوج بالحملات (Video Shopping Ads / Catalog Ads).

---

## 2) الربط الرسمي من زد (Pixel + CAPI + Catalog)

1. ادخل لوحة زد ← **التطبيقات / سوق التطبيقات** ← ابحث عن **TikTok** ← **تثبيت**.
2. اضغط **ربط الحساب (Connect)** وسجّل الدخول بحساب TikTok For Business المرتبط بالـ Business Center.
3. في خطوات الإعداد اختر:
   - **Business Center:** الخاص بك.
   - **Ad Account:** `7695311789071826996`.
   - **Pixel:** أنشئ Pixel جديداً أو اختر الموجود.
   - **Data sharing level:** اختر **Maximum** (يفعّل Pixel + Events API معاً = CAPI).
   - **Catalog:** أنشئ كتالوجاً جديداً واختر **مزامنة المنتجات تلقائياً**.
4. اقبل الشروط واحفظ. سيظهر في التطبيق: Pixel متصل ✅، Events API متصل ✅، Catalog متزامن ✅.

> مهم: لا تضف كود Pixel يدوياً في "إعدادات التتبع" بزد **بالإضافة** إلى التطبيق، لأن ذلك يكرر الأحداث.
> استخدم طريقة واحدة فقط.

### البديل اليدوي (إذا لم يتوفر التطبيق)
1. TikTok Ads Manager ← **Tools ← Events ← Web Events ← Set up Web Events**.
2. اختر **Manual setup** ← **Pixel + Events API**.
3. انسخ **Pixel ID**، ثم من إعدادات الـ Pixel اضغط **Generate Access Token** (هذا مفتاح CAPI، احفظه بأمان ولا تشاركه).
4. في زد: **الإعدادات ← ربط الخدمات / أدوات التتبع ← TikTok Pixel** والصق الـ Pixel ID (والـ Access Token إن طُلب).

---

## 3) أحداث التحويل والمبيعات والشراء المطلوبة

| حدث TikTok | متى يُطلق في متجر زد | المعاملات الأساسية |
|---|---|---|
| `ViewContent` | فتح صفحة منتج | `content_id`, `content_type=product`, `value`, `currency=SAR` |
| `Search` | البحث في المتجر | `query` |
| `AddToWishlist` | الإضافة للمفضلة | `content_id` |
| `AddToCart` | إضافة للسلة | `content_id`, `quantity`, `value`, `currency` |
| `InitiateCheckout` | بدء إتمام الطلب | `contents`, `value`, `currency` |
| `AddPaymentInfo` | إدخال بيانات الدفع | `value`, `currency` |
| `PlaceAnOrder` | إنشاء الطلب | `contents`, `value`, `currency`, `order_id` |
| `CompletePayment` | **نجاح الدفع (الشراء)** | `contents`, `value`, `currency`, `order_id` |
| `CompleteRegistration` | إنشاء حساب عميل | — |

**شروط جودة البيانات (مهمة لنجاح CAPI):**
- `content_id` في الأحداث **يطابق تماماً** `sku_id` / `id` في الكتالوج (وإلا لن تعمل إعلانات الكتالوج).
- `event_id` نفسه في Pixel وCAPI لكل حدث ← لإزالة التكرار (Deduplication). التطبيق الرسمي يتولى ذلك.
- إرسال بيانات المطابقة (مُشفّرة SHA-256): البريد، الجوال بصيغة دولية `+966…`، `external_id`، و`ttclid`/`ttp`.
- العملة `SAR` والقيمة رقم (بدون رموز).

---

## 4) التحقق من الأحداث

1. Ads Manager ← **Tools ← Events** ← اختر الـ Pixel ← **Overview**: يجب أن تظهر الأحداث بمصدرين **Browser** و **Server**.
2. **Test Events**: افتح المتجر بالرابط المعروض، ونفّذ رحلة كاملة: منتج ← سلة ← دفع ← طلب تجريبي.
3. **Diagnostics**: عالج أي تحذير (Missing content_id, Duplicate events, Low match quality).
4. هدف **Event Match Quality** ≥ 6.
5. تثبيت إضافة **TikTok Pixel Helper** على Chrome للتأكد من الأحداث على المتصفح.

---

## 5) الكتالوج حسب تصنيفات المتجر

### إنشاء الكتالوج
- Ads Manager ← **Assets ← Catalogs** ← **Create** ← النوع **E-commerce**، الدولة **السعودية**، العملة **SAR**.
- مصدر المنتجات: **تطبيق زد (Partner Platform)** – مزامنة تلقائية.
  - بديل: **Data feed** برابط ملف منتجات (CSV/XML) بجدولة يومية.

### ربط الكتالوج بالـ Pixel
- داخل الكتالوج ← **Event Sources** ← **Connect** ← اختر الـ Pixel نفسه.
  يتيح إعلانات إعادة الاستهداف الديناميكية (VSA / Dynamic Showcase Ads).

### مجموعات المنتجات حسب التصنيفات (Product Sets)
داخل الكتالوج ← **Product Sets ← Create Set** ← أنشئ مجموعة لكل تصنيف من تصنيفات زد:

| اسم المجموعة | الشرط (Filter) |
|---|---|
| `<اسم التصنيف 1>` | `Product type` **contains** `<اسم التصنيف 1>` |
| `<اسم التصنيف 2>` | `Product type` **contains** `<اسم التصنيف 2>` |
| الأكثر مبيعاً | `Custom label 0` **is** `bestseller` |
| العروض | `Sale price` **is not empty** |
| متوفر فقط | `Availability` **is** `in stock` |

> زد يرسل تصنيف المنتج غالباً في حقل `product_type`. إن لم يظهر، أضف التصنيف كـ `custom_label_0` من بيانات المنتج في زد، أو استخدم `Brand`/`Title contains`.
> لعرض قائمة التصنيفات: لوحة زد ← **المنتجات ← التصنيفات**.

### فحص جودة الكتالوج
- **Diagnostics** في الكتالوج: لا منتجات مرفوضة، صور ≥ 500×500، السعر والتوفر صحيحان، روابط المنتجات تعمل.

---

## 6) استخدام الكتالوج في الحملات

- **Campaign objective:** Sales ← **Product source: Catalog** ← اختر الكتالوج.
- **Ad group:** اختر **Product set** (تصنيف محدد)، وهدف التحسين **Complete Payment**.
- للاستهداف العكسي: جمهور **Viewed/Added to cart but not purchased** (آخر 7–30 يوماً).

---

## 7) قائمة التحقق النهائية

- [ ] تطبيق TikTok مثبت في زد ومرتبط بالحساب `7695311789071826996`
- [ ] Pixel نشط ويظهر Browser + Server
- [ ] جميع الأحداث في الجدول أعلاه تصل بقيم وعملة صحيحة
- [ ] لا يوجد تكرار للأحداث (Deduplication يعمل)
- [ ] Event Match Quality ≥ 6
- [ ] الكتالوج متزامن، والمنتجات معتمدة
- [ ] الكتالوج مرتبط بالـ Pixel ونسبة مطابقة `content_id` عالية
- [ ] Product Set لكل تصنيف من تصنيفات المتجر

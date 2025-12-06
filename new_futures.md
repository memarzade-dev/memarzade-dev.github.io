# Trae.ai – Markdown & Reading Experience Upgrade Plan

این سند پیشنهادهای ارتقای **MarkdownRenderer**, **ReadingModeToggle** و ابزارهای مرتبط را برای نسخه‌های بعدی trae.ai جمع‌بندی می‌کند.

---

## 1. `MarkdownRenderer.tsx`

### 1.1. حذف کدهای تکراری و مرده (Dead Code)

* در این فایل یک‌سری توابع پردازش مارک‌داون (`processCallouts`, `processFootnotes`, `processInlineExtras`, `processDefinitionLists`, `processAbbreviations`, …) تعریف شده‌اند، اما خروجی آن‌ها (`processedContent`) هیچ‌جا استفاده نمی‌شود و پردازش نهایی از طریق `composeProcessors` انجام می‌شود. 
* همان توابع تقریباً با منطق غنی‌تر در `markdownProcessors.ts` نیز وجود دارند. 

**Upgrade proposal**

* حذف تمامی پردازشگرهای تکراری از `MarkdownRenderer.tsx` و اتکا کامل به `composeProcessors` از `markdownProcessors.ts`.
* در صورت نیاز به تفاوت رفتاری، گزینه‌های جدید به `ProcessorOptions` اضافه شوند (به‌جای تعریف نسخه جدید همان تابع در این فایل).

---

### 1.2. بهبود پشتیبانی RTL و تولید Anchor برای Headingها

در حال حاضر:

* برای بلاک‌ها (`p, h1..h6, li, blockquote, th, td, ul, ol`) و سلول‌های جدول، `dir` بر اساس متن با استفاده از `detectDirection` تنظیم می‌شود و کلاس `rtl` اضافه می‌گردد. 
* اسلاگ‌ساز Heading‌ها فقط کاراکترهای a-z0-9 را در نظر می‌گیرد، بنابراین برای زبان‌های غیرلاتین (مثل فارسی/عربی) همه عنوان‌ها به صورت `section`, `section-2` و… در می‌آیند. 

**Upgrade proposal**

* **Slug چندزبانه:** استفاده از یک استراتژی اسلاگ‌سازی که از کاراکترهای Unicode پشتیبانی کند (یا حداقل حروف فارسی/عربی را نگه دارد).
* **اختیاری کردن direction-per-block:**

  * اضافه کردن option مثل `autoDirection?: boolean` (پیش‌فرض true) برای اعمال یا عدم اعمال direction روی تک‌تک بلاک‌ها.
* **پشتیبانی بهتر از RTL در کدها و جداول:**

  * برای `<pre>` و `<code>`هایی که متن RTL دارند، امکان تنظیم `dir="ltr"` برای خود کد (برای خوانایی) و `dir="rtl"` برای متن پیرامونی، با استفاده از `wrapBidi` در زمان تولید HTML. 

---

### 1.3. Mermaid و Dark Mode

* Mermaid فقط یک‌بار با تمی که از `documentElement.classList.contains('dark')` گرفته می‌شود، initialize می‌شود و اگر کاربر تم را در UI تغییر دهد، نمودارها دوباره با تم جدید رندر نمی‌شوند. 

**Upgrade proposal**

* استخراج منطق Mermaid به یک utility مستقل (مثلاً `initMermaid(theme: 'dark' | 'light')`) و:

  * گوش‌دادن به تغییرات تم (مثلاً رویداد سفارشی یا observer روی class `dark`) و re-init کردن Mermaid با theme جدید.
  * اضافه‌کردن گزینه `enableMermaid?: boolean` در options برای غیرفعال کردن این قابلیت در محیط‌هایی که نیاز نیست.

---

### 1.4. بهبود امنیت و Sanitization

* در حال حاضر از `rehypeRaw` در کنار `rehype-sanitize` (با schema سفارشی) استفاده می‌شود. اجازه‌ی `iframe`، `video` و `audio` داده شده و در کامپوننت `iframe` فقط دامنه‌های YouTube/Vimeo اجازه رندر دارند. 

**Upgrade proposal**

* تقویت `sanitizeSchema`:

  * محدود کردن `src` به فقط `https:` و جلوگیری از `javascript:` URIs.
  * اضافه‌کردن whitelist دامنه‌ها در خود sanitize (نه فقط در کامپوننت React) تا حتی در صورت تغییر کامپوننت، XSS رخ ندهد.
* اضافه کردن testهای واحد روی چندین ورودی مخرب به‌عنوان regression test.

---

### 1.5. تجربه کاربری کد بلاک‌ها

* در حال حاضر:

  * برای زبان `mermaid`، بلاک‌ها با `<div class="mermaid">` رندر می‌شوند.
  * برای باقی زبان‌ها، یک دکمه‌ی کپی روی `<pre>` اضافه شده است. 

**Upgrade proposal**

* **Label زبان و نام فایل**

  * خواندن نام زبان از کلاس (`language-ts`, `language-js`…) و نمایش آن در گوشه‌ی بالای بلاک کد.
  * اضافه کردن صفت اختیاری مثل <code>`ts title=utils.ts`</code> و نمایش آن بالای بلاک.
* **نمایش وضعیت کپی:**

  * بعد از کلیک روی Copy، نمایش «Copied!» با تایم‌اوت و aria-live برای screen reader.
* **خط‌ شماره‌گذاری (اختیاری):**

  * افزودن option `showLineNumbers?: boolean` به MarkdownRenderer و اعمال آن روی `<pre>`/`<code>`.

---

### 1.6. قابلیت‌های جدید برای متن

در حال حاضر قبلاً (به‌واسطه‌ی `composeProcessors`) ویژگی‌هایی مثل calloutها، پاورقی، emoji، تگ‌ها، لینک داخلی و… داریم. 

**Upgrade proposal**

* **Table of Contents (TOC):**

  * استخراج headingها (h1–h3) از DOM یا در مرحله‌ی پردازش markdown و تولید TOC اختیاری (مثلاً prop: `showToc?: boolean`).
* **Scrollspy برای TOC:**

  * با استفاده از IntersectionObserver تعیین شود کدام heading در viewport است و در TOC هایلایت شود.
* **لینک‌های Anchor در کنار heading‌ها:**

  * افزودن یک آیکون لینک کوچک کنار h2/h3 که روی hover نمایش داده شود و امکان کپی anchor را فراهم کند.

---

## 2. `ReadingModeToggle.tsx`

### 2.1. اتصال واقعی به محتوا

در حال حاضر:

* کامپوننت حالت فونت (`sans`/`serif`)، اندازه‌ی فونت و line-height را در localStorage نگه می‌دارد و از طریق `onChange` بیرون می‌فرستد، اما در کدهای ارائه شده اثری از آن در `MarkdownRenderer` یا container اصلی دیده نمی‌شود. 

**Upgrade proposal**

* تعریف یک **ReadingContext** سراسری (React Context) که:

  * `ReadingModeToggle` آن را به‌روزرسانی کند.
  * container متن (مثلاً wrapper اطراف `MarkdownRenderer`) CSS variables مثل `--reading-font-size`, `--reading-line-height`, `--reading-font-family` را از context بگیرد و روی کلاس/استایل اعمال کند.
* امکان فعال/غیرفعال کردن Reading Mode:

  * prop جدید در markdown container: `readingModeEnabled` که اگر true باشد، این تنظیمات اعمال شوند.

---

### 2.2. استفاده از `AlignLeft` و امکانات بیشتر Reading Mode

* آیکون `AlignLeft` ایمپورت شده ولی استفاده نشده است. 

**Upgrade proposal**

افزودن تنظیمات زیر در همان پنل:

* **Text alignment:**

  * استفاده از آیکون `AlignLeft` برای سوییچ بین `left`, `justify` (و شاید `auto` برای RTL).
* **عرض ستون (Column width / max-width):**

  * اسلایدر یا چند preset (narrow, normal, wide) که روی container متن (مثلاً `max-width`) اعمال شود تا خوانایی بهبود یابد.
* **Themeهای مخصوص Reading:**

  * گزینه‌های `Default`, `Sepia`, `Night` که از طریق کلاس‌های CSS روی container اعمال شوند (با تنظیم رنگ پس‌زمینه و متن).

---

### 2.3. دسترس‌پذیری (Accessibility) و UX

**Upgrade proposal**

* اطمینان از اینکه پنل تنظیمات:

  * با Escape بسته شود.
  * در tab order به‌درستی حرکت کند و `aria-expanded` روی دکمه اصلی تنظیم شود.
* اضافه‌کردن شورتکات‌های کیبورد (مثلاً `Ctrl+Shift+R` برای باز/بسته کردن پنل).
* ذخیره‌ی state باز/بسته بودن پنل (اختیاری، مثلاً در sessionStorage).

---

## 3. `frontMatter.ts`

در حال حاضر:

* Front matter فقط با یک regex ساده `^--- ... ---` و با تقسیم بر `\n` و `:` پارس می‌شود و صرفاً `Record<string, string>` برمی‌گرداند. 

**محدودیت‌ها**

* پشتیبانی‌نشدن از:

  * مقادیر چندخطی (multi-line)
  * آرایه‌ها (`tags: [a, b]`)
  * ساختارهای تو در تو (nested)
  * مقادیر با `:` داخل متن (مثل URL, time)

**Upgrade proposal**

* یا:

  * استفاده از کتابخانه‌ای مثل `gray-matter` برای پشتیبانی کامل YAML front matter.
* یا:

  * پیاده‌سازی یک parser کمی پیشرفته‌تر که حداقل:

    * مقادیر داخل `'...'` یا `"..."` را درست بخواند.
    * خطوط continuation با indent را به مقدار قبلی متصل کند.
    * `tags` را اگر با کاما جدا شدند به `string[]` تبدیل کند.

هم‌چنین:

* افزایش نوع خروجی از `Record<string, string>` به interface غنی‌تر (مثلاً `FrontMatterData` با فیلدهای اختیاری `title`, `date`, `tags`, `slug`, `summary`, …).

---

## 4. `markdownProcessors.ts`

این فایل قلب پردازش markdown است و بخش بزرگی از قابلیت‌ها را پیاده‌سازی می‌کند. 

### 4.1. بهینه‌سازی عملکرد

مشکل فعلی:

* بسیاری از پردازشگرها (`processInlineExtras`, `processDefinitionLists`, `processAbbreviations`, `processEmojis`, `processSpoilers`, `processComments`, `processTags`, `processInternalLinks`, `processEmbeds`, `processMentions`, `processIssueLinks`, `processImageSizes`) هر کدام یک‌بار `splitCodeBlocks` را فراخوانی می‌کنند و کل متن را دوباره می‌گردند. این روی سندهای بزرگ می‌تواند سنگین باشد. 

**Upgrade proposal**

* بازطراحی `composeProcessors` به‌صورت **pipeline روی آرایه‌ی `parts`**:

  * یک‌بار `splitCodeBlocks` اجرا شود و هر `processor` روی همین آرایه اعمال گردد.
  * این کار complexity را از چندین بار O(n) به تقریباً یک‌بار O(n) کاهش می‌دهد.
* افزودن benchmarkهای ساده برای سنجش اثر این تغییر.

---

### 4.2. تکمیل گزینه‌های قابل پیکربندی

* در `ProcessorOptions` فیلدی با نام `tagsBaseUrl` وجود دارد، اما در `MarkdownRenderer` گزینه‌ی متقابل آن پاس داده نمی‌شود؛ فقط `enableTags` وجود دارد.  

**Upgrade proposal**

* اضافه کردن `tagsBaseUrl?: string` به `MarkdownRendererProps['options']` و پاس دادن آن به `composeProcessors`.
* هم‌چنین اضافه کردن:

  * `spoilerClassName?: string`
  * `emojiMapOverride?: Record<string, string>`
  * `internalLinkBasePath?: string` برای تولید URL کامل به‌جای فقط hash.

---

### 4.3. گسترش قابلیت‌ها

**پیشنهادها**

* **TOC Generator:**

  * اضافه کردن پردازشگر (optionally) که لیست headingها را استخراج کند و در انتهای متن (یا جایی مشخص) بلوک TOC تولید کند.
* **Custom Containers بیشتر:**

  * علاوه بر `[!note]`/`[!tip]`/`[!warning]`/`[!danger]`/`[!quote]`, از نوع‌های دیگری مثل `[!success]`, `[!info]` پشتیبانی شود (با کلاس CSS مجزا). 
* **Emoji Map قابل توسعه:**

  * فراهم کردن امکان تزریق یک map جدید از بیرون یا merge با `emojiMap` فعلی (برای اضافه کردن emojiهای اختصاصی برند trae.ai).
* **Shortcodes / Macros ساده:**

  * مثلاً سینتکس‌هایی مثل `{{youtube:ID}}` که به embed ویدیوی YouTube تبدیل شوند (با رعایت sanitize و allowlist دامنه‌ها).

---

## 5. `rtlDetect.ts`

این فایل مسئول تشخیص جهت متن است. 

### 5.1. بهبود دقت الگوریتم

در حال حاضر:

* `detectRTL` شمارش کاراکترهای RTL و LTR را انجام می‌دهد و اگر RTL بیشتر بود، نتیجه را RTL در نظر می‌گیرد.
* `detectDirection` اول نگاه می‌کند اولین کاراکتر trimmed چه چیزی‌ست (اگر RTL، نتیجه `rtl` و اگر A–Z، `ltr`)؛ در غیر این صورت به `detectRTL` می‌افتد.

**Upgrade proposal**

* افزودن آستانه (threshold) برای طول متن:

  * برای رشته‌های خیلی کوتاه (مثلاً ۱–۲ کاراکتر) روی `auto`/پیش‌فرض تکیه شود.
* در نظر گرفتن اعداد و علامت‌ها:

  * در حال حاضر حضور عدد در ابتدا باعث می‌شود به `detectRTL` واگذار شود؛ می‌توان بر اساس اولین حرف حرفی (نه رقم) تصمیم گرفت.
* اضافه کردن تست برای موارد خاص:

  * متن‌های mixed مثل: `"سلام، version 2.0 منتشر شد"`
  * متن‌هایی که داخل‌شان HTML tag دارند.

---

### 5.2. امکانات تکمیلی

**Upgrade proposal**

* تابع helper جدید `annotateDirection(root: HTMLElement)` که:

  * بچه‌های بلاک را پیمایش و برای هر node با متن قابل توجه، `dir` را تنظیم می‌کند.
  * می‌تواند در `MarkdownRenderer` جایگزین حلقه‌ی دستی فعلی شود (کد DRYتر).
* `wrapBidi`:

  * افزودن option برای افزودن کلاس CSS روی `<bdi>` و استفاده از آن در markdownProcessors برای واژه‌های خاص (مثلاً کلمات انگلیسی در متن فارسی).

---

## 6. Breaking Changes & Migration Notes

اگر همه‌ی پیشنهادها پیاده‌سازی شوند، تغییرات زیر ممکن است breaking باشند:

1. **frontMatter پارسر جدید:**

   * اگر `parseFrontMatter` خروجی را از `Record<string, string>` به ساختاری قوی‌تر تغییر دهد، باقی کدها باید تطبیق پیدا کنند.
2. **تغییر در ساختار HTML calloutها / TOC / tags:**

   * CSS فعلی ممکن است نیاز به تنظیم مجدد داشته باشد.
3. **Refactor پردازش markdown به pipeline:**

   * اگر کسی خارج از این فایل به توابع داخلی تکیه کرده باشد (که به نظر نمی‌رسد)، باید به نسخه‌ی جدید مهاجرت کند.
4. **اتصال Reading Mode به CSS variables:**

   * هر جایی که به فونت و line-height تکیه می‌کند باید تغییر کند تا با متغیرهای جدید سازگار شود.

---

## 7. مراحل پیشنهادی اجرا

1. **گام ۱ – Cleanup & Refactor:**

   * حذف کدهای تکراری در `MarkdownRenderer.tsx`.
   * اضافه کردن `tagsBaseUrl` در options و وصل کردن آن به `markdownProcessors`.
   * استفاده از `annotateDirection` (جدید) از `rtlDetect.ts` برای DRY کردن logic.

2. **گام ۲ – Performance & Safety:**

   * بازطراحی `composeProcessors` برای فقط یک‌بار split.
   * تقویت sanitize و اضافه کردن تست‌های امنیتی.

3. **گام ۳ – UX Features:**

   * ارتقای Reading Mode (فونت، تم، alignment، column width) و اتصال آن به container متن.
   * بهبود کد بلاک‌ها (label زبان، Copy feedback، line numbers، عنوان فایل).

4. **گام ۴ – Advanced Features:**

   * TOC + Scrollspy.
   * Mermaid theme sync.
   * frontMatter پیشرفته.

این upgrade.md می‌تواند مبنای ایجاد issueها / taskهای کوچک‌تر در repo trae.ai باشد.

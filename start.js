const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const fs = require('fs');

// ===================== تنظیمات =====================
const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
    console.error('❌ BOT_TOKEN not set!');
    process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);
const app = express();
const PORT = process.env.PORT || 3000;

// ===================== دیتای ثابت =====================
const fixedPrivateKey = 'wE1l7SeVbFb5+OnJoJqEpRtqurznvtyP6CBHC4X6X2k=';
const fixedPublicKey = '+0GbM2ULF0Ph3f8QH9SzRODCV9Oxj5WIE3Yda6kQZFo=';

const countries = {
    '🇩🇪 آلمان': { code: 'DE', ips: [45, 138, 10] },
    '🇸🇬 سنگاپور': { code: 'SG', ips: [103, 169, 150] },
    '🇹🇷 ترکیه': { code: 'TR', ips: [185, 216, 25] },
    '🇦🇪 امارات': { code: 'AE', ips: [37, 216, 4] },
    '🇧🇭 بحرین': { code: 'BH', ips: [185, 20, 215] },
    '🇺🇸 آمریکا': { code: 'US', ips: [45, 33, 20] },
    '🇬🇧 انگلستان': { code: 'GB', ips: [45, 88, 70] },
    '🇫🇷 فرانسه': { code: 'FR', ips: [45, 155, 200] },
    '🇳🇱 هلند': { code: 'NL', ips: [45, 137, 100] },
    '🇯🇵 ژاپن': { code: 'JP', ips: [45, 138, 200] },
    '🇰🇷 کره جنوبی': { code: 'KR', ips: [45, 140, 100] },
    '🇨🇦 کانادا': { code: 'CA', ips: [45, 140, 200] },
    '🇦🇺 استرالیا': { code: 'AU', ips: [45, 130, 100] },
    '🇮🇳 هند': { code: 'IN', ips: [45, 130, 200] },
    '🇷🇺 روسیه': { code: 'RU', ips: [45, 130, 150] },
    '🇧🇷 برزیل': { code: 'BR', ips: [45, 150, 100] },
    '🇿🇦 آفریقای جنوبی': { code: 'ZA', ips: [45, 150, 200] },
    '🇪🇬 مصر': { code: 'EG', ips: [45, 150, 150] },
    '🇸🇦 عربستان': { code: 'SA', ips: [45, 160, 100] },
    '🇵🇰 پاکستان': { code: 'PK', ips: [45, 160, 200] },
    '🇮🇷 ایران': { code: 'IR', ips: [45, 160, 150] },
    '🇹🇭 تایلند': { code: 'TH', ips: [45, 170, 100] },
    '🇻🇳 ویتنام': { code: 'VN', ips: [45, 170, 200] },
    '🇲🇾 مالزی': { code: 'MY', ips: [45, 170, 150] },
    '🇮🇩 اندونزی': { code: 'ID', ips: [45, 180, 100] },
    '🇵🇭 فیلیپین': { code: 'PH', ips: [45, 180, 200] },
    '🇳🇬 نیجریه': { code: 'NG', ips: [45, 180, 150] },
    '🇰🇪 کنیا': { code: 'KE', ips: [45, 190, 100] },
    '🇦🇷 آرژانتین': { code: 'AR', ips: [45, 190, 200] },
    '🇨🇱 شیلی': { code: 'CL', ips: [45, 190, 150] },
    '🇨🇴 کلمبیا': { code: 'CO', ips: [45, 200, 100] },
    '🇵🇪 پرو': { code: 'PE', ips: [45, 200, 200] },
    '🇻🇪 ونزوئلا': { code: 'VE', ips: [45, 200, 150] },
    '🇺🇦 اوکراین': { code: 'UA', ips: [45, 210, 100] },
    '🇵🇱 لهستان': { code: 'PL', ips: [45, 210, 200] },
    '🇷🇴 رومانی': { code: 'RO', ips: [45, 210, 150] },
    '🇬🇷 یونان': { code: 'GR', ips: [45, 220, 100] },
    '🇵🇹 پرتغال': { code: 'PT', ips: [45, 220, 200] },
    '🇧🇪 بلژیک': { code: 'BE', ips: [45, 220, 150] },
    '🇨🇭 سوئیس': { code: 'CH', ips: [45, 230, 100] },
    '🇦🇹 اتریش': { code: 'AT', ips: [45, 230, 200] },
    '🇸🇪 سوئد': { code: 'SE', ips: [45, 230, 150] },
    '🇳🇴 نروژ': { code: 'NO', ips: [45, 240, 100] },
    '🇩🇰 دانمارک': { code: 'DK', ips: [45, 240, 200] },
    '🇫🇮 فنلاند': { code: 'FI', ips: [45, 240, 150] },
    '🇮🇪 ایرلند': { code: 'IE', ips: [45, 250, 100] },
    '🇳🇿 نیوزلند': { code: 'NZ', ips: [45, 250, 200] },
    '🇲🇽 مکزیک': { code: 'MX', ips: [45, 250, 150] },
    '🇪🇸 اسپانیا': { code: 'ES', ips: [46, 10, 100] },
    '🇮🇹 ایتالیا': { code: 'IT', ips: [46, 10, 200] },
};

// ===================== وضعیت کاربران =====================
const userStates = {};
const usedIPs = new Set();

// ===================== دکمه‌های شیشه‌ای =====================
function createGlassKeyboard(buttons) {
    const keyboard = [];
    for (let i = 0; i < buttons.length; i += 2) {
        const row = [];
        for (let j = i; j < Math.min(i + 2, buttons.length); j++) {
            row.push({
                text: buttons[j].text,
                callback_data: buttons[j].callback_data
            });
        }
        keyboard.push(row);
    }
    return Markup.inlineKeyboard(keyboard);
}

// ===================== منوی اصلی =====================
bot.start(async (ctx) => {
    await ctx.reply(
        `🌐 **پنل وایرگارد گیمینگ**\n\n` +
        `به پنل تولید کانفیگ وایرگارد خوش آمدید!\n` +
        `لطفاً یکی از گزینه‌های زیر را انتخاب کنید:`,
        {
            parse_mode: 'Markdown',
            ...createGlassKeyboard([
                { text: '🛡️ وایرگارد', callback_data: 'wireguard_start' },
                { text: '🌍 DNS', callback_data: 'dns_start' }
            ])
        }
    );
});

// ===================== شروع وایرگارد =====================
bot.action('wireguard_start', async (ctx) => {
    const userId = ctx.from.id;
    userStates[userId] = { step: 'select_country' };

    const countryButtons = Object.keys(countries).map(name => ({
        text: name,
        callback_data: `country_${name}`
    }));

    await ctx.reply(
        `🌍 **مرحله ۱: انتخاب کشور**\n\n` +
        `لطفاً کشور مورد نظر را انتخاب کنید:`,
        {
            parse_mode: 'Markdown',
            ...createGlassKeyboard(countryButtons)
        }
    );
});

// ===================== انتخاب کشور =====================
bot.action(/country_(.+)/, async (ctx) => {
    const userId = ctx.from.id;
    const countryName = ctx.match[1];
    
    userStates[userId].country = countryName;
    userStates[userId].step = 'select_days';

    await ctx.reply(
        `✅ کشور **${countryName}** انتخاب شد!\n\n` +
        `📅 **مرحله ۲: تعداد روز اعتبار**\n\n` +
        `لطفاً تعداد روز اعتبار را وارد کنید (۱ تا ۱۰۰۰):`,
        { parse_mode: 'Markdown' }
    );
});

// ===================== دریافت تعداد روز =====================
bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const text = ctx.message.text;
    const state = userStates[userId];

    if (!state) return;

    // مرحله ۲: دریافت روز
    if (state.step === 'select_days') {
        const days = parseInt(text);
        if (isNaN(days) || days < 1 || days > 1000) {
            return ctx.reply('❌ لطفاً یک عدد معتبر بین ۱ تا ۱۰۰۰ وارد کنید!');
        }
        state.days = days;
        state.step = 'select_traffic';

        await ctx.reply(
            `✅ تعداد روز: **${days}** روز\n\n` +
            `📊 **مرحله ۳: حجم مجاز**\n\n` +
            `لطفاً حجم مجاز را به گیگابایت وارد کنید (۱ تا ۱۰۰۰):`,
            { parse_mode: 'Markdown' }
        );
        return;
    }

    // مرحله ۳: دریافت حجم
    if (state.step === 'select_traffic') {
        const traffic = parseInt(text);
        if (isNaN(traffic) || traffic < 1 || traffic > 1000) {
            return ctx.reply('❌ لطفاً یک عدد معتبر بین ۱ تا ۱۰۰۰ وارد کنید!');
        }
        state.traffic = traffic;
        state.step = 'select_users';

        await ctx.reply(
            `✅ حجم مجاز: **${traffic}** گیگابایت\n\n` +
            `👥 **مرحله ۴: تعداد کاربران**\n\n` +
            `لطفاً تعداد کاربران را وارد کنید (۱ تا ۱۰۰۰):`,
            { parse_mode: 'Markdown' }
        );
        return;
    }

    // مرحله ۴: دریافت تعداد کاربران
    if (state.step === 'select_users') {
        const users = parseInt(text);
        if (isNaN(users) || users < 1 || users > 1000) {
            return ctx.reply('❌ لطفاً یک عدد معتبر بین ۱ تا ۱۰۰۰ وارد کنید!');
        }
        state.users = users;
        state.step = 'select_filename';

        await ctx.reply(
            `✅ تعداد کاربران: **${users}**\n\n` +
            `📝 **مرحله ۵: نام فایل خروجی**\n\n` +
            `لطفاً نام فایل خروجی را وارد کنید (پیش‌فرض: WESCORT_YT):`,
            { parse_mode: 'Markdown' }
        );
        return;
    }

    // مرحله ۵: دریافت نام فایل
    if (state.step === 'select_filename') {
        const filename = text.trim() || 'WESCORT_YT';
        state.filename = filename;

        // تولید کانفیگ
        const config = generateConfig(state);
        
        // ذخیره کانفیگ برای کاربر
        state.config = config;

        await ctx.reply(
            `✅ **سرور شما آماده شد!**\n\n` +
            `📋 **جزئیات:**\n` +
            `🌍 کشور: ${state.country}\n` +
            `📅 روز: ${state.days}\n` +
            `📊 حجم: ${state.traffic} GB\n` +
            `👥 کاربران: ${state.users}\n` +
            `📝 نام فایل: ${state.filename}.conf\n\n` +
            `برای دریافت فایل روی دکمه زیر کلیک کنید:`,
            {
                parse_mode: 'Markdown',
                ...createGlassKeyboard([
                    { text: '📥 دریافت فایل کانفیگ', callback_data: 'download_config' },
                    { text: '📋 کپی کانفیگ', callback_data: 'copy_config' }
                ])
            }
        );

        delete userStates[userId];
        return;
    }
});

// ===================== دانلود کانفیگ =====================
bot.action('download_config', async (ctx) => {
    const userId = ctx.from.id;
    // پیدا کردن آخرین کانفیگ کاربر
    let userConfig = null;
    let filename = 'WESCORT_YT';
    
    for (const key in userStates) {
        if (userStates[key]?.config) {
            userConfig = userStates[key].config;
            filename = userStates[key].filename || 'WESCORT_YT';
            break;
        }
    }

    if (!userConfig) {
        return ctx.reply('❌ کانفیگی پیدا نشد! لطفاً دوباره مراحل را طی کنید.');
    }

    try {
        await ctx.replyWithDocument(
            {
                source: Buffer.from(userConfig, 'utf-8'),
                filename: `${filename}.conf`
            },
            {
                caption: `✅ فایل ${filename}.conf با موفقیت ساخته شد!`
            }
        );
    } catch (error) {
        console.error('❌ خطا:', error);
        ctx.reply('❌ خطا در ارسال فایل!');
    }
});

// ===================== کپی کانفیگ =====================
bot.action('copy_config', async (ctx) => {
    let userConfig = null;
    for (const key in userStates) {
        if (userStates[key]?.config) {
            userConfig = userStates[key].config;
            break;
        }
    }

    if (!userConfig) {
        return ctx.reply('❌ کانفیگی پیدا نشد!');
    }

    await ctx.reply(
        `📋 **کانفیگ وایرگارد شما:**\n\n` +
        `\`\`\`\n${userConfig}\n\`\`\``,
        { parse_mode: 'Markdown' }
    );
});

// ===================== DNS (برای بعد) =====================
bot.action('dns_start', async (ctx) => {
    await ctx.reply(
        `🌍 **بخش DNS**\n\n` +
        `این بخش به زودی اضافه میشود! 🚀\n` +
        `برای بازگشت به منو، /start را بزنید.`,
        { parse_mode: 'Markdown' }
    );
});

// ===================== تابع تولید کانفیگ =====================
function generateConfig(state) {
    const countryData = countries[state.country];
    const [a, b, c] = countryData.ips;
    
    let d = Math.floor(Math.random() * 254) + 1;
    let ip = `${a}.${b}.${c}.${d}`;
    while (usedIPs.has(ip)) {
        d = Math.floor(Math.random() * 254) + 1;
        ip = `${a}.${b}.${c}.${d}`;
    }
    usedIPs.add(ip);

    const dns = '10.202.10.11, 1.1.1.1';
    const mtu = '1380';
    const address = `10.66.66.${Math.floor(Math.random() * 200 + 2)}/32`;

    return `[Interface]
PrivateKey = ${fixedPrivateKey}
Address = ${address}
MTU = ${mtu}
DNS = ${dns}

[Peer]
PublicKey = ${fixedPublicKey}
Endpoint = ${ip}:51820
PersistentKeepalive = 25`;
}

// ===================== وب‌سرور =====================
app.get('/', (req, res) => {
    res.send('🤖 ربات وایرگارد در حال اجراست!');
});

app.listen(PORT, () => {
    console.log(`✅ وب‌سرور روی پورت ${PORT} در حال اجراست`);
});

// ===================== راه‌اندازی =====================
bot.launch()
    .then(() => {
        console.log('✅ ربات وایرگارد راه‌اندازی شد!');
        console.log('🛡️ برای شروع /start را بزنید.');
    })
    .catch(err => console.error('❌ خطا:', err));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

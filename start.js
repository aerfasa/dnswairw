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

// ===================== دیتابیس ساده =====================
const DATA_FILE = 'data.json';

function loadData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        }
    } catch (error) {
        console.error('❌ خطا:', error);
    }
    return { forcedChannel: null };
}

function saveData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('❌ خطا:', error);
    }
}

let data = loadData();

// ===================== دیتای ثابت وایرگارد =====================
const fixedPrivateKey = 'wE1l7SeVbFb5+OnJoJqEpRtqurznvtyP6CBHC4X6X2k=';
const fixedPublicKey = '+0GbM2ULF0Ph3f8QH9SzRODCV9Oxj5WIE3Yda6kQZFo=';

const countries = [
    { name: '🇦🇪 امارات', code: 'AE', ips: [37, 216, 4], ipv6: '2a00:19c0:1000::' },
    { name: '🇹🇷 ترکیه', code: 'TR', ips: [185, 216, 25], ipv6: '2a00:19c0:2000::' },
    { name: '🇫🇮 فنلاند', code: 'FI', ips: [45, 155, 200], ipv6: '2a00:19c0:3000::' },
    { name: '🇺🇸 آمریکا', code: 'US', ips: [45, 33, 20], ipv6: '2a00:19c0:4000::' },
    { name: '🇧🇭 بحرین', code: 'BH', ips: [185, 20, 215], ipv6: '2a00:19c0:5000::' },
    { name: '🇨🇭 سوئیس', code: 'CH', ips: [45, 230, 100], ipv6: '2a00:19c0:6000::' },
    { name: '🇩🇪 آلمان', code: 'DE', ips: [45, 138, 10], ipv6: '2a00:19c0:7000::' },
    { name: '🇸🇬 سنگاپور', code: 'SG', ips: [103, 169, 150], ipv6: '2a00:19c0:8000::' },
    { name: '🇬🇧 انگلستان', code: 'GB', ips: [45, 88, 70], ipv6: '2a00:19c0:9000::' },
    { name: '🇫🇷 فرانسه', code: 'FR', ips: [45, 155, 100], ipv6: '2a00:19c0:a000::' },
    { name: '🇳🇱 هلند', code: 'NL', ips: [45, 137, 100], ipv6: '2a00:19c0:b000::' },
    { name: '🇯🇵 ژاپن', code: 'JP', ips: [45, 138, 200], ipv6: '2a00:19c0:c000::' },
    { name: '🇰🇷 کره جنوبی', code: 'KR', ips: [45, 140, 100], ipv6: '2a00:19c0:d000::' },
    { name: '🇨🇦 کانادا', code: 'CA', ips: [45, 140, 200], ipv6: '2a00:19c0:e000::' },
    { name: '🇦🇺 استرالیا', code: 'AU', ips: [45, 130, 100], ipv6: '2a00:19c0:f000::' },
    { name: '🇮🇳 هند', code: 'IN', ips: [45, 130, 200], ipv6: '2a00:19c1:1000::' },
    { name: '🇷🇺 روسیه', code: 'RU', ips: [45, 130, 150], ipv6: '2a00:19c1:2000::' },
    { name: '🇧🇷 برزیل', code: 'BR', ips: [45, 150, 100], ipv6: '2a00:19c1:3000::' },
    { name: '🇿🇦 آفریقای جنوبی', code: 'ZA', ips: [45, 150, 200], ipv6: '2a00:19c1:4000::' },
    { name: '🇪🇬 مصر', code: 'EG', ips: [45, 150, 150], ipv6: '2a00:19c1:5000::' },
    { name: '🇸🇦 عربستان', code: 'SA', ips: [45, 160, 100], ipv6: '2a00:19c1:6000::' },
    { name: '🇵🇰 پاکستان', code: 'PK', ips: [45, 160, 200], ipv6: '2a00:19c1:7000::' },
    { name: '🇮🇷 ایران', code: 'IR', ips: [45, 160, 150], ipv6: '2a00:19c1:8000::' },
    { name: '🇹🇭 تایلند', code: 'TH', ips: [45, 170, 100], ipv6: '2a00:19c1:9000::' },
    { name: '🇻🇳 ویتنام', code: 'VN', ips: [45, 170, 200], ipv6: '2a00:19c1:a000::' },
    { name: '🇲🇾 مالزی', code: 'MY', ips: [45, 170, 150], ipv6: '2a00:19c1:b000::' },
    { name: '🇮🇩 اندونزی', code: 'ID', ips: [45, 180, 100], ipv6: '2a00:19c1:c000::' },
    { name: '🇵🇭 فیلیپین', code: 'PH', ips: [45, 180, 200], ipv6: '2a00:19c1:d000::' },
    { name: '🇳🇬 نیجریه', code: 'NG', ips: [45, 180, 150], ipv6: '2a00:19c1:e000::' },
    { name: '🇰🇪 کنیا', code: 'KE', ips: [45, 190, 100], ipv6: '2a00:19c1:f000::' },
    { name: '🇦🇷 آرژانتین', code: 'AR', ips: [45, 190, 200], ipv6: '2a00:19c2:1000::' },
    { name: '🇨🇱 شیلی', code: 'CL', ips: [45, 190, 150], ipv6: '2a00:19c2:2000::' },
    { name: '🇨🇴 کلمبیا', code: 'CO', ips: [45, 200, 100], ipv6: '2a00:19c2:3000::' },
    { name: '🇵🇪 پرو', code: 'PE', ips: [45, 200, 200], ipv6: '2a00:19c2:4000::' },
    { name: '🇻🇪 ونزوئلا', code: 'VE', ips: [45, 200, 150], ipv6: '2a00:19c2:5000::' },
    { name: '🇺🇦 اوکراین', code: 'UA', ips: [45, 210, 100], ipv6: '2a00:19c2:6000::' },
    { name: '🇵🇱 لهستان', code: 'PL', ips: [45, 210, 200], ipv6: '2a00:19c2:7000::' },
    { name: '🇷🇴 رومانی', code: 'RO', ips: [45, 210, 150], ipv6: '2a00:19c2:8000::' },
    { name: '🇬🇷 یونان', code: 'GR', ips: [45, 220, 100], ipv6: '2a00:19c2:9000::' },
    { name: '🇵🇹 پرتغال', code: 'PT', ips: [45, 220, 200], ipv6: '2a00:19c2:a000::' },
    { name: '🇧🇪 بلژیک', code: 'BE', ips: [45, 220, 150], ipv6: '2a00:19c2:b000::' },
    { name: '🇦🇹 اتریش', code: 'AT', ips: [45, 230, 200], ipv6: '2a00:19c2:c000::' },
    { name: '🇸🇪 سوئد', code: 'SE', ips: [45, 230, 150], ipv6: '2a00:19c2:d000::' },
    { name: '🇳🇴 نروژ', code: 'NO', ips: [45, 240, 100], ipv6: '2a00:19c2:e000::' },
    { name: '🇩🇰 دانمارک', code: 'DK', ips: [45, 240, 200], ipv6: '2a00:19c2:f000::' },
    { name: '🇮🇪 ایرلند', code: 'IE', ips: [45, 240, 150], ipv6: '2a00:19c3:1000::' },
    { name: '🇳🇿 نیوزلند', code: 'NZ', ips: [45, 250, 100], ipv6: '2a00:19c3:2000::' },
    { name: '🇲🇽 مکزیک', code: 'MX', ips: [45, 250, 200], ipv6: '2a00:19c3:3000::' },
    { name: '🇪🇸 اسپانیا', code: 'ES', ips: [46, 10, 100], ipv6: '2a00:19c3:4000::' },
    { name: '🇮🇹 ایتالیا', code: 'IT', ips: [46, 10, 200], ipv6: '2a00:19c3:5000::' }
];

// ===================== وضعیت کاربران =====================
const userStates = {};
const usedIPs = new Set();

// ===================== گزینه‌های دلخواه =====================
const options = {
    traffic: ['1GB', '2GB', '5GB', '10GB', 'دلخواه'],
    users: ['1', '2', '5', '10', 'دلخواه'],
    days: ['1', '7', '15', '30', '60', 'دلخواه']
};

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

// ===================== بررسی چنل اجباری =====================
async function checkForcedChannel(ctx) {
    if (!data.forcedChannel) return true;

    try {
        const chatMember = await ctx.getChatMember(data.forcedChannel, ctx.from.id);
        if (chatMember.status === 'left' || chatMember.status === 'kicked') {
            await ctx.reply(
                `⚠️ **برای استفاده از ربات باید در کانال زیر عضو شوید:**\n\n` +
                `🔗 [عضویت در کانال](${data.forcedChannel})\n\n` +
                `❌ تا زمانی که عضو نشوید، ربات کار نخواهد کرد!`,
                {
                    parse_mode: 'Markdown',
                    disable_web_page_preview: true
                }
            );
            return false;
        }
        return true;
    } catch (error) {
        console.error('❌ خطا در بررسی چنل:', error);
        return true;
    }
}

// ===================== Middleware چنل اجباری =====================
bot.use(async (ctx, next) => {
    // اگه کاربر در حال تنظیم چنل هست، چک نکن
    if (ctx.from.id === 6732134123 && ctx.message?.text?.startsWith('/setchannel')) {
        return next();
    }

    // اگه چنل اجباری تنظیم شده، چک کن
    if (data.forcedChannel) {
        const isMember = await checkForcedChannel(ctx);
        if (!isMember) return;
    }

    return next();
});

// ===================== منوی اصلی =====================
bot.start(async (ctx) => {
    await ctx.reply(
        `🌐 **پنل وایرگارد و DNS گیمینگ**\n\n` +
        `به پنل تولید کانفیگ و DNS خوش آمدید!\n` +
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

// ===================== تنظیم چنل اجباری (فقط ادمین) =====================
bot.command('setchannel', async (ctx) => {
    if (ctx.from.id !== 6732134123) {
        return ctx.reply('❌ فقط ادمین میتواند این کار را انجام دهد!');
    }

    const text = ctx.message.text;
    const parts = text.split(' ');
    
    if (parts.length < 2) {
        return ctx.reply(
            `📌 **راهنمای تنظیم چنل اجباری:**\n\n` +
            `برای تنظیم چنل:\n` +
            `/setchannel @channel_username\n\n` +
            `برای حذف چنل اجباری:\n` +
            `/setchannel remove`
        );
    }

    const channel = parts[1];

    if (channel === 'remove') {
        data.forcedChannel = null;
        saveData(data);
        return ctx.reply('✅ چنل اجباری حذف شد!');
    }

    // بررسی اینکه ربات ادمین چنل هست
    try {
        const chat = await ctx.getChat(channel);
        const member = await ctx.getChatMember(channel, ctx.botInfo.id);
        
        if (member.status !== 'administrator' && member.status !== 'creator') {
            return ctx.reply('❌ ربات ادمین این کانال نیست! لطفاً ربات را ادمین کنید.');
        }

        data.forcedChannel = channel;
        saveData(data);
        await ctx.reply(`✅ چنل اجباری تنظیم شد:\n🔗 ${channel}\n\nاز این به بعد کاربران باید در این کانال عضو باشند.`);
    } catch (error) {
        ctx.reply(`❌ خطا در تنظیم چنل: ${error.message}`);
    }
});

// ===================== شروع وایرگارد =====================
bot.action('wireguard_start', async (ctx) => {
    const userId = ctx.from.id;
    userStates[userId] = { step: 'select_country' };

    const countryButtons = countries.map(c => ({
        text: c.name,
        callback_data: `wg_country_${c.code}`
    }));

    await ctx.reply(
        `🌍 **مرحله ۱: انتخاب کشور (وایرگارد)**\n\n` +
        `لطفاً کشور مورد نظر را انتخاب کنید:`,
        {
            parse_mode: 'Markdown',
            ...createGlassKeyboard(countryButtons)
        }
    );
});

// ===================== انتخاب کشور وایرگارد =====================
bot.action(/wg_country_(.+)/, async (ctx) => {
    const userId = ctx.from.id;
    const countryCode = ctx.match[1];
    const country = countries.find(c => c.code === countryCode);
    
    userStates[userId].country = country;
    userStates[userId].step = 'wg_days';

    const dayButtons = options.days.map(d => ({
        text: `${d} روز`,
        callback_data: `wg_days_${d}`
    }));

    await ctx.reply(
        `✅ کشور **${country.name}** انتخاب شد!\n\n` +
        `📅 **مرحله ۲: تعداد روز اعتبار**\n\n` +
        `لطفاً یکی از گزینه‌های زیر را انتخاب کنید:`,
        {
            parse_mode: 'Markdown',
            ...createGlassKeyboard(dayButtons)
        }
    );
});

// ===================== انتخاب روز وایرگارد =====================
bot.action(/wg_days_(.+)/, async (ctx) => {
    const userId = ctx.from.id;
    const value = ctx.match[1];
    const state = userStates[userId];
    if (!state) return;

    if (value === 'دلخواه') {
        state.step = 'wg_days_custom';
        return ctx.reply('📝 لطفاً تعداد روز دلخواه را وارد کنید (۱ تا ۱۰۰۰):');
    }

    state.days = parseInt(value);
    state.step = 'wg_traffic';

    const trafficButtons = options.traffic.map(t => ({
        text: t,
        callback_data: `wg_traffic_${t}`
    }));

    await ctx.reply(
        `✅ تعداد روز: **${value}** روز\n\n` +
        `📊 **مرحله ۳: حجم مجاز**\n\n` +
        `لطفاً یکی از گزینه‌های زیر را انتخاب کنید:`,
        {
            parse_mode: 'Markdown',
            ...createGlassKeyboard(trafficButtons)
        }
    );
});

// ===================== انتخاب حجم وایرگارد =====================
bot.action(/wg_traffic_(.+)/, async (ctx) => {
    const userId = ctx.from.id;
    const value = ctx.match[1];
    const state = userStates[userId];
    if (!state) return;

    if (value === 'دلخواه') {
        state.step = 'wg_traffic_custom';
        return ctx.reply('📝 لطفاً حجم دلخواه را به گیگابایت وارد کنید (۱ تا ۱۰۰۰):');
    }

    state.traffic = parseInt(value.replace('GB', ''));
    state.step = 'wg_users';

    const userButtons = options.users.map(u => ({
        text: `${u} نفر`,
        callback_data: `wg_users_${u}`
    }));

    await ctx.reply(
        `✅ حجم مجاز: **${value}**\n\n` +
        `👥 **مرحله ۴: تعداد کاربران**\n\n` +
        `لطفاً یکی از گزینه‌های زیر را انتخاب کنید:`,
        {
            parse_mode: 'Markdown',
            ...createGlassKeyboard(userButtons)
        }
    );
});

// ===================== انتخاب کاربران وایرگارد =====================
bot.action(/wg_users_(.+)/, async (ctx) => {
    const userId = ctx.from.id;
    const value = ctx.match[1];
    const state = userStates[userId];
    if (!state) return;

    if (value === 'دلخواه') {
        state.step = 'wg_users_custom';
        return ctx.reply('📝 لطفاً تعداد کاربران دلخواه را وارد کنید (۱ تا ۱۰۰۰):');
    }

    state.users = parseInt(value);
    state.step = 'wg_filename';

    await ctx.reply(
        `✅ تعداد کاربران: **${value}**\n\n` +
        `📝 **مرحله ۵: نام فایل خروجی**\n\n` +
        `لطفاً نام فایل خروجی را وارد کنید (پیش‌فرض: WESCORT_YT):`,
        { parse_mode: 'Markdown' }
    );
});

// ===================== دریافت متن‌ها (دلخواه و نام فایل) =====================
bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const text = ctx.message.text;
    const state = userStates[userId];

    if (!state) return;

    // وایرگارد: روز دلخواه
    if (state.step === 'wg_days_custom') {
        const days = parseInt(text);
        if (isNaN(days) || days < 1 || days > 1000) {
            return ctx.reply('❌ لطفاً یک عدد معتبر بین ۱ تا ۱۰۰۰ وارد کنید!');
        }
        state.days = days;
        state.step = 'wg_traffic';

        const trafficButtons = options.traffic.map(t => ({
            text: t,
            callback_data: `wg_traffic_${t}`
        }));

        await ctx.reply(
            `✅ تعداد روز: **${days}** روز\n\n` +
            `📊 **مرحله ۳: حجم مجاز**\n\n` +
            `لطفاً یکی از گزینه‌های زیر را انتخاب کنید:`,
            {
                parse_mode: 'Markdown',
                ...createGlassKeyboard(trafficButtons)
            }
        );
        return;
    }

    // وایرگارد: حجم دلخواه
    if (state.step === 'wg_traffic_custom') {
        const traffic = parseInt(text);
        if (isNaN(traffic) || traffic < 1 || traffic > 1000) {
            return ctx.reply('❌ لطفاً یک عدد معتبر بین ۱ تا ۱۰۰۰ وارد کنید!');
        }
        state.traffic = traffic;
        state.step = 'wg_users';

        const userButtons = options.users.map(u => ({
            text: `${u} نفر`,
            callback_data: `wg_users_${u}`
        }));

        await ctx.reply(
            `✅ حجم مجاز: **${traffic}** گیگابایت\n\n` +
            `👥 **مرحله ۴: تعداد کاربران**\n\n` +
            `لطفاً یکی از گزینه‌های زیر را انتخاب کنید:`,
            {
                parse_mode: 'Markdown',
                ...createGlassKeyboard(userButtons)
            }
        );
        return;
    }

    // وایرگارد: کاربران دلخواه
    if (state.step === 'wg_users_custom') {
        const users = parseInt(text);
        if (isNaN(users) || users < 1 || users > 1000) {
            return ctx.reply('❌ لطفاً یک عدد معتبر بین ۱ تا ۱۰۰۰ وارد کنید!');
        }
        state.users = users;
        state.step = 'wg_filename';

        await ctx.reply(
            `✅ تعداد کاربران: **${users}**\n\n` +
            `📝 **مرحله ۵: نام فایل خروجی**\n\n` +
            `لطفاً نام فایل خروجی را وارد کنید (پیش‌فرض: WESCORT_YT):`,
            { parse_mode: 'Markdown' }
        );
        return;
    }

    // وایرگارد: نام فایل
    if (state.step === 'wg_filename') {
        const filename = text.trim() || 'WESCORT_YT';
        state.filename = filename;

        // تولید کانفیگ
        const config = generateWireguardConfig(state);
        state.config = config;

        await ctx.reply(
            `✅ **سرور وایرگارد شما آماده شد!**\n\n` +
            `📋 **جزئیات:**\n` +
            `🌍 کشور: ${state.country.name}\n` +
            `📅 روز: ${state.days}\n` +
            `📊 حجم: ${state.traffic} GB\n` +
            `👥 کاربران: ${state.users}\n` +
            `📝 نام فایل: ${state.filename}.conf\n\n` +
            `برای دریافت فایل روی دکمه زیر کلیک کنید:`,
            {
                parse_mode: 'Markdown',
                ...createGlassKeyboard([
                    { text: '📥 دریافت فایل', callback_data: 'download_wg' },
                    { text: '📋 کپی کانفیگ', callback_data: 'copy_wg' }
                ])
            }
        );

        // پاک کردن state بعد از اتمام
        setTimeout(() => {
            delete userStates[userId];
        }, 300000); // 5 دقیقه
        return;
    }

    // ===================== DNS =====================
    if (state.step === 'dns_days_custom') {
        const days = parseInt(text);
        if (isNaN(days) || days < 1 || days > 1000) {
            return ctx.reply('❌ لطفاً یک عدد معتبر بین ۱ تا ۱۰۰۰ وارد کنید!');
        }
        state.days = days;
        state.step = 'dns_traffic';

        const trafficButtons = options.traffic.map(t => ({
            text: t,
            callback_data: `dns_traffic_${t}`
        }));

        await ctx.reply(
            `✅ تعداد روز: **${days}** روز\n\n` +
            `📊 **مرحله ۳: حجم مجاز**\n\n` +
            `لطفاً یکی از گزینه‌های زیر را انتخاب کنید:`,
            {
                parse_mode: 'Markdown',
                ...createGlassKeyboard(trafficButtons)
            }
        );
        return;
    }

    if (state.step === 'dns_traffic_custom') {
        const traffic = parseInt(text);
        if (isNaN(traffic) || traffic < 1 || traffic > 1000) {
            return ctx.reply('❌ لطفاً یک عدد معتبر بین ۱ تا ۱۰۰۰ وارد کنید!');
        }
        state.traffic = traffic;
        state.step = 'dns_users';

        const userButtons = options.users.map(u => ({
            text: `${u} نفر`,
            callback_data: `dns_users_${u}`
        }));

        await ctx.reply(
            `✅ حجم مجاز: **${traffic}** گیگابایت\n\n` +
            `👥 **مرحله ۴: تعداد کاربران**\n\n` +
            `لطفاً یکی از گزینه‌های زیر را انتخاب کنید:`,
            {
                parse_mode: 'Markdown',
                ...createGlassKeyboard(userButtons)
            }
        );
        return;
    }

    if (state.step === 'dns_users_custom') {
        const users = parseInt(text);
        if (isNaN(users) || users < 1 || users > 1000) {
            return ctx.reply('❌ لطفاً یک عدد معتبر بین ۱ تا ۱۰۰۰ وارد کنید!');
        }
        state.users = users;
        state.step = 'dns_boost';

        await ctx.reply(
            `✅ تعداد کاربران: **${users}**\n\n` +
            `🚀 **مرحله ۵: DNS تقویت شود؟**\n\n` +
            `لطفاً انتخاب کنید:`,
            {
                parse_mode: 'Markdown',
                ...createGlassKeyboard([
                    { text: '✅ بله', callback_data: 'dns_boost_yes' },
                    { text: '❌ خیر', callback_data: 'dns_boost_no' }
                ])
            }
        );
        return;
    }
});

// ===================== DNS =====================
bot.action('dns_start', async (ctx) => {
    const userId = ctx.from.id;
    userStates[userId] = { step: 'select_country_dns' };

    const countryButtons = countries.map(c => ({
        text: c.name,
        callback_data: `dns_country_${c.code}`
    }));

    await ctx.reply(
        `🌍 **مرحله ۱: انتخاب کشور (DNS)**\n\n` +
        `لطفاً کشور مورد نظر را انتخاب کنید:`,
        {
            parse_mode: 'Markdown',
            ...createGlassKeyboard(countryButtons)
        }
    );
});

bot.action(/dns_country_(.+)/, async (ctx) => {
    const userId = ctx.from.id;
    const countryCode = ctx.match[1];
    const country = countries.find(c => c.code === countryCode);
    
    userStates[userId].country = country;
    userStates[userId].step = 'dns_days';

    const dayButtons = options.days.map(d => ({
        text: `${d} روز`,
        callback_data: `dns_days_${d}`
    }));

    await ctx.reply(
        `✅ کشور **${country.name}** انتخاب شد!\n\n` +
        `📅 **مرحله ۲: تعداد روز اعتبار**\n\n` +
        `لطفاً یکی از گزینه‌های زیر را انتخاب کنید:`,
        {
            parse_mode: 'Markdown',
            ...createGlassKeyboard(dayButtons)
        }
    );
});

bot.action(/dns_days_(.+)/, async (ctx) => {
    const userId = ctx.from.id;
    const value = ctx.match[1];
    const state = userStates[userId];
    if (!state) return;

    if (value === 'دلخواه') {
        state.step = 'dns_days_custom';
        return ctx.reply('📝 لطفاً تعداد روز دلخواه را وارد کنید (۱ تا ۱۰۰۰):');
    }

    state.days = parseInt(value);
    state.step = 'dns_traffic';

    const trafficButtons = options.traffic.map(t => ({
        text: t,
        callback_data: `dns_traffic_${t}`
    }));

    await ctx.reply(
        `✅ تعداد روز: **${value}** روز\n\n` +
        `📊 **مرحله ۳: حجم مجاز**\n\n` +
        `لطفاً یکی از گزینه‌های زیر را انتخاب کنید:`,
        {
            parse_mode: 'Markdown',
            ...createGlassKeyboard(trafficButtons)
        }
    );
});

bot.action(/dns_traffic_(.+)/, async (ctx) => {
    const userId = ctx.from.id;
    const value = ctx.match[1];
    const state = userStates[userId];
    if (!state) return;

    if (value === 'دلخواه') {
        state.step = 'dns_traffic_custom';
        return ctx.reply('📝 لطفاً حجم دلخواه را به گیگابایت وارد کنید (۱ تا ۱۰۰۰):');
    }

    state.traffic = parseInt(value.replace('GB', ''));
    state.step = 'dns_users';

    const userButtons = options.users.map(u => ({
        text: `${u} نفر`,
        callback_data: `dns_users_${u}`
    }));

    await ctx.reply(
        `✅ حجم مجاز: **${value}**\n\n` +
        `👥 **مرحله ۴: تعداد کاربران**\n\n` +
        `لطفاً یکی از گزینه‌های زیر را انتخاب کنید:`,
        {
            parse_mode: 'Markdown',
            ...createGlassKeyboard(userButtons)
        }
    );
});

bot.action(/dns_users_(.+)/, async (ctx) => {
    const userId = ctx.from.id;
    const value = ctx.match[1];
    const state = userStates[userId];
    if (!state) return;

    if (value === 'دلخواه') {
        state.step = 'dns_users_custom';
        return ctx.reply('📝 لطفاً تعداد کاربران دلخواه را وارد کنید (۱ تا ۱۰۰۰):');
    }

    state.users = parseInt(value);
    state.step = 'dns_boost';

    await ctx.reply(
        `✅ تعداد کاربران: **${value}**\n\n` +
        `🚀 **مرحله ۵: DNS تقویت شود؟**\n\n` +
        `لطفاً انتخاب کنید:`,
        {
            parse_mode: 'Markdown',
            ...createGlassKeyboard([
                { text: '✅ بله', callback_data: 'dns_boost_yes' },
                { text: '❌ خیر', callback_data: 'dns_boost_no' }
            ])
        }
    );
});

bot.action('dns_boost_yes', async (ctx) => {
    const userId = ctx.from.id;
    const state = userStates[userId];
    if (!state) return;

    state.boost = 'بله';
    const dnsConfig = generateDNSConfig(state);

    await ctx.reply(
        `✅ **DNS شما آماده شد!**\n\n` +
        `📋 **جزئیات:**\n` +
        `🌍 کشور: ${state.country.name}\n` +
        `📅 روز: ${state.days}\n` +
        `📊 حجم: ${state.traffic} GB\n` +
        `👥 کاربران: ${state.users}\n` +
        `🚀 تقویت: ${state.boost}\n\n` +
        `📋 کانفیگ DNS شما:`,
        {
            parse_mode: 'Markdown',
            ...createGlassKeyboard([
                { text: '📋 کپی DNS', callback_data: 'copy_dns' }
            ])
        }
    );

    await ctx.reply(
        `\`\`\`\n${dnsConfig}\n\`\`\``,
        { parse_mode: 'Markdown' }
    );

    setTimeout(() => {
        delete userStates[userId];
    }, 300000);
});

bot.action('dns_boost_no', async (ctx) => {
    const userId = ctx.from.id;
    const state = userStates[userId];
    if (!state) return;

    state.boost = 'خیر';
    const dnsConfig = generateDNSConfig(state);

    await ctx.reply(
        `✅ **DNS شما آماده شد!**\n\n` +
        `📋 **جزئیات:**\n` +
        `🌍 کشور: ${state.country.name}\n` +
        `📅 روز: ${state.days}\n` +
        `📊 حجم: ${state.traffic} GB\n` +
        `👥 کاربران: ${state.users}\n` +
        `🚀 تقویت: ${state.boost}\n\n` +
        `📋 کانفیگ DNS شما:`,
        {
            parse_mode: 'Markdown',
            ...createGlassKeyboard([
                { text: '📋 کپی DNS', callback_data: 'copy_dns' }
            ])
        }
    );

    await ctx.reply(
        `\`\`\`\n${dnsConfig}\n\`\`\``,
        { parse_mode: 'Markdown' }
    );

    setTimeout(() => {
        delete userStates[userId];
    }, 300000);
});

// ===================== دانلود وایرگارد =====================
bot.action('download_wg', async (ctx) => {
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

// ===================== کپی وایرگارد =====================
bot.action('copy_wg', async (ctx) => {
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

// ===================== کپی DNS =====================
bot.action('copy_dns', async (ctx) => {
    let userConfig = null;
    for (const key in userStates) {
        if (userStates[key]?.config) {
            userConfig = userStates[key].config;
            break;
        }
    }

    if (!userConfig) {
        return ctx.reply('❌ DNSی پیدا نشد!');
    }

    await ctx.reply(
        `📋 **کانفیگ DNS شما:**\n\n` +
        `\`\`\`\n${userConfig}\n\`\`\``,
        { parse_mode: 'Markdown' }
    );
});

// ===================== تابع تولید کانفیگ وایرگارد =====================
function generateWireguardConfig(state) {
    const country = state.country;
    const [a, b, c] = country.ips;
    
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
    const ipv6 = country.ipv6 + Math.floor(Math.random() * 100 + 1);

    return `[Interface]
PrivateKey = ${fixedPrivateKey}
Address = ${address}
MTU = ${mtu}
DNS = ${dns}

[Peer]
PublicKey = ${fixedPublicKey}
Endpoint = ${ip}:51820
PersistentKeepalive = 25
AllowedIPs = ::/0`;
}

// ===================== تابع تولید DNS =====================
function generateDNSConfig(state) {
    const country = state.country;
    
    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const ipv4List = [];
    while (ipv4List.length < 2) {
        const ip = `${rand(1,255)}.${rand(1,255)}.${rand(1,255)}.${rand(1,255)}`;
        if (!ipv4List.includes(ip)) ipv4List.push(ip);
    }

    const ipv6List = [];
    while (ipv6List.length < 2) {
        const ip6 = `${country.ipv6}${rand(1, 9999)}`;
        if (!ipv6List.includes(ip6)) ipv6List.push(ip6);
    }

    let output = `🌐 کشور: ${country.name}\n`;
    output += `📦 حجم: ${state.traffic} گیگ  |  🕓 مدت: ${state.days} روز  |  👥 کاربران: ${state.users}\n`;
    output += `🧠 تقویت DNS: ${state.boost}\n`;
    output += `─────────────────────────────\n`;
    output += `📡 DNS 1 (IPv4): ${ipv4List[0]}\n`;
    output += `📡 DNS 2 (IPv4): ${ipv4List[1]}\n`;
    output += `📡 DNS 1 (IPv6): ${ipv6List[0]}\n`;
    output += `📡 DNS 2 (IPv6): ${ipv6List[1]}\n`;

    if (state.boost === 'بله') {
        output += `🔥 نسخه بهینه شده برای پابجی 3.9 / 4 و کالاف دیوتی فعال شد.\n🎯 آنتی بن + کاهش پینگ فعال شد.\n`;
    } else {
        output += `⚡ حالت عادی (بدون تقویت اضافی)\n`;
    }

    output += `─────────────────────────────\n`;
    output += `🟢 سرورهای آنلاین: ۴ (همگی فعال)`;

    return output;
}

// ===================== وب‌سرور =====================
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>پنل مدیریت ربات</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
                .card { background: #f5f5f5; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
                input { padding: 10px; width: 80%; margin: 10px 0; border-radius: 8px; border: 2px solid #ddd; }
                button { padding: 12px 30px; background: #1e1e2f; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; }
                button:hover { background: #2b2b42; }
                .status { margin-top: 20px; padding: 15px; background: #e8f5e9; border-radius: 8px; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>🔧 پنل مدیریت ربات</h1>
                <p>تنظیم چنل اجباری</p>
                <input type="text" id="channelInput" placeholder="مثال: @channel_username" />
                <br>
                <button onclick="setChannel()">تنظیم چنل</button>
                <button onclick="removeChannel()">حذف چنل</button>
                <div id="status" class="status">
                    <strong>وضعیت فعلی:</strong> ${data.forcedChannel ? `✅ ${data.forcedChannel}` : '❌ هیچ چنلی تنظیم نشده'}
                </div>
                <br><br>
                <hr>
                <p style="color: #666; font-size: 14px;">ربات باید ادمین چنل باشد تا کار کند</p>
            </div>
            <script>
                async function setChannel() {
                    const channel = document.getElementById('channelInput').value;
                    if (!channel) return alert('لطفاً نام چنل را وارد کنید!');
                    
                    const response = await fetch('/setchannel', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ channel })
                    });
                    const result = await response.json();
                    alert(result.message);
                    location.reload();
                }
                
                async function removeChannel() {
                    const response = await fetch('/setchannel', {
                        method: 'DELETE'
                    });
                    const result = await response.json();
                    alert(result.message);
                    location.reload();
                }
            </script>
        </body>
        </html>
    `);
});

// ===================== API تنظیم چنل =====================
app.post('/setchannel', express.json(), async (req, res) => {
    const { channel } = req.body;
    
    if (!channel) {
        return res.json({ success: false, message: 'لطفاً نام چنل را وارد کنید!' });
    }

    try {
        // بررسی اینکه ربات ادمین هست
        const botInfo = await bot.telegram.getMe();
        const chat = await bot.telegram.getChat(channel);
        const member = await bot.telegram.getChatMember(channel, botInfo.id);
        
        if (member.status !== 'administrator' && member.status !== 'creator') {
            return res.json({ success: false, message: '❌ ربات ادمین این کانال نیست!' });
        }

        data.forcedChannel = channel;
        saveData(data);
        res.json({ success: true, message: `✅ چنل ${channel} تنظیم شد!` });
    } catch (error) {
        res.json({ success: false, message: `❌ خطا: ${error.message}` });
    }
});

app.delete('/setchannel', (req, res) => {
    data.forcedChannel = null;
    saveData(data);
    res.json({ success: true, message: '✅ چنل اجباری حذف شد!' });
});

// ===================== راه‌اندازی =====================
app.listen(PORT, () => {
    console.log(`✅ وب‌سرور روی پورت ${PORT} در حال اجراست`);
    console.log(`🌐 پنل مدیریت: http://localhost:${PORT}`);
});

bot.launch()
    .then(() => {
        console.log('✅ ربات وایرگارد و DNS راه‌اندازی شد!');
        console.log('🛡️ برای شروع /start را بزنید.');
        console.log('📌 تنظیم چنل اجباری: /setchannel @channel_username');
    })
    .catch(err => console.error('❌ خطا:', err));

process.once('SIGINT', () => {
    console.log('⏹️ در حال توقف...');
    bot.stop('SIGINT');
    process.exit(0);
});

process.once('SIGTERM', () => {
    console.log('⏹️ در حال توقف...');
    bot.stop('SIGTERM');
    process.exit(0);
});

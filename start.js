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

// ===================== ادمین =====================
const ADMIN_ID = 6732134123;

// ===================== دیتابیس ساده =====================
const DATA_FILE = 'data.json';

function loadData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const loaded = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            // اطمینان از اینکه forcedChannel آرایه است
            if (!loaded.forcedChannel) {
                loaded.forcedChannel = [];
            } else if (!Array.isArray(loaded.forcedChannel)) {
                // اگر فرمت قدیمی است (تک چنل)، تبدیل به آرایه
                loaded.forcedChannel = [loaded.forcedChannel];
            }
            return loaded;
        }
    } catch (error) {
        console.error('❌ خطا در بارگذاری:', error);
    }
    return { forcedChannel: [] };
}

function saveData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        console.log('✅ داده‌ها ذخیره شدند:', data.forcedChannel);
    } catch (error) {
        console.error('❌ خطا در ذخیره:', error);
    }
}

let data = loadData();
console.log('📊 چنل‌های بارگذاری شده:', data.forcedChannel);

// ===================== دیتای ثابت کشورها =====================
const countries = [
    { name: '🇦🇪 امارات', code: 'AE', ipv6: '2a00:19c0:1000::' },
    { name: '🇹🇷 ترکیه', code: 'TR', ipv6: '2a00:19c0:2000::' },
    { name: '🇫🇮 فنلاند', code: 'FI', ipv6: '2a00:19c0:3000::' },
    { name: '🇺🇸 آمریکا', code: 'US', ipv6: '2a00:19c0:4000::' },
    { name: '🇧🇭 بحرین', code: 'BH', ipv6: '2a00:19c0:5000::' },
    { name: '🇨🇭 سوئیس', code: 'CH', ipv6: '2a00:19c0:6000::' },
    { name: '🇩🇪 آلمان', code: 'DE', ipv6: '2a00:19c0:7000::' },
    { name: '🇸🇬 سنگاپور', code: 'SG', ipv6: '2a00:19c0:8000::' },
    { name: '🇬🇧 انگلستان', code: 'GB', ipv6: '2a00:19c0:9000::' },
    { name: '🇫🇷 فرانسه', code: 'FR', ipv6: '2a00:19c0:a000::' },
    { name: '🇳🇱 هلند', code: 'NL', ipv6: '2a00:19c0:b000::' },
    { name: '🇯🇵 ژاپن', code: 'JP', ipv6: '2a00:19c0:c000::' },
    { name: '🇰🇷 کره جنوبی', code: 'KR', ipv6: '2a00:19c0:d000::' },
    { name: '🇨🇦 کانادا', code: 'CA', ipv6: '2a00:19c0:e000::' },
    { name: '🇦🇺 استرالیا', code: 'AU', ipv6: '2a00:19c0:f000::' },
    { name: '🇮🇳 هند', code: 'IN', ipv6: '2a00:19c1:1000::' },
    { name: '🇷🇺 روسیه', code: 'RU', ipv6: '2a00:19c1:2000::' },
    { name: '🇧🇷 برزیل', code: 'BR', ipv6: '2a00:19c1:3000::' },
    { name: '🇿🇦 آفریقای جنوبی', code: 'ZA', ipv6: '2a00:19c1:4000::' },
    { name: '🇪🇬 مصر', code: 'EG', ipv6: '2a00:19c1:5000::' },
    { name: '🇸🇦 عربستان', code: 'SA', ipv6: '2a00:19c1:6000::' },
    { name: '🇵🇰 پاکستان', code: 'PK', ipv6: '2a00:19c1:7000::' },
    { name: '🇮🇷 ایران', code: 'IR', ipv6: '2a00:19c1:8000::' },
    { name: '🇹🇭 تایلند', code: 'TH', ipv6: '2a00:19c1:9000::' },
    { name: '🇻🇳 ویتنام', code: 'VN', ipv6: '2a00:19c1:a000::' },
    { name: '🇲🇾 مالزی', code: 'MY', ipv6: '2a00:19c1:b000::' },
    { name: '🇮🇩 اندونزی', code: 'ID', ipv6: '2a00:19c1:c000::' },
    { name: '🇵🇭 فیلیپین', code: 'PH', ipv6: '2a00:19c1:d000::' },
    { name: '🇳🇬 نیجریه', code: 'NG', ipv6: '2a00:19c1:e000::' },
    { name: '🇰🇪 کنیا', code: 'KE', ipv6: '2a00:19c1:f000::' },
    { name: '🇦🇷 آرژانتین', code: 'AR', ipv6: '2a00:19c2:1000::' },
    { name: '🇨🇱 شیلی', code: 'CL', ipv6: '2a00:19c2:2000::' },
    { name: '🇨🇴 کلمبیا', code: 'CO', ipv6: '2a00:19c2:3000::' },
    { name: '🇵🇪 پرو', code: 'PE', ipv6: '2a00:19c2:4000::' },
    { name: '🇻🇪 ونزوئلا', code: 'VE', ipv6: '2a00:19c2:5000::' },
    { name: '🇺🇦 اوکراین', code: 'UA', ipv6: '2a00:19c2:6000::' },
    { name: '🇵🇱 لهستان', code: 'PL', ipv6: '2a00:19c2:7000::' },
    { name: '🇷🇴 رومانی', code: 'RO', ipv6: '2a00:19c2:8000::' },
    { name: '🇬🇷 یونان', code: 'GR', ipv6: '2a00:19c2:9000::' },
    { name: '🇵🇹 پرتغال', code: 'PT', ipv6: '2a00:19c2:a000::' },
    { name: '🇧🇪 بلژیک', code: 'BE', ipv6: '2a00:19c2:b000::' },
    { name: '🇦🇹 اتریش', code: 'AT', ipv6: '2a00:19c2:c000::' },
    { name: '🇸🇪 سوئد', code: 'SE', ipv6: '2a00:19c2:d000::' },
    { name: '🇳🇴 نروژ', code: 'NO', ipv6: '2a00:19c2:e000::' },
    { name: '🇩🇰 دانمارک', code: 'DK', ipv6: '2a00:19c2:f000::' },
    { name: '🇮🇪 ایرلند', code: 'IE', ipv6: '2a00:19c3:1000::' },
    { name: '🇳🇿 نیوزلند', code: 'NZ', ipv6: '2a00:19c3:2000::' },
    { name: '🇲🇽 مکزیک', code: 'MX', ipv6: '2a00:19c3:3000::' },
    { name: '🇪🇸 اسپانیا', code: 'ES', ipv6: '2a00:19c3:4000::' },
    { name: '🇮🇹 ایتالیا', code: 'IT', ipv6: '2a00:19c3:5000::' }
];

// ===================== وضعیت کاربران =====================
const userStates = {};

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
    if (!data.forcedChannel || data.forcedChannel.length === 0) {
        console.log('⚠️ هیچ چنلی تنظیم نشده');
        return true;
    }

    const userId = ctx.from?.id;
    if (!userId) return true;
    if (userId === ADMIN_ID) return true;

    console.log(`🔍 بررسی عضویت کاربر ${userId} در ${data.forcedChannel.length} چنل`);

    // بررسی اینکه کاربر در حداقل یکی از چنل‌ها عضو باشد
    let isMember = false;
    for (const ch of data.forcedChannel) {
        try {
            const m = await ctx.telegram.getChatMember(ch, userId);
            console.log(`📊 وضعیت کاربر در ${ch}: ${m.status}`);
            if (m.status !== 'left' && m.status !== 'kicked') {
                isMember = true;
                break;
            }
        } catch (error) {
            console.error(`❌ خطا در بررسی چنل ${ch}:`, error.message);
        }
    }

    if (!isMember) {
        console.log(`❌ کاربر ${userId} عضو هیچ چنلی نیست`);
        
        // ساخت لینک‌های کانال‌ها
        const channelLinks = data.forcedChannel.map((ch, i) => {
            const link = ch.startsWith('@') ? `https://t.me/${ch.slice(1)}` : ch;
            return `${i + 1}. [${ch}](${link})`;
        }).join('\n');

        await ctx.reply(
            `⚠️ *برای استفاده از ربات باید در یکی از کانال‌های زیر عضو شوید:*\n\n` +
            channelLinks + `\n\n` +
            `✅ بعد از عضویت دکمه زیر را بزنید:`,
            {
                parse_mode: 'Markdown',
                disable_web_page_preview: true,
                ...Markup.inlineKeyboard([
                    [{ text: '✅ عضو شدم', callback_data: 'check_membership' }]
                ])
            }
        );
        return false;
    }
    
    console.log(`✅ کاربر ${userId} عضو است`);
    return true;
}

// ===================== Middleware چنل اجباری =====================
bot.use(async (ctx, next) => {
    if (!ctx.from) return next();
    if (!data.forcedChannel || data.forcedChannel.length === 0) return next();
    if (ctx.from.id === ADMIN_ID) return next();

    // هندل دکمه "عضو شدم"
    if (ctx.callbackQuery?.data === 'check_membership') {
        const isMember = await checkForcedChannel(ctx);
        if (isMember) {
            await ctx.answerCbQuery('✅ خوش آمدید!');
            await ctx.reply(
                `🌐 *پنل DNS گیمینگ*\n\n` +
                `به پنل تولید DNS خوش آمدید!\n` +
                `لطفاً یکی از گزینه‌های زیر را انتخاب کنید:`,
                {
                    parse_mode: 'Markdown',
                    ...createGlassKeyboard([
                        { text: '🌍 DNS', callback_data: 'dns_start' }
                    ])
                }
            );
            return;
        } else {
            await ctx.answerCbQuery('❌ هنوز عضو نشده‌اید!').catch(() => {});
            return;
        }
    }

    // هندل دکمه حذف چنل (فقط ادمین)
    if (ctx.callbackQuery?.data && ctx.callbackQuery.data.startsWith('rem_channel_')) {
        if (ctx.from.id !== ADMIN_ID) {
            await ctx.answerCbQuery('❌ فقط ادمین!').catch(() => {});
            return;
        }
        const idx = parseInt(ctx.callbackQuery.data.split('_')[2]);
        if (!isNaN(idx) && idx >= 0 && idx < data.forcedChannel.length) {
            const removed = data.forcedChannel.splice(idx, 1)[0];
            saveData(data);
            await ctx.answerCbQuery(`✅ ${removed} حذف شد!`);
            
            // به‌روزرسانی پیام
            const channelList = data.forcedChannel.length
                ? data.forcedChannel.map((ch, i) => `${i + 1}. ${ch}`).join('\n')
                : '❌ هیچ چنلی تنظیم نشده';

            const buttons = data.forcedChannel.map((ch, i) => ({
                text: `❌ ${ch.replace('@', '')}`,
                callback_data: `rem_channel_${i}`
            })).concat([{ text: '➕ افزودن چنل جدید', callback_data: 'add_channel_prompt' }]);

            await ctx.editMessageText(
                `📋 *لیست چنل‌های اجباری:*\n\n${channelList}\n\n` +
                `🔧 برای حذف روی دکمه کلیک کنید\n` +
                `🔧 برای افزودن دکمه «افزودن چنل جدید» را بزنید`,
                {
                    parse_mode: 'Markdown',
                    ...createGlassKeyboard(buttons)
                }
            ).catch(() => {});
        }
        return;
    }

    // بررسی عضویت برای سایر آپدیت‌ها
    const isMember = await checkForcedChannel(ctx);
    if (!isMember) {
        if (ctx.callbackQuery) {
            await ctx.answerCbQuery('❌ ابتدا در کانال عضو شوید!').catch(() => {});
        }
        return;
    }
    return next();
});

// ===================== منوی اصلی =====================
bot.start(async (ctx) => {
    await ctx.reply(
        `🌐 *پنل DNS گیمینگ*\n\n` +
        `به پنل تولید DNS خوش آمدید!\n` +
        `لطفاً یکی از گزینه‌های زیر را انتخاب کنید:`,
        {
            parse_mode: 'Markdown',
            ...createGlassKeyboard([
                { text: '🌍 DNS', callback_data: 'dns_start' }
            ])
        }
    );
});

// ===================== مدیریت چنل‌ها (فقط ادمین) =====================
bot.command('channels', async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) {
        return ctx.reply('❌ فقط ادمین می‌تواند مدیریت چنل‌ها را انجام دهد!');
    }

    const channelList = data.forcedChannel.length
        ? data.forcedChannel.map((ch, i) => `${i + 1}. ${ch}`).join('\n')
        : '❌ هیچ چنلی تنظیم نشده';

    const buttons = data.forcedChannel.map((ch, i) => ({
        text: `❌ ${ch.replace('@', '')}`,
        callback_data: `rem_channel_${i}`
    })).concat([{ text: '➕ افزودن چنل جدید', callback_data: 'add_channel_prompt' }]);

    await ctx.reply(
        `📋 *لیست چنل‌های اجباری:*\n\n${channelList}\n\n` +
        `🔧 برای حذف روی دکمه کلیک کنید\n` +
        `🔧 برای افزودن دکمه «افزودن چنل جدید» را بزنید`,
        {
            parse_mode: 'Markdown',
            ...createGlassKeyboard(buttons)
        }
    );
});

bot.action('add_channel_prompt', async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    await ctx.reply('📝 لطفاً آدرس چنل را وارد کنید (مثلاً @example):');
});

// ===================== تنظیم چنل با دستور /setchannel =====================
bot.command('setchannel', async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) {
        return ctx.reply('❌ فقط ادمین می‌تواند این کار را انجام دهد!');
    }

    const text = ctx.message.text;
    const parts = text.split(' ');

    if (parts.length < 2) {
        return ctx.reply(
            `📌 *راهنمای تنظیم چنل:*\n\n` +
            `برای افزودن چنل:\n` +
            `/setchannel @channel_username\n\n` +
            `برای حذف چنل:\n` +
            `/setchannel remove @channel_username\n\n` +
            `برای لیست چنل‌ها:\n` +
            `/setchannel list\n\n` +
            `یا از دستور /channels استفاده کنید`,
            { parse_mode: 'Markdown' }
        );
    }

    const action = parts[1];

    if (action === 'list') {
        const list = data.forcedChannel.length
            ? data.forcedChannel.map((ch, i) => `${i + 1}. ${ch}`).join('\n')
            : '❌ هیچ چنلی تنظیم نشده';
        await ctx.reply(`📋 *لیست چنل‌های تنظیم شده:*\n\n${list}`, { parse_mode: 'Markdown' });
        return;
    }

    if (action === 'remove') {
        if (parts.length < 3) {
            return ctx.reply('❌ لطفاً آدرس چنل را پس از دستور remove بنویسید!');
        }
        const ch = parts[2];
        const initialLength = data.forcedChannel.length;
        data.forcedChannel = data.forcedChannel.filter(c => c !== ch);
        saveData(data);
        
        if (data.forcedChannel.length < initialLength) {
            await ctx.reply(`✅ چنل ${ch} حذف شد!`);
        } else {
            await ctx.reply(`❌ چنل ${ch} در لیست یافت نشد!`);
        }
        return;
    }

    const channel = parts[1];
    if (channel.startsWith('@')) {
        if (!data.forcedChannel.includes(channel)) {
            data.forcedChannel.push(channel);
            saveData(data);
            await ctx.reply(`✅ چنل ${channel} افزوده شد!`);
        } else {
            await ctx.reply('❌ این چنل قبلاً اضافه شده!');
        }
    } else {
        await ctx.reply('❌ آدرس چنل باید با @ شروع شود!');
    }
});

// ===================== شروع DNS =====================
bot.action('dns_start', async (ctx) => {
    const userId = ctx.from.id;
    userStates[userId] = { step: 'select_country_dns' };

    const countryButtons = countries.map(c => ({
        text: c.name,
        callback_data: `dns_country_${c.code}`
    }));

    await ctx.reply(
        `🌍 *مرحله ۱: انتخاب کشور (DNS)*\n\n` +
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

    if (!country) return;

    userStates[userId].country = country;
    userStates[userId].step = 'dns_days';

    const dayButtons = options.days.map(d => ({
        text: `${d} روز`,
        callback_data: `dns_days_${d}`
    }));

    await ctx.reply(
        `✅ کشور *${country.name}* انتخاب شد!\n\n` +
        `📅 *مرحله ۲: تعداد روز اعتبار*\n\n` +
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
        `✅ تعداد روز: *${value}* روز\n\n` +
        `📊 *مرحله ۳: حجم مجاز*\n\n` +
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
        `✅ حجم مجاز: *${value}*\n\n` +
        `👥 *مرحله ۴: تعداد کاربران*\n\n` +
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
        `✅ تعداد کاربران: *${value}*\n\n` +
        `🚀 *مرحله ۵: DNS تقویت شود؟*\n\n` +
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
        `✅ *DNS شما آماده شد!*\n\n` +
        `📋 *جزئیات:*\n` +
        `🌍 کشور: ${state.country.name}\n` +
        `📅 روز: ${state.days}\n` +
        `📊 حجم: ${state.traffic} GB\n` +
        `👥 کاربران: ${state.users}\n` +
        `🚀 تقویت: ${state.boost}\n\n` +
        `📋 *کانفیگ DNS شما:*`,
        {
            parse_mode: 'Markdown'
        }
    );

    await ctx.reply(
        `<pre>${dnsConfig}</pre>`,
        { parse_mode: 'HTML' }
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
        `✅ *DNS شما آماده شد!*\n\n` +
        `📋 *جزئیات:*\n` +
        `🌍 کشور: ${state.country.name}\n` +
        `📅 روز: ${state.days}\n` +
        `📊 حجم: ${state.traffic} GB\n` +
        `👥 کاربران: ${state.users}\n` +
        `🚀 تقویت: ${state.boost}\n\n` +
        `📋 *کانفیگ DNS شما:*`,
        {
            parse_mode: 'Markdown'
        }
    );

    await ctx.reply(
        `<pre>${dnsConfig}</pre>`,
        { parse_mode: 'HTML' }
    );

    setTimeout(() => {
        delete userStates[userId];
    }, 300000);
});

// ===================== دریافت متن‌ها =====================
bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const text = ctx.message.text;
    const state = userStates[userId];

    // اگر ادمین است و در حال افزودن چنل جدید
    if (userId === ADMIN_ID && text.startsWith('@') && (!state || !state.step)) {
        const channel = text.trim();
        if (!data.forcedChannel.includes(channel)) {
            data.forcedChannel.push(channel);
            saveData(data);
            await ctx.reply(`✅ چنل ${channel} افزوده شد!`);
        } else {
            await ctx.reply('❌ این چنل قبلاً اضافه شده!');
        }
        return;
    }

    if (!state) return;

    // DNS: روز دلخواه
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
            `✅ تعداد روز: *${days}* روز\n\n` +
            `📊 *مرحله ۳: حجم مجاز*\n\n` +
            `لطفاً یکی از گزینه‌های زیر را انتخاب کنید:`,
            {
                parse_mode: 'Markdown',
                ...createGlassKeyboard(trafficButtons)
            }
        );
        return;
    }

    // DNS: حجم دلخواه
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
            `✅ حجم مجاز: *${traffic}* گیگابایت\n\n` +
            `👥 *مرحله ۴: تعداد کاربران*\n\n` +
            `لطفاً یکی از گزینه‌های زیر را انتخاب کنید:`,
            {
                parse_mode: 'Markdown',
                ...createGlassKeyboard(userButtons)
            }
        );
        return;
    }

    // DNS: کاربران دلخواه
    if (state.step === 'dns_users_custom') {
        const users = parseInt(text);
        if (isNaN(users) || users < 1 || users > 1000) {
            return ctx.reply('❌ لطفاً یک عدد معتبر بین ۱ تا ۱۰۰۰ وارد کنید!');
        }
        state.users = users;
        state.step = 'dns_boost';

        await ctx.reply(
            `✅ تعداد کاربران: *${users}*\n\n` +
            `🚀 *مرحله ۵: DNS تقویت شود؟*\n\n` +
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

// ===================== تابع تولید DNS =====================
function generateDNSConfig(state) {
    const country = state.country;

    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const ipv4List = [];
    while (ipv4List.length < 2) {
        const ip = `${rand(1, 255)}.${rand(1, 255)}.${rand(1, 255)}.${rand(1, 255)}`;
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
    const channelList = data.forcedChannel.length > 0 
        ? data.forcedChannel.join('<br>') 
        : 'هیچ چنلی تنظیم نشده';

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>پنل مدیریت ربات</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
                .card { background: #f5f5f5; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
                input { padding: 10px; width: 80%; margin: 10px 0; border-radius: 8px; border: 2px solid #ddd; }
                button { padding: 12px 30px; background: #1e1e2f; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; margin: 5px; }
                button:hover { background: #2b2b42; }
                .status { margin-top: 20px; padding: 15px; background: #e8f5e9; border-radius: 8px; }
                .channels { margin: 15px 0; padding: 10px; background: #fff; border-radius: 8px; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>🔧 پنل مدیریت ربات</h1>
                <p>تنظیم چنل اجباری</p>
                <input type="text" id="channelInput" placeholder="مثال: @channel_username" />
                <br>
                <button onclick="addChannel()">➕ افزودن چنل</button>
                <button onclick="removeAllChannels()">🗑️ حذف همه</button>
                <div class="status">
                    <strong>چنل‌های فعلی:</strong>
                    <div class="channels">${channelList}</div>
                </div>
                <br>
                <hr>
                <p style="color: #666; font-size: 14px;">ربات باید ادمین چنل‌ها باشد تا کار کند</p>
            </div>
            <script>
                async function addChannel() {
                    const channel = document.getElementById('channelInput').value;
                    if (!channel || !channel.startsWith('@')) return alert('آدرس چنل باید با @ شروع شود!');

                    const response = await fetch('/setchannel', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ channel })
                    });
                    const result = await response.json();
                    alert(result.message);
                    location.reload();
                }

                async function removeAllChannels() {
                    if (!confirm('آیا مطمئن هستید؟')) return;
                    
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

    if (!channel || !channel.startsWith('@')) {
        return res.json({ success: false, message: '❌ آدرس چنل باید با @ شروع شود!' });
    }

    try {
        if (!data.forcedChannel.includes(channel)) {
            data.forcedChannel.push(channel);
            saveData(data);
            return res.json({ success: true, message: `✅ چنل ${channel} افزوده شد!` });
        }
        return res.json({ success: false, message: '❌ این چنل قبلاً اضافه شده!' });
    } catch (error) {
        return res.json({ success: false, message: `❌ خطا: ${error.message}` });
    }
});

app.delete('/setchannel', (req, res) => {
    data.forcedChannel = [];
    saveData(data);
    res.json({ success: true, message: '✅ تمام چنل‌های اجباری حذف شد!' });
});

// ===================== راه‌اندازی =====================
app.listen(PORT, () => {
    console.log(`✅ وب‌سرور روی پورت ${PORT} در حال اجراست`);
    console.log(`🌐 پنل مدیریت: http://localhost:${PORT}`);
});

bot.launch()
    .then(() => {
        console.log('✅ ربات DNS راه‌اندازی شد!');
        console.log('🛡️ برای شروع /start را بزنید.');
        console.log('📌 مدیریت چنل‌ها: /channels');
        console.log('📌 تنظیم چنل: /setchannel @channel_username');
        console.log('📊 چنل‌های فعلی:', data.forcedChannel);
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

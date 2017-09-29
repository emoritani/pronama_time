'use strict';

let alarm_flag = true;

chrome.browserAction.onClicked.addListener(() => {
    if (alarm_flag) {
        alarm_flag = false;
        chrome.browserAction.setIcon({path: "icon/icon128_white.png"});
        chrome.alarms.clearAll();
    } else {
        alarm_flag = true;
        chrome.browserAction.setIcon({path: "icon/icon128.png"});
        run();
    }
});

function alarms_create() {
    chrome.alarms.create('ALARM', {
        when: Date.now() + 1000 * 60 - (Date.now() % (1000 * 60 * 60))
    });
}

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name == 'ALARM' && alarm_flag) {
        run();
    }
});

function run() {
    const dt = new Date();
    const hour = dt.getHours();
    const minute = dt.getMinutes();

    notify(hour, minute);
    audio_play(hour, minute);
}

function notify(hour, minute) {
    const msg = [
        "0時だ～日付変わっちゃった",
        "1時～そろそろ寝る～？",
        "2時！ えっ？ まだ寝ないよ",
        "3時でーす もしもし…",
        "4時…",
        "5時～",
        "6時",
        "7時！ さぁ起きた起きた～",
        "8時！ ほら早く起きなよ～",
        "9時！ はりきっていこう！",
        "10時！ さーこれからだー！",
        "11時！ そうその調子！",
        "12時！ あ～お腹減ったぁ",
        "13時 聞こえない？",
        "14時！ あ～お腹いっぱい～",
        "15時…",
        "16時！ さぁバリバリいくよ～",
        "17時！ 日が沈んでくるかな",
        "18時！ お疲れ様！",
        "19時！ よーしゆっくり休むぞ～",
        "20時！ あ、20時！",
        "21時！ さーてプログラミングするかな～",
        "22時！ テンションあがってきたー！",
        "23時！ ひゃっほう！"
    ];

    const opt = {
        iconUrl: "icon/icon128.png",
        type: 'list',
        title: hour + "時" + minute + "分",
        message: '',
        priority: 1,
        items: [
            {
                title: msg[hour],
                message: ''
            }
        ]
    };
    chrome.notifications.create('k_notification', opt);
}

function audio_play(hour, minute) {
    const hour_src = `voice/kei2_voice_${("00"+(hour + 56)).slice(-3)}.wav`;
    const minute_src = `voice/kei2_voice_${("00"+(minute + 106)).slice(-3)}.wav`;

    const hour_audio = new Audio(hour_src);
    const minute_audio = new Audio(minute_src);

    if (minute == 0) {
        const just_time = "voice/kei2_voice_" + ("00" + (hour + 81)).slice(-3) + ".wav";
        const just_audio = new Audio(just_time);
        just_audio.play();
        just_audio.addEventListener("ended", () => {
            chrome.notifications.clear('k_notification');
        }, false);
    } else {
        hour_audio.play();
        hour_audio.addEventListener("ended", () => {
            minute_audio.play();
        }, false);
        minute_audio.addEventListener("ended", () => {
            chrome.notifications.clear('k_notification');
        }, false);
    }
    alarms_create();
}

alarms_create();

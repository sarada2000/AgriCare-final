/* AgriCare – pests and animals that damage paddy in Sri Lanka.
   Each entry has an original illustration (drawn below with SVG) showing the animal and how it attacks.
   To show a real photo instead, put a JPG at img/pests/<id>.jpg (e.g. img/pests/brown_planthopper.jpg). */

const PEST_ART = (() => {
    const W = 200, H = 140;
    const sky = (a = "#e3ecd6", b = "#c8dab3") =>
        `<rect width="${W}" height="${H}" fill="${b}"/><rect width="${W}" height="${H * 0.55}" fill="${a}"/>`;
    const water = (y = 118) => `<rect y="${y}" width="${W}" height="${H - y}" fill="#8fb3c9"/><path d="M0 ${y + 6} q12 -4 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0" stroke="#b9d3e2" stroke-width="1.5" fill="none"/>`;
    const soil = (y = 118) => `<rect y="${y}" width="${W}" height="${H - y}" fill="#8a6a45"/><rect y="${y}" width="${W}" height="4" fill="#9c7a52"/>`;
    // a clump of paddy stems
    const clump = (x, base, h, color = "#4f8a2a", spread = 16) => {
        let s = "";
        [-1, -0.5, 0, 0.5, 1].forEach((k, i) => {
            const tx = x + k * spread, th = h * (i % 2 ? 0.88 : 1);
            s += `<path d="M${x + k * 3} ${base} Q${x + k * spread * 0.6} ${base - th * 0.6} ${tx} ${base - th}" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
        });
        return s;
    };
    const lens = (cx, cy, r, inner) =>
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fbfaf2" stroke="#3b3a33" stroke-width="2.5"/>
         ${inner}
         <line x1="${cx - r * 0.7}" y1="${cy + r * 0.7}" x2="${cx - r * 1.15}" y2="${cy + r * 1.15}" stroke="#3b3a33" stroke-width="4" stroke-linecap="round"/>`;
    const wrap = body => `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img">${body}</svg>`;

    return {
        brown_planthopper: () => wrap(sky() + water() +
            clump(55, 120, 92) + clump(60, 120, 50, "#c9a24a", 12) + clump(125, 120, 96) +
            // hoppers crowding the base of the stems
            [[52, 108], [57, 100], [61, 111], [49, 96], [122, 104], [128, 110], [125, 97]].map(([x, y]) =>
                `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="5" fill="#7a4a1f"/><ellipse cx="${x + 1}" cy="${y + 1}" rx="1.6" ry="4" fill="#c9a77a" opacity=".8"/>`).join("") +
            lens(162, 40, 30,
                `<path d="M147 44 Q164 26 186 40 Q170 48 147 46Z" fill="#d8c09a" stroke="#8a6a3a"/>
                 <ellipse cx="160" cy="45" rx="14" ry="5.5" fill="#8a5a2b"/>
                 <ellipse cx="145" cy="44" rx="5.5" ry="5" fill="#a0703a"/><circle cx="142.5" cy="42" r="1.8" fill="#2a160a"/>
                 <path d="M150 49 l-4 8 M156 50 l-1 9 M164 50 l3 8" stroke="#6b4421" stroke-width="1.4"/>`)),

        gall_midge: () => wrap(sky() + water() +
            clump(70, 120, 85) + clump(140, 120, 88) +
            `<rect x="65" y="40" width="10" height="80" rx="5" fill="#ecebd8" stroke="#b7b398"/>
             <rect x="135" y="52" width="9" height="68" rx="4.5" fill="#ecebd8" stroke="#b7b398"/>` +
            `<g transform="translate(150 34) rotate(-12)">
                <ellipse cx="0" cy="0" rx="13" ry="3.2" fill="#c0502a"/><circle cx="-14" cy="-1" r="3.4" fill="#8a3a1c"/>
                <ellipse cx="2" cy="-8" rx="12" ry="4.5" fill="#dfe6ea" opacity=".85" transform="rotate(-20)"/>
                <ellipse cx="4" cy="-6" rx="11" ry="4" fill="#cdd6db" opacity=".75" transform="rotate(10)"/>
                <path d="M-8 2 l-8 12 M-3 3 l-3 15 M3 3 l4 15 M8 2 l10 12" stroke="#5b2a14" stroke-width="1"/>
                <path d="M-17 -3 q-6 -8 -10 -9 M-17 -1 q-8 -3 -12 -2" stroke="#5b2a14" stroke-width="1" fill="none"/>
             </g>`),

        paddy_bug: () => wrap(sky() + soil() +
            `<path d="M40 130 Q70 50 140 34" stroke="#7c8f3a" stroke-width="3.5" fill="none"/>` +
            [[70, 72], [80, 60], [92, 50], [104, 43], [116, 38], [128, 35], [86, 66], [100, 55], [113, 48]].map(([x, y], i) =>
                `<ellipse cx="${x}" cy="${y + 7}" rx="3.4" ry="6" fill="${i % 4 === 1 ? "#8a6a3a" : "#d9c46a"}" transform="rotate(25 ${x} ${y + 7})"/>`).join("") +
            `<g transform="translate(120 70) rotate(-28)">
                <ellipse cx="0" cy="0" rx="20" ry="3.8" fill="#7b8b3a"/><ellipse cx="-21" cy="0" rx="4" ry="3" fill="#6a7a30"/>
                <path d="M-24 -1 q-10 -10 -16 -20 M-24 1 q-14 -2 -24 -10" stroke="#55611f" stroke-width="1.2" fill="none"/>
                <path d="M-10 3 l-6 12 M0 4 l0 14 M10 3 l8 12 M-10 -3 l-6 -10 M2 -4 l2 -12" stroke="#55611f" stroke-width="1.2"/>
                <path d="M-18 0 l-4 6" stroke="#55611f" stroke-width="1.6"/>
             </g>`),

        leaf_folder: () => wrap(sky() + water() + clump(150, 120, 80) +
            `<path d="M20 120 Q70 90 175 25 Q90 75 32 124Z" fill="#5e9a32"/>
             <path d="M58 98 Q100 70 140 46 L146 54 Q104 80 64 106Z" fill="#7fb24a" stroke="#4f8a2a"/>
             <path d="M70 99 L130 59 M78 98 L134 63 M86 95 L124 70" stroke="#f2f4e6" stroke-width="2" stroke-linecap="round" opacity=".9"/>
             <g fill="#9ccc5e" stroke="#5f8f2c">${[0, 1, 2, 3, 4].map(i => `<circle cx="${148 + i * 6}" cy="${49 - i * 3}" r="${4 - i * 0.3}"/>`).join("")}<circle cx="178" cy="34" r="3.6" fill="#7a5a2a"/></g>
             <g transform="translate(60 40)"><path d="M0 0 L-16 -8 L-14 8Z M0 0 L16 -8 L14 8Z" fill="#e8c860" stroke="#8a6a20"/><path d="M-13 -4 l10 4 M13 -4 l-10 4" stroke="#6b4a10" stroke-width="1.2"/><ellipse cx="0" cy="0" rx="2.2" ry="7" fill="#9b7a2a"/></g>`),

        stem_borer: () => wrap(sky() + water() +
            clump(50, 120, 84) + clump(160, 120, 86) +
            `<path d="M104 120 L104 40" stroke="#c9c39a" stroke-width="5"/>
             <path d="M104 42 Q120 30 132 44 M104 46 Q118 40 126 54 M104 44 Q92 34 84 46" stroke="#efece0" stroke-width="2.5" fill="none"/>
             ${[[124, 38], [130, 46], [118, 44], [122, 54], [90, 42], [86, 48]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="4" fill="#f4f1e4" stroke="#cfc9ad"/>`).join("")}
             <rect x="96" y="76" width="16" height="34" rx="4" fill="#f3efd8" stroke="#8f8a66"/>
             <g fill="#f6e8c4" stroke="#b49a5e">${[0, 1, 2, 3, 4].map(i => `<circle cx="104" cy="${82 + i * 5.5}" r="3.4"/>`).join("")}</g>
             <circle cx="104" cy="80" r="3" fill="#8a5a2a"/>
             <g transform="translate(160 22)"><path d="M0 0 L-20 8 L-4 10Z M0 0 L20 8 L4 10Z" fill="#f2e7a8" stroke="#a89a50"/><circle cx="-11" cy="7" r="1.8" fill="#2a2a20"/><circle cx="11" cy="7" r="1.8" fill="#2a2a20"/><ellipse cx="0" cy="6" rx="2.5" ry="7" fill="#d8c87a"/></g>`),

        thrips: () => wrap(sky() + water(112) +
            [30, 52, 74, 96].map(x =>
                `<path d="M${x} 114 Q${x - 2} 92 ${x - 8} 78" stroke="#5e9a32" stroke-width="3" fill="none"/>
                 <path d="M${x - 8} 78 q-4 -6 1 -9" stroke="#b49a5e" stroke-width="3" fill="none" stroke-linecap="round"/>
                 <path d="M${x + 1} 114 Q${x + 4} 96 ${x + 10} 86" stroke="#5e9a32" stroke-width="3" fill="none"/>
                 <path d="M${x + 10} 86 q5 -4 2 -9" stroke="#c9b88a" stroke-width="3" fill="none" stroke-linecap="round"/>`).join("") +
            lens(152, 48, 32,
                `<ellipse cx="152" cy="50" rx="18" ry="3.6" fill="#4a3220" transform="rotate(-15 152 50)"/>
                 <ellipse cx="134" cy="54" rx="3.4" ry="3" fill="#3a2414"/>
                 <path d="M146 46 l20 -14 M150 45 l22 -12" stroke="#7a6a5a" stroke-width="1"/>
                 ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${150 + i * 3.5} ${41 - i * 2.2} l-2 -5" stroke="#9a8a7a" stroke-width=".7"/>`).join("")}
                 <path d="M131 52 l-6 -6 M131 55 l-7 -2" stroke="#3a2414" stroke-width="1"/>`)),

        green_leafhopper: () => wrap(sky() + water() +
            clump(40, 120, 70, "#c9b23a") + clump(160, 120, 74, "#d9a83a") +
            `<path d="M70 118 Q100 70 150 40 Q110 76 82 120Z" fill="#5e9a32"/>
             <g transform="translate(112 74) rotate(-35)">
                <path d="M-18 0 Q-14 -7 4 -6 L18 0 L4 6 Q-14 7 -18 0Z" fill="#6abf3a" stroke="#3f7a1f"/>
                <path d="M-2 -6 L-2 6" stroke="#3f7a1f" stroke-width=".8"/>
                <circle cx="10" cy="-2" r="1.6" fill="#1e2a12"/><circle cx="10" cy="2" r="1.6" fill="#1e2a12"/>
                <circle cx="-17" cy="-1.6" r="1.4" fill="#e85a3a"/><circle cx="-17" cy="1.6" r="1.4" fill="#e85a3a"/>
             </g>
             <path d="M120 60 q8 -6 14 -4" stroke="#6abf3a" stroke-width="2" fill="none" stroke-dasharray="3 3"/>`),

        rats: () => wrap(sky() + soil(112) +
            clump(36, 114, 78) +
            [70, 84, 160, 174].map((x, i) =>
                `<path d="M${x} 114 L${x + 2} ${84 + i % 2 * 6}" stroke="#4f8a2a" stroke-width="3"/>
                 <path d="M${x - 2} ${86 + i % 2 * 6} l8 -5" stroke="#4f8a2a" stroke-width="2.4"/>
                 <path d="M${x + 6} 116 l18 -5" stroke="#9fb36a" stroke-width="2.4"/>`).join("") +
            `<ellipse cx="190" cy="122" rx="12" ry="6" fill="#3a2a1a"/>
             <path d="M96 108 Q70 112 56 126 Q48 132 40 130" stroke="#8f8579" stroke-width="3" fill="none" stroke-linecap="round"/>
             <ellipse cx="118" cy="104" rx="26" ry="14" fill="#7d7468"/>
             <ellipse cx="146" cy="99" rx="13" ry="8.5" fill="#857b6e" transform="rotate(-12 146 99)"/>
             <circle cx="139" cy="89" r="6" fill="#9a8f82"/><circle cx="139" cy="89" r="3.5" fill="#d9a7a0"/>
             <circle cx="150" cy="96" r="1.8" fill="#111"/><circle cx="159" cy="98" r="2" fill="#d98a80"/>
             <path d="M157 99 l10 -2 M157 100 l10 2" stroke="#5a524a" stroke-width=".8"/>
             <path d="M104 116 l-3 6 M126 117 l2 6 M138 108 l5 8" stroke="#6a6258" stroke-width="3" stroke-linecap="round"/>`),

        birds: () => wrap(sky("#dfeaf2", "#c8dab3") + soil(124) +
            `<path d="M30 130 Q60 40 120 52" stroke="#a69a4a" stroke-width="3" fill="none"/>` +
            [[56, 74], [66, 64], [78, 57], [90, 53], [102, 52], [72, 70], [86, 62]].map(([x, y]) =>
                `<ellipse cx="${x}" cy="${y + 8}" rx="3" ry="5.5" fill="#e0c770" transform="rotate(20 ${x} ${y + 8})"/>`).join("") +
            `<g transform="translate(118 74)">
                <path d="M14 4 l16 8 l-2 -6Z" fill="#4a3322"/>
                <ellipse cx="0" cy="0" rx="17" ry="14" fill="#6b4a2e"/>
                <ellipse cx="2" cy="5" rx="11" ry="8" fill="#f1ebe0"/>
                ${[[-4, 2], [2, 2], [8, 2], [-1, 7], [5, 7]].map(([x, y]) => `<path d="M${x - 2} ${y} q2 2 4 0" stroke="#6b4a2e" stroke-width="1" fill="none"/>`).join("")}
                <circle cx="-14" cy="-10" r="9" fill="#3f2a1a"/>
                <path d="M-22 -12 L-31 -8 L-22 -6Z" fill="#7d93a3"/>
                <circle cx="-15" cy="-12" r="1.6" fill="#000"/>
                <path d="M-4 13 l-2 9 M4 13 l2 9" stroke="#8a7a6a" stroke-width="1.6"/>
             </g>
             <path d="M150 26 q6 -6 12 0 q6 -6 12 0" stroke="#4a3322" stroke-width="2.2" fill="none"/>
             <path d="M168 44 q4 -4 8 0 q4 -4 8 0" stroke="#4a3322" stroke-width="2" fill="none"/>`),

        peafowl: () => wrap(sky() + soil(118) +
            [150, 168, 186].map(x => clump(x, 120, 34, "#6aa83a", 6)).join("") +
            `<g>${Array.from({ length: 9 }, (_, i) => {
                const a = -18 + i * 6, x = 20 + i * 4, y = 100 + (i - 4) * 3.2;
                return `<ellipse cx="${x + 30}" cy="${y}" rx="34" ry="6" fill="#2f7a4a" transform="rotate(${a * 0.4} ${x + 30} ${y})"/>
                        <circle cx="${x + 2}" cy="${y}" r="5" fill="#d8b23a"/><circle cx="${x + 2}" cy="${y}" r="3" fill="#1f5fb0"/><circle cx="${x + 2}" cy="${y}" r="1.4" fill="#0b1f3a"/>`;
            }).join("")}</g>
             <ellipse cx="104" cy="98" rx="22" ry="13" fill="#1f5fb0"/>
             <path d="M112 90 Q122 70 118 52" stroke="#1f5fb0" stroke-width="9" fill="none" stroke-linecap="round"/>
             <circle cx="119" cy="50" r="6.5" fill="#2a6fc4"/>
             <path d="M124 50 l7 2 l-7 2Z" fill="#c9b48a"/>
             <circle cx="121" cy="48" r="1.4" fill="#fff"/>
             <path d="M117 44 l-3 -9 M119 44 l0 -10 M121 44 l3 -9" stroke="#1f5fb0" stroke-width="1"/>
             <circle cx="114" cy="35" r="1.8" fill="#2a6fc4"/><circle cx="119" cy="34" r="1.8" fill="#2a6fc4"/><circle cx="124" cy="35" r="1.8" fill="#2a6fc4"/>
             <path d="M100 110 l-2 10 M110 110 l2 10" stroke="#9a8a6a" stroke-width="2.2"/>
             <path d="M131 104 l4 -8 M135 104 l2 -9" stroke="#4f8a2a" stroke-width="2"/>`),

        wild_boar: () => wrap(sky("#d9dfcf", "#b9c79f") + soil(112) +
            `<ellipse cx="40" cy="116" rx="20" ry="7" fill="#6a4c2c"/><ellipse cx="168" cy="118" rx="18" ry="6" fill="#6a4c2c"/>
             <path d="M30 112 l-6 -14 M36 112 l2 -16 M44 113 l8 -12" stroke="#6a8a3a" stroke-width="2.4"/>
             <path d="M160 116 l-10 -10 M170 117 l4 -14" stroke="#8a9a4a" stroke-width="2.4"/>
             <path d="M72 82 l4 -8 l4 6 l4 -8 l4 6 l4 -8 l4 6 l4 -8 l4 6 l4 -6 l3 6" stroke="#2e2924" stroke-width="2.4" fill="none"/>
             <ellipse cx="96" cy="94" rx="40" ry="20" fill="#3b3530"/>
             <path d="M130 84 L152 98 L158 106 L136 110 Z" fill="#45403a"/>
             <ellipse cx="157" cy="106" rx="4" ry="4" fill="#5a524a"/>
             <path d="M146 104 q6 -8 2 -14" stroke="#f1ead8" stroke-width="2.6" fill="none" stroke-linecap="round"/>
             <path d="M130 87 l3 -12 l7 9Z" fill="#2e2924"/><circle cx="140" cy="92" r="1.8" fill="#e8d8b8"/>
             <rect x="68" y="108" width="7" height="12" fill="#2e2924"/><rect x="82" y="110" width="7" height="11" fill="#2e2924"/>
             <rect x="108" y="110" width="7" height="11" fill="#2e2924"/><rect x="120" y="108" width="7" height="12" fill="#2e2924"/>
             <path d="M57 92 q-8 -2 -6 -10" stroke="#2e2924" stroke-width="2" fill="none"/>`),

        elephant: () => wrap(`<rect width="200" height="140" fill="#1e2b45"/><rect y="70" width="200" height="70" fill="#22331f"/>
             <circle cx="168" cy="26" r="12" fill="#f3efd2"/><circle cx="172" cy="23" r="11" fill="#1e2b45"/>
             ${[[30, 12], [60, 22], [120, 14], [140, 34], [20, 40]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.1" fill="#dfe6f2"/>`).join("")}
             <ellipse cx="88" cy="78" rx="44" ry="28" fill="#6f6f73"/>
             <circle cx="132" cy="66" r="20" fill="#77777b"/>
             <ellipse cx="122" cy="68" rx="13" ry="17" fill="#636367"/>
             <path d="M147 70 Q156 92 150 110 Q148 116 154 118" stroke="#77777b" stroke-width="9" fill="none" stroke-linecap="round"/>
             <circle cx="138" cy="60" r="2" fill="#111"/>
             <rect x="56" y="96" width="14" height="28" rx="4" fill="#6f6f73"/><rect x="76" y="98" width="14" height="26" rx="4" fill="#666669"/>
             <rect x="104" y="96" width="14" height="28" rx="4" fill="#6f6f73"/><rect x="118" y="98" width="13" height="26" rx="4" fill="#666669"/>
             <path d="M44 72 q-8 10 -4 22" stroke="#6f6f73" stroke-width="3" fill="none"/>` +
            [10, 26, 160, 176, 190].map(x => clump(x, 140, 30, "#4f7a2a", 5)).join("") +
            `<path d="M150 116 l-4 -10 M154 117 l4 -10" stroke="#8aa04a" stroke-width="2.2"/>`)
    };
})();

const PESTS = [
    {
        id: "brown_planthopper", group: "insect", sci: "Nilaparvata lugens",
        name: { en: "Brown Planthopper (BPH)", si: "දුඹුරු පැල කීඩෑවා", ta: "பழுப்புத் தத்துப்பூச்சி" },
        summary: {
            en: "Tiny brown insects that crowd at the base of the plants and suck the sap. Large numbers make whole patches of the field dry up and collapse (hopperburn).",
            si: "පැළයේ පාමුල රැස්ව යුෂ උරා බොන කුඩා දුඹුරු කෘමීන්. ගණන වැඩි වූ විට කුඹුරේ කොටස් වියළී ඇද වැටේ (හොපර් බර්න්).",
            ta: "பயிரின் அடிப்பகுதியில் கூட்டமாகச் சாறு உறிஞ்சும் சிறிய பழுப்புப் பூச்சிகள். அதிகமானால் வயலின் பகுதிகள் காய்ந்து சரியும் (ஹாப்பர் பர்ன்)."
        },
        attack: ["Adults and young hoppers sit just above the water line and suck sap from the stems", "The plants turn yellow, then brown and dry from the bottom up", "Damage spreads in round patches that grow day by day", "It can also spread grassy stunt and ragged stunt virus diseases"],
        signs: ["Round yellow-brown patches of dried plants", "Many small brown insects when you part the plants and tap the base", "Sooty black mould on the lower stems"],
        manage: ["Drain the field for 3–4 days to make the base of the plants dry", "Stop extra urea", "If you count about 10 or more hoppers per plant clump, spray buprofezin or pymetrozine at the label dose, aimed at the base of the plants", "Do not spray the wrong chemicals: they kill spiders and other natural enemies and BPH comes back worse"],
        prevent: ["Grow a BPH-resistant variety recommended for your area", "Use the recommended spacing so air and light reach the base", "Apply nitrogen in split doses", "Check the base of the plants every week from tillering"]
    },
    {
        id: "gall_midge", group: "insect", sci: "Orseolia oryzae",
        name: { en: "Rice Gall Midge", si: "ගොබ මැස්සා", ta: "ஆனைக்கொம்பன் ஈ" },
        summary: {
            en: "A small mosquito-like fly. Its maggot feeds inside the growing tiller, which turns into a pale hollow tube (silver shoot) that never makes a panicle.",
            si: "මදුරුවෙකු වැනි කුඩා මැස්සෙකි. එහි කීටයා වැඩෙන දල්ල ඇතුළත කන අතර දල්ල කරලක් නොහදන සුදුමැලි නළයක් (රිදී දල්ල) බවට පත් වේ.",
            ta: "கொசு போன்ற சிறிய ஈ. இதன் புழு வளரும் தூருக்குள் உண்பதால் அது கதிர் வராத வெளிறிய குழாயாக (வெள்ளித் தூர்) மாறும்."
        },
        attack: ["The female lays eggs on the leaves at night", "The maggot crawls down to the growing point of the tiller", "Instead of a new leaf, the plant grows a long pale tube like an onion leaf", "That tiller never produces grain"],
        signs: ["Pale, hollow, tube-like shoots (silver shoots or 'onion leaves')", "Many tillers but few panicles", "Worse in the wet Maha season and in late-planted fields"],
        manage: ["Remove and destroy silver shoots early", "Do not spray now – spraying after the tubes have formed does not help. Remove silver shoots and plan prevention for the next crop"],
        prevent: ["Grow a gall midge-resistant variety in areas where it is common", "Plant at the same time as neighbouring fields; avoid late planting", "Remove wild grasses and volunteer rice around the field"]
    },
    {
        id: "paddy_bug", group: "insect", sci: "Leptocorisa oratoria",
        name: { en: "Rice Bug (Paddy Bug)", si: "වී මකුණා", ta: "கதிர் நாவாய்ப் பூச்சி" },
        summary: {
            en: "A slender greenish-brown bug with long legs and a strong smell. It sucks the milk from developing grains, leaving them empty or spotted.",
            si: "දිගු කකුල් සහ තද ගඳක් ඇති සිහින් කොළ-දුඹුරු මකුණෙකි. වැඩෙන ඇටවල කිරි උරා බීමෙන් ඇට හිස් හෝ ලප සහිත වේ.",
            ta: "நீண்ட கால்களும் கடுமையான மணமும் கொண்ட மெல்லிய பச்சை-பழுப்பு நாவாய்ப் பூச்சி. வளரும் மணிகளின் பாலை உறிஞ்சுவதால் மணிகள் பதராகும் அல்லது புள்ளியுடன் இருக்கும்."
        },
        attack: ["Bugs fly in from grassy areas when the crop flowers", "Adults and nymphs pierce the grains at the milk stage and suck them dry", "Damaged grains stay empty or get brown spots and break when milled"],
        signs: ["A bad smell in the field", "Many empty or spotted grains on the panicle", "Bugs on the panicles in the early morning and evening"],
        manage: ["Check panicles from flowering to the milk stage, early morning or evening", "If bugs are many, spray an insecticide whose label says 'paddy bug', in the early morning or late evening, at the label dose"],
        prevent: ["Clear grassy weeds on bunds and around the field before flowering", "Plant at the same time as neighbours so the crop flowers together"]
    },
    {
        id: "leaf_folder", group: "insect", sci: "Cnaphalocrocis medinalis",
        name: { en: "Rice Leaf Folder", si: "කොළ හකුළන දළඹුවා", ta: "இலை சுருட்டுப் புழு" },
        summary: {
            en: "The green caterpillar of a small yellow moth. It folds a leaf into a tube and scrapes the green from inside, leaving white streaks.",
            si: "කුඩා කහ සලබයෙකුගේ කොළ පැහැති දළඹුවා. කොළය නළයක් ලෙස නවා ඇතුළතින් කොළ පැහැය සූරා කන නිසා සුදු ඉරි ඇති වේ.",
            ta: "சிறிய மஞ்சள் அந்துப்பூச்சியின் பச்சைப் புழு. இலையைக் குழாயாகச் சுருட்டி உள்ளே பச்சையைச் சுரண்டுவதால் வெள்ளைக் கோடுகள் தோன்றும்."
        },
        attack: ["The moth lays eggs on the leaves", "The caterpillar folds the leaf lengthwise with silk threads", "It feeds inside the fold, scraping off the green part", "Leaves turn white and papery and the plant makes less food"],
        signs: ["Leaves folded into tubes", "White, see-through streaks on leaves", "Small yellow moths with dark bands flying up when you walk in the field"],
        manage: ["Light damage usually does not reduce the harvest – do not spray too early", "If many top leaves are damaged before flowering, spray chlorantraniliprole (or another insecticide labelled for leaf folder) at the label dose"],
        prevent: ["Avoid too much nitrogen fertilizer", "Protect spiders, dragonflies and wasps that eat leaf folders – avoid unnecessary sprays"]
    },
    {
        id: "stem_borer", group: "insect", sci: "Scirpophaga incertulas",
        name: { en: "Yellow Stem Borer", si: "කහ කඳ පණුවා", ta: "மஞ்சள் தண்டுத் துளைப்பான்" },
        summary: {
            en: "The caterpillar of a pale yellow moth bores into the stem. Young plants get a dead centre shoot (deadheart); older plants get empty white panicles (whiteheads).",
            si: "සුදුමැලි කහ සලබයෙකුගේ දළඹුවා කඳ ඇතුළට විද යයි. ළපටි පැළවල මැද දල්ල මැරේ (මළ දල්ල); වැඩුණු පැළවල හිස් සුදු කරල් ඇති වේ.",
            ta: "வெளிர் மஞ்சள் அந்துப்பூச்சியின் புழு தண்டுக்குள் துளைக்கிறது. இளம் பயிரில் நடுத்தூர் காய்கிறது (டெட்ஹார்ட்); முதிர்ந்த பயிரில் வெற்று வெள்ளைக் கதிர்கள் வருகின்றன."
        },
        attack: ["The moth lays egg masses near the leaf tips", "Caterpillars bore into the stem and eat it from inside", "Before flowering: the centre shoot dies (deadheart)", "After flowering: the panicle turns white and empty (whitehead)"],
        signs: ["Dead centre shoots that pull out easily", "White, empty, upright panicles", "Small holes in the stem and egg masses covered with light brown hairs on leaf tips"],
        manage: ["Collect and destroy egg masses from leaf tips", "Pull out and destroy deadhearts", "If many tillers are damaged, apply chlorantraniliprole (or another insecticide labelled for stem borer) at the label dose"],
        prevent: ["After harvest, cut the stubble close to the ground and plough it in", "Plant at the same time as neighbouring fields", "Light traps can show when moths are flying"]
    },
    {
        id: "thrips", group: "insect", sci: "Stenchaetothrips biformis",
        name: { en: "Rice Thrips", si: "වී තිරිප්ස්", ta: "நெல் இலைப்பேன்" },
        summary: {
            en: "Very tiny insects that attack young seedlings in dry weather. Leaf tips roll and dry, and the field looks pale.",
            si: "වියළි කාලගුණයේදී ළපටි පැළවලට පහර දෙන ඉතා කුඩා කෘමීන්. කොළ අග රෝල් වී වියළෙන අතර කුඹුර සුදුමැලි ලෙස පෙනේ.",
            ta: "வறண்ட காலத்தில் இளம் நாற்றுகளைத் தாக்கும் மிகச் சிறிய பூச்சிகள். இலை நுனிகள் சுருண்டு காய்ந்து, வயல் வெளிறித் தெரியும்."
        },
        attack: ["Thrips scrape the surface of young leaves and suck the sap", "Leaves get silvery streaks, then the tips roll and dry", "Most common in nurseries and newly sown fields during dry spells"],
        signs: ["Rolled, dried leaf tips on seedlings", "Pale, yellowish patches in the nursery", "Tiny moving insects inside rolled leaves (use a magnifying glass)"],
        manage: ["Flood the field or nursery for a day or two – this usually controls them", "Seedlings normally recover once water is given", "If leaves are still rolling after flooding, spray an insecticide labelled for thrips at the label dose"],
        prevent: ["Keep water in the field after sowing", "Avoid long dry periods in the nursery"]
    },
    {
        id: "green_leafhopper", group: "insect", sci: "Nephotettix spp.",
        name: { en: "Green Leafhopper", si: "කොළ පැල කීඩෑවා", ta: "பச்சைத் தத்துப்பூச்சி" },
        summary: {
            en: "A small bright green insect that jumps away quickly. It sucks sap from leaves and, more importantly, spreads the tungro virus.",
            si: "ඉක්මනින් පනින කුඩා දීප්තිමත් කොළ කෘමියෙකි. කොළවල යුෂ උරා බොන අතර, වඩා වැදගත් ලෙස ටුන්ග්‍රෝ වෛරසය පතුරුවයි.",
            ta: "விரைவாகத் தாவும் சிறிய பிரகாசமான பச்சைப் பூச்சி. இலைச் சாற்றை உறிஞ்சுவதுடன், முக்கியமாகத் துங்ரோ வைரஸைப் பரப்புகிறது."
        },
        attack: ["It feeds on infected plants and picks up the tungro virus", "It then moves to healthy plants and passes the virus on while feeding", "Infected plants turn yellow-orange and stay stunted"],
        signs: ["Small green insects jumping from the leaves when disturbed", "Yellow-orange, stunted plants in patches (tungro)"],
        manage: ["Pull out and destroy plants with tungro", "If leafhoppers are many, spray imidacloprid or thiamethoxam at the label dose", "Tell neighbouring farmers so everyone acts in the same week"],
        prevent: ["Plant at the same time as neighbours", "Plough in stubble and ratoons after harvest", "Use tolerant varieties where tungro is common"]
    },
    {
        id: "rats", group: "animal", sci: "Bandicota bengalensis, Rattus rattus and others",
        name: { en: "Rats", si: "මීයන්", ta: "எலிகள்" },
        summary: {
            en: "Rats live in burrows in the bunds and cut the stems and panicles at night. Damage is highest from booting to harvest, and they also eat stored paddy.",
            si: "මීයන් නියරවල ගුලවල ජීවත් වී රාත්‍රියේ කඳන් සහ කරල් කපයි. බඩවන අවධියේ සිට අස්වනු නෙළන තුරු හානිය වැඩිම වන අතර ගබඩා කළ වීද කයි.",
            ta: "எலிகள் வரப்புகளில் வளைகளில் வாழ்ந்து இரவில் தண்டுகளையும் கதிர்களையும் வெட்டுகின்றன. கதிர் வரும் பருவம் முதல் அறுவடை வரை சேதம் அதிகம்; சேமித்த நெல்லையும் உண்கின்றன."
        },
        attack: ["Rats come out of burrows in the bunds at night", "They cut the stems at a slant near the base to reach the young panicle", "Later they cut and eat ripening panicles", "Damage starts near the bunds and spreads into the field"],
        signs: ["Stems cut at an angle, lying on the ground", "Fresh burrows and runways on the bunds", "Missing or chewed panicles, especially near bunds"],
        manage: ["Join a village rat-control campaign – rats move from field to field, so everyone must act together", "Destroy burrows and use traps along runways", "Use rat baits only as the label directs, in covered bait stations, away from children, pets and farm animals"],
        prevent: ["Keep bunds narrow, low and free of weeds", "Plant and harvest at the same time as neighbours", "Store harvested paddy in rat-proof containers"]
    },
    {
        id: "birds", group: "animal", sci: "Munias (Lonchura spp.), weaver birds and others",
        name: { en: "Paddy Birds", si: "වී කුරුල්ලන්", ta: "நெல் பறவைகள்" },
        summary: {
            en: "Flocks of small seed-eating birds such as munias land on the panicles and eat the grains from the milk stage to harvest.",
            si: "වී කුරුල්ලන් වැනි කුඩා බීජ කන කුරුළු රංචු කරල් මත වැසී කිරි අවධියේ සිට අස්වනු නෙළන තුරු ඇට කයි.",
            ta: "தினைக்குருவி போன்ற சிறிய விதை உண்ணும் பறவைக் கூட்டங்கள் கதிர்களில் அமர்ந்து பால் பருவம் முதல் அறுவடை வரை மணிகளை உண்கின்றன."
        },
        attack: ["Birds gather in flocks in the early morning and late afternoon", "They perch on the panicles and pick out milky or ripening grains", "Early or late fields that ripen alone get the most damage"],
        signs: ["Flocks rising from the field when you approach", "Empty, broken or bent panicles", "Husks scattered on the ground"],
        manage: ["Guard the field in the early morning and late afternoon", "Use scarecrows, shiny reflective ribbons, and noise makers – move them every few days so birds don't get used to them", "Harvest on time once the grain is ripe"],
        prevent: ["Plant at the same time as neighbouring fields so the damage is shared", "Keep nearby bushes trimmed where flocks rest"]
    },
    {
        id: "peafowl", group: "animal", sci: "Pavo cristatus", protected: true,
        name: { en: "Peafowl", si: "මොනරා", ta: "மயில்" },
        summary: {
            en: "Peafowl have become a serious crop pest in many areas. They eat sown seed and young seedlings, peck grains, and trample plants.",
            si: "බොහෝ ප්‍රදේශවල මොනරුන් බරපතල බෝග පළිබෝධකයන් වී ඇත. වපුරන බීජ සහ ළපටි පැළ කන අතර, ඇට කොටා කමින් පැළ පාගයි.",
            ta: "பல பகுதிகளில் மயில்கள் கடுமையான பயிர்ப் பூச்சியாகிவிட்டன. விதைத்த விதைகளையும் இளம் நாற்றுகளையும் உண்டு, மணிகளைக் கொத்தி, பயிர்களை மிதிக்கின்றன."
        },
        attack: ["Flocks walk into newly sown fields and eat the seed", "They pull and eat young seedlings", "At ripening they peck grains and trample plants"],
        signs: ["Bare patches where seed has been eaten", "Footprints and feathers in the field", "Birds seen at dawn and dusk near the field edge"],
        manage: ["Guard the field at dawn and dusk, especially just after sowing", "Use noise, scarecrows and reflective tape, and change them often", "Take turns with neighbouring farmers to guard the fields at dawn and dusk"],
        prevent: ["Sow at the same time as neighbours", "Cover nursery beds with nets"],
        note: "Peafowl are protected by law in Sri Lanka. Do not kill, poison or trap them – only scare them away."
    },
    {
        id: "wild_boar", group: "animal", sci: "Sus scrofa",
        name: { en: "Wild Boar", si: "වල් ඌරා", ta: "காட்டுப் பன்றி" },
        summary: {
            en: "Wild boar come at night, dig up the soil, uproot young plants, trample the crop and eat ripening panicles. A small group can damage a large area in one night.",
            si: "වල් ඌරන් රාත්‍රියේ පැමිණ පස හාරා, ළපටි පැළ ගලවා, බෝගය පාගා ඉදෙන කරල් කයි. කුඩා රංචුවකට එක රැයකින් විශාල ප්‍රදේශයකට හානි කළ හැක.",
            ta: "காட்டுப் பன்றிகள் இரவில் வந்து மண்ணைத் தோண்டி, இளம் பயிர்களைப் பிடுங்கி, பயிரை மிதித்து, முற்றும் கதிர்களை உண்கின்றன. சிறிய கூட்டமே ஒரே இரவில் பெரிய பகுதியைச் சேதப்படுத்தும்."
        },
        attack: ["They enter the field at night from nearby scrub or forest", "They dig with their snouts, uprooting plants and damaging bunds", "At ripening they flatten the crop and eat the panicles"],
        signs: ["Dug-up soil and uprooted plants", "Flattened patches of crop", "Hoof prints and broken bunds near the jungle edge"],
        manage: ["Guard the field at night from a watch hut, with lights and noise", "Repair bunds quickly so the field keeps its water"],
        prevent: ["Build a strong fence or trench around the field together with neighbouring farmers", "Clear scrub along the field edge where boar hide", "Electric fences only if installed safely and approved by the authorities – never connect a fence to house electricity"]
    },
    {
        id: "elephant", group: "animal", sci: "Elephas maximus maximus", protected: true,
        name: { en: "Wild Elephant", si: "වල් අලියා", ta: "காட்டு யானை" },
        summary: {
            en: "In the dry zone, wild elephants raid paddy fields at night, especially near harvest. They eat and trample the crop, break into stores, and are dangerous to people.",
            si: "වියළි කලාපයේ වල් අලින් රාත්‍රියේ, විශේෂයෙන් අස්වනු කාලයට ආසන්නව කුඹුරුවලට කඩා වදී. බෝග කා පාගා, ගබඩා කඩන අතර මිනිසුන්ට අනතුරුදායක වේ.",
            ta: "உலர் வலயத்தில் காட்டு யானைகள் இரவில், குறிப்பாக அறுவடைக்கு முன், நெல் வயல்களில் புகுகின்றன. பயிரை உண்டு மிதித்து, களஞ்சியங்களை உடைக்கின்றன; மனிதர்களுக்கு ஆபத்தானவை."
        },
        attack: ["Elephants come out of the forest after dark", "They pull up and eat ripening paddy with their trunks", "Their feet flatten large areas of crop", "They may break into homes or stores where harvested paddy is kept"],
        signs: ["Large flattened areas and big round footprints", "Broken fences and trees at the field edge", "Dung piles near the field"],
        manage: ["Never approach or chase an elephant – stay at a safe distance and protect your family first", "Report elephant raids to the Department of Wildlife Conservation office in your area", "Watch from a safe watch hut with lights; do not go out alone at night"],
        prevent: ["Support community electric fences built by the authorities, and help maintain them", "Harvest on time and do not store paddy inside the house", "Coordinate planting and harvesting with neighbours so the crop is not left alone near the forest"],
        note: "Elephants are protected by law in Sri Lanka. Never harm them; never use illegal methods such as poison or 'hakka patas'. Your safety comes first."
    }
];

Object.assign(translations.en, {
    pest_title: "Pests & Animals",
    pest_lead: "Insects and animals that damage paddy fields in Sri Lanka: how they attack, what to look for, and what to do.",
    pest_insects: "Insects",
    pest_animals: "Animals & birds",
    pest_attack: "How it attacks",
    pest_signs: "Signs in your field",
    pest_photos: "See real photos",
    pest_search_ph: "Search pests or signs...",
    pest_protected: "Protected by law",
    pest_plan_title: "Treatment after an attack"
});
Object.assign(translations.si, {
    pest_title: "පළිබෝධකයන් සහ සතුන්",
    pest_lead: "ශ්‍රී ලංකාවේ කුඹුරුවලට හානි කරන කෘමීන් සහ සතුන්: ඔවුන් පහර දෙන ආකාරය, බැලිය යුතු ලක්ෂණ සහ කළ යුතු දේ.",
    pest_insects: "කෘමීන්",
    pest_animals: "සතුන් සහ කුරුල්ලන්",
    pest_attack: "පහර දෙන ආකාරය",
    pest_signs: "කුඹුරේ ලක්ෂණ",
    pest_photos: "සැබෑ ඡායාරූප බලන්න",
    pest_search_ph: "පළිබෝධ හෝ ලක්ෂණ සොයන්න...",
    pest_protected: "නීතියෙන් ආරක්ෂිතයි",
    pest_plan_title: "ප්‍රහාරයෙන් පසු ප්‍රතිකාර"
});
Object.assign(translations.ta, {
    pest_title: "பூச்சிகளும் விலங்குகளும்",
    pest_lead: "இலங்கையில் நெல் வயல்களைச் சேதப்படுத்தும் பூச்சிகளும் விலங்குகளும்: அவை தாக்கும் விதம், கவனிக்க வேண்டியவை, செய்ய வேண்டியவை.",
    pest_insects: "பூச்சிகள்",
    pest_animals: "விலங்குகளும் பறவைகளும்",
    pest_attack: "தாக்கும் விதம்",
    pest_signs: "வயலில் அறிகுறிகள்",
    pest_photos: "உண்மையான படங்களைப் பார்",
    pest_search_ph: "பூச்சிகள் அல்லது அறிகுறிகளைத் தேடுங்கள்...",
    pest_protected: "சட்டத்தால் பாதுகாக்கப்பட்டது",
    pest_plan_title: "தாக்குதலுக்குப் பின் சிகிச்சை"
});

/* ---------- Treatment plans after an attack (day = days after the start date) ---------- */
const PEST_PLANS = {
    brown_planthopper: [
        { day: 0, text: {
            en: "Drain the field and keep it drained for 3–4 days. Stop all urea.",
            si: "කුඹුරේ ජලය බැස යවා දින 3–4ක් එසේ තබන්න. සියලු යූරියා යෙදීම නවත්වන්න.",
            ta: "வயல் நீரை வடித்து 3–4 நாட்கள் அப்படியே வையுங்கள். யூரியா இடுவதை முற்றாக நிறுத்துங்கள்." } },
        { day: 1, text: {
            en: "Tap the base of 10 plants in different places. If you count about 10 or more hoppers per clump, spray buprofezin or pymetrozine at the label dose, only at the base of the plants.",
            si: "විවිධ ස්ථානවල පැළ 10ක පාමුලට තට්ටු කරන්න. පඳුරකට කීඩෑවන් 10ක් හෝ ඊට වැඩි ගණනක් ගණන් කළහොත්, ලේබලයේ මාත්‍රාවෙන් බියුප්‍රොෆෙසින් (buprofezin) හෝ පයිමෙට්‍රොසීන් (pymetrozine) පැළ පාමුලට පමණක් ඉසින්න.",
            ta: "வெவ்வேறு இடங்களில் 10 பயிர்களின் அடிப்பகுதியைத் தட்டுங்கள். ஒரு குத்துக்கு சுமார் 10 அல்லது அதற்கு மேற்பட்ட தத்துப்பூச்சிகள் இருந்தால், லேபிள் அளவில் புப்ரோஃபெசின் (buprofezin) அல்லது பைமெட்ரோசின் (pymetrozine) ஐப் பயிரின் அடிப்பகுதியில் மட்டும் தெளியுங்கள்." } },
        { day: 3, check: true, text: {
            en: "Check the dried patches. Are they getting bigger? Tap the plants again and count the hoppers.",
            si: "වියළුණු පැල්ලම් පරීක්ෂා කරන්න. ඒවා විශාල වෙනවාද? නැවත පැළවලට තට්ටු කර කීඩෑවන් ගණන් කරන්න.",
            ta: "காய்ந்த திட்டுகளைச் சோதியுங்கள். அவை பெரிதாகின்றனவா? மீண்டும் பயிர்களைத் தட்டித் தத்துப்பூச்சிகளை எண்ணுங்கள்." } },
        { day: 4, text: {
            en: "Bring back a shallow water level (2–3 cm). Keep holding back extra nitrogen.",
            si: "නොගැඹුරු ජල මට්ටමක් (සෙ.මී. 2–3) නැවත ලබාදෙන්න. අමතර නයිට්‍රජන් නොයොදා සිටින්න.",
            ta: "குறைந்த நீர் மட்டத்தை (2–3 செ.மீ.) மீண்டும் கொடுங்கள். கூடுதல் நைதரசன் இடாமல் இருங்கள்." } },
        { day: 7, check: true, text: {
            en: "Check the base of the plants again. If hoppers are still many, spray once more using the other product (pymetrozine if you used buprofezin, or buprofezin if you used pymetrozine).",
            si: "නැවත පැළ පාමුල පරීක්ෂා කරන්න. කීඩෑවන් තවමත් බොහෝ නම්, අනෙක් භාණ්ඩය යොදා තවත් වරක් ඉසින්න (බියුප්‍රොෆෙසින් යෙදුවේ නම් පයිමෙට්‍රොසීන්, පයිමෙට්‍රොසීන් යෙදුවේ නම් බියුප්‍රොෆෙසින්).",
            ta: "மீண்டும் பயிரின் அடிப்பகுதியைச் சோதியுங்கள். தத்துப்பூச்சிகள் இன்னும் அதிகமானால், மற்றப் பொருளைப் பயன்படுத்தி மீண்டும் ஒருமுறை தெளியுங்கள் (புப்ரோஃபெசின் பயன்படுத்தியிருந்தால் பைமெட்ரோசின், பைமெட்ரோசின் பயன்படுத்தியிருந்தால் புப்ரோஃபெசின்)." } },
        { day: 14, check: true, text: {
            en: "Final check. If patches are still spreading, drain the field again for 3–4 days and repeat the spray at the base of the plants. Next season, grow a BPH-resistant variety.",
            si: "අවසාන පරීක්ෂාව. පැල්ලම් තවමත් පැතිරේ නම්, නැවත දින 3–4ක් කුඹුරේ ජලය බැස යවා පැළ පාමුලට නැවත ඉසින්න. ඊළඟ කන්නයේ දුඹුරු පැල කීඩෑවාට ඔරොත්තු දෙන ප්‍රභේදයක් වගා කරන්න.",
            ta: "இறுதிச் சோதனை. திட்டுகள் இன்னும் பரவினால், மீண்டும் 3–4 நாட்கள் வயல் நீரை வடித்து, பயிரின் அடிப்பகுதியில் மீண்டும் தெளியுங்கள். அடுத்த போகத்தில் பழுப்புத் தத்துப்பூச்சி எதிர்ப்பு இனத்தைப் பயிரிடுங்கள்." } }
    ],
    gall_midge: [
        { day: 0, text: {
            en: "Walk the field. Pull out the pale tube-like shoots (silver shoots) and destroy them away from the field.",
            si: "කුඹුර පුරා ඇවිදින්න. සුදුමැලි නළ වැනි දළු (රිදී දළු) ගලවා කුඹුරෙන් ඈතට ගෙන ගොස් විනාශ කරන්න.",
            ta: "வயல் முழுவதும் நடந்து செல்லுங்கள். வெளிறிய குழாய் போன்ற தூர்களை (வெள்ளித் தூர்) பிடுங்கி வயலுக்கு அப்பால் அழியுங்கள்." } },
        { day: 1, text: {
            en: "Remove wild grasses and volunteer rice on the bunds and around the field, where the flies breed.",
            si: "මැස්සන් බෝ වන නියරවල සහ කුඹුර වටා ඇති වල් තෘණ සහ ඉබේ හටගත් වී පැළ ඉවත් කරන්න.",
            ta: "ஈக்கள் பெருகும் வரப்புகளிலும் வயலைச் சுற்றியும் உள்ள காட்டுப் புற்களையும் தானாக முளைத்த நெல்லையும் அகற்றுங்கள்." } },
        { day: 3, text: {
            en: "Do not spray – spraying after the tubes have formed does not help. Keep removing silver shoots and keep the bunds free of grasses.",
            si: "නොඉසින්න – නළ හටගත් පසු ඉසීමෙන් ප්‍රයෝජනයක් නැත. දිගටම රිදී දළු ඉවත් කර නියර තෘණවලින් තොරව තබාගන්න.",
            ta: "தெளிக்க வேண்டாம் – குழாய்கள் உருவான பின் தெளிப்பது பயனில்லை. தொடர்ந்து வெள்ளித் தூர்களை அகற்றி, வரப்புகளைப் புல் இல்லாமல் வையுங்கள்." } },
        { day: 7, check: true, text: {
            en: "Check the new tillers for silver shoots and remove any you find.",
            si: "අලුත් පඳුරුවල රිදී දළු ඇත්දැයි බලා හමු වූ ඒවා ඉවත් කරන්න.",
            ta: "புதிய தூர்களில் வெள்ளித் தூர்கள் உள்ளனவா எனப் பார்த்து, கண்டவற்றை அகற்றுங்கள்." } },
        { day: 14, check: true, text: {
            en: "Final check. Next season, plant on time with your neighbours and use a gall midge-resistant variety.",
            si: "අවසාන පරීක්ෂාව. ඊළඟ කන්නයේ අසල්වැසියන් සමඟ නියමිත වේලාවට වගා කර ගොබ මැස්සාට ඔරොත්තු දෙන ප්‍රභේදයක් භාවිත කරන්න.",
            ta: "இறுதிச் சோதனை. அடுத்த போகத்தில் அயலவர்களுடன் உரிய நேரத்தில் பயிரிட்டு, ஆனைக்கொம்பன் ஈ எதிர்ப்பு இனத்தைப் பயன்படுத்துங்கள்." } }
    ],
    paddy_bug: [
        { day: 0, text: {
            en: "In the early morning or evening, check 10 panicles in different places and count the bugs.",
            si: "උදෑසන හෝ සවස, විවිධ ස්ථානවල කරල් 10ක් පරීක්ෂා කර මකුණන් ගණන් කරන්න.",
            ta: "அதிகாலை அல்லது மாலையில், வெவ்வேறு இடங்களில் 10 கதிர்களைச் சோதித்துப் பூச்சிகளை எண்ணுங்கள்." } },
        { day: 1, text: {
            en: "Clear grassy weeds on the bunds and field edges where the bugs hide.",
            si: "මකුණන් සැඟවෙන නියරවල සහ කුඹුරු දාරවල තෘණ වල් පැළ ඉවත් කරන්න.",
            ta: "பூச்சிகள் ஒளிந்திருக்கும் வரப்புகளிலும் வயல் ஓரங்களிலும் உள்ள புல் களைகளை அகற்றுங்கள்." } },
        { day: 2, text: {
            en: "If bugs are many, spray an insecticide whose label says 'paddy bug', in the early morning or late evening, at the label dose. Wear gloves and a mask.",
            si: "මකුණන් වැඩි නම්, ලේබලයේ 'වී මකුණා (paddy bug)' සඳහන් කෘමිනාශකයක් උදෑසන හෝ සවස ලේබලයේ මාත්‍රාවෙන් ඉසින්න. අත්වැසුම් සහ මුහුණු ආවරණයක් පළඳින්න.",
            ta: "பூச்சிகள் அதிகமானால், லேபிளில் 'கதிர் நாவாய்ப் பூச்சி (paddy bug)' எனக் குறிப்பிட்ட பூச்சிக்கொல்லியை அதிகாலை அல்லது மாலையில் லேபிள் அளவில் தெளியுங்கள். கையுறை, முகக்கவசம் அணியுங்கள்." } },
        { day: 5, check: true, text: {
            en: "Check the panicles again. Are there still many bugs or new empty grains?",
            si: "නැවත කරල් පරීක්ෂා කරන්න. තවමත් මකුණන් බොහෝද, නැතහොත් අලුත් හිස් ඇට තිබේද?",
            ta: "மீண்டும் கதிர்களைச் சோதியுங்கள். இன்னும் பல பூச்சிகள் அல்லது புதிய பதர் மணிகள் உள்ளனவா?" } },
        { day: 10, check: true, text: {
            en: "Final check until the grains become hard. Respect the waiting period before harvest if you sprayed.",
            si: "ඇට තද වන තුරු අවසාන පරීක්ෂාව. ඔබ ඉස්සා නම් අස්වනු නෙළීමට පෙර පොරොත්තු කාලය රකින්න.",
            ta: "மணிகள் கடினமாகும் வரை இறுதிச் சோதனை. தெளித்திருந்தால் அறுவடைக்கு முன் காத்திருப்புக் காலத்தைப் பின்பற்றுங்கள்." } }
    ],
    leaf_folder: [
        { day: 0, text: {
            en: "Count folded leaves on 10 plants. A few damaged leaves do not reduce the harvest – do not spray yet.",
            si: "පැළ 10ක නැවුණු කොළ ගණන් කරන්න. හානි වූ කොළ කිහිපයකින් අස්වැන්න අඩු නොවේ – තවම නොඉසින්න.",
            ta: "10 பயிர்களில் மடிந்த இலைகளை எண்ணுங்கள். சில சேதமடைந்த இலைகள் அறுவடையைக் குறைக்காது – இப்போதே தெளிக்க வேண்டாம்." } },
        { day: 1, text: {
            en: "Stop extra nitrogen fertilizer.",
            si: "අමතර නයිට්‍රජන් පොහොර නවත්වන්න.",
            ta: "கூடுதல் நைதரசன் உரத்தை நிறுத்துங்கள்." } },
        { day: 3, text: {
            en: "If many of the top leaves are damaged before flowering, spray chlorantraniliprole (or another insecticide labelled for leaf folder) at the label dose.",
            si: "මල් පිපීමට පෙර ඉහළ කොළ බොහොමයක් හානි වී ඇත්නම්, ලේබලයේ මාත්‍රාවෙන් ක්ලෝරන්ට්‍රනිලිප්‍රෝල් (chlorantraniliprole) (නැතහොත් කොළ හකුළන දළඹුවාට ලේබල් කළ වෙනත් කෘමිනාශකයක්) ඉසින්න.",
            ta: "பூக்கும் முன் பல மேல் இலைகள் சேதமடைந்திருந்தால், லேபிள் அளவில் குளோரான்ட்ரானிலிப்ரோல் (chlorantraniliprole) (அல்லது இலை சுருட்டுப் புழுவுக்கு லேபிளிடப்பட்ட வேறு பூச்சிக்கொல்லி) ஐத் தெளியுங்கள்." } },
        { day: 7, check: true, text: {
            en: "Check the new leaves. Are new folded leaves still appearing?",
            si: "අලුත් කොළ පරීක්ෂා කරන්න. තවමත් අලුතින් නැවුණු කොළ ඇති වෙනවාද?",
            ta: "புதிய இலைகளைச் சோதியுங்கள். இன்னும் புதிதாக மடிந்த இலைகள் தோன்றுகின்றனவா?" } },
        { day: 14, check: true, text: {
            en: "Final check. Protect spiders and dragonflies – they eat leaf folders.",
            si: "අවසාන පරීක්ෂාව. මකුළුවන් සහ බත්කූරන් ආරක්ෂා කරන්න – ඔවුන් කොළ හකුළන දළඹුවන් කති.",
            ta: "இறுதிச் சோதனை. சிலந்திகளையும் தும்பிகளையும் பாதுகாருங்கள் – அவை இலை சுருட்டுப் புழுக்களை உண்கின்றன." } }
    ],
    stem_borer: [
        { day: 0, text: {
            en: "Collect egg masses (small brown hairy patches) from the leaf tips and destroy them.",
            si: "කොළ අගින් බිත්තර කැටි (කුඩා දුඹුරු රෝම සහිත පැල්ලම්) එකතු කර විනාශ කරන්න.",
            ta: "இலை நுனிகளிலிருந்து முட்டைக் குவியல்களை (சிறிய பழுப்பு மயிருள்ள திட்டுகள்) சேகரித்து அழியுங்கள்." } },
        { day: 1, text: {
            en: "Pull out dead centre shoots (deadhearts) and destroy them, with the caterpillar inside.",
            si: "මිය ගිය මැද දළු (මළ දළු) ඇතුළත දළඹුවා සමඟම ගලවා විනාශ කරන්න.",
            ta: "இறந்த நடுத்தூர்களை (டெட்ஹார்ட்) உள்ளே இருக்கும் புழுவுடன் பிடுங்கி அழியுங்கள்." } },
        { day: 2, text: {
            en: "If many tillers are damaged, apply chlorantraniliprole (or another insecticide labelled for stem borer) at the label dose.",
            si: "පඳුරු බොහොමයක් හානි වී ඇත්නම්, ලේබලයේ මාත්‍රාවෙන් ක්ලෝරන්ට්‍රනිලිප්‍රෝල් (chlorantraniliprole) (නැතහොත් කඳ පණුවාට ලේබල් කළ වෙනත් කෘමිනාශකයක්) යොදන්න.",
            ta: "பல தூர்கள் சேதமடைந்திருந்தால், லேபிள் அளவில் குளோரான்ட்ரானிலிப்ரோல் (chlorantraniliprole) (அல்லது தண்டுத் துளைப்பானுக்கு லேபிளிடப்பட்ட வேறு பூச்சிக்கொல்லி) ஐப் பயன்படுத்துங்கள்." } },
        { day: 7, check: true, text: {
            en: "Check for new deadhearts or white empty panicles, and new egg masses.",
            si: "අලුත් මළ දළු හෝ සුදු හිස් කරල් සහ අලුත් බිත්තර කැටි ඇත්දැයි බලන්න.",
            ta: "புதிய டெட்ஹார்ட் அல்லது வெள்ளை வெற்றுக் கதிர்கள், புதிய முட்டைக் குவியல்கள் உள்ளனவா எனப் பாருங்கள்." } },
        { day: 14, check: true, text: {
            en: "Final check. After harvest, cut the stubble close to the ground and plough it in.",
            si: "අවසාන පරීක්ෂාව. අස්වනු නෙළීමෙන් පසු ඉපනැලි පොළොවට ළඟින් කපා සීසා පසට යොදන්න.",
            ta: "இறுதிச் சோதனை. அறுவடைக்குப் பின் அடிக்கட்டைகளை நிலத்துக்கு அருகில் வெட்டி உழுது சேருங்கள்." } }
    ],
    thrips: [
        { day: 0, text: {
            en: "Flood the field or nursery for 1–2 days. This usually controls thrips.",
            si: "දින 1–2ක් කුඹුරට හෝ තවානට ජලය බඳින්න. සාමාන්‍යයෙන් මෙයින් තිරිප්ස් පාලනය වේ.",
            ta: "1–2 நாட்கள் வயலில் அல்லது நாற்றுமேடையில் நீர் கட்டுங்கள். இது பொதுவாக இலைப்பேன்களைக் கட்டுப்படுத்தும்." } },
        { day: 2, text: {
            en: "Keep a steady water level. Do not let the field dry out.",
            si: "ස්ථාවර ජල මට්ටමක් තබාගන්න. කුඹුර වියළී යාමට ඉඩ නොදෙන්න.",
            ta: "நிலையான நீர் மட்டத்தைப் பேணுங்கள். வயல் உலர விட வேண்டாம்." } },
        { day: 4, check: true, text: {
            en: "Check the new leaves. Are they coming out green and open?",
            si: "අලුත් කොළ පරීක්ෂා කරන්න. ඒවා කොළ පැහැයෙන් හා දිගහැරී එනවාද?",
            ta: "புதிய இலைகளைச் சோதியுங்கள். அவை பச்சையாகவும் விரிந்தும் வருகின்றனவா?" } },
        { day: 7, check: true, text: {
            en: "Final check. If leaves are still rolling after flooding, spray an insecticide labelled for thrips at the label dose.",
            si: "අවසාන පරීක්ෂාව. ජලය බැඳීමෙන් පසුවත් කොළ රෝල් වේ නම්, ලේබලයේ මාත්‍රාවෙන් තිරිප්ස් සඳහා ලේබල් කළ කෘමිනාශකයක් ඉසින්න.",
            ta: "இறுதிச் சோதனை. நீர் கட்டிய பின்னும் இலைகள் சுருண்டால், லேபிள் அளவில் இலைப்பேனுக்கு லேபிளிடப்பட்ட பூச்சிக்கொல்லியைத் தெளியுங்கள்." } }
    ],
    green_leafhopper: [
        { day: 0, text: {
            en: "Pull out yellow-orange stunted plants (tungro) and destroy them away from the field.",
            si: "කහ-තැඹිලි, කුරු පැළ (ටුන්ග්‍රෝ) ගලවා කුඹුරෙන් ඈතට ගෙන ගොස් විනාශ කරන්න.",
            ta: "மஞ்சள்-செம்மஞ்சள் குட்டையான பயிர்களை (துங்ரோ) பிடுங்கி வயலுக்கு அப்பால் அழியுங்கள்." } },
        { day: 1, text: {
            en: "Check how many leafhoppers jump from the plants. If many, spray imidacloprid or thiamethoxam at the label dose.",
            si: "පැළවලින් කොළ පැල කීඩෑවන් කීදෙනෙක් පනිනවාදැයි බලන්න. බොහෝ නම්, ලේබලයේ මාත්‍රාවෙන් ඉමිඩාක්ලෝප්‍රිඩ් (imidacloprid) හෝ තයමිතොක්සම් (thiamethoxam) ඉසින්න.",
            ta: "பயிர்களிலிருந்து எத்தனை தத்துப்பூச்சிகள் தாவுகின்றன எனப் பாருங்கள். அதிகமானால், லேபிள் அளவில் இமிடாகுளோப்ரிட் (imidacloprid) அல்லது தயமீதாக்சம் (thiamethoxam) ஐத் தெளியுங்கள்." } },
        { day: 3, text: {
            en: "If tungro is spreading, tell your neighbours so everyone removes infected plants and sprays in the same week.",
            si: "ටුන්ග්‍රෝ පැතිරේ නම්, සියලු දෙනා එකම සතියේ රෝගී පැළ ඉවත් කර ඉසින සේ අසල්වැසියන්ට දන්වන්න.",
            ta: "துங்ரோ பரவினால், அனைவரும் ஒரே வாரத்தில் நோயுற்ற பயிர்களை அகற்றித் தெளிக்க அயலவர்களுக்குத் தெரிவியுங்கள்." } },
        { day: 7, check: true, text: {
            en: "Check for new yellow plants and remove them.",
            si: "අලුත් කහ පැළ ඇත්දැයි බලා ඒවා ඉවත් කරන්න.",
            ta: "புதிய மஞ்சள் பயிர்கள் உள்ளனவா எனப் பார்த்து அவற்றை அகற்றுங்கள்." } },
        { day: 14, check: true, text: {
            en: "Final check. Next season, plant at the same time as your neighbours.",
            si: "අවසාන පරීක්ෂාව. ඊළඟ කන්නයේ අසල්වැසියන් සමඟ එකවර වගා කරන්න.",
            ta: "இறுதிச் சோதனை. அடுத்த போகத்தில் அயலவர்களுடன் ஒரே நேரத்தில் பயிரிடுங்கள்." } }
    ],
    rats: [
        { day: 0, text: {
            en: "Walk the bunds and mark every fresh burrow and rat runway.",
            si: "නියර දිගේ ඇවිද සෑම අලුත් ගුලක්ම සහ මීයන් යන මාර්ගයක්ම සලකුණු කරන්න.",
            ta: "வரப்புகள் வழியே நடந்து ஒவ்வொரு புதிய வளையையும் எலிப் பாதையையும் குறியிடுங்கள்." } },
        { day: 1, text: {
            en: "Dig out or block the burrows and set traps along the runways.",
            si: "ගුල හාරා දමන්න හෝ වසා දමා, මීයන් යන මාර්ග දිගේ උගුල් තබන්න.",
            ta: "வளைகளைத் தோண்டி அல்லது அடைத்து, எலிப் பாதைகளில் பொறிகளை வையுங்கள்." } },
        { day: 2, text: {
            en: "Talk with your neighbours and the farmer organisation about a joint rat campaign – rats move from field to field.",
            si: "ඒකාබද්ධ මී මර්දන ව්‍යාපාරයක් ගැන අසල්වැසියන් සහ ගොවි සංවිධානය සමඟ කතා කරන්න – මීයන් කුඹුරෙන් කුඹුරට යති.",
            ta: "கூட்டு எலிக் கட்டுப்பாட்டு இயக்கம் பற்றி அயலவர்களுடனும் விவசாயிகள் அமைப்புடனும் பேசுங்கள் – எலிகள் வயலுக்கு வயல் செல்கின்றன." } },
        { day: 4, check: true, text: {
            en: "Check the traps and look for new cut stems.",
            si: "උගුල් පරීක්ෂා කර අලුතින් කැපූ කඳන් ඇත්දැයි බලන්න.",
            ta: "பொறிகளைச் சோதித்து, புதிதாக வெட்டப்பட்ட தண்டுகள் உள்ளனவா எனப் பாருங்கள்." } },
        { day: 7, text: {
            en: "If damage continues, use rat bait only as the label directs, in covered bait stations, away from children, pets and farm animals.",
            si: "හානිය දිගටම පවතී නම්, මී විෂ ඇම නිර්දේශිත ආකාරයට පමණක්, වසා ඇති ඇම පෙට්ටිවල, ළමුන්ගෙන්, සුරතල් සතුන්ගෙන් සහ ගොවිපල සතුන්ගෙන් ඈතින් භාවිත කරන්න.",
            ta: "சேதம் தொடர்ந்தால், எலி நச்சு இரையைப் பரிந்துரைக்கப்பட்டபடி மட்டும், மூடிய இரைப் பெட்டிகளில், குழந்தைகள், செல்லப்பிராணிகள், பண்ணை விலங்குகளிடமிருந்து தூரத்தில் பயன்படுத்துங்கள்." } },
        { day: 14, check: true, text: {
            en: "Final check. Keep bunds narrow and free of weeds, and store harvested paddy in rat-proof containers.",
            si: "අවසාන පරීක්ෂාව. නියර පටු හා වල් පැළවලින් තොරව තබා, අස්වනු වී මීයන්ට ඇතුළු විය නොහැකි බඳුන්වල ගබඩා කරන්න.",
            ta: "இறுதிச் சோதனை. வரப்புகளைக் குறுகியதாகவும் களையின்றியும் வைத்து, அறுவடை நெல்லை எலி புக முடியாத கொள்கலன்களில் சேமியுங்கள்." } }
    ],
    birds: [
        { day: 0, text: {
            en: "Put up shiny reflective ribbons and scarecrows across the field.",
            si: "කුඹුර පුරා දිලිසෙන පීලි සහ පඹයන් සවි කරන්න.",
            ta: "வயல் முழுவதும் மின்னும் நாடாக்களையும் வெருளிகளையும் அமையுங்கள்." } },
        { day: 1, text: {
            en: "Guard the field every early morning and late afternoon until harvest.",
            si: "අස්වනු නෙළන තුරු සෑම උදෑසනකම සහ සවසකම කුඹුර රකින්න.",
            ta: "அறுவடை வரை ஒவ்வொரு அதிகாலையிலும் மாலையிலும் வயலைக் காவல் செய்யுங்கள்." } },
        { day: 3, text: {
            en: "Move the scarecrows and ribbons to new places so the birds don't get used to them.",
            si: "කුරුල්ලන් හුරු නොවන සේ පඹයන් සහ පීලි අලුත් ස්ථානවලට මාරු කරන්න.",
            ta: "பறவைகள் பழகாதிருக்க வெருளிகளையும் நாடாக்களையும் புதிய இடங்களுக்கு மாற்றுங்கள்." } },
        { day: 7, check: true, text: {
            en: "Check the panicles for new damage and change the scaring methods again.",
            si: "අලුත් හානි ඇත්දැයි කරල් පරීක්ෂා කර නැවත බිය ගැන්වීමේ ක්‍රම වෙනස් කරන්න.",
            ta: "புதிய சேதம் உள்ளதா எனக் கதிர்களைச் சோதித்து, விரட்டும் முறைகளை மீண்டும் மாற்றுங்கள்." } },
        { day: 10, check: true, text: {
            en: "Check the grains. Harvest as soon as about 80–85% of the grains are golden.",
            si: "ඇට පරීක්ෂා කරන්න. ඇටවලින් 80–85%ක් පමණ රන්වන් වූ විගස අස්වනු නෙළන්න.",
            ta: "மணிகளைச் சோதியுங்கள். சுமார் 80–85% மணிகள் பொன்னிறமானதும் அறுவடை செய்யுங்கள்." } }
    ],
    peafowl: [
        { day: 0, text: {
            en: "Guard the field at dawn and dusk and scare the birds away with noise. Never harm them – peafowl are protected by law.",
            si: "උදෑසන සහ සන්ධ්‍යාවේ කුඹුර රකිමින් ශබ්දයෙන් කුරුල්ලන් පලවා හරින්න. ඔවුන්ට කිසි විටෙක හානි නොකරන්න – මොනරුන් නීතියෙන් ආරක්ෂිතය.",
            ta: "விடியலிலும் அந்தியிலும் வயலைக் காவல் செய்து சத்தத்தால் பறவைகளை விரட்டுங்கள். அவற்றுக்கு ஒருபோதும் தீங்கு செய்ய வேண்டாம் – மயில்கள் சட்டத்தால் பாதுகாக்கப்படுகின்றன." } },
        { day: 1, text: {
            en: "Re-sow or fill in the bare patches where seed or seedlings were eaten. Cover nursery beds with nets.",
            si: "බීජ හෝ පැළ කා දැමූ හිස් පැල්ලම් නැවත වපුරන්න හෝ පුරවන්න. තවාන් දැල්වලින් වසන්න.",
            ta: "விதைகள் அல்லது நாற்றுகள் உண்ணப்பட்ட வெற்றுத் திட்டுகளை மீண்டும் விதையுங்கள் அல்லது நிரப்புங்கள். நாற்றுமேடைகளை வலைகளால் மூடுங்கள்." } },
        { day: 3, text: {
            en: "Change the scaring method (scarecrows, reflective tape, noise) so the birds don't get used to it.",
            si: "කුරුල්ලන් හුරු නොවන සේ බිය ගැන්වීමේ ක්‍රමය (පඹයන්, දිලිසෙන පීලි, ශබ්ද) වෙනස් කරන්න.",
            ta: "பறவைகள் பழகாதிருக்க விரட்டும் முறையை (வெருளிகள், மின்னும் நாடா, சத்தம்) மாற்றுங்கள்." } },
        { day: 7, check: true, text: {
            en: "Check for new bare patches. Take turns with neighbouring farmers to guard the fields at dawn and dusk.",
            si: "අලුත් හිස් පැල්ලම් ඇත්දැයි බලන්න. අසල්වැසි ගොවීන් සමඟ මාරුවෙන් මාරුවට උදෑසන සහ සන්ධ්‍යාවේ කුඹුරු රකින්න.",
            ta: "புதிய வெற்றுத் திட்டுகள் உள்ளனவா எனப் பாருங்கள். அயல் விவசாயிகளுடன் முறைவைத்து விடியலிலும் அந்தியிலும் வயல்களைக் காவல் செய்யுங்கள்." } }
    ],
    wild_boar: [
        { day: 0, text: {
            en: "Repair broken bunds so the field keeps its water, and replant uprooted areas if the crop is still young.",
            si: "කුඹුරේ ජලය රැඳෙන සේ කැඩුණු නියර අලුත්වැඩියා කර, බෝගය තවම ළපටි නම් උදුරා දැමූ ස්ථාන නැවත සිටුවන්න.",
            ta: "வயலில் நீர் தங்க உடைந்த வரப்புகளைச் சரிசெய்து, பயிர் இன்னும் இளமையாக இருந்தால் பிடுங்கப்பட்ட இடங்களில் மீண்டும் நடுங்கள்." } },
        { day: 1, text: {
            en: "Guard the field at night from a watch hut with lights and noise. Do not go near the boar.",
            si: "ආලෝකය සහ ශබ්ද සමඟ පැල් පැලක සිට රාත්‍රියේ කුඹුර රකින්න. වල් ඌරන් ළඟට යන්න එපා.",
            ta: "வெளிச்சமும் சத்தமும் கொண்டு காவல் குடிசையிலிருந்து இரவில் வயலைக் காவல் செய்யுங்கள். பன்றிகளுக்கு அருகில் செல்ல வேண்டாம்." } },
        { day: 2, text: {
            en: "Meet neighbouring farmers to plan a shared fence or trench around the fields.",
            si: "කුඹුරු වටා පොදු වැටක් හෝ අගලක් සැලසුම් කිරීමට අසල්වැසි ගොවීන් හමුවන්න.",
            ta: "வயல்களைச் சுற்றிப் பொது வேலி அல்லது அகழி அமைக்கத் திட்டமிட அயல் விவசாயிகளைச் சந்தியுங்கள்." } },
        { day: 5, text: {
            en: "Clear the scrub along the field edge where the boar hide during the day.",
            si: "දිවා කාලයේ වල් ඌරන් සැඟවෙන කුඹුරු දාරයේ පඳුරු ඉවත් කරන්න.",
            ta: "பகலில் பன்றிகள் ஒளிந்திருக்கும் வயல் ஓரப் புதர்களை அகற்றுங்கள்." } },
        { day: 7, check: true, text: {
            en: "Check for new digging or flattened crop. Electric fences only if installed safely and approved by the authorities.",
            si: "අලුතින් හාරා දැමූ හෝ පොළොවට තද වූ බෝග ඇත්දැයි බලන්න. විදුලි වැට බලධාරීන්ගේ අනුමැතිය ඇතිව ආරක්ෂිතව සවි කළ ඒවා පමණි.",
            ta: "புதிதாகத் தோண்டப்பட்ட அல்லது அழுந்திய பயிர் உள்ளதா எனப் பாருங்கள். மின்வேலி அதிகாரிகளின் அனுமதியுடன் பாதுகாப்பாக அமைக்கப்பட்டால் மட்டும்." } }
    ],
    elephant: [
        { day: 0, text: {
            en: "Stay safe – do not go near the elephants. Report the raid to your local Department of Wildlife Conservation office.",
            si: "ආරක්ෂිතව සිටින්න – අලින් ළඟට යන්න එපා. ප්‍රහාරය ඔබේ ප්‍රදේශයේ වනජීවී සංරක්ෂණ දෙපාර්තමේන්තු කාර්යාලයට දන්වන්න.",
            ta: "பாதுகாப்பாக இருங்கள் – யானைகளுக்கு அருகில் செல்ல வேண்டாம். தாக்குதலை உங்கள் பகுதி வனஜீவராசிகள் பாதுகாப்புத் திணைக்கள அலுவலகத்துக்குத் தெரிவியுங்கள்." } },
        { day: 1, text: {
            en: "In daylight, take photos of the damage and the footprints. Use them to claim compensation at your local wildlife office, and to claim crop insurance if your crop is insured.",
            si: "දිවා කාලයේ හානියේ සහ පා සටහන්වල ඡායාරූප ගන්න. ප්‍රදේශයේ වනජීවී කාර්යාලයෙන් වන්දි ඉල්ලීමට සහ ඔබේ බෝගය රක්ෂණය කර ඇත්නම් රක්ෂණ හිමිකම් ඉල්ලීමට ඒවා භාවිත කරන්න.",
            ta: "பகலில் சேதத்தையும் கால்தடங்களையும் படம் எடுங்கள். உங்கள் பகுதி வனஜீவராசிகள் அலுவலகத்தில் இழப்பீடு கோரவும், பயிர் காப்புறுதி செய்யப்பட்டிருந்தால் காப்புறுதி கோரவும் அவற்றைப் பயன்படுத்துங்கள்." } },
        { day: 2, text: {
            en: "With neighbours, check the community electric fence and report any breaks to the authorities. Never repair or connect it yourself.",
            si: "අසල්වැසියන් සමඟ ප්‍රජා විදුලි වැට පරීක්ෂා කර කැඩීම් බලධාරීන්ට දන්වන්න. කිසි විටෙක එය ඔබම අලුත්වැඩියා කරන්න හෝ සම්බන්ධ කරන්න එපා.",
            ta: "அயலவர்களுடன் சமூக மின்வேலியைச் சோதித்து, உடைவுகளை அதிகாரிகளுக்குத் தெரிவியுங்கள். நீங்களே அதைச் சரிசெய்யவோ இணைக்கவோ வேண்டாம்." } },
        { day: 3, text: {
            en: "Plan to harvest the rest of the crop as soon as it is ready. Do not store paddy inside your house.",
            si: "ඉතිරි බෝගය සූදානම් වූ විගස අස්වනු නෙළීමට සැලසුම් කරන්න. වී නිවස ඇතුළේ ගබඩා නොකරන්න.",
            ta: "மீதமுள்ள பயிர் தயாரானதும் அறுவடை செய்யத் திட்டமிடுங்கள். நெல்லை வீட்டுக்குள் சேமிக்க வேண்டாம்." } },
        { day: 7, check: true, text: {
            en: "Check the field and fence. Keep watching from a safe hut with lights, never alone.",
            si: "කුඹුර සහ වැට පරීක්ෂා කරන්න. ආලෝකය සහිත ආරක්ෂිත පැලක සිට, කිසි විටෙක තනිව නොව, දිගටම බලාසිටින්න.",
            ta: "வயலையும் வேலியையும் சோதியுங்கள். வெளிச்சமுள்ள பாதுகாப்பான குடிசையிலிருந்து, ஒருபோதும் தனியாக இல்லாமல், தொடர்ந்து கவனியுங்கள்." } }
    ]
};
if (typeof TREATMENT_PLANS !== "undefined") Object.assign(TREATMENT_PLANS, PEST_PLANS);

/* Disease Library: insect damage cards */
Object.assign(translations.en, { filter_insect: "Insect damage", lib_pest_plan: "Treatment plan & alarms →" });
Object.assign(translations.si, { filter_insect: "කෘමි හානි", lib_pest_plan: "ප්‍රතිකාර සැලැස්ම සහ එලාම් →" });
Object.assign(translations.ta, { filter_insect: "பூச்சிச் சேதம்", lib_pest_plan: "சிகிச்சைத் திட்டமும் அலாரங்களும் →" });

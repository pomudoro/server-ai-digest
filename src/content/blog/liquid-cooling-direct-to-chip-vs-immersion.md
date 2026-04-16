---
title: 'Жидкостное охлаждение: direct-to-chip vs immersion'
description: 'Сравнение двух подходов к жидкостному охлаждению AI-серверов — direct-to-chip и immersion cooling: порог применимости, капекс, вендоры и реальная практика.'
pubDate: '2026-04-13'
tags: ['liquid-cooling', 'data-center', 'infrastructure', 'gpu-servers']
source: 'https://www.tomshardware.com/pc-components/cooling/the-data-center-cooling-state-of-play-2025-liquid-cooling-is-on-the-rise-thermal-density-demands-skyrocket-in-ai-data-centers-and-tsmc-leads-with-direct-to-silicon-solutions'
---

Один узел с 8 GPU Blackwell потребляет 14+ кВт. Стойка из таких узлов — 100+ кВт. Воздушное охлаждение физически не справляется с такой тепловой плотностью. Рынок liquid cooling удвоился в 2025 году и приближается к $3 млрд, а к 2029 прогнозируется $7 млрд (Dell'Oro Group). Разбираемся в двух основных подходах.

## Direct-to-chip (DTC)

Хладоноситель (обычно вода или водно-гликолевая смесь) подводится через трубки к холодным пластинам (cold plates), установленным непосредственно на GPU и CPU. Остальные компоненты — память, VRM, NVMe — продолжают охлаждаться воздухом.

DTC снимает 70–75% тепла из стойки жидкостью, оставшиеся 25–30% уходят через воздух. Поддерживает плотности 80–130 кВт на стойку. PUE — 1.05–1.15 (против 1.3–1.5 у воздуха). Современные cold plates от CoolIT и Accelsius справляются с тепловым потоком до 300 Вт/см² — достаточно для GPU с TDP 700–1000 Вт.

Инфраструктура: CDU (Coolant Distribution Unit) в ряду или на стойку, подвод холодной воды, мониторинг утечек. Вендоры: CoolIT, Vertiv (CoolChip CDU до 1350 кВт), Schneider Electric. NVIDIA и Vertiv совместно определили референсную архитектуру liquid cooling для стоек до 132 кВт.

**Главное преимущество DTC** — не требует перестройки дата-центра. Развёртывается пошагово, стойка за стойкой, с существующей инфраструктурой чиллеров.

## Immersion cooling

Весь сервер погружается в бак с диэлектрической жидкостью. Два варианта: однофазный (жидкость остаётся жидкой, циркулирует через теплообменник) и двухфазный (жидкость вскипает на горячих поверхностях, пар конденсируется).

Immersion снимает 100% тепла жидкостью — вентиляторов нет вообще. Поддерживает плотности 100–250+ кВт на бак. Двухфазные системы обеспечивают теплоотвод до 1500 Вт/см². Вендоры: GRC, Submer, Asperitas, LiquidCool Solutions.

**Но:** серверы требуют модификации или специальных форм-факторов, обслуживание сложнее (замена компонентов — извлечение из жидкости), диэлектрик стоит дорого, и не все OEM поддерживают immersion-конфигурации.

## Когда что выбирать

| Критерий | DTC | Immersion |
|---|---|---|
| Плотность | 80–130 кВт/стойка | 100–250+ кВт/бак |
| Переоборудование ДЦ | Минимальное | Существенное |
| Обслуживание | Привычное (hot-swap) | Сложнее |
| Удаление тепла | 70–75% жидкостью | 100% жидкостью |
| Вендорская поддержка | Широкая (Dell, Supermicro, HPE) | Ограниченная |

Google уже семь лет эксплуатирует liquid cooling на более чем 2000 TPU-подов. Microsoft с 2024 года переводит все новые ДЦ на замкнутый контур liquid cooling. Гиперскейлеры выбирают преимущественно DTC — он проще в развёртывании. Immersion пока занимает нишу сверхвысоких плотностей и специализированных HPC-площадок.

**Источники:**

- [Data Center Cooling State of Play 2025 — Tom's Hardware](https://www.tomshardware.com/pc-components/cooling/the-data-center-cooling-state-of-play-2025-liquid-cooling-is-on-the-rise-thermal-density-demands-skyrocket-in-ai-data-centers-and-tsmc-leads-with-direct-to-silicon-solutions)
- [Liquid Cooling for AI — Introl](https://introl.com/blog/liquid-cooling-ai-data-center-infrastructure-essential-2025)
- [Vertiv & NVIDIA Liquid Cooling Reference — Network World](https://www.networkworld.com/article/3578096/vertiv-and-nvidia-define-liquid-cooling-reference-architecture.html)
- [Data Center Liquid Cooling — IEEE Spectrum](https://spectrum.ieee.org/data-center-liquid-cooling)

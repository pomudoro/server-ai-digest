---
title: "Microsoft Azure первой из гиперскейлеров запустила стойку NVIDIA Vera Rubin NVL72"
description: "Azure сообщает о power-on первой production-стойки Vera Rubin NVL72: 36 Vera CPU и 72 Rubin GPU, NVLink 6 на ~260 ТБ/с, полностью жидкостное охлаждение. Обгоняет AWS, Google Cloud и OCI."
pubDate: "2026-04-20"
heroImage: "../../assets/digest/2026-04-20/microsoft-azure-first-vera-rubin-nvl72-powered-on.webp"
tags:
  [
    "microsoft",
    "azure",
    "nvidia",
    "vera-rubin",
    "nvl72",
    "rack-scale",
    "liquid-cooling",
    "hyperscaler",
  ]
source: "https://www.datacenterdynamics.com/en/news/microsoft-claims-to-be-first-hyperscaler-to-power-on-nvidia-vera-rubin-nvl72-system/"
---

Microsoft объявила, что Azure первой среди гиперскейлеров включила production-стойку NVIDIA Vera Rubin NVL72. AWS, Google Cloud и OCI тоже подтвердили развёртывание Vera Rubin во второй половине 2026, но Azure обогнала их в гонке за «первый power-on». Для нас это не просто маркетинговая галочка — это сигнал, что следующее поколение rack-scale AI-инфраструктуры реально вышло за пределы GTC-демо.

## Что в стойке

Vera Rubin NVL72 — это 36 Vera CPU (наследник Grace, ARM-архитектура) и 72 Rubin GPU (наследник Blackwell). Ключевые характеристики по данным NVIDIA:

- NVLink 6: около 260 ТБ/с scale-up bandwidth внутри стойки.
- ConnectX-9 SuperNIC: 1 600 Гбит/с scale-out на GPU.
- HBM4/HBM4e: более плотная память, более жёсткие тепловые окна.
- 100% жидкостное охлаждение, воздушных вариантов нет.
- Cable-free модульные tray-конструкции: NVIDIA заявляет сокращение времени монтажа с двух часов до пяти минут.

Против Blackwell NVIDIA обещает 5× инференс и 3,5× обучение. Цифры вендорские; реальные бенчмарки увидим ближе к массовым поставкам во второй половине 2026.

## Почему Azure оказалась первой

В блоге Azure Microsoft объясняет, что стойка встала в уже готовую инфраструктуру площадки Fairwater. Fairwater — это линейка региональных AI-суперфабрик Microsoft, которую проектировали именно под плотности следующего поколения:

- Переработанная архитектура стоек под bandwidth и топологию NVLink 6.
- Жидкостные контуры, CDU и высокоамперные busway, рассчитанные на ватт-плотность Vera Rubin.
- Pod exchange — быстросменные GPU-tray без перекабеляжа, чтобы не терять uptime при обслуживании.
- Cooling abstraction layer под HBM4 с его узкими термальными окнами.

По сути, Microsoft не делала retrofit — площадка изначально строилась с запасом под Rubin. Это снимает классическое узкое место, из-за которого конкуренты обычно застревают на первой стойке новой платформы: силовая, охлаждение и сеть доводятся параллельно с монтажом железа.

## Контекст рынка

За последние две недели накопилась плотная очередь на Vera Rubin: Nebius раскатывает крупную партию в рамках контракта с Meta на 27 млрд долларов, Nscale и Microsoft договариваются о кластере на 1,35 ГВт в Monarch Compute Campus (Западная Вирджиния), GMI Cloud заявил «значительную ёмкость» под суверенные AI-фабрики. CoreWeave, Lambda, Crusoe и Together.AI тоже в списке раннего доступа.

Первая боевая стойка у Microsoft — это ещё и сигнал производственной цепочке. Если Azure уже включает NVL72, значит, Rubin реально в серии, HBM4 у SK Hynix/Micron/Samsung вышел из ramp, а интеграторы научились собирать стойку с cable-free tray за разумное время. Для тех, кто планирует on-premise-кластеры следующего поколения, это тот момент, когда можно переставать смотреть на Rubin как на roadmap и начинать считать TCO.

---
title: "ASRock Rack на GTC 2026: жидкостные AI-серверы на NVIDIA Rubin NVL8 и Blackwell"
description: "ASRock Rack показала на GTC 2026 линейку DLC-систем: 2U/4U HGX Rubin NVL8, 44RU жидкостные стойки на 4U16X-TURIN2, MGX-серверы под RTX PRO 6000/4500 Blackwell и CPU-платформы на NVIDIA Vera."
pubDate: "2026-04-20"
heroImage: "../../assets/digest/2026-04-20/asrock-rack-rubin-nvl8-blackwell-dlc-gtc2026.webp"
tags:
  [
    "asrock-rack",
    "nvidia",
    "rubin",
    "nvl8",
    "blackwell",
    "rtx-pro",
    "liquid-cooling",
    "vera",
    "gtc-2026",
  ]
source: "https://www.storagereview.com/news/asrock-rack-unveils-liquid-cooled-ai-systems-built-around-nvidia-rubin-and-blackwell-at-gtc-2026"
---

ASRock Rack на NVIDIA GTC 2026 развернула полноценный портфель жидкостных AI-платформ. В одном анонсе — серверы под HGX Rubin NVL8, готовый 44RU-rack, MGX-узлы на RTX PRO Blackwell Server Edition и первые намёки на CPU-системы на архитектуре NVIDIA Vera. Для вендора, который раньше ассоциировался с нишевыми HPC-сборками, это заявка на мейнстрим enterprise AI.

## Rubin NVL8: 2U и 4U на HGX

В центре анонса — 2U16X-GNR2/DLC RUBIN и 4U16X-GNR2/DLC RUBIN на платформе NVIDIA HGX Rubin NVL8. Оба узла с direct liquid cooling (DLC), ориентированы на AI-фабрики и HPC-кластеры, где важна устойчивая производительность под длительной нагрузкой и предсказуемый тепловой режим.

В дополнение к node-level системам ASRock Rack показала готовый 44RU liquid-cooled rack с восемью 4U16X-TURIN2 внутри. Это rack-scale building block: заказчику не нужно самому проектировать CDU, manifold и распределение охлаждающей жидкости — стойка приезжает в сборе.

## Blackwell: MGX-платформы под RTX PRO

Для enterprise AI, обработки данных и визуальных вычислений показали две MGX-машины:

- **6UXGM-GNR2/DLC** — до 8 жидкостно-охлаждаемых NVIDIA RTX PRO 6000 Blackwell Server Edition. Акцент на плотность GPU и термоконтроль.
- **4UXGM-GNR2 CX8** — на RTX PRO 4500 Blackwell Server Edition. Более гибкая и менее прожорливая конфигурация, single-slot эффективность, сценарии AI, видео, аналитики.

RTX PRO 6000 Blackwell Server Edition — рабочая лошадка среднего сегмента: 96 ГБ GDDR7, PCIe Gen5, заметно дешевле, чем HGX-узлы с B200/B300. Восемь штук в 6U с жидкостным контуром — неплохой вариант под inference-фермы и визуализацию, где H100/H200 избыточны по цене.

## Vera: CPU-линейка в роадмапе

Отдельно анонсированы CPU-платформы на NVIDIA Vera — архитектуре, которая идёт в паре с Rubin. По словам ASRock Rack, Vera объединяет кастомные CPU-ядра, LPDDR5X-память и NVIDIA Scalable Coherency Fabric. Целевые сценарии — agentic AI и reinforcement learning на уровне дата-центра. Детали платформ не раскрыты, но сам факт включения CPU-узлов в анонс говорит, что ASRock Rack выстраивает стек не вокруг одних GPU, а вокруг всей связки Vera+Rubin.

## Что это значит

Главное в анонсе — не конкретные SKU, а сигнал. Liquid cooling у ASRock Rack перестал быть опцией «для избранных» и стал базовой конфигурацией по всему портфелю: от 4U-узла на RTX PRO до 44RU-стойки на Rubin. Плотности Rubin и Blackwell Ultra уже невозможно снять воздухом без компромиссов, и вендоры второго эшелона это признают в своих каталогах, а не только на конференциях.

Для покупателей on-prem это означает, что при планировании нового кластера пора закладывать CDU, manifold и rear-door heat exchanger в исходные требования к площадке, а не достраивать их задним числом.

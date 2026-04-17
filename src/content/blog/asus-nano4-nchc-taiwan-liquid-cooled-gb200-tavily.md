---
title: 'ASUS Nano4 в NCHC: первый в Тайване liquid-cooled GB200 NVL72'
description: 'Разбираем деплой ASUS Nano4 (Crystal 26) в National Center for High-performance Computing Taiwan: dual-compute архитектура HGX H200 + GB200 NVL72, direct liquid cooling и PUE 1.18.'
pubDate: '2026-04-16'
tags: ['asus', 'nvidia', 'gb200', 'nvl72', 'liquid-cooling', 'supercomputer']
source: 'https://www.asus.com/us/business/resources/news/enterprise-ai-liquid-cooling-solutions/'
---

ASUS совместно с National Center for High-performance Computing (NCHC) развернули в Тайване систему Nano4 (внутреннее название Crystal 26) — первый на острове AI-суперкомпьютер, полностью построенный на direct liquid cooling. Проект интересен не столько фактом использования GB200 NVL72 (их уже ставят по всему миру), сколько архитектурой и достигнутым PUE 1.18 на реальной, а не пилотной площадке. Разбираемся, что там под капотом.

## Dual-compute архитектура

Nano4 — не однородный кластер, а связка двух разных поколений NVIDIA:

- **NVIDIA HGX H200 cluster** — это уже работающее ядро на Hopper, оптимизированное под обучение LLM и классические HPC-нагрузки. H200 здесь выбран из-за 141 GB HBM3e на GPU, что критично для моделей с длинным контекстом и inference крупных LLM.
- **NVIDIA GB200 NVL72** — rack-scale система на Blackwell: 72 B200 GPU + 36 Grace CPU в одном NVLink-домене. 1.4 exaFLOPS FP4 inference и 720 PFLOPS FP8 обучения на одну стойку.

Идея разнести workload: GB200 NVL72 забирает тяжёлое обучение моделей в триллионы параметров, HGX H200 тащит остальное — inference в продакшне, файнтюнинг, deep learning, стандартный HPC. Такой сплит разумен с точки зрения utilization: не все задачи NCHC упираются в Blackwell, и держать весь кластер на GB200 — это over-provisioning.

## Охлаждение и PUE 1.18

Здесь главная инженерная история. NVL72 при полной нагрузке — это ~120 кВт на стойку, и воздух такую плотность не вытягивает физически. В Nano4 использован direct liquid cooling (DLC) по всему стеку: холодная пластина на GPU и CPU, коллектор в стойке, CDU в ряду.

PUE 1.18 — это серьёзно. Средний тайваньский корпоративный ДЦ болтается около 1.5–1.6, а гиперскейлеры с воздухом дают 1.3–1.4. 1.18 на liquid-cooled площадке с HPC-плотностью означает, что NCHC практически не тратит энергию на охлаждение — только на перекачку жидкости и небольшой остаточный воздушный контур для памяти, VRM и периферии.

## Роль ASUS

ASUS здесь не просто OEM с коробкой серверов. Компания заявлена как ответственная за design, engineering, deployment и optimisation всей площадки — включая интеграцию с Vertiv и Schneider Electric по power и cooling инфраструктуре. В портфеле для подобных развёртываний — несколько линеек:

- **XA NB3I-E12** — сервер на NVIDIA HGX B300 для масштабируемых AI-нагрузок.
- **ESC8000A-E13X** — MGX-платформа с NVIDIA ConnectX-8 SuperNIC для предельной GPU-to-GPU связности.
- **ESC8000A-E13P** — на RTX PRO 6000 Blackwell Server Edition, под data processing и визуальные AI-нагрузки.
- **XA VR721-E3** — флагман на NVIDIA Vera Rubin NVL72, 100% liquid-cooled, rack-scale, TDP до 227 кВт (MaxP) / 187 кВт (MaxQ). Это уже следующее поколение после GB200, но сам форм-фактор и cooling-подход — та же логика, что в Nano4.

Варианты cooling поддерживаются разные: D2C, in-row CDU, гибрид. В NCHC выбрали полную DLC-конфигурацию — потому что при плотности NVL72 компромиссы уже не окупаются.

## Зачем это NCHC

Целевые сценарии площадки — обучение крупных LLM, deep learning, advanced HPC. У ASUS с NCHC десятилетняя история: Taiwania 2 (2018), Forerunner 1, теперь Nano4. Для Тайваня это ещё и стратегический объект — локальная суверенная AI-инфраструктура, независимая от зарубежных облаков.

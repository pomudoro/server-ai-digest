---
title: 'HPE Cray GX240: блейд с 16 NVIDIA Vera CPU и 56 320 ARM-ядер на стойку'
description: 'HPE анонсировала на GTC 2026 компьют-блейд GX240 на NVIDIA Vera CPU — первое поколение ARM после Grace в линейке Cray. Разбираем цифры, заказчиков и сроки.'
pubDate: '2026-04-16'
tags: ['hpe', 'cray', 'nvidia', 'vera', 'supercomputing', 'arm']
source: 'https://www.hpe.com/us/en/newsroom/press-release/2026/03/hpe-unveils-next-generation-ai-factory-and-supercomputing-advancements-with-nvidia.html'
---

На GTC 2026 HPE показала HPE Cray Supercomputing GX240 — liquid-cooled компьют-блейд на NVIDIA Vera CPU. Это первая публично анонсированная платформа на Vera, следующем поколении ARM-процессоров NVIDIA после Grace, и HPE утверждает, что GX240 — одна из первых машин, где Vera поедет в серию. Доступность — 2027 год, и блейд замыкает портфель стоечной системы GX5000.

## Плотность: 640 Vera CPU и 56 320 Olympus-ядер на rack

Конфигурация, которую HPE выкатила в пресс-релизе, выглядит так. Один блейд — до 16 NVIDIA Vera CPU. По разбору Glenn K. Lockwood, это восемь узлов по два CPU (2P-конфигурация) на блейд. В стойку GX5000 влезает до 40 таких блейдов, итого 640 Vera CPU и 56 320 NVIDIA Olympus ARM-совместимых ядер на один rack.

Арифметика сходится: 56 320 / 640 = 88 ядер на CPU. Это больше, чем 72 Neoverse V2 у Grace, и NVIDIA, похоже, перешла на собственный custom-core «Olympus» вместо лицензированных Neoverse. Детали микроархитектуры Vera пока не раскрыты — ни про размер LPDDR5X/LPDDR6, ни про скорость NVLink-C2C нового поколения. Но сам факт плотности 56 тыс. ARM-ядер в стойке на direct liquid cooling — это ощутимый прыжок для классического HPC.

## Куда это целится

GX240 — не AI-factory-ускоритель в чистом виде. Это CPU-блейд, который HPE позиционирует под связки workflow: physics-based MOD/SIM, data-driven AI и quantum-mechanics-based QC, собранные в единый pipeline. То есть Vera CPU едет туда, где GPU не нужен на каждом узле — классика supercomputing и HPC-кластеров на ARM, только со стоечной плотностью AI-эпохи.

Заказчики, которых HPE назвала: Argonne National Laboratory, HLRS (Штутгарт), Hudson River Trading и KISTI (Корея). Для HRT — HFT-контора, которой нужна сырой CPU-throughput, — это показательный выбор: ARM-платформа уходит в продакшен не только в лабораториях, но и на торговых площадках.

## Как это соотносится с Vera Rubin NVL72

Параллельно с GX240 HPE анонсировала NVIDIA Vera Rubin NVL72 by HPE — rack-scale систему с Vera CPU плюс Rubin GPU, доступность декабрь 2026. То есть линейка расходится на два трека: Vera Rubin NVL72 — AI-factory с GPU-ускорителями, GX240 — чистый CPU-суперкомпьютинг на Vera без GPU на борту. Обе используют одну и ту же новую ARM-платформу NVIDIA, но под разные типы нагрузок.

Третий кусок анонса — NVIDIA Quantum-X800 InfiniBand в Cray GX5000, тоже 2027. Раньше GX5000 шёл с HPE Slingshot, теперь появляется опция на Quantum-X800 — свежий 800 Gb/s InfiniBand от NVIDIA. Для заказчиков, которым нужна совместимость с экосистемой NCCL и SHARP, это закрывает давний пробел.

Что мы пока не знаем: bandwidth NVLink-C2C у Vera, объём и тип памяти на CPU, TDP, реальную производительность на ядро. HPE придерживает эти цифры до ближе к запуску. Когда появятся — будет что сравнивать с Grace.

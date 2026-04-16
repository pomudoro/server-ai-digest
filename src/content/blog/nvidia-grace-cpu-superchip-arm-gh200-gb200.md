---
title: 'NVIDIA Grace: ARM-процессор, который убирает PCIe из уравнения'
description: 'Обзор NVIDIA Grace CPU — 72-ядерного ARM-процессора с LPDDR5X и NVLink-C2C, лежащего в основе суперчипов GH200 и GB200.'
pubDate: '2026-04-13'
tags: ['nvidia', 'grace', 'arm', 'cpu', 'nvlink', 'gh200', 'gb200']
source: 'https://www.nvidia.com/en-us/data-center/grace-cpu/'
---

В привычной архитектуре GPU-сервера CPU и GPU соединены через PCIe — и это бутылочное горлышко. PCIe 5.0 x16 даёт ~64 GB/s в каждую сторону, а при обработке данных для крупных моделей процессор постоянно гоняет тензоры туда-обратно. NVIDIA Grace — попытка убрать это ограничение, заменив PCIe на NVLink-C2C.

## Что внутри Grace

72 ядра Arm Neoverse V2 (Armv9.0-A), до 480 GB LPDDR5X с пропускной способностью 546 GB/s. TDP — 250 Вт. Внутренний интерконнект — Scalable Coherency Fabric (SCF) с бисекционной пропускной способностью 3.2 TB/s. Память LPDDR5X вместо DDR5 — осознанный выбор: в пять раз ниже энергопотребление на гигабайт при сопоставимой bandwidth.

Grace CPU Superchip — два Grace, объединённых через NVLink-C2C: 144 ядра, до 960 GB памяти. Но интереснее варианты с GPU.

## GH200 и GB200: CPU + GPU на одной подложке

**GH200 Grace Hopper** — Grace + H100 (или H200) GPU на одном суперчипе. NVLink-C2C обеспечивает 900 GB/s бидирекционально — это в 7 раз больше, чем PCIe 5.0. Суммарная когерентная память — 576 GB (96 GB HBM3 + 480 GB LPDDR5X) для варианта с H100, или до 624 GB с H200.

**GB200 Grace Blackwell** — следующее поколение: Grace + два B200 GPU. Тот же NVLink-C2C на 900 GB/s, но теперь с двумя GPU. Вариант GB200 NVL4 — два Grace и четыре B200 — объединённая когерентная память порядка 1.3 TB.

Масштаб: **GB200 NVL72** — стоечное решение из 36 Grace CPU и 72 B200 GPU с жидкостным охлаждением. 13.4 TB объединённой HBM3e, 130 TB/s суммарной пропускной способности через NVLink Switch, 1.44 ExaFLOPS FP4 на стойку.

## Где Grace выигрывает у x86

Когерентная память CPU-GPU — главное преимущество. Модели, которые не влезают в GPU-память целиком, могут бесшовно использовать LPDDR5X через NVLink-C2C без штрафа за PCIe-трансферы. Рекомендательные системы с огромными embedding-таблицами, графовые нейросети (GNN), препроцессинг данных в пайплайне обучения — всё это сценарии, где Grace показывает 1.4–2x преимущество.

Энергоэффективность: NVIDIA заявляет 2x performance/watt по сравнению с x86 в AI-нагрузках. Независимые тесты (Phoronix) подтверждают выигрыш по энергии, хотя по абсолютной производительности Grace конкурирует с AMD EPYC 9004 и Intel Xeon Emerald Rapids, не доминируя.

## Где x86 остаётся

Если GPU-память достаточна и когерентность CPU-GPU не критична — x86 привычнее, экосистема шире, софт проверен. Для стандартного инференса с моделями, полностью помещающимися в HBM, разница архитектуры CPU менее заметна. Плюс ARM-совместимость софтового стека пока требует проверки: базовые фреймворки (PyTorch, vLLM) работают, но custom-инструментарий может потребовать портирования.

**Источники:**

- [Grace CPU — NVIDIA](https://www.nvidia.com/en-us/data-center/grace-cpu/)
- [GB200 NVL72 — NVIDIA](https://www.nvidia.com/en-us/data-center/gb200-nvl72/)
- [Grace CPU Superchip Architecture — NVIDIA Developer Blog](https://developer.nvidia.com/blog/nvidia-grace-cpu-superchip-architecture-in-depth/)
- [GH200 Benchmarks — Phoronix](https://www.phoronix.com/review/nvidia-gh200-gptshop-benchmark)
